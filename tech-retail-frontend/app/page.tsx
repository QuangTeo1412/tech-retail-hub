import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'KAITO STORE - Laptop & Linh Kiện Máy Tính Chính Hãng',
    description: 'KAITO STORE chuyên laptop gaming, laptop văn phòng, linh kiện máy tính giá tốt nhất.',
};

export default function HomePage() {
    const categories = [
        { name: 'Laptop Mới', icon: '💻', slug: 'laptop-moi' },
        { name: 'Laptop Cũ', icon: '🖥️', slug: 'laptop-cu' },
        { name: 'Linh Kiện Laptop', icon: '🔌', slug: 'linh-kien' },
        { name: 'Đồ Công Nghệ', icon: '🎧', slug: 'do-cong-nghe' },
        { name: 'Tra Cứu Bảo Hành', icon: '🛡️', slug: 'tra-cuu-bao-hanh' },
        { name: 'Trả Góp 0%', icon: '💳', slug: 'tra-gop' },
    ];

    const featuredProducts = [
        {
            id: 1,
            name: 'Laptop Lenovo Legion 5 2025 - AMD R7 7735HS, RTX 4060 8GB',
            price: '28.990.000đ',
            oldPrice: '32.990.000đ',
            discount: '-12%',
            image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600&auto=format&fit=crop',
            badge: 'Bán chạy',
        },
        {
            id: 2,
            name: 'Laptop ASUS ROG Strix G16 - i7 13700HX, RTX 4050 6GB',
            price: '31.490.000đ',
            oldPrice: '34.990.000đ',
            discount: '-10%',
            image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=600&auto=format&fit=crop',
            badge: 'Hot Sale',
        },
        {
            id: 3,
            name: 'Laptop Lenovo LOQ 15 Gaming - i5 12450HX, RTX 3050',
            price: '18.490.000đ',
            oldPrice: '20.990.000đ',
            discount: '-11%',
            image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=600&auto=format&fit=crop',
            badge: 'Giá tốt',
        },
        {
            id: 4,
            name: 'Laptop Apple MacBook Pro 14" M3 - 8-Core CPU, 10-Core GPU',
            price: '39.990.000đ',
            oldPrice: '42.990.000đ',
            discount: '-7%',
            image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop',
            badge: 'Cao cấp',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 font-sans antialiased">
            {}
            <div className="bg-gradient-to-r from-red-600 via-orange-500 to-red-600 text-white text-xs md:text-sm py-2 text-center font-bold tracking-wide shadow-md">
                <span className="inline-block animate-pulse mr-2">🔥</span>
                ĐẠI LỄ THẢ GA - SĂN SALE CỰC ĐÃ | GIẢM GIÁ TỚI 2.000.000Đ HÔM NAY!
            </div>

            {}
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200 transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
                    <Link href="/" className="text-2xl md:text-3xl font-black text-blue-600 tracking-wider hover:scale-105 transition-transform duration-200">
                        KAITO STORE
                    </Link>

                    {}
                    <div className="hidden md:flex flex-1 max-w-xl items-center relative">
                        <input
                            type="text"
                            placeholder="Bạn cần tìm laptop, linh kiện gì hôm nay?..."
                            className="w-full bg-gray-100 border border-gray-300 rounded-full py-2.5 pl-5 pr-10 text-sm focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                        <button className="absolute right-3.5 text-gray-500 hover:text-blue-600 hover:scale-110 transition-transform">
                            🔍
                        </button>
                    </div>

                    {}
                    <div className="flex items-center space-x-3">
                        <Link
                            href="/login"
                            className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-blue-600 transition"
                        >
                            Đăng nhập
                        </Link>
                        <Link
                            href="/register"
                            className="px-5 py-2 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 hover:shadow-lg active:scale-95 transition-all"
                        >
                            Đăng ký
                        </Link>
                    </div>
                </div>

                {}
                <nav className="bg-slate-900 text-white text-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center space-x-8 overflow-x-auto py-2.5 whitespace-nowrap scrollbar-none">
                        {categories.map((cat, idx) => (
                            <Link
                                key={idx}
                                href={`/category/${cat.slug}`}
                                className="flex items-center space-x-2 hover:text-blue-400 font-semibold hover:-translate-y-0.5 transition-all duration-200"
                            >
                                <span className="text-base">{cat.icon}</span>
                                <span>{cat.name}</span>
                            </Link>
                        ))}
                    </div>
                </nav>
            </header>

            {}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-10">

                {}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {}
                    <div className="lg:col-span-2 relative rounded-3xl overflow-hidden shadow-xl min-h-[320px] group flex items-center">
                        <img
                            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop"
                            alt="Laptop Gaming Sale"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>

                        <div className="relative z-10 p-8 sm:p-10 max-w-lg text-white">
                            <span className="inline-block bg-red-600 text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 animate-bounce">
                                🔥 Hot Promo
                            </span>
                            <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-3">
                                ĐẠI LỄ THẢ GA - SĂN SALE CỰC ĐÃ
                            </h1>
                            <p className="text-gray-200 text-sm sm:text-base mb-6">
                                Giảm ngay 2.000.000đ trực tiếp vào hóa đơn khi mua Laptop RTX 40 Series.
                            </p>
                            <Link
                                href="/promotions"
                                className="inline-block bg-blue-600 text-white font-extrabold px-7 py-3.5 rounded-xl shadow-lg hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-200"
                            >
                                Khám Phá Ngay
                            </Link>
                        </div>
                    </div>

                    {}
                    <div className="flex flex-col justify-between gap-4">
                        <div className="relative rounded-2xl overflow-hidden shadow-md group h-full min-h-[150px] p-6 text-white flex flex-col justify-between bg-gradient-to-br from-red-600 to-rose-700">
                            <div className="relative z-10">
                                <span className="text-[10px] font-black uppercase bg-white/20 backdrop-blur-md px-2 py-0.5 rounded">
                                    Dịch Vụ
                                </span>
                                <h2 className="text-xl font-extrabold mt-2">BẢO HÀNH ĐIỆN TỬ</h2>
                                <p className="text-xs text-red-100 mt-1">Nhanh chóng - Tiện lợi - Uy tín 100%</p>
                            </div>
                            <span className="relative z-10 text-xs font-bold underline group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 cursor-pointer">
                                Xem chi tiết ➔
                            </span>
                        </div>

                        <div className="relative rounded-2xl overflow-hidden shadow-md group h-full min-h-[150px] p-6 text-white flex flex-col justify-between bg-gradient-to-br from-slate-800 to-slate-950">
                            <div className="relative z-10">
                                <span className="text-[10px] font-black uppercase bg-white/20 backdrop-blur-md px-2 py-0.5 rounded">
                                    Tri Ân Khách Hàng
                                </span>
                                <h2 className="text-xl font-extrabold mt-2">TẶNG TỚI 1 TRIỆU</h2>
                                <p className="text-xs text-slate-300 mt-1">Dành riêng cho khách hàng cũ mua lại</p>
                            </div>
                            <span className="relative z-10 text-xs font-bold underline group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 cursor-pointer">
                                Nhận ưu đãi ngay ➔
                            </span>
                        </div>
                    </div>
                </section>

                {}
                <section className="space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                            <span className="animate-bounce">🔥</span> LAPTOP NỔI BẬT BÁN CHẠY
                        </h2>
                        <Link href="/products" className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline transition">
                            Xem tất cả ➔
                        </Link>
                    </div>

                    {}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map((product) => (
                            <article
                                key={product.id}
                                className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
                            >
                                <div>
                                    {}
                                    <div className="relative overflow-hidden rounded-xl bg-gray-50 mb-4 h-48">
                                        <span className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[10px] font-black uppercase px-2 py-1 rounded-md shadow">
                                            {product.badge}
                                        </span>
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>

                                    {}
                                    <h3 className="font-bold text-gray-800 text-sm line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                                        {product.name}
                                    </h3>
                                </div>

                                {}
                                <div className="mt-4 pt-3 border-t border-gray-100">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <div className="text-lg font-black text-blue-600">{product.price}</div>
                                            <div className="text-xs text-gray-400 line-through">{product.oldPrice}</div>
                                        </div>
                                        <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-md">
                                            {product.discount}
                                        </span>
                                    </div>

                                    <button className="w-full bg-blue-50 text-blue-600 font-bold text-sm py-2.5 rounded-xl hover:bg-blue-600 hover:text-white active:scale-95 transition-all duration-200">
                                        Thêm vào giỏ hàng
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                {}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center space-x-4 p-2 hover:translate-x-1 transition-transform">
                        <span className="text-4xl">🚀</span>
                        <div>
                            <h4 className="font-bold text-gray-900">Giao Hàng Toàn Quốc</h4>
                            <p className="text-xs text-gray-500 mt-0.5">Nhanh chóng, an toàn & đồng kiểm</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 p-2 hover:translate-x-1 transition-transform">
                        <span className="text-4xl">🛡️</span>
                        <div>
                            <h4 className="font-bold text-gray-900">Bảo Hành Chính Hãng</h4>
                            <p className="text-xs text-gray-500 mt-0.5">Cam kết 1 đổi 1 nếu lỗi từ nhà sản xuất</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 p-2 hover:translate-x-1 transition-transform">
                        <span className="text-4xl">💳</span>
                        <div>
                            <h4 className="font-bold text-gray-900">Hỗ Trợ Trả Góp 0%</h4>
                            <p className="text-xs text-gray-500 mt-0.5">Thủ tục đơn giản qua thẻ tín dụng</p>
                        </div>
                    </div>
                </section>

            </main>

            {}
            <footer className="bg-slate-900 text-gray-300 text-sm mt-16 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-black text-white mb-4">KAITO STORE</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            Hệ thống bán lẻ máy tính, laptop gaming, linh kiện công nghệ hàng đầu. Uy tín và trải nghiệm khách hàng luôn đứng số 1.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-3">Danh Mục Sản Phẩm</h4>
                        <ul className="space-y-2 text-xs text-gray-400">
                            <li><Link href="#" className="hover:text-white transition">Laptop Gaming</Link></li>
                            <li><Link href="#" className="hover:text-white transition">Laptop Văn Phòng</Link></li>
                            <li><Link href="#" className="hover:text-white transition">Linh Kiện Máy Tính</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-3">Hỗ Trợ Khách Hàng</h4>
                        <ul className="space-y-2 text-xs text-gray-400">
                            <li><Link href="#" className="hover:text-white transition">Chính sách đổi trả</Link></li>
                            <li><Link href="#" className="hover:text-white transition">Tra cứu bảo hành</Link></li>
                            <li><Link href="#" className="hover:text-white transition">Hướng dẫn mua trả góp</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-3">Liên Hệ</h4>
                        <p className="text-xs text-gray-400">Hotline: 0886.288.288</p>
                        <p className="text-xs text-gray-400 mt-1">Email: contact@kaitostore.com</p>
                    </div>
                </div>
                <div className="border-t border-slate-800 py-4 text-center text-xs text-gray-500">
                    © {new Date().getFullYear()} KAITO STORE. All rights reserved.
                </div>
            </footer>
        </div>
    );
}