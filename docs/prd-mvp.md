# Product Requirements Document

## Product Name

Harian Store MVP

## Document Status

Draft v1

## Overview

Harian Store adalah aplikasi web untuk pemesanan layanan meeting Zoom berbayar. Pelanggan dapat mendaftar, melengkapi profil, memilih paket meeting, mengajukan jadwal meeting, melakukan pembayaran manual, lalu menerima link Zoom di dashboard setelah pembayaran diverifikasi dan meeting berhasil dibuat melalui otomatisasi `n8n`.

MVP difokuskan untuk memvalidasi alur end-to-end dari pemesanan hingga delivery link meeting tanpa integrasi payment gateway otomatis.

## Background

Proses penyediaan link Zoom secara manual rawan lambat, tidak konsisten, dan sulit dilacak. Dengan sistem ini, pemesanan, verifikasi pembayaran, provisioning meeting, dan distribusi link dapat dikelola dalam satu aplikasi dengan dukungan workflow otomatis melalui `n8n`.

## Goals

1. Memungkinkan pelanggan memesan layanan meeting Zoom secara mandiri.
2. Memungkinkan admin memverifikasi pembayaran manual dan memproses order dengan cepat.
3. Mengotomasi pembuatan meeting Zoom setelah pembayaran disetujui.
4. Menyediakan dashboard pelanggan untuk melihat status order dan link meeting.
5. Menyediakan fondasi untuk ekspansi ke beberapa paket produk dan payment gateway di fase berikutnya.

## Non-Goals

1. Integrasi payment gateway otomatis pada MVP.
2. Pengiriman link meeting via WhatsApp, email, atau Telegram pada MVP.
3. Mobile app native.
4. Multi-tenant atau multi-vendor.
5. Integrasi provider meeting lain selain Zoom.

## Target Users

### 1. Pelanggan

Pengguna yang ingin memesan layanan meeting Zoom untuk agenda tertentu dan menerima link meeting setelah pembayaran diverifikasi.

### 2. Admin Internal

Operator internal yang mengelola paket, memeriksa pembayaran manual, memonitor provisioning, dan menangani kegagalan proses.

## Product Scope

### In Scope

1. Registrasi dan login pelanggan.
2. Pengisian dan pengelolaan profil pelanggan.
3. Katalog beberapa paket produk meeting.
4. Form pemesanan meeting per order.
5. Instruksi pembayaran manual.
6. Upload bukti pembayaran.
7. Verifikasi pembayaran oleh admin.
8. Trigger webhook ke `n8n` setelah pembayaran disetujui.
9. Penyimpanan hasil link Zoom dari proses provisioning.
10. Dashboard pelanggan untuk melihat status order dan link meeting.
11. Panel admin terpisah untuk pengelolaan order, pembayaran, produk, dan log integrasi.

### Out of Scope

1. Auto reconciliation pembayaran.
2. Refund automation.
3. Reminder notifikasi otomatis.
4. Reschedule mandiri oleh pelanggan setelah order diproses.
5. Pembuatan banyak meeting dalam satu order.

## Assumptions

1. Satu order merepresentasikan satu meeting.
2. Pelanggan dapat membuat lebih dari satu order.
3. Link meeting hanya ditampilkan di dashboard pelanggan.
4. Pembayaran dilakukan secara manual dan diverifikasi manual oleh admin.
5. `n8n` bertindak sebagai automation layer untuk provisioning Zoom, bukan sebagai source of truth utama data aplikasi.
6. Dashboard user dan admin dipisahkan.

## User Journey

### Customer Flow

1. Pelanggan mendaftar atau login.
2. Pelanggan melengkapi profil.
3. Pelanggan memilih salah satu paket meeting.
4. Pelanggan mengisi form pemesanan: agenda, tanggal, jam mulai, durasi, dan catatan opsional.
5. Sistem membuat order dengan status awal menunggu pembayaran.
6. Pelanggan melihat instruksi pembayaran manual.
7. Pelanggan mengirim bukti pembayaran.
8. Admin memverifikasi pembayaran.
9. Jika pembayaran disetujui, sistem mengirim trigger ke `n8n`.
10. `n8n` membuat meeting Zoom dan mengembalikan data meeting.
11. Sistem menyimpan link Zoom dan memperbarui status order.
12. Pelanggan melihat link meeting di dashboard.

### Admin Flow

1. Admin login ke panel admin.
2. Admin melihat daftar order masuk.
3. Admin membuka detail order dan bukti pembayaran.
4. Admin menyetujui atau menolak pembayaran.
5. Jika disetujui, sistem memicu provisioning Zoom.
6. Admin memonitor status provisioning.
7. Jika gagal, admin dapat melakukan retry atau investigasi.

## Functional Requirements

### Authentication and Access

1. Sistem harus memungkinkan pelanggan registrasi dan login.
2. Sistem harus memungkinkan admin login secara terpisah.
3. Sistem harus membatasi akses dashboard berdasarkan role.
4. Sistem harus mencegah pelanggan mengakses data order pelanggan lain.

### Profile

1. Pelanggan harus dapat mengisi dan memperbarui profil.
2. Profil minimal mencakup nama lengkap, email, dan nomor WhatsApp.

### Product Catalog

1. Sistem harus menampilkan beberapa paket produk meeting yang aktif.
2. Setiap paket harus memiliki nama, deskripsi, harga, durasi, dan limit peserta bila diperlukan.
3. Admin harus dapat menambah, mengubah, mengaktifkan, dan menonaktifkan paket.

### Ordering

1. Pelanggan harus dapat membuat order baru untuk satu paket.
2. Satu order harus menyimpan detail meeting: agenda, tanggal, jam mulai, durasi, timezone, dan catatan opsional.
3. Pelanggan harus dapat memiliki lebih dari satu order.
4. Pelanggan dapat melihat riwayat order miliknya.

### Manual Payment

1. Sistem harus menampilkan instruksi pembayaran manual setelah order dibuat.
2. Pelanggan harus dapat mengunggah bukti pembayaran.
3. Sistem harus menyimpan status pembayaran secara terpisah dari status order.
4. Admin harus dapat menyetujui atau menolak bukti pembayaran.
5. Admin harus dapat memberi catatan saat menolak pembayaran.

### Provisioning via n8n

1. Sistem harus memicu webhook ke `n8n` setelah pembayaran disetujui.
2. Payload webhook minimal harus memuat informasi order, pelanggan, paket, dan detail meeting.
3. Sistem harus menerima callback atau hasil dari proses `n8n`.
4. Sistem harus menyimpan hasil provisioning seperti `join_url` dan `external_meeting_id`.
5. Sistem harus mencatat log webhook untuk audit dan troubleshooting.
6. Sistem harus mendukung retry provisioning bila proses gagal.

### Customer Dashboard

1. Pelanggan harus dapat melihat daftar order miliknya.
2. Pelanggan harus dapat melihat status pembayaran dan status provisioning.
3. Pelanggan harus dapat melihat link meeting ketika meeting berhasil dibuat.
4. Sistem harus menampilkan status yang jelas jika meeting belum dibuat atau gagal diproses.

### Admin Dashboard

1. Admin harus dapat melihat semua order.
2. Admin harus dapat memfilter order berdasarkan status.
3. Admin harus dapat meninjau bukti pembayaran.
4. Admin harus dapat memonitor provisioning dan log webhook.
5. Admin harus dapat mengelola produk.

## Non-Functional Requirements

1. Aplikasi harus responsif untuk desktop dan mobile web.
2. Akses pelanggan ke link meeting harus aman dan hanya untuk pemilik order.
3. Webhook ke dan dari `n8n` harus dilindungi dengan secret atau signature.
4. Sistem harus menerapkan validasi input pada form penting.
5. Sistem harus mencatat event penting untuk audit dasar.
6. Semua waktu meeting pada MVP harus konsisten menggunakan timezone yang terdefinisi, default `Asia/Jakarta`.

## Data Model Summary

### profiles

1. `id`
2. `user_id`
3. `full_name`
4. `whatsapp`
5. `company`
6. `role`
7. `created_at`
8. `updated_at`

### products

1. `id`
2. `name`
3. `slug`
4. `description`
5. `price`
6. `duration_minutes`
7. `participant_limit`
8. `is_active`
9. `created_at`
10. `updated_at`

### orders

1. `id`
2. `user_id`
3. `product_id`
4. `order_code`
5. `status`
6. `payment_status`
7. `provisioning_status`
8. `total_amount`
9. `created_at`
10. `updated_at`

### meeting_requests

1. `id`
2. `order_id`
3. `agenda`
4. `meeting_date`
5. `start_time`
6. `duration_minutes`
7. `notes`
8. `timezone`

### manual_payments

1. `id`
2. `order_id`
3. `bank_name`
4. `account_name`
5. `transfer_amount`
6. `proof_file_url`
7. `submitted_at`
8. `reviewed_at`
9. `reviewed_by`
10. `status`
11. `admin_notes`

### zoom_meetings

1. `id`
2. `order_id`
3. `provider`
4. `external_meeting_id`
5. `join_url`
6. `start_url`
7. `meeting_password`
8. `status`
9. `generated_at`

### webhook_logs

1. `id`
2. `source`
3. `event_type`
4. `payload`
5. `status`
6. `error_message`
7. `created_at`

## State Definitions

### Order Status

1. `pending_payment`
2. `payment_review`
3. `paid`
4. `processing`
5. `completed`
6. `cancelled`
7. `rejected`

### Payment Status

1. `unpaid`
2. `submitted`
3. `approved`
4. `rejected`

### Provisioning Status

1. `not_started`
2. `queued`
3. `processing`
4. `success`
5. `failed`

### Zoom Meeting Status

1. `pending`
2. `generated`
3. `delivered`
4. `expired`

## Success Metrics

1. Pelanggan dapat menyelesaikan flow pemesanan hingga upload bukti pembayaran tanpa bantuan manual.
2. Admin dapat memverifikasi pembayaran dan memicu provisioning tanpa proses di luar sistem.
3. Meeting berhasil dibuat dan link tersedia di dashboard pelanggan untuk mayoritas order valid.
4. Waktu operasional admin untuk menangani satu order lebih rendah dibanding proses manual penuh.

## Risks and Constraints

1. Pembayaran manual menambah bottleneck pada proses admin.
2. Bukti pembayaran dapat salah upload atau tidak valid.
3. Provisioning Zoom melalui `n8n` dapat gagal atau timeout.
4. Idempotensi webhook harus dijaga agar meeting tidak tergenerate ganda.
5. Deployment `Next.js` di `Netlify` perlu diuji untuk memastikan route handlers dan auth flow berjalan stabil.

## MVP Release Priorities

### Priority 1

1. Auth pelanggan dan admin.
2. Profil pelanggan.
3. Katalog paket produk.
4. Create order dan detail meeting.

### Priority 2

1. Upload bukti pembayaran manual.
2. Verifikasi pembayaran oleh admin.
3. Dashboard user dan admin terpisah.

### Priority 3

1. Integrasi webhook `n8n`.
2. Penyimpanan hasil Zoom meeting.
3. Log webhook dan retry dasar.

## Recommended Technical Stack

1. Framework: `Next.js 16`
2. UI: `Tailwind CSS 4` dan `shadcn/ui`
3. Database: `Supabase Postgres`
4. Authentication: `Supabase Auth`
5. File storage: `Supabase Storage`
6. Hosting: `Netlify`
7. Automation: `n8n`

## Open Questions

1. Apakah bukti pembayaran hanya menerima image atau juga PDF?
2. Apakah pelanggan boleh mengubah detail meeting sebelum pembayaran disetujui?
3. Apakah admin membutuhkan fitur bulk review pembayaran pada fase berikutnya?
4. Apakah paket di masa depan akan dibedakan hanya berdasarkan durasi dan limit peserta, atau juga jumlah meeting?

## Future Enhancements

1. Integrasi payment gateway otomatis.
2. Notifikasi email atau WhatsApp.
3. Reschedule meeting oleh pelanggan.
4. Dashboard reporting untuk admin.
5. Integrasi provider meeting tambahan.
