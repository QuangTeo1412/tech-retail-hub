# 💻 KaitoStore - Website Bán Lẻ Laptop & Thiết Bị Công Nghệ

KaitoStore là dự án thương mại điện tử chuyên cung cấp các dòng laptop gaming, văn phòng, linh kiện và thiết bị công nghệ. Dự án được phát triển với giao diện hiện đại, tối ưu trải nghiệm người dùng và tốc độ phản hồi cực nhanh.

---

## 🚀 Công Nghệ Sử Dụng (Tech Stack)

- **Frontend Framework:** [Next.js](https://nextjs.org/) (App Router, React 18, TypeScript)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons & Visuals:** Inline SVG / Unicode Icons, Unsplash API (Demo Images)
- **Linting & Code Quality:** ESLint, TypeScript Rules

---

## ✨ Tính Năng Chính

### 📱 Giao Diện & Trải Nghiệm (UI/UX)
- [x] **Trang chủ (Home Page):**
  - Header tích hợp thanh tìm kiếm, giỏ hàng, đăng nhập/đăng ký.
  - Banner khuyến mãi nổi bật & khối ưu đãi dịch vụ.
  - Danh sách **Laptop Nổi Bật** hỗ trợ **Auto-scroll** (Tự động cuộn mượt mà mỗi 10s, tự động dừng khi di chuột vào).
  - Thanh Navigation menu phân loại danh mục sản phẩm (Laptop mới, Cũ, Linh kiện, Trả góp 0%...).
- [x] **Footer Thông Tin:**
  - Danh sách tổng đài hỗ trợ, hình thức thanh toán (VNPAY, Momo, Apple Pay...).
  - Form đăng ký nhận email khuyến mãi.
  - Chính sách mua hàng, liên kết ứng dụng di động & mạng xã hội.

---

## 🛠️ Hướng Dẫn Cài Đặt & Chạy Dự Án

### 1. Yêu cầu hệ thống
- **Node.js**: `v18.x` trở lên
- **npm** hoặc **yarn** / **pnpm**

### 2. Các bước cài đặt

```bash
# Clone repository về máy
git clone [https://github.com/your-username/kaito-store.git](https://github.com/your-username/kaito-store.git)

# Di chuyển vào thư mục dự án
cd kaito-store
3. Chạy môi trường Development
Bash
npm run dev
Mở trình duyệt và truy cập: http://localhost:3000

4. Build bản Production
Bash
# Kiểm tra lỗi & Build dự án
npm run build

# Chạy bản build Production
npm start
📂 Cấu Trúc Thư Mục (Project Structure)
Plaintext
kaito-store/
├── src/
│   └── app/
│       ├── page.tsx          # Trang chủ chính (Homepage)
│       ├── layout.tsx        # Root Layout & Font Setup
│       ├── globals.css       # Tailwind & Global Styles
│       ├── cart/             # Trang Giỏ hàng (Đang phát triển)
│       ├── login/            # Trang Đăng nhập (Đang phát triển)
│       └── register/         # Trang Đăng ký (Đang phát triển)
├── public/                   # Thư mục chứa tài nguyên tĩnh (Images, Favicon)
├── package.json
├── tailwind.config.ts
└── README.md
📌 Kế Hoạch Phát Triển Tiếp Theo (Roadmap)
[ ] Hoàn thiện giao diện Trang Chi tiết sản phẩm (Product Detail).

[ ] Xây dựng trang Giỏ hàng (Cart) & Thanh toán (Checkout).

[ ] Lọc sản phẩm theo thương hiệu, mức giá, cấu hình.

[ ] Tích hợp Backend API (Node.js/Express hoặc Next.js Route Handlers) & Database (PostgreSQL / MongoDB).

[ ] Tính năng Tra cứu thông tin bảo hành điện tử.

📄 Giấy Phép (License)
Dự án được phát triển bởi QuangTen1412. Tất cả quyền được bảo lưu.

# Cài đặt các gói phụ thuộc (Dependencies)
npm install
