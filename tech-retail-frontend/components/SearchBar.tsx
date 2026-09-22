'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [query, setQuery] = useState(() => searchParams.get('q') || '');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!query.trim()) {
            router.push('/search');
        } else {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative w-full max-w-md">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm kiếm linh kiện, gear, laptop..."
                className="w-full bg-gray-100 border border-gray-200 rounded-full px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all shadow-sm"
            />
            <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-blue-600 text-white rounded-full px-4 py-1.5 text-xs font-bold hover:bg-blue-700 transition-colors"
            >
                Tìm
            </button>
        </form>
    );
}