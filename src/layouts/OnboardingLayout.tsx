import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingProgressBar from '@/components/onboarding/OnboardingProgressBar';
import ChatWidget from '@/components/onboarding/ChatWidget';
import { useOnboarding } from '@/contexts/OnboardingContext';

interface OnboardingLayoutProps {
  children: ReactNode;
  showProgress?: boolean;
}

export default function OnboardingLayout({ children, showProgress = true }: OnboardingLayoutProps) {
  const { state } = useOnboarding();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            {/* Logo */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <img src="/notably-logo.png" alt="Notably" className="h-8" />
            </button>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      {showProgress && (
        <OnboardingProgressBar
          currentStep={state.currentStep}
          completedSteps={state.completedSteps}
          accountType={state.userData.accountType}
        />
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {children}
      </main>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}
