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

interface CartItem {
    id: number;
    productId: number;
    productName: string;
    productPrice: number;
    productImageUrl?: string | null;
    productStock: number;
    quantity: number;
    totalPrice: number;
}

function CartItemImage({ item }: { item: CartItem }) {
    const image = resolveImageUrl({
        id: item.productId,
        name: item.productName,
        price: item.productPrice,
        imageUrl: item.productImageUrl,
    });

    return (
        <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-white border border-gray-100">
            {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={image}
                    alt={item.productName}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-contain p-1"
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-2xl" role="presentation">
                    💻
                </div>
            )}
        </div>
    );
}

function QuantityStepper({
    item,
    disabled,
    onChange,
}: {
    item: CartItem;
    disabled: boolean;
    onChange: (nextQty: number) => void;
}) {
    return (
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden flex-shrink-0">
            <button
                type="button"
                onClick={() => onChange(item.quantity - 1)}
                disabled={disabled || item.quantity <= 1}
                aria-label={`Giảm số lượng ${item.productName}`}
                className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
                −
            </button>
            <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
            <button
                type="button"
                onClick={() => onChange(item.quantity + 1)}
                disabled={disabled || item.quantity >= item.productStock}
                aria-label={`Tăng số lượng ${item.productName}`}
                className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
                +
            </button>
        </div>
    );
}

export default function CartPage() {
    const router = useRouter();
    const [items, setItems] = useState<CartItem[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [removingId, setRemovingId] = useState<number | null>(null);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [paying, setPaying] = useState(false);
    const [pendingOrderId, setPendingOrderId] = useState<number | null>(null);

    const [voucherInput, setVoucherInput] = useState('');
    const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discountAmount: number } | null>(null);
    const [voucherError, setVoucherError] = useState('');
    const [applyingVoucher, setApplyingVoucher] = useState(false);

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
                if (!cancelled) {
                    setItems(data);
                    setSelectedIds(new Set(data.map((item) => item.id)));
                }
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

    const toggleSelect = (id: number) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });

        setAppliedVoucher(null);
    };

    const toggleSelectAll = () => {
        setSelectedIds((prev) => (prev.size === items.length ? new Set() : new Set(items.map((i) => i.id))));
        setAppliedVoucher(null);
    };

    const handleRemove = async (id: number) => {
        setRemovingId(id);
        setError('');
        try {
            await apiFetch(`/api/Cart/remove/${id}`, { method: 'DELETE' });
            setItems((prev) => prev.filter((item) => item.id !== id));
            setSelectedIds((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
            setAppliedVoucher(null);
        } catch (err) {
            if (!handleAuthError(err)) {
                setError(err instanceof Error ? err.message : 'Không thể xóa sản phẩm.');
            }
        } finally {
            setRemovingId(null);
        }
    };

    const handleQuantityChange = async (item: CartItem, nextQty: number) => {
        if (nextQty < 1 || nextQty > item.productStock) return;

        setUpdatingId(item.id);
        setError('');
        try {
            const res = await apiFetch<{ quantity: number; totalPrice: number }>(
                `/api/Cart/${item.id}?quantity=${nextQty}`,
                { method: 'PUT' }
            );
            setItems((prev) =>
                prev.map((i) => (i.id === item.id ? { ...i, quantity: res.quantity, totalPrice: res.totalPrice } : i))
            );
            setAppliedVoucher(null);
        } catch (err) {
            if (!handleAuthError(err)) {
                setError(err instanceof Error ? err.message : 'Không thể cập nhật số lượng.');
            }
        } finally {
            setUpdatingId(null);
        }
    };

    const selectedItems = items.filter((item) => selectedIds.has(item.id));
    const totalQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = selectedItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const discount = appliedVoucher?.discountAmount ?? 0;
    const totalPrice = Math.max(0, subtotal - discount);
    const allSelected = items.length > 0 && selectedIds.size === items.length;

    const handleApplyVoucher = async () => {
        const code = voucherInput.trim();
        if (!code) {
            setVoucherError('Vui lòng nhập mã giảm giá.');
            return;
        }
        if (selectedItems.length === 0) {
            setVoucherError('Vui lòng chọn ít nhất một sản phẩm trước khi áp dụng mã.');
            return;
        }

        setApplyingVoucher(true);
        setVoucherError('');
        try {
            const res = await apiFetch<{ code: string; discountAmount: number }>('/api/Voucher/preview', {
                method: 'POST',
                body: JSON.stringify({ code, orderAmount: subtotal }),
            });
            setAppliedVoucher(res);
        } catch (err) {
            if (!handleAuthError(err)) {
                setVoucherError(err instanceof Error ? err.message : 'Không áp dụng được mã giảm giá.');
            }
            setAppliedVoucher(null);
        } finally {
            setApplyingVoucher(false);
        }
    };

    const handleRemoveVoucher = () => {
        setAppliedVoucher(null);
        setVoucherInput('');
        setVoucherError('');
    };

    const handlePay = async () => {
        if (selectedIds.size === 0) {
            setError('Vui lòng chọn ít nhất một sản phẩm để thanh toán.');
            return;
        }

        setPaying(true);
        setError('');
        try {
            let orderId = pendingOrderId;

            if (orderId === null) {
                const order = await apiFetch<{ orderId: number }>('/api/Order/checkout', {
                    method: 'POST',
                    body: JSON.stringify({
                        cartItemIds: Array.from(selectedIds),
                        voucherCode: appliedVoucher?.code,
                    }),
                });
                orderId = order.orderId;
                setPendingOrderId(orderId);
                setItems((prev) => prev.filter((i) => !selectedIds.has(i.id)));
                setSelectedIds(new Set());
                setAppliedVoucher(null);
            }

            const { paymentUrl } = await apiFetch<{ paymentUrl: string }>(
                `/api/Payment/create-vnpay-url/${orderId}`,
                { method: 'POST' }
            );
            window.location.assign(paymentUrl);
        } catch (err) {
            if (!handleAuthError(err)) {
                setError(err instanceof Error ? err.message : 'Không thể thanh toán, vui lòng thử lại.');
            }
            setPaying(false);
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
                                    <div className="w-20 h-20 flex-shrink-0 rounded-xl bg-gray-200" />
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
                        <div className="lg:col-span-2 space-y-3">
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="select-all"
                                    checked={allSelected}
                                    onChange={toggleSelectAll}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="select-all" className="text-sm font-bold text-slate-700 cursor-pointer">
                                    Tất cả ({items.length})
                                </label>
                            </div>

                            <ul className="space-y-3">
                                {items.map((item) => (
                                    <li
                                        key={item.id}
                                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.has(item.id)}
                                            onChange={() => toggleSelect(item.id)}
                                            aria-label={`Chọn ${item.productName}`}
                                            className="w-4 h-4 flex-shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />

                                        <CartItemImage item={item} />

                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-sm font-bold text-slate-900 line-clamp-2">{item.productName}</h2>
                                            <p className="text-xs text-gray-500 mt-1">{formatVnd(item.productPrice)}</p>
                                        </div>

                                        <QuantityStepper
                                            item={item}
                                            disabled={updatingId === item.id || paying}
                                            onChange={(nextQty) => handleQuantityChange(item, nextQty)}
                                        />

                                        <div className="text-sm font-extrabold text-blue-600 whitespace-nowrap w-28 text-right">
                                            {formatVnd(item.totalPrice)}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleRemove(item.id)}
                                            disabled={removingId === item.id || paying}
                                            aria-label={`Xóa ${item.productName} khỏi giỏ hàng`}
                                            className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                                        >
                                            {removingId === item.id ? 'Đang xóa...' : 'Xóa'}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <aside className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide mb-4">Tóm tắt đơn hàng</h2>

                            <div className="flex justify-between text-sm text-slate-600 mb-2">
                                <span>Đã chọn</span>
                                <span className="font-bold text-slate-800">
                                    {selectedItems.length}/{items.length} sản phẩm ({totalQuantity} cái)
                                </span>
                            </div>

                            {/* Mã giảm giá */}
                            <div className="border-t border-gray-100 pt-3 mt-3">
                                {appliedVoucher ? (
                                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                                        <div>
                                            <p className="text-xs font-bold text-green-700">Mã "{appliedVoucher.code}" đã áp dụng</p>
                                            <p className="text-[11px] text-green-600">Giảm {formatVnd(appliedVoucher.discountAmount)}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleRemoveVoucher}
                                            className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            Bỏ
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={voucherInput}
                                                onChange={(e) => {
                                                    setVoucherInput(e.target.value);
                                                    setVoucherError('');
                                                }}
                                                placeholder="Nhập mã giảm giá"
                                                className="flex-1 min-w-0 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500 uppercase"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleApplyVoucher}
                                                disabled={applyingVoucher}
                                                className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                                            >
                                                {applyingVoucher ? 'Đang kiểm tra...' : 'Áp dụng'}
                                            </button>
                                        </div>
                                        {voucherError && <p className="text-[11px] text-red-600 mt-1.5">{voucherError}</p>}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between text-sm text-slate-600 mt-3">
                                <span>Tạm tính</span>
                                <span className="font-semibold text-slate-800">{formatVnd(subtotal)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-sm text-green-600 mt-1">
                                    <span>Giảm giá</span>
                                    <span className="font-semibold">-{formatVnd(discount)}</span>
                                </div>
                            )}

                            <div className="flex justify-between items-baseline border-t border-gray-100 pt-3 mt-3">
                                <span className="text-sm font-bold text-slate-800">Tổng cộng</span>
                                <span className="text-lg font-extrabold text-blue-600">{formatVnd(totalPrice)}</span>
                            </div>

                            <button
                                type="button"
                                onClick={handlePay}
                                disabled={paying || selectedIds.size === 0}
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
