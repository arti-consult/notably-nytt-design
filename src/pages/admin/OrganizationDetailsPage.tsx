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
  UserCheck,
  CreditCard,
  Receipt,
  CheckCircle,
  XCircle,
  Clock,
  FileText
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

interface Invoice {
  id: string;
  period: string;
  amount: number;
  status: 'paid' | 'unpaid' | 'overdue';
  due_date: string;
  paid_date?: string;
}

interface BillingInfo {
  billing_period: 'monthly' | 'yearly';
  cost_per_seat: number;
  next_payment_date: string;
  payment_status: 'paid' | 'unpaid' | 'due_soon';
  invoices: Invoice[];
}

interface OrganizationDetails {
  id: string;
  name: string;
  seats: number;
  created_at: string;
  members: Member[];
  invitations: Invitation[];
  billing: BillingInfo;
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
  })),
  billing: {
    billing_period: 'monthly',
    cost_per_seat: 299,
    next_payment_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    payment_status: 'due_soon',
    invoices: [
      {
        id: 'inv-1',
        period: 'Januar 2025',
        amount: 2990,
        status: 'paid',
        due_date: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
        paid_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'inv-2',
        period: 'Desember 2024',
        amount: 2990,
        status: 'paid',
        due_date: new Date(Date.now() - 43 * 24 * 60 * 60 * 1000).toISOString(),
        paid_date: new Date(Date.now() - 44 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'inv-3',
        period: 'November 2024',
        amount: 2990,
        status: 'paid',
        due_date: new Date(Date.now() - 73 * 24 * 60 * 60 * 1000).toISOString(),
        paid_date: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'inv-4',
        period: 'Oktober 2024',
        amount: 2990,
        status: 'unpaid',
        due_date: new Date(Date.now() - 103 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  }
};

export default function OrganizationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [organization, setOrganization] = useState<OrganizationDetails | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');
  const [isRemoveMemberModalOpen, setIsRemoveMemberModalOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);
  const [isUpdateSeatsModalOpen, setIsUpdateSeatsModalOpen] = useState(false);
  const [isCancelInvitationModalOpen, setIsCancelInvitationModalOpen] = useState(false);
  const [invitationToCancel, setInvitationToCancel] = useState<Invitation | null>(null);
  const [seats, setSeats] = useState(10);
  const [inviteFormData, setInviteFormData] = useState({
    role: 'member' as 'admin' | 'member'
  });
  const [emailInput, setEmailInput] = useState('');
  const [emailChips, setEmailChips] = useState<string[]>([]);
  const [isUpdatePaymentStatusModalOpen, setIsUpdatePaymentStatusModalOpen] = useState(false);
  const [invoiceToUpdate, setInvoiceToUpdate] = useState<Invoice | null>(null);

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('no-NO', {
      style: 'currency',
      currency: 'NOK',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getDaysUntilPayment = (nextPaymentDate: string) => {
    const days = Math.ceil((new Date(nextPaymentDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getPaymentStatusInfo = (status: 'paid' | 'unpaid' | 'due_soon') => {
    switch (status) {
      case 'paid':
        return {
          label: 'Betalt',
          color: 'text-green-700',
          bgColor: 'bg-green-100',
          icon: CheckCircle
        };
      case 'unpaid':
        return {
          label: 'Ikke betalt',
          color: 'text-red-700',
          bgColor: 'bg-red-100',
          icon: XCircle
        };
      case 'due_soon':
        return {
          label: 'Forfaller snart',
          color: 'text-amber-700',
          bgColor: 'bg-amber-100',
          icon: Clock
        };
    }
  };

  const getInvoiceStatusInfo = (status: 'paid' | 'unpaid' | 'overdue') => {
    switch (status) {
      case 'paid':
        return {
          label: 'Betalt',
          color: 'text-green-700',
          bgColor: 'bg-green-100'
        };
      case 'unpaid':
        return {
          label: 'Ubetalt',
          color: 'text-red-700',
          bgColor: 'bg-red-100'
        };
      case 'overdue':
        return {
          label: 'Forfalt',
          color: 'text-red-700',
          bgColor: 'bg-red-100'
        };
    }
  };

  const handleUpdateSeats = () => {
    setIsUpdateSeatsModalOpen(true);
  };

  const confirmUpdateSeats = () => {
    // TODO: Implement API call
    console.log('Updating seats to:', seats);
    setIsUpdateSeatsModalOpen(false);
  };

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

  const handleSendInvitations = (e: React.FormEvent) => {
    e.preventDefault();

    if (emailChips.length === 0) {
      alert('Legg til minst én e-postadresse');
      return;
    }

    // TODO: Implement API call
    console.log('Sending invitations:', { ...inviteFormData, emails: emailChips });
    setIsInviteModalOpen(false);
    setInviteFormData({ role: 'member' });
    setEmailChips([]);
    setEmailInput('');
  };

  const handleDeleteOrganization = () => {
    // TODO: Implement API call
    console.log('Deleting organization:', id);
    setDeleteConfirmationInput('');
    setIsDeleteModalOpen(false);
    navigate('/admin/organizations');
  };

  const handleRemoveMember = () => {
    if (!memberToRemove) return;

    // TODO: Implement API call
    console.log('Removing member:', memberToRemove.id);
    setIsRemoveMemberModalOpen(false);
    setMemberToRemove(null);
  };

  const handleCancelInvitation = () => {
    if (!invitationToCancel) return;

    // TODO: Implement API call
    console.log('Canceling invitation:', invitationToCancel.id);
    setIsCancelInvitationModalOpen(false);
    setInvitationToCancel(null);
  };

  const handleUpdatePaymentStatus = (newStatus: 'paid' | 'unpaid') => {
    if (!invoiceToUpdate) return;

    // TODO: Implement API call
    console.log('Updating invoice payment status:', invoiceToUpdate.id, 'to', newStatus);
    setIsUpdatePaymentStatusModalOpen(false);
    setInvoiceToUpdate(null);
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

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <p className="text-sm text-gray-600 mb-1">Antall plasser</p>
                <p className="text-2xl font-semibold">{organization.seats}</p>
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
            <input
              type="number"
              min="1"
              value={seats}
              onChange={(e) => setSeats(parseInt(e.target.value) || 1)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
              placeholder="5"
            />
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
                        onClick={() => {
                          setMemberToRemove(member);
                          setIsRemoveMemberModalOpen(true);
                        }}
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

        {/* Ventende Invitasjoner */}
        {organization.invitations.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Ventende invitasjoner ({organization.invitations.length})</h2>
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
                          onClick={() => {
                            setInvitationToCancel(invitation);
                            setIsCancelInvitationModalOpen(true);
                          }}
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

        {/* Billing & Subscription */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Fakturering & Abonnement</h2>
          </div>

          {/* Billing Overview Cards */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Payment Status */}
            <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Betalingsstatus</p>
                {(() => {
                  const statusInfo = getPaymentStatusInfo(organization.billing.payment_status);
                  const StatusIcon = statusInfo.icon;
                  return (
                    <div className={cn("p-2 rounded-lg", statusInfo.bgColor)}>
                      <StatusIcon className={cn("h-4 w-4", statusInfo.color)} />
                    </div>
                  );
                })()}
              </div>
              <p className={cn(
                "text-lg font-semibold",
                getPaymentStatusInfo(organization.billing.payment_status).color
              )}>
                {getPaymentStatusInfo(organization.billing.payment_status).label}
              </p>
            </div>

            {/* Next Payment Date */}
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Neste betaling</p>
                <div className="p-2 bg-blue-200 rounded-lg">
                  <Calendar className="h-4 w-4 text-blue-700" />
                </div>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(organization.billing.next_payment_date)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                om {getDaysUntilPayment(organization.billing.next_payment_date)} dager
              </p>
            </div>

            {/* Billing Period */}
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Faktureringsperiode</p>
                <div className="p-2 bg-purple-200 rounded-lg">
                  <Clock className="h-4 w-4 text-purple-700" />
                </div>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {organization.billing.billing_period === 'monthly' ? 'Månedlig' : 'Årlig'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatCurrency(organization.billing.cost_per_seat)} per plass
              </p>
            </div>

            {/* Total Cost */}
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Total kostnad</p>
                <div className="p-2 bg-green-200 rounded-lg">
                  <CreditCard className="h-4 w-4 text-green-700" />
                </div>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(organization.billing.cost_per_seat * organization.seats)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                per {organization.billing.billing_period === 'monthly' ? 'måned' : 'år'}
              </p>
            </div>
          </div>

          {/* Invoice History */}
          <div className="border-t border-gray-200">
            <div className="px-6 py-4 bg-gray-50">
              <h3 className="font-semibold text-gray-900">Fakturahistorikk</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      <div className="flex items-center">
                        <Receipt className="h-4 w-4 mr-1" />
                        Periode
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Beløp</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Forfallsdato</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Betalt dato</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Handlinger</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {organization.billing.invoices.map((invoice) => {
                    const statusInfo = getInvoiceStatusInfo(invoice.status);
                    return (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{invoice.period}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                          {formatCurrency(invoice.amount)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{formatDate(invoice.due_date)}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {invoice.paid_date ? formatDate(invoice.paid_date) : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                            statusInfo.bgColor,
                            statusInfo.color
                          )}>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => {
                                setInvoiceToUpdate(invoice);
                                setIsUpdatePaymentStatusModalOpen(true);
                              }}
                              className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                              {invoice.status === 'paid' ? 'Merk ubetalt' : 'Merk betalt'}
                            </button>
                            <button className="text-gray-600 hover:text-gray-700 font-medium">
                              <FileText className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl shadow-sm border-2 border-red-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-red-700 mb-2">Faresone</h2>
            <p className="text-sm text-gray-600 mb-4">
              Når du sletter denne organisasjonen, vil alle medlemmer miste tilgangen sin og all data tilknyttet organisasjonen vil bli permanent slettet. Denne handlingen kan ikke angres.
            </p>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Slett organisasjon
            </button>
          </div>
        </div>
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
                <div className="min-h-[100px] p-2 border border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
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
              <p className="text-gray-600 text-center mb-4">
                Er du sikker på at du vil slette <span className="font-semibold">{organization.name}</span>? Denne handlingen kan ikke angres.
              </p>
              <div className="mb-6">
                <p className="text-sm text-gray-700 mb-2">
                  Skriv inn <span className="font-semibold">{organization.name}</span> for å bekrefte:
                </p>
                <input
                  type="text"
                  value={deleteConfirmationInput}
                  onChange={(e) => setDeleteConfirmationInput(e.target.value)}
                  placeholder={organization.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setDeleteConfirmationInput('');
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Avbryt
                </button>
                <button
                  onClick={handleDeleteOrganization}
                  disabled={deleteConfirmationInput !== organization.name}
                  className={cn(
                    "flex-1 px-4 py-2 rounded-lg transition-colors",
                    deleteConfirmationInput === organization.name
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  )}
                >
                  Slett
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Remove Member Confirmation Modal */}
      {isRemoveMemberModalOpen && memberToRemove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">Fjern medlem?</h2>
              <p className="text-gray-600 mb-6">
                Er du sikker på at du vil fjerne <span className="font-semibold">{memberToRemove.email}</span> fra {organization.name}?
              </p>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setIsRemoveMemberModalOpen(false);
                    setMemberToRemove(null);
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Avbryt
                </button>
                <button
                  onClick={handleRemoveMember}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Fjern
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Seats Confirmation Modal */}
      {isUpdateSeatsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">Oppdater antall plasser?</h2>
              <p className="text-gray-600 mb-6">
                Er du sikker på at du vil endre antall plasser fra <span className="font-semibold">{organization.seats}</span> til <span className="font-semibold">{seats}</span>?
              </p>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setIsUpdateSeatsModalOpen(false);
                    setSeats(organization.seats);
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Avbryt
                </button>
                <button
                  onClick={confirmUpdateSeats}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Oppdater
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Invitation Confirmation Modal */}
      {isCancelInvitationModalOpen && invitationToCancel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">Avbryt invitasjon?</h2>
              <p className="text-gray-600 mb-6">
                Er du sikker på at du vil avbryte invitasjonen til <span className="font-semibold">{invitationToCancel.email}</span>?
              </p>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setIsCancelInvitationModalOpen(false);
                    setInvitationToCancel(null);
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Nei, behold
                </button>
                <button
                  onClick={handleCancelInvitation}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Ja, avbryt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Payment Status Modal */}
      {isUpdatePaymentStatusModalOpen && invoiceToUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-4">
                <Receipt className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-center mb-2">Oppdater betalingsstatus</h2>
              <p className="text-gray-600 text-center mb-6">
                Vil du endre betalingsstatus for fakturaen for <span className="font-semibold">{invoiceToUpdate.period}</span>?
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Periode:</span>
                  <span className="text-sm font-medium">{invoiceToUpdate.period}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Beløp:</span>
                  <span className="text-sm font-medium">{formatCurrency(invoiceToUpdate.amount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Nåværende status:</span>
                  <span className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full",
                    getInvoiceStatusInfo(invoiceToUpdate.status).bgColor,
                    getInvoiceStatusInfo(invoiceToUpdate.status).color
                  )}>
                    {getInvoiceStatusInfo(invoiceToUpdate.status).label}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setIsUpdatePaymentStatusModalOpen(false);
                    setInvoiceToUpdate(null);
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Avbryt
                </button>
                {invoiceToUpdate.status === 'paid' ? (
                  <button
                    onClick={() => handleUpdatePaymentStatus('unpaid')}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Merk som ubetalt
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpdatePaymentStatus('paid')}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Merk som betalt
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
