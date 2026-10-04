'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Be_Vietnam_Pro } from 'next/font/google';
import { ApiError, apiFetch, clearSession, formatVnd, getToken, resolveImageUrl } from '../lib/api';

const beVietnam = Be_Vietnam_Pro({
    subsets: ['vietnamese', 'latin'],
    weight: ['400', '500', '600', '700', '800'],
    display: 'swap',
});

interface OrderItemView {
    id?: number;
    productId: number;
    quantity: number;
    price: number;
    product?: {
        id?: number;
        name?: string | null;
        imageUrl?: string | null;
    } | null;
}

interface OrderView {
    id: number;
    orderDate: string;
    status: string;
    totalAmount: number;
    orderItems: OrderItemView[];
}

const STATUS_META: Record<string, { label: string; className: string }> = {
    Pending: { label: 'Chờ thanh toán', className: 'bg-amber-50 text-amber-700 border-amber-200' },
    Processing: { label: 'Đang xử lý', className: 'bg-blue-50 text-blue-700 border-blue-200' },
    Shipped: { label: 'Đang giao', className: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    Delivered: { label: 'Đã giao', className: 'bg-green-50 text-green-700 border-green-200' },
    Cancelled: { label: 'Đã hủy', className: 'bg-red-50 text-red-700 border-red-200' },
};

function StatusBadge({ status }: { status: string }) {
    const meta = STATUS_META[status] ?? { label: status, className: 'bg-gray-50 text-gray-600 border-gray-200' };
    return (
        <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full border ${meta.className}`}>
            {meta.label}
        </span>
    );
}

function formatDate(iso: string): string {
    try {
        return new Date(iso).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return iso;
    }
}

function OrderItemRow({ item }: { item: OrderItemView }) {
    const name = item.product?.name ?? '(Sản phẩm đã bị xóa)';
    const image = resolveImageUrl({
        id: item.product?.id ?? item.productId,
        name,
        price: item.price,
        imageUrl: item.product?.imageUrl,
    });

    return (
        <div className="flex items-center gap-3 py-2.5">
            <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={image} alt={name} loading="lazy" className="absolute inset-0 w-full h-full object-contain p-1" />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-lg" role="presentation">
                        💻
                    </div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 line-clamp-1">{name}</p>
                <p className="text-xs text-gray-500">
                    {formatVnd(item.price)} × {item.quantity}
                </p>
            </div>
            <div className="text-sm font-bold text-slate-700 whitespace-nowrap">
                {formatVnd(item.price * item.quantity)}
            </div>
        </div>
    );
}

export default function MyOrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<OrderView[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [payingId, setPayingId] = useState<number | null>(null);

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
                const data = await apiFetch<OrderView[]>('/api/Order/my-orders');
                if (!cancelled) setOrders(data);
            } catch (err) {
                if (cancelled) return;
                if (!handleAuthError(err)) {
                    setError(err instanceof Error ? err.message : 'Không tải được danh sách đơn hàng.');
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [router, handleAuthError]);

    const handlePayAgain = async (orderId: number) => {
        setPayingId(orderId);
        setError('');
        try {
            const { paymentUrl } = await apiFetch<{ paymentUrl: string }>(
                `/api/Payment/create-vnpay-url/${orderId}`,
                { method: 'POST' }
            );
            window.location.assign(paymentUrl);
        } catch (err) {
            if (!handleAuthError(err)) {
                setError(err instanceof Error ? err.message : 'Không thể thanh toán, vui lòng thử lại.');
            }
            setPayingId(null);
        }
    };

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
                <h1 className="text-2xl font-extrabold text-slate-900 mb-6">Đơn hàng của tôi</h1>

                {error && (
                    <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-bold">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="space-y-4" aria-busy="true">
                        <span className="sr-only">Đang tải đơn hàng...</span>
                        {Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-1/3" />
                                <div className="h-12 bg-gray-100 rounded" />
                                <div className="h-4 bg-gray-200 rounded w-1/4 ml-auto" />
                            </div>
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                        <p className="text-sm text-slate-600">Bạn chưa có đơn hàng nào.</p>
                        <Link
                            href="/"
                            className="inline-block mt-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors"
                        >
                            Mua sắm ngay
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
                                    <div>
                                        <p className="text-sm font-extrabold text-slate-900">Đơn hàng #{order.id}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{formatDate(order.orderDate)}</p>
                                    </div>
                                    <StatusBadge status={order.status} />
                                </div>

                                <div className="divide-y divide-gray-50">
                                    {order.orderItems.map((item, idx) => (
                                        <OrderItemRow key={item.id ?? `${order.id}-${idx}`} item={item} />
                                    ))}
                                </div>

                                <div className="flex items-center justify-between pt-3 mt-1 border-t border-gray-100">
                                    <span className="text-sm font-bold text-slate-700">Tổng tiền</span>
                                    <span className="text-base font-extrabold text-blue-600">{formatVnd(order.totalAmount)}</span>
                                </div>

                                {order.status === 'Pending' && (
                                    <button
                                        type="button"
                                        onClick={() => handlePayAgain(order.id)}
                                        disabled={payingId === order.id}
                                        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {payingId === order.id ? 'Đang chuyển tới VNPay...' : 'Thanh toán ngay'}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
