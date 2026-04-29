# Payment Implementation Provider

Dokumen ini menjelaskan arah implementasi payment provider agar aplikasi tidak terkunci ke satu provider saja. Fokus utamanya adalah memindahkan desain dari field spesifik `Paydia` di `orders` menuju model payment yang provider-agnostic dan lebih cocok bila nanti memakai `Midtrans` atau provider lain.

## Tujuan

1. menghindari penambahan kolom baru di `orders` setiap kali ganti provider
2. menampung banyak channel pembayaran seperti QRIS, VA, redirect checkout, atau e-wallet
3. menjaga `orders` tetap menjadi sumber status bisnis utama
4. memisahkan data transaksi payment dari data order dan provisioning meeting

## Prinsip Desain

1. `orders` tetap menyimpan status ringkas untuk kebutuhan dashboard dan provisioning
2. detail transaksi provider disimpan di tabel baru `payments`
3. setiap webhook provider dicatat ke `webhook_logs`
4. provisioning hanya boleh berjalan bila payment valid
5. provider mapping dilakukan di layer aplikasi, bukan langsung dicampur ke domain order

## Tabel Yang Dipertahankan

### `orders`

Kolom yang tetap penting:

1. `id`
2. `user_id`
3. `product_id`
4. `order_code`
5. `status`
6. `payment_status`
7. `provisioning_status`
8. `payment_provider`
9. `total_amount`
10. `created_at`
11. `updated_at`

Catatan:

1. field `paydia_*` tidak perlu langsung dihapus agar histori lama tetap aman
2. field itu diperlakukan sebagai legacy setelah model `payments` dipakai penuh

### `webhook_logs`

Tetap dipakai untuk semua provider:

1. `source`
2. `event_type`
3. `direction`
4. `status`
5. `payload`
6. `response_payload`
7. `error_message`

## Tabel Baru

### `payments`

Tabel baru yang disarankan:

```sql
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  provider text not null,
  provider_transaction_id text,
  provider_reference_id text,
  provider_status text,
  payment_type text,
  snap_token text,
  redirect_url text,
  qr_string text,
  qr_url text,
  va_number text,
  bill_key text,
  biller_code text,
  expiry_at timestamptz,
  paid_at timestamptz,
  amount bigint not null check (amount >= 0),
  currency text not null default 'IDR',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);
```

Index minimum:

```sql
create index if not exists idx_payments_order_id on public.payments (order_id);
create index if not exists idx_payments_provider on public.payments (provider);
create index if not exists idx_payments_provider_status on public.payments (provider_status);
create index if not exists idx_payments_provider_transaction_id on public.payments (provider_transaction_id);
create index if not exists idx_payments_provider_reference_id on public.payments (provider_reference_id);
```

## Relasi Data

1. satu `orders` dapat memiliki banyak `payments`
2. satu `payments` dimiliki tepat satu `orders`
3. `orders` tetap menjadi sumber kebenaran status bisnis
4. `payments` menjadi sumber detail transaksi provider

## Flow Implementasi

### 1. Create Order

1. user membuat order seperti sekarang
2. row `orders` dibuat dengan `payment_status = unpaid`
3. row `meeting_requests` dibuat

### 2. Create Payment

1. user membuka halaman payment order
2. server membuat row `payments` baru dengan `provider = 'midtrans'` atau provider aktif lain
3. aplikasi memanggil API provider
4. response provider disimpan ke `payments.payload`
5. token, redirect URL, atau data QR/VA disimpan ke kolom yang relevan
6. `orders.payment_provider` diisi sesuai provider aktif
7. `orders.payment_status` diubah ke `pending` bila transaksi berhasil dibuat

### 3. Payment Update

1. provider mengirim webhook atau status diambil via inquiry
2. aplikasi mencari row `payments` berdasarkan reference provider
3. `payments.provider_status` diperbarui
4. `payments.paid_at` diisi bila payment sukses
5. `orders.payment_status` dan `orders.status` diperbarui lewat mapping internal

### 4. Provision Trigger

1. provisioning hanya jalan jika `orders.payment_status = approved`
2. provisioning tidak membaca detail provider langsung bila tidak perlu
3. route provisioning cukup membaca status order yang sudah dinormalisasi

## Midtrans Mapping

Jika provider yang dipakai adalah `Midtrans`, mapping awal yang disarankan:

### Response Create Transaction

1. `provider = 'midtrans'`
2. `provider_transaction_id = transaction_id` bila tersedia
3. `provider_reference_id = order_id`
4. `provider_status = transaction_status` atau state awal yang dikembalikan provider
5. `payment_type = payment_type`
6. `snap_token = token`
7. `redirect_url = redirect_url`
8. `payload = response body create transaction`

### Response QRIS atau Channel Spesifik

1. simpan QR string ke `qr_string`
2. simpan QR URL ke `qr_url` bila disediakan
3. simpan VA number ke `va_number` untuk bank transfer
4. simpan expiry ke `expiry_at` bila tersedia

## Mapping Status Internal

Mapping Midtrans ke status internal yang disarankan:

1. `capture` atau `settlement` -> `orders.payment_status = approved`, `orders.status = paid`
2. `pending` -> `orders.payment_status = pending`, `orders.status = pending_payment`
3. `deny` -> `orders.payment_status = rejected`, `orders.status = rejected`
4. `cancel` -> `orders.payment_status = rejected`, `orders.status = rejected`
5. `expire` -> sementara `orders.payment_status = rejected`, `orders.status = rejected`
6. `failure` -> `orders.payment_status = rejected`, `orders.status = rejected`

Catatan:

1. bila nanti ingin membedakan `expired` dari `rejected`, enum `payment_status` perlu ditambah
2. perubahan enum sebaiknya dilakukan terpisah agar migrasi lebih aman

## API Route Yang Disarankan

### User Flow

1. `POST /dashboard/orders/[orderCode]/payment`
   fungsi: membuat transaksi payment melalui provider aktif

2. `POST /dashboard/orders/[orderCode]/payment/refresh`
   fungsi: inquiry status payment bila webhook belum masuk

### Provider Webhook

1. `POST /api/webhooks/midtrans`
   fungsi: menerima notifikasi status dari Midtrans

### Internal

1. `POST /api/internal/orders/[orderId]/provision`
   fungsi: tetap sama, hanya boleh jalan saat payment valid

## Webhook Handling

Setiap webhook provider harus:

1. memverifikasi signature atau auth
2. mencari payment berdasarkan reference provider
3. idempotent terhadap duplicate delivery
4. update `payments`
5. update `orders`
6. catat ke `webhook_logs`

Contoh event `webhook_logs` untuk Midtrans:

1. `midtrans_payment_processed`
2. `midtrans_duplicate_delivery`
3. `midtrans_signature_invalid`
4. `midtrans_payment_not_found`
5. `midtrans_payment_update_failed`

## Environment Variables

Jika memakai `Midtrans`, env minimum yang disarankan:

1. `MIDTRANS_SERVER_KEY`
2. `MIDTRANS_CLIENT_KEY`
3. `MIDTRANS_IS_PRODUCTION`
4. `MIDTRANS_MERCHANT_ID` bila dibutuhkan oleh flow tertentu
5. `MIDTRANS_CALLBACK_URL` bila ingin eksplisit menyimpan callback origin

Catatan:

1. `SERVER_KEY` hanya untuk server-side
2. `CLIENT_KEY` bisa dipakai frontend bila memakai Snap client flow
3. sandbox dan production harus dipisah jelas

## Tahapan Migrasi Dari Paydia

### Tahap 1

1. tambahkan tabel `payments`
2. jangan hapus field `paydia_*`
3. implement provider baru di atas `payments`

### Tahap 2

1. halaman payment baca data dari `payments`
2. webhook baru update `payments` lalu sinkronkan ke `orders`
3. admin monitoring mulai membaca `payments` dan `webhook_logs`

### Tahap 3

1. field `paydia_*` ditandai legacy di docs
2. hanya dipakai untuk histori transaksi lama
3. cleanup schema dilakukan setelah data dan UI sudah stabil

## Checklist Implementasi

1. buat migration SQL untuk `payments`
2. buat helper provider-agnostic di `lib/payments.ts`
3. buat adapter provider baru, misalnya `lib/midtrans.ts`
4. update halaman payment agar baca sumber data dari `payments`
5. buat webhook route provider baru
6. tambahkan idempotency dan logging ke `webhook_logs`
7. jaga agar provisioning tetap hanya membaca status internal di `orders`
8. update docs PRD, ERD, dan progress bila provider aktif resmi berubah

## Rekomendasi Akhir

1. jangan lanjut menambah field spesifik provider di `orders`
2. gunakan `payments` sebagai fondasi untuk provider berikutnya
3. simpan status bisnis di `orders`, detail provider di `payments`
4. pindahkan ke `Midtrans` atau provider lain hanya setelah tabel `payments` siap
