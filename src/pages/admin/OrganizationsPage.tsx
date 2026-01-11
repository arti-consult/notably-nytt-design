import { useState, useEffect } from 'react';
import {
  Search,
  Calendar,
  Users,
  Building2,
  Mail,
  Plus,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import Pagination from '@/components/Pagination';
import { cn } from '@/lib/utils';

const ORGANIZATIONS_PER_PAGE = 20;

interface Organization {
  id: string;
  name: string;
  seats: number;
  members_count: number;
  pending_invitations: number;
  created_at: string;
}

// Mock data
const mockOrganizations: Organization[] = Array.from({ length: 15 }, (_, i) => ({
  id: `org-${i + 1}`,
  name: `Bedrift ${i + 1} AS`,
  seats: [5, 10, 15, 20, 25, 50][Math.floor(Math.random() * 6)],
  members_count: Math.floor(Math.random() * 15) + 1,
  pending_invitations: Math.floor(Math.random() * 5),
  created_at: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString()
}));

export default function OrganizationsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    seats: 5
  });
  const [emailInput, setEmailInput] = useState('');
  const [emailChips, setEmailChips] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setOrganizations(mockOrganizations);
      setIsLoading(false);
    }, 300);
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('no', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCurrentPageOrganizations = () => {
    const startIndex = (currentPage - 1) * ORGANIZATIONS_PER_PAGE;
    return filteredOrganizations.slice(startIndex, startIndex + ORGANIZATIONS_PER_PAGE);
  };

  const totalPages = Math.ceil(filteredOrganizations.length / ORGANIZATIONS_PER_PAGE);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Check if comma or semicolon was entered
    if (value.includes(',') || value.includes(';')) {
      const emails = value.split(/[,;]/).map(e => e.trim()).filter(e => e);

      emails.forEach(email => {
        if (isValidEmail(email) && !emailChips.includes(email)) {
          setEmailChips(prev => [...prev, email]);
        }
      });

      setEmailInput('');
    } else {
      setEmailInput(value);
    }
  };

  const handleEmailInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && emailInput.trim()) {
      e.preventDefault();
      const email = emailInput.trim();
      if (isValidEmail(email) && !emailChips.includes(email)) {
        setEmailChips(prev => [...prev, email]);
        setEmailInput('');
      }
    } else if (e.key === 'Backspace' && !emailInput && emailChips.length > 0) {
      setEmailChips(prev => prev.slice(0, -1));
    }
  };

  const removeEmailChip = (emailToRemove: string) => {
    setEmailChips(prev => prev.filter(email => email !== emailToRemove));
  };

  const handleCreateOrganization = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual API call
    console.log('Creating organization:', { ...formData, emails: emailChips });
    setIsCreateModalOpen(false);
    setFormData({ name: '', seats: 5 });
    setEmailChips([]);
    setEmailInput('');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Organisasjoner</h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Opprett organisasjon
          </button>
        </div>

        {/* Organization List */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="search"
                placeholder="Søk etter organisasjoner..."
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
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-1" />
                      Bedrift
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Antall plasser
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      Medlemmer
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      Pending invitasjoner
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Opprettet
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Handlinger
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
                    </td>
                  </tr>
                ) : (
                  getCurrentPageOrganizations().map((org) => (
                    <tr key={org.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{org.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{org.seats}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{org.members_count}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{org.pending_invitations}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(org.created_at)}</td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => navigate(`/admin/organizations/${org.id}`)}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Administrer
                        </button>
                      </td>
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

      {/* Create Organization Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Opprett organisasjon</h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleCreateOrganization} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Navn på bedrift
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Bedrift AS"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Antall seter
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.seats}
                  onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) || 1 })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                  placeholder="5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Inviter brukere (valgfritt)
                </label>
                <div className="min-h-[80px] p-2 border border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                  <div className="flex flex-wrap gap-2">
                    {emailChips.map((email, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        <span>{email}</span>
                        <button
                          type="button"
                          onClick={() => removeEmailChip(email)}
                          className="ml-2 hover:text-blue-900"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <input
                      type="text"
                      value={emailInput}
                      onChange={handleEmailInputChange}
                      onKeyDown={handleEmailInputKeyDown}
                      className="flex-1 min-w-[200px] outline-none border-none focus:ring-0 text-sm"
                      placeholder={emailChips.length === 0 ? "bruker1@example.com, bruker2@example.com" : "Legg til flere..."}
                    />
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Trykk komma eller Enter etter hver e-postadresse
                </p>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Opprett
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
