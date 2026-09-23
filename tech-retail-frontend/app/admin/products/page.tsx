'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminProductForm from '../../../components/AdminProductForm';
import { ApiError, apiFetch, clearSession, formatVnd, resolveImageUrl, type Product } from '../../lib/api';
import { useDebouncedValue } from '../../lib/hooks';

interface LoadResult {
    key: string;
    products: Product[];
    failed: boolean;
}

export default function AdminProductsPage() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [formTarget, setFormTarget] = useState<'new' | Product | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
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

    const keyword = useDebouncedValue(search.trim(), 400);
    const [reloadKey, setReloadKey] = useState(0);
    const requestKey = `${keyword}#${reloadKey}`;
    const [result, setResult] = useState<LoadResult | null>(null);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const params = new URLSearchParams({ pageNumber: '1', pageSize: '100' });
                if (keyword) params.set('search', keyword);
                const res = await apiFetch<{ data: Product[] }>(`/api/Products?${params.toString()}`);
                if (!cancelled) setResult({ key: requestKey, products: Array.isArray(res.data) ? res.data : [], failed: false });
            } catch (err) {
                if (cancelled) return;
                if (handleAuthError(err)) return;
                setResult({ key: requestKey, products: [], failed: true });
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [keyword, requestKey, handleAuthError]);

    const isCurrent = result !== null && result.key === requestKey;
    const status: 'loading' | 'error' | 'ready' = !isCurrent ? 'loading' : result.failed ? 'error' : 'ready';
    const products = isCurrent && !result.failed ? result.products : [];

    const handleDelete = async (product: Product) => {
        if (!window.confirm(`Xóa sản phẩm "${product.name}"?`)) return;

        setDeletingId(product.id);
        setNotice('');
        try {
            await apiFetch(`/api/Products/${product.id}`, { method: 'DELETE' });
            setReloadKey((k) => k + 1);
        } catch (err) {
            if (!handleAuthError(err)) {
                setNotice(err instanceof Error ? err.message : 'Không thể xóa sản phẩm.');
            }
        } finally {
            setDeletingId(null);
        }
    };

    const handleSaved = () => {
        setFormTarget(null);
        setReloadKey((k) => k + 1);
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <h1 className="text-2xl font-extrabold text-slate-900">Sản phẩm</h1>
                <button
                    type="button"
                    onClick={() => setFormTarget('new')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors"
                >
                    + Thêm sản phẩm
                </button>
            </div>

            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo tên sản phẩm..."
                className="w-full max-w-sm border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-white"
            />

            {notice && (
                <div role="alert" className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-bold">
                    {notice}
                </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
                {status === 'loading' ? (
                    <p className="text-sm text-gray-500 p-6">Đang tải danh sách sản phẩm...</p>
                ) : status === 'error' ? (
                    <p className="text-sm text-gray-500 p-6">Không tải được danh sách sản phẩm.</p>
                ) : products.length === 0 ? (
                    <p className="text-sm text-gray-500 p-6">Chưa có sản phẩm nào.</p>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wide border-b border-gray-100">
                                <th className="px-4 py-3">Sản phẩm</th>
                                <th className="px-4 py-3">Danh mục</th>
                                <th className="px-4 py-3">Giá</th>
                                <th className="px-4 py-3">Tồn kho</th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => {
                                const image = resolveImageUrl(product);
                                const stock = typeof product.stock === 'number' ? product.stock : 0;
                                return (
                                    <tr key={product.id} className="border-b border-gray-50 last:border-0">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
                                                    {image ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img src={image} alt="" className="w-full h-full object-contain p-1" />
                                                    ) : (
                                                        <span className="text-lg" role="presentation">
                                                            💻
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="font-semibold text-slate-800 line-clamp-2 max-w-xs">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-500">{product.category || '—'}</td>
                                        <td className="px-4 py-3 font-bold text-blue-600 whitespace-nowrap">{formatVnd(product.price)}</td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={
                                                    stock <= 0
                                                        ? 'text-red-600 font-bold'
                                                        : stock <= 5
                                                            ? 'text-amber-600 font-bold'
                                                            : 'text-slate-600'
                                                }
                                            >
                                                {stock}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right whitespace-nowrap">
                                            <button
                                                type="button"
                                                onClick={() => setFormTarget(product)}
                                                className="text-xs font-bold text-blue-600 hover:underline mr-4"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(product)}
                                                disabled={deletingId === product.id}
                                                className="text-xs font-bold text-red-500 hover:underline disabled:opacity-40"
                                            >
                                                {deletingId === product.id ? 'Đang xóa...' : 'Xóa'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {formTarget !== null && (
                <AdminProductForm
                    product={formTarget === 'new' ? null : formTarget}
                    onClose={() => setFormTarget(null)}
                    onSaved={handleSaved}
                />
            )}
        </div>
    );
}