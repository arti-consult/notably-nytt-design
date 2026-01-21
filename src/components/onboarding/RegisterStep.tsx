import { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '@/contexts/OnboardingContext';
import {
  validateEmail,
  validatePassword,
  getPasswordStrengthColor,
  getPasswordStrengthBgColor
} from '@/lib/onboardingValidation';
import {
  mockRegisterUser,
  mockGoogleSSO,
  mockMicrosoftSSO,
  mockSendEmailConfirmation
} from '@/lib/mockOnboarding';
import { cn } from '@/lib/utils';

export default function RegisterStep() {
  const navigate = useNavigate();
  const { updateUserData, goToNextStep } = useOnboarding();

  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState<'google' | 'microsoft' | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);

  const passwordStrength = formData.password ? validatePassword(formData.password) : null;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vennligst oppgi ditt fulle navn';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Vennligst oppgi en gyldig e-postadresse';
    }

    if (!formData.password) {
      newErrors.password = 'Vennligst oppgi et passord';
    } else if (passwordStrength && passwordStrength.score < 2) {
      newErrors.password = 'Passordet er for svakt. Vennligst oppfyll alle kravene.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailRegistration = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await mockRegisterUser(
        formData.email,
        formData.password,
        formData.fullName
      );

      if (response.success && response.user) {
        updateUserData({
          fullName: response.user.fullName,
          email: response.user.email,
          emailConfirmed: false,
          registrationMethod: 'email'
        });

        // Send confirmation email
        await mockSendEmailConfirmation(formData.email);

        // Show email confirmation screen
        setShowEmailConfirmation(true);
      }
    } catch (error) {
      setErrors({ submit: 'En feil oppstod. Vennligst prøv igjen.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSSOLogin = async (provider: 'google' | 'microsoft') => {
    setSsoLoading(provider);

    try {
      const response = provider === 'google'
        ? await mockGoogleSSO()
        : await mockMicrosoftSSO();

      if (response.success && response.user) {
        updateUserData({
          fullName: response.user.fullName,
          email: response.user.email,
          emailConfirmed: true,
          registrationMethod: provider
        });

        // SSO users proceed directly to next step
        goToNextStep();
      } else {
        setErrors({ sso: response.error || 'En feil oppstod. Vennligst prøv igjen.' });
      }
    } catch (error) {
      setErrors({ sso: 'En feil oppstod. Vennligst prøv igjen.' });
    } finally {
      setSsoLoading(null);
    }
  };

  const handleEmailConfirmation = async () => {
    setIsLoading(true);

    // Simulate clicking confirmation link
    await new Promise(resolve => setTimeout(resolve, 500));

    updateUserData({ emailConfirmed: true });
    setIsLoading(false);
    goToNextStep();
  };

  const handleResendEmail = async () => {
    setResendSuccess(false);

    try {
      // Simulate sending email
      await mockSendEmailConfirmation(formData.email);

      // Show success message
      setResendSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setResendSuccess(false);
      }, 3000);
    } catch (error) {
      // Handle error silently or show error message
      console.error('Failed to resend email:', error);
    }
  };

  if (showEmailConfirmation) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="onboarding-step text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="h-10 w-10 text-blue-600" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Sjekk e-posten din
          </h2>

          <p className="text-gray-600 mb-6">
            Vi har sendt en bekreftelseslenke til <strong>{formData.email}</strong>
          </p>

          <button
            onClick={handleEmailConfirmation}
            disabled={isLoading}
            className="button-primary w-full flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
            ) : (
              <>
                <span>Bekreft e-post</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>

          {resendSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700"
            >
              ✓ E-posten er sendt på nytt til <strong>{formData.email}</strong>
            </motion.div>
          )}

          <p className="text-sm text-gray-500 mt-4">
            Ikke mottatt e-posten?{' '}
            <button
              onClick={handleResendEmail}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Send på nytt
            </button>
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="onboarding-step">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Opprett din konto
          </h2>
          <p className="text-gray-600">
            Start din 14-dagers gratis prøveperiode i dag
          </p>
        </div>

        {/* SSO Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => handleSSOLogin('google')}
            disabled={ssoLoading !== null}
            className="w-full flex items-center justify-center space-x-3 px-6 py-3 border-2 border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all disabled:opacity-50"
          >
            {ssoLoading === 'google' ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-600" />
            ) : (
              <>
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-medium text-gray-700">Fortsett med Google</span>
              </>
            )}
          </button>

          <button
            onClick={() => handleSSOLogin('microsoft')}
            disabled={ssoLoading !== null}
            className="w-full flex items-center justify-center space-x-3 px-6 py-3 border-2 border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all disabled:opacity-50"
          >
            {ssoLoading === 'microsoft' ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-600" />
            ) : (
              <>
                <svg className="h-5 w-5" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M0 0h11v11H0z"/>
                  <path fill="#81bc06" d="M12 0h11v11H12z"/>
                  <path fill="#05a6f0" d="M0 12h11v11H0z"/>
                  <path fill="#ffba08" d="M12 12h11v11H12z"/>
                </svg>
                <span className="font-medium text-gray-700">Fortsett med Microsoft</span>
              </>
            )}
          </button>
        </div>

        {errors.sso && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {errors.sso}
          </div>
        )}

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Eller med e-post</span>
          </div>
        </div>

        {/* Email Registration Form */}
        <form onSubmit={handleEmailRegistration} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fullt navn
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className={cn(
                  'w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                )}
                placeholder="Ola Nordmann"
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-postadresse
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={cn(
                  'w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                  errors.email ? 'border-red-500' : 'border-gray-300'
                )}
                placeholder="ola@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Passord
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={cn(
                  'w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                  errors.password ? 'border-red-500' : 'border-gray-300'
                )}
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {formData.password && passwordStrength && (
              <div className="mt-2 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full transition-all duration-300',
                        getPasswordStrengthBgColor(passwordStrength.score)
                      )}
                      style={{ width: `${(passwordStrength.score + 1) * 25}%` }}
                    />
                  </div>
                  <span className={cn('text-sm font-medium', getPasswordStrengthColor(passwordStrength.score))}>
                    {passwordStrength.feedback}
                  </span>
                </div>

                <div className="text-xs space-y-1">
                  <p className={cn(passwordStrength.checks.minLength ? 'text-green-600' : 'text-gray-500')}>
                    ✓ Minst 12 tegn
                  </p>
                  <p className={cn(passwordStrength.checks.hasUpperCase ? 'text-green-600' : 'text-gray-500')}>
                    ✓ Minst én stor bokstav
                  </p>
                  <p className={cn(passwordStrength.checks.hasLowerCase ? 'text-green-600' : 'text-gray-500')}>
                    ✓ Minst én liten bokstav
                  </p>
                  <p className={cn(passwordStrength.checks.hasNumber ? 'text-green-600' : 'text-gray-500')}>
                    ✓ Minst ett tall
                  </p>
                  <p className={cn(passwordStrength.checks.hasSymbol ? 'text-green-600' : 'text-gray-500')}>
                    ✓ Minst ett spesialtegn
                  </p>
                </div>
              </div>
            )}

            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="button-primary w-full flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
            ) : (
              <>
                <span>Opprett konto</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Allerede medlem?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Logg inn
          </button>
        </p>

        <p className="text-xs text-center text-gray-500 mt-4">
          Ved å opprette en konto godtar du våre{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700">vilkår</a>
          {' '}og{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700">personvernerklæring</a>
        </p>
      </div>
    </motion.div>
  );
}
