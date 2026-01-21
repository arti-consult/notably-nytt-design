import { Check } from 'lucide-react';
import { OnboardingStep, AccountType } from '@/contexts/OnboardingContext';
import { cn } from '@/lib/utils';

interface OnboardingProgressBarProps {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  accountType: AccountType | null;
}

interface StepConfig {
  number: OnboardingStep;
  label: string;
}

const soloSteps: StepConfig[] = [
  { number: 1, label: 'Velg kontotype' },
  { number: 2, label: 'Registrer deg' },
  { number: 3, label: 'Abonnement' },
  { number: 4, label: 'Koble til kalender' },
  { number: 5, label: 'Gi samtykke' }
];

const businessSteps: StepConfig[] = [
  { number: 1, label: 'Velg kontotype' },
  { number: 2, label: 'Registrer deg' },
  { number: 3, label: 'Abonnement' },
  { number: 4, label: 'Koble til kalender' },
  { number: 5, label: 'Gi samtykke' },
  { number: 6, label: 'Inviter' }
];

const enterpriseSteps: StepConfig[] = [
  { number: 1, label: 'Velg kontotype' },
  { number: 2, label: 'Send forespørsel' }
];

export default function OnboardingProgressBar({ currentStep, completedSteps, accountType }: OnboardingProgressBarProps) {
  const steps = accountType === 'enterprise'
    ? enterpriseSteps
    : accountType === 'business'
    ? businessSteps
    : soloSteps;
  const getStepState = (stepNumber: OnboardingStep): 'completed' | 'active' | 'future' => {
    if (completedSteps.includes(stepNumber)) return 'completed';
    if (stepNumber === currentStep) return 'active';
    return 'future';
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => {
          const state = getStepState(step.number);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.number} className="flex-1 flex flex-col items-center relative">
              {/* Connecting line */}
              {!isLast && (
                <div
                  className={cn(
                    'absolute top-5 left-1/2 w-full h-0.5 z-0',
                    completedSteps.includes(steps[index + 1].number)
                      ? 'bg-green-600'
                      : 'bg-gray-300'
                  )}
                />
              )}

              {/* Step circle */}
              <div className="relative z-10 flex flex-col items-center">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-all duration-300',
                    state === 'completed' && 'bg-green-600 text-white',
                    state === 'active' && 'progress-step-active',
                    state === 'future' && 'bg-gray-200 text-gray-500'
                  )}
                >
                  {state === 'completed' ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>

                {/* Step label */}
                <span
                  className={cn(
                    'mt-2 text-xs sm:text-sm font-medium text-center px-2 transition-colors duration-300',
                    state === 'active' && 'text-blue-600',
                    state === 'completed' && 'text-green-600',
                    state === 'future' && 'text-gray-500'
                  )}
                >
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
