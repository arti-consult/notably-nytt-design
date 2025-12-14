import { useState } from 'react';
import { X, Sparkles, Link2, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DirectInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type InviteStatus = 'idle' | 'inviting' | 'success' | 'error';

export default function DirectInviteModal({ isOpen, onClose }: DirectInviteModalProps) {
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [status, setStatus] = useState<InviteStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isValidMeetingLink = (link: string) => {
    // Accept common meeting platforms
    const patterns = [
      /meet\.google\.com/,
      /zoom\.us/,
      /teams\.microsoft\.com/,
      /whereby\.com/,
      /webex\.com/,
    ];
    return patterns.some(pattern => pattern.test(link));
  };

  const handleInvite = async () => {
    if (!meetingLink.trim()) {
      setError('Vennligst skriv inn en møtelenke');
      return;
    }

    if (!isValidMeetingLink(meetingLink)) {
      setError('Ugyldig møtelenke. Støttede plattformer: Google Meet, Zoom, Teams, Whereby, Webex');
      return;
    }

    setError(null);
    setStatus('inviting');

    // Demo mode - simulate inviting
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Demo: Would invite assistant to:', {
      meetingTitle: meetingTitle || 'Uten tittel',
      meetingLink
    });

    setStatus('success');

    // Auto-close after success
    setTimeout(() => {
      handleClose();
    }, 2500);
  };

  const handleClose = () => {
    setMeetingTitle('');
    setMeetingLink('');
    setStatus('idle');
    setError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={(e) => e.target === e.currentTarget && status !== 'inviting' && handleClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.3 }}
          className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
        >
          {/* Success State */}
          {status === 'success' ? (
            <div className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Assistent invitert!
              </h3>
              <p className="text-gray-500">
                Notably-assistenten blir med i møtet om kort tid.
              </p>
            </div>
          ) : (
            <>
              {/* Close button */}
              <button
                onClick={handleClose}
                disabled={status === 'inviting'}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>

              {/* Header with icon */}
              <div className="pt-8 pb-4 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Inviter assistenten umiddelbart
                </h2>
                <p className="text-gray-500 px-6">
                  Del møtelenken, så inviterer vi Notably-assistenten og tar opp samtalen.
                </p>
              </div>

              {/* Form */}
              <div className="px-6 pb-6 space-y-4">
                {/* Error message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Meeting title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Møtetittel
                  </label>
                  <input
                    type="text"
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                    placeholder="Gi møtet et navn"
                    disabled={status === 'inviting'}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-colors"
                  />
                </div>

                {/* Meeting link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Møtelenke
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Link2 className="h-5 w-5" />
                    </div>
                    <input
                      type="url"
                      value={meetingLink}
                      onChange={(e) => {
                        setMeetingLink(e.target.value);
                        setError(null);
                      }}
                      placeholder="https://meet.google.com/abc-defg-hij"
                      disabled={status === 'inviting'}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:bg-white outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Supported platforms hint */}
                <p className="text-xs text-gray-400 text-center">
                  Støtter Google Meet, Zoom, Teams, Whereby og Webex
                </p>

                {/* Submit button */}
                <button
                  onClick={handleInvite}
                  disabled={!meetingLink.trim() || status === 'inviting'}
                  className={cn(
                    "w-full py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all mt-2",
                    !meetingLink.trim() || status === 'inviting'
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gray-900 text-white hover:bg-gray-800 shadow-sm hover:shadow-md"
                  )}
                >
                  {status === 'inviting' ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Inviterer...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Inviter assistent
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
