export default function StaticSections() {
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
