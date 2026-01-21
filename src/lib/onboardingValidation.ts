export interface PasswordStrength {
  score: 0 | 1 | 2 | 3;
  checks: {
    minLength: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumber: boolean;
    hasSymbol: boolean;
  };
  feedback: string;
}

export function validatePassword(password: string): PasswordStrength {
  const checks = {
    minLength: password.length >= 12,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  };

  const passedChecks = Object.values(checks).filter(Boolean).length;

  let score: 0 | 1 | 2 | 3;
  let feedback: string;

  if (passedChecks === 5) {
    score = 3;
    feedback = 'Sterkt passord!';
  } else if (passedChecks >= 4) {
    score = 2;
    feedback = 'Godt passord';
  } else if (passedChecks >= 3) {
    score = 1;
    feedback = 'Svakt passord';
  } else {
    score = 0;
    feedback = 'Veldig svakt passord';
  }

  return { score, checks, feedback };
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function getPasswordRequirements(): string[] {
  return [
    'Minst 12 tegn',
    'Minst én stor bokstav',
    'Minst én liten bokstav',
    'Minst ett tall',
    'Minst ett spesialtegn'
  ];
}

export function getPasswordStrengthColor(score: 0 | 1 | 2 | 3): string {
  switch (score) {
    case 0:
      return 'text-red-600';
    case 1:
      return 'text-orange-600';
    case 2:
      return 'text-yellow-600';
    case 3:
      return 'text-green-600';
    default:
      return 'text-gray-600';
  }
}

export function getPasswordStrengthBgColor(score: 0 | 1 | 2 | 3): string {
  switch (score) {
    case 0:
      return 'bg-red-500';
    case 1:
      return 'bg-orange-500';
    case 2:
      return 'bg-yellow-500';
    case 3:
      return 'bg-green-500';
    default:
      return 'bg-gray-300';
  }
}
