import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  Video,
  Calendar,
  Bell,
  Volume2,
  Lock,
  User,
  Mail,
  Building,
  CheckCircle
} from 'lucide-react';
import ChangePasswordModal from '@/components/ChangePasswordModal';
import { cn } from '@/lib/utils';
import { mockUser } from '@/lib/mockData';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="font-medium">{title}</h2>
      </div>
      {children}
    </div>
  );
}

interface IntegrationCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect?: () => void;
}

function IntegrationCard({
  icon: Icon,
  title,
  description,
  isConnected,
  onConnect,
  onDisconnect
}: IntegrationCardProps) {
  return (
    <div className="flex flex-col p-4 rounded-lg border border-gray-200 hover:border-violet-200 hover:bg-violet-50/50 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-violet-100 rounded-lg">
            <Icon className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center">
          {isConnected && (
            <div className="flex items-center text-green-600 text-sm">
              <CheckCircle className="h-4 w-4 mr-1" />
              Tilkoblet
            </div>
          )}
        </div>
        <button
          onClick={isConnected ? onDisconnect : onConnect}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            isConnected
              ? "bg-red-100 text-red-700 hover:bg-red-200"
              : "bg-violet-100 text-violet-700 hover:bg-violet-200"
          )}
        >
          {isConnected ? 'Koble fra' : 'Koble til'}
        </button>
      </div>
    </div>
  );
}

interface ToggleSettingProps {
  icon: React.ElementType;
  title: string;
  description: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

function ToggleSetting({
  icon: Icon,
  title,
  description,
  enabled,
  onChange
}: ToggleSettingProps) {
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
      <button
        onClick={() => onChange(!enabled)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
          enabled ? "bg-violet-600" : "bg-gray-200"
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

export default function SettingsPage() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Mock Microsoft connection state
  const [isMicrosoftConnected, setIsMicrosoftConnected] = useState(false);

  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  // Mock connect/disconnect
  const handleConnectMicrosoft = () => {
    setIsMicrosoftConnected(true);
  };

  const handleDisconnectMicrosoft = () => {
    setIsMicrosoftConnected(false);
  };

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Tilbake til dashboard
          </Link>
          <h1 className="text-2xl font-semibold">Innstillinger</h1>
        </div>

        {/* Digital Meetings Integration */}
        <SettingsSection title="Digitale møter">
          <div className="relative">
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="text-center">
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-violet-100 text-violet-700 font-medium text-sm">
                  Kommer snart
                </span>
              </div>
            </div>

          <div className="p-4 bg-violet-50 border-b border-violet-100">
            <div className="flex items-start">
              <Video className="h-5 w-5 text-violet-600 mt-1 mr-3" />
              <div>
                <h3 className="font-medium text-violet-900">
                  Automatisk transkripsjon av digitale møter
                </h3>
                <p className="text-sm text-violet-700 mt-1">
                  La Notably automatisk bli med i dine digitale møter og transkribere dem.
                  Koble til din kalender og møteplattform for å komme i gang.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <IntegrationCard
              icon={Calendar}
              title="Microsoft 365 Kalender"
              description="Synkroniser møter fra din Microsoft 365 kalender"
              isConnected={isMicrosoftConnected}
              onConnect={handleConnectMicrosoft}
              onDisconnect={handleDisconnectMicrosoft}
            />
          </div>
          </div>
        </SettingsSection>

        {/* General Settings */}
        <SettingsSection title="Generelt">
          <ToggleSetting
            icon={Bell}
            title="Varslinger"
            description="Motta varsler om nye transkripsjoner og viktige hendelser"
            enabled={notifications}
            onChange={setNotifications}
          />
          <ToggleSetting
            icon={Volume2}
            title="Lydeffekter"
            description="Spill av lydeffekter ved viktige hendelser"
            enabled={soundEffects}
            onChange={setSoundEffects}
          />
        </SettingsSection>

        {/* Profile Settings */}
        <SettingsSection title="Profil">
          <div className="p-4 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-violet-100 flex items-center justify-center">
                <User className="h-8 w-8 text-violet-600" />
              </div>
              <div>
                <h3 className="font-medium">{mockUser.email}</h3>
                <button className="text-sm text-violet-600 hover:text-violet-700">
                  Endre profilbilde
                </button>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-post
                </label>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={mockUser.email}
                      disabled
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-600"
                    />
                  </div>
                  <button className="px-4 py-2 text-sm text-violet-600 hover:text-violet-700 font-medium">
                    Endre
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organisasjon
                </label>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      defaultValue={mockUser.organization}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                    />
                  </div>
                  <button className="px-4 py-2 text-sm text-violet-600 hover:text-violet-700 font-medium">
                    Lagre
                  </button>
                </div>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Security Settings */}
        <SettingsSection title="Sikkerhet">
          <div className="p-4 space-y-4">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-violet-200 hover:bg-violet-50/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-violet-100 rounded-lg">
                  <Lock className="h-5 w-5 text-violet-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">Endre passord</h3>
                  <p className="text-sm text-gray-600">Oppdater ditt påloggingspassord</p>
                </div>
              </div>
              <ChevronLeft className="h-5 w-5 text-gray-400 rotate-180" />
            </button>
          </div>
        </SettingsSection>
      </div>

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />

    </div>
  );
}
