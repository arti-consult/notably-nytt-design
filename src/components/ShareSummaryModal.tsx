import { useState } from 'react';
import { X, Send, Check, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ShareSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingTitle: string;
  summaryPreview?: string;
}

// Email validation helper
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

type SendStatus = 'idle' | 'sending' | 'success';

export default function ShareSummaryModal({
  isOpen,
  onClose,
  meetingTitle
}: ShareSummaryModalProps) {
  const [emails, setEmails] = useState<string[]>(['']);
  const [sendStatus, setSendStatus] = useState<SendStatus>('idle');
  const [includeMinutes, setIncludeMinutes] = useState(true);
  const [includeTranscription, setIncludeTranscription] = useState(false);

  if (!isOpen) return null;

  const addRow = () => {
    setEmails([...emails, '']);
  };

  const removeRow = (index: number) => {
    if (emails.length > 1) {
      setEmails(emails.filter((_, i) => i !== index));
    }
  };

  const updateEmail = (index: number, value: string) => {
    const updated = [...emails];
    updated[index] = value;
    setEmails(updated);
  };

  // Count valid emails
  const validEmails = emails.filter(e => e.trim() && isValidEmail(e.trim()));
  const validCount = validEmails.length;

  const handleSend = async () => {
    if (validCount === 0) return;

    setSendStatus('sending');

    // Demo mode - simulate sending
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Demo: Would send summary to:', {
      emails: validEmails,
      meetingTitle,
      includeMinutes,
      includeTranscription
    });

    setSendStatus('success');

    // Auto-close after success
    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setEmails(['']);
    setSendStatus('idle');
    setIncludeMinutes(true);
    setIncludeTranscription(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={(e) => e.target === e.currentTarget && sendStatus !== 'sending' && handleClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.3 }}
          className="bg-white rounded-2xl w-full max-w-md shadow-2xl"
        >
          {/* Success State */}
          {sendStatus === 'success' ? (
            <div className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Check className="h-8 w-8 text-emerald-600" />
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Sammendrag sendt!
              </h3>
              <p className="text-gray-500">
                {validCount === 1
                  ? `Sendt til ${validEmails[0]}`
                  : `Sendt til ${validCount} mottakere`
                }
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Del sammendrag
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {meetingTitle}
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    disabled={sendStatus === 'sending'}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                {/* Email rows */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Mottakere
                  </label>
                  <AnimatePresence mode="popLayout">
                    {emails.map((email, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        layout
                        className="flex items-center gap-2"
                      >
                        <div className="flex-1 relative">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => updateEmail(index, e.target.value)}
                            placeholder="navn@eksempel.no"
                            disabled={sendStatus === 'sending'}
                            className={cn(
                              "w-full px-3 py-2.5 rounded-xl border-2 transition-all text-sm",
                              "focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                              email && !isValidEmail(email)
                                ? "border-red-300 bg-red-50"
                                : email && isValidEmail(email)
                                ? "border-emerald-300 bg-emerald-50/50"
                                : "border-gray-200"
                            )}
                            autoFocus={index === emails.length - 1 && emails.length > 1}
                          />
                          {email && isValidEmail(email) && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <Check className="h-4 w-4 text-emerald-500" />
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeRow(index)}
                          disabled={emails.length === 1 || sendStatus === 'sending'}
                          className={cn(
                            "p-2 rounded-lg transition-all",
                            emails.length === 1
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                          )}
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Add row button */}
                  <button
                    type="button"
                    onClick={addRow}
                    disabled={sendStatus === 'sending'}
                    className="w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4" />
                    Legg til mottaker
                  </button>
                </div>

                {/* Options */}
                <div className="space-y-3 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={includeMinutes}
                      onChange={(e) => setIncludeMinutes(e.target.checked)}
                      disabled={sendStatus === 'sending'}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                      Inkluder fullt referat
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={includeTranscription}
                      onChange={(e) => setIncludeTranscription(e.target.checked)}
                      disabled={sendStatus === 'sending'}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                      Inkluder full transkripsjon
                    </span>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="p-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {validCount > 0 ? (
                    <span className="text-blue-600 font-medium">
                      {validCount} {validCount === 1 ? 'mottaker' : 'mottakere'}
                    </span>
                  ) : (
                    <span>Fyll inn e-postadresser</span>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleClose}
                    disabled={sendStatus === 'sending'}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    Avbryt
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={validCount === 0 || sendStatus === 'sending'}
                    className={cn(
                      "px-5 py-2 rounded-xl text-sm font-medium transition-all inline-flex items-center gap-2",
                      validCount > 0
                        ? "bg-gradient-to-r from-[#2C64E3] to-[#6EA0FF] text-white hover:from-[#4A81EB] hover:to-[#6EA0FF] shadow-lg shadow-[#2C64E3]/25"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    )}
                  >
                    {sendStatus === 'sending' ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sender...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
