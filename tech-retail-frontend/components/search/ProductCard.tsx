import Link from 'next/link';
import type { Product } from '@/app/lib/products';
import { currencyFormatter, resolveImageUrl } from '@/app/lib/products';

interface ProductCardProps {
    product: Product;
    adding: boolean;
    onAdd: (product: Product) => void | Promise<void>;
}

export default function ProductCard({ product, adding, onAdd }: ProductCardProps) {
    const outOfStock = product.stock <= 0;
    const imageSrc = resolveImageUrl(product.imageUrl);
    const specs = [product.ram, product.gpu].filter(Boolean) as string[];

    return (
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
            <Link href={`/products/${product.id}`} className="block">
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
                            alt={product.name}
                            loading="lazy"
                            className={`w-full h-full object-contain p-3 ${outOfStock ? 'opacity-50 grayscale' : ''}`}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl text-gray-300">🖥️</div>
                    )}
                </div>

                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wide mb-1">
                    {product.brand || product.category}
                </p>
                <h3 className="text-xs font-bold text-slate-800 line-clamp-2 min-h-[32px] hover:text-blue-600 transition-colors leading-snug">
                    {product.name}
                </h3>

                {specs.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {specs.map((s) => (
                            <span key={s} className="text-[10px] font-semibold text-slate-500 bg-slate-50 border border-slate-100 rounded px-1.5 py-0.5">
                                {s}
                            </span>
                        ))}
                    </div>
                )}
            </Link>

            <div className="mt-4 space-y-2">
                <span className="text-base font-extrabold text-blue-600 block">
                    {currencyFormatter.format(product.price)}
                </span>

                {/* Hành động chính: thêm vào giỏ hàng, cùng kiểu nút với trang chủ */}
                <button
                    type="button"
                    disabled={outOfStock || adding}
                    onClick={() => onAdd(product)}
                    className="w-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-bold text-xs py-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-50 disabled:hover:text-blue-600"
                >
                    {outOfStock ? 'Hết hàng' : adding ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
                </button>

                {/* Hành động phụ: xem chi tiết */}
                <Link
                    href={`/products/${product.id}`}
                    className="block text-center w-full font-bold text-xs py-2 rounded-xl border border-gray-200 text-slate-600 hover:border-blue-600 hover:text-blue-600 transition-all"
                >
                    Xem chi tiết
                </Link>
            </div>
        </div>
    );
}
