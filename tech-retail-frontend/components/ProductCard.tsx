// Không cần 'use client': file này chỉ được import từ app/page.tsx (đã là client component).

import { formatVnd, resolveImageUrl, type Product } from '../app/lib/api';

export default function ProductCard({
    item,
    adding,
    onAdd,
}: {
    item: Product;
    adding: boolean;
    onAdd: (product: Product) => void;
}) {
    const image = resolveImageUrl(item);
    const stock = typeof item.stock === 'number' ? item.stock : null;
    const outOfStock = stock !== null && stock <= 0;
    const lowStock = stock !== null && stock > 0 && stock <= 5;

    return (
        <div className="w-[280px] flex-shrink-0 snap-start bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
            <div>
                <div className="relative h-44 rounded-xl overflow-hidden mb-3 bg-white border border-gray-100">
                    {(outOfStock || lowStock) && (
                        <span className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                            {outOfStock ? 'HẾT HÀNG' : `CÒN ${stock}`}
                        </span>
                    )}
                    {image ? (
                        // Ảnh từ backend: dùng <img> thường để không phải khai báo domain trong next.config
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={image}
                            alt={item.name}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-4xl" role="presentation">
                            💻
                        </div>
                    )}
                </div>

                {item.category ? (
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">{item.category}</p>
                ) : null}
                <h3 className="text-xs font-bold text-slate-800 line-clamp-2 min-h-[32px] group-hover:text-blue-600 transition-colors leading-snug">
                    {item.name}
                </h3>
            </div>

            <div className="mt-4">
                <span className="text-base font-extrabold text-blue-600 block mb-3">{formatVnd(item.price)}</span>

                <button
                    type="button"
                    onClick={() => onAdd(item)}
                    disabled={outOfStock || adding}
                    className="w-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-bold text-xs py-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-50 disabled:hover:text-blue-600"
                >
                    {outOfStock ? 'Hết hàng' : adding ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
                </button>
            </div>
        </div>
    );
}