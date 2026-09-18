'use client';

import Link from 'next/link';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            {}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-black text-blue-600 tracking-wide">
                        KAITO STORE
                    </Link>

                    <div className="flex items-center space-x-4">
                        <Link
                            href="/login"
                            className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition"
                        >
                            Đăng nhập
                        </Link>
                        <Link
                            href="/register"
                            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                        >
                            Đăng ký
                        </Link>
                    </div>
                </div>
            </header>

            {}
            <main className="max-w-7xl mx-auto px-6 py-12 text-center">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
                    Chào mừng đến với KAITOSTORE!
                </h1>
                <p className="text-gray-600 text-lg">
                    Trang chủ đang được chuẩn bị. Bro đi chợ về rồi chúng ta cùng làm tiếp nhé!
                </p>
            </main>
        </div>
    );
}