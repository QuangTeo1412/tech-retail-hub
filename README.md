💻 KaitoStore - Website Bán Lẻ Laptop & Thiết Bị Công Nghệ

KaitoStore là dự án thương mại điện tử chuyên cung cấp các dòng laptop gaming, văn phòng, linh kiện và thiết bị công nghệ. Dự án gồm frontend Next.js và backend ASP.NET Core Web API riêng biệt, có đăng ký/đăng nhập, giỏ hàng, đặt hàng, thanh toán VNPay, email tự động và trang quản trị cho admin.

## 🚀 Công Nghệ Sử Dụng (Tech Stack)

**Frontend**
* [Next.js](https://nextjs.org/) (App Router, React, TypeScript)
* [Tailwind CSS](https://tailwindcss.com/)
* Inline SVG / Unicode Icons
* ESLint (kèm luật `react-hooks`)

**Backend**
* [ASP.NET Core Web API](https://learn.microsoft.com/aspnet/core) (.NET 8)
* [Entity Framework Core](https://learn.microsoft.com/ef/core) + SQL Server
* Xác thực: JWT Bearer Token + BCrypt (mã hóa mật khẩu)
* Thanh toán: Cổng [VNPay](https://vnpay.vn/) (sandbox), có xác thực chữ ký HMAC-SHA512
* Email: Gmail SMTP qua [MailKit](https://github.com/jstedfast/MailKit)
* Upload ảnh sản phẩm: kiểm tra định dạng, dung lượng và nội dung thật của file

## ✨ Tính Năng Đã Hoàn Thành

### 👤 Tài khoản & phân quyền
* Đăng ký bằng Email + SĐT + Mật khẩu, tự sinh tên đăng nhập từ email, kiểm tra trùng email/SĐT.
* Đăng nhập bằng Email, SĐT hoặc tên đăng nhập, trả về JWT chứa Id và quyền (Role) của người dùng.
* Mật khẩu được băm bằng BCrypt, không lưu dạng chữ thường trong database.
* Phân quyền **User** / **Admin**; các API quản trị được bảo vệ bằng `[Authorize(Roles = "Admin")]` ở backend (không thể vượt qua chỉ bằng cách sửa dữ liệu ở trình duyệt).
* Thông báo lỗi form (email sai định dạng, mật khẩu không khớp, thiếu trường...) hiển thị bằng chữ đỏ ngay dưới từng ô, không dùng cảnh báo mặc định của trình duyệt.

### 🏠 Trang chủ
* Header có thanh tìm kiếm, biểu tượng giỏ hàng (hiện đúng số lượng thật từ backend), khu vực đăng nhập/đăng ký hoặc avatar khi đã đăng nhập.
* Banner khuyến mãi dạng slider tự chuyển, có nút điều hướng, dấu chấm trang, tạm dừng khi rê chuột, tự tắt hiệu ứng nếu trình duyệt bật "giảm chuyển động".
* Danh sách **Sản phẩm nổi bật** lấy trực tiếp từ API (không còn dữ liệu mẫu cố định), hỗ trợ tìm kiếm theo tên, tự cuộn ngang, có nút mũi tên và dấu chấm phân trang.
* Nút "Thêm vào giỏ hàng" gọi API thật; chưa đăng nhập thì tự chuyển sang trang đăng nhập.
* Trang chủ đã được tách thành các component riêng (`Header`, `HeroSlider`, `FeaturedSection`, `ProductCard`, `PromoBanners`, `StaticSections`, `Footer`, `Toast`) thay vì gộp một file.

### 🛒 Giỏ hàng & đặt hàng
* Trang **Giỏ hàng** (`/cart`): xem sản phẩm kèm ảnh, xóa từng món, xem tổng tiền, có khung xương (skeleton) khi đang tải.
* Đặt hàng chuyển giỏ hàng hiện tại thành một đơn hàng, trừ tồn kho, xóa giỏ hàng sau khi đặt thành công.
* Thanh toán qua **VNPay** (môi trường sandbox):
  * Chỉ chủ đơn hàng mới tạo được link thanh toán cho đơn của mình; đơn không ở trạng thái chờ thanh toán sẽ bị từ chối.
  * Mỗi lần tạo link có mã giao dịch riêng, tránh lỗi trùng mã khi thử thanh toán lại.
  * Khi VNPay gọi về, backend **kiểm tra chữ ký** và **số tiền** trước khi xác nhận đơn hàng, tránh giả kết quả thanh toán.
* Trang **Kết quả thanh toán** (`/payment-result`): hiện đúng trạng thái thành công / thất bại / không xác thực được, có nút thanh toán lại cho đơn thất bại.

### 📧 Email tự động
* Gửi email xác nhận khi **đặt hàng** thành công.
* Gửi email riêng khi **thanh toán VNPay** thành công (khác nội dung với email đặt hàng).
* Email gửi đúng tới địa chỉ của người đặt đơn (không gán cứng một địa chỉ cố định).

### 🛠️ Trang quản trị (`/admin`, chỉ Admin)
* **Tổng quan**: doanh thu, tổng số đơn hàng, tổng sản phẩm, tổng người dùng, số đơn theo từng trạng thái, top sản phẩm bán chạy.
* **Quản lý sản phẩm**: xem danh sách kèm ảnh, tìm kiếm, thêm/sửa qua cửa sổ nổi (chọn ảnh từ máy hoặc dán link ảnh có sẵn), xóa sản phẩm (báo lỗi rõ ràng nếu sản phẩm đã nằm trong đơn hàng cũ).
* **Quản lý đơn hàng**: xem tất cả đơn hàng của mọi khách, lọc theo trạng thái, xem chi tiết từng đơn, đổi trạng thái (Chờ thanh toán → Đang xử lý → Đang giao → Đã giao / Đã hủy) ngay trong bảng.
* Có "khung sườn" (`AdminShell`) kiểm tra đăng nhập và quyền Admin trước khi vào bất kỳ trang quản trị nào.

### 🔒 Bảo mật đã xử lý
* Băm mật khẩu bằng BCrypt, không lưu mật khẩu thô.
* Xác thực chữ ký VNPay (HMAC-SHA512) trước khi ghi nhận thanh toán.
* Kiểm tra nội dung thật của file ảnh khi upload (không chỉ dựa vào đuôi file), giới hạn 5 MB, đặt tên file ngẫu nhiên.
* CORS chỉ cho phép frontend chạy ở `localhost:3000` gọi API (giới hạn được qua cấu hình).
* Mỗi API nhạy cảm (giỏ hàng, đơn hàng, sản phẩm, upload ảnh, dashboard) đều được bảo vệ bằng JWT + kiểm tra quyền ở backend.

## 📌 Chưa Làm / Kế Hoạch Tiếp Theo (Roadmap)

**Mua sắm**
- [ ] Trang chi tiết sản phẩm (Product Detail).
- [ ] Lọc sản phẩm theo thương hiệu, mức giá, cấu hình (hiện chỉ tìm theo tên).
- [ ] Tăng/giảm số lượng ngay trong giỏ hàng (hiện chỉ thêm 1 hoặc xóa hẳn).
- [ ] Trang "Đơn hàng của tôi" cho khách xem lại đơn đã đặt (API `GET /api/Order/my-orders` đã có, chưa có giao diện).
- [ ] Mã giảm giá, flash sale, sản phẩm nổi bật do admin tự chọn.
- [ ] Tra cứu bảo hành điện tử.
- [ ] Đánh giá / xếp hạng sản phẩm.

**Tài khoản**
- [ ] Xác thực email khi đăng ký (hiện ai cũng đăng ký được bằng email bất kỳ mà không cần xác nhận).
- [ ] Trang "Quên mật khẩu" (đã có link trên form đăng nhập nhưng chưa có trang xử lý).

**Quản trị**
- [ ] Quản lý người dùng (xem danh sách, khóa/mở khóa tài khoản, cấp quyền Admin qua giao diện thay vì sửa thẳng database).
- [ ] Phân trang cho danh sách sản phẩm ở trang admin (hiện giới hạn 100 sản phẩm/lần).
- [ ] Hoàn lại tồn kho khi đơn hàng bị hủy.
- [ ] Quản lý danh mục/thương hiệu như bảng riêng thay vì ô nhập chữ tự do.
- [ ] Nhật ký thao tác admin (ai đổi giá, đổi trạng thái đơn).

**Hạ tầng**
- [ ] Đưa dự án lên môi trường thật (đổi CORS, HashSecret, JwtSettings, thông tin VNPay thật thay vì sandbox).
- [ ] Cân nhắc lưu token an toàn hơn localStorage (ví dụ httpOnly cookie) trước khi phát hành công khai.

## 🛠️ Hướng Dẫn Cài Đặt & Chạy Dự Án

### 1. Yêu cầu hệ thống
* Node.js: `v18.x` trở lên
* .NET SDK: `8.0` trở lên
* SQL Server (LocalDB dùng được lúc phát triển)
* Tài khoản Gmail đã bật Xác minh 2 bước (để lấy Mật khẩu ứng dụng gửi email)
* Tài khoản sandbox VNPay (TmnCode + HashSecret)

### 2. Chạy Backend (ASP.NET Core)
```bash
cd tech-retail-api

# Khôi phục connection string, JWT, email, VNPay trong appsettings.json
# (không đưa thông tin nhạy cảm lên Git, nên dùng dotnet user-secrets khi phát triển)

dotnet restore
dotnet ef database update   # tạo/migrate database
dotnet run
```
Backend mặc định chạy ở `http://127.0.0.1:5000`, có trang tài liệu API tại `http://127.0.0.1:5000/swagger`.

Các mục cần cấu hình trong `appsettings.json`:
```json
{
  "ConnectionStrings": { "DefaultConnection": "..." },
  "JwtSettings": { "SecretKey": "...", "Issuer": "...", "Audience": "...", "ExpireMinutes": 60 },
  "EmailSettings": { "SmtpServer": "smtp.gmail.com", "SmtpPort": "587", "SenderEmail": "...", "AppPassword": "..." },
  "VnPay": { "TmnCode": "...", "HashSecret": "...", "BaseUrl": "...", "ReturnUrl": "...", "FrontendResultUrl": "http://localhost:3000/payment-result" }
}
```

### 3. Chạy Frontend (Next.js)
```bash
cd tech-retail-frontend
npm install

# Tạo file .env.local nếu backend không chạy ở địa chỉ mặc định:
# NEXT_PUBLIC_API_URL=http://127.0.0.1:5000

npm run dev
```
Mở trình duyệt: `http://localhost:3000`

### 4. Build bản Production (Frontend)
```bash
npm run build
npm start
```

## 📂 Cấu Trúc Thư Mục (Project Structure)

```
kaito-store/
├── tech-retail-api/                  # Backend ASP.NET Core Web API
│   ├── Controllers/
│   │   ├── AuthController.cs         # Đăng ký / đăng nhập, tạo JWT
│   │   ├── ProductsController.cs     # CRUD sản phẩm, gán ảnh
│   │   ├── FileUploadController.cs   # Upload ảnh sản phẩm
│   │   ├── CartController.cs         # Giỏ hàng
│   │   ├── OrderController.cs        # Đặt hàng, đơn của tôi, admin xem tất cả đơn
│   │   ├── PaymentController.cs      # Tạo link + xử lý callback VNPay
│   │   └── AdminController.cs        # Số liệu dashboard
│   ├── Models/                       # Product, Order, OrderItem, CartItem, User...
│   ├── Services/                     # IEmailService, EmailService
│   └── Program.cs                    # Cấu hình JWT, CORS, Swagger
│
└── tech-retail-frontend/             # Frontend Next.js
    ├── app/
    │   ├── page.tsx                  # Trang chủ
    │   ├── login/page.tsx            # Đăng nhập
    │   ├── register/page.tsx         # Đăng ký
    │   ├── cart/page.tsx             # Giỏ hàng
    │   ├── payment-result/page.tsx   # Kết quả thanh toán VNPay
    │   ├── admin/                    # Trang quản trị (Tổng quan, Sản phẩm, Đơn hàng)
    │   └── lib/                      # api.ts, hooks.ts, data.ts (dùng chung)
    ├── components/                   # Header, HeroSlider, FeaturedSection, ProductCard,
    │                                 # Footer, Toast, AdminShell, AdminProductForm...
    ├── public/
    ├── package.json
    └── README.md
```

## 📄 Giấy Phép (License)

Dự án được phát triển bởi QuangTen1412. Tất cả quyền được bảo lưu.
