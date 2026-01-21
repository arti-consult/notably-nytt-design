import { Sparkles, Check, Calendar, Shield, ArrowRight, Users, Mail, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

export default function CompleteStep() {
  const navigate = useNavigate();
  const { state, resetOnboarding } = useOnboarding();
  const [countdown, setCountdown] = useState(15);

  const accountType = state.userData.accountType;

  // Auto-redirect to dashboard after 15 seconds for solo/business users
  useEffect(() => {
    if (accountType !== 'enterprise' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (accountType !== 'enterprise' && countdown === 0) {
      handleGoToDashboard();
    }
  }, [countdown, accountType]);

  const handleGoToDashboard = () => {
    resetOnboarding();
    navigate('/dashboard');
  };

  const handleGoToHome = () => {
    resetOnboarding();
    navigate('/');
  };

  // Enterprise Completion
  if (accountType === 'enterprise') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto mt-16"
      >
        <div className="onboarding-step text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
          >
            <Building2 className="h-12 w-12 text-white" strokeWidth={2.5} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Vi kontakter deg snart! 🎉
            </h2>
            <p className="text-xl text-gray-600 mb-2">
              Hei, {state.userData.fullName}!
            </p>
            <p className="text-gray-600">
              Takk for din interesse i Notably Enterprise
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 space-y-4"
          >
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
                Hva skjer nå?
              </h3>
              <ul className="space-y-3">
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-start text-gray-700"
                >
                  <span className="font-bold text-blue-600 mr-3">1.</span>
                  <span>En av våre salgsrepresentanter kontakter deg innen <strong>24 timer</strong></span>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                  className="flex items-start text-gray-700"
                >
                  <span className="font-bold text-blue-600 mr-3">2.</span>
                  <span>Vi diskuterer deres behov og skreddersyr en løsning</span>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 }}
                  className="flex items-start text-gray-700"
                >
                  <span className="font-bold text-blue-600 mr-3">3.</span>
                  <span>Vi setter opp alt og hjelper teamet deres i gang</span>
                </motion.li>
              </ul>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            onClick={handleGoToHome}
            className="button-primary w-full flex items-center justify-center space-x-2 text-lg py-4 mt-6"
          >
            <span>Tilbake til hovedside</span>
            <ArrowRight className="h-6 w-6" />
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // Solo & Business Completion
  const setupSummary = [
    {
      icon: Check,
      label: 'Konto opprettet',
      value: state.userData.email,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Sparkles,
      label: 'Prøveperiode startet',
      value: `${state.planData.trialDays} dager gratis`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Calendar,
      label: 'Kalender',
      value: state.calendarData.googleConnected
        ? 'Google Kalender tilkoblet'
        : state.calendarData.outlookConnected
        ? 'Outlook Kalender tilkoblet'
        : 'Ikke tilkoblet',
      color: state.calendarData.googleConnected || state.calendarData.outlookConnected ? 'text-blue-600' : 'text-gray-600',
      bgColor: state.calendarData.googleConnected || state.calendarData.outlookConnected ? 'bg-blue-100' : 'bg-gray-100'
    },
    {
      icon: Shield,
      label: 'Personvern',
      value: 'Samtykke gitt',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ];

  // Add team size and invites summary for business accounts
  if (accountType === 'business') {
    const teamSize = state.userData.teamSize;
    const invitesCount = state.userData.teamInvites.length;
    const teamValue = invitesCount > 0
      ? `${teamSize} seter • ${invitesCount} invitert`
      : `${teamSize} seter`;

    setupSummary.push({
      icon: Users,
      label: 'Team',
      value: teamValue,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto mt-16"
    >
      <div className="onboarding-step text-center">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
        >
          <Check className="h-12 w-12 text-white" strokeWidth={3} />
        </motion.div>

        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Velkommen til Notably! 🎉
          </h2>
          <p className="text-xl text-gray-600 mb-2">
            Hei, {state.userData.fullName}!
          </p>
          <p className="text-gray-600">
            {accountType === 'business'
              ? 'Din teamkonto er klar, og dere er all set til å komme i gang'
              : 'Din konto er klar, og du er all set til å komme i gang'}
          </p>
        </motion.div>

        {/* Setup Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 mb-8 space-y-3"
        >
          {setupSummary.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200"
            >
              <div className={`w-10 h-10 ${item.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-600">{item.value}</p>
              </div>
              <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
            </motion.div>
          ))}
        </motion.div>

        {/* Team Invites Confirmation for Business */}
        {accountType === 'business' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className={cn(
              "border-2 rounded-xl p-6 mb-6 text-left",
              state.userData.teamInvites.length > 0
                ? "bg-blue-50 border-blue-200"
                : "bg-gray-50 border-gray-200"
            )}
          >
            {state.userData.teamInvites.length > 0 ? (
              <>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-blue-600" />
                  Invitasjoner sendt
                </h3>
                <div className="space-y-2">
                  {state.userData.teamInvites.map((email, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-700">
                      <Check className="h-4 w-4 text-green-600 mr-2" />
                      <span>{email}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-600 mt-3">
                  Teammedlemmene dine har mottatt en invitasjon på e-post. Du har {state.userData.teamSize - state.userData.teamInvites.length} seter igjen.
                </p>
              </>
            ) : (
              <>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-gray-600" />
                  Du har {state.userData.teamSize} seter
                </h3>
                <p className="text-sm text-gray-600">
                  Du kan invitere teammedlemmer når som helst fra innstillingene
                </p>
              </>
            )}
          </motion.div>
        )}

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 mb-6 text-left"
        >
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
            Neste steg
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">1️⃣</span>
              <span>Utforsk dashbordet og bli kjent med funksjonene</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">2️⃣</span>
              <span>
                {state.calendarData.googleConnected || state.calendarData.outlookConnected
                  ? 'Møtene dine vil automatisk synkroniseres'
                  : 'Koble til kalender i innstillingene for automatisk synkronisering'}
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">3️⃣</span>
              <span>
                {accountType === 'business'
                  ? 'Vente på at teammedlemmer aksepterer invitasjonen'
                  : 'Start ditt første møte og test AI-referatene'}
              </span>
            </li>
          </ul>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          onClick={handleGoToDashboard}
          className="button-primary w-full flex items-center justify-center space-x-2 text-lg py-4"
        >
          <span>Gå til dashbordet</span>
          <ArrowRight className="h-6 w-6" />
        </motion.button>

        {/* Countdown text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7 }}
          className="text-center text-sm text-gray-500 mt-3"
        >
          Du blir automatisk sendt til dashbordet om {countdown} sekunder
        </motion.p>
      </div>
    </motion.div>
  );
}
