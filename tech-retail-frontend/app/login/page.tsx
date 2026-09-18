'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await api.post('/Auth/login', { username, password });

            const token = res.data.token || res.data;
            const role = res.data.role; 

            if (token) {
                const tokenStr = typeof token === 'string' ? token : token.token;
                localStorage.setItem('token', tokenStr);
                if (role) localStorage.setItem('role', role);

                alert('Đăng nhập thành công!');

                if (role === 'Admin') {
                    router.push('/admin/dashboard');
                } else {
                    router.push('/');
                }
            }
        } catch (err: unknown) {
            console.error('Login Error:', err);
            const errorObj = err as { response?: { data?: { message?: string } | string } };
            const msg = typeof errorObj.response?.data === 'string'
                ? errorObj.response.data
                : errorObj.response?.data?.message;

            setError(msg || 'Đăng nhập thất bại. Kiểm tra lại tài khoản/mật khẩu của bạn!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-sky-100 p-8">
                <h2 className="text-2xl font-black text-center text-slate-800 mb-6">
                    ĐĂNG NHẬP <span className="text-sky-600">KAITOSTORE</span>
                </h2>

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Tài khoản</label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white !text-slate-900 font-medium placeholder:text-slate-400 [&:-webkit-autofill]:[-webkit-text-fill-color:#0f172a] [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s]"
                            placeholder="Nhập username..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Mật khẩu</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white !text-slate-900 font-medium placeholder:text-slate-400 [&:-webkit-autofill]:[-webkit-text-fill-color:#0f172a] [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s]"
                            placeholder="Nhập password..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition duration-200 shadow-md shadow-sky-200 disabled:opacity-50 mt-2"
                    >
                        {loading ? 'Đang xác thực...' : 'Đăng Nhập'}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-slate-600">
                    Chưa có tài khoản?{' '}
                    <Link href="/register" className="text-sky-600 font-semibold hover:underline">
                        Đăng ký ngay
                    </Link>
                </p>
            </div>
        </div>
    );
}