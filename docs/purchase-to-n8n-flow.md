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

Pelanggan yang membeli paket, mengisi detail meeting, dan mengunggah bukti pembayaran.

### Admin

Operator internal yang memverifikasi pembayaran dan memicu provisioning meeting.

### App Server

Aplikasi Next.js yang mengelola session, mutation data, route internal, dan callback integration.

### Supabase

Digunakan untuk auth, database, dan storage bukti pembayaran.

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

### `manual_payments`

Menyimpan bukti pembayaran manual.

Kolom penting:

1. `order_id`
2. `bank_name`
3. `account_name`
4. `transfer_amount`
5. `proof_file_path`
6. `status`
7. `admin_notes`

### `zoom_meetings`

Menyimpan hasil provisioning Zoom.

Kolom penting:

1. `order_id`
2. `provider`
3. `external_meeting_id`
4. `join_url`
5. `start_url`
6. `meeting_password`
7. `status`

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

1. `/api/storage/payment-proof/signed-upload`
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

1. menampilkan nominal transfer
2. menampilkan rekening tujuan
3. menyediakan area upload bukti pembayaran
4. mengarahkan user ke status pembayaran

### 5. Customer uploads payment proof

Alur upload bukti bayar direncanakan seperti berikut:

1. frontend meminta signed upload ke `/api/storage/payment-proof/signed-upload`
2. file diunggah ke `Supabase Storage`
3. aplikasi menyimpan row baru di `manual_payments`

Data minimal `manual_payments`:

1. `order_id`
2. `bank_name`
3. `account_name`
4. `transfer_amount`
5. `proof_file_path`
6. `status = submitted`

Setelah bukti bayar berhasil dikirim, order diperbarui menjadi:

1. `orders.status = payment_review`
2. `orders.payment_status = submitted`

### 6. Admin reviews payment

Admin membuka detail pembayaran dan melakukan review manual.

Kemungkinan hasil:

#### Approved

Jika pembayaran valid:

1. `manual_payments.status = approved`
2. `orders.payment_status = approved`
3. `orders.status = paid`
4. `orders.provisioning_status = queued`

#### Rejected

Jika pembayaran tidak valid:

1. `manual_payments.status = rejected`
2. `manual_payments.admin_notes` diisi alasan penolakan
3. `orders.payment_status = rejected`
4. `orders.status = rejected` atau tetap menunggu re-upload sesuai kebijakan operasional

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
2. menyimpan atau memperbarui `zoom_meetings`
3. memperbarui `orders.provisioning_status`
4. memperbarui `orders.status`
5. mencatat log inbound ke `webhook_logs`

### 10. Example callback payload from n8n

```json
{
  "order_id": "uuid-order",
  "order_code": "ORD-24001",
  "status": "success",
  "provider": "zoom",
  "external_meeting_id": "123456789",
  "join_url": "https://zoom.us/j/123456789",
  "start_url": "https://zoom.us/s/abcdef",
  "meeting_password": "abc123"
}
```

## Result Handling

### 11. If callback is successful

Jika provisioning berhasil:

1. upsert `zoom_meetings`
2. isi `external_meeting_id`
3. isi `join_url`
4. isi `start_url`
5. isi `meeting_password` bila ada
6. set `zoom_meetings.status = generated` atau `delivered`
7. set `orders.provisioning_status = success`
8. set `orders.status = completed`
9. update `webhook_logs.status = success`

### 12. If callback fails

Jika provisioning gagal:

1. buat atau update `zoom_meetings.status = failed`
2. set `orders.provisioning_status = failed`
3. `orders.status` tetap `processing` atau dipindahkan ke state gagal sesuai kebijakan
4. simpan pesan error di `webhook_logs.error_message`
5. update `webhook_logs.status = failed`

## State Transitions

### Order Status

Contoh alur normal:

1. `pending_payment`
2. `payment_review`
3. `paid`
4. `processing`
5. `completed`

Contoh alur gagal bayar:

1. `pending_payment`
2. `payment_review`
3. `rejected`

### Payment Status

Contoh alur normal:

1. `unpaid`
2. `submitted`
3. `approved`

Contoh alur gagal:

1. `unpaid`
2. `submitted`
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
  -> upload bukti pembayaran

App
  -> create manual_payments
  -> update order ke payment_review

Admin
  -> approve payment

App
  -> update payment + order state
  -> trigger /api/internal/orders/[orderId]/provision
  -> kirim payload ke n8n
  -> log outbound webhook

n8n
  -> create Zoom meeting
  -> callback ke /api/webhooks/n8n/provision

App
  -> simpan zoom_meetings
  -> update order provisioning state
  -> log inbound webhook

Customer
  -> lihat status dan link meeting di dashboard
```

## Security Notes

1. Route internal provisioning tidak boleh dapat dipanggil bebas dari browser publik.
2. Callback dari `n8n` harus dilindungi dengan secret atau signature.
3. User hanya boleh mengakses order miliknya sendiri melalui RLS.
4. File bukti bayar sebaiknya disimpan sebagai path internal, bukan URL publik permanen.
5. Semua mutation penting harus idempotent, terutama approval payment dan callback provisioning.

## Current Implementation Status

Status repository saat dokumen ini ditulis:

1. UI flow pembelian, pembayaran, status pembayaran, dan meeting sudah tersedia.
2. Schema database utama sudah tersedia di `supabase/schema.sql`.
3. Route integrasi berikut masih berupa placeholder:
   - `/api/storage/payment-proof/signed-upload`
   - `/api/internal/orders/[orderId]/provision`
   - `/api/webhooks/n8n/provision`
4. Integrasi nyata ke database, storage, dan `n8n` belum diimplementasikan.

## Suggested Implementation Order

1. Buat server action untuk create `orders` dan `meeting_requests`.
2. Implement signed upload bukti bayar ke storage.
3. Simpan `manual_payments` dan update state order.
4. Buat admin approval flow.
5. Implement trigger provisioning ke `n8n`.
6. Implement callback handler dari `n8n`.
7. Tampilkan `zoom_meetings.join_url` di dashboard user.
