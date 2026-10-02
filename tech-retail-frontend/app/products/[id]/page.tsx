import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/product/ProductDetailClient';
import { apiFetch, ApiError, type Product } from '@/app/lib/api';

interface ProductDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
    const { id } = await params;

    let product: Product;
    try {
        product = await apiFetch<Product>(`/api/Products/${id}`, { auth: false });
    } catch (err) {
        if (err instanceof ApiError && err.status === 404) notFound();

        notFound();
    }

    let related: Product[] = [];
    if (product.category) {
        try {
            const res = await apiFetch<{ data: Product[] }>(
                `/api/Products?category=${encodeURIComponent(product.category)}&pageNumber=1&pageSize=6`,
                { auth: false }
            );
            related = (res.data ?? []).filter((p) => p.id !== product.id).slice(0, 5);
        } catch {
            related = [];
        }
    }

    return <ProductDetailClient product={product} related={related} />;
}
