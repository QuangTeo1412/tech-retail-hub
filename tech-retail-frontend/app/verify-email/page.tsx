'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Be_Vietnam_Pro } from 'next/font/google';

const beVietnam = Be_Vietnam_Pro({
    subsets: ['vietnamese', 'latin'],
    weight: ['400', '500', '600', '700', '800'],
    display: 'swap',
});

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:5000/api';

type Status = 'verifying' | 'success' | 'error';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [status, setStatus] = useState<Status>(() => (!token ? 'error' : 'verifying'));
    const [message, setMessage] = useState(() => (!token ? 'Liên kết xác nhận không hợp lệ (thiếu mã token).' : ''));

    const [resendEmail, setResendEmail] = useState('');
    const [resendSent, setResendSent] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    useEffect(() => {
        if (!token) return;

        fetch(`${API_URL}/auth/verify-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
        })
            .then(async (res) => {
                const data = await res.json().catch(() => null);
                if (!res.ok) throw new Error(data?.message ?? 'Xác nhận email thất bại.');
                setStatus('success');
                setMessage(data?.message ?? 'Xác nhận email thành công!');
            })
            .catch((err: unknown) => {
                setStatus('error');
                setMessage(err instanceof Error ? err.message : 'Có lỗi xảy ra, vui lòng thử lại.');
            });
    }, [token]);

    const handleResend = async (e: React.FormEvent) => {
        e.preventDefault();
        setResendLoading(true);
        try {
            await fetch(`${API_URL}/auth/resend-verification`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: resendEmail.trim() }),
            });
            setResendSent(true);
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <main className={`${beVietnam.className} min-h-screen bg-slate-900 flex items-center justify-center p-4 antialiased`}>
            <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 text-center">
                {status === 'verifying' && (
                    <>
                        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-sm font-semibold text-slate-600">Đang xác nhận email...</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4 text-2xl text-green-600 font-bold">✓</div>
                        <h1 className="text-lg font-extrabold text-slate-900 mb-2">Xác nhận thành công</h1>
                        <p className="text-sm text-slate-600 mb-6">{message}</p>
                        <Link
                            href="/login"
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all"
                        >
                            Đăng nhập ngay
                        </Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4 text-2xl text-red-600 font-bold">!</div>
                        <h1 className="text-lg font-extrabold text-slate-900 mb-2">Không xác nhận được</h1>
                        <p className="text-sm text-slate-600 mb-6">{message}</p>

                        {!resendSent ? (
                            <form onSubmit={handleResend} className="space-y-3 text-left">
                                <label htmlFor="resend-email" className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                                    Gửi lại email xác nhận
                                </label>
                                <input
                                    id="resend-email"
                                    type="email"
                                    required
                                    value={resendEmail}
                                    onChange={(e) => setResendEmail(e.target.value)}
                                    placeholder="Nhập email đã đăng ký"
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-slate-900"
                                />
                                <button
                                    type="submit"
                                    disabled={resendLoading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all disabled:opacity-50"
                                >
                                    {resendLoading ? 'Đang gửi...' : 'Gửi lại email xác nhận'}
                                </button>
                            </form>
                        ) : (
                            <p className="text-xs font-semibold text-green-600 bg-green-50 border border-green-200 rounded-xl p-3">
                                Nếu email tồn tại và chưa xác nhận, chúng tôi đã gửi lại thư xác nhận. Vui lòng kiểm tra hộp thư.
                            </p>
                        )}

                        <Link href="/login" className="block text-center text-xs font-bold text-blue-600 hover:underline mt-5">
                            Về trang đăng nhập
                        </Link>
                    </>
                )}
            </div>
        </main>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={null}>
            <VerifyEmailContent />
        </Suspense>
    );
}