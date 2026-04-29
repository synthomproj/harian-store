# Progress

## Phase 1: Order Creation

### Status

- [x] Selesai

### Checklist

- [x] Form beli paket tersambung ke database
- [x] Order detail dan payment page menerima data order nyata
- [x] Error handling untuk validasi form dasar

## Phase 2: Paydia Payment Integration

### Status

- [~] Sedang berjalan

### Checklist

- [x] Finalkan kontrak integrasi `Paydia` untuk `SNAP QRIS MPM`
- [x] Konfirmasi ketersediaan library resmi `Paydia` untuk PHP dan Node
- [x] Putuskan apakah implementasi memakai `paydia-snap-node` atau helper internal di project
- [x] Tentukan endpoint create transaction, callback atau webhook, auth header, signature verification, expiry, dan status mapping
- [x] Tentukan source of truth status internal antara `orders.payment_status` dan `orders.paydia_status`
- [x] Jalankan migration `supabase/paydia-orders-migration.sql`
- [x] Verifikasi kolom `orders` untuk field `Paydia SNAP QRIS` yang dibutuhkan order
- [x] Verifikasi enum `payment_status` sudah memiliki `pending`
- [x] Update type dan query `orders` di `lib/orders.ts` agar membaca field `Paydia`
- [x] Tentukan field yang ditampilkan ke user dan field yang hanya dipakai untuk audit atau debug
- [x] Buat route server untuk create QRIS ke `Paydia`
- [x] Validasi order milik user aktif sebelum create transaction
- [x] Kirim request create QRIS ke `Paydia`
- [x] Simpan response penting `Paydia` ke `orders`
- [x] Set `payment_provider = 'paydia'`
- [x] Set `payment_status` ke `pending` atau status internal final yang disepakati
- [x] Ubah halaman payment user dari flow lama ke `Paydia SNAP QRIS`
- [x] Tampilkan nominal, status pembayaran, expiry, dan data QRIS
- [x] Tampilkan state jika QRIS belum ada, expired, atau gagal dibuat
- [x] Tampilkan status terbaru dari `orders.paydia_status` dan `orders.payment_status`
- [x] Tampilkan QRIS dalam bentuk gambar yang bisa discan user
- [x] Buat endpoint webhook atau callback `Paydia`
- [x] Verifikasi signature atau auth webhook
- [x] Cari order berdasarkan reference transaksi `Paydia`
- [x] Update `orders.paydia_status`, `paydia_paid_at`, dan `paydia_payload`
- [x] Mapping status berhasil ke `orders.payment_status = approved`
- [x] Mapping status gagal, expired, atau cancel sesuai aturan bisnis
- [x] Saat payment confirmed, ubah `orders.status` ke `paid`
- [x] Pastikan provisioning belum berjalan sebelum payment valid
- [x] Pastikan repeat webhook tetap idempotent
- [x] Simpan payload penting create transaction dan webhook untuk audit atau debug di `orders.paydia_payload`
- [x] Putuskan inbound webhook juga dicatat ke `webhook_logs`
- [x] Siapkan status inquiry sebagai fallback jika webhook belum diterima
- [x] Simpan credential `Paydia` di environment variables
- [x] Tambahkan env SNAP QRIS yang masih kurang seperti `PAYDIA_CHANNEL_ID`, `PAYDIA_CALLBACK_URL`, dan `PAYDIA_PUBLIC_KEY`
- [x] Pastikan route create transaction tidak bisa dipakai untuk order milik user lain
- [x] Pastikan webhook tidak bisa dipalsukan
- [ ] Test create transaction sukses
- [ ] Test create transaction gagal dari provider
- [ ] Test status inquiry sukses
- [ ] Test status inquiry untuk transaksi yang belum dibayar atau tidak ditemukan
- [ ] Test webhook success
- [ ] Test webhook duplicate delivery
- [ ] Test webhook untuk transaksi atau order yang tidak ditemukan
- [ ] Test UI payment untuk status `unpaid`, `pending`, `approved`, `rejected`, atau `expired` jika dipakai
- [x] Audit referensi flow pembayaran lama di UI, docs, dan API
- [x] Hapus referensi `manual_payments` dari dokumen aktif MVP
- [x] Update dokumen phase jika flow final `Paydia` berubah

## Phase 3: User Order and Meeting Read Model

### Status

- [~] Sedang berjalan

### Checklist

- [x] Halaman `Meeting` membaca order milik user aktif
- [ ] Pisahkan data menjadi meeting akan datang dan meeting selesai
- [x] Halaman status pembayaran membaca data order dan payment terbaru
- [x] Halaman detail meeting membaca data `meeting`
- [x] Tampilkan state kosong yang benar jika data belum tersedia

## Phase 4: Admin Payment Operations

### Status

- [ ] Belum mulai

### Checklist

- [ ] Tampilkan daftar order dan payment yang perlu dipantau di admin
- [ ] Tampilkan detail status `Paydia` per order
- [ ] Tampilkan payload penting untuk audit operasional
- [ ] Siapkan action operasional seperti refresh status atau retry step internal
- [ ] Update state pembayaran
- [ ] Update state order

## Phase 5: Provision Trigger to `n8n`

### Status

- [~] Scaffold tersedia

### Checklist

- [x] Implement scaffold `/api/internal/orders/[orderId]/provision`
- [ ] Ambil data order lengkap dari database
- [ ] Bangun payload standar ke `n8n`
- [ ] Kirim request outbound ke endpoint `n8n`
- [ ] Catat request ke `webhook_logs`
- [ ] Update status provisioning menjadi `processing`
- [ ] Siapkan proteksi route internal

## Phase 6: Provision Result Webhook and Final User Experience

### Status

- [~] Scaffold tersedia

### Checklist

- [x] Terima scaffold hasil provisioning dari webhook
- [ ] Simpan hasil provisioning ke database
- [ ] Update status order dan meeting sesuai hasil provisioning
- [ ] Tampilkan hasil final ke user dashboard
- [ ] Rapikan end-to-end user experience setelah payment dan provisioning selesai
