import SearchPageClient from '@/components/search/SearchPageClient';
import { fetchProducts, fetchFilterOptions, DEFAULT_PAGE_SIZE, type SortOption } from '@/app/lib/products';

interface SearchPageProps {
    searchParams: Promise<{
        q?: string;
        sort?: string;
        page?: string;
        brand?: string;
        ram?: string;
        gpu?: string;
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

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const params = await searchParams;
    const filters = {
        q: (params.q ?? '').trim(),
        sort: parseSort(params.sort),
        page: Math.max(1, Number(params.page) || 1),
        brand: params.brand || undefined,
        ram: params.ram || undefined,
        gpu: params.gpu || undefined,
        minPrice: parseNumber(params.minPrice),
        maxPrice: parseNumber(params.maxPrice),
    };

    const hasAnyFilter = !!(
        filters.q || filters.brand || filters.ram || filters.gpu || filters.minPrice != null || filters.maxPrice != null
    );

    let result = null;
    let filterOptions = null;
    let error: string | null = null;

    if (hasAnyFilter) {
        try {
            [result, filterOptions] = await Promise.all([
                fetchProducts({
                    search: filters.q || undefined,
                    brand: filters.brand,
                    ram: filters.ram,
                    gpu: filters.gpu,
                    minPrice: filters.minPrice,
                    maxPrice: filters.maxPrice,
                    sort: filters.sort,
                    page: filters.page,
                    pageSize: DEFAULT_PAGE_SIZE,
                }),
                fetchFilterOptions(),
            ]);
        } catch (err) {
            error = err instanceof Error ? err.message : 'Không tải được kết quả tìm kiếm, vui lòng thử lại.';
        }
    }

    return (
        <SearchPageClient
            filters={filters}
            hasAnyFilter={hasAnyFilter}
            result={result}
            filterOptions={filterOptions}
            error={error}
        />
    );
}
