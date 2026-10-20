'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiError, apiFetch, clearSession } from '../../lib/api';
import { useDebouncedValue } from '../../lib/hooks';

interface AdminUser {
    id: number;
    username: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    role: string;
    isLocked: boolean;
    emailConfirmed: boolean;
}

export default function AdminUsersPage() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
    const [notice, setNotice] = useState('');
    const [busyId, setBusyId] = useState<number | null>(null);

    const handleAuthError = useCallback(
        (err: unknown) => {
            if (err instanceof ApiError && err.status === 401) {
                clearSession();
                router.replace('/login');
                return true;
            }
            return false;
        },
        [router]
    );

    const keyword = useDebouncedValue(search.trim(), 400);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;
        setStatus('loading');

        (async () => {
            try {
                const params = new URLSearchParams();
                if (keyword) params.set('search', keyword);
                const data = await apiFetch<AdminUser[]>(`/api/Users?${params.toString()}`);
                if (!cancelled) {
                    setUsers(data);
                    setStatus('ready');
                }
            } catch (err) {
                if (cancelled) return;
                if (!handleAuthError(err)) setStatus('error');
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [keyword, reloadKey, handleAuthError]);

    // Cập nhật ngay trên danh sách đang có, không fetch lại cả trang, bấm cho mượt
    const updateUserInList = (id: number, patch: Partial<AdminUser>) => {
        setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));
    };

    const handleToggleLock = async (user: AdminUser) => {
        const nextLocked = !user.isLocked;
        const confirmMsg = nextLocked
            ? `Khóa tài khoản "${user.username}"? Người này sẽ không đăng nhập được nữa.`
            : `Mở khóa tài khoản "${user.username}"?`;
        if (!window.confirm(confirmMsg)) return;

        setBusyId(user.id);
        setNotice('');
        try {
            await apiFetch(`/api/Users/${user.id}/lock`, {
                method: 'PUT',
                body: JSON.stringify({ isLocked: nextLocked }),
            });
            updateUserInList(user.id, { isLocked: nextLocked });
        } catch (err) {
            if (!handleAuthError(err)) {
                setNotice(err instanceof Error ? err.message : 'Không thể cập nhật trạng thái tài khoản.');
            }
        } finally {
            setBusyId(null);
        }
    };

    const handleToggleRole = async (user: AdminUser) => {
        const nextRole = user.role === 'Admin' ? 'User' : 'Admin';
        if (!window.confirm(`Đổi quyền của "${user.username}" thành ${nextRole}?`)) return;

        setBusyId(user.id);
        setNotice('');
        try {
            await apiFetch(`/api/Users/${user.id}/role`, {
                method: 'PUT',
                body: JSON.stringify({ role: nextRole }),
            });
            updateUserInList(user.id, { role: nextRole });
        } catch (err) {
            if (!handleAuthError(err)) {
                setNotice(err instanceof Error ? err.message : 'Không thể cập nhật quyền.');
            }
        } finally {
            setBusyId(null);
        }
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <h1 className="text-2xl font-extrabold text-slate-900">Người dùng</h1>
            </div>

            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo tên, email, số điện thoại..."
                className="w-full max-w-sm border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-white"
            />

            {notice && (
                <div role="alert" className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-bold">
                    {notice}
                </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
                {status === 'loading' ? (
                    <p className="text-sm text-gray-500 p-6">Đang tải danh sách người dùng...</p>
                ) : status === 'error' ? (
                    <p className="text-sm text-gray-500 p-6">Không tải được danh sách người dùng.</p>
                ) : users.length === 0 ? (
                    <p className="text-sm text-gray-500 p-6">Chưa có người dùng nào.</p>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wide border-b border-gray-100">
                                <th className="px-4 py-3">Người dùng</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Điện thoại</th>
                                <th className="px-4 py-3">Quyền</th>
                                <th className="px-4 py-3">Trạng thái</th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b border-gray-50 last:border-0">
                                    <td className="px-4 py-3">
                                        <p className="font-semibold text-slate-800">{user.username}</p>
                                        {user.fullName && <p className="text-xs text-gray-400">{user.fullName}</p>}
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">
                                        {user.email}
                                        {!user.emailConfirmed && (
                                            <span className="ml-1.5 text-[10px] font-bold text-amber-600 align-middle">
                                                (chưa xác nhận)
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">{user.phoneNumber}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                                                user.role === 'Admin'
                                                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                                                    : 'bg-gray-50 text-gray-600 border-gray-200'
                                            }`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                                                user.isLocked
                                                    ? 'bg-red-50 text-red-600 border-red-200'
                                                    : 'bg-green-50 text-green-700 border-green-200'
                                            }`}
                                        >
                                            {user.isLocked ? 'Đã khóa' : 'Hoạt động'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right whitespace-nowrap">
                                        <button
                                            type="button"
                                            onClick={() => handleToggleRole(user)}
                                            disabled={busyId === user.id}
                                            className="text-xs font-bold text-blue-600 hover:underline mr-4 disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            {user.role === 'Admin' ? 'Bỏ Admin' : 'Cấp Admin'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleToggleLock(user)}
                                            disabled={busyId === user.id}
                                            className={`text-xs font-bold hover:underline disabled:opacity-40 disabled:cursor-not-allowed ${
                                                user.isLocked ? 'text-green-600' : 'text-red-500'
                                            }`}
                                        >
                                            {user.isLocked ? 'Mở khóa' : 'Khóa'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
