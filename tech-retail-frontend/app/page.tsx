'use client';

import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';


interface Laptop {
    id: number;
    name: string;
    price: string;
    oldPrice: string;
    discount: string;
    badge: string;
    image: string;
}

interface User {
    username?: string;
    name?: string;
    email?: string;
    avatar?: string;
    avatarUrl?: string;
    image?: string;
}

interface HeroSlide {
    id: number;
    tag: string;
    title: string;
    description: string;
    cta: string;
    href: string;
    image: string;
}

const NO_SCROLLBAR = '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden';

const HERO_INTERVAL = 6000;
const PRODUCT_AUTOPLAY_INTERVAL = 6000;
const CARD_WIDTH = 280; 
const CARD_GAP = 16; 

const HERO_SLIDES: HeroSlide[] = [
    {
        id: 1,
        tag: '🔥 HOT PROMO',
        title: 'ĐẠI LỄ THẢ GA - SẮN SALE CỰC ĐÃ',
        description: 'Giảm ngay 2.000.000đ trực tiếp vào hóa đơn khi mua Laptop RTX 40 Series.',
        cta: 'Khám Phá Ngay',
        href: '/laptop-moi',
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=85&w=1920&auto=format',
    },
    {
        id: 2,
        tag: '💻 LAPTOP MỚI',
        title: 'LAPTOP CAO CẤP - MỎNG NHẸ, MẠNH MẼ',
        description: 'Hàng chính hãng, bảo hành đầy đủ, 1 đổi 1 trong 30 ngày đầu.',
        cta: 'Xem Laptop Mới',
        href: '/laptop-moi',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=85&w=1920&auto=format',
    },
    {
        id: 3,
        tag: '💳 TRẢ GÓP 0%',
        title: 'MUA LAPTOP TRẢ GÓP 0% LÃI SUẤT',
        description: 'Thủ tục nhanh gọn, duyệt trong 5 phút. Sở hữu laptop mơ ước ngay hôm nay.',
        cta: 'Xem Trả Góp',
        href: '/tra-gop',
        image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=85&w=1920&auto=format',
    },
];

const FEATURED_LAPTOPS: Laptop[] = [
    { id: 1, name: 'Laptop Lenovo Legion 5 2025 - AMD R7 7735HS, RTX 4060 8GB', price: '28.990.000đ', oldPrice: '32.990.000đ', discount: '-12%', badge: 'BÁN CHẠY', image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=85&w=800&auto=format' },
    { id: 2, name: 'Laptop ASUS ROG Strix G16 - i7 13700HX, RTX 4050 6GB', price: '31.490.000đ', oldPrice: '34.990.000đ', discount: '-10%', badge: 'HOT SALE', image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=85&w=800&auto=format' },
    { id: 3, name: 'Laptop Lenovo LOQ 15 Gaming - i5 12450HX, RTX 3050', price: '18.490.000đ', oldPrice: '20.990.000đ', discount: '-11%', badge: 'GIÁ TỐT', image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=85&w=800&auto=format' },
    { id: 4, name: 'Laptop Apple MacBook Pro 14" M3 - 8-Core CPU, 10-Core GPU', price: '39.990.000đ', oldPrice: '42.990.000đ', discount: '-7%', badge: 'CAO CẤP', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=85&w=800&auto=format' },
    { id: 5, name: 'Laptop Acer Predator Helios Neo 16 - i7 13700HX, RTX 4060', price: '35.990.000đ', oldPrice: '39.990.000đ', discount: '-10%', badge: 'GAMING', image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=85&w=800&auto=format' },
    { id: 6, name: 'Laptop Dell XPS 13 Plus 9320 - i7 1360P, 16GB RAM, OLED', price: '41.990.000đ', oldPrice: '45.990.000đ', discount: '-8%', badge: 'SANG TRỌNG', image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=85&w=800&auto=format' },
    { id: 7, name: 'Laptop HP Victus 16 - Ryzen 5 7640HS, RTX 4050 6GB', price: '21.990.000đ', oldPrice: '24.990.000đ', discount: '-12%', badge: 'GIÁ TỐT', image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=85&w=800&auto=format' },
    { id: 8, name: 'Laptop MSI Cyborg 15 - i5 12450H, RTX 4050 6GB', price: '19.990.000đ', oldPrice: '22.490.000đ', discount: '-11%', badge: 'HOT SALE', image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=85&w=800&auto=format' },
    { id: 9, name: 'Laptop Gigabyte G5 GE - i5 12500H, RTX 3050 4GB', price: '16.990.000đ', oldPrice: '18.990.000đ', discount: '-10%', badge: 'GIÁ RẺ', image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=85&w=800&auto=format' },
    { id: 10, name: 'Laptop ASUS TUF Gaming A15 - Ryzen 7 7735HS, RTX 4050', price: '23.490.000đ', oldPrice: '26.990.000đ', discount: '-13%', badge: 'BÁN CHẠY', image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=85&w=800&auto=format' },
];

function Footer() {
    return (
        <footer className="bg-white text-gray-700 text-xs border-t border-gray-200 pt-10 pb-12 mt-12">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="space-y-6">
                    <div>
                        <h3 className="font-bold text-sm text-gray-900 mb-2">Tổng đài hỗ trợ miễn phí</h3>
                        <p className="mb-1">
                            Mua hàng - bảo hành <a href="tel:18002097" className="font-bold text-gray-900 hover:text-blue-600">1800.2097</a> (7h30 - 22h00)
                        </p>
                        <p>
                            Khiếu nại <a href="tel:18002063" className="font-bold text-gray-900 hover:text-blue-600">1800.2063</a> (8h00 - 21h30)
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-sm text-gray-900 mb-2">Phương thức thanh toán</h3>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 border border-gray-200 rounded font-semibold text-[10px]">🍎 Pay</span>
                            <span className="px-2 py-1 border border-gray-200 rounded font-bold text-blue-600 text-[10px]">VNPAY</span>
                            <span className="px-2 py-1 border border-gray-200 rounded font-bold text-pink-600 text-[10px]">momo</span>
                            <span className="px-2 py-1 border border-gray-200 rounded font-bold text-blue-500 text-[10px]">OnePAY</span>
                            <span className="px-2 py-1 border border-gray-200 rounded font-bold text-orange-500 text-[10px]">Kredivo</span>
                            <span className="px-2 py-1 border border-gray-200 rounded font-bold text-blue-400 text-[10px]">ZaloPay</span>
                            <span className="px-2 py-1 border border-gray-200 rounded font-bold text-sky-500 text-[10px]">Fundiin</span>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-sm text-gray-900 uppercase mb-2">ĐĂNG KÝ NHẬN TIN KHUYẾN MÃI</h3>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-3">
                            <span className="text-red-600 font-bold block mb-1">Nhận ngay voucher 10%</span>
                            <p className="text-[11px] text-gray-500 leading-tight">
                                Voucher sẽ được gửi sau 24h, chỉ áp dụng cho khách hàng mới
                            </p>
                        </div>

                        <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
                            <div>
                                <label htmlFor="email-input" className="block text-gray-600 font-medium mb-1">Email</label>
                                <input
                                    id="email-input"
                                    type="email"
                                    placeholder="Nhập email của bạn"
                                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="phone-input" className="block text-gray-600 font-medium mb-1">Số điện thoại</label>
                                <input
                                    id="phone-input"
                                    type="tel"
                                    placeholder="Nhập số điện thoại của bạn"
                                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition-colors mt-2"
                            >
                                Đăng ký ngay
                            </button>
                        </form>
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-sm text-gray-900 mb-3">Thông tin và chính sách</h3>
                    <ul className="space-y-2 text-gray-600">
                        <li><Link href="#" className="hover:text-blue-600">Mua hàng và thanh toán Online</Link></li>
                        <li><Link href="#" className="hover:text-blue-600">Mua hàng trả góp</Link></li>
                        <li><Link href="#" className="hover:text-blue-600">Mua hàng trả góp bằng thẻ tín dụng</Link></li>
                        <li><Link href="#" className="hover:text-blue-600">Chính sách giao hàng</Link></li>
                        <li><Link href="#" className="hover:text-blue-600">Chính sách đổi trả</Link></li>
                        <li><Link href="#" className="hover:text-blue-600">Tra điểm Smember</Link></li>
                        <li><Link href="#" className="hover:text-blue-600">Xem ưu đãi Smember</Link></li>
                        <li><Link href="#" className="hover:text-blue-600">Tra thông tin bảo hành</Link></li>
                        <li><Link href="#" className="hover:text-blue-600">Tra cứu hoá đơn điện tử</Link></li>
                        <li><Link href="#" className="hover:text-blue-600">Thông tin hoá đơn mua hàng</Link></li>
                        <li><Link href="#" className="hover:text-blue-600">Trung tâm bảo hành chính hãng</Link></li>
                        <li><Link href="#" className="hover:text-blue-600">Quy định về việc sao lưu dữ liệu</Link></li>
                        <li><Link href="#" className="hover:text-blue-600">Chính sách khui hộp sản phẩm Apple</Link></li>
                        <li><Link href="#" className="hover:text-blue-600">VAT Refund</Link></li>
                    </ul>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="font-bold text-sm text-gray-900 mb-3">Dịch vụ và thông tin khác</h3>
                        <ul className="space-y-2 text-gray-600">
                            <li><Link href="#" className="hover:text-blue-600">Khách hàng doanh nghiệp (B2B)</Link></li>
                            <li><Link href="#" className="hover:text-blue-600">Ưu đãi thanh toán</Link></li>
                            <li><Link href="#" className="hover:text-blue-600">Quy chế hoạt động</Link></li>
                            <li><Link href="#" className="hover:text-blue-600">Chính sách bảo mật thông tin cá nhân</Link></li>
                            <li><Link href="#" className="hover:text-blue-600">Chính sách bảo mật dữ liệu đánh giá trên Zalo mini app</Link></li>
                            <li><Link href="#" className="hover:text-blue-600">Chính sách Bảo hành</Link></li>
                            <li><Link href="#" className="hover:text-blue-600">Liên hệ hợp tác kinh doanh</Link></li>
                            <li><Link href="#" className="hover:text-blue-600">Tuyển dụng</Link></li>
                            <li><Link href="#" className="hover:text-blue-600">Dịch vụ bảo hành mở rộng</Link></li>
                            <li><Link href="#" className="hover:text-blue-600">YouTube Shopping Affiliate</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-sm text-gray-900 mb-2">
                            Mua sắm dễ dàng – Ưu đãi ngập tràn cùng app KaitoStore
                        </h3>
                        <div className="flex items-center gap-3 mt-3">
                            <div className="w-20 h-20 bg-gray-900 text-white p-1.5 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                                <span className="text-[8px] font-bold tracking-widest uppercase">KAITO</span>
                                <div className="w-12 h-12 border-2 border-white my-0.5 flex items-center justify-center text-[8px]">
                                    QR CODE
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <button type="button" className="bg-black text-white px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 hover:bg-gray-800 transition-colors">
                                    <span>▶</span> Google Play
                                </button>
                                <button type="button" className="bg-black text-white px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 hover:bg-gray-800 transition-colors">
                                    <span>🍎</span> App Store
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="font-bold text-sm text-gray-900 mb-3">Kết nối với KaitoStore</h3>
                        <div className="flex items-center gap-2">
                            <button type="button" aria-label="Youtube" className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs hover:opacity-80 transition-opacity">▶</button>
                            <button type="button" aria-label="Facebook" className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs hover:opacity-80 transition-opacity">f</button>
                            <button type="button" aria-label="Instagram" className="w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold text-xs hover:opacity-80 transition-opacity">📷</button>
                            <button type="button" aria-label="TikTok" className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs hover:opacity-80 transition-opacity">🎵</button>
                            <button type="button" aria-label="Zalo" className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs hover:opacity-80 transition-opacity">Zalo</button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5" aria-hidden="true">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={direction === 'left' ? 'M15.75 19.5L8.25 12l7.5-7.5' : 'M8.25 4.5l7.5 7.5-7.5 7.5'}
            />
        </svg>
    );
}

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function usePrefersReducedMotion() {
    return useSyncExternalStore(
        (onChange) => {
            const mq = window.matchMedia(REDUCED_MOTION_QUERY);
            mq.addEventListener('change', onChange);
            return () => mq.removeEventListener('change', onChange);
        },
        () => window.matchMedia(REDUCED_MOTION_QUERY).matches, 
        () => false
    );
}

function HeroSlider() {
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);
    const reducedMotion = usePrefersReducedMotion();
    const count = HERO_SLIDES.length;

    const goTo = (index: number) => setCurrent((index + count) % count);

    useEffect(() => {
        if (paused || reducedMotion) return;
        const timer = setTimeout(() => setCurrent((c) => (c + 1) % count), HERO_INTERVAL);
        return () => clearTimeout(timer);
    }, [current, paused, reducedMotion, count]);

    return (
        <div
            role="region"
            aria-roledescription="carousel"
            aria-label="Khuyến mãi nổi bật"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
            className="group/hero lg:col-span-2 relative rounded-2xl overflow-hidden min-h-[400px] sm:min-h-[340px] bg-slate-950 text-white shadow-sm"
        >
            {HERO_SLIDES.map((slide, i) => {
                const active = i === current;
                const Heading = i === 0 ? 'h1' : 'h2';

                return (
                    <div
                        key={slide.id}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`${i + 1} / ${count}`}
                        aria-hidden={!active}
                        className={`absolute inset-0 transition-opacity duration-1000 motion-reduce:transition-none ${active ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                            }`}
                    >
                        <Image
                            src={slide.image}
                            alt=""
                            fill
                            priority={i === 0}
                            quality={90}
                            sizes="(max-width: 1024px) 100vw, 66vw"
                            className={`object-cover ease-out transition-transform motion-reduce:transition-none motion-reduce:scale-100 ${active ? 'scale-110 duration-[7000ms]' : 'scale-100 duration-[1200ms]'
                                }`}
                        />
                        {/* Chỉ tối phía có chữ, để phía bên phải của ảnh vẫn sáng và nét */}
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/45 to-transparent" />

                        <div className="relative z-10 h-full p-8 flex flex-col justify-between">
                            <div className="max-w-lg">
                                <span className="bg-red-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                                    {slide.tag}
                                </span>
                                <Heading className="text-3xl sm:text-4xl font-extrabold uppercase mt-4 mb-3 tracking-wide leading-tight">
                                    {slide.title}
                                </Heading>
                                <p className="text-xs sm:text-sm text-gray-100 font-medium leading-relaxed">
                                    {slide.description}
                                </p>
                            </div>
                            <div className="pt-6">
                                <Link
                                    href={slide.href}
                                    tabIndex={active ? 0 : -1}
                                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all text-xs uppercase tracking-wider shadow-md"
                                >
                                    {slide.cta}
                                </Link>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Mũi tên: màn lớn chỉ hiện khi rê chuột vào, màn nhỏ luôn hiện */}
            <button
                type="button"
                aria-label="Banner trước"
                onClick={() => goTo(current - 1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-all lg:opacity-0 lg:group-hover/hero:opacity-100 focus-visible:opacity-100"
            >
                <ChevronIcon direction="left" />
            </button>
            <button
                type="button"
                aria-label="Banner tiếp theo"
                onClick={() => goTo(current + 1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-all lg:opacity-0 lg:group-hover/hero:opacity-100 focus-visible:opacity-100"
            >
                <ChevronIcon direction="right" />
            </button>

            {/* Dấu chấm */}
            <div className="absolute bottom-4 right-6 z-20 flex items-center">
                {HERO_SLIDES.map((slide, i) => (
                    <button
                        key={slide.id}
                        type="button"
                        aria-label={`Chuyển đến banner ${i + 1}`}
                        aria-current={i === current}
                        onClick={() => goTo(i)}
                        className="p-1.5"
                    >
                        <span
                            className={`block h-2 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                                }`}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}

function ProductCard({ item, onAddToCart }: { item: Laptop; onAddToCart: (laptop: Laptop) => void }) {
    const isProductPhoto = item.image.startsWith('/');

    return (
        <div className="w-[280px] flex-shrink-0 snap-start bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
            <div>
                <div
                    className={`relative h-44 rounded-xl overflow-hidden mb-3 ${isProductPhoto ? 'bg-white border border-gray-100' : 'bg-gray-50'
                        }`}
                >
                    <span className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                        {item.badge}
                    </span>
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        quality={90}
                        sizes="280px"
                        className={`group-hover:scale-105 transition-transform duration-500 ${isProductPhoto ? 'object-contain p-3' : 'object-cover'
                            }`}
                    />
                </div>

                <h3 className="text-xs font-bold text-slate-800 line-clamp-2 min-h-[32px] group-hover:text-blue-600 transition-colors leading-snug">
                    {item.name}
                </h3>
            </div>

            <div className="mt-4">
                <div className="flex items-baseline justify-between mb-3">
                    <div>
                        <span className="text-base font-extrabold text-blue-600 block">{item.price}</span>
                        <span className="text-[11px] text-gray-400 line-through">{item.oldPrice}</span>
                    </div>
                    <span className="bg-red-50 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {item.discount}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={() => onAddToCart(item)}
                    className="w-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-bold text-xs py-2.5 rounded-xl transition-all"
                >
                    Thêm vào giỏ hàng
                </button>
            </div>
        </div>
    );
}

function FeaturedSection({ onAddToCart }: { onAddToCart: (laptop: Laptop) => void }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [paused, setPaused] = useState(false);
    const reducedMotion = usePrefersReducedMotion();
    const [scrollState, setScrollState] = useState({ canPrev: false, canNext: true, page: 0, pageCount: 1 });

    const updateScrollState = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;

        const maxScroll = el.scrollWidth - el.clientWidth;
        const pageCount = Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth));
        const page = maxScroll > 0 ? Math.round((el.scrollLeft / maxScroll) * (pageCount - 1)) : 0;

        setScrollState({
            canPrev: el.scrollLeft > 4,
            canNext: el.scrollLeft < maxScroll - 4,
            page,
            pageCount,
        });
    }, []);

    useEffect(() => {
        const frame = requestAnimationFrame(updateScrollState);
        window.addEventListener('resize', updateScrollState);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('resize', updateScrollState);
        };
    }, [updateScrollState]);

    const scrollByPage = (direction: 1 | -1) => {
        const el = scrollRef.current;
        if (!el) return;
        const step = CARD_WIDTH + CARD_GAP;
        const visibleCards = Math.max(1, Math.floor(el.clientWidth / step));
        el.scrollBy({ left: direction * visibleCards * step, behavior: 'smooth' });
    };

    const scrollToPage = (index: number) => {
        const el = scrollRef.current;
        if (!el) return;
        const maxScroll = el.scrollWidth - el.clientWidth;
        const { pageCount } = scrollState;
        el.scrollTo({ left: pageCount > 1 ? (index / (pageCount - 1)) * maxScroll : 0, behavior: 'smooth' });
    };

    useEffect(() => {
        if (paused || reducedMotion) return;
        const interval = setInterval(() => {
            const el = scrollRef.current;
            if (!el || document.hidden) return;
            const maxScroll = el.scrollWidth - el.clientWidth;
            if (el.scrollLeft >= maxScroll - 4) {
                el.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                el.scrollBy({ left: CARD_WIDTH + CARD_GAP, behavior: 'smooth' });
            }
        }, PRODUCT_AUTOPLAY_INTERVAL);
        return () => clearInterval(interval);
    }, [paused, reducedMotion]);

    const { canPrev, canNext, page, pageCount } = scrollState;
    const arrowClass =
        'w-9 h-9 rounded-full border border-gray-200 bg-white text-slate-700 flex items-center justify-center transition-colors hover:bg-blue-600 hover:text-white hover:border-blue-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-700 disabled:hover:border-gray-200';

    return (
        <section className="max-w-7xl mx-auto px-4 py-6" aria-label="Laptop nổi bật">
            <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-xl font-extrabold uppercase text-slate-900 tracking-tight">LAPTOP NỔI BẬT</h2>
                <div className="flex items-center gap-2">
                    <button type="button" aria-label="Xem sản phẩm trước" disabled={!canPrev} onClick={() => scrollByPage(-1)} className={arrowClass}>
                        <ChevronIcon direction="left" />
                    </button>
                    <button type="button" aria-label="Xem sản phẩm tiếp theo" disabled={!canNext} onClick={() => scrollByPage(1)} className={arrowClass}>
                        <ChevronIcon direction="right" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                onScroll={updateScrollState}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                onFocusCapture={() => setPaused(true)}
                onBlurCapture={() => setPaused(false)}
                className={`flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 ${NO_SCROLLBAR}`}
            >
                {FEATURED_LAPTOPS.map((item) => (
                    <ProductCard key={item.id} item={item} onAddToCart={onAddToCart} />
                ))}
            </div>

            {pageCount > 1 && (
                <div className="flex justify-center items-center">
                    {Array.from({ length: pageCount }).map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            aria-label={`Trang ${i + 1}`}
                            aria-current={i === page}
                            onClick={() => scrollToPage(i)}
                            className="p-1.5"
                        >
                            <span
                                className={`block h-2 rounded-full transition-all duration-300 ${i === page ? 'w-6 bg-blue-600' : 'w-2 bg-gray-300 hover:bg-gray-400'
                                    }`}
                            />
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
}

export default function HomePage() {
    const router = useRouter();
    const [cartCount, setCartCount] = useState<number>(2);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const checkAndSetUser = () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser && storedUser !== 'undefined') {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Lỗi khi đọc thông tin user từ localStorage:', error);
                setUser(null);
            }
        };

        checkAndSetUser();

        window.addEventListener('storage', checkAndSetUser);
        window.addEventListener('userLoginStateChanged', checkAndSetUser);

        return () => {
            window.removeEventListener('storage', checkAndSetUser);
            window.removeEventListener('userLoginStateChanged', checkAndSetUser);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.dispatchEvent(new Event('userLoginStateChanged'));
        router.refresh();
    };

    const handleAddToCart = (laptop?: Laptop) => {
        setCartCount((prev) => prev + 1);
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] text-slate-800 font-sans antialiased flex flex-col justify-between">
            <div>
                <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
                        <Link href="/" className="text-2xl font-black text-blue-600 tracking-wider flex-shrink-0">
                            KAITO STORE
                        </Link>

                        <div className="flex-1 max-w-2xl relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Bạn cần tìm laptop, linh kiện gì hôm nay?..."
                                className="w-full bg-gray-100/80 border border-gray-200 rounded-full py-2.5 pl-5 pr-10 text-sm focus:outline-none focus:bg-white focus:border-blue-500 transition-all placeholder:text-gray-400"
                            />
                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-base opacity-60 pointer-events-none">🔍</span>
                        </div>

                        <div className="flex items-center gap-5 flex-shrink-0">
                            <Link href="/cart" aria-label="Giỏ hàng" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.25 10.5a.75.75 0 100-1.5.75.75 0 000 1.5zm7.5 0a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                                </svg>
                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* Góc phải thanh Header / Navbar */}
                            <div className="flex items-center gap-4">
                                {user ? (
                                    /* Khi đã đăng nhập -> Hiện Avatar + Name + Logout */
                                    <div className="flex items-center gap-3 bg-slate-50 py-1.5 px-3 rounded-full border border-slate-200">
                                        <img
                                            src={
                                                user.avatar ||
                                                user.avatarUrl ||
                                                `https://ui-avatars.com/api/?name=${user.username}&background=2563eb&color=fff`
                                            }
                                            alt={user.username || 'User Avatar'}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                        <span className="text-xs font-bold text-slate-700">{user.username}</span>
                                        <button
                                            onClick={handleLogout}
                                            className="text-xs font-semibold text-red-500 hover:text-red-700 ml-1 transition-colors"
                                        >
                                            Thoát
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href="/login"
                                            className="text-xs font-bold text-slate-700 hover:text-blue-600 px-3 py-2 rounded-xl transition-all"
                                        >
                                            Đăng nhập
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-all shadow-sm"
                                        >
                                            Đăng ký
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#111827] text-white text-xs font-bold py-3">
                        <div className={`max-w-7xl mx-auto px-4 flex items-center gap-8 overflow-x-auto whitespace-nowrap ${NO_SCROLLBAR}`}>
                            <Link href="/laptop-moi" className="hover:text-blue-400 flex items-center gap-2">💻 Laptop Mới</Link>
                            <Link href="/laptop-cu" className="hover:text-blue-400 flex items-center gap-2">🖥️ Laptop Cũ</Link>
                            <Link href="/linh-kien" className="hover:text-blue-400 flex items-center gap-2">🔌 Linh Kiện Laptop</Link>
                            <Link href="/phu-kien" className="hover:text-blue-400 flex items-center gap-2">🎧 Đồ Công Nghệ</Link>
                            <Link href="/tra-cuu-bao-hanh" className="hover:text-blue-400 flex items-center gap-2">🛡️ Tra Cứu Bảo Hành</Link>
                            <Link href="/tra-gop" className="hover:text-blue-400 flex items-center gap-2">💳 Trả Góp 0%</Link>
                        </div>
                    </div>
                </header>

                {/* Banner Promotion */}
                <section className="max-w-7xl mx-auto px-4 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
                        <HeroSlider />

                        <div className="flex flex-col gap-4">
                            <div className="flex-1 relative rounded-2xl overflow-hidden p-6 text-white flex flex-col justify-between min-h-[155px] shadow-sm">
                                <Image
                                    src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=85&w=1000&auto=format"
                                    alt="Bảo hành điện tử"
                                    fill
                                    quality={90}
                                    sizes="(max-width: 1024px) 100vw, 33vw"
                                    className="object-cover -z-0"
                                />
                                {/* Màu phủ đậm ở phía chữ, nhạt dần sang phải để lộ ảnh */}
                                <div className="absolute inset-0 bg-gradient-to-r from-red-700/95 via-red-600/75 to-red-500/25 -z-0" />
                                <div className="relative z-10">
                                    <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                                        DỊCH VỤ
                                    </span>
                                    <h3 className="text-xl font-extrabold mt-2 uppercase tracking-wide">BẢO HÀNH ĐIỆN TỬ</h3>
                                    <p className="text-xs opacity-90 font-medium mt-1">Nhanh chóng - Tiện lợi - Uy tín 100%</p>
                                </div>
                                <Link href="/tra-cuu-bao-hanh" className="relative z-10 text-xs font-bold flex items-center gap-1 mt-2 hover:underline">
                                    Xem chi tiết ➔
                                </Link>
                            </div>

                            <div className="flex-1 relative rounded-2xl overflow-hidden p-6 text-white flex flex-col justify-between min-h-[155px] shadow-sm">
                                <Image
                                    src="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=85&w=1000&auto=format"
                                    alt="Tri ân khách hàng"
                                    fill
                                    quality={90}
                                    sizes="(max-width: 1024px) 100vw, 33vw"
                                    className="object-cover -z-0"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/75 to-blue-900/25 -z-0" />
                                <div className="relative z-10">
                                    <span className="bg-white/10 text-blue-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                                        TRI ÂN KHÁCH HÀNG
                                    </span>
                                    <h3 className="text-xl font-extrabold mt-2 uppercase tracking-wide">TẶNG TỚI 1 TRIỆU</h3>
                                    <p className="text-xs opacity-80 font-medium mt-1">Dành riêng cho khách hàng cũ mua lại</p>
                                </div>
                                <Link href="/laptop-moi" className="relative z-10 text-xs font-bold flex items-center gap-1 mt-2 text-blue-400 hover:underline">
                                    Nhận ưu đãi ngay ➔
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Danh Sách Laptop Nổi Bật */}
                <FeaturedSection onAddToCart={handleAddToCart} />

                {/* Khối Thông Tin Ưu Điểm Dịch Vụ */}
                <section className="max-w-7xl mx-auto px-4 py-8 border-t border-gray-200/80 mt-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="flex flex-col items-center">
                            <span className="text-2xl mb-2">🚚</span>
                            <h4 className="text-xs font-bold text-slate-900 uppercase">Giao Hàng Toàn Quốc</h4>
                            <p className="text-[11px] text-gray-500 mt-0.5">Miễn phí vận chuyển đơn từ 500k</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl mb-2">🛡️</span>
                            <h4 className="text-xs font-bold text-slate-900 uppercase">Bảo Hành Chính Hãng</h4>
                            <p className="text-[11px] text-gray-500 mt-0.5">1 đổi 1 trong 30 ngày đầu</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl mb-2">💳</span>
                            <h4 className="text-xs font-bold text-slate-900 uppercase">Trả Góp 0% Lãi Suất</h4>
                            <p className="text-[11px] text-gray-500 mt-0.5">Thủ tục nhanh gọn, duyệt 5 phút</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl mb-2">🎧</span>
                            <h4 className="text-xs font-bold text-slate-900 uppercase">Hỗ Trợ 24/7</h4>
                            <p className="text-[11px] text-gray-500 mt-0.5">Tư vấn tận tâm, chuyên nghiệp</p>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </div>
    );
}