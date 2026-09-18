'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const FEATURED_LAPTOPS = [
    { id: 1, name: 'Laptop Lenovo Legion 5 2025 - AMD R7 7735HS, RTX 4060 8GB', price: '28.990.000đ', oldPrice: '32.990.000đ', discount: '-12%', badge: 'BÁN CHẠY', image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=500' },
    { id: 2, name: 'Laptop ASUS ROG Strix G16 - i7 13700HX, RTX 4050 6GB', price: '31.490.000đ', oldPrice: '34.990.000đ', discount: '-10%', badge: 'HOT SALE', image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=500' },
    { id: 3, name: 'Laptop Lenovo LOQ 15 Gaming - i5 12450HX, RTX 3050', price: '18.490.000đ', oldPrice: '20.990.000đ', discount: '-11%', badge: 'GIÁ TỐT', image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=500' },
    { id: 4, name: 'Laptop Apple MacBook Pro 14" M3 - 8-Core CPU, 10-Core GPU', price: '39.990.000đ', oldPrice: '42.990.000đ', discount: '-7%', badge: 'CAO CẤP', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=500' },
    { id: 5, name: 'Laptop Acer Predator Helios Neo 16 - i7 13700HX, RTX 4060', price: '35.990.000đ', oldPrice: '39.990.000đ', discount: '-10%', badge: 'GAMING', image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=500' },
    { id: 6, name: 'Laptop Dell XPS 13 Plus 9320 - i7 1360P, 16GB RAM, OLED', price: '41.990.000đ', oldPrice: '45.990.000đ', discount: '-8%', badge: 'SANG TRỌNG', image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=500' },
    { id: 7, name: 'Laptop HP Victus 16 - Ryzen 5 7640HS, RTX 4050 6GB', price: '21.990.000đ', oldPrice: '24.990.000đ', discount: '-12%', badge: 'GIÁ TỐT', image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=500' },
    { id: 8, name: 'Laptop MSI Cyborg 15 - i5 12450H, RTX 4050 6GB', price: '19.990.000đ', oldPrice: '22.490.000đ', discount: '-11%', badge: 'HOT SALE', image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=500' },
    { id: 9, name: 'Laptop Gigabyte G5 GE - i5 12500H, RTX 3050 4GB', price: '16.990.000đ', oldPrice: '18.990.000đ', discount: '-10%', badge: 'GIÁ RẺ', image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=500' },
    { id: 10, name: 'Laptop ASUS TUF Gaming A15 - Ryzen 7 7735HS, RTX 4050', price: '23.490.000đ', oldPrice: '26.990.000đ', discount: '-13%', badge: 'BÁN CHẠY', image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=500' },
];

export default function HomePage() {
    const [cartCount, setCartCount] = useState(2);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (isHovered) return;

        const interval = setInterval(() => {
            if (scrollRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                const cardWidth = 300;

                if (scrollLeft + clientWidth >= scrollWidth - 10) {
                    scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    scrollRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
                }
            }
        }, 10000); 

        return () => clearInterval(interval);
    }, [isHovered]);

    return (
        <div className="min-h-screen bg-gray-50 text-slate-800">

            {}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

                    {}
                    <Link href="/" className="text-2xl font-black text-blue-600 tracking-wider flex-shrink-0">
                        KAITO STORE
                    </Link>

                    {}
                    <div className="flex-1 max-w-2xl relative">
                        <input
                            type="text"
                            placeholder="Bạn cần tìm laptop, linh kiện gì hôm nay?..."
                            className="w-full bg-gray-100 border border-gray-200 rounded-full py-2 pl-5 pr-10 text-sm focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-lg cursor-pointer">
                            🔍
                        </span>
                    </div>

                    {}
                    <div className="flex items-center gap-5 flex-shrink-0">
                        {}
                        <Link href="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-7 h-7">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.25 10.5a.75.75 0 100-1.5.75.75 0 000 1.5zm7.5 0a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {}
                        <Link href="/login" className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors">
                            Đăng nhập
                        </Link>

                        {}
                        <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2 rounded-xl shadow-md transition-all">
                            Đăng ký
                        </Link>
                    </div>
                </div>

                {}
                <div className="bg-slate-900 text-white text-xs font-bold py-2.5">
                    <div className="max-w-7xl mx-auto px-4 flex items-center gap-8 overflow-x-auto">
                        <span className="cursor-pointer hover:text-blue-400 flex items-center gap-1.5 whitespace-nowrap">💻 Laptop Mới</span>
                        <span className="cursor-pointer hover:text-blue-400 flex items-center gap-1.5 whitespace-nowrap">🖥️ Laptop Cũ</span>
                        <span className="cursor-pointer hover:text-blue-400 flex items-center gap-1.5 whitespace-nowrap">🔌 Linh Kiện Laptop</span>
                        <span className="cursor-pointer hover:text-blue-400 flex items-center gap-1.5 whitespace-nowrap">🎧 Đồ Công Nghệ</span>
                        <span className="cursor-pointer hover:text-blue-400 flex items-center gap-1.5 whitespace-nowrap">🛡️ Tra Cứu Bảo Hành</span>
                        <span className="cursor-pointer hover:text-blue-400 flex items-center gap-1.5 whitespace-nowrap">💳 Trả Góp 0%</span>
                    </div>
                </div>
            </header>

            {}
            <section className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">

                    {}
                    <div className="lg:col-span-2 relative rounded-3xl overflow-hidden min-h-[320px] bg-slate-950 text-white p-8 flex flex-col justify-between group shadow-lg">
                        <img
                            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3Zydms1cG9ocTNwbDlyMnlycm5zNzI2YXZsYms1aTlsYmtmcXR5OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L1R1tvI9svvIWhmVYz/giphy.gif"
                            alt="Promo Banner"
                            className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="relative z-10 max-w-md">
                            <span className="bg-red-600 text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                                🔥 HOT PROMO
                            </span>
                            <h1 className="text-3xl sm:text-4xl font-black uppercase mt-4 mb-2 leading-tight">
                                Đại Lễ Thả Ga - Săn Sale Cực Đã
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-200 font-medium">
                                Giảm ngay 2.000.000đ trực tiếp vào hóa đơn khi mua Laptop RTX 40 Series.
                            </p>
                        </div>
                        <div className="relative z-10 pt-6">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all active:scale-95 text-xs uppercase tracking-wider">
                                Khám Phá Ngay
                            </button>
                        </div>
                    </div>

                    {}
                    <div className="flex flex-col gap-4">
                        {}
                        <div className="flex-1 bg-gradient-to-r from-red-600 to-rose-700 text-white p-6 rounded-3xl shadow-md flex flex-col justify-between hover:brightness-110 transition-all cursor-pointer">
                            <div>
                                <span className="bg-white/20 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                                    DỊCH VỤ
                                </span>
                                <h3 className="text-xl font-black mt-2 uppercase">BẢO HÀNH ĐIỆN TỬ</h3>
                                <p className="text-xs opacity-90 font-semibold mt-1">Nhanh chóng - Tiện lợi - Uy tín 100%</p>
                            </div>
                            <span className="text-xs font-bold flex items-center gap-1 mt-4">
                                Xem chi tiết ➔
                            </span>
                        </div>

                        {}
                        <div className="flex-1 bg-gradient-to-r from-slate-900 to-blue-950 text-white p-6 rounded-3xl shadow-md flex flex-col justify-between hover:brightness-110 transition-all cursor-pointer">
                            <div>
                                <span className="bg-white/10 text-blue-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                                    TRI ÂN KHÁCH HÀNG
                                </span>
                                <h3 className="text-xl font-black mt-2 uppercase">TẶNG TỚI 1 TRIỆU</h3>
                                <p className="text-xs opacity-80 font-semibold mt-1">Dành riêng cho khách hàng cũ mua lại</p>
                            </div>
                            <span className="text-xs font-bold flex items-center gap-1 mt-4 text-blue-400">
                                Nhận ưu đãi ngay ➔
                            </span>
                        </div>
                    </div>

                </div>
            </section>

            {}
            <section className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-black uppercase text-slate-900 tracking-tight">
                            Laptop Nổi Bật
                        </h2>
                        <span className="bg-blue-100 text-blue-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                            Tự động cuộn 10s
                        </span>
                    </div>
                    <span className="text-xs text-gray-500 italic">
                        (Rê chuột vào danh sách để tạm dừng)
                    </span>
                </div>

                {}
                <div
                    ref={scrollRef}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="flex gap-4 overflow-x-auto scroll-smooth pb-4 no-scrollbar"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {FEATURED_LAPTOPS.map((item) => (
                        <div
                            key={item.id}
                            className="w-[280px] flex-shrink-0 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                        >
                            <div>
                                {}
                                <div className="relative h-44 rounded-xl overflow-hidden bg-gray-50 mb-3">
                                    <span className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase">
                                        {item.badge}
                                    </span>
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                {}
                                <h3 className="text-xs font-bold text-slate-800 line-clamp-2 min-h-[32px] group-hover:text-blue-600 transition-colors">
                                    {item.name}
                                </h3>
                            </div>

                            {}
                            <div className="mt-4">
                                <div className="flex items-baseline justify-between mb-3">
                                    <div>
                                        <span className="text-base font-black text-blue-600 block">
                                            {item.price}
                                        </span>
                                        <span className="text-[11px] text-gray-400 line-through">
                                            {item.oldPrice}
                                        </span>
                                    </div>
                                    <span className="bg-red-50 text-red-600 text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                                        {item.discount}
                                    </span>
                                </div>

                                <button className="w-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-extrabold text-xs py-2.5 rounded-xl transition-all">
                                    Thêm vào giỏ hàng
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}