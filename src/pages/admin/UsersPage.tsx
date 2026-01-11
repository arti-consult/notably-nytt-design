import { useState, useEffect } from 'react';
import {
  Search,
  Calendar,
  Clock,
  ArrowUp,
  ArrowDown,
  Mail
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import Pagination from '@/components/Pagination';

const USERS_PER_PAGE = 50;

interface UserData {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  recordings_count: number;
  file_storage: number;
  transcription_storage: number;
}

// Mock data
const mockUsers: UserData[] = Array.from({ length: 50 }, (_, i) => ({
  id: `user-${i + 1}`,
  email: `bruker${i + 1}@example.com`,
  created_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
  last_sign_in_at: Math.random() > 0.2 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : null,
  recordings_count: Math.floor(Math.random() * 50),
  file_storage: Math.floor(Math.random() * 500 * 1024 * 1024),
  transcription_storage: Math.floor(Math.random() * 10 * 1024 * 1024)
}));

export default function UsersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<keyof UserData>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setTimeout(() => {
      setUsers(mockUsers);
      setIsLoading(false);
    }, 300);
  }, []);

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('no', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatBytes = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchQuery.toLowerCase() || '')
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const toggleSort = (key: keyof UserData) => {
    if (sortBy === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDirection('desc');
    }
  };

  const getCurrentPageUsers = () => {
    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    return sortedUsers.slice(startIndex, startIndex + USERS_PER_PAGE);
  };

  const totalPages = Math.ceil(sortedUsers.length / USERS_PER_PAGE);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Brukere</h1>

        {/* User List */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="search"
                placeholder="Søk etter brukere..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer" onClick={() => toggleSort('email')}>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      E-post
                      {sortBy === 'email' && (sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />)}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer" onClick={() => toggleSort('created_at')}>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Registrert
                      {sortBy === 'created_at' && (sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />)}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer" onClick={() => toggleSort('last_sign_in_at')}>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Sist aktiv
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Opptak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
                    </td>
                  </tr>
                ) : (
                  getCurrentPageUsers().map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(user.created_at)}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(user.last_sign_in_at)}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{user.recordings_count}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="p-4 border-t border-gray-200">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
