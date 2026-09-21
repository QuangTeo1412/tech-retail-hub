import type { ToastState } from '../app/lib/hooks';

export default function Toast({ toast }: { toast: ToastState | null }) {
    if (!toast) return null;

    return (
        <div
            role="status"
            className={`fixed bottom-6 right-6 z-[60] px-4 py-3 rounded-xl text-xs font-bold text-white shadow-lg ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
                }`}
        >
            {toast.text}
        </div>
    );
}