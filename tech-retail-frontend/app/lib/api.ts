
export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:5000';

/** Sản phẩm trả về từ GET /api/Products. Các field ngoài id/name/price đều có thể thiếu. */
export interface Product {
    id: number;
    name: string;
    price: number;
    stock?: number;
    category?: string | null;
    description?: string | null;
    imageUrl?: string | null;
    [key: string]: unknown;
}

export class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}

export function getToken(): string | null {
    try {
        return localStorage.getItem('token');
    } catch {
        return null;
    }
}

/** Xóa thông tin đăng nhập (dùng khi token hết hạn) và báo cho các trang khác biết để cập nhật giao diện. */
export function clearSession() {
    try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    } catch {

    }
    window.dispatchEvent(new Event('userLoginStateChanged'));
}

export function formatVnd(value: number): string {
    return `${new Intl.NumberFormat('vi-VN').format(value)}đ`;
}

const IMAGE_KEYS = ['imageUrl', 'image', 'imagePath', 'thumbnail', 'photo', 'img'];

export function resolveImageUrl(product: Product): string | null {
    for (const key of IMAGE_KEYS) {
        const value = product[key];
        if (typeof value === 'string' && value.trim()) {
            const url = value.trim();
            if (/^https?:\/\//i.test(url)) return url;
            return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
        }
    }
    return null;
}

function extractMessage(data: unknown): string | null {
    if (typeof data === 'string') return data.trim() || null;
    if (data && typeof data === 'object') {
        const obj = data as Record<string, unknown>;
        for (const key of ['message', 'Message', 'title']) {
            const value = obj[key];
            if (typeof value === 'string' && value.trim()) return value;
        }
    }
    return null;
}

type ApiOptions = RequestInit & { auth?: boolean };

/** Upload 1 ảnh (chỉ Admin). Trả về đường dẫn tương đối để lưu vào Product.imageUrl. */
export async function uploadImage(file: File): Promise<{ url: string; fullUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return apiFetch<{ url: string; fullUrl: string }>('/api/FileUpload/upload-image', {
        method: 'POST',
        body: formData,
    });
}


export async function apiFetch<T = unknown>(path: string, options: ApiOptions = {}): Promise<T> {
    const { auth = true, ...init } = options;

    const headers = new Headers(init.headers);
    const token = auth ? getToken() : null;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    let res: Response;
    try {
        res = await fetch(`${API_BASE}${path}`, { ...init, headers });
    } catch {
        throw new ApiError('Không thể kết nối đến máy chủ Backend!', 0);
    }

    const contentType = res.headers.get('content-type') ?? '';
    const data: unknown = contentType.includes('application/json')
        ? await res.json().catch(() => null)
        : await res.text().catch(() => '');

    if (!res.ok) {
        if (res.status === 401) {
            throw new ApiError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 401);
        }
        if (res.status === 403) {
            throw new ApiError('Bạn không có quyền thực hiện thao tác này.', 403);
        }
        throw new ApiError(extractMessage(data) ?? 'Có lỗi xảy ra, vui lòng thử lại.', res.status);
    }

    return data as T;
}