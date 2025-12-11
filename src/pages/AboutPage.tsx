import { Link } from 'react-router-dom';
import { 
  Building, 
  Users, 
  Shield, 
  Globe, 
  ArrowRight,
  MessageSquare,
  Sparkles,
  Zap
} from 'lucide-react';

const values = [
  {
    icon: Shield,
    title: 'Sikkerhet først',
    description: 'Vi tar sikkerhet og personvern på alvor og beskytter dine data med de beste løsningene.'
  },
  {
    icon: Users,
    title: 'Kundefokus',
    description: 'Vi lytter til våre kunder og utvikler løsninger som møter deres behov.'
  },
  {
    icon: Sparkles,
    title: 'Innovasjon',
    description: 'Vi bruker den nyeste teknologien for å skape bedre løsninger.'
  },
  {
    icon: Globe,
    title: 'Bærekraft',
    description: 'Vi jobber for å redusere papirforbruk og effektivisere møter.'
  }
];

export default function AboutPage() {
  return (
    <main className="pt-16">
      {/* Hero Section */}
      <section className="hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-violet-100 mb-8">
              <Building className="h-4 w-4 text-violet-600 mr-2" />
              <span className="text-sm font-medium text-violet-600">Notably</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              <span className="gradient-text">Vi digitaliserer møtehverdagen</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Notably er utviklet for å gjøre møter mer effektive og produktive.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Om Notably
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Notably er et norsk teknologiselskap som spesialiserer seg på
                innovative løsninger for bedrifter. Med Notably har vi skapt en 
                banebrytende plattform som kombinerer kunstig intelligens med 
                brukervennlig design for å revolusjonere måten møter gjennomføres på.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Vår misjon er å hjelpe organisasjoner med å spare tid og ressurser 
                gjennom smarte, digitale løsninger som setter mennesket i sentrum.
              </p>
              <Link to="/contact" className="button-primary inline-flex items-center">
                Kontakt oss
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 p-1">
                <div className="h-full w-full rounded-xl bg-white p-8">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-xl bg-violet-100">
                        <Zap className="h-6 w-6 text-violet-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Rask implementering</h3>
                        <p className="text-sm text-gray-600">Kom i gang på få minutter</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-xl bg-violet-100">
                        <Shield className="h-6 w-6 text-violet-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">GDPR-kompatibel</h3>
                        <p className="text-sm text-gray-600">Sikker databehandling</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-xl bg-violet-100">
                        <MessageSquare className="h-6 w-6 text-violet-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Norsk support</h3>
                        <p className="text-sm text-gray-600">Her for å hjelpe deg</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Våre verdier</h2>
            <p className="text-xl text-gray-600">
              Verdiene som driver oss fremover
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon mb-6">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              La oss hjelpe din bedrift
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Kontakt oss for en uforpliktende prat om hvordan vi kan effektivisere deres møter.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact" className="button-primary bg-white text-violet-600 hover:bg-gray-50">
                Kontakt oss
              </Link>
              <Link to="/pricing" className="text-white hover:text-gray-100 inline-flex items-center">
                <span>Se priser</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}