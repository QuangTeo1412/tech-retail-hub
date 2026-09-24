'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Be_Vietnam_Pro } from 'next/font/google';

const beVietnam = Be_Vietnam_Pro({
    subsets: ['vietnamese', 'latin'],
    weight: ['400', '500', '600', '700', '800'],
    display: 'swap',
});

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:5000/api';

const INPUT_CLASS =
    'w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email.trim()) {
            setError('Vui lòng nhập email.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => null);
                throw new Error(data?.message ?? 'Có lỗi xảy ra, vui lòng thử lại.');
            }
            // Backend luôn trả cùng 1 thông điệp dù email có tồn tại hay không -> không lộ dữ liệu người dùng
            setSent(true);
        } catch (err: unknown) {
            if (err instanceof TypeError) setError('Không kết nối được tới máy chủ, vui lòng thử lại sau.');
            else if (err instanceof Error) setError(err.message);
            else setError('Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className={`${beVietnam.className} min-h-screen bg-slate-900 flex items-center justify-center p-4 antialiased`}>
            <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-slate-100">
                <header className="text-center mb-8">
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight uppercase mb-1.5">Quên mật khẩu</h1>
                    <p className="text-sm font-semibold text-slate-600">Nhập email để nhận hướng dẫn đặt lại mật khẩu</p>
                </header>

                {sent ? (
                    <div className="text-center">
                        <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4 text-2xl">✉️</div>
                        <p className="text-sm text-slate-700 font-semibold mb-6">
                            Nếu email này tồn tại trong hệ thống, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu. Vui lòng kiểm tra hộp thư
                            (kể cả mục spam).
                        </p>
                        <Link href="/login" className="text-blue-600 font-bold text-xs hover:underline">
                            Về trang đăng nhập
                        </Link>
                    </div>
                ) : (
                    <>
                        {error && (
                            <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-semibold text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} noValidate className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-xs font-bold text-slate-800 tracking-wider uppercase mb-2">
                                    Địa chỉ email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="phantom@gmail.com"
                                    className={INPUT_CLASS}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold tracking-wider uppercase py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Đang gửi...' : 'Gửi hướng dẫn đặt lại'}
                            </button>
                        </form>

                        <p className="text-center text-xs font-semibold text-slate-600 mt-8">
                            Đã nhớ mật khẩu?{' '}
                            <Link href="/login" className="text-blue-600 font-bold hover:underline">
                                Đăng nhập
                            </Link>
                        </p>
                    </>
                )}
            </div>
        </main>
    );
}
