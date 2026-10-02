'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Toast from '@/components/Toast';
import {
    ApiError,
    apiFetch,
    clearSession,
    formatVnd,
    getToken,
    resolveImageUrl,
    type Product,
} from '@/app/lib/api';
import { useCartCount, useStoredUser, useToast } from '@/app/lib/hooks';

interface ProductDetailClientProps {
    product: Product;
    related: Product[];
}

function asText(value: unknown): string | undefined {
    return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

interface SpecRow {
    label: string;
    value: string;
}

export default function ProductDetailClient({ product, related }: ProductDetailClientProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const user = useStoredUser();
    const [cartCount, setCartCount] = useCartCount(user !== null);
    const { toast, showToast } = useToast();

    const stock = product.stock ?? 0;
    const outOfStock = stock <= 0;
    const [quantity, setQuantity] = useState(1);
    const [submitting, setSubmitting] = useState(false);

    const imageSrc = resolveImageUrl(product);
    const brand = asText(product.brand);
    const cpu = asText(product.cpu);
    const ram = asText(product.ram);
    const gpu = asText(product.gpu);

    const specs: SpecRow[] = [
        brand && { label: 'Thương hiệu', value: brand },
        product.category && { label: 'Danh mục', value: product.category },
        cpu && { label: 'CPU', value: cpu },
        ram && { label: 'RAM', value: ram },
        gpu && { label: 'Card đồ họa', value: gpu },
    ].filter((row): row is SpecRow => Boolean(row));

    const handleLogout = () => {
        clearSession();
        setCartCount(0);
        router.refresh();
    };

    const addToCart = async (qty: number): Promise<boolean> => {
        if (!getToken()) {
            showToast('error', 'Vui lòng đăng nhập để thêm vào giỏ hàng.');
            router.push('/login');
            return false;
        }

        try {
            await apiFetch(`/api/Cart/add?productId=${product.id}&quantity=${qty}`, { method: 'POST' });
            setCartCount((prev) => prev + qty);
            showToast('success', `Đã thêm ${qty} sản phẩm vào giỏ hàng!`);
            return true;
        } catch (err) {
            if (err instanceof ApiError && err.status === 401) {
                clearSession();
                router.push('/login');
                return false;
            }
            showToast('error', err instanceof Error ? err.message : 'Không thể thêm vào giỏ hàng.');
            return false;
        }
    };

    const handleAddToCart = async () => {
        setSubmitting(true);
        try {
            await addToCart(quantity);
        } finally {
            setSubmitting(false);
        }
    };

    const handleBuyNow = async () => {
        setSubmitting(true);
        try {
            const ok = await addToCart(quantity);
            if (ok) router.push('/cart');
        } finally {
            setSubmitting(false);
        }
    };

    const [addingRelatedId, setAddingRelatedId] = useState<number | null>(null);
    const handleAddRelated = async (p: Product) => {
        setAddingRelatedId(p.id);
        try {
            await addToCart(1);
        } finally {
            setAddingRelatedId(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] text-slate-800 font-sans antialiased flex flex-col justify-between">
            <div>
                <Header
                    user={user}
                    cartCount={cartCount}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onLogout={handleLogout}
                />

                <div className="max-w-7xl mx-auto px-4 py-6">
                    {/* Breadcrumb */}
                    <nav aria-label="Breadcrumb" className="text-xs text-gray-500 mb-4 flex items-center gap-1.5 flex-wrap">
                        <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
                        {product.category && (
                            <>
                                <span>/</span>
                                <span>{product.category}</span>
                            </>
                        )}
                        <span>/</span>
                        <span className="text-slate-700 font-semibold line-clamp-1">{product.name}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Ảnh sản phẩm */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                                {outOfStock && (
                                    <span className="absolute top-3 left-3 z-10 bg-slate-800 text-white text-[10px] font-bold px-2.5 py-1 rounded uppercase">
                                        Hết hàng
                                    </span>
                                )}
                                {imageSrc ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={imageSrc}
                                        alt={product.name}
                                        className={`w-full h-full object-contain p-6 ${outOfStock ? 'opacity-50 grayscale' : ''}`}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-6xl text-gray-300">🖥️</div>
                                )}
                            </div>
                        </div>

                        {/* Thông tin + mua hàng */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
                            {brand && (
                                <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1.5">{brand}</p>
                            )}
                            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug mb-3">{product.name}</h1>

                            {specs.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {specs
                                        .filter((s) => s.label !== 'Thương hiệu' && s.label !== 'Danh mục')
                                        .map((s) => (
                                            <span
                                                key={s.label}
                                                className="text-[11px] font-semibold text-slate-600 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1"
                                            >
                                                {s.value}
                                            </span>
                                        ))}
                                </div>
                            )}

                            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-4">
                                <span className="text-2xl sm:text-3xl font-extrabold text-blue-600">{formatVnd(product.price)}</span>
                            </div>

                            <p className={`text-sm font-semibold mb-5 ${outOfStock ? 'text-red-600' : 'text-green-600'}`}>
                                {outOfStock ? 'Hiện đang hết hàng' : `Còn ${stock} sản phẩm`}
                            </p>

                            {!outOfStock && (
                                <div className="flex items-center gap-3 mb-5">
                                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Số lượng</span>
                                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                                        <button
                                            type="button"
                                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                            disabled={quantity <= 1}
                                            aria-label="Giảm số lượng"
                                            className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            −
                                        </button>
                                        <span className="w-10 text-center text-sm font-bold">{quantity}</span>
                                        <button
                                            type="button"
                                            onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                                            disabled={quantity >= stock}
                                            aria-label="Tăng số lượng"
                                            className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="mt-auto flex flex-col sm:flex-row gap-3">
                                <button
                                    type="button"
                                    onClick={handleBuyNow}
                                    disabled={outOfStock || submitting}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm uppercase tracking-wide py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Mua ngay
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAddToCart}
                                    disabled={outOfStock || submitting}
                                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-sm uppercase tracking-wide py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Thêm vào giỏ hàng
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Thông số kỹ thuật */}
                    {specs.length > 0 && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-6">
                            <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-tight mb-4">Thông số kỹ thuật</h2>
                            <div className="divide-y divide-gray-100">
                                {specs.map((s) => (
                                    <div key={s.label} className="flex py-2.5 text-sm">
                                        <span className="w-40 flex-shrink-0 text-gray-500">{s.label}</span>
                                        <span className="font-semibold text-slate-800">{s.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Mô tả sản phẩm */}
                    {product.description && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-6">
                            <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-tight mb-4">Mô tả sản phẩm</h2>
                            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{product.description}</p>
                        </div>
                    )}

                    {/* TODO: Đánh giá sản phẩm — làm sau khi có trạng thái đơn hàng "đã hoàn thành" bên khách hàng,
                        để chỉ cho khách đã nhận hàng viết đánh giá (từ giỏ hàng / lịch sử đơn của họ). */}

                    {/* Sản phẩm liên quan */}
                    {related.length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-lg font-extrabold uppercase text-slate-900 tracking-tight mb-4">Sản phẩm liên quan</h2>
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {related.map((p) => (
                                    <ProductCard
                                        key={p.id}
                                        item={p}
                                        adding={addingRelatedId === p.id}
                                        onAdd={handleAddRelated}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
            <Toast toast={toast} />
        </div>
    );
}
