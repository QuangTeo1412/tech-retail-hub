'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FeaturedSection from '../components/FeaturedSection';
import Footer from '../components/Footer';
import Header from '../components/Header';
import HeroSlider from '../components/HeroSlider';
import PromoBanners from '../components/PromoBanners';
import StaticSections from '../components/StaticSections';
import Toast from '../components/Toast';
import { ApiError, apiFetch, clearSession, getToken, type Product } from './lib/api';
import { useCartCount, useStoredUser, useToast } from './lib/hooks';

export default function HomePage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const user = useStoredUser();
    const [cartCount, setCartCount] = useCartCount(user !== null);
    const { toast, showToast } = useToast();

    const handleLogout = () => {
        clearSession(); // xóa token + user và báo cho các thành phần khác cập nhật
        setCartCount(0);
        router.refresh();
    };

    const handleAddToCart = async (product: Product) => {
        if (!getToken()) {
            showToast('error', 'Vui lòng đăng nhập để thêm vào giỏ hàng.');
            router.push('/login');
            return;
        }

        try {
            await apiFetch(`/api/Cart/add?productId=${product.id}&quantity=1`, { method: 'POST' });
            setCartCount((prev) => prev + 1);
            showToast('success', 'Đã thêm vào giỏ hàng!');
        } catch (err) {
            if (err instanceof ApiError && err.status === 401) {
                clearSession();
                router.push('/login');
                return;
            }
            showToast('error', err instanceof Error ? err.message : 'Không thể thêm vào giỏ hàng.');
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

                {/* Banner Promotion */}
                <section className="max-w-7xl mx-auto px-4 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
                        <HeroSlider />
                        <PromoBanners />
                    </div>
                </section>

                <FeaturedSection searchQuery={searchQuery} onAddToCart={handleAddToCart} />

                <StaticSections />
            </div>

            <Footer />
            <Toast toast={toast} />
        </div>
    );
}
