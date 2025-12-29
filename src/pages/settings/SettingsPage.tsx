import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ChevronLeft,
  User,
  Settings as SettingsIcon,
  CreditCard,
  Users,
  Shield,
  Bell,
  Globe,
  Clock,
  Lock,
  Download,
  Trash2,
  ExternalLink,
  Mail,
  Building,
  CheckCircle,
  Crown,
  MoreVertical,
  UserPlus,
  Folder,
  Check,
  X,
  Send,
  Plug,
  Calendar,
  MessageSquare,
  Zap,
  Key,
  Webhook,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  Terminal,
  Bot,
  Mic,
  Languages,
  FileText,
  Sparkles,
  UserCircle,
  Plus,
  Minus,
  Receipt,
  TrendingUp,
  AlertCircle,
  UserMinus,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockUser } from '@/lib/mockData';
import { mockTemplates } from '@/lib/mockTemplates';
import { mockOrganization, formatLastActive, OrganizationMember, mockInvoices, mockSeatSubscription, Invoice } from '@/lib/mockOrganization';
import { useDemoUser, mockDemoUsers } from '@/contexts/DemoUserContext';
import { toast } from '@/components/ui/toast';
import ChangePasswordModal from '@/components/ChangePasswordModal';
import { motion, AnimatePresence } from 'framer-motion';

// Tab configuration
const tabs = [
  { id: 'profile', label: 'Profil', icon: User },
  { id: 'preferences', label: 'Preferanser', icon: SettingsIcon },
  { id: 'billing', label: 'Abonnement', icon: CreditCard },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'integrations', label: 'Integrasjoner', icon: Plug },
  { id: 'security', label: 'Sikkerhet', icon: Shield }
];

// Shared components
interface ToggleSettingProps {
  icon: React.ElementType;
  title: string;
  description: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

function ToggleSetting({ icon: Icon, title, description, enabled, onChange }: ToggleSettingProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0">
      <div className="flex items-start space-x-3">
        <div className="p-1">
          <Icon className="h-5 w-5 text-gray-500" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
          enabled ? "bg-blue-600" : "bg-gray-200"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
            enabled ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
}

interface SelectSettingProps {
  icon: React.ElementType;
  title: string;
  description: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

function SelectSetting({ icon: Icon, title, description, value, options, onChange }: SelectSettingProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0">
      <div className="flex items-start space-x-3">
        <div className="p-1">
          <Icon className="h-5 w-5 text-gray-500" />
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:border-blue-500 focus:ring-blue-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// Profile Tab
function ProfileTab() {
  const { mode, isSolo, isMember, isAdmin } = useDemoUser();
  const currentUserData = mockDemoUsers[mode];
  const [orgName, setOrgName] = useState(mockOrganization.name);
  const [showCreateOrgModal, setShowCreateOrgModal] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">Min profil</h2>
      </div>
      <div className="p-6 space-y-6">
        {/* Avatar */}
        <div className="flex items-center space-x-4">
          <div className={cn(
            "h-20 w-20 rounded-full flex items-center justify-center",
            isSolo && "bg-emerald-100",
            isMember && "bg-amber-100",
            isAdmin && "bg-blue-100"
          )}>
            {isSolo && <UserCircle className="h-10 w-10 text-emerald-600" />}
            {isMember && <Users className="h-10 w-10 text-amber-600" />}
            {isAdmin && <User className="h-10 w-10 text-blue-600" />}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{currentUserData.name}</h3>
            <p className="text-gray-600">{currentUserData.email}</p>
            <button className="text-sm text-blue-600 hover:text-blue-700 mt-1">
              Endre profilbilde
            </button>
          </div>
        </div>

        {/* Form fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Navn
            </label>
            <input
              type="text"
              defaultValue={currentUserData.name}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-post
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={currentUserData.email}
                disabled
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-600"
              />
            </div>
          </div>

          {/* Organization info - only for org users */}
          {!isSolo && (
            <div className="pt-4 border-t border-gray-100">
              {isAdmin ? (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organisasjonsnavn
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3 p-4 rounded-lg bg-amber-50">
                  <Building className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="font-medium text-amber-900">
                      {mockOrganization.name}
                    </p>
                    <p className="text-sm text-amber-700">
                      Medlem
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Create org CTA - only for Solo users */}
          {isSolo && (
            <div className="pt-4 border-t border-gray-100">
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Sparkles className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-emerald-900">Samarbeid med teamet ditt</h4>
                    <p className="text-sm text-emerald-700 mt-1">
                      Opprett en organisasjon for å dele møtenotater, maler og mapper med kollegene dine.
                    </p>
                    <button
                      onClick={() => setShowCreateOrgModal(true)}
                      className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Opprett organisasjon
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={() => toast.success('Profil oppdatert')}
            className="button-primary"
          >
            Lagre endringer
          </button>
        </div>
      </div>

      {/* Create Organization Modal */}
      {showCreateOrgModal && (
        <CreateOrganizationModal onClose={() => setShowCreateOrgModal(false)} />
      )}
    </div>
  );
}

// Create Organization Modal - Multi-step wizard
interface CreateOrganizationModalProps {
  onClose: () => void;
}

function CreateOrganizationModal({ onClose }: CreateOrganizationModalProps) {
  const [step, setStep] = useState(1);
  const [orgName, setOrgName] = useState('');
  const [seatCount, setSeatCount] = useState(3);
  const [inviteEmails, setInviteEmails] = useState<string[]>(['']);
  const [isCreating, setIsCreating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const pricePerSeat = 399;
  const totalPrice = seatCount * pricePerSeat;

  const handleAddEmail = () => {
    setInviteEmails([...inviteEmails, '']);
  };

  const handleRemoveEmail = (index: number) => {
    if (inviteEmails.length > 1) {
      setInviteEmails(inviteEmails.filter((_, i) => i !== index));
    }
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...inviteEmails];
    newEmails[index] = value;
    setInviteEmails(newEmails);
  };

  const validEmails = inviteEmails.filter(email => email.trim() && email.includes('@'));

  const handleCreate = async () => {
    setIsCreating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsCreating(false);
    setIsComplete(true);
  };

  const handleFinish = () => {
    toast.success('Organisasjon opprettet! Velkommen til teamet.');
    onClose();
  };

  // Success state
  if (isComplete) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Check className="h-10 w-10 text-emerald-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Velkommen til {orgName}!
            </h2>
            <p className="text-gray-600 mb-6">
              Din organisasjon er nå opprettet. {validEmails.length > 0 && `${validEmails.length} invitasjon${validEmails.length > 1 ? 'er' : ''} er sendt.`}
            </p>
            <button
              onClick={handleFinish}
              className="w-full py-3 bg-gradient-to-r from-[#2C64E3] to-[#5A8DF8] text-white rounded-xl font-medium hover:from-[#1F49C6] hover:to-[#4A81EB] transition-all"
            >
              Kom i gang
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-gradient-to-br from-[#2C64E3] to-[#5A8DF8] rounded-xl shadow-lg">
                  <Building className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Opprett organisasjon</h2>
                  <p className="text-sm text-gray-500">Steg {step} av 3</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="flex space-x-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-all",
                    s <= step ? "bg-[#2C64E3]" : "bg-gray-200"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {/* Step 1: Organization Name */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Hva heter organisasjonen din?
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Dette kan være bedriftsnavnet eller teamets navn.
                    </p>
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="F.eks. Acme AS eller Salg-teamet"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#2C64E3] focus:ring-2 focus:ring-blue-100 transition-all text-lg"
                      autoFocus
                    />
                  </div>

                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="flex items-start space-x-3">
                      <Sparkles className="h-5 w-5 text-[#2C64E3] mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Samarbeid uten grenser
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Del møtenotater, maler og mapper med hele teamet. Alle får tilgang til felles ressurser.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Select Seats */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Hvor mange plasser trenger du?
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                      Inkludert deg selv. Du kan enkelt legge til flere senere.
                    </p>

                    {/* Seat selector */}
                    <div className="flex items-center justify-center space-x-6 py-4">
                      <button
                        onClick={() => setSeatCount(Math.max(2, seatCount - 1))}
                        disabled={seatCount <= 2}
                        className={cn(
                          "w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all",
                          seatCount <= 2
                            ? "border-gray-200 text-gray-300 cursor-not-allowed"
                            : "border-gray-300 text-gray-600 hover:border-[#2C64E3] hover:text-[#2C64E3]"
                        )}
                      >
                        <Minus className="h-5 w-5" />
                      </button>
                      <div className="text-center">
                        <div className="text-5xl font-bold text-gray-900">{seatCount}</div>
                        <div className="text-sm text-gray-500 mt-1">plasser</div>
                      </div>
                      <button
                        onClick={() => setSeatCount(Math.min(50, seatCount + 1))}
                        disabled={seatCount >= 50}
                        className={cn(
                          "w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all",
                          seatCount >= 50
                            ? "border-gray-200 text-gray-300 cursor-not-allowed"
                            : "border-gray-300 text-gray-600 hover:border-[#2C64E3] hover:text-[#2C64E3]"
                        )}
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Pricing summary */}
                  <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-600">Månedlig kostnad</span>
                      <span className="text-2xl font-bold text-gray-900">
                        {totalPrice.toLocaleString('nb-NO')} kr
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{seatCount} plasser × {pricePerSeat} kr</span>
                      <span>+ mva</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span>14 dagers gratis prøveperiode</span>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Invite Team */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Inviter teamet ditt
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Send invitasjoner nå, eller hopp over og gjør det senere.
                    </p>

                    <div className="space-y-3">
                      {inviteEmails.map((email, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => handleEmailChange(index, e.target.value)}
                            placeholder="kollega@firma.no"
                            className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#2C64E3] focus:ring-2 focus:ring-blue-100 transition-all"
                          />
                          {inviteEmails.length > 1 && (
                            <button
                              onClick={() => handleRemoveEmail(index)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {inviteEmails.length < seatCount - 1 && (
                      <button
                        onClick={handleAddEmail}
                        className="mt-3 flex items-center space-x-2 text-sm text-[#2C64E3] hover:text-[#1F49C6] font-medium"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Legg til flere</span>
                      </button>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <h4 className="font-medium text-gray-900 mb-3">Oppsummering</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Organisasjon</span>
                        <span className="font-medium text-gray-900">{orgName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Antall plasser</span>
                        <span className="font-medium text-gray-900">{seatCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Invitasjoner</span>
                        <span className="font-medium text-gray-900">{validEmails.length}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-blue-200 mt-2">
                        <span className="text-gray-600">Månedlig kostnad</span>
                        <span className="font-bold text-gray-900">{totalPrice.toLocaleString('nb-NO')} kr + mva</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex-shrink-0">
            <div className="flex items-center justify-between">
              {step > 1 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Tilbake</span>
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  Avbryt
                </button>
              )}

              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={step === 1 && !orgName.trim()}
                  className={cn(
                    "flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium transition-all",
                    (step === 1 && !orgName.trim())
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#2C64E3] to-[#5A8DF8] text-white hover:from-[#1F49C6] hover:to-[#4A81EB] hover:shadow-lg"
                  )}
                >
                  <span>Neste</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium bg-gradient-to-r from-[#2C64E3] to-[#5A8DF8] text-white hover:from-[#1F49C6] hover:to-[#4A81EB] hover:shadow-lg transition-all"
                >
                  {isCreating ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Oppretter...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Opprett organisasjon</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Styled Dropdown Component with Portal
interface StyledDropdownProps {
  value: string;
  options: { value: string; label: string; description?: string }[];
  onChange: (value: string) => void;
  icon?: React.ElementType;
}

function StyledDropdown({ value, options, onChange, icon: Icon }: StyledDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(o => o.value === value);

  // Update position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [isOpen]);

  // Close on page scroll (but not dropdown scroll)
  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = (e: Event) => {
      // Don't close if scrolling inside the dropdown
      if (dropdownRef.current?.contains(e.target as Node)) return;
      setIsOpen(false);
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3 border rounded-xl transition-all text-left",
          isOpen
            ? "bg-white border-blue-300 ring-2 ring-blue-100 shadow-md"
            : "bg-gray-50 hover:bg-gray-100 border-gray-200"
        )}
      >
        <div className="flex items-center space-x-3">
          {Icon && (
            <div className={cn(
              "p-1.5 rounded-lg shadow-sm transition-colors",
              isOpen ? "bg-blue-100" : "bg-white"
            )}>
              <Icon className="h-4 w-4 text-blue-600" />
            </div>
          )}
          <span className="font-medium text-gray-900">{selectedOption?.label}</span>
        </div>
        <ChevronLeft className={cn(
          "h-4 w-4 transition-transform duration-200",
          isOpen ? "rotate-90 text-blue-500" : "-rotate-90 text-gray-400"
        )} />
      </button>

      {/* Portal dropdown to body so it can overflow any parent container */}
      {isOpen && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998]"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{
              position: 'absolute',
              top: position.top,
              left: position.left,
              width: position.width,
            }}
            className="z-[9999] bg-white rounded-xl shadow-2xl border border-gray-200 py-2 max-h-80 overflow-y-auto scrollbar-thin"
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => { onChange(option.value); setIsOpen(false); }}
                className={cn(
                  "w-full flex items-center px-4 py-3 text-left transition-colors",
                  option.value === value
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                )}
              >
                <div className="flex-1">
                  <span className={cn(
                    "font-medium",
                    option.value === value ? "text-blue-700" : "text-gray-900"
                  )}>{option.label}</span>
                  {option.description && (
                    <p className={cn(
                      "text-xs mt-0.5",
                      option.value === value ? "text-blue-600/70" : "text-gray-500"
                    )}>{option.description}</p>
                  )}
                </div>
                {option.value === value && (
                  <div className="p-1 bg-blue-100 rounded-full ml-3">
                    <Check className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                )}
              </button>
            ))}
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

// Preferences Tab
function PreferencesTab() {
  // Recording settings
  const [autoRecord, setAutoRecord] = useState(true);
  const [defaultTemplate, setDefaultTemplate] = useState('template-1');
  const [defaultLanguage, setDefaultLanguage] = useState('auto');

  // Interface settings
  const [language, setLanguage] = useState('no');

  // Notification settings
  const [notifications, setNotifications] = useState(true);

  const templateOptions = mockTemplates.map(t => ({
    value: t.id,
    label: t.name,
    description: t.description
  }));

  const meetingLanguageOptions = [
    { value: 'auto', label: 'Oppdag automatisk', description: 'Vi gjenkjenner språket fra samtalen' },
    { value: 'no', label: 'Norsk' },
    { value: 'en', label: 'English' }
  ];

  const interfaceLanguageOptions = [
    { value: 'no', label: 'Norsk' },
    { value: 'en', label: 'English' }
  ];

  return (
    <div className="space-y-6">
      {/* Recording Settings */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-100 rounded-xl">
              <Mic className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Opptak</h2>
              <p className="text-sm text-gray-500">Hvordan Notably håndterer møtene dine</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Auto-record toggle - redesigned as a card */}
          <div className="p-5 bg-blue-50/50 rounded-xl border border-blue-100">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Automatisk opptak</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Notably deltar automatisk på møter fra kalenderen din og lager notater for deg.
                </p>
              </div>
              <button
                onClick={() => setAutoRecord(!autoRecord)}
                className={cn(
                  "relative inline-flex h-7 w-12 items-center rounded-full transition-colors shadow-inner",
                  autoRecord ? "bg-blue-600" : "bg-gray-300"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform",
                    autoRecord ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
            </div>
          </div>

          {/* Template selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-medium text-gray-900">Mal for notater</h3>
                <p className="text-sm text-gray-500">Velg hvordan notatene dine skal struktureres</p>
              </div>
            </div>
            <StyledDropdown
              value={defaultTemplate}
              options={templateOptions}
              onChange={setDefaultTemplate}
              icon={FileText}
            />
          </div>

          {/* Language selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-medium text-gray-900">Språk i møter</h3>
                <p className="text-sm text-gray-500">Hvilket språk snakkes det i møtene dine?</p>
              </div>
            </div>
            <StyledDropdown
              value={defaultLanguage}
              options={meetingLanguageOptions}
              onChange={setDefaultLanguage}
              icon={Languages}
            />
          </div>
        </div>
      </div>

      {/* Interface Settings */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl">
              <Globe className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Visning</h2>
              <p className="text-sm text-gray-500">Tilpass hvordan appen ser ut for deg</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {/* App language */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-medium text-gray-900">Språk i appen</h3>
                <p className="text-sm text-gray-500">Velg hvilket språk menyer og knapper vises på</p>
              </div>
            </div>
            <StyledDropdown
              value={language}
              options={interfaceLanguageOptions}
              onChange={setLanguage}
              icon={Languages}
            />
          </div>

        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl">
              <Bell className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Varsler</h2>
              <p className="text-sm text-gray-500">Bestem hvordan du vil bli oppdatert</p>
            </div>
          </div>
        </div>
        <ToggleSetting
          icon={Mail}
          title="E-postvarsler"
          description="Få beskjed når notater er klare eller noe viktig skjer"
          enabled={notifications}
          onChange={setNotifications}
        />
      </div>
    </div>
  );
}

// Billing Tab - Team Member View (company pays)
function BillingTabTeamMember() {
  const billingAdmin = mockOrganization.members.find(m => m.role === 'admin');

  return (
    <div className="space-y-6">
      {/* Organization Subscription Info */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold">Bedriftsabonnement</h2>
        </div>
        <div className="p-6">
          <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-600 mb-4">
                  Du er del av <span className="font-semibold text-gray-900">{mockOrganization.name}</span> sitt abonnement.
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Plan:</span>
                    <span className="font-medium flex items-center">
                      <Crown className="h-4 w-4 text-amber-500 mr-1" />
                      Enterprise
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Administrert av:</span>
                    <span className="font-medium">{billingAdmin?.email}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Teammedlemmer:</span>
                    <span className="font-medium">{mockOrganization.members.length} / {mockOrganization.maxMembers}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info box */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-start space-x-3">
              <div className="p-1">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-800">
                  Fakturering håndteres av din organisasjon. Kontakt din administrator for spørsmål om abonnement eller fakturering.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Manage Seats Modal
interface ManageSeatsModalProps {
  onClose: () => void;
}

function ManageSeatsModal({ onClose }: ManageSeatsModalProps) {
  const [seatCount, setSeatCount] = useState(mockSeatSubscription.totalSeats);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const originalSeats = mockSeatSubscription.totalSeats;
  const usedSeats = mockSeatSubscription.usedSeats;
  const pricePerSeat = mockSeatSubscription.pricePerSeat;

  const seatDifference = seatCount - originalSeats;
  const monthlyCost = seatCount * pricePerSeat;
  const previousCost = originalSeats * pricePerSeat;
  const costDifference = monthlyCost - previousCost;

  const handleAdjustSeats = async () => {
    if (seatCount === originalSeats) {
      onClose();
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsProcessing(false);

    if (seatDifference > 0) {
      toast.success(`${seatDifference} ${seatDifference === 1 ? 'sete' : 'seter'} lagt til!`);
    } else {
      toast.success(`${Math.abs(seatDifference)} ${Math.abs(seatDifference) === 1 ? 'sete' : 'seter'} fjernet.`);
    }
    onClose();
  };

  const canDecrease = seatCount > usedSeats;
  const canIncrease = seatCount < 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 bg-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-white rounded-xl shadow-sm">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Administrer seter</h2>
                <p className="text-sm text-gray-600">Juster antall brukerplasser</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/80 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Usage */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Nåværende bruk</span>
              <span className="text-sm text-gray-500">{usedSeats} av {originalSeats} seter i bruk</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2C64E3] rounded-full transition-all duration-500"
                style={{ width: `${(usedSeats / originalSeats) * 100}%` }}
              />
            </div>
          </div>

          {/* Seat Adjustment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Velg antall seter
            </label>
            <div className="flex items-center justify-center space-x-6">
              <button
                onClick={() => canDecrease && setSeatCount(prev => prev - 1)}
                disabled={!canDecrease}
                className={cn(
                  "p-3 rounded-xl border-2 transition-all",
                  canDecrease
                    ? "border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-700 hover:text-red-600"
                    : "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                )}
              >
                <Minus className="h-5 w-5" />
              </button>

              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900">{seatCount}</div>
                <div className="text-sm text-gray-500">seter</div>
              </div>

              <button
                onClick={() => canIncrease && setSeatCount(prev => prev + 1)}
                disabled={!canIncrease}
                className={cn(
                  "p-3 rounded-xl border-2 transition-all",
                  canIncrease
                    ? "border-gray-200 hover:border-green-300 hover:bg-green-50 text-gray-700 hover:text-green-600"
                    : "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                )}
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            {!canDecrease && seatCount === usedSeats && (
              <p className="text-center text-xs text-amber-600 mt-2 flex items-center justify-center">
                <AlertCircle className="h-3.5 w-3.5 mr-1" />
                Du kan ikke ha færre seter enn aktive brukere
              </p>
            )}
          </div>

          {/* Price Summary */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Månedlig kostnad</span>
              <span className="text-lg font-semibold text-gray-900">
                {monthlyCost.toLocaleString('no')} kr
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">{seatCount} seter × {pricePerSeat} kr</span>
              {seatDifference !== 0 && (
                <span className={cn(
                  "font-medium flex items-center",
                  seatDifference > 0 ? "text-green-600" : "text-red-600"
                )}>
                  <TrendingUp className={cn("h-3.5 w-3.5 mr-1", seatDifference < 0 && "rotate-180")} />
                  {seatDifference > 0 ? '+' : ''}{costDifference.toLocaleString('no')} kr/mnd
                </span>
              )}
            </div>
          </div>

          {/* Team Members Preview - if reducing seats */}
          {seatDifference < 0 && (
            <div className="border border-amber-200 bg-amber-50 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-900">
                    Du fjerner {Math.abs(seatDifference)} {Math.abs(seatDifference) === 1 ? 'sete' : 'seter'}
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    Sørg for at du ikke har flere aktive brukere enn tilgjengelige seter.
                    Endringen trer i kraft ved neste faktureringsperiode.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Avbryt
          </button>
          <button
            onClick={handleAdjustSeats}
            disabled={seatCount === originalSeats || isProcessing}
            className={cn(
              "px-5 py-2 rounded-xl text-sm font-medium transition-all flex items-center",
              seatCount !== originalSeats && !isProcessing
                ? "bg-gradient-to-r from-[#2C64E3] to-[#5A8DF8] text-white hover:from-[#1F49C6] hover:to-[#4A81EB] hover:shadow-lg"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Oppdaterer...
              </>
            ) : seatCount === originalSeats ? (
              'Ingen endringer'
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Bekreft endring
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Invoices Modal
interface InvoicesModalProps {
  onClose: () => void;
}

function InvoicesModal({ onClose }: InvoicesModalProps) {
  const [selectedYear, setSelectedYear] = useState(2024);
  const years = [2024, 2023];

  const filteredInvoices = mockInvoices.filter(inv => {
    const year = new Date(inv.date).getFullYear();
    return year === selectedYear;
  });

  const totalPaid = filteredInvoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('no', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleDownload = (invoice: Invoice) => {
    toast.success(`Laster ned ${invoice.invoiceNumber}.pdf`);
  };

  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Betalt
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
            <Clock className="h-3 w-3 mr-1" />
            Venter
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <AlertCircle className="h-3 w-3 mr-1" />
            Forfalt
          </span>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-white rounded-xl shadow-sm">
                <Receipt className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Fakturahistorikk</h2>
                <p className="text-sm text-gray-600">Se og last ned tidligere fakturaer</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/80 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Summary and Filters */}
        <div className="px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total betalt i {selectedYear}</p>
              <p className="text-2xl font-bold text-gray-900">{totalPaid.toLocaleString('no')} kr</p>
            </div>
            <div className="flex items-center space-x-2">
              {years.map(year => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    selectedYear === year
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Invoice List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredInvoices.length > 0 ? (
            <div className="space-y-3">
              {filteredInvoices.map((invoice, index) => (
                <motion.div
                  key={invoice.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-emerald-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2.5 bg-gray-100 rounded-lg group-hover:bg-emerald-100 transition-colors">
                        <FileText className="h-5 w-5 text-gray-600 group-hover:text-emerald-600 transition-colors" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
                          {getStatusBadge(invoice.status)}
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">{invoice.description}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Fakturadato: {formatDate(invoice.date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{invoice.amount.toLocaleString('no')} kr</p>
                        <p className="text-xs text-gray-500">{invoice.seats} seter</p>
                      </div>
                      <button
                        onClick={() => handleDownload(invoice)}
                        className="p-2 hover:bg-emerald-100 rounded-lg transition-colors text-gray-500 hover:text-emerald-600"
                        title="Last ned PDF"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Receipt className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Ingen fakturaer for {selectedYear}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {filteredInvoices.length} {filteredInvoices.length === 1 ? 'faktura' : 'fakturaer'} i {selectedYear}
            </p>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => toast.success('Laster ned alle fakturaer som ZIP...')}
                className="px-4 py-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Last ned alle
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors"
              >
                Lukk
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Billing Tab - Admin/Solo View (full control)
function BillingTabAdmin({ isOrgAdmin = false }: { isOrgAdmin?: boolean }) {
  const [showSeatsModal, setShowSeatsModal] = useState(false);
  const [showInvoicesModal, setShowInvoicesModal] = useState(false);
  const plans = [
    { id: 'basic', name: 'Basic', price: 299, features: ['Ubegrenset møter', 'Transkripsjon NO/EN', 'AI-oppsummering'] },
    { id: 'pro', name: 'Pro', price: 299, features: ['Alt i Basic', 'Prioritert transkripsjon', 'Kalender-integrasjon'], current: !isOrgAdmin },
    { id: 'enterprise', name: 'Enterprise', price: null, features: ['Alt i Pro', 'Dedikert support', 'SSO', 'On-premise'], current: isOrgAdmin }
  ];

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold">
            {isOrgAdmin ? 'Organisasjonens abonnement' : 'Gjeldende abonnement'}
          </h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <Crown className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{isOrgAdmin ? 'Enterprise' : 'Pro-plan'}</h3>
                <p className="text-gray-600">
                  {isOrgAdmin
                    ? `${mockOrganization.members.length} seter • Fornyes 15. jan 2026`
                    : '299 kr/mnd • Fornyes 15. jan 2026'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                <CheckCircle className="h-4 w-4 mr-1" />
                Aktiv
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              onClick={() => isOrgAdmin && setShowSeatsModal(true)}
              className="button-secondary"
            >
              {isOrgAdmin ? 'Administrer seter' : 'Endre plan'}
            </button>
            <button
              onClick={() => setShowInvoicesModal(true)}
              className="button-secondary"
            >
              Se fakturaer
            </button>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold">Betalingsmetode</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <CreditCard className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-500">Utløper 12/26</p>
              </div>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Endre
            </button>
          </div>
        </div>
      </div>

      {/* All Plans - only show for solo users */}
      {!isOrgAdmin && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold">Tilgjengelige planer</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-colors",
                    plan.current
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-blue-200"
                  )}
                >
                  <h3 className="font-semibold">{plan.name}</h3>
                  <p className="text-2xl font-bold mt-1">
                    {plan.price ? `${plan.price} kr` : 'Kontakt oss'}
                    {plan.price && <span className="text-sm font-normal text-gray-500">/mnd</span>}
                  </p>
                  <ul className="mt-3 space-y-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-1" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {plan.current && (
                    <p className="mt-3 text-sm text-blue-600 font-medium">Nåværende plan</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showSeatsModal && (
          <ManageSeatsModal onClose={() => setShowSeatsModal(false)} />
        )}
        {showInvoicesModal && (
          <InvoicesModal onClose={() => setShowInvoicesModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// Billing Tab - Solo User (personal subscription)
function BillingTabSolo() {
  const [showCreateOrgModal, setShowCreateOrgModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Mitt abonnement</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <Crown className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Notably Pro</h3>
                <p className="text-gray-600">399 kr/mnd + mva • Fornyes 15. jan 2026</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                <CheckCircle className="h-4 w-4 mr-1" />
                Aktiv
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button className="button-secondary w-full">
              Se fakturaer
            </button>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Betalingsmetode</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <CreditCard className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-500">Utløper 12/26</p>
              </div>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Endre
            </button>
          </div>
        </div>
      </div>

      {/* Team CTA */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-blue-900">Trenger du team-funksjonalitet?</h3>
            <p className="text-blue-700 mt-1">
              Oppgrader til Team-planen for å invitere kollegaer, dele mapper og samarbeide om møtenotater.
            </p>
            <button
              onClick={() => setShowCreateOrgModal(true)}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Oppgrader til Team
            </button>
          </div>
        </div>
      </div>

      {/* Create Organization Modal */}
      {showCreateOrgModal && (
        <CreateOrganizationModal onClose={() => setShowCreateOrgModal(false)} />
      )}
    </div>
  );
}

// Billing Tab - Main component with role detection
function BillingTab() {
  const { isSolo, isMember, isAdmin } = useDemoUser();

  // Solo user - personal subscription
  if (isSolo) {
    return <BillingTabSolo />;
  }

  // Team member (not admin) - read-only view
  if (isMember) {
    return <BillingTabTeamMember />;
  }

  // Admin - full control over org billing
  return <BillingTabAdmin isOrgAdmin={true} />;
}

// Team Tab - Member Card with optional actions
interface MemberCardReadOnlyProps {
  member: OrganizationMember;
  isCurrentUser: boolean;
  showActions: boolean;
  onRemove: () => void;
  onChangeRole: (role: 'admin' | 'member') => void;
}

function MemberCardReadOnly({ member, isCurrentUser, showActions, onRemove, onChangeRole }: MemberCardReadOnlyProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'remove' | 'role' | null>(null);

  const handleConfirmRole = () => {
    onChangeRole(member.role === 'admin' ? 'member' : 'admin');
    setConfirmAction(null);
    setShowMenu(false);
  };

  const handleConfirmRemove = () => {
    onRemove();
    setConfirmAction(null);
    setShowMenu(false);
  };

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <User className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">{member.name}</span>
            {isCurrentUser && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Deg</span>
            )}
            {member.role === 'admin' && <Crown className="h-4 w-4 text-amber-500" />}
          </div>
          <div className="flex items-center text-sm text-gray-500 space-x-2">
            <span>{member.email}</span>
            <span className="text-gray-300">•</span>
            <span>{formatLastActive(member.lastActive)}</span>
          </div>
        </div>
      </div>

      {showActions && (
        <div className="relative flex items-center">
          {/* Confirmation dialogs */}
          <AnimatePresence mode="wait">
            {confirmAction === 'role' && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-2 mr-2"
              >
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  {member.role === 'admin' ? 'Fjerne admin-tilgang?' : 'Gi admin-tilgang?'}
                </span>
                <button
                  onClick={handleConfirmRole}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium text-white rounded-lg transition-colors",
                    member.role === 'admin'
                      ? "bg-amber-500 hover:bg-amber-600"
                      : "bg-[#2C64E3] hover:bg-[#1F49C6]"
                  )}
                >
                  Ja
                </button>
                <button
                  onClick={() => setConfirmAction(null)}
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Nei
                </button>
              </motion.div>
            )}

            {confirmAction === 'remove' && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-2 mr-2"
              >
                <span className="text-sm text-gray-600 whitespace-nowrap">Fjerne fra organisasjonen?</span>
                <button
                  onClick={handleConfirmRemove}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                >
                  Ja, fjern
                </button>
                <button
                  onClick={() => setConfirmAction(null)}
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Nei
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {!confirmAction && (
            <>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-100 rounded-lg"
                disabled={isCurrentUser}
              >
                <MoreVertical className={cn("h-5 w-5", isCurrentUser ? "text-gray-300" : "text-gray-400")} />
              </button>

              {showMenu && !isCurrentUser && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                  <button
                    onClick={() => { setConfirmAction('role'); setShowMenu(false); }}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    {member.role === 'admin' ? 'Gjør til medlem' : 'Gjør til admin'}
                  </button>
                  <button
                    onClick={() => { setConfirmAction('remove'); setShowMenu(false); }}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Fjern
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Interface for invitation row
interface InviteRow {
  id: string;
  email: string;
  role: 'admin' | 'member';
}

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (invitations: { email: string; role: 'admin' | 'member' }[]) => void;
}

// Email validation helper
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

function InviteMemberModal({ isOpen, onClose, onInvite }: InviteMemberModalProps) {
  const [rows, setRows] = useState<InviteRow[]>([
    { id: '1', email: '', role: 'member' }
  ]);
  const [openRoleDropdown, setOpenRoleDropdown] = useState<string | null>(null);

  const addRow = () => {
    setRows([...rows, { id: Date.now().toString(), email: '', role: 'member' }]);
  };

  const removeRow = (id: string) => {
    if (rows.length > 1) {
      setRows(rows.filter(r => r.id !== id));
    }
  };

  const updateRow = (id: string, field: 'email' | 'role', value: string) => {
    setRows(rows.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Filter valid emails
    const validInvitations = rows
      .filter(r => r.email.trim() && isValidEmail(r.email.trim()))
      .map(r => ({ email: r.email.trim().toLowerCase(), role: r.role }));

    if (validInvitations.length > 0) {
      onInvite(validInvitations);
      handleClose();
    } else {
      toast.error('Vennligst fyll inn minst én gyldig e-postadresse');
    }
  };

  const handleClose = () => {
    setRows([{ id: '1', email: '', role: 'member' }]);
    onClose();
  };

  // Count valid emails
  const validCount = rows.filter(r => r.email.trim() && isValidEmail(r.email.trim())).length;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-xl max-w-xl w-full max-h-[85vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <UserPlus className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Inviter medlemmer</h2>
                  <p className="text-sm text-gray-500">Inviter nye medlemmer til teamet ditt</p>
                </div>
              </div>
              <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-6 space-y-3 overflow-y-auto flex-1">
              {/* Invitation rows */}
              <AnimatePresence mode="popLayout">
                {rows.map((row, index) => (
                  <motion.div
                    key={row.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    layout
                    className="flex items-center gap-3"
                  >
                    {/* Email input */}
                    <div className="flex-1 relative">
                      <input
                        type="email"
                        value={row.email}
                        onChange={(e) => updateRow(row.id, 'email', e.target.value)}
                        placeholder="navn@eksempel.no"
                        className={cn(
                          "w-full px-4 py-3 rounded-xl border-2 transition-all text-sm",
                          "focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                          row.email && !isValidEmail(row.email)
                            ? "border-red-300 bg-red-50"
                            : row.email && isValidEmail(row.email)
                            ? "border-emerald-300 bg-emerald-50/50"
                            : "border-gray-200"
                        )}
                        autoFocus={index === rows.length - 1 && rows.length > 1}
                      />
                      {row.email && isValidEmail(row.email) && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Check className="h-4 w-4 text-emerald-500" />
                        </div>
                      )}
                    </div>

                    {/* Role dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setOpenRoleDropdown(openRoleDropdown === row.id ? null : row.id)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-3 rounded-xl border-2 bg-white text-sm font-medium transition-all min-w-[130px]",
                          "focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                          openRoleDropdown === row.id ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <span className={cn(
                          "p-1 rounded-md",
                          row.role === 'admin' ? "bg-amber-100" : "bg-blue-100"
                        )}>
                          {row.role === 'admin' ? (
                            <Crown className="h-3.5 w-3.5 text-amber-600" />
                          ) : (
                            <User className="h-3.5 w-3.5 text-blue-600" />
                          )}
                        </span>
                        <span className="text-gray-700 flex-1 text-left">
                          {row.role === 'admin' ? 'Admin' : 'Medlem'}
                        </span>
                        <ChevronDown className={cn(
                          "h-4 w-4 text-gray-400 transition-transform",
                          openRoleDropdown === row.id && "rotate-180"
                        )} />
                      </button>

                      {openRoleDropdown === row.id && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-lg z-10 overflow-hidden">
                          <button
                            type="button"
                            onClick={() => {
                              updateRow(row.id, 'role', 'member');
                              setOpenRoleDropdown(null);
                            }}
                            className={cn(
                              "w-full flex items-center gap-2 px-3 py-2.5 text-sm transition-colors",
                              row.role === 'member' ? "bg-blue-50" : "hover:bg-gray-50"
                            )}
                          >
                            <span className="p-1 rounded-md bg-blue-100">
                              <User className="h-3.5 w-3.5 text-blue-600" />
                            </span>
                            <span className="font-medium text-gray-700">Medlem</span>
                            {row.role === 'member' && (
                              <Check className="h-4 w-4 text-blue-600 ml-auto" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              updateRow(row.id, 'role', 'admin');
                              setOpenRoleDropdown(null);
                            }}
                            className={cn(
                              "w-full flex items-center gap-2 px-3 py-2.5 text-sm transition-colors",
                              row.role === 'admin' ? "bg-amber-50" : "hover:bg-gray-50"
                            )}
                          >
                            <span className="p-1 rounded-md bg-amber-100">
                              <Crown className="h-3.5 w-3.5 text-amber-600" />
                            </span>
                            <span className="font-medium text-gray-700">Admin</span>
                            {row.role === 'admin' && (
                              <Check className="h-4 w-4 text-amber-600 ml-auto" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      disabled={rows.length === 1}
                      className={cn(
                        "p-2 rounded-lg transition-all",
                        rows.length === 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                      )}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Add row button */}
              <motion.button
                type="button"
                onClick={addRow}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Plus className="h-4 w-4" />
                Legg til medlem
              </motion.button>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between flex-shrink-0">
              <div className="text-sm text-gray-500">
                {validCount > 0 ? (
                  <span className="text-blue-600 font-medium">
                    {validCount} {validCount === 1 ? 'invitasjon' : 'invitasjoner'} klar
                  </span>
                ) : (
                  <span>Fyll inn e-postadresser</span>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  disabled={validCount === 0}
                  className={cn(
                    "px-5 py-2.5 rounded-xl text-sm font-medium transition-all inline-flex items-center gap-2",
                    validCount > 0
                      ? "bg-gradient-to-r from-[#2C64E3] to-[#5A8DF8] text-white hover:from-[#1F49C6] hover:to-[#4A81EB] shadow-lg shadow-blue-500/25"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  )}
                >
                  <Send className="h-4 w-4" />
                  Send invitasjon{validCount > 1 ? 'er' : ''}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function TeamTab() {
  const { mode, isAdmin: isOrgAdmin, currentUserId } = useDemoUser();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [members, setMembers] = useState(mockOrganization.members);
  const [pendingInvitations, setPendingInvitations] = useState(mockOrganization.pendingInvitations);
  const [cancelConfirmId, setCancelConfirmId] = useState<string | null>(null);

  // Get current user from members
  const currentUser = members.find(m => m.id === currentUserId) || members[0];

  const handleInvite = (invitations: { email: string; role: 'admin' | 'member' }[]) => {
    const newInvitations = invitations.map((inv, index) => ({
      id: `inv-${Date.now()}-${index}`,
      email: inv.email,
      role: inv.role,
      invitedBy: currentUser?.name || 'Ukjent',
      invitedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }));

    setPendingInvitations([...pendingInvitations, ...newInvitations]);

    if (invitations.length === 1) {
      toast.success(`Invitasjon sendt til ${invitations[0].email}`);
    } else {
      toast.success(`${invitations.length} invitasjoner sendt!`);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    setMembers(members.filter(m => m.id !== memberId));
    toast.success('Medlem fjernet fra organisasjonen');
  };

  const handleChangeRole = (memberId: string, newRole: 'admin' | 'member') => {
    setMembers(members.map(m => m.id === memberId ? { ...m, role: newRole } : m));
    toast.success(`Rolle endret til ${newRole === 'admin' ? 'administrator' : 'medlem'}`);
  };

  const handleCancelInvitation = (invitationId: string) => {
    setPendingInvitations(pendingInvitations.filter(i => i.id !== invitationId));
    toast.success('Invitasjon kansellert');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <Building className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">{mockOrganization.name}</h2>
            <p className="text-gray-600">{members.length} medlemmer{pendingInvitations.length > 0 && ` • ${pendingInvitations.length} ventende`}</p>
          </div>
        </div>
        {isOrgAdmin && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="button-primary inline-flex items-center"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Inviter medlem
          </button>
        )}
      </div>

      {/* Info banner for non-admins */}
      {!isOrgAdmin && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800">
                Du ser en oversikt over teamet ditt. Kontakt en administrator hvis du trenger å gjøre endringer.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Members */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold flex items-center">
            <Users className="h-5 w-5 mr-2 text-gray-400" />
            Teammedlemmer
          </h3>
          {isOrgAdmin && (
            <span className="text-sm text-gray-500">{members.length} / {mockOrganization.maxMembers} plasser</span>
          )}
        </div>
        <div className="divide-y divide-gray-50">
          {members.map((member) => (
            <MemberCardReadOnly
              key={member.id}
              member={member}
              isCurrentUser={member.id === currentUserId}
              showActions={isOrgAdmin}
              onRemove={() => handleRemoveMember(member.id)}
              onChangeRole={(role) => handleChangeRole(member.id, role)}
            />
          ))}
        </div>
      </div>

      {/* Pending Invitations - only for admins */}
      {isOrgAdmin && pendingInvitations.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold flex items-center">
              <Mail className="h-5 w-5 mr-2 text-gray-400" />
              Ventende invitasjoner
            </h3>
          </div>
          <div className="divide-y divide-gray-50">
            {pendingInvitations.map((invitation) => (
              <div key={invitation.id} className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="font-medium">{invitation.email}</div>
                    <div className="text-sm text-gray-500">
                      Invitert av {invitation.invitedBy} • {invitation.role === 'admin' ? 'Administrator' : 'Medlem'}
                    </div>
                  </div>
                </div>

                {cancelConfirmId === invitation.id ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-sm text-gray-600 mr-1">Avbryte invitasjon?</span>
                    <button
                      onClick={() => {
                        handleCancelInvitation(invitation.id);
                        setCancelConfirmId(null);
                      }}
                      className="px-3 py-1.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                    >
                      Ja, avbryt
                    </button>
                    <button
                      onClick={() => setCancelConfirmId(null)}
                      className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Nei
                    </button>
                  </motion.div>
                ) : (
                  <button
                    onClick={() => setCancelConfirmId(invitation.id)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Avbryt
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <InviteMemberModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onInvite={handleInvite}
      />
    </div>
  );
}

// Integration Card Component
interface IntegrationCardProps {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  name: string;
  description: string;
  connected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  status?: string;
}

function IntegrationCard({
  icon: Icon,
  iconBg,
  iconColor,
  name,
  description,
  connected,
  onConnect,
  onDisconnect,
  status
}: IntegrationCardProps) {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
      <div className="flex items-center space-x-4">
        <div className={cn("p-3 rounded-xl", iconBg)}>
          <Icon className={cn("h-6 w-6", iconColor)} />
        </div>
        <div>
          <h3 className="font-medium">{name}</h3>
          <p className="text-sm text-gray-600">{description}</p>
          {connected && status && (
            <p className="text-xs text-green-600 mt-1">{status}</p>
          )}
        </div>
      </div>
      {connected ? (
        <button
          onClick={onDisconnect}
          className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
        >
          Koble fra
        </button>
      ) : (
        <button
          onClick={onConnect}
          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors"
        >
          Koble til
        </button>
      )}
    </div>
  );
}

// Integrations Tab
function IntegrationsTab() {
  const [googleConnected, setGoogleConnected] = useState(true);
  const [microsoftConnected, setMicrosoftConnected] = useState(false);

  return (
    <div className="space-y-6">
      {/* Personal Integrations */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold">Mine integrasjoner</h2>
          <p className="text-sm text-gray-600 mt-1">Koble til kalenderen din for automatisk møtesynkronisering</p>
        </div>
        <div className="p-6 space-y-4">
          <IntegrationCard
            icon={Calendar}
            iconBg="bg-red-50"
            iconColor="text-red-600"
            name="Google Calendar"
            description="Synkroniser møter automatisk fra Google Calendar"
            connected={googleConnected}
            status="Synkronisert med demo@notably.no"
            onConnect={() => { setGoogleConnected(true); toast.success('Google Calendar koblet til'); }}
            onDisconnect={() => { setGoogleConnected(false); toast.success('Google Calendar frakoblet'); }}
          />
          <IntegrationCard
            icon={Calendar}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            name="Microsoft 365"
            description="Synkroniser møter fra Outlook og Teams"
            connected={microsoftConnected}
            onConnect={() => { setMicrosoftConnected(true); toast.success('Microsoft 365 koblet til'); }}
            onDisconnect={() => { setMicrosoftConnected(false); toast.success('Microsoft 365 frakoblet'); }}
          />
        </div>
      </div>
    </div>
  );
}

// Security Tab
function SecurityTab() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteAccount = () => {
    toast.error('Kontoen din er slettet. Du blir nå logget ut.');
    setShowDeleteConfirm(false);
  };

  return (
    <div className="space-y-6">
      {/* Password */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold">Passord</h2>
        </div>
        <div className="p-6">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Lock className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="font-medium">Endre passord</h3>
                <p className="text-sm text-gray-600">Oppdater ditt påloggingspassord</p>
              </div>
            </div>
            <ChevronLeft className="h-5 w-5 text-gray-400 rotate-180" />
          </button>
        </div>
      </div>

      {/* Privacy & Data */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold">Personvern og data</h2>
        </div>
        <div className="p-6 space-y-4">
          <Link
            to="/privacy"
            className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="font-medium">Personvernerklæring</h3>
                <p className="text-sm text-gray-600">Les hvordan vi behandler dine data</p>
              </div>
            </div>
            <ExternalLink className="h-5 w-5 text-gray-400" />
          </Link>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-red-600">Faresone</h2>
        </div>
        <div className="p-6">
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center justify-between p-4 rounded-lg border border-red-200 hover:border-red-300 hover:bg-red-50/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-red-700">Slett konto</h3>
                  <p className="text-sm text-red-600">Slett permanent din konto og alle data</p>
                </div>
              </div>
              <ChevronLeft className="h-5 w-5 text-red-400 rotate-180" />
            </button>
          ) : (
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h3 className="font-medium text-red-700 mb-2">Er du sikker?</h3>
              <p className="text-sm text-red-600 mb-4">
                Denne handlingen kan ikke angres. Alle dine opptak, transkripsjoner og data vil bli permanent slettet.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Avbryt
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium"
                >
                  Ja, slett kontoen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
}

// Main Settings Page
export default function SettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';
  const { mode, isSolo, isInOrganization } = useDemoUser();

  const handleTabChange = (tabId: string) => {
    setSearchParams({ tab: tabId });
  };

  // Filter tabs based on user mode
  const visibleTabs = tabs.filter(tab => {
    // Hide Team tab for Solo users
    if (tab.id === 'team' && isSolo) {
      return false;
    }
    return true;
  });

  // If Solo user tries to access Team tab, redirect to profile
  const effectiveTab = (activeTab === 'team' && isSolo) ? 'profile' : activeTab;

  const renderTabContent = () => {
    switch (effectiveTab) {
      case 'profile':
        return <ProfileTab />;
      case 'preferences':
        return <PreferencesTab />;
      case 'billing':
        return <BillingTab />;
      case 'team':
        return <TeamTab />;
      case 'integrations':
        return <IntegrationsTab />;
      case 'security':
        return <SecurityTab />;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-gray-50 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Tilbake til dashboard
          </Link>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-100 rounded-xl">
              <SettingsIcon className="h-6 w-6 text-slate-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Innstillinger</h1>
              <p className="text-gray-600">
                {isSolo ? 'Administrer profil og preferanser' : 'Administrer profil, preferanser og team'}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6 p-1">
          <div className="flex space-x-1 overflow-x-auto">
            {visibleTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                    effectiveTab === tab.id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content - key forces re-render when demo user mode changes */}
        <div key={mode}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
