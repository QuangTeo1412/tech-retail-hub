import { formatVnd, resolveImageUrl, type Product } from '../app/lib/api';

interface ProductCardProps {
    item: Product;
    adding: boolean;
    onAdd: (product: Product) => void | Promise<void>;
}

export default function ProductCard({ item, adding, onAdd }: ProductCardProps) {
    const imageSrc = resolveImageUrl(item);
    const outOfStock = typeof item.stock === 'number' && item.stock <= 0;

    return (
        <div className="w-[280px] flex-shrink-0 snap-start bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
            <div>
                <div className="relative h-44 rounded-xl overflow-hidden mb-3 bg-gray-50 border border-gray-100">
                    {outOfStock && (
                        <span className="absolute top-2 left-2 z-10 bg-slate-800 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                            Hết hàng
                        </span>
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
            </div>

            <div className="mt-4">
                <span className="text-base font-extrabold text-blue-600 block mb-3">{formatVnd(item.price)}</span>

                <button
                    type="button"
                    disabled={adding || outOfStock}
                    onClick={() => onAdd(item)}
                    className="w-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-bold text-xs py-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-50 disabled:hover:text-blue-600"
                >
                    {outOfStock ? 'Hết hàng' : adding ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
                </button>
            </div>
        </div>
    );
}