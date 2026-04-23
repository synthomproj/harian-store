# Implementation Phases

## Overview

Dokumen ini membagi pekerjaan implementasi Harian Store ke beberapa phase yang berurutan.

Tujuannya adalah:

1. memastikan alur dibangun dari fondasi paling dasar
2. mengurangi risiko perubahan besar di tengah jalan
3. memudahkan validasi per milestone
4. menjaga integrasi `Supabase`, admin review, dan `n8n` tetap terstruktur

Dokumen ini mengikuti urutan implementasi yang sudah dirumuskan di `docs/purchase-to-n8n-flow.md`.

## Guiding Principles

1. Kerjakan dari alur inti yang paling dekat ke data utama.
2. UI yang sudah ada dijadikan shell, lalu dihubungkan ke data nyata sedikit demi sedikit.
3. Setiap phase harus menghasilkan flow yang lebih lengkap dan bisa diuji.
4. Perubahan state order, payment, dan provisioning harus selalu konsisten.
5. Integrasi eksternal ke `n8n` dilakukan setelah data internal dan admin flow stabil.

## Phase 0: Foundation Check

### Goal

Memastikan fondasi data, auth, dan route dasar sudah siap dipakai untuk implementasi flow transaksi.

### Current Status

Yang sudah tersedia saat ini:

1. auth user dan admin berbasis Supabase session
2. schema utama di `supabase/schema.sql`
3. UI dashboard user dan admin
4. UI flow beli paket, pembayaran, status pembayaran, dan meeting
5. placeholder route untuk signed upload, provisioning trigger, dan callback `n8n`

### Output

1. fondasi siap untuk mulai menghubungkan UI ke data nyata
2. dokumen flow dan phase tersedia sebagai acuan kerja

## Phase 1: Order Creation

### Goal

Menghubungkan halaman `Beli Paket` ke database agar user bisa benar-benar membuat order dan meeting request.

### Scope

1. buat server action untuk submit form pembelian
2. validasi field:
   - `topik`
   - `durasi`
   - `timezone`
   - `start_time`
3. mapping `start_time` UI menjadi `meeting_date` dan `start_time`
4. mapping `durasi` UI ke `duration_minutes`
5. ambil `product_id` dari paket aktif yang dipilih
6. generate `order_code`
7. create row `orders`
8. create row `meeting_requests`
9. redirect ke halaman pembayaran order yang baru dibuat

### Main Tables

1. `orders`
2. `meeting_requests`
3. `products`

### Expected State After Phase

Order baru harus memiliki state:

1. `orders.status = pending_payment`
2. `orders.payment_status = unpaid`
3. `orders.provisioning_status = not_started`

### Deliverables

1. form beli paket tersambung ke database
2. order detail dan payment page menerima data order nyata
3. error handling untuk validasi form dasar

### Dependencies

1. user login
2. product aktif tersedia di database
3. profile user tersedia

## Phase 2: Payment Proof Upload

### Goal

Membangun alur upload bukti pembayaran dan menyimpan data payment submission ke database.

### Scope

1. implement route `/api/storage/payment-proof/signed-upload`
2. generate signed upload untuk file bukti pembayaran
3. upload file ke `Supabase Storage`
4. simpan row ke `manual_payments`
5. simpan `proof_file_path`
6. update state order setelah bukti bayar dikirim
7. tampilkan riwayat submit pembayaran di halaman payment bila diperlukan

### Main Tables

1. `manual_payments`
2. `orders`

### Expected State After Phase

Setelah upload bukti bayar berhasil:

1. `manual_payments.status = submitted`
2. `orders.status = payment_review`
3. `orders.payment_status = submitted`

### Deliverables

1. upload bukti bayar berjalan end-to-end
2. payment page membaca data payment nyata
3. status pembayaran user berubah setelah submit

### Dependencies

1. Phase 1 selesai
2. bucket storage sudah siap

## Phase 3: User Order and Meeting Read Model

### Goal

Menampilkan data nyata order, payment, dan meeting di dashboard user.

### Scope

1. halaman `Meeting` membaca order milik user aktif
2. pisahkan data menjadi meeting akan datang dan meeting selesai
3. halaman status pembayaran membaca data order dan payment terbaru
4. halaman detail meeting membaca data `zoom_meetings`
5. tampilkan state kosong yang benar jika data belum tersedia

### Main Tables

1. `orders`
2. `meeting_requests`
3. `manual_payments`
4. `zoom_meetings`

### Deliverables

1. dashboard user tidak lagi memakai dummy data
2. user bisa memantau order miliknya sendiri
3. UI sudah siap dipakai untuk phase approval dan provisioning

### Dependencies

1. Phase 1 selesai
2. idealnya Phase 2 selesai agar payment status sudah realistis

## Phase 4: Admin Payment Review

### Goal

Membangun alur admin untuk memeriksa, menyetujui, atau menolak pembayaran.

### Scope

1. tampilkan daftar payment yang perlu direview di admin
2. tampilkan detail bukti bayar per order
3. buat action approve payment
4. buat action reject payment
5. simpan `admin_notes` saat reject
6. update state `manual_payments`
7. update state `orders`

### Main Tables

1. `manual_payments`
2. `orders`
3. `profiles`

### Expected State After Phase

Jika approved:

1. `manual_payments.status = approved`
2. `orders.payment_status = approved`
3. `orders.status = paid`
4. `orders.provisioning_status = queued`

Jika rejected:

1. `manual_payments.status = rejected`
2. `orders.payment_status = rejected`
3. `orders.status = rejected` atau tetap menunggu pembayaran ulang sesuai keputusan produk

### Deliverables

1. admin bisa melakukan review pembayaran dari panel admin
2. state order dan payment berubah sesuai aksi admin
3. user bisa melihat hasil review di dashboard

### Dependencies

1. Phase 2 selesai
2. role admin sudah berfungsi

## Phase 5: Provision Trigger to n8n

### Goal

Memicu workflow provisioning meeting ke `n8n` setelah payment disetujui.

### Scope

1. implement `/api/internal/orders/[orderId]/provision`
2. ambil data order lengkap dari database
3. bangun payload standar ke `n8n`
4. kirim request outbound ke endpoint `n8n`
5. catat request ke `webhook_logs`
6. update status provisioning menjadi `processing`
7. siapkan proteksi route internal

### Main Tables

1. `orders`
2. `meeting_requests`
3. `products`
4. `profiles`
5. `webhook_logs`

### Expected State After Phase

Saat trigger berhasil dikirim:

1. `orders.status = processing`
2. `orders.provisioning_status = processing`
3. `webhook_logs.direction = outbound`
4. `webhook_logs.status = pending` atau `success` tergantung desain pencatatan

### Deliverables

1. payment approval dapat memicu provisioning
2. payload outbound tercatat
3. failure outbound bisa dilihat dari log

### Dependencies

1. Phase 4 selesai
2. endpoint `n8n` dan secret sudah tersedia

## Phase 6: Callback Handler from n8n

### Goal

Menerima hasil provisioning dari `n8n` dan menyimpan hasil meeting ke database.

### Scope

1. implement `/api/webhooks/n8n/provision`
2. validasi secret atau signature callback
3. parse payload callback
4. upsert ke `zoom_meetings`
5. update `orders.provisioning_status`
6. update `orders.status`
7. catat inbound log ke `webhook_logs`
8. simpan error bila callback menyatakan gagal

### Main Tables

1. `zoom_meetings`
2. `orders`
3. `webhook_logs`

### Expected State After Phase

Jika sukses:

1. `zoom_meetings.status = generated` atau `delivered`
2. `orders.provisioning_status = success`
3. `orders.status = completed`

Jika gagal:

1. `zoom_meetings.status = failed`
2. `orders.provisioning_status = failed`
3. `webhook_logs.status = failed`

### Deliverables

1. hasil provisioning tersimpan di database
2. status order berubah otomatis dari callback
3. audit log inbound tersedia

### Dependencies

1. Phase 5 selesai
2. format callback `n8n` sudah disepakati

## Phase 7: Delivery to User Dashboard

### Goal

Menampilkan hasil provisioning ke dashboard user secara penuh.

### Scope

1. tampilkan `join_url` di halaman meeting user
2. tampilkan status provisioning yang real-time secara server-side
3. tampilkan state error jika provisioning gagal
4. tampilkan detail meeting yang relevan untuk user
5. pastikan access control tetap aman

### Main Tables

1. `orders`
2. `meeting_requests`
3. `zoom_meetings`

### Deliverables

1. user bisa melihat link meeting yang sudah siap
2. user bisa melihat status meeting tanpa dummy data
3. flow end-to-end pelanggan selesai

### Dependencies

1. Phase 6 selesai

## Phase 8: Reliability and Hardening

### Goal

Menstabilkan flow agar siap dipakai secara operasional.

### Scope

1. tambahkan retry provisioning bila callback gagal atau tidak datang
2. tambahkan idempotency guard untuk approval dan callback
3. tambahkan audit logging yang lebih lengkap
4. rapikan empty states dan error states UI
5. tambahkan validasi input yang lebih ketat
6. tambah monitoring untuk webhook dan provisioning

### Deliverables

1. flow lebih tahan error
2. log lebih lengkap untuk troubleshooting
3. risiko duplicate processing berkurang

## Recommended Working Order

Urutan kerja yang disarankan:

1. Phase 1: Order Creation
2. Phase 2: Payment Proof Upload
3. Phase 3: User Order and Meeting Read Model
4. Phase 4: Admin Payment Review
5. Phase 5: Provision Trigger to n8n
6. Phase 6: Callback Handler from n8n
7. Phase 7: Delivery to User Dashboard
8. Phase 8: Reliability and Hardening

## Suggested Definition of Done Per Phase

Sebuah phase dianggap selesai jika:

1. alur utama phase dapat diuji dari UI atau route terkait
2. perubahan state database sesuai dokumen flow
3. error state minimum sudah ditangani
4. lint berjalan bersih
5. tidak merusak phase sebelumnya

## Notes

1. Phase 1 sampai 4 fokus pada stabilitas internal aplikasi.
2. Phase 5 dan 6 fokus pada integrasi eksternal dengan `n8n`.
3. Phase 7 memastikan hasil integrasi benar-benar sampai ke pengguna.
4. Phase 8 adalah fase penguatan sebelum sistem dianggap cukup stabil untuk operasional harian.
