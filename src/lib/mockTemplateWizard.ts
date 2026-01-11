// Mock data for AI Template Wizard

export interface TemplateSection {
  id: string;
  title: string;
  aiInstruction: string;
  exampleOutput: string;
  icon: string;
}

export interface TemplateProposal {
  id: string;
  name: string;
  description: string;
  icon: string;
  targetAudience: string;
  sections: TemplateSection[];
  estimatedLength: string;
}

// Mock AI-generated template proposals based on user description
export const generateTemplateProposals = (userDescription: string): TemplateProposal[] => {
  // Simple keyword matching for demo - in real app this would be actual AI
  const keywords = userDescription.toLowerCase();

  if (keywords.includes('status') || keywords.includes('team') || keywords.includes('ukentlig')) {
    return statusMeetingProposals;
  } else if (keywords.includes('kunde') || keywords.includes('klient') || keywords.includes('salg')) {
    return clientMeetingProposals;
  } else if (keywords.includes('workshop') || keywords.includes('brainstorm') || keywords.includes('idé')) {
    return workshopProposals;
  } else if (keywords.includes('teknisk') || keywords.includes('utvikler') || keywords.includes('sprint')) {
    return technicalMeetingProposals;
  }

  // Default to general meeting proposals
  return generalMeetingProposals;
};

// Status Meeting Proposals
const statusMeetingProposals: TemplateProposal[] = [
  {
    id: 'status-structured',
    name: 'Strukturert statusoppdatering',
    description: 'Perfekt for ukentlige teammøter med fokus på fremdrift og blokkere',
    icon: '📊',
    targetAudience: 'Team managers og prosjektledere',
    estimatedLength: '2-3 sider',
    sections: [
      {
        id: 'summary',
        title: 'Oppsummering',
        aiInstruction: 'Skriv et kort sammendrag (2-3 setninger) som oppsummerer møtets hovedpunkter og overordnet status for teamet.',
        exampleOutput: 'I dagens statusmøte diskuterte vi fremgang på Q1-målene. Teamet ligger godt an med 75% av målene på grønt, men vi identifiserte to kritiske blokkere som må løses før neste sprint.',
        icon: '📝'
      },
      {
        id: 'per-person',
        title: 'Status per person',
        aiInstruction: 'List opp hvert teammedlem med navn, hva de jobber med nå, og deres progresjon. Inkluder eventuelle utfordringer de møter.',
        exampleOutput: '**Anna Olsen** - Jobber med brukerautentisering. 80% ferdig, venter på API-dokumentasjon fra backend-teamet.\n\n**Per Hansen** - Implementerer ny dashboard. På skjema, estimert ferdig på fredag.',
        icon: '👤'
      },
      {
        id: 'blockers',
        title: 'Blokkere og utfordringer',
        aiInstruction: 'Identifiser og list opp alle hindringer som ble nevnt. For hver blocker, inkluder hvem det påvirker og foreslått løsning hvis diskutert.',
        exampleOutput: '- **API-dokumentasjon mangler**: Påvirker Anna. Martin tar ansvar for å følge opp med backend-teamet innen tirsdag.\n- **Testmiljø nede**: Påvirker hele teamet. IT-avdelingen varslet, estimert løst i morgen.',
        icon: '🚧'
      },
      {
        id: 'action-items',
        title: 'Handlingspunkter',
        aiInstruction: 'Ekstraher alle konkrete oppgaver som ble tildelt. Inkluder ansvarlig person og frist hvis nevnt.',
        exampleOutput: '- [ ] Martin følger opp API-dokumentasjon med backend (frist: tirsdag)\n- [ ] Anna setter opp testcase for login-flow (frist: torsdag)\n- [ ] Per booker møte med design-teamet (frist: innen uke 23)',
        icon: '✅'
      }
    ]
  },
  {
    id: 'status-agile',
    name: 'Agile team standup',
    description: 'Kompakt format basert på "hva gjorde jeg / hva skal jeg gjøre / blokkere"',
    icon: '⚡',
    targetAudience: 'Scrum teams og agile-metodikk',
    estimatedLength: '1-2 sider',
    sections: [
      {
        id: 'yesterday',
        title: 'Hva gjorde vi siden sist?',
        aiInstruction: 'Oppsummer hva teamet har fullført siden forrige møte. Fokuser på konkrete leveranser og milestones.',
        exampleOutput: '- Ferdigstilt brukerregistrering med e-postbekreftelse\n- Deployet versjon 2.3 til staging\n- Fikset 8 bugs fra forrige sprint review',
        icon: '✅'
      },
      {
        id: 'today',
        title: 'Hva skal vi gjøre nå?',
        aiInstruction: 'List opp planlagte aktiviteter og fokusområder for teamet fremover. Inkluder prioriteringer hvis nevnt.',
        exampleOutput: '- **Prioritet 1**: Fullføre integrasjon med betalingssystem\n- **Prioritet 2**: Starte på mobilapp prototype\n- Code review session kl 14:00',
        icon: '🎯'
      },
      {
        id: 'blockers-agile',
        title: 'Blokkere',
        aiInstruction: 'Identifiser hindringer kort og konsist. Kun kritiske blokkere som stopper fremgang.',
        exampleOutput: '- Venter på godkjenning fra sikkerhetsteamet\n- Trenger tilgang til prod-database',
        icon: '⛔'
      }
    ]
  },
  {
    id: 'status-executive',
    name: 'Executive Summary',
    description: 'Kort og konsis for ledermøter - fokus på beslutninger og nøkkeltall',
    icon: '📈',
    targetAudience: 'Ledergrupper og executive team',
    estimatedLength: '1 side',
    sections: [
      {
        id: 'key-decisions',
        title: 'Beslutninger',
        aiInstruction: 'List opp kun de viktigste beslutningene som ble tatt. Vær ekstremt konsis.',
        exampleOutput: '1. Godkjent budsjett på 500k for Q2\n2. Starter rekruttering av 2 utviklere\n3. Utsetter lansering til juni pga. testfase',
        icon: '✅'
      },
      {
        id: 'metrics',
        title: 'Nøkkeltall',
        aiInstruction: 'Ekstraher alle tall, prosenter, og målinger som ble diskutert. Presenter som bulletpoints.',
        exampleOutput: '- MRR: 450k (+12% fra forrige måned)\n- Churn rate: 3.2% (mål: <5%)\n- NPS score: 68 (+5 poeng)',
        icon: '📊'
      },
      {
        id: 'risks-exec',
        title: 'Risikoer og oppfølging',
        aiInstruction: 'Identifiser kritiske risikoer og hvem som følger opp. Maksimalt 3-4 punkter.',
        exampleOutput: '- Kunde X truet med å si opp kontrakt. Anna følger opp.\n- Serverstabilitet: Martin har møte med infrastruktur-teamet mandag.',
        icon: '⚠️'
      }
    ]
  }
];

// Client Meeting Proposals
const clientMeetingProposals: TemplateProposal[] = [
  {
    id: 'client-standard',
    name: 'Kundemøte - Standard',
    description: 'Profesjonelt referat for kundemøter med fokus på avtaler og oppfølging',
    icon: '🤝',
    targetAudience: 'Salgsteam og kundeansvarlige',
    estimatedLength: '2 sider',
    sections: [
      {
        id: 'client-info',
        title: 'Møteinformasjon',
        aiInstruction: 'Inkluder møtedato, deltakere (både fra vår side og kunde), møtets formål.',
        exampleOutput: '**Dato**: 15. januar 2025\n**Deltakere fra vår side**: Anna (Account Manager), Per (Teknisk konsulent)\n**Deltakere fra kunde**: Lisa Berg (CEO), Tom Hansen (IT-sjef)\n**Formål**: Diskutere løsningsforslag for CRM-integrasjon',
        icon: '📋'
      },
      {
        id: 'client-needs',
        title: 'Kundens behov',
        aiInstruction: 'Oppsummer hva kunden uttrykker som sine primære behov og utfordringer.',
        exampleOutput: '- Trenger sømløs integrasjon med eksisterende Salesforce-oppsett\n- Ønsker onboarding av 50 brukere innen utgangen av Q1\n- Bekymret for datatrygghet og GDPR-compliance',
        icon: '💼'
      },
      {
        id: 'our-proposal',
        title: 'Vårt forslag',
        aiInstruction: 'Beskriv løsningen eller produktet som ble presentert. Inkluder prising hvis diskutert.',
        exampleOutput: 'Foreslått løsning: Enterprise-pakke med dedikert integrasjon\n- 3 måneders implementeringsperiode\n- Full GDPR-compliance og datalagring i Norge\n- Pris: 150k setup + 25k/mnd',
        icon: '✨'
      },
      {
        id: 'agreements',
        title: 'Avtaler og neste steg',
        aiInstruction: 'List opp hva partene ble enige om, og konkrete neste steg med ansvarlige og frister.',
        exampleOutput: '**Avtalt:**\n- Kunden tar beslutning internt innen 20. januar\n- Vi sender detaljert teknisk spesifikasjon\n\n**Neste steg:**\n- Anna sender tilbud formelt (frist: i morgen)\n- Per setter opp demo-miljø (frist: 18. januar)\n- Oppfølgingsmøte booket til 25. januar',
        icon: '🤝'
      }
    ]
  }
];

// Workshop Proposals
const workshopProposals: TemplateProposal[] = [
  {
    id: 'workshop-creative',
    name: 'Workshop & Brainstorming',
    description: 'Fang opp alle ideer og kreative diskusjoner fra workshop-sesjoner',
    icon: '💡',
    targetAudience: 'Kreative team og innovasjonsworkshops',
    estimatedLength: '3-4 sider',
    sections: [
      {
        id: 'workshop-goal',
        title: 'Mål for workshopen',
        aiInstruction: 'Beskriv workshopens formål og hva deltakerne skulle oppnå.',
        exampleOutput: 'Workshopen hadde som mål å generere nye produktideer for Q2. Fokus på å løse kundeproblem: "vanskelig å finne tidligere møtenotater".',
        icon: '🎯'
      },
      {
        id: 'ideas-generated',
        title: 'Ideer som ble generert',
        aiInstruction: 'List opp alle ideer som kom frem, både store og små. Grupper gjerne relaterte ideer sammen.',
        exampleOutput: '**Søkeforbedringer:**\n- AI-drevet semantisk søk\n- Automatisk tagging av møter\n- Ansiktsgjenkjenning av deltakere\n\n**Nye features:**\n- Integrasjon med Slack\n- Mobile app med offline-støtte\n- Voice commands for søk',
        icon: '💡'
      },
      {
        id: 'voting-results',
        title: 'Prioritering og avstemming',
        aiInstruction: 'Hvis det var avstemming eller prioritering av ideer, presenter resultatet. Inkluder topp 3-5 ideer.',
        exampleOutput: '**Topp 3 ideer (basert på stemmegivning):**\n1. AI-drevet semantisk søk (12 stemmer)\n2. Slack-integrasjon (10 stemmer)\n3. Automatisk tagging (8 stemmer)',
        icon: '⭐'
      },
      {
        id: 'next-actions-workshop',
        title: 'Veien videre',
        aiInstruction: 'Beskriv konkrete neste steg for å ta ideene videre.',
        exampleOutput: '- Per lager teknisk feasibility-analyse for topp 3 ideer (frist: neste uke)\n- Anna booker oppfølgingsmøte med product team\n- Prototype av AI-søk skal lages til neste sprint review',
        icon: '➡️'
      }
    ]
  }
];

// Technical Meeting Proposals
const technicalMeetingProposals: TemplateProposal[] = [
  {
    id: 'technical-detailed',
    name: 'Teknisk diskusjon - Detaljert',
    description: 'For tekniske møter med fokus på arkitektur, kode og beslutninger',
    icon: '💻',
    targetAudience: 'Utviklere og tekniske team',
    estimatedLength: '3-4 sider',
    sections: [
      {
        id: 'tech-context',
        title: 'Teknisk kontekst',
        aiInstruction: 'Beskriv den tekniske utfordringen eller temaet som ble diskutert. Inkluder relevante systemer og teknologier.',
        exampleOutput: 'Diskusjon om hvordan vi skal håndtere WebSocket-tilkoblinger i den nye real-time chat-funksjonen. Nåværende løsning med REST polling skalerer ikke godt.',
        icon: '🔧'
      },
      {
        id: 'tech-decisions',
        title: 'Tekniske beslutninger',
        aiInstruction: 'List opp alle tekniske valg som ble tatt. Inkluder rationale bak beslutningene hvis diskutert.',
        exampleOutput: '1. **Valgt Socket.io over native WebSockets**\n   - Rationale: Bedre fallback-støtte, enklere reconnection logic\n\n2. **Redis for session management**\n   - Rationale: Trenger persistence og kan dele sessions på tvers av servere',
        icon: '✅'
      },
      {
        id: 'code-examples',
        title: 'Kodeeksempler',
        aiInstruction: 'Hvis kode ble diskutert eller skrevet på tavle, inkluder eksemplene. Behold syntaks og formattering.',
        exampleOutput: '```javascript\n// Foreslått struktur for WebSocket håndtering\nio.on("connection", (socket) => {\n  socket.on("message", async (data) => {\n    await processMessage(data);\n    io.emit("newMessage", data);\n  });\n});\n```',
        icon: '📝'
      },
      {
        id: 'tech-todos',
        title: 'Tekniske TODOs',
        aiInstruction: 'Ekstraher alle tekniske oppgaver som må gjøres. Inkluder ansvarlig person.',
        exampleOutput: '- [ ] Martin: Sett opp Socket.io server i dev-miljø\n- [ ] Anna: Skriv WebSocket client wrapper\n- [ ] Per: Load testing med 1000 samtidige connections\n- [ ] Team: Code review på fredag kl 14',
        icon: '📋'
      }
    ]
  }
];

// General Meeting Proposals (fallback)
const generalMeetingProposals: TemplateProposal[] = [
  {
    id: 'general-standard',
    name: 'Standard møtereferat',
    description: 'En balansert mal som fungerer for de fleste typer møter',
    icon: '📝',
    targetAudience: 'Alle typer møter',
    estimatedLength: '2 sider',
    sections: [
      {
        id: 'meeting-summary',
        title: 'Sammendrag',
        aiInstruction: 'Skriv et kort sammendrag (3-4 setninger) av møtet. Inkluder formål og hovedresultat.',
        exampleOutput: 'Møtet hadde som formål å diskutere prosjektstatus og planlegge neste fase. Teamet er fornøyd med fremgangen så langt. Vi identifiserte noen utfordringer som må løses. Neste møte er booket til neste onsdag.',
        icon: '📝'
      },
      {
        id: 'participants-general',
        title: 'Deltakere',
        aiInstruction: 'List opp alle som deltok i møtet.',
        exampleOutput: '- Anna Olsen (Prosjektleder)\n- Per Hansen (Utvikler)\n- Lisa Berg (Designer)\n- Tom Lie (Produkteier)',
        icon: '👥'
      },
      {
        id: 'discussion-points',
        title: 'Diskusjonspunkter',
        aiInstruction: 'Oppsummer de viktigste temaene som ble diskutert. Organiser i bullet points eller nummerert liste.',
        exampleOutput: '1. **Prosjektstatus**: 60% ferdig, ligger an til lansering i mars\n2. **Budsjett**: Innenfor rammen, men må følge nøye med fremover\n3. **Ressurser**: Trenger å ansette en ekstra utvikler\n4. **Risiko**: Leverandør kan bli forsinket, lager backup-plan',
        icon: '💬'
      },
      {
        id: 'decisions-general',
        title: 'Beslutninger',
        aiInstruction: 'List opp alle vedtak som ble tatt i møtet.',
        exampleOutput: '- Godkjent designforslag fra Lisa\n- Starter rekrutteringsprosess for ny utvikler\n- Flytter lansering en uke for å få mer tid til testing',
        icon: '✅'
      },
      {
        id: 'action-items-general',
        title: 'Handlingspunkter',
        aiInstruction: 'Ekstraher konkrete oppgaver med ansvarlig person og frist.',
        exampleOutput: '- [ ] Anna: Publiser jobbannons (frist: i morgen)\n- [ ] Per: Oppdater prosjektplan (frist: fredag)\n- [ ] Lisa: Send finalt design til utviklingsteamet (frist: onsdag)',
        icon: '🎯'
      }
    ]
  },
  {
    id: 'general-minimal',
    name: 'Minimalistisk referat',
    description: 'Kort og konsis - bare det viktigste',
    icon: '⚡',
    targetAudience: 'Raske statusoppdateringer',
    estimatedLength: '1 side',
    sections: [
      {
        id: 'key-points',
        title: 'Hovedpunkter',
        aiInstruction: 'List opp de 3-5 viktigste tingene fra møtet. Vær ekstremt konsis.',
        exampleOutput: '- Prosjektet er på skjema\n- Trenger å ansette en utvikler\n- Lansering planlagt til mars\n- Neste møte: onsdag 15. jan',
        icon: '📌'
      },
      {
        id: 'decisions-minimal',
        title: 'Beslutninger',
        aiInstruction: 'Kun kritiske beslutninger. Maksimalt 3-4 punkter.',
        exampleOutput: '- Godkjent budsjett for Q1\n- Starter rekruttering\n- Design er approved',
        icon: '✅'
      },
      {
        id: 'todos-minimal',
        title: 'TODO',
        aiInstruction: 'Kort liste over hvem som skal gjøre hva.',
        exampleOutput: '- Anna: Jobbannons\n- Per: Prosjektplan\n- Lisa: Send design',
        icon: '📋'
      }
    ]
  }
];

// Mock function to simulate AI adjusting a section
export const generateAdjustedSection = (
  currentInstruction: string,
  userRequest: string
): { instruction: string; example: string } => {
  // Simple simulation - in real app this would be actual AI
  const request = userRequest.toLowerCase();

  if (request.includes('kortere') || request.includes('kort')) {
    return {
      instruction: currentInstruction + ' Hold det veldig kort og konsis, maksimalt 2-3 setninger.',
      example: 'I dagens statusmøte diskuterte vi fremgang på Q1-målene. Teamet ligger godt an.'
    };
  }

  if (request.includes('lengre') || request.includes('detaljert') || request.includes('mer info')) {
    return {
      instruction: currentInstruction + ' Gi en grundig og detaljert beskrivelse med alle relevante detaljer.',
      example: 'I dagens statusmøte diskuterte vi fremgang på Q1-målene. Teamet ligger godt an med 75% av målene på grønt. Vi gjennomgikk hver enkelt milepæl og identifiserte to kritiske blokkere. Anna presenterte en løsning for den første blokkeren som teamet godkjente. For den andre blokkeren ble det besluttet å eskalere til ledergruppen.'
    };
  }

  if (request.includes('formelt') || request.includes('profesjonelt')) {
    return {
      instruction: currentInstruction + ' Bruk formelt og profesjonelt språk som egner seg for offisiell dokumentasjon.',
      example: 'I statusmøtet per dags dato ble prosjektets fremskritt gjennomgått. Gjennomføringen av Q1-målsettinger er tilfredsstillende, med 75% av målene klassifisert som på skjema. To kritiske hindringer ble identifisert og vil bli adressert i henhold til vedlagte handlingsplan.'
    };
  }

  if (request.includes('uformelt') || request.includes('casual') || request.includes('avslappet')) {
    return {
      instruction: currentInstruction + ' Bruk et avslappet og uformelt språk som i en vanlig samtale.',
      example: 'Vi hadde et bra møte i dag! Det meste går som planlagt. Vi har et par ting vi må fikse, men teamet har kontroll. Anna har en god plan for hvordan vi løser det.'
    };
  }

  // Default: just return original with minor modification
  return {
    instruction: currentInstruction + ' ' + userRequest,
    example: 'Eksempel-output vil bli oppdatert basert på dine justeringer.'
  };
};

// Quick suggestions for adjusting sections
export const quickAdjustmentSuggestions = [
  { label: 'Gjør kortere (1 setning)', value: 'Gjør dette mye kortere, maksimalt én setning' },
  { label: 'Legg til nøkkeltall', value: 'Inkluder alle tall, prosenter og metrics som nevnes' },
  { label: 'Fokus kun på beslutninger', value: 'Ekstraher kun konkrete beslutninger, ignorer diskusjon' },
  { label: 'Mer formelt språk', value: 'Bruk mer formelt og profesjonelt språk' },
  { label: 'Mer detaljer', value: 'Gi en mer detaljert og grundig beskrivelse' },
];

// Generate a custom AI prompt based on user description
export const generateCustomPrompt = (userDescription: string): { name: string; icon: string; content: string } => {
  const keywords = userDescription.toLowerCase();

  // Determine template type based on keywords
  let templateName = 'AI-generert mal';
  let icon = '📝';
  let sections: string[] = [];

  if (keywords.includes('status') || keywords.includes('team') || keywords.includes('ukentlig')) {
    templateName = 'Statusmøte - møtereferat';
    icon = '📊';
    sections = [
      `# ${templateName}

📋 Møteoversikt

{{paragraph|Skriv et sammendrag på 250-600 ord som dekker hele statusmøtet. Beskriv kort møtets kontekst slik den fremkommer i transkripsjonen, hovedformålet med møtet, hvilke deler av prosjektet som ble gjennomgått, og hvordan møtet konkluderte. Ikke beskriv småprat, tekniske avklaringer eller generelle kommentarer uten prosjektmessig innhold.}}

📊 Status per område

{{table|Oppsummer status for de områdene eller arbeidsstrømmene i prosjektet som faktisk ble diskutert i møtet. Bruk en Markdown-tabell med kolonnene: Område, Status, Nøkkelpunkter, Frist. "Status" bør være kort (for eksempel "på plan", "forsinket", "avventer avklaring"). Ikke legg til egne forslag; skriv kun det som tydelig fremgår av diskusjonen.}}

✅ Beslutninger

{{checklist|List kun beslutninger som eksplisitt helt tydelig ble tatt i møtet. Eksempler kan være endring i scope, prioritering, resursbruk eller tekniske valg. Hver beslutning formuleres kort og konkret. Ta med navn på ansvarlig dersom dette er tydelig nevnt. Hvis ingen tydelige beslutninger ble tatt, skriv "Ingen beslutninger ble eksplisitt tatt i møtet." Ikke angi beslutninger basert på løse diskusjoner.}}

🎯 Neste steg og leveranser

{{table|Returner konkrete neste steg og leveranser som eksplisitt ble avtalt i møtet. Bruk en Markdown-tabell med kolonner: Ansvarlig, Leveranse/oppgave, Frist, Status. Hvis ansvarlig eller frist ikke fremgår tydelig, skriv "Ikke spesifisert" i den cellen. Ikke legg til oppgaver som kun ble nevnt i forbifarten eller ikke ble avtalt. Hvis ingen neste steg eller leveranser ble avtalt, legg til rad med "Ikke spesifisert" i alle celler. Ikke fyll på egne forslag.}}

⚠️ Risikoer og avhengigheter

{{bulletedList|List opp de viktige risikoene, avhengighetene og problemstillingene som ble diskutert i møtet, knyttet til fremdrift, kvalitet, økonomi, ressurser eller eksterne faktorer. Ett punkt per risiko eller avhengighet. Beskriv kort hva risikoen består i, og eventuelle planlagte håndteringstiltak dersom disse ble nevnt. Ikke finn på nye risikoer; og ikke skriv noe hvis ingen risikoer eller avhengigheter ble diskutert.}}`
    ];
  } else if (keywords.includes('kunde') || keywords.includes('klient') || keywords.includes('salg')) {
    templateName = 'Kundemøte - møtereferat';
    icon = '🤝';
    sections = [
      `# ${templateName}

📋 Møteinformasjon

{{paragraph|Inkluder møtedato (hvis nevnt), deltakere fra både vår side og kundens side (hvis nevnt), samt møtets formål og hovedtema.}}

💼 Kundens behov og utfordringer

{{bulletedList|List opp hva kunden uttrykker som sine primære behov, utfordringer og ønsker. Ett punkt per behov/utfordring. Fokuser kun på det kunden faktisk sa, ikke hva du tror de trenger.}}

✨ Vårt tilbud og løsning

{{paragraph|Beskriv løsningen eller produktet som ble presentert for kunden. Inkluder prising, leveransetid, og andre nøkkeldetaljer hvis dette ble diskutert. Vær konsis men komplett.}}

🤝 Avtaler og neste steg

{{mixed|Del dette i to seksjoner:

**Avtalt:**
(Hva ble partene enige om?)

**Neste steg:**
(Konkrete oppgaver med ansvarlig person og frist hvis nevnt)}}

💎 Kundens tilbakemeldinger

{{bulletedList|List opp direkte tilbakemeldinger, spørsmål eller bekymringer som kunden ga uttrykk for. Dette kan inkludere positive reaksjoner så vel som bekymringer.}}`
    ];
  } else if (keywords.includes('workshop') || keywords.includes('brainstorm') || keywords.includes('idé')) {
    templateName = 'Workshop - møtereferat';
    icon = '💡';
    sections = [
      `# ${templateName}

🎯 Workshopens mål

{{paragraph|Beskriv workshopens formål og hva deltakerne skulle oppnå. Inkluder kontekst for hvorfor workshopen ble holdt.}}

💡 Ideer som ble generert

{{bulletedList|List opp alle ideer som kom frem under workshopen. Grupper relaterte ideer sammen hvis det gir mening. Ta med både store og små ideer.}}

⭐ Prioritering

{{mixed|Hvis det var avstemming eller prioritering av ideer, presenter resultatet her. Inkluder de mest populære ideene/forslagene og eventuelt antall stemmer eller prioritetsranking.}}

➡️ Veien videre

{{bulletedList|Beskriv konkrete neste steg for å ta ideene videre. Inkluder ansvarlig person og frister hvis diskutert.}}

📝 Andre notater

{{paragraph|Eventuelle andre viktige observasjoner, diskusjoner eller innsikter fra workshopen som ikke passer inn i andre seksjoner.}}`
    ];
  } else if (keywords.includes('teknisk') || keywords.includes('utvikler') || keywords.includes('sprint')) {
    templateName = 'Teknisk møte - møtereferat';
    icon = '💻';
    sections = [
      `# ${templateName}

🔧 Teknisk kontekst

{{paragraph|Beskriv den tekniske utfordringen eller temaet som ble diskutert. Inkluder relevante systemer, teknologier og problemstillinger.}}

✅ Tekniske beslutninger

{{bulletedList|List opp alle tekniske valg som ble tatt. Inkluder rationale bak beslutningene hvis dette ble diskutert. Ett punkt per beslutning.}}

📝 Løsningsforslag og arkitektur

{{paragraph|Beskriv foreslåtte løsninger, arkitektur eller tilnærminger som ble diskutert. Inkluder fordeler/ulemper hvis diskutert.}}

📋 Tekniske TODOs

{{checklist|Ekstraher alle tekniske oppgaver som må gjøres. Format: "Ansvarlig: Oppgavebeskrivelse (frist: X)" hvis denne informasjonen er tilgjengelig.}}

⚠️ Tekniske utfordringer

{{bulletedList|List opp tekniske risikoer, blokkere eller problemstillinger som ble identifisert og må håndteres.}}`
    ];
  } else {
    // Default general meeting
    templateName = 'Møtereferat';
    icon = '📝';
    sections = [
      `# ${templateName}

📝 Sammendrag

{{paragraph|Skriv et sammendrag på 200-400 ord som oppsummerer møtets hovedpunkter. Inkluder formål, viktigste diskusjoner og resultater.}}

👥 Deltakere

{{bulletedList|List opp alle som deltok i møtet med navn og rolle/tittel hvis nevnt.}}

💬 Diskusjonspunkter

{{bulletedList|Oppsummer de viktigste temaene som ble diskutert. Ett punkt per hovedtema. Behold strukturen og rekkefølgen fra møtet hvis mulig.}}

✅ Beslutninger

{{bulletedList|List opp alle vedtak som ble tatt i møtet. Vær konkret og spesifikk.}}

🎯 Handlingspunkter

{{checklist|Ekstraher konkrete oppgaver med ansvarlig person og frist. Format: "Ansvarlig: Oppgave (frist: X)". Hvis ansvarlig eller frist ikke er nevnt, utelat det.}}

📌 Neste møte

{{paragraph|Informasjon om neste møte hvis dette ble diskutert (dato, tidspunkt, agenda).}}`
    ];
  }

  return {
    name: templateName,
    icon: icon,
    content: sections[0]
  };
};
