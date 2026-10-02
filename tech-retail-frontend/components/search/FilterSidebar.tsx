'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import type { FilterOptions } from '@/app/lib/products';

interface FilterSidebarProps {
    options: FilterOptions;
    selected: {
        brand?: string;
        ram?: string;
        gpu?: string;
        minPrice?: number;
        maxPrice?: number;
    };
}

function FilterGroup({
    title,
    items,
    selectedValue,
    onToggle,
}: {
    title: string;
    items: string[];
    selectedValue?: string;
    onToggle: (value: string) => void;
}) {
    if (items.length === 0) return null;
    return (
        <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3">{title}</h3>
            <ul className="space-y-2">
                {items.map((item) => (
                    <li key={item}>
                        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedValue === item}
                                onChange={() => onToggle(item)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            {item}
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function FilterSidebar({ options, selected }: FilterSidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const navigate = (mutate: (params: URLSearchParams) => void) => {
        const params = new URLSearchParams(searchParams.toString());
        mutate(params);
        params.delete('page');
        router.push(`${pathname}?${params.toString()}`);
    };

    const toggle = (key: 'brand' | 'ram', value: string) => {
        navigate((params) => {
            if (selected[key] === value) params.delete(key);
            else params.set(key, value);
        });
    };

    const handlePriceSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const min = form.get('minPrice')?.toString().trim();
        const max = form.get('maxPrice')?.toString().trim();
        navigate((params) => {
            if (min) params.set('minPrice', min);
            else params.delete('minPrice');
            if (max) params.set('maxPrice', max);
            else params.delete('maxPrice');
        });
    };

    const clearAll = () => {
        navigate((params) => {
            // vẫn xóa "gpu" ở đây để dọn sạch những đường link cũ còn sót lại tham số này
            ['brand', 'ram', 'gpu', 'minPrice', 'maxPrice'].forEach((k) => params.delete(k));
        });
    };

    const hasActiveFilter = !!(selected.brand || selected.ram || selected.minPrice != null || selected.maxPrice != null);

    return (
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-slate-900">Bộ lọc</h2>
                {hasActiveFilter && (
                    <button type="button" onClick={clearAll} className="text-xs font-bold text-blue-600 hover:underline">
                        Xoá tất cả
                    </button>
                )}
            </div>

            <FilterGroup title="Thương hiệu" items={options.brands} selectedValue={selected.brand} onToggle={(v) => toggle('brand', v)} />

            <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3">Khoảng giá</h3>
                <form onSubmit={handlePriceSubmit} className="flex items-center gap-2">
                    <input
                        type="number"
                        name="minPrice"
                        min={0}
                        defaultValue={selected.minPrice ?? ''}
                        placeholder="Từ"
                        className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                        type="number"
                        name="maxPrice"
                        min={0}
                        defaultValue={selected.maxPrice ?? ''}
                        placeholder="Đến"
                        className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                    />
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex-shrink-0">
                        OK
                    </button>
                </form>
                {options.maxPrice > 0 && (
                    <p className="text-[10px] text-gray-400 mt-1">
                        Khoảng giá hiện có: {options.minPrice.toLocaleString('vi-VN')}đ - {options.maxPrice.toLocaleString('vi-VN')}đ
                    </p>
                )}
            </div>

            <FilterGroup title="RAM" items={options.rams} selectedValue={selected.ram} onToggle={(v) => toggle('ram', v)} />
        </aside>
    );
}