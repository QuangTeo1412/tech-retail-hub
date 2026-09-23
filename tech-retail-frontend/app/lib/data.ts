export const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
    Pending: 'Chờ thanh toán',
    Processing: 'Đang xử lý',
    Shipped: 'Đang giao',
    Delivered: 'Đã giao',
    Cancelled: 'Đã hủy',
};

export interface HeroSlide {
    id: number;
    tag: string;
    title: string;
    description: string;
    cta: string;
    href: string;
    image: string;
}

export const NO_SCROLLBAR = '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden';

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