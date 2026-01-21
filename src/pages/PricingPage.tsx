import { Link } from 'react-router-dom';
import { Check, Zap, Building, Sparkles, ArrowRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface PricingPlan {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  icon: typeof Zap;
  description: string;
  cta: {
    text: string;
    link: string;
  };
}

const plans: PricingPlan[] = [
  {
    name: 'Basic',
    monthlyPrice: 299,
    yearlyPrice: 239,
    description: 'For deg som vil ha referat fra fysiske møter',
    icon: Zap,
    features: [
      'Ubegrenset antall møter',
      'Transkripsjon på norsk og engelsk',
      'AI-drevet oppsummering',
      'Eksport til PDF og Word',
      'Standard support',
    ],
    cta: {
      text: 'Start gratis prøveperiode',
      link: '/onboarding'
    }
  },
  {
    name: 'Pro',
    monthlyPrice: 399,
    yearlyPrice: 319,
    description: 'For deg som vil ha referat fra fysiske & digitale møter',
    icon: Sparkles,
    features: [
      'Alt i Basic',
      'Prioritert transkripsjon',
      'Kalenderintegrasjon',
      'Teams/Zoom integrasjon',
      'Prioritert support',
    ],
    cta: {
      text: 'Kommer snart',
      link: '/'
    }
  },
  {
    name: 'Enterprise',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Skreddersydd for store organisasjoner',
    icon: Building,
    features: [
      'Alt i Pro',
      'Dedikert support',
      'SLA-garanti',
      'On-premise løsning',
      'Egen AI-modell',
      'SSO/SAML',
      'API-tilgang',
    ],
    cta: {
      text: 'Kontakt salg',
      link: '/contact'
    }
  }
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const formatPrice = (price: number) => {
    if (price === 0) return 'Kontakt oss';
    return `${price} kr/mnd`;
  };

  return (
    <main className="pt-16">
      {/* Hero Section */}
      <section className="hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              <span className="gradient-text">Velg din plan</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Start gratis og oppgrader når du er klar. Spar 20% med årlig fakturering.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pt-12 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center p-1 rounded-xl bg-white shadow-sm border border-gray-200">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={cn(
                  "relative px-6 py-2 text-sm font-medium rounded-lg transition-colors",
                  billingPeriod === 'monthly' 
                    ? "text-blue-700" 
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                Månedlig
                {billingPeriod === 'monthly' && (
                  <motion.div
                    layoutId="billing-period"
                    className="absolute inset-0 bg-blue-100 rounded-lg -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
              <div className="w-px h-6 bg-gray-200 mx-1" />
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={cn(
                  "relative px-6 py-2 text-sm font-medium rounded-lg transition-colors",
                  billingPeriod === 'yearly'
                    ? "text-blue-700"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                Årlig
                <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                  Spar 20%
                </span>
                {billingPeriod === 'yearly' && (
                  <motion.div
                    layoutId="billing-period"
                    className="absolute inset-0 bg-blue-100 rounded-lg -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {plans.map((plan, index) => (
              <div key={index} className="feature-card flex flex-col">
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <plan.icon className="h-6 w-6 text-blue-600 mr-2" />
                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold">
                        {billingPeriod === 'monthly' 
                          ? formatPrice(plan.monthlyPrice)
                          : formatPrice(plan.yearlyPrice)}
                      </span>
                      {plan.monthlyPrice > 0 && (
                        <div className="ml-2 flex flex-col items-start">
                          {billingPeriod === 'yearly' && (
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(plan.monthlyPrice)}
                            </span>
                          )}
                          <span className="text-sm text-gray-600">
                            {billingPeriod === 'yearly' && (
                              <span className="text-green-600">20% rabatt</span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600">
                    {plan.description}
                  </p>
                </div>
                
                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link 
                  to={plan.cta.link} 
                  className={cn(
                    "text-center",
                    index === 0 ? "button-primary" : "button-secondary inline-flex items-center justify-center"
                  )}
                >
                  <span>{plan.cta.text}</span>
                  {index === 2 && <ArrowRight className="ml-2 h-4 w-4" />}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Ofte stilte spørsmål</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Hvordan fungerer prøveperioden?
              </h3>
              <p className="text-gray-600">
                Du får tilgang til alle Pro-funksjoner i 14 dager. Ingen kredittkort kreves, 
                og du kan når som helst avslutte prøveperioden.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Kan jeg bytte plan senere?
              </h3>
              <p className="text-gray-600">
                Ja, du kan oppgradere eller nedgradere når som helst. Endringen trer i kraft 
                ved neste faktureringsperiode.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Hva skjer med mine data hvis jeg avslutter?
              </h3>
              <p className="text-gray-600">
                Du har 30 dager på å eksportere dine data etter oppsigelse. Etter dette blir 
                alle data permanent slettet i henhold til GDPR.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Tilbyr dere rabatt for årlig betaling?
              </h3>
              <p className="text-gray-600">
                Ja, du får 2 måneder gratis ved årlig betaling på alle våre planer.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}