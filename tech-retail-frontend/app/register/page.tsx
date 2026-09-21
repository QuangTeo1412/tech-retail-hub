'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Be_Vietnam_Pro } from 'next/font/google';

const beVietnam = Be_Vietnam_Pro({
    subsets: ['vietnamese', 'latin'],
    weight: ['400', '500', '600', '700', '800'],
    display: 'swap',
});

const MIN_PASSWORD_LENGTH = 8;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(0|\+84)\d{9}$/;

const INPUT_BASE =
    'w-full bg-white border rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all shadow-sm';
const INPUT_OK = 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20';
const INPUT_ERROR = 'border-red-500 focus:border-red-500 focus:ring-red-500/20';

const LABEL_CLASS = 'block text-xs font-bold text-slate-800 tracking-wider uppercase mb-2';

type FieldName = 'email' | 'phone' | 'password' | 'confirmPassword';
type FieldErrors = Partial<Record<FieldName, string>>;

const FIELD_ORDER: FieldName[] = ['email', 'phone', 'password', 'confirmPassword'];

function EyeIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

function EyeSlashIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
            />
        </svg>
    );
}

function FieldError({ id, message }: { id: string; message?: string }) {
    if (!message) return null;
    return (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-bold text-red-600">
            {message}
        </p>
    );
}

interface TextFieldProps {
    id: FieldName;
    label: string;
    type: 'email' | 'tel';
    value: string;
    onChange: (value: string) => void;
    error?: string;
    placeholder: string;
    autoComplete: string;
}

function TextField({ id, label, type, value, onChange, error, placeholder, autoComplete }: TextFieldProps) {
    return (
        <div>
            <label htmlFor={id} className={LABEL_CLASS}>
                {label}
            </label>
            <input
                id={id}
                name={id}
                type={type}
                inputMode={type === 'tel' ? 'tel' : undefined}
                autoComplete={autoComplete}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
                className={`${INPUT_BASE} ${error ? INPUT_ERROR : INPUT_OK}`}
            />
            <FieldError id={id} message={error} />
        </div>
    );
}

interface PasswordFieldProps {
    id: FieldName;
    label: string;
    value: string;
    onChange: (value: string) => void;
    show: boolean;
    onToggle: () => void;
    error?: string;
}

function PasswordField({ id, label, value, onChange, show, onToggle, error }: PasswordFieldProps) {
    return (
        <div>
            <label htmlFor={id} className={LABEL_CLASS}>
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    name={id}
                    type={show ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="••••••••"
                    aria-invalid={!!error}
                    aria-describedby={error ? `${id}-error` : undefined}
                    className={`${INPUT_BASE} pr-12 ${error ? INPUT_ERROR : INPUT_OK}`}
                />
                <button
                    type="button"
                    onClick={onToggle}
                    aria-label={show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    aria-pressed={show}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-500 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
                >
                    {show ? <EyeIcon /> : <EyeSlashIcon />}
                </button>
            </div>
            <FieldError id={id} message={error} />
        </div>
    );
}

function validate(values: Record<FieldName, string>): FieldErrors {
    const errors: FieldErrors = {};
    const email = values.email.trim();
    const phone = values.phone.replace(/[\s.-]/g, '');

    if (!email) errors.email = 'Vui lòng nhập email.';
    else if (!EMAIL_REGEX.test(email)) errors.email = 'Email không hợp lệ.';

    if (!phone) errors.phone = 'Vui lòng nhập số điện thoại.';
    else if (!PHONE_REGEX.test(phone)) errors.phone = 'Số điện thoại không hợp lệ.';

    if (!values.password) errors.password = 'Vui lòng nhập mật khẩu.';
    else if (values.password.length < MIN_PASSWORD_LENGTH)
        errors.password = `Mật khẩu phải có ít nhất ${MIN_PASSWORD_LENGTH} ký tự.`;

    if (!values.confirmPassword) errors.confirmPassword = 'Vui lòng xác nhận mật khẩu.';
    else if (values.password !== values.confirmPassword) errors.confirmPassword = 'Mật khẩu xác nhận không khớp.';

    return errors;
}

export default function RegisterPage() {
    const router = useRouter();
    const [values, setValues] = useState<Record<FieldName, string>>({
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const setField = (name: FieldName) => (value: string) => {
        setValues((prev) => ({ ...prev, [name]: value }));
        setFieldErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const errors = validate(values);
        setFieldErrors(errors);

        const firstInvalid = FIELD_ORDER.find((name) => errors[name]);
        if (firstInvalid) {
            document.getElementById(firstInvalid)?.focus();
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('http://127.0.0.1:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: values.email.trim(),
                    phoneNumber: values.phone.replace(/[\s.-]/g, ''),
                    password: values.password,
                    confirmPassword: values.confirmPassword,
                }),
            });

            if (!res.ok) {
                throw new Error('Đăng ký thất bại, vui lòng kiểm tra lại thông tin.');
            }

            router.push('/login');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Có lỗi xảy ra');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main
            className={`${beVietnam.className} min-h-screen bg-slate-900 flex items-center justify-center p-4 antialiased`}
        >
            {/* Khuôn card trắng bo góc, bọc overflow-hidden để ôm ảnh Kaito lọt vào trong */}
            <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 relative overflow-hidden">
                {/* Ảnh Kaito lọt vào bên trong card (watermark mờ góc/nền card) */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15 pointer-events-none"
                    style={{ backgroundImage: "url('/images/kaito-kid-bg-register.jpg')" }}
                />
                {/* Lớp nội dung form nổi lên trên ảnh nền card (z-10) */}
                <div className="relative z-10">
                    {/* Header */}
                    <header className="text-center mb-8">
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight uppercase mb-1.5">
                            Thẻ đăng ký danh tính
                        </h1>
                        <p className="text-sm font-semibold text-slate-600">
                            Gia nhập liên minh công nghệ KAITO STORE
                        </p>
                    </header>

                    {/* Lỗi từ server */}
                    {error && (
                        <div
                            role="alert"
                            className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-semibold text-center"
                        >
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleRegister} noValidate className="space-y-5">
                        <TextField
                            id="email"
                            label="Địa chỉ email"
                            type="email"
                            autoComplete="email"
                            placeholder="phantom@gmail.com"
                            value={values.email}
                            onChange={setField('email')}
                            error={fieldErrors.email}
                        />

                        <TextField
                            id="phone"
                            label="Số điện thoại"
                            type="tel"
                            autoComplete="tel"
                            placeholder="0886288288"
                            value={values.phone}
                            onChange={setField('phone')}
                            error={fieldErrors.phone}
                        />

                        <PasswordField
                            id="password"
                            label="Mật khẩu bí mật"
                            value={values.password}
                            onChange={setField('password')}
                            show={showPassword}
                            onToggle={() => setShowPassword((v) => !v)}
                            error={fieldErrors.password}
                        />

                        <PasswordField
                            id="confirmPassword"
                            label="Xác nhận mật khẩu"
                            value={values.confirmPassword}
                            onChange={setField('confirmPassword')}
                            show={showConfirmPassword}
                            onToggle={() => setShowConfirmPassword((v) => !v)}
                            error={fieldErrors.confirmPassword}
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold tracking-wider uppercase py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? 'Đang khởi tạo...' : 'Tạo tài khoản mới'}
                        </button>
                    </form>

                    {/* Chuyển sang trang Đăng nhập */}
                    <p className="text-center text-xs font-semibold text-slate-600 mt-8">
                        Đã có tài khoản danh tính?{' '}
                        <Link href="/login" className="text-blue-600 font-bold hover:underline">
                            Đăng nhập ngay
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}