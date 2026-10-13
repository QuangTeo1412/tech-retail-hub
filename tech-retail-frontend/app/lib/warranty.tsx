export type WarrantyStatus = 'Active' | 'Expired' | 'Voided';

export interface WarrantyLookup {
    code: string;
    productName: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    status: WarrantyStatus;
    daysLeft: number;
}

export interface MyWarranty {
    code: string;
    orderId: number;
    productId: number;
    productName: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    status: WarrantyStatus;
}

const STATUS_META: Record<string, { label: string; className: string }> = {
    Active: { label: 'Còn bảo hành', className: 'bg-green-50 text-green-700 border-green-200' },
    Expired: { label: 'Hết hạn bảo hành', className: 'bg-gray-50 text-gray-600 border-gray-200' },
    Voided: { label: 'Đã vô hiệu hóa', className: 'bg-red-50 text-red-700 border-red-200' },
};

export function WarrantyStatusBadge({ status }: { status: string }) {
    const meta = STATUS_META[status] ?? { label: status, className: 'bg-gray-50 text-gray-600 border-gray-200' };
    return (
        <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full border ${meta.className}`}>
            {meta.label}
        </span>
    );
}

export function formatWarrantyDate(iso: string): string {
    try {
        return new Date(iso).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    } catch {
        return iso;
    }
}
