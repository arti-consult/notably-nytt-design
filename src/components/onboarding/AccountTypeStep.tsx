import { motion } from 'framer-motion';
import { User, Users, Building2, ArrowRight, Check, Sparkles } from 'lucide-react';
import { useOnboarding, AccountType } from '@/contexts/OnboardingContext';
import { cn } from '@/lib/utils';

export default function AccountTypeStep() {
  const { updateUserData, goToNextStep } = useOnboarding();

  const accountTypes = [
    {
      type: 'solo' as AccountType,
      icon: User,
      title: 'Solo',
      description: 'For deg som jobber alene',
      price: '399 kr/mnd',
      cta: 'Start med Solo',
      benefits: [
        'Ubegrenset opptak',
        'AI-drevne referater',
        'Kalenderintegrasjon'
      ],
      color: 'from-blue-500 to-blue-600',
      borderColor: 'hover:border-blue-500',
      bgColor: 'bg-blue-50',
      iconGradient: 'from-blue-400 to-blue-600'
    },
    {
      type: 'business' as AccountType,
      icon: Users,
      title: 'Bedrift',
      description: 'For team på 2-19 personer',
      price: '399 kr/mnd per medlem',
      cta: 'Start med Bedrift',
      benefits: [
        'Alt i Solo',
        'Team-samarbeid',
        'Deling av møter',
        'Sentralisert betaling'
      ],
      color: 'from-blue-500 to-blue-600',
      borderColor: 'hover:border-blue-500',
      bgColor: 'bg-blue-50',
      iconGradient: 'from-blue-400 to-blue-600'
    },
    {
      type: 'enterprise' as AccountType,
      icon: Building2,
      title: 'Enterprise',
      description: 'For organisasjoner med 20+ ansatte',
      price: 'Kontakt oss',
      cta: 'Snakk med oss',
      benefits: [
        'Alt i Bedrift',
        'Dedikert kundekontakt',
        'Prioritert support',
        'Skreddersydd onboarding',
        'SLA-avtale'
      ],
      color: 'from-blue-600 to-blue-700',
      borderColor: 'hover:border-blue-600',
      bgColor: 'bg-blue-50',
      iconGradient: 'from-blue-500 to-blue-700'
    }
  ];

  const handleSelectAccountType = (type: AccountType) => {
    updateUserData({ accountType: type });
    goToNextStep();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto"
    >
      <div className="text-center mb-12">
        {/* Free Trial Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-50 to-green-100 rounded-full border border-green-200 mb-6"
        >
          <Sparkles className="h-4 w-4 text-green-600 mr-2" />
          <span className="text-sm font-semibold text-green-900">
            14 dager gratis prøveperiode
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4"
        >
          Velg din kontotype
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-600"
        >
          Velg planen som passer best for deg
        </motion.p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {accountTypes.map((accountType, index) => (
          <motion.button
            key={accountType.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            onClick={() => handleSelectAccountType(accountType.type)}
            className={cn(
              'relative group text-left p-8 rounded-2xl border-2 border-gray-200',
              'transition-all duration-300 hover:scale-105 hover:shadow-2xl',
              accountType.borderColor,
              'bg-white'
            )}
          >
            {/* Icon */}
            <div className={cn(
              'w-16 h-16 rounded-xl flex items-center justify-center mb-6',
              'bg-gradient-to-br', accountType.iconGradient,
              'shadow-lg group-hover:shadow-xl transition-shadow'
            )}>
              <accountType.icon className="h-8 w-8 text-white" strokeWidth={2} />
            </div>

            {/* Title & Description */}
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {accountType.title}
            </h3>
            <p className="text-gray-600 mb-4">
              {accountType.description}
            </p>

            {/* Pricing */}
            <div className="mb-6">
              <p className="text-lg font-semibold text-gray-900">
                {accountType.price}
              </p>
            </div>

            {/* Benefits */}
            <ul className="space-y-3 mb-8">
              {accountType.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start text-sm text-gray-700">
                  <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className={cn(
              'flex items-center justify-between pt-4 border-t border-gray-200',
              'group-hover:border-gray-300 transition-colors'
            )}>
              <span className="font-medium text-gray-900">
                {accountType.cta}
              </span>
              <ArrowRight className={cn(
                'h-5 w-5 text-gray-400 group-hover:text-gray-900',
                'group-hover:translate-x-1 transition-all'
              )} />
            </div>

            {/* Hover effect overlay */}
            <div className={cn(
              'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5',
              'bg-gradient-to-br', accountType.color,
              'transition-opacity pointer-events-none'
            )} />
          </motion.button>
        ))}
      </div>

      {/* Social Proof */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center mt-12 pt-8 border-t border-gray-200"
      >
        <p className="text-sm text-gray-600">
          <Check className="inline h-4 w-4 text-green-600 mr-1 -mt-0.5" />
          Betrodd av 500+ norske bedrifter
        </p>
      </motion.div>
    </motion.div>
  );
}
