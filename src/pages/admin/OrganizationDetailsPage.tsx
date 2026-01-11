import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Building2,
  Users,
  Mail,
  Calendar,
  Trash2,
  Plus,
  X,
  Shield,
  UserCheck
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { cn } from '@/lib/utils';

interface Member {
  id: string;
  email: string;
  role: 'admin' | 'member';
  joined_at: string;
}

interface Invitation {
  id: string;
  email: string;
  role: 'admin' | 'member';
  sent_at: string;
}

interface OrganizationDetails {
  id: string;
  name: string;
  seats: number;
  created_at: string;
  members: Member[];
  invitations: Invitation[];
}

// Mock data
const mockOrgDetails: OrganizationDetails = {
  id: 'org-1',
  name: 'Bedrift 1 AS',
  seats: 10,
  created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  members: Array.from({ length: 5 }, (_, i) => ({
    id: `member-${i + 1}`,
    email: `bruker${i + 1}@bedrift1.no`,
    role: i === 0 ? 'admin' : 'member',
    joined_at: new Date(Date.now() - Math.random() * 80 * 24 * 60 * 60 * 1000).toISOString()
  })),
  invitations: Array.from({ length: 2 }, (_, i) => ({
    id: `invitation-${i + 1}`,
    email: `pending${i + 1}@bedrift1.no`,
    role: 'member',
    sent_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
  }))
};

export default function OrganizationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [organization, setOrganization] = useState<OrganizationDetails | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [seats, setSeats] = useState(10);
  const [inviteFormData, setInviteFormData] = useState({
    emails: '',
    role: 'member' as 'admin' | 'member'
  });

  useEffect(() => {
    setTimeout(() => {
      setOrganization(mockOrgDetails);
      setSeats(mockOrgDetails.seats);
      setIsLoading(false);
    }, 300);
  }, [id]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('no', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const handleUpdateSeats = () => {
    // TODO: Implement API call
    console.log('Updating seats to:', seats);
  };

  const handleSendInvitations = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call
    console.log('Sending invitations:', inviteFormData);
    setIsInviteModalOpen(false);
    setInviteFormData({ emails: '', role: 'member' });
  };

  const handleDeleteOrganization = () => {
    // TODO: Implement API call
    console.log('Deleting organization:', id);
    navigate('/admin/organizations');
  };

  const handleRemoveMember = (memberId: string) => {
    // TODO: Implement API call
    console.log('Removing member:', memberId);
  };

  const handleCancelInvitation = (invitationId: string) => {
    // TODO: Implement API call
    console.log('Canceling invitation:', invitationId);
  };

  if (isLoading || !organization) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/organizations')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold">{organization.name}</h1>
              <p className="text-sm text-gray-500">Opprettet {formatDate(organization.created_at)}</p>
            </div>
          </div>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Slett organisasjon
          </button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Medlemmer</p>
                <p className="text-2xl font-semibold">{organization.members.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending invitasjoner</p>
                <p className="text-2xl font-semibold">{organization.invitations.length}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <Mail className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Ledige plasser</p>
                <p className="text-2xl font-semibold">{organization.seats - organization.members.length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Seats Management */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Antall seter</h2>
          <div className="flex items-center space-x-4">
            <select
              value={seats}
              onChange={(e) => setSeats(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
            >
              <option value={5}>5 seter</option>
              <option value={10}>10 seter</option>
              <option value={15}>15 seter</option>
              <option value={20}>20 seter</option>
              <option value={25}>25 seter</option>
              <option value={50}>50 seter</option>
              <option value={100}>100 seter</option>
            </select>
            <button
              onClick={handleUpdateSeats}
              disabled={seats === organization.seats}
              className={cn(
                "px-4 py-2 rounded-lg transition-colors",
                seats === organization.seats
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              )}
            >
              Oppdater
            </button>
          </div>
        </div>

        {/* Members */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Medlemmer ({organization.members.length})</h2>
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Inviter medlemmer
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">E-post</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Rolle</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Ble med</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Handlinger</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {organization.members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{member.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        member.role === 'admin'
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      )}>
                        {member.role === 'admin' ? (
                          <Shield className="h-3 w-3 mr-1" />
                        ) : (
                          <UserCheck className="h-3 w-3 mr-1" />
                        )}
                        {member.role === 'admin' ? 'Administrator' : 'Medlem'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(member.joined_at)}</td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-red-600 hover:text-red-700 font-medium"
                      >
                        Fjern
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Invitations */}
        {organization.invitations.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Pending invitasjoner ({organization.invitations.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">E-post</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Rolle</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Sendt</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Handlinger</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {organization.invitations.map((invitation) => (
                    <tr key={invitation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{invitation.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          invitation.role === 'admin'
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        )}>
                          {invitation.role === 'admin' ? (
                            <Shield className="h-3 w-3 mr-1" />
                          ) : (
                            <UserCheck className="h-3 w-3 mr-1" />
                          )}
                          {invitation.role === 'admin' ? 'Administrator' : 'Medlem'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(invitation.sent_at)}</td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleCancelInvitation(invitation.id)}
                          className="text-red-600 hover:text-red-700 font-medium"
                        >
                          Avbryt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Invite Members Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Inviter medlemmer</h2>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSendInvitations} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-postadresser
                </label>
                <textarea
                  value={inviteFormData.emails}
                  onChange={(e) => setInviteFormData({ ...inviteFormData, emails: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                  placeholder="bruker1@example.com, bruker2@example.com"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Separer flere e-postadresser med komma
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rolle
                </label>
                <select
                  value={inviteFormData.role}
                  onChange={(e) => setInviteFormData({ ...inviteFormData, role: e.target.value as 'admin' | 'member' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="member">Medlem</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send invitasjoner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-center mb-2">Slett organisasjon?</h2>
              <p className="text-gray-600 text-center mb-6">
                Er du sikker på at du vil slette {organization.name}? Denne handlingen kan ikke angres.
              </p>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Avbryt
                </button>
                <button
                  onClick={handleDeleteOrganization}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Slett
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
