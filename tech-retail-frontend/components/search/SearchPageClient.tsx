'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Toast from '@/components/Toast';
import ProductGrid from '@/components/search/ProductGrid';
import Pagination from '@/components/search/Pagination';
import SortSelect from '@/components/search/SortSelect';
import FilterSidebar from '@/components/search/FilterSidebar';
import { ApiError, apiFetch, clearSession, getToken } from '@/app/lib/api';
import { useCartCount, useStoredUser, useToast } from '@/app/lib/hooks';
import type { PagedResult, FilterOptions, Product, SortOption } from '@/app/lib/products';

interface Filters {
    q: string;
    sort: SortOption;
    page: number;
    brand?: string;
    ram?: string;
    gpu?: string;
    minPrice?: number;
    maxPrice?: number;
}

function buildHref(base: Filters, overrides: Partial<Filters>) {
    const merged = { ...base, ...overrides };
    const params = new URLSearchParams();
    if (merged.q) params.set('q', merged.q);
    if (merged.sort !== 'newest') params.set('sort', merged.sort);
    if (merged.brand) params.set('brand', merged.brand);
    if (merged.ram) params.set('ram', merged.ram);
    if (merged.gpu) params.set('gpu', merged.gpu);
    if (merged.minPrice != null) params.set('minPrice', String(merged.minPrice));
    if (merged.maxPrice != null) params.set('maxPrice', String(merged.maxPrice));
    if (merged.page && merged.page > 1) params.set('page', String(merged.page));
    return `/search?${params.toString()}`;
}

interface SearchPageClientProps {
    filters: Filters;
    hasAnyFilter: boolean;
    result: PagedResult<Product> | null;
    filterOptions: FilterOptions | null;
    error: string | null;
}

// Gom Header + khu kết quả vào 1 client component để cartCount (badge trên Header)
// và nút "Thêm vào giỏ hàng" trong grid dùng chung một state, giống cách app/page.tsx đang làm.
export default function SearchPageClient({ filters, hasAnyFilter, result, filterOptions, error }: SearchPageClientProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState(filters.q);
    const user = useStoredUser();
    const [cartCount, setCartCount] = useCartCount(user !== null);
    const { toast, showToast } = useToast();
    const [addingId, setAddingId] = useState<number | null>(null);

    const handleLogout = () => {
        clearSession();
        setCartCount(0);
        router.refresh();
    };

    const handleAddToCart = async (product: Product) => {
        if (!getToken()) {
            showToast('error', 'Vui lòng đăng nhập để thêm vào giỏ hàng.');
            router.push('/login');
            return;
        }

        setAddingId(product.id);
        try {
            await apiFetch(`/api/Cart/add?productId=${product.id}&quantity=1`, { method: 'POST' });
            setCartCount((prev) => prev + 1);
            showToast('success', 'Đã thêm vào giỏ hàng!');
        } catch (err) {
            if (err instanceof ApiError && err.status === 401) {
                clearSession();
                router.push('/login');
                return;
            }
            showToast('error', err instanceof Error ? err.message : 'Không thể thêm vào giỏ hàng.');
        } finally {
            setAddingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] text-slate-800 flex flex-col justify-between">
            <div>
                <Header
                    user={user}
                    cartCount={cartCount}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onLogout={handleLogout}
                />

                <main className="max-w-7xl mx-auto px-4 py-6">
                    {!hasAnyFilter && (
                        <div className="text-center py-20">
                            <p className="text-sm text-slate-500">Nhập từ khóa hoặc chọn bộ lọc ở ô tìm kiếm phía trên để bắt đầu.</p>
                        </div>
                    )}

                    {hasAnyFilter && error && (
                        <div className="text-center py-20">
                            <p className="text-sm font-semibold text-red-600">{error}</p>
                        </div>
                    )}

                    {hasAnyFilter && !error && result && filterOptions && (
                        <div className="flex flex-col lg:flex-row gap-6">
                            <FilterSidebar
                                options={filterOptions}
                                selected={{
                                    brand: filters.brand,
                                    ram: filters.ram,
                                    gpu: filters.gpu,
                                    minPrice: filters.minPrice,
                                    maxPrice: filters.maxPrice,
                                }}
                            />

                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                                    <p className="text-sm text-slate-700">
                                        Tìm thấy <span className="font-extrabold">{result.totalItems}</span> kết quả
                                        {filters.q && (
                                            <>
                                                {' '}với từ khóa <span className="font-extrabold">&quot;{filters.q}&quot;</span>
                                            </>
                                        )}
                                    </p>
                                    {result.totalItems > 0 && <SortSelect value={filters.sort} />}
                                </div>

                                <ProductGrid
                                    products={result.data}
                                    keyword={filters.q}
                                    addingId={addingId}
                                    onAddToCart={handleAddToCart}
                                />
                                <Pagination
                                    page={result.pageNumber}
                                    totalPages={result.totalPages}
                                    buildHref={(p) => buildHref(filters, { page: p })}
                                />
                            </div>
                        </div>
                    )}
                </main>
            </div>

            <Footer />
            <Toast toast={toast} />
        </div>
    );
}
