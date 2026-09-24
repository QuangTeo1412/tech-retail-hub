'use client';

import { useState } from 'react';
import { ApiError, apiFetch, resolveImageUrl, uploadImage, type Product } from '../app/lib/api';

interface ProductFormValues {
    name: string;
    price: string;
    stock: string;
    category: string;
    description: string;
    imageUrl: string;
}

type FieldName = 'name' | 'price' | 'stock';
type FieldErrors = Partial<Record<FieldName, string>>;

const EMPTY_FORM: ProductFormValues = {
    name: '',
    price: '',
    stock: '0',
    category: '',
    description: '',
    imageUrl: '',
};

const FIELD_IDS: Record<FieldName, string> = {
    name: 'pf-name',
    price: 'pf-price',
    stock: 'pf-stock',
};

const LABEL_CLASS = 'block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1';

const inputClass = (hasError: boolean) =>
    `w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none transition-colors ${hasError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
    }`;

/* Thông báo lỗi dưới ô nhập: chữ đỏ, in đậm (thay cho bong bóng cảnh báo mặc định của trình duyệt) */
function FieldError({ id, message }: { id: string; message?: string }) {
    if (!message) return null;
    return (
        <p id={id} role="alert" className="mt-1.5 text-xs font-bold text-red-600">
            {message}
        </p>
    );
}

function productToForm(product: Product | null): ProductFormValues {
    if (!product) return EMPTY_FORM;
    return {
        name: product.name,
        price: String(product.price),
        stock: String(product.stock ?? 0),
        category: product.category ?? '',
        description: product.description ?? '',
        imageUrl: typeof product.imageUrl === 'string' ? product.imageUrl : '',
    };
}

interface AdminProductFormProps {
    product: Product | null;
    onClose: () => void;
    onSaved: () => void;
}

/** Cửa sổ thêm / sửa sản phẩm, có chọn ảnh (upload lên backend) hoặc dán link ảnh có sẵn. */
export default function AdminProductForm({ product, onClose, onSaved }: AdminProductFormProps) {
    const [shownProduct, setShownProduct] = useState(product);
    const [form, setForm] = useState<ProductFormValues>(() => productToForm(product));
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    if (product !== shownProduct) {
        setShownProduct(product);
        setForm(productToForm(product));
        setFieldErrors({});
        setError('');
    }

    const isEditing = product !== null;
    const isUploadedFile = form.imageUrl.startsWith('/uploads/');
    const previewImage = resolveImageUrl({ id: 0, name: '', price: 0, imageUrl: form.imageUrl });

    const updateField = (field: FieldName, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setFieldErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;

        setUploading(true);
        setError('');
        try {
            const { url } = await uploadImage(file);
            setForm((prev) => ({ ...prev, imageUrl: url }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Tải ảnh lên thất bại.');
        } finally {
            setUploading(false);
        }
    };

    const validate = (): FieldErrors => {
        const errs: FieldErrors = {};
        const priceNumber = Number(form.price);
        const stockNumber = Number(form.stock);

        if (!form.name.trim()) {
            errs.name = 'Vui lòng nhập tên sản phẩm.';
        }
        if (form.price.trim() === '' || !Number.isFinite(priceNumber) || priceNumber <= 0) {
            errs.price = 'Giá sản phẩm phải lớn hơn 0.';
        }
        if (form.stock.trim() === '' || !Number.isFinite(stockNumber) || stockNumber < 0) {
            errs.stock = 'Số lượng tồn kho không được âm.';
        }

        return errs;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const errs = validate();
        setFieldErrors(errs);

        const firstInvalid = (Object.keys(FIELD_IDS) as FieldName[]).find((key) => errs[key]);
        if (firstInvalid) {
            document.getElementById(FIELD_IDS[firstInvalid])?.focus();
            return;
        }

        const payload = {
            id: product?.id ?? 0,
            name: form.name.trim(),
            price: Number(form.price),
            stock: Number(form.stock),
            category: form.category.trim() || 'General',
            description: form.description.trim(),
            imageUrl: form.imageUrl.trim(),
        };

        setSaving(true);
        try {
            if (isEditing && product) {
                await apiFetch(`/api/Products/${product.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(payload),
                });
            } else {
                await apiFetch('/api/Products', {
                    method: 'POST',
                    body: JSON.stringify(payload),
                });
            }
            onSaved();
        } catch (err) {
            if (err instanceof ApiError && err.status === 401) {
                setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            } else {
                setError(err instanceof Error ? err.message : 'Không thể lưu sản phẩm.');
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mt-10 mb-10">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-base font-extrabold text-slate-900">
                        {isEditing ? `Sửa sản phẩm #${product?.id}` : 'Thêm sản phẩm mới'}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Đóng"
                        className="text-slate-400 hover:text-slate-700 text-xl leading-none"
                    >
                        ×
                    </button>
                </div>

                {/* noValidate: tắt bong bóng cảnh báo mặc định của trình duyệt (tiếng Anh, không chỉnh style được),
                    dùng thông báo tiếng Việt tự viết (FieldError) ở dưới từng ô thay cho nó */}
                <form onSubmit={handleSubmit} noValidate className="px-6 py-5 space-y-4">
                    {error && (
                        <div role="alert" className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-bold">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="pf-name" className={LABEL_CLASS}>
                            Tên sản phẩm
                        </label>
                        <input
                            id="pf-name"
                            type="text"
                            value={form.name}
                            onChange={(e) => updateField('name', e.target.value)}
                            aria-invalid={!!fieldErrors.name}
                            aria-describedby={fieldErrors.name ? 'pf-name-error' : undefined}
                            className={inputClass(!!fieldErrors.name)}
                        />
                        <FieldError id="pf-name-error" message={fieldErrors.name} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="pf-price" className={LABEL_CLASS}>
                                Giá (đ)
                            </label>
                            <input
                                id="pf-price"
                                type="number"
                                min="1"
                                step="1"
                                inputMode="numeric"
                                value={form.price}
                                onChange={(e) => updateField('price', e.target.value)}
                                aria-invalid={!!fieldErrors.price}
                                aria-describedby={fieldErrors.price ? 'pf-price-error' : undefined}
                                className={inputClass(!!fieldErrors.price)}
                            />
                            <FieldError id="pf-price-error" message={fieldErrors.price} />
                        </div>
                        <div>
                            <label htmlFor="pf-stock" className={LABEL_CLASS}>
                                Tồn kho
                            </label>
                            <input
                                id="pf-stock"
                                type="number"
                                min="0"
                                step="1"
                                inputMode="numeric"
                                value={form.stock}
                                onChange={(e) => updateField('stock', e.target.value)}
                                aria-invalid={!!fieldErrors.stock}
                                aria-describedby={fieldErrors.stock ? 'pf-stock-error' : undefined}
                                className={inputClass(!!fieldErrors.stock)}
                            />
                            <FieldError id="pf-stock-error" message={fieldErrors.stock} />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="pf-category" className={LABEL_CLASS}>
                            Danh mục
                        </label>
                        <input
                            id="pf-category"
                            type="text"
                            placeholder="Laptop, Điện thoại, Linh kiện..."
                            value={form.category}
                            onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                            className={inputClass(false)}
                        />
                    </div>

                    <div>
                        <label htmlFor="pf-description" className={LABEL_CLASS}>
                            Mô tả
                        </label>
                        <textarea
                            id="pf-description"
                            rows={3}
                            value={form.description}
                            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                            className={`${inputClass(false)} resize-none`}
                        />
                    </div>

                    <div>
                        <span className={LABEL_CLASS}>Ảnh sản phẩm</span>
                        <div className="flex items-center gap-3">
                            <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
                                {previewImage ? (
                                    <img src={previewImage} alt="" className="w-full h-full object-contain p-1" />
                                ) : (
                                    <span className="text-2xl" role="presentation">
                                        💻
                                    </span>
                                )}
                            </div>
                            <label className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 border border-blue-200 rounded-xl px-3 py-2 cursor-pointer hover:bg-blue-50 transition-colors">
                                {uploading ? 'Đang tải lên...' : 'Chọn ảnh từ máy'}
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="hidden"
                                    disabled={uploading}
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>

                        {/* Nhập tay đường dẫn ảnh: dùng khi muốn dán link ảnh có sẵn thay vì upload */}
                        <input
                            type="text"
                            value={isUploadedFile ? '' : form.imageUrl}
                            onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                            placeholder="hoặc dán link ảnh https://..."
                            className="w-full mt-2 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={saving || uploading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? 'Đang lưu...' : isEditing ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-3 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}