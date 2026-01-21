import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileAudio, 
  Calendar, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Shield,
  Star,
  ChevronDown
} from 'lucide-react';

const testimonials = [
  {
    name: "Anders Johansen",
    role: "Daglig leder, TechCorp AS",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
    content: "Notably har revolusjonert måten vi håndterer møter på. Automatisk transkribering sparer oss for timevis av arbeid hver uke.",
    rating: 5
  },
  {
    name: "Maria Berg",
    role: "Prosjektleder, Innovate Norge",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
    content: "Fantastisk verktøy for møtenotering. AI-oppsummeringene er presise og nyttige, og integrasjonen med Teams er sømløs.",
    rating: 5
  },
  {
    name: "Thomas Larsen",
    role: "HR-direktør, BuildCo",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
    content: "Dette verktøyet har gjort møtene våre mer produktive. Vi bruker mindre tid på notering og mer tid på diskusjon.",
    rating: 5
  },
  {
    name: "Kristine Hansen",
    role: "Styreleder, Digital AS",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
    content: "Notably er et must-have for enhver moderne bedrift. Spesielt imponert over hvor nøyaktig transkriberingen er på norsk.",
    rating: 5
  },
  {
    name: "Erik Solheim",
    role: "CTO, FutureTech",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
    content: "Integrasjonen med kalenderen vår er perfekt. Notably starter automatisk i alle møter, og AI-oppsummeringene er imponerende presise.",
    rating: 5
  },
  {
    name: "Sofia Rodriguez",
    role: "Prosjektleder, Global Solutions",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
    content: "Vi har redusert tiden brukt på møtereferat med 75%. Nå kan vi fokusere på det viktigste - å drive prosjektene fremover.",
    rating: 5
  },
  {
    name: "Lars Pedersen",
    role: "Administrerende Direktør, NordicTech",
    image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
    content: "Notably har transformert våre styremøter. Transkripsjonen er feilfri og oppsummeringene fanger alltid de viktigste punktene.",
    rating: 5
  },
  {
    name: "Emma Nilsson",
    role: "Senior Konsulent, ConsultCo",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
    content: "Som konsulent har jeg mange møter hver dag. Notably gjør det enkelt å holde oversikt og følge opp handlingspunkter.",
    rating: 5
  }
];

const faqs = [
  {
    icon: "🎯",
    question: "Hvordan fungerer automatisk transkribering?",
    answer: "Notably bruker avansert AI-teknologi for å konvertere tale til tekst i sanntid. Systemet støtter både norsk og engelsk, og kan skille mellom ulike talere i møtet. Transkriberingen starter automatisk når møtet begynner og er tilgjengelig umiddelbart etter møtets slutt."
  },
  {
    icon: "🔒",
    question: "Er Notably GDPR-kompatibel?",
    answer: "Ja, Notably er fullt GDPR-kompatibel. Vi bruker ende-til-ende-kryptering for all dataoverføring, og alle data lagres på sikre servere i EU. Du har full kontroll over dine data og kan når som helst be om innsyn eller sletting."
  },
  {
    icon: "🤝",
    question: "Hvilke møteplattformer støttes?",
    answer: "Notably integreres sømløst med Microsoft Teams og Google Meet. Vi jobber kontinuerlig med å utvide støtten til flere plattformer. Systemet fungerer også utmerket for fysiske møter ved bruk av den innebygde opptaksfunksjonen."
  },
  {
    icon: "🚀",
    question: "Hvordan kommer jeg i gang?",
    answer: "Det er enkelt å komme i gang med Notably. Registrer en konto, koble til din kalender og møteplattform, og du er klar til å begynne. Vi tilbyr en 14-dagers gratis prøveperiode der du får tilgang til alle funksjoner."
  },
  {
    icon: "💰",
    question: "Hva koster tjenesten?",
    answer: "Vi tilbyr flere prisplaner tilpasset ulike behov. Våre planer starter fra 299 kr per måned for enkeltbrukere, med mulighet for tilpassede enterprise-løsninger for større organisasjoner. Alle planer inkluderer ubegrenset antall møter og transkripsjoner."
  }
];

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="pt-16">
      {/* Hero Section */}
      <section className="hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-blue-100 mb-8">
              <Sparkles className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium bg-gradient-to-r from-[#2C64E3] to-[#6EA0FF] bg-clip-text text-transparent">
                Intelligent møteassistent
              </span>
            </div>
            <h1 className="text-6xl sm:text-7xl font-bold tracking-tight mb-8">
              <span className="gradient-text">La AI ta notater</span>
              <br />
              mens du fokuserer
            </h1>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Automatisk transkribering og oppsummering av alle dine møter.
              <br />
              Enkelt, sikkert og effektivt.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/onboarding"
                className="w-full sm:w-auto px-8 py-3 rounded-xl font-medium transition-all duration-300
                         bg-gradient-to-r from-[#2C64E3] via-[#4A81EB] to-[#6EA0FF]
                         hover:scale-105 hover:shadow-xl hover:shadow-[#2C64E3]/20
                         text-white"
              >
                Start gratis prøveperiode
              </Link>
              <Link 
                to="/how-it-works" 
                className="w-full sm:w-auto px-8 py-3 rounded-xl font-medium transition-all duration-300
                         bg-white hover:bg-gray-50 border border-gray-200
                         hover:scale-105 hover:shadow-xl hover:shadow-[#2C64E3]/20
                         text-gray-900"
              >
                Se hvordan det fungerer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section id="features" className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold gradient-text inline-block mb-4">
              Intelligent møteassistent
            </h2>
            <p className="text-xl text-gray-600">
              Alt du trenger for effektive møter, samlet i én løsning
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card group">
              <div className="feature-icon mb-6">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Live transkripsjon</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Automatisk transkripsjon av både fysiske og digitale møter i sanntid med støtte for norsk språk.
              </p>
              <Link 
                to="/features" 
                className="inline-flex items-center text-blue-600 font-medium group-hover:text-blue-700"
              >
                <span>Les mer</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
            <div className="feature-card group">
              <div className="feature-icon mb-6">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Smart kalender</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Sømløs integrasjon med Google Calendar og Outlook. Automatisk oppstart av opptak for planlagte møter.
              </p>
              <Link 
                to="/features" 
                className="inline-flex items-center text-blue-600 font-medium group-hover:text-blue-700"
              >
                <span>Les mer</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
            <div className="feature-card group">
              <div className="feature-icon mb-6">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Sikkerhet i fokus</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                End-to-end kryptering og GDPR-kompatibel databehandling. Din sikkerhet er vår høyeste prioritet.
              </p>
              <Link 
                to="/features" 
                className="inline-flex items-center text-blue-600 font-medium group-hover:text-blue-700"
              >
                <span>Les mer</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Hva kundene våre sier</h2>
            <p className="text-xl text-gray-600">
              Se hvordan Notably hjelper bedrifter med å effektivisere møtene sine
            </p>
          </div>

          <div className="relative">
            <motion.div 
              className="flex space-x-6 py-4"
              initial={{ x: 0 }}
              animate={{ x: "-100%" }}
              transition={{ 
                duration: 40,
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop"
              }}
            >
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <div 
                  key={index}
                  className="flex-shrink-0 w-[400px] bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-amber-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600">{testimonial.content}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Ofte stilte spørsmål</h2>
            <p className="text-xl text-gray-600">
              Finn svar på de vanligste spørsmålene om Notably
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index}
                initial={false}
                animate={{ 
                  height: openFaq === index ? "auto" : "72px",
                  backgroundColor: openFaq === index ? "rgb(248, 250, 252)" : "white"
                }}
                className="rounded-xl shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">{faq.icon}</span>
                    <span className="font-medium">{faq.question}</span>
                  </div>
                  <motion.div
                    animate={{ 
                      rotate: openFaq === index ? 180 : 0,
                      color: openFaq === index ? "#2C64E3" : "#6b7280"
                    }}
                  >
                    <ChevronDown className="h-5 w-5" />
                  </motion.div>
                </button>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: openFaq === index ? 1 : 0,
                    transition: { duration: 0.2 }
                  }}
                  className="px-6 pb-6"
                >
                  <p className="text-gray-600 pl-12">{faq.answer}</p>
                </motion.div>
              </motion.div>
            ))}
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
              <Link
                to="/onboarding"
                className="px-8 py-3 rounded-xl font-medium transition-all duration-300
                         bg-gradient-to-r from-[#2C64E3] via-[#4A81EB] to-[#6EA0FF]
                         hover:scale-105 hover:shadow-xl hover:shadow-[#2C64E3]/20
                         text-white"
              >
                Start gratis prøveperiode
              </Link>
              <Link 
                to="/contact" 
                className="px-8 py-3 rounded-xl font-medium transition-all duration-300
                         bg-white hover:bg-gray-50 border border-gray-200
                         hover:scale-105 hover:shadow-xl hover:shadow-[#2C64E3]/20
                         text-gray-900 inline-flex items-center"
              >
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