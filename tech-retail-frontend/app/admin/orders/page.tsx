'use client';

import { Fragment, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiError, apiFetch, clearSession, formatVnd } from '../../lib/api';
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from '../../lib/data';

interface AdminOrderItem {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
}

interface AdminOrder {
    id: number;
    userId: number;
    username: string | null;
    email: string | null;
    orderDate: string;
    totalAmount: number;
    status: string;
    items: AdminOrderItem[];
}

const STATUS_BADGE: Record<string, string> = {
    Pending: 'bg-gray-100 text-gray-600',
    Processing: 'bg-blue-50 text-blue-600',
    Shipped: 'bg-amber-50 text-amber-700',
    Delivered: 'bg-emerald-50 text-emerald-700',
    Cancelled: 'bg-red-50 text-red-600',
};

function formatDate(iso: string): string {
    try {
        return new Date(iso).toLocaleString('vi-VN');
    } catch {
        return iso;
    }
}

interface LoadResult {
    key: string;
    orders: AdminOrder[];
    failed: boolean;
}

export default function AdminOrdersPage() {
    const router = useRouter();
    const [statusFilter, setStatusFilter] = useState('');
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [notice, setNotice] = useState('');

    const handleAuthError = useCallback(
        (err: unknown) => {
            if (err instanceof ApiError && err.status === 401) {
                clearSession();
                router.replace('/login');
                return true;
            }
            return false;
        },
        [router]
    );

    const [reloadKey, setReloadKey] = useState(0);
    const requestKey = `${statusFilter}#${reloadKey}`;
    const [result, setResult] = useState<LoadResult | null>(null);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const query = statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : '';
                const data = await apiFetch<AdminOrder[]>(`/api/Order/all${query}`);
                if (!cancelled) setResult({ key: requestKey, orders: data, failed: false });
            } catch (err) {
                if (cancelled) return;
                if (handleAuthError(err)) return;
                setResult({ key: requestKey, orders: [], failed: true });
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [statusFilter, requestKey, handleAuthError]);

    const isCurrent = result !== null && result.key === requestKey;
    const status: 'loading' | 'error' | 'ready' = !isCurrent ? 'loading' : result.failed ? 'error' : 'ready';
    const orders = isCurrent && !result.failed ? result.orders : [];

    const handleStatusChange = async (order: AdminOrder, newStatus: string) => {
        if (newStatus === order.status) return;

        setUpdatingId(order.id);
        setNotice('');
        try {
            await apiFetch(`/api/Order/${order.id}/status?newStatus=${encodeURIComponent(newStatus)}`, { method: 'PUT' });
            setResult((prev) =>
                prev ? { ...prev, orders: prev.orders.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o)) } : prev
            );
        } catch (err) {
            if (!handleAuthError(err)) {
                setNotice(err instanceof Error ? err.message : 'Không thể cập nhật trạng thái đơn hàng.');
            }
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="space-y-5">
            <h1 className="text-2xl font-extrabold text-slate-900">Đơn hàng</h1>

            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => setStatusFilter('')}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${statusFilter === ''
                            ? 'bg-slate-900 text-white'
                            : 'bg-white border border-gray-200 text-slate-600 hover:border-slate-400'
                        }`}
                >
                    Tất cả
                </button>
                {ORDER_STATUSES.map((s) => (
                    <button
                        key={s}
                        type="button"
                        onClick={() => setStatusFilter(s)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${statusFilter === s
                                ? 'bg-slate-900 text-white'
                                : 'bg-white border border-gray-200 text-slate-600 hover:border-slate-400'
                            }`}
                    >
                        {ORDER_STATUS_LABELS[s]}
                    </button>
                ))}
            </div>

            {notice && (
                <div role="alert" className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-bold">
                    {notice}
                </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
                {status === 'loading' ? (
                    <p className="text-sm text-gray-500 p-6">Đang tải danh sách đơn hàng...</p>
                ) : status === 'error' ? (
                    <p className="text-sm text-gray-500 p-6">Không tải được danh sách đơn hàng.</p>
                ) : orders.length === 0 ? (
                    <p className="text-sm text-gray-500 p-6">Không có đơn hàng nào.</p>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wide border-b border-gray-100">
                                <th className="px-4 py-3">Đơn hàng</th>
                                <th className="px-4 py-3">Khách hàng</th>
                                <th className="px-4 py-3">Ngày đặt</th>
                                <th className="px-4 py-3">Tổng tiền</th>
                                <th className="px-4 py-3">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <Fragment key={order.id}>
                                    <tr className="border-b border-gray-50 last:border-0">
                                        <td className="px-4 py-3">
                                            <button
                                                type="button"
                                                onClick={() => setExpandedId((id) => (id === order.id ? null : order.id))}
                                                aria-expanded={expandedId === order.id}
                                                className="font-bold text-slate-800 hover:text-blue-600"
                                            >
                                                #{order.id} {expandedId === order.id ? '▼' : '▶'}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">
                                            {order.username ?? `User #${order.userId}`}
                                            {order.email ? <span className="block text-xs text-gray-400">{order.email}</span> : null}
                                        </td>
                                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{formatDate(order.orderDate)}</td>
                                        <td className="px-4 py-3 font-bold text-blue-600 whitespace-nowrap">{formatVnd(order.totalAmount)}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`text-[11px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${STATUS_BADGE[order.status] ?? 'bg-gray-100 text-gray-600'
                                                        }`}
                                                >
                                                    {ORDER_STATUS_LABELS[order.status] ?? order.status}
                                                </span>
                                                <select
                                                    value={order.status}
                                                    disabled={updatingId === order.id}
                                                    onChange={(e) => handleStatusChange(order, e.target.value)}
                                                    aria-label={`Đổi trạng thái đơn hàng #${order.id}`}
                                                    className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                                                >
                                                    {ORDER_STATUSES.map((s) => (
                                                        <option key={s} value={s}>
                                                            {ORDER_STATUS_LABELS[s]}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                    {expandedId === order.id && (
                                        <tr className="bg-gray-50/60">
                                            <td colSpan={5} className="px-4 py-3">
                                                <ul className="space-y-1.5">
                                                    {order.items.map((item) => (
                                                        <li key={item.productId} className="flex items-center justify-between text-xs text-slate-600">
                                                            <span>
                                                                {item.productName} × {item.quantity}
                                                            </span>
                                                            <span className="font-semibold">{formatVnd(item.price * item.quantity)}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}