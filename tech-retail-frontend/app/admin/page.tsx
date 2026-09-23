'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ApiError, apiFetch, clearSession, formatVnd } from '../lib/api';
import { ORDER_STATUS_LABELS } from '../lib/data';

interface TopProduct {
    productId: number;
    productName: string;
    totalQuantitySold: number;
    totalEarnings: number;
}

interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;
    ordersByStatus: Record<string, number>;
    topSellingProducts: TopProduct[];
}

export default function AdminDashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [status, setStatus] = useState<'loading' | 'error' | 'ready'>('loading');

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const data = await apiFetch<DashboardStats>('/api/Admin/dashboard');
                if (!cancelled) {
                    setStats(data);
                    setStatus('ready');
                }
            } catch (err) {
                if (cancelled) return;
                if (err instanceof ApiError && err.status === 401) {
                    clearSession();
                    router.replace('/login');
                    return;
                }
                setStatus('error');
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [router]);

    if (status === 'loading') {
        return <p className="text-sm text-gray-500">Đang tải số liệu...</p>;
    }

    if (status === 'error' || !stats) {
        return (
            <div role="alert" className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
                <p className="text-sm text-slate-600">Không tải được số liệu tổng quan.</p>
            </div>
        );
    }

    const cards = [
        { label: 'Doanh thu (đơn đã giao)', value: formatVnd(stats.totalRevenue) },
        { label: 'Tổng đơn hàng', value: stats.totalOrders.toString() },
        { label: 'Tổng sản phẩm', value: stats.totalProducts.toString() },
        { label: 'Tổng người dùng', value: stats.totalUsers.toString() },
    ];

    const statusEntries = Object.entries(stats.ordersByStatus);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-extrabold text-slate-900">Tổng quan</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((card) => (
                    <div key={card.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">{card.label}</p>
                        <p className="text-xl font-extrabold text-slate-900 mt-1.5">{card.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide mb-4">Đơn hàng theo trạng thái</h2>
                    {statusEntries.length === 0 ? (
                        <p className="text-sm text-gray-500">Chưa có đơn hàng nào.</p>
                    ) : (
                        <ul className="space-y-2">
                            {statusEntries.map(([key, count]) => (
                                <li key={key} className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">{ORDER_STATUS_LABELS[key] ?? key}</span>
                                    <span className="font-bold text-slate-900">{count}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide mb-4">Bán chạy nhất</h2>
                    {stats.topSellingProducts.length === 0 ? (
                        <p className="text-sm text-gray-500">Chưa có sản phẩm nào được bán.</p>
                    ) : (
                        <ul className="space-y-3">
                            {stats.topSellingProducts.map((p) => (
                                <li key={p.productId} className="flex items-center justify-between gap-3 text-sm">
                                    <span className="text-slate-700 line-clamp-1">{p.productName}</span>
                                    <span className="text-xs text-gray-500 whitespace-nowrap">
                                        {p.totalQuantitySold} sp · {formatVnd(p.totalEarnings)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="flex gap-4">
                <Link href="/admin/products" className="text-xs font-bold text-blue-600 hover:underline">
                    Quản lý sản phẩm →
                </Link>
                <Link href="/admin/orders" className="text-xs font-bold text-blue-600 hover:underline">
                    Quản lý đơn hàng →
                </Link>
            </div>
        </div>
    );
}