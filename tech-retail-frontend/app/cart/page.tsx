'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Be_Vietnam_Pro } from 'next/font/google';
import { ApiError, apiFetch, clearSession, formatVnd, getToken } from '../lib/api';

const beVietnam = Be_Vietnam_Pro({
    subsets: ['vietnamese', 'latin'],
    weight: ['400', '500', '600', '700', '800'],
    display: 'swap',
});

interface CartItem {
    id: number;
    productId: number;
    productName: string;
    productPrice: number;
    quantity: number;
    totalPrice: number;
}

export default function CartPage() {
    const router = useRouter();
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [removingId, setRemovingId] = useState<number | null>(null);
    const [paying, setPaying] = useState(false);
    const [pendingOrderId, setPendingOrderId] = useState<number | null>(null);

    const handleAuthError = useCallback(
        (err: unknown): boolean => {
            if (err instanceof ApiError && err.status === 401) {
                clearSession();
                router.replace('/login');
                return true;
            }
            return false;
        },
        [router]
    );

    useEffect(() => {
        if (!getToken()) {
            router.replace('/login');
            return;
        }

        let cancelled = false;
        (async () => {
            try {
                const data = await apiFetch<CartItem[]>('/api/Cart');
                if (!cancelled) setItems(data);
            } catch (err) {
                if (cancelled) return;
                if (err instanceof ApiError && err.status === 401) {
                    clearSession();
                    router.replace('/login');
                } else {
                    setError(err instanceof Error ? err.message : 'Không tải được giỏ hàng.');
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [router]);

    useEffect(() => {
        const onPageShow = (e: PageTransitionEvent) => {
            if (e.persisted) setPaying(false);
        };
        window.addEventListener('pageshow', onPageShow);
        return () => window.removeEventListener('pageshow', onPageShow);
    }, []);

    const handleRemove = async (id: number) => {
        setRemovingId(id);
        setError('');
        try {
            await apiFetch(`/api/Cart/remove/${id}`, { method: 'DELETE' });
            setItems((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
            if (!handleAuthError(err)) {
                setError(err instanceof Error ? err.message : 'Không thể xóa sản phẩm.');
            }
        } finally {
            setRemovingId(null);
        }
    };

    const handlePay = async () => {
        setPaying(true);
        setError('');
        try {
            let orderId = pendingOrderId;

            if (orderId === null) {
                const order = await apiFetch<{ orderId: number }>('/api/Order/checkout', { method: 'POST' });
                orderId = order.orderId;
                setPendingOrderId(orderId);
                setItems([]);
            }

            const { paymentUrl } = await apiFetch<{ paymentUrl: string }>(
                `/api/Payment/create-vnpay-url/${orderId}`,
                { method: 'POST' }
            );
            window.location.href = paymentUrl;
        } catch (err) {
            if (!handleAuthError(err)) {
                setError(err instanceof Error ? err.message : 'Không thể thanh toán, vui lòng thử lại.');
            }
            setPaying(false);
        }
    };

    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);

    return (
        <div className={`${beVietnam.className} min-h-screen bg-[#f8f9fa] text-slate-800 antialiased`}>
            <header className="bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="text-xl font-extrabold text-blue-600 tracking-wider">
                        KAITO STORE
                    </Link>
                    <Link href="/" className="text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors">
                        ← Tiếp tục mua sắm
                    </Link>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-extrabold text-slate-900 mb-6">Giỏ hàng của bạn</h1>

                {error && (
                    <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-bold">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start" aria-busy="true">
                        <span className="sr-only">Đang tải giỏ hàng...</span>
                        <ul className="lg:col-span-2 space-y-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <li
                                    key={i}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 animate-pulse"
                                >
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                                        <div className="h-3 bg-gray-100 rounded w-1/3" />
                                    </div>
                                    <div className="h-4 bg-gray-200 rounded w-24" />
                                    <div className="h-4 bg-gray-100 rounded w-8" />
                                </li>
                            ))}
                        </ul>
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                            <div className="h-3 bg-gray-100 rounded w-full" />
                            <div className="h-5 bg-gray-200 rounded w-2/3" />
                            <div className="h-11 bg-gray-200 rounded-xl" />
                        </div>
                    </div>
                ) : pendingOrderId !== null ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                        <p className="text-sm text-slate-700">
                            Đơn hàng <b>#{pendingOrderId}</b> đã được tạo và đang chờ thanh toán.
                        </p>
                        <button
                            type="button"
                            onClick={handlePay}
                            disabled={paying}
                            className="mt-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {paying ? 'Đang chuyển tới VNPay...' : `Thanh toán đơn #${pendingOrderId}`}
                        </button>
                    </div>
                ) : items.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                        <p className="text-sm text-slate-600">Giỏ hàng của bạn đang trống.</p>
                        <Link
                            href="/"
                            className="inline-block mt-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors"
                        >
                            Mua sắm ngay
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        <ul className="lg:col-span-2 space-y-3">
                            {items.map((item) => (
                                <li
                                    key={item.id}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4"
                                >
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-sm font-bold text-slate-900 line-clamp-2">{item.productName}</h2>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {formatVnd(item.productPrice)} × {item.quantity}
                                        </p>
                                    </div>
                                    <div className="text-sm font-extrabold text-blue-600 whitespace-nowrap">
                                        {formatVnd(item.totalPrice)}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemove(item.id)}
                                        disabled={removingId === item.id || paying}
                                        aria-label={`Xóa ${item.productName} khỏi giỏ hàng`}
                                        className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        {removingId === item.id ? 'Đang xóa...' : 'Xóa'}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <aside className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide mb-4">Tóm tắt đơn hàng</h2>
                            <div className="flex justify-between text-sm text-slate-600 mb-2">
                                <span>Số sản phẩm</span>
                                <span className="font-bold text-slate-800">{totalQuantity}</span>
                            </div>
                            <div className="flex justify-between items-baseline border-t border-gray-100 pt-3 mt-3">
                                <span className="text-sm font-bold text-slate-800">Tổng cộng</span>
                                <span className="text-lg font-extrabold text-blue-600">{formatVnd(totalPrice)}</span>
                            </div>
                            <button
                                type="button"
                                onClick={handlePay}
                                disabled={paying}
                                className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {paying ? 'Đang chuyển tới VNPay...' : 'Đặt hàng & thanh toán VNPay'}
                            </button>
                            <p className="text-[11px] text-gray-500 mt-3 leading-relaxed">
                                Bạn sẽ được chuyển sang cổng thanh toán VNPay. Link thanh toán có thời hạn, vui lòng hoàn tất ngay.
                            </p>
                        </aside>
                    </div>
                )}
            </main>
        </div>
    );
}