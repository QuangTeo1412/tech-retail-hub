export type SortOption = 'newest' | 'priceAsc' | 'priceDesc' | 'name';

export interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
    category?: string;
}

export interface PagedResult<T> {
    data: T[];
    totalItems: number;
    pageNumber: number;
    totalPages: number;
}

export class ApiError extends Error {
    constructor(message: string, public statusCode?: number) {
        super(message);
        this.name = 'ApiError';
    }
}

export const DEFAULT_PAGE_SIZE = 10;

export const SORT_OPTIONS: { label: string; value: SortOption }[] = [
    { label: 'Mới nhất', value: 'newest' },
    { label: 'Giá tăng dần', value: 'priceAsc' },
    { label: 'Giá giảm dần', value: 'priceDesc' },
    { label: 'Tên A-Z', value: 'name' },
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchProducts({
    search,
    sort,
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
}: {
    search?: string;
    sort?: SortOption;
    page?: number;
    pageSize?: number;
}): Promise<PagedResult<Product>> {
    const url = new URL(`${API_BASE_URL}/products`);
    if (search) url.searchParams.set('search', search);
    if (sort) url.searchParams.set('sort', sort);
    url.searchParams.set('page', String(page));
    url.searchParams.set('pageSize', String(pageSize));

    const res = await fetch(url.toString(), { next: { revalidate: 30 } });
    if (!res.ok) {
        throw new ApiError('Không thể tải danh sách sản phẩm từ server.', res.status);
    }
    return res.json();
}