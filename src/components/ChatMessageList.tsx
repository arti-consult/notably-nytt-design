import { useEffect, useRef, useLayoutEffect } from 'react';
import { cn } from '@/lib/utils';
import { Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Define types locally instead of importing from deleted hook
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  status?: 'sending' | 'sent' | 'error';
}

interface ChatMessageListProps {
  messages: ChatMessage[];
  hasMore: boolean;
  isLoading: boolean;
  isTyping: boolean;
  onLoadMore: () => void;
}

export default function ChatMessageList({
  messages,
  hasMore,
  isLoading,
  isTyping,
  onLoadMore
}: ChatMessageListProps) {
  const observerRef = useRef<IntersectionObserver>();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    const chatContainer = messagesEndRef.current?.parentElement;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };

  // Scroll on new messages or typing state change
  useLayoutEffect(() => {
    scrollToBottom();
  }, [messages.length, isTyping]);

  useEffect(() => {
    if (isLoading) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      },
      { threshold: 0.5 }
    );

    observerRef.current = observer;

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isLoading, hasMore, onLoadMore]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
      {hasMore && (
        <div ref={loadMoreRef} className="text-center py-2">
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-violet-600 border-t-transparent mx-auto" />
          ) : (
            <span className="text-sm text-gray-500">Last inn flere meldinger...</span>
          )}
        </div>
      )}

      {messages.map((message) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 0.3,
            type: "spring",
            stiffness: 600,
            damping: 30
          }}
          className={cn(
            "flex flex-col max-w-[80%] space-y-2",
            message.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
          )}
        >
          <motion.div
            layout
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={cn(
              "rounded-2xl px-5 py-3",
              message.role === 'user'
                ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white relative"
                : "bg-gray-100 text-gray-900 relative"
            )}
          >
            <div className={cn(
              "absolute -top-5 text-xs font-medium",
              message.role === 'user' ? "right-0" : "left-0"
            )}>
              <span className="text-gray-500">
                {message.role === 'user' ? 'Deg' : 'Notably'}
              </span>
            </div>
            {message.content}
          </motion.div>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            {new Date(message.created_at).toLocaleTimeString('no', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })}
            {message.role === 'user' && message.status && (
              <span className={cn(
                "flex items-center",
                message.status === 'error' ? "text-red-500" :
                message.status === 'sent' ? "text-gray-400" :
                "text-gray-400"
              )}>
                {message.status === 'sending' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 1, 0.4] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="flex space-x-1"
                  >
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-current"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: 0,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-current"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: 0.2,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-current"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: 0.4,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                )}
                {message.status === 'sent' && <Check className="h-3 w-3" />}
                {message.status === 'error' && <AlertCircle className="h-3 w-3" />}
              </span>
            )}
          </div>
        </motion.div>
      ))}

      <AnimatePresence>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center ml-4 bg-white/50 backdrop-blur-sm rounded-xl p-2"
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 bg-[length:200%_100%] rounded-lg"
                animate={{
                  backgroundPosition: ['0% 0%', '100% 0%', '0% 0%']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                <span className="text-sm font-medium px-3 py-2">Notably skriver</span>
              </motion.div>
              <span className="text-sm font-medium invisible px-3 py-2">Notably skriver</span>
            </div>
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                times: [0, 0.2, 1],
                ease: "easeInOut"
              }}
              className="text-sm text-violet-600 font-medium ml-1 tracking-wider"
            >
              ...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </div>
  );
}
