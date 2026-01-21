import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type OnboardingStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type AccountType = 'solo' | 'business' | 'enterprise';

export interface UserData {
  fullName: string;
  email: string;
  password: string;
  emailConfirmed: boolean;
  registrationMethod: 'email' | 'google' | 'microsoft';
  accountType: AccountType | null;
  teamSize: number; // Number of seats for business accounts
  teamInvites: string[];
}

export interface PlanData {
  selectedPlan: 'standard';
  trialDays: number;
  price: string;
}

export interface CalendarData {
  googleConnected: boolean;
  outlookConnected: boolean;
  autoInviteEnabled: boolean;
  skipped: boolean;
}

export interface ConsentData {
  recordingConsent: boolean;
  consentDate: string | null;
}

export interface OnboardingState {
  currentStep: OnboardingStep;
  userData: UserData;
  planData: PlanData;
  calendarData: CalendarData;
  consentData: ConsentData;
  completedSteps: OnboardingStep[];
}

interface OnboardingContextType {
  state: OnboardingState;
  setCurrentStep: (step: OnboardingStep) => void;
  updateUserData: (data: Partial<UserData>) => void;
  updatePlanData: (data: Partial<PlanData>) => void;
  updateCalendarData: (data: Partial<CalendarData>) => void;
  updateConsentData: (data: Partial<ConsentData>) => void;
  markStepCompleted: (step: OnboardingStep) => void;
  isStepCompleted: (step: OnboardingStep) => boolean;
  canAccessStep: (step: OnboardingStep) => boolean;
  resetOnboarding: () => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

const STORAGE_KEY = 'notably_onboarding_state';

const initialState: OnboardingState = {
  currentStep: 1,
  userData: {
    fullName: '',
    email: '',
    password: '',
    emailConfirmed: false,
    registrationMethod: 'email',
    accountType: null,
    teamSize: 2, // Default to 2 for business accounts
    teamInvites: []
  },
  planData: {
    selectedPlan: 'standard',
    trialDays: 14,
    price: '399 kr/mnd'
  },
  calendarData: {
    googleConnected: false,
    outlookConnected: false,
    autoInviteEnabled: true,
    skipped: false
  },
  consentData: {
    recordingConsent: false,
    consentDate: null
  },
  completedSteps: []
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>(() => {
    // Load from localStorage if available
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored onboarding state:', e);
        return initialState;
      }
    }
    return initialState;
  });

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setCurrentStep = (step: OnboardingStep) => {
    setState(prev => ({ ...prev, currentStep: step }));
  };

  const updateUserData = (data: Partial<UserData>) => {
    setState(prev => ({
      ...prev,
      userData: { ...prev.userData, ...data }
    }));
  };

  const updatePlanData = (data: Partial<PlanData>) => {
    setState(prev => ({
      ...prev,
      planData: { ...prev.planData, ...data }
    }));
  };

  const updateCalendarData = (data: Partial<CalendarData>) => {
    setState(prev => ({
      ...prev,
      calendarData: { ...prev.calendarData, ...data }
    }));
  };

  const updateConsentData = (data: Partial<ConsentData>) => {
    setState(prev => ({
      ...prev,
      consentData: { ...prev.consentData, ...data }
    }));
  };

  const markStepCompleted = (step: OnboardingStep) => {
    setState(prev => {
      if (prev.completedSteps.includes(step)) {
        return prev;
      }
      return {
        ...prev,
        completedSteps: [...prev.completedSteps, step]
      };
    });
  };

  const isStepCompleted = (step: OnboardingStep): boolean => {
    return state.completedSteps.includes(step);
  };

  const canAccessStep = (step: OnboardingStep): boolean => {
    // Step 1 is always accessible
    if (step === 1) return true;

    const accountType = state.userData.accountType;

    // Enterprise flow: 1 → 2 → 7 (skip registration, calendar, consent, team invites)
    if (accountType === 'enterprise') {
      if (step === 2) return isStepCompleted(1);
      if (step === 7) return isStepCompleted(2);
      // Steps 3, 4, 5, 6 are not accessible for enterprise
      return false;
    }

    // Business flow: 1 → 2 → 3 → 4 → 5 → 6 (team invites) → 7
    // Solo flow: 1 → 2 → 3 → 4 → 5 → 7 (skip team invites step 6)
    if (accountType === 'solo' && step === 6) {
      // Solo accounts skip team invite step
      return false;
    }

    // Regular flow: can access a step if the previous step is completed
    const previousStep = (step - 1) as OnboardingStep;
    return isStepCompleted(previousStep);
  };

  const resetOnboarding = () => {
    setState(initialState);
    localStorage.removeItem(STORAGE_KEY);
  };

  const goToNextStep = () => {
    const accountType = state.userData.accountType;

    // Enterprise flow: 1 → 2 → 7 (skip steps 3-6)
    if (accountType === 'enterprise') {
      if (state.currentStep === 1) {
        markStepCompleted(state.currentStep);
        setCurrentStep(2);
      } else if (state.currentStep === 2) {
        markStepCompleted(state.currentStep);
        setCurrentStep(7);
      }
      return;
    }

    // Solo flow: 1 → 2 → 3 → 4 → 5 → 7 (skip team invite step 6)
    if (accountType === 'solo' && state.currentStep === 5) {
      markStepCompleted(state.currentStep);
      markStepCompleted(6); // Mark skipped step as completed
      setCurrentStep(7);
      return;
    }

    // Business flow: 1 → 2 → 3 → 4 → 5 → 6 → 7 (all steps)
    if (state.currentStep < 7) {
      markStepCompleted(state.currentStep);
      setCurrentStep((state.currentStep + 1) as OnboardingStep);
    }
  };

  const goToPreviousStep = () => {
    if (state.currentStep > 1) {
      setCurrentStep((state.currentStep - 1) as OnboardingStep);
    }
  };

  const value: OnboardingContextType = {
    state,
    setCurrentStep,
    updateUserData,
    updatePlanData,
    updateCalendarData,
    updateConsentData,
    markStepCompleted,
    isStepCompleted,
    canAccessStep,
    resetOnboarding,
    goToNextStep,
    goToPreviousStep
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
