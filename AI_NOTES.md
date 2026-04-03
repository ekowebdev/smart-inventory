# AI Usage Report (AI_NOTES.md)

Dokumen ini mencatat penggunaan kecerdasan buatan dalam pengembangan **Smart Inventory Core System v1.1**.

## 🛠️ AI Tools Used
- **Antigravity (by Google DeepMind)**: Digunakan sebagai asisten utama untuk perancangan arsitektur, penulisan kode backend (Go), pengembangan UI (React), dan orkestrasi alur kerja Git.
- **Lucide React**: Digunakan untuk penyediaan ikon vektor yang konsisten di seluruh aplikasi.
- **GORM**: Digunakan sebagai ORM untuk abstraksi database PostgreSQL yang aman.

## 🧠 Prompt Paling Kompleks
> *"Implementasikan alur Stock Out menggunakan prinsip Two-Phase Commitment (2PC). Pisahkan antara 'PhysicalStock' dan 'AvailableStock'. Saat transaksi dibuat (CREATED), AvailableStock harus berkurang (Allocated), namun PhysicalStock tetap. PhysicalStock hanya berkurang saat status transaksi mencapai 'DONE'. Pastikan semua operasi database berada dalam satu transaksi gopher/GORM yang sama agar ACID terjamin."*

## 🛠️ Modifikasi Manual & Best Practice
**Bagian Kode**: `backend/services/transaction_service.go` - Logika Manajemen Stok Ganda.

**Penjelasan**:
Pada awalnya, AI cenderung menyarankan pembaruan stok secara sekuensial sederhana (hanya satu kolom `stock`). Namun, untuk mematuhi **Best Practice Inventory Management**, saya memodifikasi logika tersebut secara manual untuk:
1.  **Dual-Stock Column**: Memisahkan `PhysicalStock` (barang nyata di gudang) dan `AvailableStock` (barang yang siap dijual/tidak sedang ter-alokasi).
2.  **Atomic Transactions**: Menggunakan fitur Global Transaction pada GORM (`db.Transaction(func(tx *gorm.DB) error { ... })`). Hal ini memastikan jika pencatatan `TransactionLog` gagal, maka pengalokasian stok akan otomatis di-rollback ke kondisi semula.
3.  **Concurrency Safety**: Menambahkan pengecekan stok di level aplikasi sebelum pengurangan dilakukan untuk mencegah *race conditions* (overselling) yang sering dilupakan oleh AI dasar.

---
*Laporan ini dibuat sebagai bentuk transparansi pengembangan berbasis AI.*
