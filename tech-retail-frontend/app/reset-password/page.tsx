'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Be_Vietnam_Pro } from 'next/font/google';

const beVietnam = Be_Vietnam_Pro({
    subsets: ['vietnamese', 'latin'],
    weight: ['400', '500', '600', '700', '800'],
    display: 'swap',
});

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:5000/api';
const MIN_PASSWORD_LENGTH = 8;

const INPUT_CLASS =
    'w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm';

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token') ?? '';

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!token) {
        return (
            <main className={`${beVietnam.className} min-h-screen bg-slate-900 flex items-center justify-center p-4 antialiased`}>
                <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 text-center">
                    <h1 className="text-lg font-extrabold text-slate-900 mb-2">Liên kết không hợp lệ</h1>
                    <p className="text-sm text-slate-600 mb-6">Thiếu mã đặt lại mật khẩu. Vui lòng yêu cầu lại từ đầu.</p>
                    <Link href="/forgot-password" className="text-blue-600 font-bold text-xs hover:underline">
                        Yêu cầu đặt lại mật khẩu
                    </Link>
                </div>
            </main>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!newPassword || newPassword.length < MIN_PASSWORD_LENGTH) {
            setError(`Mật khẩu phải có ít nhất ${MIN_PASSWORD_LENGTH} ký tự.`);
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword, confirmPassword }),
            });
            const data = await res.json().catch(() => null);
            if (!res.ok) throw new Error(data?.message ?? 'Đặt lại mật khẩu thất bại.');

            setSuccess(true);
            setTimeout(() => router.push('/login'), 2000);
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
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight uppercase mb-1.5">Đặt lại mật khẩu</h1>
                    <p className="text-sm font-semibold text-slate-600">Nhập mật khẩu mới cho tài khoản của bạn</p>
                </header>

                {success ? (
                    <div className="text-center">
                        <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
                        <p className="text-sm text-slate-700 font-semibold">Đặt lại mật khẩu thành công! Đang chuyển đến trang đăng nhập...</p>
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
                                <label htmlFor="new-password" className="block text-xs font-bold text-slate-800 tracking-wider uppercase mb-2">
                                    Mật khẩu mới
                                </label>
                                <input
                                    id="new-password"
                                    type="password"
                                    autoComplete="new-password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className={INPUT_CLASS}
                                />
                            </div>

                            <div>
                                <label htmlFor="confirm-password" className="block text-xs font-bold text-slate-800 tracking-wider uppercase mb-2">
                                    Xác nhận mật khẩu mới
                                </label>
                                <input
                                    id="confirm-password"
                                    type="password"
                                    autoComplete="new-password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className={INPUT_CLASS}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold tracking-wider uppercase py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </main>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={null}>
            <ResetPasswordContent />
        </Suspense>
    );
}
