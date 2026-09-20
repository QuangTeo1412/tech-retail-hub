'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Be_Vietnam_Pro } from 'next/font/google';
import { ApiError, apiFetch, clearSession, formatVnd } from '../lib/api';

const beVietnam = Be_Vietnam_Pro({
    subsets: ['vietnamese', 'latin'],
    weight: ['400', '500', '600', '700', '800'],
    display: 'swap',
});

type Tone = 'success' | 'warning' | 'error' | 'neutral';

const TONE_STYLES: Record<Tone, { circle: string; icon: string; title: string }> = {
    success: { circle: 'bg-emerald-50', icon: 'text-emerald-600', title: 'text-emerald-700' },
    warning: { circle: 'bg-amber-50', icon: 'text-amber-600', title: 'text-amber-700' },
    error: { circle: 'bg-red-50', icon: 'text-red-600', title: 'text-red-700' },
    neutral: { circle: 'bg-slate-100', icon: 'text-slate-500', title: 'text-slate-700' },
};

const ICON_PATHS: Record<Tone, string> = {
    success: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    warning: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
    error: 'M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    neutral: 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z',
};

function ResultCard({
    tone,
    title,
    children,
}: {
    tone: Tone;
    title: string;
    children: React.ReactNode;
}) {
    const style = TONE_STYLES[tone];
    return (
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-100 shadow-lg p-8 text-center">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${style.circle}`}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`w-9 h-9 ${style.icon}`}
                    aria-hidden="true"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d={ICON_PATHS[tone]} />
                </svg>
            </div>
            <h1 className={`mt-5 text-2xl font-extrabold ${style.title}`}>{title}</h1>
            {children}
        </div>
    );
}

const PRIMARY_BTN =
    'inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
const SECONDARY_BTN =
    'inline-block bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-600 text-slate-700 font-bold text-sm px-6 py-3 rounded-xl transition-colors';

function PaymentResultContent() {
    const router = useRouter();
    const params = useSearchParams();

    const rawStatus = params.get('status');
    const status: 'success' | 'failed' | 'invalid' =
        rawStatus === 'success' || rawStatus === 'failed' ? rawStatus : 'invalid';

    const orderIdNumber = Number(params.get('orderId'));
    const orderId = Number.isInteger(orderIdNumber) && orderIdNumber > 0 ? orderIdNumber : null;

    const needsCheck = status === 'success' && orderId !== null;
    const [checked, setChecked] = useState(!needsCheck);
    const [orderInfo, setOrderInfo] = useState<{ total: number; status: string } | null>(null);
    const [paying, setPaying] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!needsCheck) return;

        let cancelled = false;
        (async () => {
            try {
                const orders = await apiFetch<{ id: number; totalAmount: number; status: string }[]>('/api/Order/my-orders');
                const found = orders.find((o) => o.id === orderId);
                if (!cancelled && found) {
                    setOrderInfo({ total: found.totalAmount, status: found.status });
                }
            } catch {

            } finally {
                if (!cancelled) setChecked(true);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [needsCheck, orderId]);

    useEffect(() => {
        const onPageShow = (e: PageTransitionEvent) => {
            if (e.persisted) setPaying(false);
        };
        window.addEventListener('pageshow', onPageShow);
        return () => window.removeEventListener('pageshow', onPageShow);
    }, []);

    const handleRetry = async () => {
        if (orderId === null) return;
        setPaying(true);
        setError('');
        try {
            const { paymentUrl } = await apiFetch<{ paymentUrl: string }>(
                `/api/Payment/create-vnpay-url/${orderId}`,
                { method: 'POST' }
            );
            window.location.href = paymentUrl;
        } catch (err) {
            if (err instanceof ApiError && err.status === 401) {
                clearSession();
                router.replace('/login');
                return;
            }
            setError(err instanceof Error ? err.message : 'Không thể tạo lại link thanh toán.');
            setPaying(false);
        }
    };

    if (!checked) {
        return <p className="text-sm text-gray-500">Đang xác nhận kết quả thanh toán...</p>;
    }

    const paid = status === 'success' && !(orderInfo && orderInfo.status === 'Pending');

    if (paid) {
        return (
            <ResultCard tone="success" title="Thanh toán thành công!">
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    Cảm ơn bạn đã mua sắm tại KAITO STORE. Đơn hàng <b>#{orderId}</b> đã được ghi nhận
                    {orderInfo ? (
                        <>
                            {' '}
                            với số tiền <b>{formatVnd(orderInfo.total)}</b>
                        </>
                    ) : null}
                    .
                </p>
                <p className="mt-2 text-xs text-gray-500">Chúng tôi đã gửi email xác nhận tới hộp thư của bạn.</p>
                <div className="mt-6">
                    <Link href="/" className={PRIMARY_BTN}>
                        Tiếp tục mua sắm
                    </Link>
                </div>
            </ResultCard>
        );
    }

    if (status === 'success') {
        return (
            <ResultCard tone="warning" title="Đang xác nhận thanh toán">
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    Hệ thống chưa ghi nhận thanh toán cho đơn hàng <b>#{orderId}</b>. Vui lòng chờ một lát rồi kiểm tra lại.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <button type="button" onClick={() => window.location.reload()} className={PRIMARY_BTN}>
                        Kiểm tra lại
                    </button>
                    <Link href="/" className={SECONDARY_BTN}>
                        Về trang chủ
                    </Link>
                </div>
            </ResultCard>
        );
    }

    if (status === 'failed') {
        return (
            <ResultCard tone="error" title="Thanh toán chưa hoàn tất">
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    Giao dịch đã bị hủy hoặc không thành công.
                    {orderId !== null ? (
                        <>
                            {' '}
                            Đơn hàng <b>#{orderId}</b> vẫn được giữ, bạn có thể thanh toán lại.
                        </>
                    ) : null}
                </p>
                {error && (
                    <p role="alert" className="mt-3 text-xs font-bold text-red-600">
                        {error}
                    </p>
                )}
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                    {orderId !== null && (
                        <button type="button" onClick={handleRetry} disabled={paying} className={PRIMARY_BTN}>
                            {paying ? 'Đang chuyển tới VNPay...' : 'Thanh toán lại'}
                        </button>
                    )}
                    <Link href="/" className={SECONDARY_BTN}>
                        Về trang chủ
                    </Link>
                </div>
            </ResultCard>
        );
    }

    return (
        <ResultCard tone="neutral" title="Không xác thực được kết quả">
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Chúng tôi không thể xác thực kết quả thanh toán này. Nếu bạn đã bị trừ tiền, vui lòng liên hệ hỗ trợ.
            </p>
            <div className="mt-6">
                <Link href="/" className={PRIMARY_BTN}>
                    Về trang chủ
                </Link>
            </div>
        </ResultCard>
    );
}

export default function PaymentResultPage() {
    return (
        <main
            className={`${beVietnam.className} min-h-screen bg-[#f8f9fa] text-slate-800 antialiased flex items-center justify-center p-4`}
        >
            {/* useSearchParams bắt buộc nằm trong Suspense */}
            <Suspense fallback={<p className="text-sm text-gray-500">Đang tải...</p>}>
                <PaymentResultContent />
            </Suspense>
        </main>
    );
}