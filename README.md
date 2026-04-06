# Smart Inventory Core System v1.1

A premium, enterprise-grade inventory management system built with **Golang (Gin)** and **React (Vite)**. Featuring a stunning glassmorphism dashboard, real-time stock management, audit-ready reports, and a robust transaction ledger with professional workflow support.

## 🚀 Fitur Utama
- **Premium Glassmorphism UI**: Dashboard modern dengan efek blur, glow, dan animasi halus.
- **Real-time Inventory Tracking**: Manajemen stok fisik vs stok tersedia secara akurat dengan sistem alokasi.
- **Workflow & Transaction Ledger**: Pencatatan riwayat barang masuk/keluar dengan sistem konfirmasi (Created, Draft, In Progress, Done, Cancelled).
- **Audit-Ready Reports**: Cetak laporan transaksi profesional dalam format A4 yang rapi dan informatif.
- **Interactive API Documentation**: Dokumentasi API lengkap menggunakan Swagger (OpenAPI 3.0).
- **Advanced Filtering & Search**: Penyaringan log transaksi yang mendalam dan fitur pencarian item yang tidak mengganggu statistik dashboard.

## 🛠️ Stack Teknologi
- **Backend**: Go (Golang) 1.25+, Gin Gonic, GORM (PostgreSQL), Swaggo (Swagger docs).
- **Frontend**: React 19, Vite, Zustand (State Management), Lucide-React, Vanilla CSS.
- **Database**: PostgreSQL.

---

## ⚙️ Instalasi & Persiapan

### 1. Database
Pastikan PostgreSQL sudah berjalan di komputer Anda. Buat database dengan nama `smart_inventory` atau biarkan backend membuatnya secara otomatis jika kredensial user memiliki akses yang cukup.

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

4. **Akses Dokumentasi API**:
   Buka [http://localhost:8080/swagger/index.html](http://localhost:8080/swagger/index.html) untuk melihat dokumentasi API interaktif.

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
│   ├── controllers/    # API Handlers with Swagger annotations
│   ├── database/       # DB Connection & Seeding
│   │   └── seeder/     # Modular & Idempotent data seeding
│   ├── routes/         # Modular endpoint definitions
│   ├── dto/            # Data Transfer Objects (API Response formatting)
│   ├── models/         # GORM Models & Schemas
│   ├── services/       # Business Logic (Stock-out allocation logic)
|   ├── repositories/   # GORM Database Operations (Omit logic for immutable fields)
│   ├── docs/           # Auto-generated Swagger documentation
│   └── main.go         # Entry Point
├── frontend/           # Vite React App
│   ├── src/
│   │   ├── components/ # Modal & UI Components (Glassmorphism layout)
│   │   ├── store/      # Zustand Global State
│   │   ├── api/        # Axios API Client
│   │   └── schemas/    # Zod Validation Schemas
│   └── index.css       # Core Design System (CSS Variables)
└── README.md           # Documentation
```

## 📝 Catatan Penting
- **Seeding**: Saat pertama kali dijalankan, backend akan otomatis memasukkan 5 produk contoh (MacBook Pro, iPhone, dsb) jika database masih kosong.
- **Port Conflict**: Jika port 8080 atau 3000 sudah digunakan, gunakan perintah `npx kill-port 8080 3000` sebelum menjalankan ulang.

---
