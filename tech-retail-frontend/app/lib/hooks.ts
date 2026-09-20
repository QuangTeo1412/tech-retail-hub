import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { apiFetch, getToken } from './api';

/* ---------- Người dùng đang đăng nhập (lưu trong localStorage) ---------- */

export interface StoredUser {
    username?: string;
    name?: string;
    email?: string;
    avatar?: string;
    avatarUrl?: string;
    image?: string;
}

function subscribeUser(onChange: () => void) {
    // 'storage': đổi ở tab khác; 'userLoginStateChanged': đăng nhập / đăng xuất ở tab này
    window.addEventListener('storage', onChange);
    window.addEventListener('userLoginStateChanged', onChange);
    return () => {
        window.removeEventListener('storage', onChange);
        window.removeEventListener('userLoginStateChanged', onChange);
    };
}

function getUserSnapshot(): string | null {
    try {
        return localStorage.getItem('user');
    } catch {
        return null;
    }
}

export function useStoredUser(): StoredUser | null {
    const raw = useSyncExternalStore(subscribeUser, getUserSnapshot, () => null);

    return useMemo(() => {
        if (!raw || raw === 'undefined') return null;
        try {
            return JSON.parse(raw) as StoredUser;
        } catch (error) {
            console.error('Lỗi khi đọc thông tin user từ localStorage:', error);
            return null;
        }
    }, [raw]);
}

/* ---------- Số lượng sản phẩm trong giỏ hàng (lấy từ backend) ---------- */

export function useCartCount(isLoggedIn: boolean) {
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        if (!isLoggedIn || !getToken()) return;

        let cancelled = false;
        (async () => {
            try {
                const items = await apiFetch<{ quantity: number }[]>('/api/Cart');
                if (!cancelled) setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));
            } catch {
                // Token hết hạn hoặc backend chưa chạy: giữ nguyên số hiện tại
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [isLoggedIn]);

    return [cartCount, setCartCount] as const;
}

/* ---------- Thông báo nhỏ (toast) ---------- */

export interface ToastState {
    type: 'success' | 'error';
    text: string;
}

export function useToast() {
    const [toast, setToast] = useState<ToastState | null>(null);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const showToast = useCallback((type: ToastState['type'], text: string) => {
        setToast({ type, text });
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setToast(null), 3000);
    }, []);

    useEffect(() => {
        return () => {
            if (timer.current) clearTimeout(timer.current);
        };
    }, []);

    return { toast, showToast };
}

/* ---------- Tiện ích ---------- */

/** Người dùng bật "giảm chuyển động" trong hệ điều hành thì tắt hiệu ứng tự chạy */
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export function usePrefersReducedMotion() {
    return useSyncExternalStore(
        (onChange) => {
            const mq = window.matchMedia(REDUCED_MOTION_QUERY);
            mq.addEventListener('change', onChange);
            return () => mq.removeEventListener('change', onChange);
        },
        () => window.matchMedia(REDUCED_MOTION_QUERY).matches, // giá trị trên trình duyệt
        () => false // giá trị khi render trên server
    );
}

/** Trả về giá trị sau khi người dùng ngừng thay đổi `delay` ms (dùng cho ô tìm kiếm) */
export function useDebouncedValue<T>(value: T, delay = 400): T {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
}
