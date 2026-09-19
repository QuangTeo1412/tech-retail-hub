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

const INPUT_CLASS =
    'w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm';

const LABEL_CLASS = 'block text-xs font-bold text-slate-800 tracking-wider uppercase mb-2';

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

interface PasswordFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    show: boolean;
    onToggle: () => void;
}

function PasswordField({ id, label, value, onChange, show, onToggle }: PasswordFieldProps) {
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
                    required
                    autoComplete="new-password"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="••••••••"
                    className={`${INPUT_CLASS} pr-12`}
                />
                <button
                    type="button"
                    onClick={onToggle}
                    aria-label={show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    aria-pressed={show}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-500 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
                >
                    {show ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp!');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, phone, password }),
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
            <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-slate-100">
                {/* Header */}
                <header className="text-center mb-8">
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight uppercase mb-1.5">
                        Thẻ đăng ký danh tính
                    </h1>
                    <p className="text-sm font-semibold text-slate-600">
                        Gia nhập liên minh công nghệ KAITO STORE
                    </p>
                </header>

                {error && (
                    <div
                        role="alert"
                        className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-semibold text-center"
                    >
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-5">
                    {/* ĐỊA CHỈ EMAIL */}
                    <div>
                        <label htmlFor="email" className={LABEL_CLASS}>
                            Địa chỉ email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="phantom@gmail.com"
                            className={INPUT_CLASS}
                        />
                    </div>

                    {/* SỐ ĐIỆN THOẠI */}
                    <div>
                        <label htmlFor="phone" className={LABEL_CLASS}>
                            Số điện thoại
                        </label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            inputMode="tel"
                            required
                            autoComplete="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="0886288288"
                            className={INPUT_CLASS}
                        />
                    </div>

                    {/* MẬT KHẨU */}
                    <PasswordField
                        id="password"
                        label="Mật khẩu bí mật"
                        value={password}
                        onChange={setPassword}
                        show={showPassword}
                        onToggle={() => setShowPassword((v) => !v)}
                    />

                    {/* XÁC NHẬN MẬT KHẨU */}
                    <PasswordField
                        id="confirm-password"
                        label="Xác nhận mật khẩu"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        show={showConfirmPassword}
                        onToggle={() => setShowConfirmPassword((v) => !v)}
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
        </main>
    );
}