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

type FieldName = 'identifier' | 'password';
type FieldErrors = Partial<Record<FieldName, string>>;

const inputClass = (hasError: boolean, spacing: string) =>
    `w-full bg-white/90 border text-slate-900 placeholder-gray-400 rounded-xl py-3 ${spacing} text-sm font-medium focus:outline-none focus:bg-white focus:ring-4 transition-all shadow-sm ${hasError
        ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
        : 'border-gray-300 focus:border-blue-600 focus:ring-blue-100'
    }`;

function FieldError({ id, message }: { id: string; message?: string }) {
    if (!message) return null;
    return (
        <p id={id} role="alert" className="mt-1.5 text-xs font-bold text-red-600">
            {message}
        </p>
    );
}

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

    const [showResendButton, setShowResendButton] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendMessage, setResendMessage] = useState('');

    const router = useRouter();

    const clearFieldError = (field: FieldName) => {
        setFieldErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setResendMessage('');
        setShowResendButton(false);

        const errs: FieldErrors = {};
        if (!identifier.trim()) {
            errs.identifier = 'Vui lòng nhập email hoặc số điện thoại.';
        }
        if (!password) {
            errs.password = 'Vui lòng nhập mật khẩu.';
        }
        setFieldErrors(errs);

        if (errs.identifier) {
            document.getElementById('identifier')?.focus();
            return;
        }
        if (errs.password) {
            document.getElementById('password')?.focus();
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('http://127.0.0.1:5000/api/Auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usernameOrEmail: identifier,
                    username: identifier,
                    password: password,
                }),
            });

            const responseText = await res.text();
            let data;
            try {
                data = JSON.parse(responseText);
            } catch {
                data = { message: responseText };
            }

            if (res.ok) {
                localStorage.setItem('token', data.token || data.accessToken || '');
                localStorage.setItem('user', JSON.stringify(data.user || { username: identifier }));

                window.dispatchEvent(new Event('userLoginStateChanged'));
                router.push('/');
            } else {
                const errorText = data?.message || data?.title || data?.error || 'Mật khẩu hoặc tài khoản không chính xác!';

                if (data?.code === 'EMAIL_NOT_CONFIRMED' || errorText.toLowerCase().includes('not confirmed')) {
                    setErrorMsg('Tài khoản chưa được xác nhận email.');
                    setShowResendButton(true);
                } else {
                    setErrorMsg(errorText);
                }
            }
        } catch (err) {
            console.error('Lỗi fetch:', err);
            setErrorMsg('Không thể kết nối đến máy chủ Backend!');
        } finally {
            setLoading(false);
        }
    };

    const handleResendVerification = async () => {
        setResendLoading(true);
        setResendMessage('');
        try {
            const res = await fetch('http://127.0.0.1:5000/api/Auth/resend-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: identifier }),
            });
            const data = await res.json().catch(() => null);
            if (res.ok) {
                setResendMessage(data?.message || 'Đã gửi lại email xác nhận thành công. Vui lòng kiểm tra hộp thư!');
            } else {
                setResendMessage(data?.message || 'Không thể gửi lại email xác nhận.');
            }
        } catch (err) {
            console.error(err);
            setResendMessage('Lỗi kết nối khi gửi lại email xác nhận.');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className={`${beVietnam.className} min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 antialiased relative overflow-hidden`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0,transparent_70%)] pointer-events-none" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <Link href="/" className="flex justify-center mb-2">
                    <span className="text-3xl font-extrabold text-white tracking-widest hover:scale-105 transition-transform drop-shadow-[0_2px_10px_rgba(59,130,246,0.5)]">
                        KAITO STORE
                    </span>
                </Link>
            </div>

            <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10">
                <div
                    className="bg-white py-10 px-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] rounded-3xl border-4 border-gray-100 relative overflow-hidden bg-cover bg-center transition-all duration-300"
                    style={{ backgroundImage: `url('/images/kaito-card-bg.jpg')` }}
                >
                    <div className="absolute inset-0 bg-white/40 pointer-events-none" />

                    <div className="relative z-10">
                        <h2 className="text-center text-2xl font-extrabold text-slate-900 tracking-tight uppercase mb-1.5 drop-shadow-sm">
                            Thẻ Đăng Nhập
                        </h2>
                        <p className="text-center text-xs text-slate-600 mb-6 font-semibold">
                            Xác thực danh tính để truy cập hệ thống
                        </p>

                        {errorMsg && (
                            <div role="alert" className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-xs font-bold rounded-xl text-center">
                                <p>{errorMsg}</p>
                                {showResendButton && (
                                    <button
                                        type="button"
                                        onClick={handleResendVerification}
                                        disabled={resendLoading}
                                        className="mt-2 text-xs font-extrabold text-blue-700 underline hover:text-blue-900 block mx-auto disabled:opacity-50"
                                    >
                                        {resendLoading ? 'Đang gửi lại...' : 'Gửi lại email xác nhận'}
                                    </button>
                                )}
                            </div>
                        )}

                        {resendMessage && (
                            <div className="mb-4 p-3 bg-blue-50 border border-blue-300 text-blue-800 text-xs font-bold rounded-xl text-center">
                                {resendMessage}
                            </div>
                        )}

                        <form className="space-y-4" onSubmit={handleLogin} noValidate>
                            <div>
                                <label htmlFor="identifier" className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-1">
                                    Email hoặc Số điện thoại
                                </label>
                                <input
                                    id="identifier"
                                    name="identifier"
                                    type="text"
                                    required
                                    autoComplete="username"
                                    value={identifier}
                                    onChange={(e) => {
                                        setIdentifier(e.target.value);
                                        clearFieldError('identifier');
                                    }}
                                    aria-invalid={!!fieldErrors.identifier}
                                    aria-describedby={fieldErrors.identifier ? 'identifier-error' : undefined}
                                    placeholder="phantom@gmail.com hoặc 0987654321"
                                    className={inputClass(!!fieldErrors.identifier, 'px-4')}
                                />
                                <FieldError id="identifier-error" message={fieldErrors.identifier} />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label htmlFor="password" className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                                        Mật khẩu bí mật
                                    </label>
                                    <Link href="/forgot-password" className="text-[11px] font-bold text-blue-700 hover:underline">
                                        Quên mật khẩu?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            clearFieldError('password');
                                        }}
                                        aria-invalid={!!fieldErrors.password}
                                        aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                                        placeholder="••••••••"
                                        className={inputClass(!!fieldErrors.password, 'pl-4 pr-11')}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                                        aria-pressed={showPassword}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-slate-800 p-1"
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.573 16.49 16.638 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <FieldError id="password-error" message={fieldErrors.password} />
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-xs font-semibold text-slate-700 cursor-pointer">
                                    Ghi nhớ mật thư này
                                </label>
                            </div>

                            <div className="pt-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-slate-900 text-white font-bold text-base py-4 rounded-xl shadow-xl hover:bg-blue-600 active:scale-95 transition-all duration-200 tracking-[0.15em] uppercase disabled:opacity-50"
                                >
                                    {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 border-t border-gray-200/80 pt-4 text-center">
                            <p className="text-xs text-slate-700 font-semibold">
                                Chưa có thẻ thành viên?{' '}
                                <Link href="/register" className="font-bold text-blue-700 hover:underline">
                                    Đăng ký ngay
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}