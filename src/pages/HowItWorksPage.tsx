import { Link } from 'react-router-dom';
import { 
  Mic, 
  Sparkles, 
  FileText, 
  ArrowRight,
  Calendar,
  MessageSquare,
  CheckCircle,
  Play,
  PauseCircle,
  ListChecks
} from 'lucide-react';

const steps = [
  {
    icon: Calendar,
    title: 'Planlegg møtet',
    description: 'Opprett møtet direkte i Notably eller bruk integrasjonene med Google Calendar og Microsoft Outlook.'
  },
  {
    icon: Mic,
    title: 'Start opptak',
    description: 'Notably starter automatisk opptak når møtet begynner, eller du kan starte manuelt med ett klikk.'
  },
  {
    icon: Sparkles,
    title: 'AI transkriberer',
    description: 'Vår AI transkriberer møtet i sanntid med støtte for norsk språk og dialekter.'
  },
  {
    icon: FileText,
    title: 'Få oppsummering',
    description: 'Etter møtet genererer AI en strukturert oppsummering med viktige punkter og oppfølgingsoppgaver.'
  }
];

export default function HowItWorksPage() {
  return (
    <main className="pt-16">
      {/* Hero Section */}
      <section className="hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              <span className="gradient-text">Slik fungerer Notably</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Fra møtestart til ferdig notat på få minutter
            </p>
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/50 backdrop-blur-sm border border-blue-100">
              <Play className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-600">Se demo</span>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="feature-card relative">
                <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                  {index + 1}
                </div>
                <div className="feature-icon mb-6">
                  <step.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Se Notably i aksjon
              </h2>
              <p className="text-gray-600 mb-8">
                Opplev hvor enkelt det er å få profesjonelle møtenotater med AI-assistert transkribering.
              </p>
              <div className="space-y-6">
                <div className="flex items-center space-x-2 text-blue-600">
                  <PauseCircle className="h-5 w-5" />
                  <span className="font-medium">02:45 / 05:30</span>
                </div>
                <div className="space-y-4">
                  <div className="feature-card p-4">
                    <div className="flex items-center">
                      <MessageSquare className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="text-sm text-gray-600">
                        "La oss gå gjennom siste kvartal..."
                      </span>
                    </div>
                  </div>
                  <div className="feature-card p-4">
                    <div className="flex items-center">
                      <ListChecks className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="text-sm text-gray-600">
                        Oppgave: Oppdater salgsrapport innen fredag
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-2xl bg-gradient-to-br from-[#2C64E3] to-[#6EA0FF] p-1">
                <div className="h-full w-full rounded-xl bg-gray-900">
                  {/* Her ville vi normalt hatt en video eller animasjon */}
                  <div className="h-full flex items-center justify-center text-white">
                    <Play className="h-12 w-12" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Alt du trenger for effektive møter</h2>
            <p className="text-xl text-gray-600">
              Notably gir deg verktøyene du trenger for å få mer ut av hvert møte
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card">
              <CheckCircle className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Automatisk transkribering</h3>
              <p className="text-gray-600">
                Nøyaktig transkripsjon med støtte for norsk språk og dialekter
              </p>
            </div>
            <div className="feature-card">
              <CheckCircle className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">AI-drevet analyse</h3>
              <p className="text-gray-600">
                Trekker ut sammendrag, hovedtemaer og handlingspunkter automatisk
              </p>
            </div>
            <div className="feature-card">
              <CheckCircle className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Enkel deling</h3>
              <p className="text-gray-600">
                Del notater sikkert med teamet ditt
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Klar til å prøve Notably?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Start din 14-dagers gratis prøveperiode i dag
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/onboarding" className="button-primary">
                Start gratis prøveperiode
              </Link>
              <Link to="/contact" className="button-secondary inline-flex items-center">
                <span>Kontakt salg</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}