'use client';

import { useState } from 'react';

export interface Product {
    id: string;
    name: string;
    price: string;
    rawPrice: number;
    badge?: string;
    category: string;
    image?: string;
}

const initialProducts: Product[] = [
    { id: '1', name: 'Laptop Lenovo LOQ 15 Gaming - i5 12450HX, RTX 3050', price: '18.490.000đ', rawPrice: 18490000, badge: 'GIÁ TỐT', category: 'Laptop Mới' },
    { id: '2', name: 'Laptop Apple MacBook Pro 14" M3 - 8-Core CPU', price: '39.990.000đ', rawPrice: 39990000, badge: 'CAO CẤP', category: 'Laptop Mới' },
    { id: '3', name: 'Laptop Acer Predator Helios Neo 16 - i7, RTX 4060', price: '35.990.000đ', rawPrice: 35990000, badge: 'GAMING', category: 'Laptop Mới' },
    { id: '4', name: 'Laptop Dell XPS 13 Plus 9320 - i7 1360P, OLED', price: '41.990.000đ', rawPrice: 41990000, badge: 'SANG TRỌNG', category: 'Laptop Mới' },
];

export default function ProductSection({ searchQuery }: { searchQuery: string }) {
    const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');

    const categories = ['Tất cả', 'Laptop Mới', 'Laptop Cũ', 'Linh Kiện Laptop', 'Đồ Công Nghệ'];

    const filteredProducts = initialProducts.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'Tất cả' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <section className="max-w-7xl mx-auto px-4 py-8">
            {/* Filter danh mục nhanh */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedCategory === cat
                                ? 'bg-slate-900 text-white shadow-md'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid sản phẩm hoặc Empty State */}
            {filteredProducts.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <div className="text-4xl mb-3">🐱‍👤</div>
                    <h3 className="text-base font-black text-slate-800 uppercase">Không tìm thấy sản phẩm phù hợp</h3>
                    <p className="text-xs text-slate-500 mt-1">Thử đổi từ khóa tìm kiếm &ldquo;{searchQuery}&rdquo; hoặc chọn danh mục khác nhé!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((p) => (
                        <div key={p.id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                            <div>
                                {p.badge && (
                                    <span className="inline-block bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md mb-2 uppercase">
                                        {p.badge}
                                    </span>
                                )}
                                <div className="h-40 bg-slate-100 rounded-xl mb-4 flex items-center justify-center text-xs text-slate-400 font-bold">
                                    [Ảnh Laptop]
                                </div>
                                <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-relaxed mb-2">
                                    {p.name}
                                </h4>
                            </div>
                            <div>
                                <div className="text-sm font-black text-blue-600 mb-3">{p.price}</div>
                                <button className="w-full bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 font-extrabold text-xs py-3 rounded-xl transition-all">
                                    Thêm vào giỏ hàng
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}