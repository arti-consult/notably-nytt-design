import { useState } from 'react';
import { Users, Mail, Check, X, ArrowRight, UserPlus, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { validateEmail } from '@/lib/onboardingValidation';
import { cn } from '@/lib/utils';

export default function TeamInviteStep() {
  const { state, updateUserData, goToNextStep } = useOnboarding();
  const [emailInput, setEmailInput] = useState('');
  const [error, setError] = useState('');

  const teamSize = state.userData.teamSize;
  const invitedEmails = state.userData.teamInvites;
  const userEmail = state.userData.email;
  const occupiedSeats = 1 + invitedEmails.length; // User + invites
  const availableSeats = teamSize - occupiedSeats;

  const handleAddInvite = () => {
    setError('');

    // Validation
    if (!emailInput) {
      setError('Vennligst skriv inn en e-postadresse');
      return;
    }

    if (!validateEmail(emailInput)) {
      setError('Ugyldig e-postadresse');
      return;
    }

    if (emailInput.toLowerCase() === userEmail.toLowerCase()) {
      setError('Du kan ikke invitere deg selv');
      return;
    }

    if (invitedEmails.includes(emailInput)) {
      setError('Denne e-postadressen er allerede invitert');
      return;
    }

    if (occupiedSeats >= teamSize) {
      setError('Alle seter er fylt');
      return;
    }

    // Add invite
    updateUserData({
      teamInvites: [...invitedEmails, emailInput]
    });
    setEmailInput('');
  };

  const handleRemoveInvite = (email: string) => {
    updateUserData({
      teamInvites: invitedEmails.filter(e => e !== email)
    });
    setError('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddInvite();
    }
  };

  const handleContinue = () => {
    goToNextStep();
  };

  const handleSkip = () => {
    goToNextStep();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="h-8 w-8 text-blue-600" />
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Inviter teammedlemmer
        </h2>
        <p className="text-gray-600">
          Fyll ut teamet ditt med kolleger som skal bruke Notably
        </p>
      </div>

      <div className="onboarding-step">
        {/* Seat Visualization */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Dine seter</h3>
            <span className="text-sm text-gray-600">
              {occupiedSeats} av {teamSize} seter fylt
            </span>
          </div>

          {/* Seat Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
            {/* User's Seat - Always First */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-500 rounded-xl p-4 text-center"
            >
              <Check className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-xs font-medium text-gray-900 truncate">Du</p>
              <p className="text-xs text-gray-600 truncate">{userEmail}</p>
            </motion.div>

            {/* Invited Seats */}
            {invitedEmails.map((email, index) => (
              <motion.div
                key={email}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + (index + 1) * 0.05 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-500 rounded-xl p-4 text-center"
              >
                <UserPlus className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-900">Invitert</p>
                <p className="text-xs text-gray-600 truncate">{email}</p>
              </motion.div>
            ))}

            {/* Empty Seats */}
            {Array.from({ length: availableSeats }).map((_, index) => (
              <motion.div
                key={`empty-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + (occupiedSeats + index) * 0.05 }}
                className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-4 text-center"
              >
                <div className="h-6 w-6 rounded-full bg-gray-200 mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-500">Ledig</p>
                <p className="text-xs text-gray-400">plass</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Your Seat - Highlighted */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Din plass</p>
              <p className="text-sm text-gray-700 truncate">{userEmail}</p>
            </div>
          </div>
        </div>

        {/* Invite Input */}
        {availableSeats > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Inviter teammedlemmer
            </label>

            <div className="flex space-x-2">
              <div className="flex-1">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    setError('');
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="kollega@bedrift.no"
                  className={cn(
                    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                    error ? 'border-red-500' : 'border-gray-300'
                  )}
                />
                {error && (
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                )}
              </div>

              <button
                onClick={handleAddInvite}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 flex-shrink-0"
              >
                <Mail className="h-5 w-5" />
                <span>Inviter</span>
              </button>
            </div>
          </div>
        )}

        {/* Invited List */}
        {invitedEmails.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Inviterte teammedlemmer ({invitedEmails.length})
            </h4>
            <div className="space-y-2">
              {invitedEmails.map((email, index) => (
                <motion.div
                  key={email}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-900">{email}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveInvite(email)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-700">
              <p className="font-medium text-gray-900 mb-1">Hva skjer nå?</p>
              <p>Teammedlemmene dine vil motta en e-postinvitasjon med instruksjoner for å bli med i teamet. Du kan også invitere flere senere fra innstillingene.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleContinue}
            className="button-primary w-full flex items-center justify-center space-x-2"
          >
            <span>Fortsett</span>
            <ArrowRight className="h-5 w-5" />
          </button>

          <button
            onClick={handleSkip}
            className="button-secondary w-full"
          >
            Hopp over - inviter senere
          </button>
        </div>

        <p className="text-xs text-center text-gray-500 mt-4">
          Du kan invitere flere teammedlemmer når som helst fra innstillingene
        </p>
      </div>
    </motion.div>
  );
}
