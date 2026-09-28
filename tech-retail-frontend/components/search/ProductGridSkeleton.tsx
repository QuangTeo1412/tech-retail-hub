export default function ProductGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4" aria-hidden="true">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse">
                    <div className="h-44 rounded-xl bg-gray-100 mb-3" />
                    <div className="h-3 w-16 bg-gray-100 rounded mb-2" />
                    <div className="h-3 w-full bg-gray-100 rounded mb-1" />
                    <div className="h-3 w-2/3 bg-gray-100 rounded mb-4" />
                    <div className="h-4 w-24 bg-gray-100 rounded mb-3" />
                    <div className="h-9 w-full bg-gray-100 rounded-xl" />
                </div>
            ))}
        </div>
    );
}
