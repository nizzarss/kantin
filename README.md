# KANTIN SHODAP NIEH

Website kantin kampus mobile-first. Mahasiswa bisa lihat menu, cari makanan, atur keranjang, checkout, simulasi pembayaran (tunai / QRIS), dapat struk digital, pakai Budget Mode, dan ikuti kuis diskon.

Tidak ada backend, database, login, atau payment gateway. Semua data ada di JavaScript. Keranjang dan struk terakhir disimpan di `localStorage`.

## Cara menjalankan

Buka `index.html` di browser (Chrome / Edge / Firefox).

Kalau gambar atau skrip terasa aneh karena `file://`, jalankan server lokal sederhana, misalnya:

```bash
python -m http.server 8080
```

Lalu buka `http://localhost:8080`.

## Struktur

```text
index.html          satu halaman, view diganti JavaScript
css/style.css       design system, layout, print
js/data.js          produk, kuis, info kantin
js/app.js           cart, checkout, payment, budget, quiz, receipt
assets/logo.svg
assets/favicon.svg
assets/qris-demo.svg
assets/products/    ilustrasi menu 1:1
```

## Alur demo (2–3 menit)

1. Home — branding, best seller, CTA.
2. Menu — cari `mie`, filter kategori, tambah Mie Goreng + Es Teh.
3. Budget Mode — isi `15000`, tambahkan kombinasi ke keranjang (opsional, kosongkan dulu jika perlu).
4. Checkout — nama `Raka`, tunai `20000`, lihat kembalian.
5. Receipt — nomor transaksi, cetak.
6. Event — jawab 3 soal benar, voucher `KUIS10` di checkout.

## Catatan simulasi

- QRIS dan tunai adalah **simulasi lokal**.
- QR struk adalah pola visual + parameter `?receipt=TRX-...`. Struk hanya bisa dibuka lagi di browser yang sama selama data `localStorage` masih ada.
- Produk habis (Gado-gado, Es Coklat) tetap tampil, tidak bisa ditambah.

## Tim (contoh pembagian)

1. HTML / struktur
2. CSS / visual
3. JS catalog + cart
4. Payment, receipt, budget, quiz
5. QA, aset, README


### Event Quiz
Voucher **KUIS10** dapat dipakai berkali-kali untuk demo dan tidak hangus setelah pembayaran.

## Product Images

Product images now use JPG files in `assets/products/`, all prepared at **1200×900 px (4:3)**. Replace the placeholder JPGs with your own product photos using the existing filenames. The logo, favicon, and QRIS assets remain unchanged.
