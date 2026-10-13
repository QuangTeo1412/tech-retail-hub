'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Be_Vietnam_Pro } from 'next/font/google';
import { apiFetch, getToken } from '../lib/api';
import {
    formatWarrantyDate,
    WarrantyStatusBadge,
    type MyWarranty,
    type WarrantyLookup,
} from '../lib/warranty';

const beVietnam = Be_Vietnam_Pro({
    subsets: ['vietnamese', 'latin'],
    weight: ['400', '500', '600', '700', '800'],
    display: 'swap',
});

async function fetchLookup(value: string): Promise<{ data: WarrantyLookup | null; error: string }> {
    try {
        const data = await apiFetch<WarrantyLookup>(
            `/api/Warranty/lookup/${encodeURIComponent(value)}`,
            { auth: false }
        );
        return { data, error: '' };
    } catch (err) {
        return {
            data: null,
            error: err instanceof Error ? err.message : 'Không tra cứu được, vui lòng thử lại.',
        };
    }
}

function WarrantyContent() {
    const searchParams = useSearchParams();
    const initialCode = searchParams.get('code')?.trim() ?? '';

    const [code, setCode] = useState(initialCode);
    const [result, setResult] = useState<WarrantyLookup | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(Boolean(initialCode));
    const [mine, setMine] = useState<MyWarranty[] | null>(null);

    useEffect(() => {
        if (!initialCode) return;
        let cancelled = false;
        (async () => {
            const r = await fetchLookup(initialCode);
            if (cancelled) return;
            setResult(r.data);
            setError(r.error);
            setLoading(false);
        })();
        return () => {
            cancelled = true;
        };
    }, [initialCode]);

    useEffect(() => {
        if (!getToken()) return;
        let cancelled = false;
        (async () => {
            try {
                const data = await apiFetch<MyWarranty[]>('/api/Warranty/my');
                if (!cancelled) setMine(data);
            } catch {
                if (!cancelled) setMine([]);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const handleLookup = async (raw: string) => {
        const value = raw.trim();
        if (!value) {
            setResult(null);
            setError('Vui lòng nhập mã bảo hành.');
            return;
        }
        setLoading(true);
        setError('');
        setResult(null);
        const r = await fetchLookup(value);
        setResult(r.data);
        setError(r.error);
        setLoading(false);
    };

    return (
        <div className={`${beVietnam.className} min-h-screen bg-[#f8f9fa] text-slate-800 antialiased`}>
            <header className="bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="text-xl font-extrabold text-blue-600 tracking-wider">
                        KAITO STORE
                    </Link>
                    <Link href="/" className="text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors">
                        ← Về trang chủ
                    </Link>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Tra cứu bảo hành</h1>
                <p className="text-sm text-gray-500 mb-6">
                    Nhập mã bảo hành (dạng <span className="font-mono">BH-20261007-ABC123</span>) để xem thời hạn và tình trạng.
                </p>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        void handleLookup(code);
                    }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row gap-3"
                >
                    <label htmlFor="warranty-code" className="sr-only">
                        Mã bảo hành
                    </label>
                    <input
                        id="warranty-code"
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Nhập mã bảo hành"
                        autoComplete="off"
                        className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono uppercase focus:outline-none focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Đang tra cứu...' : 'Tra cứu'}
                    </button>
                </form>

                {error && (
                    <div role="alert" className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-bold">
                        {error}
                    </div>
                )}

                {result && (
                    <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
                            <p className="text-sm font-extrabold text-slate-900 font-mono">{result.code}</p>
                            <WarrantyStatusBadge status={result.status} />
                        </div>
                        <dl className="mt-3 space-y-2 text-sm">
                            <div className="flex justify-between gap-4">
                                <dt className="text-gray-500">Sản phẩm</dt>
                                <dd className="font-semibold text-slate-800 text-right">{result.productName}</dd>
                            </div>
                            <div className="flex justify-between gap-4">
                                <dt className="text-gray-500">Ngày bắt đầu</dt>
                                <dd className="font-semibold text-slate-800">{formatWarrantyDate(result.startDate)}</dd>
                            </div>
                            <div className="flex justify-between gap-4">
                                <dt className="text-gray-500">Ngày hết hạn</dt>
                                <dd className="font-semibold text-slate-800">{formatWarrantyDate(result.endDate)}</dd>
                            </div>
                            {result.isActive && (
                                <div className="flex justify-between gap-4">
                                    <dt className="text-gray-500">Còn lại</dt>
                                    <dd className="font-bold text-green-600">{result.daysLeft} ngày</dd>
                                </div>
                            )}
                        </dl>
                    </div>
                )}

                {mine && mine.length > 0 && (
                    <section className="mt-8">
                        <h2 className="text-base font-extrabold text-slate-900 mb-3">Bảo hành của tôi</h2>
                        <div className="space-y-3">
                            {mine.map((w) => (
                                <div
                                    key={w.code}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap items-center justify-between gap-3"
                                >
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-slate-800 line-clamp-1">{w.productName}</p>
                                        <p className="text-xs font-mono text-gray-500 mt-0.5">{w.code}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            Hết hạn: {formatWarrantyDate(w.endDate)} · Đơn #{w.orderId}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <WarrantyStatusBadge status={w.status} />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCode(w.code);
                                                void handleLookup(w.code);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className="text-xs font-bold text-blue-600 hover:text-blue-700"
                                        >
                                            Xem
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}

export default function WarrantyPage() {
    return (
        <Suspense fallback={null}>
            <WarrantyContent />
        </Suspense>
    );
}
