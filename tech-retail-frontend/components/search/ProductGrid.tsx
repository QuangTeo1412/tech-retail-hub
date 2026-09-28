import Link from 'next/link';
import ProductCard from '@/components/search/ProductCard';
import type { Product } from '@/app/lib/products';

interface ProductGridProps {
    products: Product[];
    keyword?: string;
}

function EmptyState({ keyword }: { keyword?: string }) {
    return (
        <div className="flex flex-col items-center justify-center text-center py-20 px-4">
            <span className="text-6xl mb-4" role="img" aria-hidden="true">
                🔍
            </span>
            <h2 className="text-lg font-extrabold text-slate-800">
                {keyword ? (
                    <>
                        Không tìm thấy sản phẩm nào với từ khóa <span className="text-blue-600">&quot;{keyword}&quot;</span>
                    </>
                ) : (
                    'Không tìm thấy sản phẩm phù hợp với bộ lọc'
                )}
            </h2>
            <p className="text-sm text-gray-500 mt-2 max-w-sm">
                Hãy thử bỏ bớt bộ lọc, chọn khoảng giá rộng hơn, hoặc kiểm tra lại từ khóa tìm kiếm.
            </p>
            <Link
                href="/"
                className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-3 rounded-xl transition-all"
            >
                Về trang chủ
            </Link>
        </div>
    );
}

export default function ProductGrid({ products, keyword }: ProductGridProps) {
    if (products.length === 0) return <EmptyState keyword={keyword} />;

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
