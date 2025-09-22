# Movie Collection App
Aplikasi Movie Collection berbasis Vue 3 + Vite + Firebase untuk mengelola koleksi film.
Fitur:
1. Tambah, edit, hapus movie
2. Pencarian movie berdasarkan judul
3. Movie Collection dengan grid responsive

# Cara Menjalankan Project
1. Clone repository dari GitLab
2. Install dependencies (Pastikan sudah ada Node.js >= 18)
3. Pastikan sudah install Vue 3 dan Vite
4. Jalankan aplikasi (npm run dev)

# Ketentuan Project

1. ID Movie : Digenerate otomatis dengan kombinasi timestamp + random (unik per detik). ID ini digunakan sebagai primary key.
2. Genre : Multi-select dengan tombol toggle. Data disimpan sebagai array (["Action","Drama"]).
3. Trailer Link : Jika link mengandung watch?v=, otomatis diubah menjadi embed/. (Link menggunakan link youtube, kalau bisa link embed).
4. Summary (Notes) : Wajib diisi. Maksimal 100 karakter.
5. Validasi Form : Semua field wajib diisi. Tombol Save hanya aktif jika semua valid.
6. Untuk Edit, ID movie tetap sama (tidak digenerate ulang).
7. Search : Mencari berdasarkan judul film (title).

