import { useState } from 'react';
import { Calendar, Check, ArrowRight, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { mockConnectGoogleCalendar, mockConnectOutlookCalendar } from '@/lib/mockOnboarding';
import { cn } from '@/lib/utils';

export default function CalendarStep() {
  const { state, updateCalendarData, goToNextStep } = useOnboarding();
  const [isConnecting, setIsConnecting] = useState<'google' | 'outlook' | null>(null);
  const [error, setError] = useState<string>('');

  const handleGoogleConnect = async () => {
    setIsConnecting('google');
    setError('');

    try {
      const response = await mockConnectGoogleCalendar();

      if (response.success) {
        updateCalendarData({ googleConnected: true });
      } else {
        setError(response.error || 'En feil oppstod');
      }
    } catch (err) {
      setError('En feil oppstod. Vennligst prøv igjen.');
    } finally {
      setIsConnecting(null);
    }
  };

  const handleOutlookConnect = async () => {
    setIsConnecting('outlook');
    setError('');

    try {
      const response = await mockConnectOutlookCalendar();

      if (response.success) {
        updateCalendarData({ outlookConnected: true });
      } else {
        setError(response.error || 'En feil oppstod');
      }
    } catch (err) {
      setError('En feil oppstod. Vennligst prøv igjen.');
    } finally {
      setIsConnecting(null);
    }
  };

  const handleSkip = () => {
    updateCalendarData({ skipped: true });
    goToNextStep();
  };

  const handleContinue = () => {
    goToNextStep();
  };

  const hasConnectedCalendar = state.calendarData.googleConnected || state.calendarData.outlookConnected;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="h-8 w-8 text-blue-600" />
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Koble til kalender
        </h2>
        <p className="text-gray-600">
          Synkroniser møtene dine automatisk og få AI-genererte referater
        </p>
      </div>

      <div className="onboarding-step">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-start space-x-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Calendar Connection Options */}
        <div className="space-y-4 mb-6">
          {/* Google Calendar */}
          <div
            className={cn(
              'relative border-2 rounded-xl p-6 transition-all',
              state.calendarData.googleConnected
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <svg className="h-7 w-7" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Google Kalender</h3>
                  <p className="text-sm text-gray-600">
                    Koble til din Google-konto
                  </p>
                </div>
              </div>

              {state.calendarData.googleConnected ? (
                <div className="flex items-center space-x-2 text-green-600">
                  <Check className="h-5 w-5" />
                  <span className="text-sm font-medium">Tilkoblet</span>
                </div>
              ) : (
                <button
                  onClick={handleGoogleConnect}
                  disabled={isConnecting !== null}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isConnecting === 'google' ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                  ) : (
                    <>
                      <span>Koble til</span>
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Outlook Calendar */}
          <div
            className={cn(
              'relative border-2 rounded-xl p-6 transition-all',
              state.calendarData.outlookConnected
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <svg className="h-7 w-7" viewBox="0 0 23 23">
                    <path fill="#0078D4" d="M0 0h23v23H0z"/>
                    <path fill="#FFF" d="M5 7h13v9H5z"/>
                    <path fill="#0078D4" d="M6 8h11v7H6z"/>
                    <path fill="#FFF" d="M7.5 10.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5v3c0 .83-.67 1.5-1.5 1.5H9c-.83 0-1.5-.67-1.5-1.5v-3zm1.5-.5c-.28 0-.5.22-.5.5v3c0 .28.22.5.5.5h5c.28 0 .5-.22.5-.5v-3c0-.28-.22-.5-.5-.5H9z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Outlook Kalender</h3>
                  <p className="text-sm text-gray-600">
                    Koble til din Microsoft-konto
                  </p>
                </div>
              </div>

              {state.calendarData.outlookConnected ? (
                <div className="flex items-center space-x-2 text-green-600">
                  <Check className="h-5 w-5" />
                  <span className="text-sm font-medium">Tilkoblet</span>
                </div>
              ) : (
                <button
                  onClick={handleOutlookConnect}
                  disabled={isConnecting !== null}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isConnecting === 'outlook' ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                  ) : (
                    <>
                      <span>Koble til</span>
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Auto-invite Checkbox */}
        {hasConnectedCalendar && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={state.calendarData.autoInviteEnabled}
                onChange={(e) => updateCalendarData({ autoInviteEnabled: e.target.checked })}
                className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div>
                <span className="font-medium text-gray-900">
                  Aktiver automatisk bot-invitasjon
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  Notably vil automatisk invitere en møtebot til dine møter for å ta opp og transkribere
                </p>
              </div>
            </label>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col space-y-3">
          {hasConnectedCalendar ? (
            <button
              onClick={handleContinue}
              className="button-primary w-full flex items-center justify-center space-x-2"
            >
              <span>Fortsett</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={handleSkip}
              className="button-secondary w-full"
            >
              Hopp over dette steget
            </button>
          )}
        </div>

        <p className="text-xs text-center text-gray-500 mt-4">
          Du kan koble til kalender senere i innstillingene
        </p>
      </div>
    </motion.div>
  );
}
