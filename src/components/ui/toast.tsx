import { motion, AnimatePresence } from 'framer-motion';
import { createRoot } from 'react-dom/client';
import { CheckCircle, XCircle, AlertCircle, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastAction {
  label: string;
  onClick: () => void;
}

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
  action?: ToastAction;
  duration?: number;
}

function Toast({ message, type, onClose, action }: ToastProps) {
  const Icon = {
    success: CheckCircle,
    error: XCircle,
    info: AlertCircle,
    warning: AlertTriangle
  }[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg border z-50 min-w-[320px] max-w-md",
        type === 'success' && "bg-green-50 border-green-200 text-green-700",
        type === 'error' && "bg-red-50 border-red-200 text-red-700",
        type === 'info' && "bg-blue-50 border-blue-200 text-blue-700",
        type === 'warning' && "bg-amber-50 border-amber-200 text-amber-700"
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <span className="flex-1 font-medium">{message}</span>
      {action && (
        <button
          onClick={() => {
            action.onClick();
            onClose();
          }}
          className={cn(
            "px-3 py-1 rounded-lg text-sm font-medium transition-colors",
            type === 'success' && "bg-green-600 hover:bg-green-700 text-white",
            type === 'error' && "bg-red-600 hover:bg-red-700 text-white",
            type === 'info' && "bg-blue-600 hover:bg-blue-700 text-white",
            type === 'warning' && "bg-amber-600 hover:bg-amber-700 text-white"
          )}
        >
          {action.label}
        </button>
      )}
      <button
        onClick={onClose}
        className="p-1 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

// Lazy toast creation to avoid DOM access at module load time
interface ShowToastOptions {
  action?: ToastAction;
  duration?: number;
}

const showToast = (
  message: string,
  type: ToastProps['type'] = 'info',
  options?: ShowToastOptions
) => {
  const toastContainer = document.createElement('div');
  toastContainer.id = 'toast-container-' + Date.now();
  document.body.appendChild(toastContainer);
  const root = createRoot(toastContainer);

  const handleClose = () => {
    root.unmount();
    if (document.body.contains(toastContainer)) {
      document.body.removeChild(toastContainer);
    }
  };

  root.render(
    <AnimatePresence>
      <Toast
        message={message}
        type={type}
        onClose={handleClose}
        action={options?.action}
        duration={options?.duration}
      />
    </AnimatePresence>
  );

  // Auto-close after specified duration or default 5 seconds
  const duration = options?.duration || 5000;
  setTimeout(handleClose, duration);
};

export const toast = {
  success: (message: string, options?: ShowToastOptions) =>
    showToast(message, 'success', options),
  error: (message: string, options?: ShowToastOptions) =>
    showToast(message, 'error', options),
  info: (message: string, options?: ShowToastOptions) =>
    showToast(message, 'info', options),
  warning: (message: string, options?: ShowToastOptions) =>
    showToast(message, 'warning', options)
};
