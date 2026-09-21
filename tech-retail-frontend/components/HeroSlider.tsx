'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ChevronIcon from './ChevronIcon';
import { HERO_INTERVAL, HERO_SLIDES } from '../app/lib/data';
import { usePrefersReducedMotion } from '../app/lib/hooks';

export default function HeroSlider() {
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);
    const reducedMotion = usePrefersReducedMotion();
    const count = HERO_SLIDES.length;

    const goTo = (index: number) => setCurrent((index + count) % count);

    useEffect(() => {
        if (paused || reducedMotion) return;
        const timer = setTimeout(() => setCurrent((c) => (c + 1) % count), HERO_INTERVAL);
        return () => clearTimeout(timer);
    }, [current, paused, reducedMotion, count]);

    return (
        <div
            role="region"
            aria-roledescription="carousel"
            aria-label="Khuyến mãi nổi bật"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
            className="group/hero lg:col-span-2 relative rounded-2xl overflow-hidden min-h-[400px] sm:min-h-[340px] bg-slate-950 text-white shadow-sm"
        >
            {HERO_SLIDES.map((slide, i) => {
                const active = i === current;
                const Heading = i === 0 ? 'h1' : 'h2';

                return (
                    <div
                        key={slide.id}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`${i + 1} / ${count}`}
                        aria-hidden={!active}
                        className={`absolute inset-0 transition-opacity duration-1000 motion-reduce:transition-none ${active ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                            }`}
                    >
                        <Image
                            src={slide.image}
                            alt=""
                            fill
                            priority={i === 0}
                            quality={90}
                            sizes="(max-width: 1024px) 100vw, 66vw"
                            className={`object-cover ease-out transition-transform motion-reduce:transition-none motion-reduce:scale-100 ${active ? 'scale-110 duration-[7000ms]' : 'scale-100 duration-[1200ms]'
                                }`}
                        />
                        {/* Chỉ tối phía có chữ, để phía bên phải của ảnh vẫn sáng và nét */}
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/45 to-transparent" />

                        <div className="relative z-10 h-full p-8 flex flex-col justify-between">
                            <div className="max-w-lg">
                                <span className="bg-red-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                                    {slide.tag}
                                </span>
                                <Heading className="text-3xl sm:text-4xl font-extrabold uppercase mt-4 mb-3 tracking-wide leading-tight">
                                    {slide.title}
                                </Heading>
                                <p className="text-xs sm:text-sm text-gray-100 font-medium leading-relaxed">
                                    {slide.description}
                                </p>
                            </div>
                            <div className="pt-6">
                                <Link
                                    href={slide.href}
                                    tabIndex={active ? 0 : -1}
                                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all text-xs uppercase tracking-wider shadow-md"
                                >
                                    {slide.cta}
                                </Link>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Mũi tên: màn lớn chỉ hiện khi rê chuột vào, màn nhỏ luôn hiện */}
            <button
                type="button"
                aria-label="Banner trước"
                onClick={() => goTo(current - 1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-all lg:opacity-0 lg:group-hover/hero:opacity-100 focus-visible:opacity-100"
            >
                <ChevronIcon direction="left" />
            </button>
            <button
                type="button"
                aria-label="Banner tiếp theo"
                onClick={() => goTo(current + 1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-all lg:opacity-0 lg:group-hover/hero:opacity-100 focus-visible:opacity-100"
            >
                <ChevronIcon direction="right" />
            </button>

            {/* Dấu chấm */}
            <div className="absolute bottom-4 right-6 z-20 flex items-center">
                {HERO_SLIDES.map((slide, i) => (
                    <button
                        key={slide.id}
                        type="button"
                        aria-label={`Chuyển đến banner ${i + 1}`}
                        aria-current={i === current}
                        onClick={() => goTo(i)}
                        className="p-1.5"
                    >
                        <span
                            className={`block h-2 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                                }`}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
