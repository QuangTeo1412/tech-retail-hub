'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans antialiased relative overflow-hidden">
            {}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0,transparent_70%)] pointer-events-none" />

            {}
            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <Link href="/" className="flex justify-center mb-2">
                    <span className="text-3xl font-black text-white tracking-widest hover:scale-105 transition-transform drop-shadow-[0_2px_10px_rgba(59,130,246,0.5)]">
                        KAITO STORE
                    </span>
                </Link>
            </div>

            {}
            <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10">
                <div className="bg-white py-10 px-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] rounded-3xl border-4 border-gray-100 relative overflow-hidden transition-all duration-300">

                    {}
                    <div className="absolute inset-2 border border-gray-200/80 rounded-2xl pointer-events-none" />

                    {}
                    <div className="absolute bottom-4 right-5 pointer-events-none select-none flex flex-col items-end opacity-80">
                        <img
                            src="/kaito-kid-logo.png"
                            alt="Kaito Kid Icon"
                            className="w-14 h-auto object-contain"
                        />
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-center text-2xl font-black text-gray-900 tracking-tight uppercase mb-1">
                            Thẻ Đăng Ký Danh Tính
                        </h2>
                        <p className="text-center text-xs text-gray-400 mb-6 font-medium">
                            Gia nhập liên minh công nghệ KAITO STORE
                        </p>

                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            {}
                            <div>
                                <label htmlFor="email" className="block text-[11px] font-black text-gray-600 uppercase tracking-wider mb-1">
                                    Địa chỉ Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="phantom@gmail.com"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50/50 transition-all"
                                />
                            </div>

                            {}
                            <div>
                                <label htmlFor="phone" className="block text-[11px] font-black text-gray-600 uppercase tracking-wider mb-1">
                                    Số điện thoại
                                </label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    required
                                    placeholder="0886288288"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50/50 transition-all"
                                />
                            </div>

                            {}
                            <div>
                                <label htmlFor="password" className="block text-[11px] font-black text-gray-600 uppercase tracking-wider mb-1">
                                    Mật khẩu bí mật
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        placeholder="••••••••"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-4 pr-11 text-sm focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50/50 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1"
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.573 16.49 16.638 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-[11px] font-black text-gray-600 uppercase tracking-wider mb-1">
                                    Xác nhận mật khẩu
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        required
                                        placeholder="••••••••"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-4 pr-11 text-sm focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50/50 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1"
                                    >
                                        {showConfirmPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.573 16.49 16.638 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {}
                            <div className="pt-3">
                                <button
                                    type="submit"
                                    className="w-full bg-slate-900 text-white font-black text-base py-4 rounded-xl shadow-lg hover:bg-blue-600 active:scale-95 transition-all duration-200 tracking-[0.2em] uppercase"
                                >
                                    ĐĂNG  KÝ
                                </button>
                            </div>
                        </form>

                        {}
                        <div className="mt-6 border-t border-gray-100 pt-4 text-center">
                            <p className="text-xs text-gray-500">
                                Đã có mật thư / tài khoản?{' '}
                                <Link href="/login" className="font-extrabold text-blue-600 hover:underline">
                                    Đăng nhập ngay
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}