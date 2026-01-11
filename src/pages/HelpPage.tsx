import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronDown,
  HelpCircle,
  Mail,
  MessageCircle,
  Book,
  Mic,
  Calendar,
  Building2,
  CreditCard,
  Send
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/toast';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  items: FAQItem[];
}

const faqCategories: FAQCategory[] = [
  {
    id: 'opptak',
    title: 'Opptak og transkripsjon',
    icon: Mic,
    items: [
      {
        question: 'Hvilke lydformater støttes?',
        answer: 'Notably støtter de fleste vanlige lydformater inkludert MP3, WAV, M4A, WEBM og OGG. Maksimal filstørrelse er 500 MB per opptak.'
      },
      {
        question: 'Hvor nøyaktig er transkriberingen?',
        answer: 'Vår AI oppnår typisk 95%+ nøyaktighet for tydelig norsk tale. Nøyaktigheten kan variere basert på lydkvalitet, bakgrunnsstøy og dialekter.'
      },
      {
        question: 'Kan jeg redigere transkripsjonen?',
        answer: 'Nei, men du kan redigere både sammendrag og møtereferat.'
      },
      {
        question: 'Hvor lang tid tar transkriberingen?',
        answer: 'Transkribering tar vanligvis 1-2 minutter per 10 minutter med lyd. Lengre opptak kan ta noe lengre tid.'
      }
    ]
  },
  {
    id: 'kalender',
    title: 'Kalenderintegrasjon',
    icon: Calendar,
    items: [
      {
        question: 'Hvordan kobler jeg til kalenderen min?',
        answer: 'Du kan koble til kalenderen din enten under "Kalender" i menyen på dashbordet, eller under "Integrasjoner" i innstillinger. Klikk på "Koble til" under Microsoft 365 eller Google Calendar og følg instruksjonene.'
      },
      {
        question: 'Kan Notably automatisk delta i møter?',
        answer: 'Ja! Når kalenderen er tilkoblet, kan Notably automatisk bli med i dine digitale møter i Teams eller Google Meet og transkribere dem.'
      },
      {
        question: 'Hvilke møteplattformer støttes?',
        answer: 'Notably støtter Microsoft Teams og Google Meet for automatisk deltakelse. For andre plattformer kan du ta opp manuelt eller laste opp lydopptak.'
      }
    ]
  },
  {
    id: 'organisasjon',
    title: 'Organisasjoner og team',
    icon: Building2,
    items: [
      {
        question: 'Hvordan oppretter jeg en organisasjon?',
        answer: 'Gå til Organisasjon-siden og klikk på "Opprett organisasjon". Du kan deretter invitere teammedlemmer via e-post.'
      },
      {
        question: 'Hva er forskjellen på Admin og Medlem?',
        answer: 'Administratorer kan invitere/fjerne medlemmer, administrere fakturering og se all aktivitet. Medlemmer har tilgang til delte mapper og egne opptak.'
      }
    ]
  },
  {
    id: 'betaling',
    title: 'Betaling og abonnement',
    icon: CreditCard,
    items: [
      {
        question: 'Hvilke betalingsmetoder aksepteres?',
        answer: 'Vi aksepterer Visa, Mastercard, og faktura for bedriftskunder. Alle priser er oppgitt i NOK inkludert MVA.'
      },
      {
        question: 'Kan jeg oppgradere eller nedgradere planen min?',
        answer: 'Ja, du kan endre plan når som helst via Innstillinger. Ved oppgradering betaler du kun differansen. Ved nedgradering aktiveres ny plan ved neste faktureringsperiode.'
      },
      {
        question: 'Hvordan sier jeg opp abonnementet?',
        answer: 'Du kan si opp via Innstillinger > Abonnement. Kontoen din forblir aktiv til slutten av den betalte perioden.'
      }
    ]
  }
];

function FAQAccordion({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left hover:text-blue-600 transition-colors"
      >
        <span className="font-medium pr-4">{item.question}</span>
        <ChevronDown className={cn(
          "h-5 w-5 text-gray-400 transition-transform flex-shrink-0",
          isOpen && "rotate-180"
        )} />
      </button>
      <div className={cn(
        "overflow-hidden transition-all duration-200",
        isOpen ? "max-h-96 pb-4" : "max-h-0"
      )}>
        <p className="text-gray-600">{item.answer}</p>
      </div>
    </div>
  );
}

export default function HelpPage() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Meldingen din er sendt! Vi svarer innen 24 timer.');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Tilbake til dashboard
          </Link>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <HelpCircle className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold">Hjelp og støtte</h1>
          </div>
          <p className="text-gray-600">
            Chat med vår AI-assistent eller finn svar på vanlige spørsmål
          </p>
        </div>

        {/* AI Chat Assistant */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-12">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Chat med oss</h2>
                <p className="text-sm text-gray-600">Få svar på spørsmålene dine med en gang</p>
              </div>
            </div>
          </div>
          <div className="w-full">
            <iframe
              src="https://www.chatbase.co/chatbot-iframe/pngdeqFJ_MlGdfXu6PrUa"
              width="100%"
              style={{ height: '100%', minHeight: '700px', border: 'none' }}
              title="Notably AI Chat Assistant"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <Link
            to="/docs"
            className="flex items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-2 bg-blue-50 rounded-lg mr-4">
              <Book className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">Dokumentasjon</h3>
              <p className="text-sm text-gray-600">Detaljerte guider</p>
            </div>
          </Link>
          <a
            href="mailto:support@notably.no"
            className="flex items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-2 bg-blue-50 rounded-lg mr-4">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">E-post</h3>
              <p className="text-sm text-gray-600">support@notably.no</p>
            </div>
          </a>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Vanlige spørsmål</h2>
          <div className="space-y-6">
            {faqCategories.map((category) => (
              <div key={category.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 border-b border-gray-100">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <category.icon className="h-4 w-4 text-blue-600" />
                  </div>
                  <h3 className="font-semibold">{category.title}</h3>
                </div>
                <div className="px-4">
                  {category.items.map((item, index) => (
                    <FAQAccordion
                      key={index}
                      item={item}
                      isOpen={openItems.has(`${category.id}-${index}`)}
                      onToggle={() => toggleItem(`${category.id}-${index}`)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-2">Kontakt oss</h2>
          <p className="text-gray-600 mb-6">
            Fant du ikke svaret du lette etter? Send oss en melding.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Navn
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Ditt navn"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-post
                </label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="din@epost.no"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emne
              </label>
              <input
                type="text"
                required
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Hva gjelder henvendelsen?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Melding
              </label>
              <textarea
                required
                rows={4}
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Beskriv hva du trenger hjelp med..."
              />
            </div>
            <button
              type="submit"
              className="button-primary inline-flex items-center"
            >
              <Send className="h-4 w-4 mr-2" />
              Send melding
            </button>
          </form>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            Se også:{' '}
            <Link to="/privacy" className="text-blue-600 hover:underline">
              Personvernerklæring
            </Link>
            {' '}&bull;{' '}
            <Link to="/terms" className="text-blue-600 hover:underline">
              Vilkår for bruk
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
