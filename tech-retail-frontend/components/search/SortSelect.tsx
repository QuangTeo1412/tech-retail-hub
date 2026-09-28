'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { SORT_OPTIONS, type SortOption } from '@/app/lib/products';

export default function SortSelect({ value }: { value: SortOption }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleChange = (sort: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (sort === 'newest') params.delete('sort');
        else params.set('sort', sort);
        params.delete('page');
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span className="hidden sm:inline">Sắp xếp:</span>
            <select
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
            >
                {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </label>
    );
}
