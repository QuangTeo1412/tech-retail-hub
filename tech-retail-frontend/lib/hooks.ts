'use client';

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/data';



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



export function useAuth() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const checkAndSetUser = () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser && storedUser !== 'undefined') {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Lỗi khi đọc thông tin user từ localStorage:', error);
                setUser(null);
            }
        };

        checkAndSetUser();

        window.addEventListener('storage', checkAndSetUser);
        window.addEventListener('userLoginStateChanged', checkAndSetUser);

        return () => {
            window.removeEventListener('storage', checkAndSetUser);
            window.removeEventListener('userLoginStateChanged', checkAndSetUser);
        };
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.dispatchEvent(new Event('userLoginStateChanged'));
        router.refresh();
    }, [router]);

    return { user, logout };
}
