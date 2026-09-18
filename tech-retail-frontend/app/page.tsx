import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'KAITOSTORE - Hệ Thống Bán Lẻ Laptop & Linh Kiện Máy Tính Chính Hãng',
    description: 'KAITOSTORE chuyên cung cấp laptop gaming, laptop văn phòng, linh kiện máy tính, phụ kiện công nghệ giá tốt nhất. Bảo hành chính hãng, trả góp 0%, giao hàng nhanh.',
    keywords: ['laptop gaming', 'laptop van phong', 'linh kien may tinh', 'do cong nghe', 'kaitostore'],
    openGraph: {
        title: 'KAITOSTORE - Hệ Thống Bán Lẻ Laptop & Linh Kiện Máy Tính Chính Hãng',
        description: 'Mua Laptop & Linh kiện công nghệ chính hãng giá cực tốt tại KAITOSTORE.',
        url: 'https://kaitostore.com',
        siteName: 'KAITOSTORE',
        locale: 'vi_VN',
        type: 'website',
    },
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

    // Dữ liệu mẫu sản phẩm nổi bật
    const featuredProducts = [
        {
            id: 1,
            name: 'Laptop Gaming Legion 5 2025 - AMD R7, RTX 4060',
            price: '28.990.000đ',
            oldPrice: '32.990.000đ',
            discount: '-12%',
            image: 'https://via.placeholder.com/400x300?text=Legion+5',
            badge: 'Bán chạy',
        },
        {
            id: 2,
            name: 'Laptop ASUS ROG Strix G16 - i7 13700HX, RTX 4050',
            price: '31.490.000đ',
            oldPrice: '34.990.000đ',
            discount: '-10%',
            image: 'https://via.placeholder.com/400x300?text=ROG+Strix',
            badge: 'Hot Sale',
        },
        {
            id: 3,
            name: 'Laptop LOQ 15 Gaming - i5 12450HX, RTX 3050',
            price: '18.490.000đ',
            oldPrice: '20.990.000đ',
            discount: '-11%',
            image: 'https://via.placeholder.com/400x300?text=LOQ+15',
            badge: 'Giá tốt',
        },
        {
            id: 4,
            name: 'Laptop Dell XPS 13 - i7 1360P, 16GB RAM, 512GB SSD',
            price: '35.990.000đ',
            oldPrice: '38.990.000đ',
            discount: '-8%',
            image: 'https://via.placeholder.com/400x300?text=Dell+XPS',
            badge: 'Cao cấp',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">
            {}
            <div className="bg-red-600 text-white text-xs md:text-sm py-2 text-center font-medium">
                🔥 ĐẠI LỄ THẢ GA - SĂN SALE CỰC ĐÃ | GIẢM GIÁ TỚI 2.000.000Đ HÔM NAY!
            </div>

            {}
            <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
                    {}
                    <Link href="/" className="text-2xl md:text-3xl font-black text-blue-600 tracking-wider hover:opacity-90">
                        KAITOSTORE
                    </Link>

                    {}
                    <div className="hidden md:flex flex-1 max-w-xl items-center relative">
                        <input
                            type="text"
                            placeholder="Bạn cần tìm laptop, linh kiện gì hôm nay?..."
                            className="w-full bg-gray-100 border border-gray-200 rounded-full py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                        />
                        <button className="absolute right-3 text-gray-500 hover:text-blue-600">
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
                            className="px-4.5 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition"
                        >
                            Đăng ký
                        </Link>
                    </div>
                </div>

                {}
                <nav className="bg-slate-900 text-white text-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center space-x-6 overflow-x-auto py-2.5 whitespace-nowrap scrollbar-none">
                        {categories.map((cat, idx) => (
                            <Link
                                key={idx}
                                href={`/category/${cat.slug}`}
                                className="flex items-center space-x-1.5 hover:text-blue-400 font-medium transition"
                            >
                                <span>{cat.icon}</span>
                                <span>{cat.name}</span>
                            </Link>
                        ))}
                    </div>
                </nav>
            </header>

            {}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-12">
                {}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {}
                    <div className="lg:col-span-2 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-8 text-white flex flex-col justify-between shadow-lg relative overflow-hidden min-h-[300px]">
                        <div className="relative z-10 max-w-md">
                            <span className="inline-block bg-red-500 text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                                Siêu Ưu Đãi
                            </span>
                            <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-3">
                                ĐẠI LỄ THẢ GA - SĂN SALE CỰC ĐÃ
                            </h1>
                            <p className="text-blue-100 text-sm sm:text-base mb-6">
                                Giảm ngay tới 2.000.000đ cho sinh viên & tân thủ khi mua Laptop Gaming hôm nay.
                            </p>
                            <Link
                                href="/promotions"
                                className="inline-block bg-white text-blue-700 font-extrabold px-6 py-3 rounded-xl shadow hover:bg-blue-50 transition"
                            >
                                Khám Phá Ngay
                            </Link>
                        </div>
                    </div>

                    {}    
                    <div className="flex flex-col justify-between gap-4">
                        <div className="bg-red-500 rounded-2xl p-6 text-white shadow flex flex-col justify-between h-full">
                            <div>
                                <span className="text-xs font-bold uppercase bg-white/20 px-2 py-0.5 rounded">
                                    Mới Về
                                </span>
                                <h2 className="text-xl font-extrabold mt-2">BẢO HÀNH ĐIỆN TỬ</h2>
                                <p className="text-xs text-red-100 mt-1">Nhanh chóng - Tiện lợi - Uy tín 100%</p>
                            </div>
                            <span className="text-sm font-bold underline mt-4 cursor-pointer">Xem chi tiết →</span>
                        </div>

                        <div className="bg-slate-800 rounded-2xl p-6 text-white shadow flex flex-col justify-between h-full">
                            <div>
                                <span className="text-xs font-bold uppercase bg-white/20 px-2 py-0.5 rounded">
                                    Hỗ Trợ
                                </span>
                                <h2 className="text-xl font-extrabold mt-2">TẶNG TỚI 1 TRIỆU</h2>
                                <p className="text-xs text-slate-300 mt-1">Áp dụng cho khách hàng mua lại lần 2</p>
                            </div>
                            <span className="text-sm font-bold underline mt-4 cursor-pointer">Nhận ưu đãi ngay →</span>
                        </div>
                    </div>
                </section>

                {}
                <section className="space-y-6">
                    <div className="flex items-center justify-between border-b pb-4">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                            🔥 LAPTOP NỔI BẬT BÁN CHẠY
                        </h2>
                        <Link href="/products" className="text-sm font-bold text-blue-600 hover:underline">
                            Xem tất cả →
                        </Link>
                    </div>

                    {}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map((product) => (
                            <article
                                key={product.id}
                                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                            >
                                <div>
                                    {}
                                    <div className="relative overflow-hidden rounded-xl bg-gray-50 mb-4">
                                        <span className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[10px] font-black uppercase px-2 py-1 rounded">
                                            {product.badge}
                                        </span>
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>

                                    {}
                                    <h3 className="font-bold text-gray-800 text-sm line-clamp-2 mb-2 group-hover:text-blue-600 transition">
                                        {product.name}
                                    </h3>
                                </div>

                                {}
                                <div className="mt-4 pt-3 border-t border-gray-50">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <div className="text-lg font-black text-blue-600">{product.price}</div>
                                            <div className="text-xs text-gray-400 line-through">{product.oldPrice}</div>
                                        </div>
                                        <span className="text-xs font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                                            {product.discount}
                                        </span>
                                    </div>

                                    <button className="w-full bg-blue-50 text-blue-600 font-bold text-sm py-2.5 rounded-xl hover:bg-blue-600 hover:text-white transition-colors">
                                        Thêm vào giỏ hàng
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                {}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center space-x-4">
                        <span className="text-4xl">🚀</span>
                        <div>
                            <h4 className="font-bold text-gray-900">Giao Hàng Toàn Quốc</h4>
                            <p className="text-xs text-gray-500 mt-0.5">Nhanh chóng, an toàn & đồng kiểm</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-4xl">🛡️</span>
                        <div>
                            <h4 className="font-bold text-gray-900">Bảo Hành Chính Hãng</h4>
                            <p className="text-xs text-gray-500 mt-0.5">Cam kết 1 đổi 1 nếu có lỗi sản xuất</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
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
                        <h3 className="text-xl font-black text-white mb-4">KAITOSTORE</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            Hệ thống bán lẻ máy tính, laptop gaming, linh kiện công nghệ hàng đầu. Uy tín chất lượng đặt lên hàng đầu.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-3">Về Chúng Tôi</h4>
                        <ul className="space-y-2 text-xs">
                            <li><Link href="#" className="hover:text-white">Giới thiệu cửa hàng</Link></li>
                            <li><Link href="#" className="hover:text-white">Chính sách bảo mật</Link></li>
                            <li><Link href="#" className="hover:text-white">Tuyển dụng</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-3">Hỗ Trợ Khách Hàng</h4>
                        <ul className="space-y-2 text-xs">
                            <li><Link href="#" className="hover:text-white">Hướng dẫn mua hàng</Link></li>
                            <li><Link href="#" className="hover:text-white">Chính sách đổi trả</Link></li>
                            <li><Link href="#" className="hover:text-white">Tra cứu bảo hành</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-3">Liên Hệ</h4>
                        <p className="text-xs text-gray-400">Hotline: 0886.288.288</p>
                        <p className="text-xs text-gray-400 mt-1">Email: contact@kaitostore.com</p>
                    </div>
                </div>
                <div className="border-t border-slate-800 py-4 text-center text-xs text-gray-500">
                    © {new Date().getFullYear()} KAITOSTORE. All rights reserved.
                </div>
            </footer>
        </div>
    );
}