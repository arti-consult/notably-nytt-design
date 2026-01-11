export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'standard' | 'formal' | 'agile' | 'sales' | 'hr';
  sections: string[];
  isDefault?: boolean;
  isCustom?: boolean;
  isCustomPrompt?: boolean;  // True for fully custom AI prompt templates
  customPrompt?: string;      // The user's custom prompt/instructions for AI
  icon: string;
  metadata?: {
    aiGenerated?: boolean;
    originalDescription?: string;
    sectionsDetail?: any[];
  };
}

export const mockTemplates: Template[] = [
  {
    id: 'template-1',
    name: 'Standard møtereferat',
    description: 'En enkel og allsidig mal for generelle møter',
    category: 'standard',
    sections: [
      'Møteinformasjon',
      'Deltakere',
      'Agenda',
      'Diskusjonspunkter',
      'Beslutninger',
      'Oppfølgingspunkter',
      'Neste møte'
    ],
    isDefault: true,
    icon: '📝'
  },
  {
    id: 'template-2',
    name: 'Styremøte',
    description: 'Formell mal for styremøter og generalforsamlinger',
    category: 'formal',
    sections: [
      'Møtets åpning',
      'Godkjenning av innkalling',
      'Godkjenning av protokoll fra forrige møte',
      'Saker til behandling',
      'Vedtak',
      'Eventuelt',
      'Møtets avslutning'
    ],
    icon: '🏛️'
  },
  {
    id: 'template-3',
    name: 'Medarbeidersamtale',
    description: 'Mal for en-til-en samtaler mellom leder og medarbeider',
    category: 'hr',
    sections: [
      'Hvordan har du det?',
      'Fremgang siden sist',
      'Utfordringer',
      'Mål og prioriteringer',
      'Støtte du trenger',
      'Tilbakemeldinger',
      'Aksjoner'
    ],
    icon: '👥'
  },
  {
    id: 'template-6',
    name: 'Salgsmøte',
    description: 'Mal for salgsmøter og kundeoppfølging',
    category: 'sales',
    sections: [
      'Kundeinfo',
      'Behov og utfordringer',
      'Presenterte løsninger',
      'Innvendinger',
      'Neste steg',
      'Tidslinje',
      'Oppfølgingspunkter'
    ],
    icon: '💼'
  },
  {
    id: 'template-7',
    name: 'Kundemøte',
    description: 'Mal for møter med eksterne kunder og partnere',
    category: 'sales',
    sections: [
      'Møtedeltakere',
      'Statusoppdatering',
      'Gjennomgang av leveranser',
      'Feedback',
      'Kommende milepæler',
      'Aksjoner',
      'Dato for neste møte'
    ],
    icon: '🤝'
  },
  {
    id: 'template-8',
    name: 'Prosjektstatus',
    description: 'Mal for ukentlige eller månedlige prosjektoppdateringer',
    category: 'standard',
    sections: [
      'Prosjektstatus',
      'Fullførte oppgaver',
      'Pågående arbeid',
      'Kommende milepæler',
      'Risiko og blokkere',
      'Ressursbehov',
      'Beslutninger trengs'
    ],
    icon: '📊'
  },
  {
    id: 'template-9',
    name: 'Intervju',
    description: 'Mal for jobbintervjuer og kandidatvurderinger',
    category: 'hr',
    sections: [
      'Kandidatinfo',
      'Bakgrunn og erfaring',
      'Tekniske ferdigheter',
      'Kulturell match',
      'Motivasjon',
      'Spørsmål fra kandidat',
      'Samlet vurdering',
      'Anbefaling'
    ],
    icon: '🎯'
  },
  {
    id: 'template-10',
    name: 'Ledermøte',
    description: 'Mal for ledergruppe- og ledelsesmøter',
    category: 'formal',
    sections: [
      'Statusoppdatering per område',
      'Nøkkeltall og KPIer',
      'Strategiske saker',
      'Ressurser og kapasitet',
      'Risikoer og utfordringer',
      'Beslutninger',
      'Oppfølgingspunkter'
    ],
    icon: '👔'
  }
];

export const templateCategories = [
  { id: 'all', name: 'Alle maler' },
  { id: 'standard', name: 'Standard' },
  { id: 'formal', name: 'Formelle' },
  { id: 'sales', name: 'Salg' },
  { id: 'hr', name: 'HR' }
];

export const getTemplatesByCategory = (category: string): Template[] => {
  if (category === 'all') return mockTemplates;
  return mockTemplates.filter(t => t.category === category);
};

export const getTemplateById = (id: string): Template | undefined => {
  return mockTemplates.find(t => t.id === id);
};
