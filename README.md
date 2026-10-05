💻 KaitoStore - Website Bán Lẻ Laptop & Thiết Bị Công Nghệ

KaitoStore là dự án thương mại điện tử chuyên cung cấp các dòng laptop gaming, văn phòng, linh kiện và thiết bị công nghệ. Dự án gồm frontend Next.js và backend ASP.NET Core Web API riêng biệt, có đăng ký/đăng nhập (kèm xác thực email và quên mật khẩu), tìm kiếm & lọc sản phẩm, trang chi tiết sản phẩm có đánh giá, giỏ hàng, đặt hàng, thanh toán VNPay, email tự động và trang quản trị cho admin.

## 🚀 Công Nghệ Sử Dụng (Tech Stack)

**Frontend**
* [Next.js](https://nextjs.org/) (App Router, React, TypeScript)
* [Tailwind CSS](https://tailwindcss.com/)
* Inline SVG / Unicode Icons
* ESLint (kèm luật `react-hooks`)

**Backend**
* [ASP.NET Core Web API](https://learn.microsoft.com/aspnet/core) (.NET 8)
* [Entity Framework Core](https://learn.microsoft.com/ef/core) + SQL Server (quản lý thay đổi database bằng Migrations)
* Kiến trúc DTO (`Dtos/`) tách riêng dữ liệu vào/ra API khỏi Model database
* Xác thực: JWT Bearer Token + BCrypt (mã hóa mật khẩu) + hằng số `Roles.cs` cho phân quyền
* Thanh toán: Cổng [VNPay](https://vnpay.vn/) (sandbox), có xác thực chữ ký HMAC-SHA512
* Email: Gmail SMTP qua [MailKit](https://github.com/jstedfast/MailKit)
* Upload ảnh sản phẩm: kiểm tra định dạng, dung lượng và nội dung thật của file

## ✨ Tính Năng Đã Hoàn Thành

### 👤 Tài khoản & phân quyền
* Đăng ký bằng Email + SĐT + Mật khẩu, tự sinh tên đăng nhập từ email, kiểm tra trùng email/SĐT.
* **Xác thực email khi đăng ký** (`/verify-email`): gửi email kèm liên kết xác nhận trước khi tài khoản dùng được.
* **Quên mật khẩu / Đặt lại mật khẩu** (`/forgot-password`, `/reset-password`): gửi email kèm liên kết đặt lại mật khẩu.
* Đăng nhập bằng Email, SĐT hoặc tên đăng nhập, trả về JWT chứa Id và quyền (Role) của người dùng.
* Mật khẩu được băm bằng BCrypt, không lưu dạng chữ thường trong database.
* Phân quyền **User** / **Admin** qua hằng số `Roles.cs`; các API quản trị được bảo vệ bằng `[Authorize(Roles = "Admin")]` ở backend (không thể vượt qua chỉ bằng cách sửa dữ liệu ở trình duyệt). Tài khoản Admin đầu tiên được tự động tạo sẵn lúc khởi động backend (`AdminSeeder.cs`).
* Thông báo lỗi form (email sai định dạng, mật khẩu không khớp, thiếu trường...) hiển thị bằng chữ đỏ ngay dưới từng ô, không dùng cảnh báo mặc định của trình duyệt.

### 🏠 Trang chủ
* Header có thanh tìm kiếm, biểu tượng giỏ hàng (hiện đúng số lượng thật từ backend), khu vực đăng nhập/đăng ký hoặc avatar khi đã đăng nhập.
* Banner khuyến mãi dạng slider tự chuyển, có nút điều hướng, dấu chấm trang, tạm dừng khi rê chuột, tự tắt hiệu ứng nếu trình duyệt bật "giảm chuyển động".
* Danh sách **Sản phẩm nổi bật** lấy trực tiếp từ API, hỗ trợ tìm kiếm theo tên, tự cuộn ngang, có nút mũi tên và dấu chấm phân trang.
* Nút "Thêm vào giỏ hàng" gọi API thật; chưa đăng nhập thì tự chuyển sang trang đăng nhập.
* Trang chủ được tách thành các component riêng (`Header`, `HeroSlider`, `FeaturedSection`, `ProductCard`, `PromoBanners`, `StaticSections`, `Footer`, `Toast`) thay vì gộp một file.

### 🔎 Tìm kiếm & lọc sản phẩm
* Trang `/search`: tìm theo từ khóa, lọc theo thương hiệu, RAM, khoảng giá, sắp xếp (mới nhất / giá tăng dần / giá giảm dần / tên), có phân trang.
* Trạng thái "Không tìm thấy sản phẩm" được thiết kế riêng (icon, tiêu đề, nút về trang chủ), không dùng thông báo mặc định của trình duyệt.
* Có component `ProductGrid`, `FilterSidebar`, `Pagination`, `SortSelect` riêng cho trang tìm kiếm.

### 📄 Trang chi tiết sản phẩm
* Gallery ảnh sản phẩm, kèm video giới thiệu (YouTube) nếu có.
* Giá hiện kèm giá gốc gạch ngang và % giảm giá nếu sản phẩm đang khuyến mãi.
* Bảng **Thông số kỹ thuật** chia theo nhóm (ví dụ "Bộ xử lý & Đồ họa", "Màn hình", "Pin"...) giống các trang thương mại điện tử lớn; admin nhập theo cú pháp văn bản đơn giản (dòng `# Tên nhóm` để chia nhóm, `Tên: Giá trị` cho từng thông số), không cần thêm cột database cho mỗi thông số mới.
* Danh sách sản phẩm tương tự (cùng danh mục).
* **Đánh giá sản phẩm**: xem điểm trung bình và danh sách đánh giá, gửi đánh giá (phải đăng nhập, mỗi người chỉ đánh giá 1 lần/sản phẩm), xử lý qua `ReviewsController.cs` riêng.

### 🛒 Giỏ hàng & đặt hàng
* Trang **Giỏ hàng** (`/cart`): xem sản phẩm kèm ảnh, tăng/giảm số lượng hoặc xóa từng món, xem tổng tiền, có khung xương (skeleton) khi đang tải.
* Trang **Đơn hàng của tôi** (`/orders`): khách xem lại các đơn đã đặt và trạng thái từng đơn.
* Đặt hàng chuyển giỏ hàng hiện tại thành một đơn hàng, trừ tồn kho, xóa giỏ hàng sau khi đặt thành công.
* Thanh toán qua **VNPay** (môi trường sandbox):
  * Chỉ chủ đơn hàng mới tạo được link thanh toán cho đơn của mình; đơn không ở trạng thái chờ thanh toán sẽ bị từ chối.
  * Mỗi lần tạo link có mã giao dịch riêng, tránh lỗi trùng mã khi thử thanh toán lại.
  * Khi VNPay gọi về, backend **kiểm tra chữ ký** và **số tiền** trước khi xác nhận đơn hàng, tránh giả kết quả thanh toán.
* Trang **Kết quả thanh toán** (`/payment-result`): hiện đúng trạng thái thành công / thất bại / không xác thực được, có nút thanh toán lại cho đơn thất bại.

### 📧 Email tự động
* Email xác nhận tài khoản khi **đăng ký** (xác thực email).
* Email đặt lại mật khẩu khi dùng chức năng **quên mật khẩu**.
* Email xác nhận khi **đặt hàng** thành công.
* Email riêng khi **thanh toán VNPay** thành công (khác nội dung với email đặt hàng).
* Email luôn gửi đúng tới địa chỉ của người dùng liên quan, không gán cứng một địa chỉ cố định.

### 🛠️ Trang quản trị (`/admin`, chỉ Admin)
* **Tổng quan**: doanh thu, tổng số đơn hàng, tổng sản phẩm, tổng người dùng, số đơn theo từng trạng thái, top sản phẩm bán chạy.
* **Quản lý sản phẩm**: xem danh sách kèm ảnh, tìm kiếm, thêm/sửa qua cửa sổ nổi — gồm tên, giá, giá gốc (khuyến mãi), tồn kho, danh mục, thương hiệu, mô tả, ảnh (chọn từ máy hoặc dán link), link video và thông số kỹ thuật theo nhóm; xóa sản phẩm báo lỗi rõ ràng nếu sản phẩm đã nằm trong đơn hàng cũ.
* **Quản lý đơn hàng**: xem tất cả đơn hàng của mọi khách, lọc theo trạng thái, xem chi tiết từng đơn, đổi trạng thái (Chờ thanh toán → Đang xử lý → Đang giao → Đã giao / Đã hủy) ngay trong bảng.
* Có "khung sườn" (`AdminShell`) kiểm tra đăng nhập và quyền Admin trước khi vào bất kỳ trang quản trị nào.

### 🔒 Bảo mật đã xử lý
* Băm mật khẩu bằng BCrypt, không lưu mật khẩu thô.
* Xác thực chữ ký VNPay (HMAC-SHA512) trước khi ghi nhận thanh toán.
* Kiểm tra nội dung thật của file ảnh khi upload (không chỉ dựa vào đuôi file), giới hạn 5 MB, đặt tên file ngẫu nhiên.
* CORS chỉ cho phép frontend chạy ở `localhost:3000` gọi API (giới hạn được qua cấu hình).
* Mỗi API nhạy cảm (giỏ hàng, đơn hàng, sản phẩm, đánh giá, upload ảnh, dashboard) đều được bảo vệ bằng JWT + kiểm tra quyền ở backend.

## 📌 Chưa Làm / Kế Hoạch Tiếp Theo (Roadmap)

**Mua sắm**
- [ ] Mã giảm giá, flash sale, sản phẩm nổi bật do admin tự chọn.
- [ ] Tra cứu bảo hành điện tử.

**Quản trị**
- [ ] Quản lý người dùng (xem danh sách, khóa/mở khóa tài khoản, cấp quyền Admin qua giao diện thay vì sửa thẳng database).
- [ ] Phân trang cho danh sách sản phẩm ở trang admin (hiện giới hạn 100 sản phẩm/lần).
- [ ] Hoàn lại tồn kho khi đơn hàng bị hủy.
- [ ] Chuẩn hóa Thương hiệu/Danh mục thành bảng riêng có kiểm soát (hiện vẫn là ô nhập chữ tự do, dễ gõ sai chính tả gây trùng lặp, ví dụ "Laptop" và "laptop" bị tính là hai danh mục khác nhau).
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
dotnet ef database update   # tạo/migrate database theo các migration trong thư mục Migrations/
dotnet run
```
Backend mặc định chạy ở `http://127.0.0.1:5000`, có trang tài liệu API tại `http://127.0.0.1:5000/swagger`. Lúc khởi động lần đầu, `AdminSeeder.cs` tự tạo sẵn 1 tài khoản Admin nếu database chưa có.

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
ProductManagementAPI/
├── tech-retail-api/                       # Backend ASP.NET Core Web API
│   ├── Controllers/
│   │   ├── AdminController.cs             # Số liệu dashboard
│   │   ├── AuthController.cs              # Đăng ký / đăng nhập / xác thực email / quên mật khẩu, tạo JWT
│   │   ├── CartController.cs              # Giỏ hàng
│   │   ├── FileUploadController.cs        # Upload ảnh sản phẩm
│   │   ├── OrderController.cs             # Đặt hàng, đơn của tôi, admin xem tất cả đơn
│   │   ├── PaymentController.cs           # Tạo link + xử lý callback VNPay
│   │   ├── ProductsController.cs          # CRUD sản phẩm, gán ảnh, tìm kiếm/lọc
│   │   └── ReviewsController.cs           # Xem / gửi đánh giá sản phẩm
│   ├── Dtos/                              # AccountRecoveryDtos, CreateReviewDto, DashboardStatsDto, RegisterDto, UserDto
│   ├── Models/                            # Product, Order, OrderItem, CartItem, Review, Roles, User...
│   ├── Services/
│   │   ├── AdminSeeder.cs                 # Tự tạo tài khoản Admin đầu tiên lúc khởi động
│   │   ├── EmailService.cs / IEmailService.cs
│   │   └── VnPayLibrary.cs
│   ├── Migrations/                        # Lịch sử thay đổi database (EF Core)
│   ├── AppDbContext.cs
│   └── Program.cs                         # Cấu hình JWT, CORS, Swagger
│
└── tech-retail-frontend/                  # Frontend Next.js
    ├── app/
    │   ├── page.tsx                       # Trang chủ
    │   ├── login/, register/              # Đăng nhập, đăng ký
    │   ├── forgot-password/, reset-password/  # Quên / đặt lại mật khẩu
    │   ├── verify-email/                  # Xác thực email sau khi đăng ký
    │   ├── cart/                          # Giỏ hàng
    │   ├── orders/                        # Đơn hàng của tôi
    │   ├── payment-result/                # Kết quả thanh toán VNPay
    │   ├── products/[id]/                 # Chi tiết sản phẩm
    │   ├── search/                        # Tìm kiếm & lọc sản phẩm
    │   ├── admin/                         # Trang quản trị (Tổng quan, Sản phẩm, Đơn hàng)
    │   └── lib/                           # api.ts, hooks.ts, data.ts, products.ts (dùng chung)
    ├── components/
    │   ├── search/                        # FilterSidebar, ProductGrid, Pagination, SortSelect...
    │   ├── product/                       # ProductDetailClient
    │   └── Header, Footer, HeroSlider, FeaturedSection, ProductCard, AdminShell, AdminProductForm, Toast...
    ├── public/
    └── package.json
```

## 📄 Giấy Phép (License)

Dự án được phát triển bởi QuangTeo1412. Tất cả quyền được bảo lưu.
