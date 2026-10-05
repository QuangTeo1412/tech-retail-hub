import { API_BASE } from '@/app/lib/api';

const API_URL = `${API_BASE}/api`;

async function getJson<T>(path: string): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, { cache: 'no-store' });
    if (!res.ok) {
        let message = 'Không tải được dữ liệu, vui lòng thử lại.';
        try {
            const data = await res.json();
            message = data?.message ?? message;
        } catch {

        }
        throw new Error(message);
    }
    return (await res.json()) as T;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    category: string;
    brand: string;
    cpu?: string | null;
    ram?: string | null;
    gpu?: string | null;
    description: string;
    imageUrl: string;
    createdAt: string;
}

export interface PagedResult<T> {
    totalItems: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    data: T[];
}

export interface FilterOptions {
    brands: string[];
    rams: string[];
    gpus: string[];
    minPrice: number;
    maxPrice: number;
}

export type SortOption = 'newest' | 'priceAsc' | 'priceDesc' | 'name';

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'priceAsc', label: 'Giá thấp đến cao' },
    { value: 'priceDesc', label: 'Giá cao đến thấp' },
    { value: 'name', label: 'Tên A-Z' },
];

export const DEFAULT_PAGE_SIZE = 20;

export interface FetchProductsParams {
    search?: string;
    category?: string;
    brand?: string;
    ram?: string;
    gpu?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: SortOption;
    page?: number;
    pageSize?: number;
}

export async function fetchProducts(params: FetchProductsParams): Promise<PagedResult<Product>> {
    const qs = new URLSearchParams();
    if (params.search) qs.set('search', params.search);
    if (params.category) qs.set('category', params.category);
    if (params.brand) qs.set('brand', params.brand);
    if (params.ram) qs.set('ram', params.ram);
    if (params.gpu) qs.set('gpu', params.gpu);
    if (params.minPrice != null) qs.set('minPrice', String(params.minPrice));
    if (params.maxPrice != null) qs.set('maxPrice', String(params.maxPrice));
    if (params.sort && params.sort !== 'newest') qs.set('sortBy', params.sort);
    qs.set('pageNumber', String(params.page ?? 1));
    qs.set('pageSize', String(params.pageSize ?? DEFAULT_PAGE_SIZE));

    return getJson<PagedResult<Product>>(`/products?${qs.toString()}`);
}

export async function fetchFilterOptions(): Promise<FilterOptions> {
    return getJson<FilterOptions>('/products/filters');
}

export const currencyFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
});

const API_ORIGIN = API_BASE;

export function resolveImageUrl(imageUrl: string): string {
    if (!imageUrl) return '';
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
    return `${API_ORIGIN}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
}
