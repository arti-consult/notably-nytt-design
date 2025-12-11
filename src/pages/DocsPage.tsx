import { Link } from 'react-router-dom';
import { 
  FileText, 
  Book, 
  Code, 
  Zap,
  ArrowRight,
  Search,
  ChevronRight,
  Mic,
  Calendar,
  Lock,
  Headphones,
  Download,
  Share2
} from 'lucide-react';

const quickLinks = [
  {
    icon: Mic,
    title: 'Opptak',
    description: 'Lær hvordan du tar opp møter',
    to: '#recording'
  },
  {
    icon: Calendar,
    title: 'Kalenderintegrasjon',
    description: 'Koble til din kalender',
    to: '#calendar'
  },
  {
    icon: Lock,
    title: 'Sikkerhet',
    description: 'Personvern og databehandling',
    to: '#security'
  },
  {
    icon: Share2,
    title: 'Deling',
    description: 'Del opptak med andre',
    to: '#sharing'
  }
];

const sections = [
  {
    id: 'getting-started',
    title: 'Kom i gang',
    content: [
      {
        title: 'Registrering og oppsett',
        steps: [
          'Gå til registreringssiden og opprett en konto',
          'Bekreft e-postadressen din',
          'Logg inn på dashbordet',
          'Konfigurer grunnleggende innstillinger'
        ]
      },
      {
        title: 'Første opptak',
        steps: [
          'Klikk på "Nytt opptak" i dashbordet',
          'Gi opptaket et navn',
          'Velg mappe (valgfritt)',
          'Start opptaket'
        ]
      }
    ]
  },
  {
    id: 'recording',
    title: 'Opptak',
    content: [
      {
        title: 'Manuelt opptak',
        description: 'Start opptak direkte fra dashbordet for fysiske møter eller ad-hoc samtaler.'
      },
      {
        title: 'Automatisk opptak',
        description: 'Notably kan automatisk bli med i planlagte møter fra kalenderen din.'
      },
      {
        title: 'Lydkvalitet',
        description: 'For best mulig kvalitet, plasser enheten sentralt og minimer bakgrunnsstøy.'
      }
    ]
  },
  {
    id: 'calendar',
    title: 'Kalenderintegrasjon',
    content: [
      {
        title: 'Microsoft 365',
        steps: [
          'Gå til Innstillinger > Digitale møter',
          'Klikk på "Koble til" under Microsoft 365',
          'Logg inn med din Microsoft-konto',
          'Velg hvilke kalendere som skal synkroniseres'
        ]
      },
      {
        title: 'Google Calendar',
        steps: [
          'Gå til Innstillinger > Digitale møter',
          'Klikk på "Koble til" under Google Calendar',
          'Velg Google-kontoen du vil bruke',
          'Gi nødvendige tillatelser'
        ]
      }
    ]
  },
  {
    id: 'security',
    title: 'Sikkerhet og personvern',
    content: [
      {
        title: 'Datakryptering',
        description: 'Alle opptak og transkripsjoner er beskyttet med ende-til-ende-kryptering.'
      },
      {
        title: 'GDPR-samsvar',
        description: 'Vi følger EUs personvernforordning (GDPR) for all databehandling.'
      },
      {
        title: 'Datalagring',
        description: 'Data lagres sikkert på servere i EU/EØS-området.'
      }
    ]
  },
  {
    id: 'sharing',
    title: 'Deling og eksport',
    content: [
      {
        title: 'Del opptak',
        steps: [
          'Åpne opptaket du vil dele',
          'Klikk på "Del" knappen',
          'Velg delingsalternativer',
          'Kopier og del lenken'
        ]
      },
      {
        title: 'Eksportformater',
        description: 'Eksporter transkripsjoner og sammendrag i PDF, DOCX eller CSV format.'
      }
    ]
  }
];

export default function DocsPage() {
  return (
    <main className="pt-16">
      {/* Hero Section */}
      <section className="hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-violet-100 mb-8">
              <Book className="h-4 w-4 text-violet-600 mr-2" />
              <span className="text-sm font-medium text-violet-600">Dokumentasjon</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              <span className="gradient-text">Alt du trenger å vite</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Utforsk vår omfattende dokumentasjon for å få mest mulig ut av Notably
            </p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Søk i dokumentasjonen..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-violet-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href={link.to}
                className="feature-card group flex items-start space-x-4"
              >
                <div className="feature-icon">
                  <link.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 group-hover:text-violet-600 transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-sm text-gray-600">{link.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-violet-600 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="flex items-center px-4 py-2 text-gray-600 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                    >
                      <span>{section.title}</span>
                    </a>
                  ))}
                </nav>

                <div className="p-4 rounded-xl bg-violet-50 border border-violet-100">
                  <h4 className="font-semibold mb-2">Trenger du hjelp?</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Vårt support-team er her for å hjelpe deg
                  </p>
                  <div className="flex items-center space-x-3">
                    <Headphones className="h-5 w-5 text-violet-600" />
                    <Link 
                      to="/support"
                      className="text-sm text-violet-600 hover:text-violet-700 font-medium"
                    >
                      Kontakt support
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Documentation Content */}
            <div className="lg:col-span-3 space-y-16">
              {sections.map((section) => (
                <div key={section.id} id={section.id} className="scroll-mt-24">
                  <h2 className="text-3xl font-bold mb-8">{section.title}</h2>
                  <div className="space-y-8">
                    {section.content.map((item, index) => (
                      <div key={index} className="feature-card">
                        <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                        {item.description && (
                          <p className="text-gray-600 mb-4">{item.description}</p>
                        )}
                        {item.steps && (
                          <ol className="space-y-3">
                            {item.steps.map((step, stepIndex) => (
                              <li key={stepIndex} className="flex items-start">
                                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-violet-100 text-violet-600 text-sm font-medium mr-3">
                                  {stepIndex + 1}
                                </span>
                                <span className="text-gray-600">{step}</span>
                              </li>
                            ))}
                          </ol>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Fant du ikke det du lette etter?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Vi er her for å hjelpe deg med å få mest mulig ut av Notably
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact" className="button-primary">
                Kontakt oss
              </Link>
              <Link to="/support" className="button-secondary inline-flex items-center">
                <span>Gå til support</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}