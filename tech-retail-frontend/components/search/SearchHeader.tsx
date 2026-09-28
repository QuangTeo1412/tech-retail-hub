'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { clearSession } from '@/app/lib/api';
import { useCartCount, useStoredUser } from '@/app/lib/hooks';
export default function SearchHeader({ initialQuery = '' }: { initialQuery?: string }) {
    const router = useRouter();
    const user = useStoredUser();
    const [cartCount, setCartCount] = useCartCount(user !== null);
    const [searchQuery, setSearchQuery] = useState(initialQuery);

    const handleLogout = () => {
        clearSession();
        setCartCount(0);
        router.refresh();
    };

    return (
        <Header
            user={user}
            cartCount={cartCount}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onLogout={handleLogout}
        />
    );
}
