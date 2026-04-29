# Paydia Phase 2 Verification

Dokumen ini dipakai untuk verifikasi manual checklist Phase 2: Paydia Payment Integration.

## Prasyarat

1. Branch aktif: `feat/paydia-phase-2`
2. Environment variable sudah terisi di `.env`
3. Schema database terbaru sudah terpasang
4. Ada minimal satu user login yang punya order `pending_payment`
5. Ada credential `Paydia` sandbox atau production yang valid

## Startup Check

1. Jalankan `npm run lint`
2. Jalankan `npm run build`
3. Jalankan `npm run dev`
4. Login sebagai user biasa

## Checklist Verifikasi

### 1. Create transaction sukses

1. Buka `/dashboard/orders/[orderCode]/payment` untuk order milik user aktif
2. Klik tombol buat QRIS
3. Pastikan UI menampilkan QR code
4. Pastikan `orders` ter-update:
   - `payment_provider = 'paydia'`
   - `payment_status = 'pending'`
   - `status = 'pending_payment'`
   - `paydia_partner_reference_no` terisi
   - `paydia_reference_no` terisi bila provider mengembalikan nilai
   - `paydia_qr_content` terisi
   - `paydia_payload` terisi

### 2. Create transaction gagal dari provider

1. Ubah sementara satu credential `Paydia` menjadi tidak valid
2. Ulangi create QRIS untuk order baru
3. Pastikan user melihat pesan gagal
4. Pastikan row `orders` tidak berubah ke state payment sukses palsu
5. Kembalikan credential ke nilai valid

### 3. Inquiry status sukses

1. Gunakan order yang sudah punya QRIS
2. Klik refresh status pembayaran
3. Pastikan request inquiry berhasil
4. Pastikan `orders.paydia_status` dan `orders.payment_status` ikut ter-update sesuai response
5. Pastikan halaman payment dan detail order ikut menampilkan status terbaru

### 4. Inquiry untuk transaksi belum dibayar atau tidak ditemukan

1. Coba refresh status untuk QRIS yang belum dibayar
2. Pastikan state tetap konsisten dan tidak berubah ke `approved`
3. Uji satu order dengan reference yang sengaja tidak valid di database sandbox
4. Pastikan user menerima error yang jelas

### 5. Webhook success

1. Selesaikan pembayaran dari QRIS sandbox bila provider mendukung
2. Pastikan callback masuk ke `/api/webhooks/paydia/qris`
3. Pastikan `orders` berubah ke:
   - `payment_status = 'approved'`
   - `status = 'paid'`
   - `paydia_paid_at` terisi bila provider mengirim timestamp
4. Pastikan ada row baru di `webhook_logs` dengan:
   - `source = 'paydia'`
   - `direction = 'inbound'`
   - `event_type = 'paydia_qris_processed'`
   - `status = 'success'`

### 6. Webhook duplicate delivery

1. Kirim ulang payload webhook yang sama
2. Pastikan response tetap sukses
3. Pastikan order tidak berubah state secara tidak perlu
4. Pastikan `webhook_logs` mencatat event `paydia_qris_duplicate_delivery`

### 7. Webhook untuk order tidak ditemukan

1. Kirim payload valid dengan reference transaksi yang tidak terhubung ke order mana pun
2. Pastikan endpoint membalas `404`
3. Pastikan `webhook_logs` mencatat event `paydia_qris_order_not_found`

### 8. Webhook dengan signature salah

1. Kirim payload ke endpoint webhook dengan signature yang salah
2. Pastikan endpoint membalas `401`
3. Pastikan `webhook_logs` mencatat event `paydia_qris_invalid_signature`

### 9. Guard provisioning sebelum payment valid

1. Panggil `/api/internal/orders/[orderId]/provision` untuk order `pending_payment`
2. Pastikan endpoint membalas `409`
3. Pastikan provisioning hanya lolos untuk order dengan:
   - `payment_status = 'approved'`
   - `status = 'paid'`

### 10. Access control create transaction

1. Login sebagai user A
2. Ambil `order_id` milik user B
3. Submit form create payment memakai `order_id` tersebut
4. Pastikan action gagal dengan pesan order tidak ditemukan atau tidak bisa diakses

## Query Bantu

### Cek order terbaru

```sql
select
  id,
  order_code,
  status,
  payment_status,
  provisioning_status,
  payment_provider,
  paydia_partner_reference_no,
  paydia_reference_no,
  paydia_status,
  paydia_status_desc,
  paydia_paid_at,
  updated_at
from public.orders
order by updated_at desc
limit 20;
```

### Cek webhook logs Paydia

```sql
select
  id,
  order_id,
  source,
  event_type,
  direction,
  status,
  error_message,
  created_at
from public.webhook_logs
where source = 'paydia'
order by created_at desc
limit 50;
```

## Status Checklist Phase 2 Yang Sudah Tercover Implementasi

1. route create transaction dibatasi ke order milik user aktif
2. webhook signature diverifikasi
3. webhook duplicate delivery ditangani
4. inbound webhook dicatat ke `webhook_logs`
5. provisioning diblok sebelum payment valid

## Checklist Yang Masih Menunggu Eksekusi Manual

1. create transaction sukses
2. create transaction gagal dari provider
3. inquiry status sukses
4. inquiry untuk transaksi belum dibayar atau tidak ditemukan
5. webhook success
6. webhook duplicate delivery
7. webhook untuk order tidak ditemukan
8. UI payment untuk semua state yang dipakai
