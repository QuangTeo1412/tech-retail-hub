import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatVnd, resolveImageUrl, type Product } from '../app/lib/api';
interface ProductCardProps {
    item: Product;
    adding: boolean;
    onAdd: (product: Product) => void | Promise<void>;
}
function asNumber(value: unknown): number | undefined {
    return typeof value === 'number' ? value : undefined;
}
function asDateString(value: unknown): string | undefined {
    return typeof value === 'string' ? value : undefined;
}
export default function ProductCard({ item, adding, onAdd }: ProductCardProps) {
    const imageSrc = resolveImageUrl(item);
    const outOfStock = typeof item.stock === 'number' && item.stock <= 0;
    const salePrice = asNumber(item.salePrice);
    const saleEndsAt = asDateString(item.saleEndsAt);
    const hasSaleFields = salePrice != null && salePrice < item.price && !!saleEndsAt;
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        if (!hasSaleFields) return;
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, [hasSaleFields]);

    const isOnSale = hasSaleFields && new Date(saleEndsAt!).getTime() > now;

    return (
        <div className="w-[280px] flex-shrink-0 snap-start bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
            <Link href={`/products/${item.id}`} className="block">
                <div className="relative h-44 rounded-xl overflow-hidden mb-3 bg-gray-50 border border-gray-100">
                    {outOfStock && (
                        <span className="absolute top-2 left-2 z-10 bg-slate-800 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                            Hết hàng
                        </span>
                    )}
                    {!outOfStock && isOnSale && (
                        <>
                            <span className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                                Flash Sale
                            </span>
                            {/* Chấm đỏ nhấp nháy góc phải trên, báo hiệu sản phẩm đang sale */}
                            <span className="absolute top-2 right-2 z-10 flex h-3 w-3" aria-hidden="true">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
                            </span>
                        </> 
                    )}
                    {imageSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={imageSrc}
                            alt={item.name}
                            loading="lazy"
                            className={`w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500 ${outOfStock ? 'opacity-50 grayscale' : ''}`}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl text-gray-300">🖥️</div>
                    )}
                </div>

                {item.category && (
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wide mb-1">{item.category}</p>
                )}
                <h3 className="text-xs font-bold text-slate-800 line-clamp-2 min-h-[32px] group-hover:text-blue-600 transition-colors leading-snug">
                    {item.name}
                </h3>
            </Link>

            <div className="mt-4 space-y-2">
                {isOnSale ? (
                    <div>
                        <span className="text-base font-extrabold text-red-600 block">{formatVnd(salePrice!)}</span>
                        <span className="text-xs text-gray-400 line-through">{formatVnd(item.price)}</span>
                    </div>
                ) : (
                    <span className="text-base font-extrabold text-blue-600 block">{formatVnd(item.price)}</span>
                )}

                <button
                    type="button"
                    disabled={adding || outOfStock}
                    onClick={() => onAdd(item)}
                    className="w-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-bold text-xs py-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-50 disabled:hover:text-blue-600"
                >
                    {outOfStock ? 'Hết hàng' : adding ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
                </button>

                <Link
                    href={`/products/${item.id}`}
                    className="block text-center w-full font-bold text-xs py-2 rounded-xl border border-gray-200 text-slate-600 hover:border-blue-600 hover:text-blue-600 transition-all"
                >
                    Xem chi tiết
                </Link>
            </div>
        </div>
    );
}