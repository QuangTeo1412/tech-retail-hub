import Link from 'next/link';
import Image from 'next/image';


export function PromoBanners() {
    return (
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
    );
}

export function ServiceHighlights() {
    return (
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
    );
}
