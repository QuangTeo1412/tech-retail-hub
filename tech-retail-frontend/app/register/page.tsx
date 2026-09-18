'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/Auth/register', formData);
            alert('Đăng ký tài khoản thành công! Hãy đăng nhập.');
            router.push('/login');
        } catch (err: unknown) {
            const errorObj = err as { response?: { data?: { message?: string } } };
            setError(errorObj.response?.data?.message || 'Đăng ký thất bại, vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-gray-50 p-6 font-sans antialiased">
            {}
            <header className="absolute top-0 left-0 p-8">
                <Link href="/" className="text-3xl font-black tracking-wider text-blue-600 hover:opacity-80 transition-opacity">
                    KAITOSTORE
                </Link>
            </header>

            {}
            <div className="w-full max-w-lg rounded-2xl bg-white p-10 shadow-xl border border-gray-100">
                <h1 className="mb-8 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
                    ĐĂNG KÝ
                </h1>

                {error && (
                    <div className="mb-6 rounded-lg bg-red-50 p-3.5 text-sm font-medium text-red-600 border border-red-200 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Tên đăng nhập</label>
                        <input
                            type="text"
                            name="username"
                            required
                            placeholder="Nhập tên đăng nhập"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-gray-300 p-3.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all text-base"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Họ và tên</label>
                        <input
                            type="text"
                            name="fullName"
                            required
                            placeholder="Nhập họ và tên"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-gray-300 p-3.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all text-base"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="example@gmail.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-gray-300 p-3.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all text-base"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Mật khẩu</label>
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
                        className="w-full rounded-xl bg-blue-600 py-3.5 text-base font-bold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-400 transition-all mt-3"
                    >
                        {loading ? 'Đang xử lý...' : 'Đăng ký'}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm font-medium text-gray-600">
                    Đã có tài khoản?{' '}
                    <Link href="/login" className="font-bold text-blue-600 hover:underline">
                        Đăng nhập ngay
                    </Link>
                </p>
            </div>
        </div>
    );
}