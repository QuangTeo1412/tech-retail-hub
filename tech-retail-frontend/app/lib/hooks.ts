import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { apiFetch, getToken } from './api';

export interface StoredUser {
    username?: string;
    name?: string;
    email?: string;
    avatar?: string;
    avatarUrl?: string;
    image?: string;
}

function subscribeUser(onChange: () => void) {
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

            }
        })();

        return () => {
            cancelled = true;
        };
    }, [isLoggedIn]);

    return [cartCount, setCartCount] as const;
}

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

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export function usePrefersReducedMotion() {
    return useSyncExternalStore(
        (onChange) => {
            const mq = window.matchMedia(REDUCED_MOTION_QUERY);
            mq.addEventListener('change', onChange);
            return () => mq.removeEventListener('change', onChange);
        },
        () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
        () => false
    );
}

export function useDebouncedValue<T>(value: T, delay = 400): T {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
}
