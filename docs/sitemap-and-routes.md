# Sitemap and Route Structure

## Overview

Dokumen ini menurunkan PRD menjadi struktur halaman dan route untuk implementasi `Next.js 16` App Router. Tujuannya adalah memberi peta yang jelas antara kebutuhan produk, navigasi user, dan boundary modul aplikasi.

Prinsip yang dipakai:

1. Panel user dan admin dipisah jelas.
2. Public pages dibuat ringan untuk promosi dan discovery produk.
3. Auth flow dibuat terpusat dan dapat dipakai oleh user maupun admin.
4. Route handler dipakai untuk webhook, callback, dan action server-side yang butuh boundary HTTP.
5. Struktur route harus mudah berkembang saat payment gateway otomatis ditambahkan nanti.

## Primary Navigation

### Public Navigation

1. Home
2. Paket Meeting
3. Login
4. Register

### User Navigation

1. Dashboard
2. Profil
3. Pesanan
4. Buat Pesanan

### Admin Navigation

1. Overview
2. Orders
3. Payments
4. Products
5. Webhooks

## Sitemap

```text
/ 
|-- /products
|-- /products/[slug]
|-- /login
|-- /register
|-- /forgot-password
|-- /auth/callback
|
|-- /dashboard
|   |-- /dashboard/profile
|   |-- /dashboard/orders
|   |-- /dashboard/orders/new
|   |-- /dashboard/orders/[orderCode]
|   |-- /dashboard/orders/[orderCode]/payment
|   |-- /dashboard/orders/[orderCode]/meeting
|
|-- /admin
|   |-- /admin/orders
|   |-- /admin/orders/[orderCode]
|   |-- /admin/payments
|   |-- /admin/payments/[paymentId]
|   |-- /admin/products
|   |-- /admin/products/new
|   |-- /admin/products/[productId]
|   |-- /admin/webhooks
|   |-- /admin/webhooks/[webhookId]
|
|-- /api
    |-- /api/webhooks/n8n/provision
    |-- /api/internal/orders/[orderId]/provision
    |-- /api/storage/payment-proof/signed-upload
```

## Route Purpose

### Public Routes

#### `/`

Landing page utama.

Tujuan:

1. Menjelaskan value proposition layanan.
2. Menampilkan CTA ke daftar paket.
3. Mengarahkan user baru ke register/login.

#### `/products`

Halaman katalog semua paket aktif.

Tujuan:

1. Menampilkan daftar paket meeting.
2. Membantu user membandingkan paket.
3. Menjadi titik masuk sebelum order.

#### `/products/[slug]`

Halaman detail paket.

Tujuan:

1. Menampilkan detail harga, durasi, limit peserta, dan deskripsi.
2. Menjadi halaman transisi ke pembuatan order.

#### `/login`

Halaman login untuk semua akun.

Catatan:

1. Redirect setelah login ditentukan oleh role.
2. User diarahkan ke `/dashboard`.
3. Admin diarahkan ke `/admin`.

#### `/register`

Halaman registrasi pelanggan.

Tujuan:

1. Membuat akun baru.
2. Mendorong user melengkapi profil setelah login pertama.

#### `/forgot-password`

Halaman reset password.

#### `/auth/callback`

Route callback auth untuk konfirmasi email atau session handling dari Supabase.

## User Routes

### `/dashboard`

Halaman ringkasan akun pelanggan.

Konten utama:

1. status profil
2. order terbaru
3. status meeting terbaru
4. CTA buat order baru

### `/dashboard/profile`

Halaman profil pelanggan.

Fungsi:

1. edit nama
2. edit WhatsApp
3. edit company
4. validasi kelengkapan profil sebelum order

### `/dashboard/orders`

Daftar seluruh order milik pelanggan.

Fungsi:

1. lihat riwayat order
2. filter status
3. akses detail order

### `/dashboard/orders/new`

Halaman create order.

Flow utama:

1. pilih paket
2. isi agenda
3. isi tanggal meeting
4. isi jam mulai
5. isi durasi
6. isi catatan opsional
7. submit order

### `/dashboard/orders/[orderCode]`

Halaman detail order pelanggan.

Konten utama:

1. informasi paket
2. detail meeting request
3. status order
4. status pembayaran
5. status provisioning
6. timeline proses

### `/dashboard/orders/[orderCode]/payment`

Halaman instruksi pembayaran dan upload bukti.

Konten utama:

1. nominal transfer
2. rekening tujuan
3. upload bukti pembayaran
4. riwayat submit bukti jika ada retry

### `/dashboard/orders/[orderCode]/meeting`

Halaman hasil meeting.

Konten utama:

1. join link
2. waktu meeting
3. status meeting
4. pesan error bila provisioning gagal

## Admin Routes

### `/admin`

Dashboard ringkasan admin.

Konten utama:

1. total order aktif
2. order menunggu review payment
3. provisioning gagal
4. produk aktif

### `/admin/orders`

Daftar semua order.

Fungsi:

1. filter berdasarkan order status
2. filter berdasarkan payment status
3. filter berdasarkan provisioning status
4. akses detail order

### `/admin/orders/[orderCode]`

Detail order untuk operasional admin.

Konten utama:

1. profil pelanggan
2. detail produk
3. detail agenda meeting
4. bukti pembayaran terakhir
5. status provisioning
6. action approve, reject, retry

### `/admin/payments`

Daftar review pembayaran.

Tujuan:

1. fokus ke antrean verifikasi payment
2. percepat review bukti transfer

### `/admin/payments/[paymentId]`

Detail satu submission pembayaran.

Konten utama:

1. bukti transfer
2. nilai transfer
3. akun pengirim
4. order terkait
5. tombol approve atau reject

### `/admin/products`

Daftar paket produk.

Fungsi:

1. lihat produk aktif dan nonaktif
2. edit produk
3. tambah produk baru

### `/admin/products/new`

Halaman create produk.

### `/admin/products/[productId]`

Halaman edit produk.

### `/admin/webhooks`

Daftar log webhook dan provisioning.

Fungsi:

1. monitor request ke `n8n`
2. monitor callback dari `n8n`
3. investigasi failure

### `/admin/webhooks/[webhookId]`

Detail payload dan response webhook.

## API and Integration Routes

### `/api/webhooks/n8n/provision`

Route inbound untuk callback dari `n8n` setelah provisioning Zoom.

Tujuan:

1. menerima hasil generate Zoom meeting
2. menyimpan `join_url`, `external_meeting_id`, dan status
3. memperbarui status provisioning order
4. mencatat log inbound webhook

### `/api/internal/orders/[orderId]/provision`

Route internal untuk memicu provisioning meeting ke `n8n`.

Tujuan:

1. dipanggil setelah payment approved
2. membangun payload terstandar ke `n8n`
3. mencatat log outbound webhook

Catatan:

1. Pada implementasi awal, route ini bisa dipanggil oleh server action admin.
2. Di fase lanjut, route ini bisa digantikan oleh job queue.

### `/api/storage/payment-proof/signed-upload`

Route untuk generate signed upload bila penyimpanan bukti bayar dilakukan melalui `Supabase Storage`.

## Suggested App Router Structure

```text
app/
  (public)/
    page.tsx
    products/
      page.tsx
      [slug]/
        page.tsx
    login/
      page.tsx
    register/
      page.tsx
    forgot-password/
      page.tsx
    auth/
      callback/
        route.ts

  (user)/
    dashboard/
      layout.tsx
      page.tsx
      profile/
        page.tsx
      orders/
        page.tsx
        new/
          page.tsx
        [orderCode]/
          page.tsx
          payment/
            page.tsx
          meeting/
            page.tsx

  (admin)/
    admin/
      layout.tsx
      page.tsx
      orders/
        page.tsx
        [orderCode]/
          page.tsx
      payments/
        page.tsx
        [paymentId]/
          page.tsx
      products/
        page.tsx
        new/
          page.tsx
        [productId]/
          page.tsx
      webhooks/
        page.tsx
        [webhookId]/
          page.tsx

  api/
    webhooks/
      n8n/
        provision/
          route.ts
    internal/
      orders/
        [orderId]/
          provision/
            route.ts
    storage/
      payment-proof/
        signed-upload/
          route.ts
```

## Access Control Mapping

### Public

1. `/`
2. `/products`
3. `/products/[slug]`
4. `/login`
5. `/register`
6. `/forgot-password`
7. `/auth/callback`

### Authenticated User Only

1. `/dashboard`
2. `/dashboard/profile`
3. `/dashboard/orders`
4. `/dashboard/orders/new`
5. `/dashboard/orders/[orderCode]`
6. `/dashboard/orders/[orderCode]/payment`
7. `/dashboard/orders/[orderCode]/meeting`

### Admin Only

1. `/admin`
2. `/admin/orders`
3. `/admin/orders/[orderCode]`
4. `/admin/payments`
5. `/admin/payments/[paymentId]`
6. `/admin/products`
7. `/admin/products/new`
8. `/admin/products/[productId]`
9. `/admin/webhooks`
10. `/admin/webhooks/[webhookId]`

### Machine-to-Machine or Server Only

1. `/api/webhooks/n8n/provision`
2. `/api/internal/orders/[orderId]/provision`
3. `/api/storage/payment-proof/signed-upload`

## Future Route Extensions

Route ini belum dibutuhkan di MVP, tapi kemungkinan besar akan muncul di fase berikutnya:

1. `/dashboard/notifications`
2. `/dashboard/billing`
3. `/admin/users`
4. `/admin/settings`
5. `/api/webhooks/payment/[provider]`
6. `/api/webhooks/zoom`

## Implementation Notes

1. Gunakan layout terpisah untuk `(public)`, `(user)`, dan `(admin)` agar navigasi dan guard tidak bercampur.
2. Gunakan `orderCode` di URL customer-facing agar lebih operasional dibanding UUID mentah.
3. Detail page admin tetap dapat memakai `orderCode` untuk mempermudah pencarian manual.
4. Untuk upload bukti bayar, storage sebaiknya tidak diakses publik langsung.
5. Route internal provisioning harus diproteksi agar tidak bisa dipanggil sembarang klien browser.
