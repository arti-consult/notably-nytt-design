import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MeetingChatProps {
  recordingId: string;
  transcription: {
    content: Array<{
      text: string;
      timestamp: number;
    }>;
    summary_text?: string;
    summary_topics?: string[];
    action_items?: string[];
  };
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

// Mock AI responses based on question keywords
const getMockResponse = (question: string, transcription: MeetingChatProps['transcription']): string => {
  const lowerQuestion = question.toLowerCase();

  if (lowerQuestion.includes('sammendrag') || lowerQuestion.includes('oppsummer')) {
    return transcription.summary_text || 'Dette møtet diskuterte flere viktige temaer relatert til prosjektfremdrift og teamsamarbeid.';
  }

  if (lowerQuestion.includes('tema') || lowerQuestion.includes('diskuter')) {
    if (transcription.summary_topics && transcription.summary_topics.length > 0) {
      return `Hovedtemaene i møtet var:\n${transcription.summary_topics.map(t => `- ${t}`).join('\n')}`;
    }
    return 'Møtet tok opp temaer som prosjektplanlegging, ressursallokering og fremtidige milepæler.';
  }

  if (lowerQuestion.includes('handling') || lowerQuestion.includes('oppgave') || lowerQuestion.includes('gjøre')) {
    if (transcription.action_items && transcription.action_items.length > 0) {
      return `Handlingspunktene fra møtet:\n${transcription.action_items.map(a => `- ${a}`).join('\n')}`;
    }
    return 'Det ble avtalt flere oppfølgingspunkter, inkludert statusoppdateringer og dokumentasjonsarbeid.';
  }

  if (lowerQuestion.includes('deltaker') || lowerQuestion.includes('hvem')) {
    return 'Møtet inkluderte representanter fra ulike team som diskuterte felles utfordringer og muligheter.';
  }

  if (lowerQuestion.includes('beslut') || lowerQuestion.includes('vedtak')) {
    return 'Det ble tatt beslutninger om prosjektprioriteringer og ressursallokering for neste fase.';
  }

  // Default response
  return `Basert på møteinnholdet kan jeg si at dette var et produktivt møte med fokus på teamets målsetninger. ${
    transcription.summary_text ? 'Hovedpunktene var: ' + transcription.summary_text.substring(0, 200) + '...' : ''
  }`;
};

export default function MeetingChat({ recordingId, transcription }: MeetingChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    // Only scroll within the container, not the whole page
    if (messagesEndRef.current && messages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  useEffect(() => {
    // Only scroll when there are messages (not on initial mount)
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: newMessage.trim(),
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate AI thinking delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const aiResponse = getMockResponse(userMessage.content, transcription);

    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: aiResponse,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-[600px]">
      <div className="p-6 pb-4 border-b border-gray-200">
        <p className="text-sm text-gray-600">
          Få svar basert på møtets innhold og sammendrag
        </p>
        <p className="text-xs text-amber-600 mt-1">
          Demo-modus: Viser eksempelsvar
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <Bot className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">Still et spørsmål om møtet for å komme i gang</p>
            <div className="mt-4 space-y-2">
              <p className="text-xs text-gray-400">Prøv for eksempel:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Hva er sammendraget?', 'Hvilke temaer ble diskutert?', 'Hva er handlingspunktene?'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setNewMessage(suggestion)}
                    className="text-xs px-3 py-1.5 rounded-full bg-violet-50 text-violet-600 hover:bg-violet-100 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex items-start space-x-3",
              message.role === 'user' ? "flex-row-reverse space-x-reverse" : ""
            )}
          >
            <div className={cn(
              "p-2 rounded-full flex-shrink-0",
              message.role === 'user' ? "bg-violet-100" : "bg-gray-100"
            )}>
              {message.role === 'user' ? (
                <User className="h-4 w-4 text-violet-600" />
              ) : (
                <Bot className="h-4 w-4 text-gray-600" />
              )}
            </div>
            <div className={cn(
              "max-w-[80%] rounded-2xl px-4 py-2",
              message.role === 'user'
                ? "bg-violet-600 text-white"
                : "bg-gray-100 text-gray-900"
            )}>
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-full bg-gray-100">
              <Bot className="h-4 w-4 text-gray-600" />
            </div>
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Still et spørsmål om møtet..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-violet-500"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={isTyping || !newMessage.trim()}
            className={cn(
              "p-2 rounded-lg",
              isTyping || !newMessage.trim()
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-violet-600 text-white hover:bg-violet-700"
            )}
          >
            {isTyping ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
