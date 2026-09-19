export interface Laptop {
    id: number;
    name: string;
    price: string;
    oldPrice: string;
    discount: string;
    badge: string;
    image: string;
}
export interface User {
    username?: string;
    name?: string;
    email?: string;
    avatar?: string;
    avatarUrl?: string;
    image?: string;
}
export interface HeroSlide {
    id: number;
    tag: string;
    title: string;
    description: string;
    cta: string;
    href: string;
    image: string;
}
export const NO_SCROLLBAR =
    '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden';

export const HERO_INTERVAL = 6000;
export const PRODUCT_AUTOPLAY_INTERVAL = 6000;
export const CARD_WIDTH = 280;
export const CARD_GAP = 16;

export const HERO_SLIDES: HeroSlide[] = [
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

export const FEATURED_LAPTOPS: Laptop[] = [
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
