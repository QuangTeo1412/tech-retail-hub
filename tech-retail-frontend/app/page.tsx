'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSlider from '@/components/HeroSlider';
import FeaturedSection from '@/components/FeaturedSection';
import { PromoBanners, ServiceHighlights } from '@/components/StaticSections';
import type { Laptop } from '@/lib/data';

export default function HomePage() {
    const [cartCount, setCartCount] = useState<number>(2);

    const handleAddToCart = (laptop?: Laptop) => {
        setCartCount((prev) => prev + 1);
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] text-slate-800 font-sans antialiased flex flex-col justify-between">
            <div>
                <Header cartCount={cartCount} />

                {/* Banner Promotion */}
                <section className="max-w-7xl mx-auto px-4 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
                        <HeroSlider />
                        <PromoBanners />
                    </div>
                </section>

                {/* Danh Sách Laptop Nổi Bật */}
                <FeaturedSection onAddToCart={handleAddToCart} />

                {/* Khối Thông Tin Ưu Điểm Dịch Vụ */}
                <ServiceHighlights />
            </div>

            <Footer />
        </div>
    );
}
