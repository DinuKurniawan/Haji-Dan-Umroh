# Safar Haramain

Landing page website Haji dan Umroh dengan panel admin statis untuk mengelola paket, jadwal, dan review jamaah. Project ini dibuat menggunakan HTML, Tailwind CSS via CDN, CSS terpisah, dan JavaScript vanilla tanpa backend.

## Ringkasan

Project ini terdiri dari:

- halaman utama landing page
- halaman daftar semua paket
- panel admin untuk CRUD paket dan jadwal
- moderasi review jamaah
- penyimpanan data di browser menggunakan `localStorage`
- penyimpanan pilihan paket sementara antar halaman menggunakan `sessionStorage`

Website ini cocok untuk:

- demo presentasi klien
- prototipe cepat
- landing page statis
- bahan awal sebelum dipindahkan ke backend seperti Laravel atau Node.js

## Fitur Utama

### Landing page publik

- hero section modern dengan gambar full-width
- section paket dinamis
- section layanan
- section jadwal dinamis
- section testimoni dinamis
- form konsultasi
- form kirim review

### Halaman paket

- menampilkan semua paket dari panel admin
- otomatis dipakai saat jumlah paket lebih dari 6
- tombol paket dapat membawa user ke form konsultasi dengan paket yang sudah terpilih

### Panel admin

- tambah paket baru
- edit paket
- hapus paket
- upload gambar paket dari komputer
- isi URL gambar alternatif
- preview gambar sebelum simpan
- tandai paket unggulan
- tambah jadwal
- edit jadwal
- hapus jadwal
- moderasi review jamaah
- reset data demo

## Perilaku Penting

### Batas tampilan paket di homepage

Homepage hanya menampilkan maksimal `6` kartu paket.

Jika jumlah paket lebih dari 6:

- homepage tetap menampilkan 6 paket pertama
- muncul tombol `Lihat Semua Paket`
- menu `Paket` dan tombol `Lihat Paket` diarahkan ke `paket.html`

### Auto-select paket di form konsultasi

Saat user menekan tombol paket:

- jika masih di homepage, dropdown paket pada form konsultasi akan otomatis terpilih
- jika berasal dari `paket.html`, pilihan paket dibawa dulu lewat `sessionStorage`, lalu otomatis dipilih saat user tiba di form konsultasi di `index.html`

### Moderasi review

Review dari form publik tidak langsung tampil. Review akan:

1. masuk ke penyimpanan browser
2. berstatus menunggu
3. ditinjau di panel admin
4. baru tampil di homepage jika disetujui

## Teknologi yang Digunakan

- HTML5
- Tailwind CSS via CDN
- CSS terpisah
- JavaScript vanilla
- Google Fonts: Inter
- Browser Storage:
  - `localStorage` untuk paket, jadwal, dan review
  - `sessionStorage` untuk pilihan paket sementara antar halaman

## Struktur Project

```text
.
|-- index.html
|-- paket.html
|-- admin.html
|-- styles.css
|-- admin.css
|-- script.js
|-- admin.js
|-- data-store.js
`-- README.md
```

## Penjelasan File

### `index.html`

Halaman utama landing page. Menampilkan:

- hero
- daftar paket terbatas
- layanan
- jadwal
- review
- form konsultasi

### `paket.html`

Halaman khusus daftar semua paket. Dipakai saat jumlah paket melebihi 6 atau ketika user ingin melihat seluruh pilihan paket.

### `admin.html`

Panel admin statis untuk mengelola data website pada browser yang sama.

### `styles.css`

Styling untuk halaman publik:

- homepage
- halaman paket
- komponen kartu
- section action tambahan

### `admin.css`

Styling untuk dashboard admin:

- form admin
- daftar item admin
- preview gambar
- tombol aksi
- shell input ber-icon

### `script.js`

Logic frontend publik:

- render paket
- render jadwal
- render review
- auto-select paket
- pembatasan 6 paket di homepage
- redirect ke halaman paket jika data lebih dari 6
- pengiriman review publik
- menu mobile

### `admin.js`

Logic panel admin:

- CRUD paket
- CRUD jadwal
- moderasi review
- upload dan optimasi gambar
- preview gambar paket
- reset data demo

### `data-store.js`

Sumber data bersama untuk seluruh halaman. File ini menangani:

- default data
- pembacaan data dari `localStorage`
- penyimpanan data ke `localStorage`
- penyimpanan paket terpilih ke `sessionStorage`

## Cara Menjalankan Project

### Opsi 1: Jalankan dengan local server

Disarankan memakai local server agar navigasi antar halaman dan storage browser berjalan stabil.

Contoh dengan Python:

```bash
python -m http.server 5500
```

Lalu buka:

- `http://127.0.0.1:5500/index.html`
- `http://127.0.0.1:5500/paket.html`
- `http://127.0.0.1:5500/admin.html`

### Opsi 2: Buka file statis langsung

Untuk tampilan dasar, file HTML bisa dibuka langsung di browser. Namun untuk alur multi-halaman dan perilaku storage, local server tetap lebih direkomendasikan.

## Cara Pakai Panel Admin

Buka `admin.html`, lalu gunakan bagian berikut:

### 1. Kelola paket

Form paket memiliki field:

- badge paket
- judul paket
- harga atau status
- label tombol
- deskripsi
- upload gambar
- URL gambar alternatif
- alt gambar
- status unggulan

Catatan:

- upload gambar akan diproses dan dioptimasi sebelum disimpan
- URL gambar bisa dipakai jika tidak ingin upload file
- hanya satu paket yang ideal dijadikan unggulan pada satu waktu

### 2. Kelola jadwal

Form jadwal memiliki field:

- nama paket
- rute atau catatan
- tanggal tampil
- label tombol

### 3. Moderasi review

Pada section review admin, tersedia aksi:

- setujui review
- sembunyikan review
- hapus review

### 4. Reset data demo

Tombol `Reset Data Demo` akan:

- mengembalikan paket ke data awal
- mengembalikan jadwal ke data awal
- mengembalikan review ke data awal
- menghapus pilihan paket sementara di session

## Alur Data

### Paket

1. Admin menambah atau mengedit paket di `admin.html`
2. Data disimpan ke `localStorage`
3. Homepage dan halaman paket membaca data yang sama dari `data-store.js`
4. Homepage hanya menampilkan 6 item pertama

### Jadwal

1. Admin mengedit jadwal
2. Data tersimpan di `localStorage`
3. Homepage langsung membaca jadwal terbaru

### Review

1. User mengirim review dari homepage
2. Review disimpan sebagai `approved: false`
3. Admin meninjau review di panel admin
4. Review tampil di homepage jika `approved: true`

### Pilihan paket konsultasi

1. User menekan tombol paket
2. Nama paket disimpan sementara di `sessionStorage` jika pindah halaman
3. Dropdown konsultasi otomatis memilih paket tersebut saat halaman form dibuka

## Storage yang Digunakan

Project ini memakai key browser berikut:

### `localStorage`

- `safarharamain_packages`
- `safarharamain_schedules`
- `safarharamain_reviews`

### `sessionStorage`

- `safarharamain_selected_package`

## Upload Gambar Paket

Upload gambar pada panel admin bekerja seperti ini:

1. admin memilih file gambar
2. gambar dibaca oleh browser
3. gambar dikecilkan jika terlalu besar
4. gambar dikonversi menjadi data URL
5. hasil disimpan ke `localStorage`

Catatan penting:

- karena disimpan di browser, ukuran gambar sebaiknya tidak terlalu besar
- jika gambar terlalu berat, penyimpanan bisa gagal karena batas kapasitas `localStorage`
- untuk penggunaan produksi, upload gambar sebaiknya dipindahkan ke backend atau cloud storage

## Kelebihan Project Ini

- ringan dan cepat dijalankan
- tidak membutuhkan backend
- mudah dipresentasikan
- data antarmuka admin dan publik sudah terhubung
- mudah dijadikan pondasi untuk sistem yang lebih besar

## Batasan Saat Ini

- belum ada login admin sungguhan
- data hanya tersimpan pada browser yang sama
- tidak ada database server
- upload gambar masih tersimpan di browser
- belum ada API
- belum ada validasi backend
- belum cocok untuk produksi skala nyata

## Saran Pengembangan Selanjutnya

- tambahkan autentikasi admin
- pindahkan data ke database
- buat backend API
- tambahkan pagination atau filter paket
- tambahkan kategori paket
- tambahkan status kursi tersedia
- tambahkan manajemen kontak masuk
- tambahkan export data review dan konsultasi
- pindahkan upload gambar ke storage server
- ubah project menjadi Laravel, Next.js, atau stack backend lain

## Cocok Diubah Menjadi Backend

Project ini paling mudah dikembangkan lebih lanjut menjadi:

- Laravel + MySQL
- Node.js + Express + database
- Next.js + API routes

Mapping yang bisa dipertahankan:

- `packages` menjadi tabel paket
- `schedules` menjadi tabel jadwal
- `reviews` menjadi tabel review
- form konsultasi menjadi tabel leads atau inquiries

## Deployment

Karena project ini berbasis file statis, secara teknis bisa di-host di:

- Netlify
- Vercel
- GitHub Pages
- shared hosting biasa

Namun perlu diingat:

- data admin berbasis browser tidak akan sinkron antar device
- panel admin statis tanpa backend hanya cocok untuk demo atau internal preview

## Checklist Fitur Saat Ini

- [x] Landing page modern
- [x] File HTML, CSS, dan JavaScript terpisah
- [x] Panel admin paket
- [x] Panel admin jadwal
- [x] Moderasi review
- [x] Upload gambar paket
- [x] Preview gambar paket
- [x] Auto-select paket ke form konsultasi
- [x] Halaman semua paket
- [x] Redirect otomatis saat paket lebih dari 6

## Lisensi

Belum ditentukan. Tambahkan lisensi sesuai kebutuhan project.
