import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import OnboardingLayout from '@/layouts/OnboardingLayout';
import { OnboardingProvider, useOnboarding } from '@/contexts/OnboardingContext';
import AccountTypeStep from '@/components/onboarding/AccountTypeStep';
import RegisterStep from '@/components/onboarding/RegisterStep';
import PlanStep from '@/components/onboarding/PlanStep';
import CalendarStep from '@/components/onboarding/CalendarStep';
import ConsentStep from '@/components/onboarding/ConsentStep';
import TeamInviteStep from '@/components/onboarding/TeamInviteStep';
import CompleteStep from '@/components/onboarding/CompleteStep';

function OnboardingContent() {
  const { state, canAccessStep, setCurrentStep } = useOnboarding();
  const navigate = useNavigate();

  useEffect(() => {
    // Validate access to current step
    if (!canAccessStep(state.currentStep)) {
      // Redirect to first accessible step
      for (let step = 1; step <= 7; step++) {
        if (canAccessStep(step as any)) {
          setCurrentStep(step as any);
          break;
        }
      }
    }
  }, [state.currentStep, canAccessStep, setCurrentStep]);

  const renderStep = () => {
    const accountType = state.userData.accountType;

    switch (state.currentStep) {
      case 1:
        return <AccountTypeStep />;
      case 2:
        // Enterprise: show PlanStep (contact form)
        // Solo/Business: show RegisterStep
        return accountType === 'enterprise' ? <PlanStep /> : <RegisterStep />;
      case 3:
        return <PlanStep />;
      case 4:
        return <CalendarStep />;
      case 5:
        return <ConsentStep />;
      case 6:
        // NEW: Team invite step (business only)
        return <TeamInviteStep />;
      case 7:
        return <CompleteStep />;
      default:
        return <AccountTypeStep />;
    }
  };

  return (
    <OnboardingLayout showProgress={state.currentStep !== 7}>
      <AnimatePresence mode="wait">
        <motion.div
          key={state.currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </OnboardingLayout>
  );
}

export default function OnboardingPage() {
  return (
    <OnboardingProvider>
      <OnboardingContent />
    </OnboardingProvider>
  );
}
