'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks';
import { NO_SCROLLBAR } from '@/lib/data';

interface HeaderProps {
    cartCount: number;
}

export default function Header({ cartCount }: HeaderProps) {
    const { user, logout } = useAuth();
    const [searchQuery, setSearchQuery] = useState<string>('');

    return (
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
                                    onClick={logout}
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
    );
}
