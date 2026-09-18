'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/Auth/login', formData);
            const { token, role } = response.data;

            if (token) {
                localStorage.setItem('token', typeof token === 'string' ? token : token.token);
                if (role) localStorage.setItem('role', role);

                if (role === 'Admin') {
                    window.location.href = '/admin/dashboard';
                } else {
                    window.location.href = '/';
                }
            }
        } catch (err: unknown) {
            const errorObj = err as { response?: { data?: { message?: string } } };
            setError(errorObj.response?.data?.message || 'Đăng nhập thất bại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-gray-50 p-6 font-sans antialiased">
            {}
            <header className="absolute top-0 left-0 p-8">
                <Link href="/" className="text-3xl font-black tracking-wider text-blue-600 hover:opacity-80 transition-opacity">
                    KAITO STORE
                </Link>
            </header>

            {}
            <div className="w-full max-w-lg rounded-2xl bg-white p-10 shadow-xl border border-gray-100">
                <h1 className="mb-8 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
                    ĐĂNG NHẬP
                </h1>

                {error && (
                    <div className="mb-6 rounded-lg bg-red-50 p-3.5 text-sm font-medium text-red-600 border border-red-200 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Tài khoản</label>
                        <input
                            type="text"
                            name="username"
                            required
                            placeholder="Nhập tên tài khoản"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-gray-300 p-3.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all text-base"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Mật khẩu</label>
                        <input
                            type="password"
                            name="password"
                            required
                            placeholder="Nhập mật khẩu"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-gray-300 p-3.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all text-base"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-blue-600 py-3.5 text-base font-bold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-400 transition-all mt-2"
                    >
                        {loading ? 'Đang xác thực...' : 'Đăng nhập'}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm font-medium text-gray-600">
                    Chưa có tài khoản?{' '}
                    <Link href="/register" className="font-bold text-blue-600 hover:underline">
                        Đăng ký ngay
                    </Link>
                </p>
            </div>
        </div>
    );
}