'use client';

import Link from 'next/link';

export default function Footer() {
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
