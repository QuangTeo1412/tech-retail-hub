'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { clearSession, getToken } from '../app/lib/api';
import { useStoredUser } from '../app/lib/hooks';

const NAV_ITEMS = [
    { href: '/admin', label: 'Tổng quan', icon: '📊' },
    { href: '/admin/products', label: 'Sản phẩm', icon: '💻' },
    { href: '/admin/orders', label: 'Đơn hàng', icon: '🧾' },
];

/** Khung sườn cho toàn bộ trang /admin: kiểm tra đăng nhập + quyền Admin, sidebar điều hướng. */
export default function AdminShell({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const user = useStoredUser();
    const isAdmin = user?.role === 'Admin';

    useEffect(() => {
        if (!getToken()) {
            router.replace('/login');
            return;
        }
        // user === null lúc mới vào có thể do localStorage chưa kịp đọc, không vội chuyển hướng
        if (user && !isAdmin) {
            router.replace('/');
        }
    }, [user, isAdmin, router]);

    const handleLogout = () => {
        clearSession();
        router.push('/login');
    };

    // Việc chặn ở đây chỉ để giao diện gọn gàng khi chưa đủ quyền; quyền thật sự do backend
    // kiểm tra bằng [Authorize(Roles = "Admin")] trên từng API, nên không thể "vượt" chỉ bằng cách sửa localStorage.
    if (!getToken() || (user && !isAdmin)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
                <p className="text-sm text-gray-500">Đang kiểm tra quyền truy cập...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa] text-slate-800 font-sans antialiased flex">
            <aside className="w-60 flex-shrink-0 bg-slate-900 text-white flex flex-col">
                <div className="px-5 py-5 border-b border-white/10">
                    <Link href="/" className="text-lg font-extrabold tracking-wide">
                        KAITO STORE
                    </Link>
                    <p className="text-[11px] text-slate-400 mt-0.5">Trang quản trị</p>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${active ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <span aria-hidden="true">{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="px-3 py-4 border-t border-white/10 space-y-1">
                    <Link href="/" className="block px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors">
                        ← Về trang chủ
                    </Link>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-red-300 hover:text-red-200 transition-colors"
                    >
                        Đăng xuất
                    </button>
                </div>
            </aside>

            <main className="flex-1 min-w-0 p-6 lg:p-8">{children}</main>
        </div>
    );
}