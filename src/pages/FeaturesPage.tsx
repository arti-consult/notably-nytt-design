import { Link } from 'react-router-dom';
import { 
  Mic, 
  Calendar, 
  FileText, 
  Brain, 
  Lock, 
  Globe, 
  Share2, 
  Search,
  Zap,
  CheckCircle
} from 'lucide-react';

const features = [
  {
    icon: Mic,
    title: 'Live transkripsjon',
    description: 'Automatisk opptak og transkripsjon av møter i sanntid. Støtter både fysiske og digitale møter.',
    benefits: [
      'Støtte for norsk språk',
      'Automatisk talegjenkjenning',
      'Høy nøyaktighet',
      'Støy-reduksjon'
    ]
  },
  {
    icon: Brain,
    title: 'AI-Assistert oppsummering',
    description: 'La AI generere en oppsummering og tilhørende handlingspunkter fra møtet automatisk.',
    benefits: [
      'Automatiske møtenotater',
      'Identifisering av oppgaver',
      'Viktige beslutninger',
      'Tematisk organisering'
    ]
  },
  {
    icon: Calendar,
    title: 'Kalenderintegrasjon',
    description: 'Sømløs integrasjon med dine eksisterende kalendere og møteverktøy.',
    benefits: [
      'Google Calendar',
      'Microsoft Outlook',
      'Google meet integrasjon',
      'Teams integrasjon'
    ]
  },
  {
    icon: Search,
    title: 'Smart søk',
    description: 'Finn raskt frem i tidligere møter med avansert søk og filtering.',
    benefits: [
      'Fulltekstsøk',
      'Grupper i mapper',
      'Marker møter med etiketter'
    ]
  }
];

export default function FeaturesPage() {
  return (
    <main className="pt-16">
      {/* Hero Section */}
      <section className="hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              <span className="gradient-text">Alle funksjonene du trenger</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Notably kombinerer det beste innen AI og transkribering for å gi deg en sømløs opplevelse.
            </p>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon inline-block mb-6">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-8">{feature.description}</p>
                <ul className="space-y-3">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center text-gray-600">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Sikkerhet i verdensklasse</h2>
            <p className="text-xl text-gray-600">
              Vi tar sikkerhet på alvor og beskytter dine data med de beste løsningene.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card">
              <Lock className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Kryptering av data</h3>
              <p className="text-gray-600">
                Vi benytter oss av server-side kryptering for å sikre dine data.
              </p>
            </div>
            <div className="feature-card">
              <Globe className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">GDPR-kompatibel</h3>
              <p className="text-gray-600">
                Fullt samsvar med europeiske personvernregler.
              </p>
            </div>
            <div className="feature-card">
              <Share2 className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Sikker deling</h3>
              <p className="text-gray-600">
                Kontrollert tilgang og delingsrettigheter.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#2C64E3] to-[#6EA0FF] rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Klar til å forbedre møtene dine?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Start din 14-dagers gratis prøveperiode i dag.
            </p>
            <Link
              to="/onboarding"
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-xl bg-white text-blue-600 hover:bg-gray-50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-white/20"
            >
              Start gratis prøveperiode
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}