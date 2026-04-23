# Setup Supabase Schema

## Tujuan

Panduan ini dipakai untuk memasang schema database Harian Store ke project Supabase aktif melalui SQL Editor.

Schema utama sudah tersedia di file:

`supabase/schema.sql`

## Langkah Setup

1. Buka dashboard Supabase project yang aktif.
2. Masuk ke menu `SQL Editor`.
3. Buat query baru.
4. Buka file `supabase/schema.sql` dari repo ini.
5. Copy seluruh isi file tersebut.
6. Paste ke SQL Editor.
7. Jalankan query sampai selesai.

## Catatan

File `supabase/schema.sql` sudah disusun agar relatif aman untuk setup awal karena memakai pola seperti:

1. `create table if not exists`
2. `create index if not exists`
3. `drop policy if exists`
4. `drop trigger if exists`

Tetap disarankan menjalankan query ini pada database yang memang dipakai khusus untuk project Harian Store.

## Tabel Yang Akan Dibuat

1. `profiles`
2. `products`
3. `orders`
4. `meeting_requests`
5. `manual_payments`
6. `zoom_meetings`
7. `webhook_logs`

## Enum Yang Akan Dibuat

1. `app_role`
2. `order_status`
3. `payment_status`
4. `provisioning_status`
5. `manual_payment_status`
6. `zoom_meeting_status`
7. `webhook_direction`
8. `webhook_status`

## Verifikasi Setelah Setup

Setelah query selesai, jalankan query berikut di SQL Editor:

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'profiles',
    'products',
    'orders',
    'meeting_requests',
    'manual_payments',
    'zoom_meetings',
    'webhook_logs'
  )
order by table_name;
```

Hasilnya harus menampilkan seluruh tabel di atas.

## Verifikasi Produk Aktif

Karena Phase 1 membutuhkan minimal satu produk aktif, setelah schema terpasang Anda perlu menambahkan minimal satu row ke tabel `products`.

Contoh query:

```sql
insert into public.products (
  name,
  slug,
  description,
  price,
  duration_minutes,
  participant_limit,
  is_active
) values (
  'Zoom Harian',
  'zoom-harian',
  'Paket meeting Zoom harian untuk kebutuhan cepat.',
  6000,
  60,
  100,
  true
);
```

## Verifikasi Produk

```sql
select id, name, slug, price, duration_minutes, participant_limit, is_active
from public.products;
```

## Setelah Setup Selesai

Jika schema dan produk aktif sudah tersedia, flow Phase 1 yang sudah dibuat di aplikasi bisa mulai dipakai untuk:

1. create `orders`
2. create `meeting_requests`
3. redirect ke halaman payment per order
