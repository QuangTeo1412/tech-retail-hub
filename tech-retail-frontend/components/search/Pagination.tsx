import Link from 'next/link';

interface PaginationProps {
    page: number;
    totalPages: number;
    buildHref: (page: number) => string;
}

export default function Pagination({ page, totalPages, buildHref }: PaginationProps) {
    if (totalPages <= 1) return null;

    const start = Math.max(1, Math.min(page - 2, totalPages - 4));
    const end = Math.min(totalPages, start + 4);
    const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

    const linkClass = (active: boolean) =>
        `w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${active ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-slate-700 hover:bg-gray-50'
        }`;

    return (
        <nav aria-label="Phân trang kết quả" className="flex items-center justify-center gap-1.5 mt-8">
            <Link href={buildHref(Math.max(1, page - 1))} aria-disabled={page === 1} className={`${linkClass(false)} ${page === 1 ? 'pointer-events-none opacity-40' : ''}`}>
                ‹
            </Link>
            {start > 1 && <span className="px-1 text-gray-400">…</span>}
            {pages.map((p) => (
                <Link key={p} href={buildHref(p)} aria-current={p === page} className={linkClass(p === page)}>
                    {p}
                </Link>
            ))}
            {end < totalPages && <span className="px-1 text-gray-400">…</span>}
            <Link href={buildHref(Math.min(totalPages, page + 1))} aria-disabled={page === totalPages} className={`${linkClass(false)} ${page === totalPages ? 'pointer-events-none opacity-40' : ''}`}>
                ›
            </Link>
        </nav>
    );
}
