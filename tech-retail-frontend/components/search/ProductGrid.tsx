import Link from 'next/link';
import ProductCard from '@/components/search/ProductCard';
import type { Product } from '@/app/lib/products';

interface ProductGridProps {
    products: Product[];
    keyword?: string;
}

function EmptyState({ keyword }: { keyword?: string }) {
    return (
        <div className="flex flex-col items-center justify-center text-center py-24 px-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <span className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center text-5xl mb-6" role="img" aria-hidden="true">
                🔍
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 leading-snug max-w-lg">
                {keyword ? (
                    <>
                        Không tìm thấy sản phẩm nào với từ khóa{' '}
                        <span className="text-blue-600">&quot;{keyword}&quot;</span>
                    </>
                ) : (
                    'Không tìm thấy sản phẩm phù hợp với bộ lọc'
                )}
            </h2>
            <p className="text-sm text-gray-500 mt-3 max-w-md leading-relaxed">
                Hãy thử bỏ bớt bộ lọc, chọn khoảng giá rộng hơn, hoặc kiểm tra lại từ khóa tìm kiếm.
            </p>
            <Link
                href="/"
                className="mt-8 inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-8 py-3.5 rounded-xl shadow-sm hover:shadow-md transition-all"
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