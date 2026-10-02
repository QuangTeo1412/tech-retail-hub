import { Suspense } from 'react';
import { Be_Vietnam_Pro } from 'next/font/google';
import SearchHeader from '@/components/search/SearchHeader';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/search/ProductGrid';
import ProductGridSkeleton from '@/components/search/ProductGridSkeleton';
import Pagination from '@/components/search/Pagination';
import SortSelect from '@/components/search/SortSelect';
import FilterSidebar from '@/components/search/FilterSidebar';
import { fetchProducts, fetchFilterOptions, DEFAULT_PAGE_SIZE, type SortOption } from '@/app/lib/products';

// Khai báo 1 lần ở đây và áp cho thẻ ngoài cùng là đủ, mọi component con (Header, FilterSidebar,
const beVietnam = Be_Vietnam_Pro({
    subsets: ['vietnamese', 'latin'],
    weight: ['400', '500', '600', '700', '800'],
    display: 'swap',
});

interface SearchPageProps {
    searchParams: Promise<{
        q?: string;
        sort?: string;
        page?: string;
        brand?: string;
        ram?: string;
        minPrice?: string;
        maxPrice?: string;
    }>;
}

const VALID_SORTS: SortOption[] = ['newest', 'priceAsc', 'priceDesc', 'name'];

function parseSort(raw?: string): SortOption {
    return VALID_SORTS.includes(raw as SortOption) ? (raw as SortOption) : 'newest';
}

function parseNumber(raw?: string): number | undefined {
    if (!raw) return undefined;
    const n = Number(raw);
    return Number.isFinite(n) && n >= 0 ? n : undefined;
}

interface Filters {
    q: string;
    sort: SortOption;
    page: number;
    brand?: string;
    ram?: string;
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
    if (merged.minPrice != null) params.set('minPrice', String(merged.minPrice));
    if (merged.maxPrice != null) params.set('maxPrice', String(merged.maxPrice));
    if (merged.page && merged.page > 1) params.set('page', String(merged.page));
    return `/search?${params.toString()}`;
}

async function SearchResults({ filters }: { filters: Filters }) {
    try {
        const [result, filterOptions] = await Promise.all([
            fetchProducts({
                search: filters.q || undefined,
                brand: filters.brand,
                ram: filters.ram,
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice,
                sort: filters.sort,
                page: filters.page,
                pageSize: DEFAULT_PAGE_SIZE,
            }),
            fetchFilterOptions(),
        ]);

        return (
            <div className="flex flex-col lg:flex-row gap-6">
                <FilterSidebar
                    options={filterOptions}
                    selected={{
                        brand: filters.brand,
                        ram: filters.ram,
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
                                    {' '}
                                    với từ khóa <span className="font-extrabold">&quot;{filters.q}&quot;</span>
                                </>
                            )}
                        </p>
                        {result.totalItems > 0 && <SortSelect value={filters.sort} />}
                    </div>

                    <ProductGrid products={result.data} keyword={filters.q} />
                    <Pagination page={result.pageNumber} totalPages={result.totalPages} buildHref={(p) => buildHref(filters, { page: p })} />
                </div>
            </div>
        );
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Không tải được kết quả tìm kiếm, vui lòng thử lại.';
        return (
            <div className="text-center py-20">
                <p className="text-sm font-semibold text-red-600">{message}</p>
            </div>
        );
    }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const params = await searchParams;
    const filters: Filters = {
        q: (params.q ?? '').trim(),
        sort: parseSort(params.sort),
        page: Math.max(1, Number(params.page) || 1),
        brand: params.brand || undefined,
        ram: params.ram || undefined,
        minPrice: parseNumber(params.minPrice),
        maxPrice: parseNumber(params.maxPrice),
    };

    const hasAnyFilter = !!(
        filters.q ||
        filters.brand ||
        filters.ram ||
        filters.minPrice != null ||
        filters.maxPrice != null
    );

    return (
        <div className={`${beVietnam.className} min-h-screen bg-[#f8f9fa] text-slate-800 antialiased flex flex-col justify-between`}>
            <div>
                <SearchHeader initialQuery={filters.q} />

                <main className="max-w-7xl mx-auto px-4 py-6">
                    {hasAnyFilter ? (
                        <Suspense fallback={<ProductGridSkeleton />}>
                            <SearchResults filters={filters} />
                        </Suspense>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-sm text-slate-500">Nhập từ khóa hoặc chọn bộ lọc ở ô tìm kiếm phía trên để bắt đầu.</p>
                        </div>
                    )}
                </main>
            </div>

            <Footer />
        </div>
    );
}