import { Shield, ArrowRight, FileText, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { cn } from '@/lib/utils';

export default function ConsentStep() {
  const { state, updateConsentData, goToNextStep } = useOnboarding();

  const handleConsentChange = (value: boolean) => {
    updateConsentData({
      recordingConsent: value,
      consentDate: value ? new Date().toISOString() : null
    });
  };

  const handleContinue = () => {
    if (state.consentData.recordingConsent) {
      goToNextStep();
    }
  };

  const canContinue = state.consentData.recordingConsent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="h-8 w-8 text-green-600" />
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Personvern og samtykke
        </h2>
        <p className="text-gray-600">
          Vi tar ditt personvern på alvor
        </p>
      </div>

      <div className="onboarding-step">
        {/* Privacy Information */}
        <div className="space-y-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Lock className="h-5 w-5 mr-2 text-blue-600" />
              Hvordan vi beskytter dataene dine
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>All data krypteres med industristandarder (AES-256)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Møteopptak lagres sikkert i Europa (GDPR-kompatibelt)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Du kontrollerer hvem som har tilgang til dine møter</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Du kan slette alle dine data når som helst</span>
              </li>
            </ul>
          </div>

          {/* Recording Consent */}
          <div className="border-2 border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Opptak og transkribering
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              Notably vil ta opp og transkribere møtene dine for å generere AI-drevne referater.
              Alle deltakere vil bli informert når et møte tas opp.
            </p>

            <label className="flex items-start space-x-3 cursor-pointer p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={state.consentData.recordingConsent}
                onChange={(e) => handleConsentChange(e.target.checked)}
                className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="font-medium text-gray-900">
                  Jeg godtar at møter kan tas opp og transkriberes
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className={cn(
            'w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all',
            canContinue
              ? 'button-primary'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          )}
        >
          <span>Fortsett</span>
          <ArrowRight className="h-5 w-5" />
        </button>

        {!canContinue && (
          <p className="text-sm text-center text-gray-500 mt-3">
            Du må godta samtykket for å fortsette
          </p>
        )}

        {/* Privacy Policy Link */}
        <div className="flex items-center justify-center space-x-4 mt-6 text-sm">
          <a
            href="#"
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
          >
            <FileText className="h-4 w-4" />
            <span>Personvernerklæring</span>
          </a>
          <span className="text-gray-300">|</span>
          <a
            href="#"
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
          >
            <FileText className="h-4 w-4" />
            <span>Vilkår for bruk</span>
          </a>
        </div>

        {state.consentData.consentDate && (
          <p className="text-xs text-center text-gray-500 mt-4">
            Samtykke gitt: {new Date(state.consentData.consentDate).toLocaleString('no')}
          </p>
        )}
      </div>
    </motion.div>
  );
}
