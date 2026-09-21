import { useCallback, useEffect, useRef, useState } from 'react';
import ChevronIcon from './ChevronIcon';
import ProductCard from './ProductCard';
import { apiFetch, type Product } from '../app/lib/api';
import { CARD_GAP, CARD_WIDTH, NO_SCROLLBAR, PRODUCT_AUTOPLAY_INTERVAL } from '../app/lib/data';
import { useDebouncedValue, usePrefersReducedMotion } from '../app/lib/hooks';

interface FeaturedSectionProps {
    searchQuery: string;
    onAddToCart: (product: Product) => Promise<void>;
}

export default function FeaturedSection({ searchQuery, onAddToCart }: FeaturedSectionProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [paused, setPaused] = useState(false);
    const reducedMotion = usePrefersReducedMotion();
    const [scrollState, setScrollState] = useState({ canPrev: false, canNext: true, page: 0, pageCount: 1 });
    const [addingId, setAddingId] = useState<number | null>(null);

    const query = useDebouncedValue(searchQuery.trim(), 400);
    const [reloadKey, setReloadKey] = useState(0);
    const requestKey = `${query}#${reloadKey}`;
    const [result, setResult] = useState<{ key: string; products: Product[]; failed: boolean } | null>(null);

    useEffect(() => {
        let cancelled = false;

        const params = new URLSearchParams({ pageNumber: '1', pageSize: '12' });
        if (query) params.set('search', query);

        (async () => {
            try {
                const res = await apiFetch<{ data: Product[] }>(`/api/Products?${params.toString()}`, { auth: false });
                if (!cancelled) {
                    setResult({ key: requestKey, products: Array.isArray(res.data) ? res.data : [], failed: false });
                }
            } catch {
                if (!cancelled) setResult({ key: requestKey, products: [], failed: true });
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [query, requestKey]);

    const isCurrent = result !== null && result.key === requestKey;
    const loadStatus: 'loading' | 'error' | 'ready' = !isCurrent ? 'loading' : result.failed ? 'error' : 'ready';
    const products = isCurrent && !result.failed ? result.products : [];

    const handleAdd = async (product: Product) => {
        setAddingId(product.id);
        try {
            await onAddToCart(product);
        } finally {
            setAddingId(null);
        }
    };

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
    }, [updateScrollState, products.length]);

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
        if (paused || reducedMotion || products.length === 0) return;
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
    }, [paused, reducedMotion, products.length]);

    const { canPrev, canNext, page, pageCount } = scrollState;
    const arrowClass =
        'w-9 h-9 rounded-full border border-gray-200 bg-white text-slate-700 flex items-center justify-center transition-colors hover:bg-blue-600 hover:text-white hover:border-blue-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-700 disabled:hover:border-gray-200';

    return (
        <section className="max-w-7xl mx-auto px-4 py-6" aria-label="Sản phẩm nổi bật">
            <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-xl font-extrabold uppercase text-slate-900 tracking-tight">
                    {query ? `KẾT QUẢ CHO “${query}”` : 'SẢN PHẨM NỔI BẬT'}
                </h2>
                {loadStatus === 'ready' && products.length > 0 && (
                    <div className="flex items-center gap-2">
                        <button type="button" aria-label="Xem sản phẩm trước" disabled={!canPrev} onClick={() => scrollByPage(-1)} className={arrowClass}>
                            <ChevronIcon direction="left" />
                        </button>
                        <button type="button" aria-label="Xem sản phẩm tiếp theo" disabled={!canNext} onClick={() => scrollByPage(1)} className={arrowClass}>
                            <ChevronIcon direction="right" />
                        </button>
                    </div>
                )}
            </div>

            {loadStatus === 'loading' && (
                <div className="flex gap-4 overflow-hidden" aria-busy="true" aria-label="Đang tải sản phẩm">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="w-[280px] h-[340px] flex-shrink-0 rounded-2xl bg-white border border-gray-100 animate-pulse" />
                    ))}
                </div>
            )}

            {loadStatus === 'error' && (
                <div role="alert" className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
                    <p className="text-sm text-slate-600">Không tải được danh sách sản phẩm. Vui lòng kiểm tra backend đã chạy chưa.</p>
                    <button
                        type="button"
                        onClick={() => setReloadKey((key) => key + 1)}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors"
                    >
                        Thử lại
                    </button>
                </div>
            )}

            {loadStatus === 'ready' && products.length === 0 && (
                <p className="text-sm text-gray-500">
                    {query ? `Không tìm thấy sản phẩm nào cho “${query}”.` : 'Chưa có sản phẩm nào.'}
                </p>
            )}

            {loadStatus === 'ready' && products.length > 0 && (
                <>
                    <div
                        ref={scrollRef}
                        onScroll={updateScrollState}
                        onMouseEnter={() => setPaused(true)}
                        onMouseLeave={() => setPaused(false)}
                        onFocusCapture={() => setPaused(true)}
                        onBlurCapture={() => setPaused(false)}
                        className={`flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 ${NO_SCROLLBAR}`}
                    >
                        {products.map((item) => (
                            <ProductCard key={item.id} item={item} adding={addingId === item.id} onAdd={handleAdd} />
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
                </>
            )}
        </section>
    );
}
