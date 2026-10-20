'use client';

import { useEffect, useRef, useState } from 'react';
import ProductCard from './ProductCard';
import { apiFetch, type Product } from '../app/lib/api';
import { CARD_GAP, CARD_WIDTH, NO_SCROLLBAR } from '../app/lib/data';
import { usePrefersReducedMotion } from '../app/lib/hooks';

const FLASH_SALE_AUTOPLAY_INTERVAL = 5000;

interface FlashSaleSectionProps {
    onAddToCart: (product: Product) => Promise<void>;
}

function msToParts(ms: number) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const d = Math.floor(total / 86400);
    const h = Math.floor((total % 86400) / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return { d, h, m, s };
}

function Countdown({ endsAt }: { endsAt: string }) {
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    const { d, h, m, s } = msToParts(new Date(endsAt).getTime() - now);
    const pad = (n: number) => String(n).padStart(2, '0');

    return (
        <span className="font-mono tabular-nums">
            {d > 0 && `${d} ngày `}
            {pad(h)}:{pad(m)}:{pad(s)}
        </span>
    );
}

export default function FlashSaleSection({ onAddToCart }: FlashSaleSectionProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [addingId, setAddingId] = useState<number | null>(null);
    const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
    const [products, setProducts] = useState<Product[]>([]);
    const [paused, setPaused] = useState(false);
    const reducedMotion = usePrefersReducedMotion();

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

    const handleAdd = async (product: Product) => {
        setAddingId(product.id);
        try {
            await onAddToCart(product);
        } finally {
            setAddingId(null);
        }
    };

    useEffect(() => {
        if (paused || reducedMotion || products.length === 0) return;
        const interval = setInterval(() => {
            const el = scrollRef.current;
            if (!el || document.hidden) return;
            const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
            if (el.scrollLeft >= maxScroll - 4) {
                el.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                el.scrollBy({ left: CARD_WIDTH + CARD_GAP, behavior: 'smooth' });
            }
        }, FLASH_SALE_AUTOPLAY_INTERVAL);
        return () => clearInterval(interval);
    }, [paused, reducedMotion, products.length]);

    if (status === 'error') return null;

    const earliestEnd = products.reduce<string | null>((earliest, p) => {
        const end = typeof p.saleEndsAt === 'string' ? p.saleEndsAt : null;
        if (!end) return earliest;
        if (!earliest) return end;
        return new Date(end).getTime() < new Date(earliest).getTime() ? end : earliest;
    }, null);

    return (
        <section className="max-w-7xl mx-auto px-4 py-6" aria-label="Flash sale">
            <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-4 sm:p-5 mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg sm:text-xl font-extrabold text-white uppercase tracking-tight flex items-center gap-2">
                    ⚡ Flash Sale
                </h2>
                {earliestEnd && (
                    <div className="flex items-center gap-2 text-white text-sm font-bold bg-black/20 px-3 py-1.5 rounded-xl">
                        <span className="hidden sm:inline">Kết thúc sau</span>
                        <Countdown endsAt={earliestEnd} />
                    </div>
                )}
            </div>

            {status === 'loading' && (
                <div className="flex gap-4 overflow-hidden" aria-busy="true" aria-label="Đang tải flash sale">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="w-[280px] h-[340px] flex-shrink-0 rounded-2xl bg-white border border-gray-100 animate-pulse" />
                    ))}
                </div>
            )}

            {status === 'ready' && products.length === 0 && (
                <p className="text-sm text-gray-500">Hiện chưa có chương trình Flash Sale.</p>
            )}

            {status === 'ready' && products.length > 0 && (
                <div
                    ref={scrollRef}
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                    onFocusCapture={() => setPaused(true)}
                    onBlurCapture={() => setPaused(false)}
                    className={`flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 ${NO_SCROLLBAR}`}
                >
                    {products.map((item) => (
                        <ProductCard key={item.id} item={item} adding={addingId === item.id} onAdd={handleAdd} />
                    ))}
                </div>
            )}
        </section>
    );
}