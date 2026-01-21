export interface MockUser {
  id: string;
  email: string;
  fullName: string;
  emailConfirmed: boolean;
}

export interface SSOResponse {
  success: boolean;
  user?: MockUser;
  error?: string;
}

export interface CalendarConnectionResponse {
  success: boolean;
  provider: 'google' | 'outlook';
  error?: string;
}

export interface EmailConfirmationResponse {
  success: boolean;
  error?: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function mockGoogleSSO(): Promise<SSOResponse> {
  await delay(1000);

  // 90% success rate
  if (Math.random() > 0.1) {
    return {
      success: true,
      user: {
        id: `user-${Date.now()}`,
        email: 'user@gmail.com',
        fullName: 'Google User',
        emailConfirmed: true
      }
    };
  }

  return {
    success: false,
    error: 'Kunne ikke koble til Google. Vennligst prøv igjen.'
  };
}

export async function mockMicrosoftSSO(): Promise<SSOResponse> {
  await delay(1000);

  // 90% success rate
  if (Math.random() > 0.1) {
    return {
      success: true,
      user: {
        id: `user-${Date.now()}`,
        email: 'user@outlook.com',
        fullName: 'Microsoft User',
        emailConfirmed: true
      }
    };
  }

  return {
    success: false,
    error: 'Kunne ikke koble til Microsoft. Vennligst prøv igjen.'
  };
}

export async function mockRegisterUser(
  email: string,
  password: string,
  fullName: string
): Promise<SSOResponse> {
  await delay(800);

  // Always succeed for mock
  return {
    success: true,
    user: {
      id: `user-${Date.now()}`,
      email,
      fullName,
      emailConfirmed: false
    }
  };
}

export async function mockConfirmEmail(token: string): Promise<EmailConfirmationResponse> {
  await delay(500);

  // Always succeed for mock
  return {
    success: true
  };
}

export async function mockConnectGoogleCalendar(): Promise<CalendarConnectionResponse> {
  await delay(500);

  // 95% success rate
  if (Math.random() > 0.05) {
    return {
      success: true,
      provider: 'google'
    };
  }

  return {
    success: false,
    provider: 'google',
    error: 'Kunne ikke koble til Google Kalender. Vennligst prøv igjen.'
  };
}

export async function mockConnectOutlookCalendar(): Promise<CalendarConnectionResponse> {
  await delay(500);

  // 95% success rate
  if (Math.random() > 0.05) {
    return {
      success: true,
      provider: 'outlook'
    };
  }

  return {
    success: false,
    provider: 'outlook',
    error: 'Kunne ikke koble til Outlook Kalender. Vennligst prøv igjen.'
  };
}

export async function mockSendEmailConfirmation(email: string): Promise<void> {
  await delay(300);
  // Mock sending confirmation email
  console.log(`Mock: Sending confirmation email to ${email}`);
}

export async function mockValidateEmailConfirmationToken(token: string): Promise<boolean> {
  await delay(200);
  // All tokens are valid in mock
  return true;
}
