# Purchase to n8n Flow

## Overview

Dokumen ini menjelaskan skema alur pembelian paket meeting dari sisi pelanggan sampai proses provisioning meeting dipicu ke `n8n` dan hasilnya dikembalikan ke aplikasi.

Dokumen ini disusun berdasarkan struktur route, schema database, dan desain integrasi yang sudah ada di repository saat ini.

## Goals

1. Menjelaskan alur data dari pembelian paket sampai meeting siap digunakan.
2. Menetapkan peran setiap komponen: user, admin, app server, Supabase, dan `n8n`.
3. Menjadi acuan implementasi API, server action, dan update status database.
4. Menyamakan pemahaman sebelum integrasi end-to-end dibangun.

## Main Actors

### Customer

Pelanggan yang membeli paket, mengisi detail meeting, lalu menyelesaikan pembayaran.

### Admin

Operator internal yang memantau pembayaran dan memicu provisioning meeting.

### App Server

Aplikasi Next.js yang mengelola session, mutation data, route internal, dan callback integration.

### Supabase

Digunakan untuk auth dan database aplikasi.

### n8n

Automation layer yang menerima trigger provisioning, membuat meeting Zoom, lalu mengirim callback hasil provisioning.

### Zoom

Provider meeting yang menghasilkan `join_url`, `start_url`, dan informasi meeting lainnya.

## Source of Truth

Database aplikasi di `Supabase Postgres` tetap menjadi source of truth utama.

`n8n` hanya bertindak sebagai automation layer untuk provisioning Zoom dan pengiriman hasil kembali ke aplikasi.

## Main Entities

### `products`

Menyimpan paket yang dapat dibeli pelanggan.

Kolom penting:

1. `id`
2. `name`
3. `slug`
4. `price`
5. `duration_minutes`
6. `participant_limit`
7. `is_active`

### `orders`

Entitas utama transaksi pelanggan.

Kolom penting:

1. `id`
2. `user_id`
3. `product_id`
4. `order_code`
5. `status`
6. `payment_status`
7. `provisioning_status`
8. `total_amount`

### `meeting_requests`

Menyimpan detail meeting yang diminta pelanggan.

Kolom penting:

1. `order_id`
2. `agenda`
3. `meeting_date`
4. `start_time`
5. `duration_minutes`
6. `timezone`
7. `notes`

### payment fields on `orders`

Menyimpan data transaksi `Paydia` langsung pada order.

Kolom penting:

1. `payment_provider`
2. `paydia_reference_no`
3. `paydia_partner_reference_no`
4. `paydia_qr_content`
5. `paydia_status`
6. `paydia_status_desc`
7. `paydia_paid_at`

### `meeting`

Menyimpan hasil provisioning Zoom.

Kolom penting:

1. `order_id`
2. `meeting_id`
3. `join_url`
4. `start_url`
5. `password`
6. `status`

### `webhook_logs`

Menyimpan audit trail webhook keluar dan callback masuk.

Kolom penting:

1. `order_id`
2. `source`
3. `event_type`
4. `direction`
5. `status`
6. `payload`
7. `response_payload`
8. `error_message`

## Related Routes

### User Flow Routes

1. `/dashboard/orders/new`
2. `/dashboard/orders/[orderCode]/payment`
3. `/dashboard/orders/[orderCode]`
4. `/dashboard/orders/[orderCode]/meeting`

### Integration Routes

2. `/api/internal/orders/[orderId]/provision`
3. `/api/webhooks/n8n/provision`

## End-to-End Flow

### 1. Customer selects package

Pelanggan memilih paket meeting yang aktif.

Data yang dibutuhkan:

1. `product_id`
2. `price`
3. `duration_minutes`
4. `participant_limit`

Hasil:

1. UI menyiapkan form pembelian.
2. Produk yang dipilih akan menjadi dasar pembuatan `orders`.

### 2. Customer fills meeting form

Pelanggan mengisi detail meeting di halaman `Beli Paket`.

Field minimum:

1. `topik` atau `agenda`
2. `durasi`
3. `timezone`
4. `start_time`

Catatan implementasi:

1. Pada level database saat ini, waktu meeting tersimpan sebagai `meeting_date` dan `start_time` terpisah.
2. Nilai `start_time` dari UI perlu dipecah saat disimpan.
3. `durasi` dari UI perlu dipetakan ke `duration_minutes`.

### 3. App creates order and meeting request

Saat user submit form pembelian, aplikasi membuat:

1. satu row `orders`
2. satu row `meeting_requests`

State awal order:

1. `orders.status = pending_payment`
2. `orders.payment_status = unpaid`
3. `orders.provisioning_status = not_started`

Data yang ditulis ke `orders`:

1. `user_id`
2. `product_id`
3. `order_code`
4. `total_amount`

Data yang ditulis ke `meeting_requests`:

1. `order_id`
2. `agenda`
3. `meeting_date`
4. `start_time`
5. `duration_minutes`
6. `timezone`

### 4. Customer opens payment page

Setelah order dibuat, user diarahkan ke halaman pembayaran.

Tujuan halaman ini:

1. menampilkan nominal pembayaran
2. menampilkan QRIS yang harus discan
3. menampilkan status transaksi `Paydia`
4. mengarahkan user ke status pembayaran

### 5. Customer completes Paydia payment

Alur pembayaran direncanakan seperti berikut:

1. frontend atau server action membuat transaksi `Paydia`
2. aplikasi menyimpan referensi transaksi dan QRIS ke `orders`
3. pelanggan melakukan scan dan menyelesaikan pembayaran di provider

Setelah transaksi dibuat, order diperbarui menjadi:

1. `orders.payment_status = pending`
2. `orders.status` tetap pada state menunggu pembayaran sampai ada konfirmasi

### 6. App syncs payment status

Aplikasi memperbarui status pembayaran melalui webhook atau inquiry ke `Paydia`.

Kemungkinan hasil:

#### Approved

Jika pembayaran valid:

1. `orders.payment_status = approved`
2. `orders.status = paid`
3. `orders.provisioning_status = queued` atau tetap `not_started` sampai trigger dijalankan

#### Failed or expired

Jika pembayaran tidak valid, gagal, atau kadaluarsa:

1. `orders.payment_status` mengikuti mapping status provider
2. `orders.status` kembali ke state yang sesuai untuk retry atau dinyatakan gagal sesuai kebijakan operasional

## Provisioning Trigger to n8n

### 7. App triggers provisioning route

Setelah payment approved, aplikasi memanggil route internal:

`/api/internal/orders/[orderId]/provision`

Tujuan route ini:

1. mengambil data order terkait
2. mengambil data customer, product, dan meeting request
3. membangun payload terstandar ke `n8n`
4. mencatat log outbound ke `webhook_logs`
5. mengubah status provisioning menjadi sedang diproses

State saat trigger provisioning dimulai:

1. `orders.status = processing`
2. `orders.provisioning_status = processing`

Log yang dicatat di `webhook_logs`:

1. `order_id`
2. `source = n8n`
3. `event_type = provision_request`
4. `direction = outbound`
5. `status = pending`
6. `payload = request body ke n8n`

### 8. Example outbound payload to n8n

```json
{
  "order_id": "uuid-order",
  "order_code": "ORD-24001",
  "customer": {
    "user_id": "uuid-user",
    "full_name": "Nama User",
    "email": "user@example.com"
  },
  "product": {
    "id": "uuid-product",
    "name": "Zoom Harian",
    "price": 6000,
    "duration_minutes": 60,
    "participant_limit": 100
  },
  "meeting_request": {
    "agenda": "Kelas privat bahasa Inggris",
    "meeting_date": "2026-04-24",
    "start_time": "19:00:00",
    "timezone": "Asia/Jakarta",
    "duration_minutes": 60
  }
}
```

## Callback from n8n

### 9. n8n sends callback back to app

Setelah workflow `n8n` selesai membuat meeting Zoom, `n8n` mengirim callback ke:

`/api/webhooks/n8n/provision`

Tujuan route callback:

1. menerima hasil provisioning
2. menyimpan atau memperbarui `meeting`
3. memperbarui `orders.provisioning_status`
4. memperbarui `orders.status`
5. mencatat log inbound ke `webhook_logs`

### 10. Example callback payload from n8n

```json
{
  "order_id": "uuid-order",
  "order_code": "ORD-24001",
  "status": "success",
  "meeting_id": "123456789",
  "join_url": "https://zoom.us/j/123456789",
  "start_url": "https://zoom.us/s/abcdef",
  "password": "abc123"
}
```

## Result Handling

### 11. If callback is successful

Jika provisioning berhasil:

1. upsert `meeting`
2. isi `meeting_id`
3. isi `join_url`
4. isi `start_url`
5. isi `password` bila ada
6. set `meeting.status` sesuai status meeting yang disepakati aplikasi
7. set `orders.provisioning_status = success`
8. set `orders.status = completed`
9. update `webhook_logs.status = success`

### 12. If callback fails

Jika provisioning gagal:

1. buat atau update `meeting.status` ke nilai gagal atau terminal yang disepakati aplikasi
2. set `orders.provisioning_status = failed`
3. `orders.status` tetap `processing` atau dipindahkan ke state gagal sesuai kebijakan
4. simpan pesan error di `webhook_logs.error_message`
5. update `webhook_logs.status = failed`

## State Transitions

### Order Status

Contoh alur normal:

1. `pending_payment`
2. `paid`
3. `processing`
4. `completed`

Contoh alur gagal bayar:

1. `pending_payment`
2. `rejected`

### Payment Status

Contoh alur normal:

1. `unpaid`
2. `pending`
3. `approved`

Contoh alur gagal:

1. `unpaid`
2. `pending`
3. `rejected`

### Provisioning Status

Contoh alur normal:

1. `not_started`
2. `queued`
3. `processing`
4. `success`

Contoh alur gagal:

1. `not_started`
2. `queued`
3. `processing`
4. `failed`

## Sequence Summary

```text
Customer
  -> pilih paket
  -> isi detail meeting
  -> submit order

App
  -> create orders
  -> create meeting_requests
  -> tampilkan halaman pembayaran

Customer
  -> scan QRIS dan bayar lewat provider

App
  -> simpan referensi transaksi Paydia
  -> update status payment dari webhook atau inquiry

App
  -> update payment + order state
  -> trigger /api/internal/orders/[orderId]/provision
  -> kirim payload ke n8n
  -> log outbound webhook

n8n
  -> create Zoom meeting
  -> callback ke /api/webhooks/n8n/provision

App
  -> simpan meeting
  -> update order provisioning state
  -> log inbound webhook

Customer
  -> lihat status dan link meeting di dashboard
```

## Security Notes

1. Route internal provisioning tidak boleh dapat dipanggil bebas dari browser publik.
2. Callback dari `n8n` harus dilindungi dengan secret atau signature.
3. User hanya boleh mengakses order miliknya sendiri melalui RLS.
4. Semua mutation penting harus idempotent, terutama sinkronisasi payment dan callback provisioning.

## Current Implementation Status

Status repository saat dokumen ini ditulis:

1. UI flow pembelian, pembayaran, status pembayaran, dan meeting sudah tersedia.
2. Schema database utama sudah tersedia di `supabase/schema.sql`.
3. Route integrasi provisioning ke `n8n` masih berupa placeholder:
   - `/api/internal/orders/[orderId]/provision`
   - `/api/webhooks/n8n/provision`
4. Integrasi nyata ke `Paydia` untuk payment sudah berjalan, sedangkan integrasi `n8n` belum final.

## Suggested Implementation Order

1. Buat server action untuk create `orders` dan `meeting_requests`.
2. Finalkan sinkronisasi status payment `Paydia`.
3. Buat admin monitoring flow.
4. Implement trigger provisioning ke `n8n`.
5. Implement callback handler dari `n8n`.
6. Tampilkan `meeting.join_url` di dashboard user.
