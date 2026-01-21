import { useState } from 'react';
import { Check, ArrowRight, Sparkles, Mail, X, Phone, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { validateEmail } from '@/lib/onboardingValidation';
import { cn } from '@/lib/utils';

const planFeatures = [
  'Ubegrensede møteopptak',
  'AI-drevne møtereferater',
  'Søk i alle møter',
  'Kalenderintegrasjon (Google & Outlook)',
  'Eksport til PDF og Word'
];

export default function PlanStep() {
  const { state, updateUserData, goToNextStep } = useOnboarding();
  const [emailInput, setEmailInput] = useState('');
  const [contactInfo, setContactInfo] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    message: '',
    additionalInfo: ''
  });

  const accountType = state.userData.accountType;
  const teamSize = state.userData.teamSize;
  const pricePerUser = 399;
  const totalMonthlyPrice = accountType === 'solo' ? pricePerUser : teamSize * pricePerUser;

  const handleAddTeamMember = () => {
    if (emailInput && validateEmail(emailInput)) {
      if (!state.userData.teamInvites.includes(emailInput)) {
        updateUserData({
          teamInvites: [...state.userData.teamInvites, emailInput]
        });
        setEmailInput('');
      }
    }
  };

  const handleRemoveTeamMember = (email: string) => {
    updateUserData({
      teamInvites: state.userData.teamInvites.filter(e => e !== email)
    });
  };

  const handleEmailInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTeamMember();
    }
  };

  const handleContinue = () => {
    // Save enterprise contact info to userData before proceeding
    if (accountType === 'enterprise') {
      updateUserData({
        fullName: contactInfo.contactPerson,
        email: contactInfo.email
      });
    }
    goToNextStep();
  };

  // Reusable Features List Component
  const FeaturesList = () => (
    <ul className="space-y-4">
      {planFeatures.map((feature, index) => (
        <motion.li
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-start text-gray-700 hover:bg-gray-50 hover:pl-2 transition-all rounded-lg p-2 -ml-2"
        >
          <Check className="h-6 w-6 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
          <span>{feature}</span>
        </motion.li>
      ))}
    </ul>
  );

  // Enterprise Plan - Contact Us Form
  if (accountType === 'enterprise') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Enterprise-løsning
          </h2>
          <p className="text-gray-600">
            Vi skreddersyr en løsning perfekt for deres organisasjon
          </p>
        </div>

        <div className="onboarding-step">
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Left Column - Contact Form */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <p className="text-sm text-gray-600 mb-6">
                Fyll ut informasjonen under så kontakter vi deg innen 24 timer for å diskutere deres behov.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bedriftsnavn
                  </label>
                  <input
                    type="text"
                    value={contactInfo.companyName}
                    onChange={(e) => setContactInfo({ ...contactInfo, companyName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Bedrift AS"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Navn på kontaktperson
                  </label>
                  <input
                    type="text"
                    value={contactInfo.contactPerson}
                    onChange={(e) => setContactInfo({ ...contactInfo, contactPerson: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ola Nordmann"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-postadresse
                  </label>
                  <input
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ola@bedrift.no"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefonnummer
                  </label>
                  <input
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+47 123 45 678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Antall brukere (ca.)
                  </label>
                  <input
                    type="text"
                    value={contactInfo.message}
                    onChange={(e) => setContactInfo({ ...contactInfo, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Hvor mange i teamet deres?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fortell oss mer om dine behov <span className="text-gray-500 font-normal">(valgfritt)</span>
                  </label>
                  <textarea
                    rows={4}
                    value={contactInfo.additionalInfo || ''}
                    onChange={(e) => setContactInfo({ ...contactInfo, additionalInfo: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Beskriv gjerne spesifikke krav eller andre behov som kan være relevante for din organisasjon..."
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Enterprise Benefits */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Enterprise-fordeler
                </h3>
                <ul className="space-y-3">
                  {[
                    'Dedikert kundekontakt',
                    'Prioritert support',
                    'Skreddersydd onboarding',
                    'SLA-avtale',
                    'Fakturering og fleksible betalingsvilkår'
                  ].map((benefit, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start text-gray-700"
                    >
                      <Check className="h-5 w-5 text-blue-700 mr-3 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Security & Compliance - Enhanced Cards */}
              <div className="pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-6">
                  Sikkerhet & Compliance
                </h4>
                <div className="space-y-6">
                  {[
                    {
                      icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      ),
                      title: 'GDPR-compliant',
                      description: 'Fullt i tråd med EUs personvernforordning'
                    },
                    {
                      icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ),
                      title: 'Data i Europa',
                      description: 'All data lagres trygt på europeiske servere'
                    },
                    {
                      icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      ),
                      title: 'Roller og tilgangsstyring',
                      description: 'Granulær RBAC for full kontroll'
                    }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="p-6 bg-gradient-to-br from-green-50 to-emerald-50/50 rounded-xl border border-green-200/60 hover:border-green-300 transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 p-2.5 bg-green-100 rounded-lg text-green-700">
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-semibold text-green-900 mb-1">
                            {item.title}
                          </h5>
                          <p className="text-xs text-green-700/80 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="space-y-2">
            <button
              onClick={handleContinue}
              disabled={!contactInfo.companyName || !contactInfo.contactPerson || !contactInfo.email || !contactInfo.phone}
              className={cn(
                'w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all',
                contactInfo.companyName && contactInfo.contactPerson && contactInfo.email && contactInfo.phone
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:scale-105 hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              )}
            >
              <span>Send forespørsel</span>
              <ArrowRight className="h-5 w-5" />
            </button>

            <p className="text-xs text-center text-gray-500">
              Vi kontakter deg innen 24 timer på hverdager
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Solo & Business Plan
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto"
    >
      <div className="onboarding-step">
        {/* Centered Header - Above Everything */}
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {accountType === 'business' ? 'Bedrift' : 'Din plan'}
          </h2>
          <div className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-full border border-blue-200">
            <Sparkles className="h-3.5 w-3.5 text-blue-600 mr-1.5" />
            <span className="text-xs font-bold text-gray-700">
              {state.planData.trialDays} dagers gratis prøveperiode
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 mb-10">
          {/* Left Column - Pricing Card */}
          <div className={cn(
            "bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-8",
            accountType !== 'business' && "flex items-center justify-center"
          )}>
            <div className="w-full">
              {/* Pricing Display - Primary Focus */}
              <div className={cn(
                "text-center",
                accountType === 'business' ? "mb-8" : "py-8"
              )}>
                {accountType === 'business' ? (
                  <div className="flex items-center justify-center gap-4 mb-3">
                    <span className="text-4xl font-bold text-gray-900 tracking-tight">{teamSize}</span>
                    <span className="text-3xl font-bold text-gray-400">×</span>
                    <div className="text-left">
                      <div className="text-7xl font-bold text-gray-900 tracking-tight">
                        {pricePerUser} <span className="text-2xl text-gray-500 font-semibold">kr</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-7xl font-bold text-gray-900 mb-3 tracking-tight">
                    {pricePerUser} <span className="text-2xl text-gray-500 font-semibold">kr</span>
                  </div>
                )}
                <div className="text-sm text-gray-600 mb-4">
                  per måned
                </div>
                <div className="inline-flex items-center text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-4 py-2 rounded-full">
                  <Check className="h-3.5 w-3.5 mr-1.5 text-green-600" />
                  {accountType === 'business'
                    ? 'Fleksibelt antall brukere'
                    : 'Ingen binding'}
                </div>
              </div>

              {/* Team Size Selector for Business - More Compact */}
              {accountType === 'business' && (
                <div className="pt-10 border-t border-gray-200">
                  <label className="block text-center text-xs font-medium text-gray-600 mb-3">
                    Antall brukere
                  </label>

                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => teamSize > 2 && updateUserData({ teamSize: teamSize - 1 })}
                      disabled={teamSize <= 2}
                      className={cn(
                        'w-9 h-9 rounded-lg flex items-center justify-center text-base font-semibold transition-all',
                        teamSize > 2
                          ? 'bg-gray-50 border border-gray-300 text-gray-700 hover:bg-gray-100'
                          : 'bg-gray-50 border border-gray-200 text-gray-400 cursor-not-allowed'
                      )}
                    >
                      −
                    </button>

                    <div className="mx-6 text-center min-w-[60px]">
                      <div className="text-3xl font-bold text-gray-900">
                        {teamSize}
                      </div>
                    </div>

                    <button
                      onClick={() => teamSize < 19 && updateUserData({ teamSize: teamSize + 1 })}
                      disabled={teamSize >= 19}
                      className={cn(
                        'w-9 h-9 rounded-lg flex items-center justify-center text-base font-semibold transition-all',
                        teamSize < 19
                          ? 'bg-gray-50 border border-gray-300 text-gray-700 hover:bg-gray-100'
                          : 'bg-gray-50 border border-gray-200 text-gray-400 cursor-not-allowed'
                      )}
                    >
                      +
                    </button>
                  </div>

                  {teamSize >= 20 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-center"
                    >
                      <p className="text-xs text-blue-900 font-medium">
                        For team med 20+ brukere anbefaler vi Enterprise
                      </p>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Features */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-6">
              Alt du trenger
            </h4>
            <FeaturesList />
          </div>
        </div>

        {/* Continue Button - Centered Below Grid */}
        <div className="space-y-2">
          <button
            onClick={handleContinue}
            className="w-full flex items-center justify-center space-x-2 text-base py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:scale-[1.02] transition-transform shadow-lg hover:shadow-xl"
          >
            <span>Start prøveperiode</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        {/* Features for Mobile - Shown Below Grid */}
        <div className="lg:hidden mt-6">
          <h4 className="font-semibold text-gray-900 mb-4">Inkludert:</h4>
          <FeaturesList />
        </div>
      </div>
    </motion.div>
  );
}
