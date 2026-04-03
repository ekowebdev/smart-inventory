# Smart Inventory Core System v1.1

A premium, enterprise-grade inventory management system built with **Golang (Gin)** and **React (Vite)**. Featuring a stunning glassmorphism dashboard, real-time stock management, and a robust transaction ledger with workflow support.

## 🚀 Fitur Utama
- **Premium Glassmorphism UI**: Dashboard modern dengan efek blur, glow, dan animasi halus.
- **Real-time Inventory Tracking**: Manajemen stok fisik vs stok tersedia secara akurat.
- **Workflow & Transaction Ledger**: Pencatatan riwayat barang masuk/keluar dengan sistem konfirmasi (Created, In Progress, Done, Cancelled).
- **Advanced Filtering**: Penyaringan log transaksi berdasarkan tipe dan status.
- **Product Lifecycle**: Tambah, Edit, dan Hapus SKU dengan sistem keamanan integritas data.

## 🛠️ Stack Teknologi
- **Backend**: Go (Golang) 1.2x, Gin Gonic, GORM (PostgreSQL).
- **Frontend**: React 18, Vite, Zustand (State Management), Lucide-React, Vanilla CSS.
- **Database**: PostgreSQL.

---

## ⚙️ Instalasi & Persiapan

### 1. Database
Pastikan PostgreSQL sudah berjalan di sistem Anda. Buat database dengan nama `smart_inventory` atau biarkan backend membuatnya secara otomatis jika kredensial user memiliki akses yang cukup.

### 2. Backend (Golang)
Buka terminal di direktori `/backend`.

1. Duplikasi file konfigurasi environment:
   ```bash
   cp .env.example .env
   ```
2. Sesuaikan konfigurasi database di file `.env`.
3. Jalankan server:
   ```bash
   go run main.go
   ```
   *Server akan berjalan di http://localhost:8080*

### 3. Frontend (React)
Buka terminal di direktori `/frontend`.

1. Install dependensi:
   ```bash
   npm install
   ```
2. Jalankan development server:
   ```bash
   npm run dev
   ```
   *Aplikasi akan berjalan di http://localhost:3000*

---

## 📂 Struktur Proyek
```text
smart-inventory/
├── backend/            # Gin Gonic API
│   ├── controllers/    # API Handlers
│   ├── database/       # DB Connection & Seeding
│   ├── models/         # GORM Models
│   ├── services/       # Business Logic
│   └── main.go         # Entry Point
├── frontend/           # Vite React App
│   ├── src/
│   │   ├── components/ # Modal & UI Components
│   │   ├── store/      # Zustand Global State
│   │   └── api/        # Axios API Client
│   └── index.css       # Core Design System
└── README.md           # Documentation
```

## 📝 Catatan Penting
- **Seeding**: Saat pertama kali dijalankan, backend akan otomatis memasukkan 5 produk contoh (MacBook Pro, iPhone, dsb) jika database masih kosong.
- **Port Conflict**: Jika port 8080 atau 3000 sudah digunakan, gunakan perintah `npx kill-port 8080 3000` sebelum menjalankan ulang.

---
