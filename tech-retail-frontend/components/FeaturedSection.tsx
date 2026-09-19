'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import ChevronIcon from '@/components/ChevronIcon';
import { usePrefersReducedMotion } from '@/lib/hooks';
import { FEATURED_LAPTOPS, NO_SCROLLBAR, PRODUCT_AUTOPLAY_INTERVAL, CARD_WIDTH, CARD_GAP, type Laptop } from '@/lib/data';
import Image from 'next/image';

interface FeaturedSectionProps {
    onAddToCart: (laptop: Laptop) => void;
}

export default function FeaturedSection({ onAddToCart }: FeaturedSectionProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [paused, setPaused] = useState(false);
    const reducedMotion = usePrefersReducedMotion();
    const [scrollState, setScrollState] = useState({ canPrev: false, canNext: true, page: 0, pageCount: 1 });

    const updateScrollState = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;

        const maxScroll = el.scrollWidth - el.clientWidth;
        const pageCount = Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth));
        const page = maxScroll > 0 ? Math.round((el.scrollLeft / maxScroll) * (pageCount - 1)) : 0;

        setScrollState({
            canPrev: el.scrollLeft > 4,
            canNext: el.scrollLeft < maxScroll - 4,
            page,
            pageCount,
        });
    }, []);

    useEffect(() => {
        const frame = requestAnimationFrame(updateScrollState);
        window.addEventListener('resize', updateScrollState);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('resize', updateScrollState);
        };
    }, [updateScrollState]);

    const scrollByPage = (direction: 1 | -1) => {
        const el = scrollRef.current;
        if (!el) return;
        const step = CARD_WIDTH + CARD_GAP;
        const visibleCards = Math.max(1, Math.floor(el.clientWidth / step));
        el.scrollBy({ left: direction * visibleCards * step, behavior: 'smooth' });
    };

    const scrollToPage = (index: number) => {
        const el = scrollRef.current;
        if (!el) return;
        const maxScroll = el.scrollWidth - el.clientWidth;
        const { pageCount } = scrollState;
        el.scrollTo({ left: pageCount > 1 ? (index / (pageCount - 1)) * maxScroll : 0, behavior: 'smooth' });
    };

    useEffect(() => {
        if (paused || reducedMotion) return;
        const interval = setInterval(() => {
            const el = scrollRef.current;
            if (!el || document.hidden) return;
            const maxScroll = el.scrollWidth - el.clientWidth;
            if (el.scrollLeft >= maxScroll - 4) {
                el.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                el.scrollBy({ left: CARD_WIDTH + CARD_GAP, behavior: 'smooth' });
            }
        }, PRODUCT_AUTOPLAY_INTERVAL);
        return () => clearInterval(interval);
    }, [paused, reducedMotion]);

    const { canPrev, canNext, page, pageCount } = scrollState;
    const arrowClass =
        'w-9 h-9 rounded-full border border-gray-200 bg-white text-slate-700 flex items-center justify-center transition-colors hover:bg-blue-600 hover:text-white hover:border-blue-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-700 disabled:hover:border-gray-200';

    return (
        <section className="max-w-7xl mx-auto px-4 py-6" aria-label="Laptop nổi bật">
            <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-xl font-extrabold uppercase text-slate-900 tracking-tight">LAPTOP NỔI BẬT</h2>
                <div className="flex items-center gap-2">
                    <button type="button" aria-label="Xem sản phẩm trước" disabled={!canPrev} onClick={() => scrollByPage(-1)} className={arrowClass}>
                        <ChevronIcon direction="left" />
                    </button>
                    <button type="button" aria-label="Xem sản phẩm tiếp theo" disabled={!canNext} onClick={() => scrollByPage(1)} className={arrowClass}>
                        <ChevronIcon direction="right" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                onScroll={updateScrollState}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                onFocusCapture={() => setPaused(true)}
                onBlurCapture={() => setPaused(false)}
                className={`flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 ${NO_SCROLLBAR}`}
            >
                {FEATURED_LAPTOPS.map((item) => (
                    <ProductCard key={item.id} item={item} onAddToCart={onAddToCart} />
                ))}
            </div>

            {pageCount > 1 && (
                <div className="flex justify-center items-center">
                    {Array.from({ length: pageCount }).map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            aria-label={`Trang ${i + 1}`}
                            aria-current={i === page}
                            onClick={() => scrollToPage(i)}
                            className="p-1.5"
                        >
                            <span
                                className={`block h-2 rounded-full transition-all duration-300 ${i === page ? 'w-6 bg-blue-600' : 'w-2 bg-gray-300 hover:bg-gray-400'
                                    }`}
                            />
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
}



interface ProductCardProps {
    item: Laptop;
    onAddToCart: (laptop: Laptop) => void;
}

function ProductCard({ item, onAddToCart }: ProductCardProps) {
    const isProductPhoto = item.image.startsWith('/');

    return (
        <div className="w-[280px] flex-shrink-0 snap-start bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
            <div>
                <div
                    className={`relative h-44 rounded-xl overflow-hidden mb-3 ${isProductPhoto ? 'bg-white border border-gray-100' : 'bg-gray-50'
                        }`}
                >
                    <span className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                        {item.badge}
                    </span>
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        quality={90}
                        sizes="280px"
                        className={`group-hover:scale-105 transition-transform duration-500 ${isProductPhoto ? 'object-contain p-3' : 'object-cover'
                            }`}
                    />
                </div>

                <h3 className="text-xs font-bold text-slate-800 line-clamp-2 min-h-[32px] group-hover:text-blue-600 transition-colors leading-snug">
                    {item.name}
                </h3>
            </div>

            <div className="mt-4">
                <div className="flex items-baseline justify-between mb-3">
                    <div>
                        <span className="text-base font-extrabold text-blue-600 block">{item.price}</span>
                        <span className="text-[11px] text-gray-400 line-through">{item.oldPrice}</span>
                    </div>
                    <span className="bg-red-50 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {item.discount}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={() => onAddToCart(item)}
                    className="w-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-bold text-xs py-2.5 rounded-xl transition-all"
                >
                    Thêm vào giỏ hàng
                </button>
            </div>
        </div>
    );
}
