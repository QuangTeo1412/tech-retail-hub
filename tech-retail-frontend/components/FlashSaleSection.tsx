'use client';

import { useEffect, useRef, useState } from 'react';
import ProductCard from './ProductCard';
import { apiFetch, type Product } from '../app/lib/api';
import { NO_SCROLLBAR } from '../app/lib/data';

interface FlashSaleSectionProps {
    onAddToCart: (product: Product) => Promise<void>;
}

function msToParts(ms: number) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const days = Math.floor(total / (3600 * 24));
    const h = Math.floor((total % (3600 * 24)) / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return { days, h, m, s };
}

function Countdown({ endsAt }: { endsAt: string }) {
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    const { days, h, m, s } = msToParts(new Date(endsAt).getTime() - now);
    const pad = (n: number) => String(n).padStart(2, '0');

    return (
        <span className="font-mono tabular-nums inline-flex items-center gap-1 font-bold">
            {days > 0 && <span>{days} ngày</span>}
            <span>{pad(h)} giờ</span>
            <span>{pad(m)} phút</span>
            <span>{pad(s)} giây</span>  
        </span>
    );
}

export default function FlashSaleSection({ onAddToCart }: FlashSaleSectionProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [addingId, setAddingId] = useState<number | null>(null);
    const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const data = await apiFetch<Product[]>('/api/Products/flash-sale?take=12', { auth: false });
                if (!cancelled) {
                    setProducts(Array.isArray(data) ? data : []);
                    setStatus('ready');
                }
            } catch {
                if (!cancelled) setStatus('error');
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (status !== 'ready' || products.length === 0) return;

        const interval = setInterval(() => {
            if (scrollRef.current) {
                const container = scrollRef.current;
                const cardWidth = 300;
                const maxScrollLeft = container.scrollWidth - container.clientWidth;

                if (container.scrollLeft >= maxScrollLeft - 10) {

                    container.scrollTo({ left: 0, behavior: 'smooth' });
                } else {

                    container.scrollBy({ left: cardWidth, behavior: 'smooth' });
                }
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [status, products]);

    const handleAdd = async (product: Product) => {
        setAddingId(product.id);
        try {
            await onAddToCart(product);
        } finally {
            setAddingId(null);
        }
    };

    if (status === 'error' || (status === 'ready' && products.length === 0)) return null;

    const earliestEnd = products.reduce<string | null>((earliest, p) => {
        const end = typeof p.saleEndsAt === 'string' ? p.saleEndsAt : null;
        if (!end) return earliest;
        if (!earliest) return end;
        return new Date(end).getTime() < new Date(earliest).getTime() ? end : earliest;
    }, null);

    return (
        <section className="max-w-7xl mx-auto px-4 py-6" aria-label="Flash sale">
            <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-4 sm:p-5 mb-4 flex flex-wrap items-center justify-between gap-3 shadow-md">
                <h2 className="text-lg sm:text-xl font-extrabold text-white uppercase tracking-tight flex items-center gap-2">
                    ⚡ Flash Sale
                </h2>
                {earliestEnd && (
                    <div className="flex items-center gap-2 text-white text-sm bg-black/20 px-3.5 py-1.5 rounded-xl">
                        <span className="hidden sm:inline font-medium">Kết thúc sau:</span>
                        <Countdown endsAt={earliestEnd} />
                    </div>
                )}
            </div>

            {status === 'loading' ? (
                <div className="flex gap-4 overflow-hidden" aria-busy="true" aria-label="Đang tải flash sale">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="w-[280px] h-[340px] flex-shrink-0 rounded-2xl bg-white border border-gray-100 animate-pulse" />
                    ))} 
                </div>
            ) : (
                <div
                    ref={scrollRef}
                    className={`flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 ${NO_SCROLLBAR}`}
                >
                    {products.map((item) => (
                        <div key={item.id} className="snap-start flex-shrink-0">
                            <ProductCard item={item} adding={addingId === item.id} onAdd={handleAdd} />
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}