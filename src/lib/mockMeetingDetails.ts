interface MinutesSection {
  title: string;
  content: string;
}

interface MeetingMinutes {
  sections: MinutesSection[];
  generatedAt: string;
}

interface MockMeetingDetail {
  id: string;
  meeting: {
    id: string;
    title: string;
    created_at: string;
    duration: number;
    status: 'processing' | 'completed' | 'error';
    file_url?: string;
    folder_id?: string | null;
  };
  transcription: {
    id: string;
    content: Array<{
      text: string;
      timestamp: number;
      speaker?: string;
    }>;
    summary_text?: string;
    summary_topics?: string[];
    action_items?: string[];
  };
  participants: Array<{
    id: string;
    name: string;
    email?: string;
  }>;
  minutes?: MeetingMinutes;
}

export const mockMeetingDetails: Record<string, MockMeetingDetail> = {
  'rec-1': {
    id: 'rec-1',
    meeting: {
      id: 'rec-1',
      title: 'Styremøte Q4 2024 - Budsjettgjennomgang',
      created_at: new Date('2024-12-02T14:00:00').toISOString(),
      duration: 3780,
      status: 'completed',
      folder_id: 'folder-1'
    },
    transcription: {
      id: 'trans-1',
      content: [
        { text: 'Velkommen til styremøtet for Q4 2024. I dag skal vi gå gjennom budsjettforslaget for neste år.', timestamp: 0, speaker: 'Kari Nordmann' },
        { text: 'Takk. La oss starte med å se på inntektsprognosene. Vi forventer en vekst på 15% sammenlignet med i år.', timestamp: 5, speaker: 'Ole Hansen' },
        { text: 'Det er ambisiøst. Kan du fortelle oss mer om grunnlaget for denne prognosen?', timestamp: 12, speaker: 'Lisa Johansen' },
        { text: 'Selvfølgelig. Vi har identifisert tre nye markedssegmenter som vi ønsker å satse på i 2025.', timestamp: 18, speaker: 'Ole Hansen' },
        { text: 'Det første segmentet er små og mellomstore bedrifter i teknologisektoren.', timestamp: 25, speaker: 'Ole Hansen' },
        { text: 'Vi ser at de har et stort behov for digitalisering og automatisering.', timestamp: 32, speaker: 'Ole Hansen' },
        { text: 'Det høres fornuftig ut. Hva er de to andre segmentene?', timestamp: 38, speaker: 'Kari Nordmann' },
        { text: 'Det andre segmentet er offentlig sektor, spesielt kommuner som ønsker å modernisere sine systemer.', timestamp: 43, speaker: 'Ole Hansen' },
        { text: 'Og det tredje segmentet er konsulentselskaper som trenger verktøy for prosjektstyring.', timestamp: 52, speaker: 'Ole Hansen' },
        { text: 'Utmerket. La oss gå videre til kostnadssiden. Hva er de viktigste investeringene vi må gjøre?', timestamp: 60, speaker: 'Kari Nordmann' },
        { text: 'Vi foreslår å øke budsjettet til produktutvikling med 30%. Dette vil hjelpe oss med å levere nye funksjoner raskere.', timestamp: 67, speaker: 'Ole Hansen' },
        { text: 'Vi må også investere i markedsføring for å nå de nye målgruppene. Vi foreslår en økning på 20%.', timestamp: 76, speaker: 'Ole Hansen' },
        { text: 'I tillegg trenger vi å ansette flere folk i kundestøtte for å håndtere den forventede veksten.', timestamp: 85, speaker: 'Ole Hansen' },
        { text: 'Hvor mange nye ansettelser snakker vi om?', timestamp: 92, speaker: 'Lisa Johansen' },
        { text: 'Vi foreslår å ansette 5 nye personer i produktutvikling og 3 i kundestøtte.', timestamp: 96, speaker: 'Ole Hansen' },
        { text: 'Det virker som en solid plan. Er det noen risikoer vi bør være klar over?', timestamp: 103, speaker: 'Kari Nordmann' },
        { text: 'Den største risikoen er at markedsveksten ikke blir så stor som forventet. Men vi har bygget inn en buffer i budsjettet.', timestamp: 109, speaker: 'Ole Hansen' },
        { text: 'Bra. La oss gå til avstemning. Alle som er for budsjettet?', timestamp: 118, speaker: 'Kari Nordmann' },
        { text: 'Jeg stemmer for.', timestamp: 123, speaker: 'Lisa Johansen' },
        { text: 'Jeg også.', timestamp: 125, speaker: 'Ole Hansen' },
        { text: 'Da er budsjettet vedtatt. Tusen takk for innsatsen.', timestamp: 127, speaker: 'Kari Nordmann' }
      ],
      summary_text: 'Styremøtet for Q4 2024 fokuserte på budsjettforslaget for neste år. Selskapet forventer 15% vekst ved å satse på tre nye markedssegmenter: små og mellomstore teknologibedrifter, offentlig sektor, og konsulentselskaper. Budsjettforslaget inkluderer økte investeringer i produktutvikling (30%), markedsføring (20%), og 8 nye ansettelser. Budsjettet ble enstemmig vedtatt av styret.',
      summary_topics: [
        'Budsjettgjennomgang 2025',
        'Markedssegmenter og vekstmuligheter',
        'Investeringer i produktutvikling',
        'Rekruttering og kundestøtte',
        'Risikovurdering'
      ],
      action_items: [
        'Implementere budsjettforslaget for 2025',
        'Starte rekrutteringsprosess for 8 nye stillinger',
        'Utvikle markedsføringsplan for de tre nye segmentene',
        'Sette opp kvartalsvis oppfølging av budsjett vs. faktiske tall'
      ]
    },
    participants: [
      { id: 'p1', name: 'Kari Nordmann', email: 'kari@selskap.no' },
      { id: 'p2', name: 'Ole Hansen', email: 'ole@selskap.no' },
      { id: 'p3', name: 'Lisa Johansen', email: 'lisa@selskap.no' }
    ],
    minutes: {
      generatedAt: new Date('2024-12-02T15:30:00').toISOString(),
      sections: [
        {
          title: 'Møtets formål',
          content: 'Gjennomgang og godkjenning av budsjettforslaget for 2025, med fokus på vekststrategi og investeringsplaner.'
        },
        {
          title: 'Deltakere',
          content: 'Til stede: Kari Nordmann (styreleder), Ole Hansen (CFO), Lisa Johansen (CEO). Alle stemmeberettigede var til stede.'
        },
        {
          title: 'Agenda',
          content: '1. Inntektsprognoser for 2025\n2. Nye markedssegmenter\n3. Investeringsbudsjett\n4. Rekrutteringsplan\n5. Risikovurdering\n6. Avstemning om budsjett'
        },
        {
          title: 'Diskusjon - Inntektsprognoser',
          content: 'CFO Ole Hansen presenterte inntektsprognosene som viser forventet vekst på 15% sammenlignet med inneværende år. Veksten skal primært komme fra tre nye markedssegmenter:\n\n• Små og mellomstore teknologibedrifter med behov for digitalisering\n• Offentlig sektor, spesielt kommuner som moderniserer systemer\n• Konsulentselskaper med behov for prosjektstyringsverktøy\n\nStyreleder stilte kritiske spørsmål om grunnlaget for prognosen, som ble tilfredsstillende besvart.'
        },
        {
          title: 'Diskusjon - Investeringer',
          content: 'Følgende investeringer ble foreslått:\n\n• Produktutvikling: +30% økning for raskere feature-leveranser\n• Markedsføring: +20% økning for å nå nye målgrupper\n• Personell: 5 nye i produktutvikling, 3 nye i kundestøtte\n\nTotal investering representerer en betydelig satsing, men styret var enige om at dette er nødvendig for å oppnå vekstmålene.'
        },
        {
          title: 'Risikovurdering',
          content: 'Hovedrisiko identifisert: Markedsveksten kan bli lavere enn forventet. For å mitigere dette er det bygget inn en buffer i budsjettet. Kvartalsvis oppfølging av budsjett vs. faktiske tall ble vedtatt som kontrollmekanisme.'
        },
        {
          title: 'Vedtak',
          content: 'Budsjettforslaget for 2025 ble enstemmig vedtatt av styret. Implementering starter umiddelbart med rekrutteringsprosess for 8 nye stillinger og utvikling av markedsføringsplan for de tre nye segmentene.'
        },
        {
          title: 'Neste steg',
          content: '• Implementere budsjettforslaget for 2025\n• Starte rekrutteringsprosess for 8 nye stillinger\n• Utvikle markedsføringsplan for de tre nye segmentene\n• Sette opp kvartalsvis oppfølging av budsjett vs. faktiske tall\n\nNeste styremøte: 15. januar 2025'
        }
      ]
    }
  },
  'rec-2': {
    id: 'rec-2',
    meeting: {
      id: 'rec-2',
      title: 'Team standup - Ukentlig gjennomgang',
      created_at: new Date('2024-12-02T09:00:00').toISOString(),
      duration: 1620,
      status: 'completed',
      folder_id: 'folder-2'
    },
    transcription: {
      id: 'trans-2',
      content: [
        { text: 'God morgen alle sammen. La oss starte med ukentlig standup.', timestamp: 0 },
        { text: 'Hei! Jeg jobber med den nye brukerautentiseringsfunksjonen denne uken.', timestamp: 4 },
        { text: 'Jeg har fullført designet for dashboard-siden og venter på feedback.', timestamp: 10 },
        { text: 'Bra jobbet! Jeg skal se på det i dag. Jeg jobber med API-integrasjonen for tredjepartssystemer.', timestamp: 15 },
        { text: 'Det høres spennende ut. Noen blokkere eller utfordringer?', timestamp: 22 },
        { text: 'Ja, jeg trenger hjelp til å forstå autentiseringsflowet bedre.', timestamp: 26 },
        { text: 'Jeg kan hjelpe deg med det etter møtet.', timestamp: 30 },
        { text: 'Perfekt, takk! Ellers går alt etter planen.', timestamp: 33 },
        { text: 'Flott. Neste uke har vi demo for stakeholders, så la oss sørge for at alt er klart.', timestamp: 37 },
        { text: 'Jeg skal ha autentiseringen klar innen torsdag.', timestamp: 43 },
        { text: 'Og jeg får dashboard-siden ferdig i morgen.', timestamp: 47 },
        { text: 'Utmerket. Da sees vi i morgen.', timestamp: 50 }
      ],
      summary_text: 'Teamet diskuterte fremdriften på ukentlige oppgaver. Hovedfokus er på brukerautentisering, dashboard-design, og API-integrasjon. Ett teammedlem trenger hjelp med autentiseringsflowet. Demo for stakeholders planlegges neste uke.',
      summary_topics: [
        'Ukentlig status',
        'Brukerautentisering',
        'Dashboard design',
        'API-integrasjon',
        'Kommende demo'
      ],
      action_items: [
        'Ferdigstille brukerautentisering innen torsdag',
        'Fullføre dashboard-design i morgen',
        'Gi hjelp med autentiseringsflowet etter møtet',
        'Forberede demo for stakeholders neste uke'
      ]
    },
    participants: [
      { id: 'p4', name: 'Erik Andersen', email: 'erik@team.no' },
      { id: 'p5', name: 'Maria Berg', email: 'maria@team.no' },
      { id: 'p6', name: 'Thomas Larsen', email: 'thomas@team.no' }
    ],
    minutes: {
      generatedAt: new Date('2024-12-02T09:30:00').toISOString(),
      sections: [
        {
          title: 'Status per teammedlem',
          content: '**Erik Andersen:** Jobber med brukerautentisering denne uken. Trenger hjelp med autentiseringsflowet.\n\n**Maria Berg:** Har fullført designet for dashboard-siden, venter på feedback.\n\n**Thomas Larsen:** Jobber med API-integrasjon for tredjepartssystemer. Tilbyr hjelp til Erik etter møtet.'
        },
        {
          title: 'Blokkere',
          content: 'Erik trenger støtte for å forstå autentiseringsflowet bedre. Thomas tar ansvar for å hjelpe etter møtet.'
        },
        {
          title: 'Tidsfrister',
          content: '• Autentisering: Ferdig innen torsdag\n• Dashboard-design: Review i morgen\n• Demo for stakeholders: Neste uke'
        }
      ]
    }
  },
  'rec-3': {
    id: 'rec-3',
    meeting: {
      id: 'rec-3',
      title: 'Klientmøte - Ny produktlansering',
      created_at: new Date('2024-12-01T13:30:00').toISOString(),
      duration: 2700,
      status: 'completed',
      folder_id: 'folder-3'
    },
    transcription: {
      id: 'trans-3',
      content: [
        { text: 'Takk for at dere tok dere tid til møtet. Vi ønsker å presentere vår nye produktvisjon.', timestamp: 0 },
        { text: 'Vi gleder oss til å høre mer. Hva er hovedfunksjonene?', timestamp: 6 },
        { text: 'Det nye produktet fokuserer på automatisering av arbeidsprosesser med AI-teknologi.', timestamp: 12 },
        { text: 'Brukere vil kunne spare opptil 40% av tiden de bruker på manuelle oppgaver.', timestamp: 19 },
        { text: 'Det høres imponerende ut. Hvordan skiller dette seg fra konkurrentene?', timestamp: 26 },
        { text: 'Vår løsning er den eneste som tilbyr sømløs integrasjon med alle større CRM-systemer.', timestamp: 32 },
        { text: 'I tillegg har vi fokusert på norsk språkstøtte, noe konkurrentene mangler.', timestamp: 39 },
        { text: 'Når planlegger dere lanseringen?', timestamp: 45 },
        { text: 'Vi sikter på lansering i Q1 2025, med pilot-testing som starter i januar.', timestamp: 50 },
        { text: 'Vi ønsker å invitere dere som en av våre første pilotkunder.', timestamp: 57 },
        { text: 'Det er vi absolutt interessert i. Hva kreves av oss?', timestamp: 63 },
        { text: 'Vi trenger at 5-10 brukere tester løsningen i 4 uker og gir oss tilbakemelding.', timestamp: 68 },
        { text: 'Det kan vi ordne. Når kan vi få mer detaljert informasjon?', timestamp: 75 },
        { text: 'Jeg sender over dokumentasjon og en demo-video i løpet av denne uken.', timestamp: 80 },
        { text: 'Perfekt. Vi ser frem til samarbeidet.', timestamp: 86 }
      ],
      summary_text: 'Møtet presenterte et nytt produkt fokusert på AI-drevet automatisering av arbeidsprosesser. Produktet lover 40% tidsbesparelse og har unik integrasjon med CRM-systemer samt norsk språkstøtte. Lansering planlegges i Q1 2025 med pilot-testing fra januar. Klienten ble invitert til å være pilotkunde.',
      summary_topics: [
        'Ny produktpresentasjon',
        'AI-automatisering',
        'Konkurransefortrinn',
        'Lanseringsplan Q1 2025',
        'Pilotprogram'
      ],
      action_items: [
        'Sende dokumentasjon og demo-video til klient innen fredag',
        'Identifisere 5-10 testbrukere hos klienten',
        'Planlegge oppstartsmøte for pilot i januar',
        'Sette opp tilbakemeldingsmekanismer for pilotkunder'
      ]
    },
    participants: [
      { id: 'p7', name: 'Anna Petersen', email: 'anna@kunde.no' },
      { id: 'p8', name: 'Martin Olsen', email: 'martin@kunde.no' },
      { id: 'p9', name: 'Sofia Kristensen', email: 'sofia@selskap.no' }
    ],
    minutes: {
      generatedAt: new Date('2024-12-01T14:30:00').toISOString(),
      sections: [
        {
          title: 'Møtets formål',
          content: 'Presentasjon av ny produktvisjon med fokus på AI-drevet automatisering av arbeidsprosesser.'
        },
        {
          title: 'Produktpresentasjon',
          content: 'Det nye produktet fokuserer på automatisering av arbeidsprosesser med AI-teknologi. Hovedfordeler:\n\n• Opptil 40% tidsbesparelse på manuelle oppgaver\n• Sømløs integrasjon med alle større CRM-systemer\n• Norsk språkstøtte (unik i markedet)'
        },
        {
          title: 'Konkurransefortrinn',
          content: 'Løsningen skiller seg fra konkurrentene ved:\n1. Eneste løsning med full integrasjon mot alle CRM-systemer\n2. Norsk språkstøtte som konkurrentene mangler\n3. Brukergrensesnitt designet for norske forhold'
        },
        {
          title: 'Lanseringsplan',
          content: 'Lansering planlagt Q1 2025 med pilot-testing som starter i januar. Klienten er invitert som pilotkunde med 5-10 testbrukere i 4 uker.'
        },
        {
          title: 'Avtale',
          content: 'Klienten bekreftet interesse for pilotprogrammet. Dokumentasjon og demo-video sendes innen fredag.'
        }
      ]
    }
  },
  'rec-4': {
    id: 'rec-4',
    meeting: {
      id: 'rec-4',
      title: 'Sprint Planning - Desember 2024',
      created_at: new Date('2024-12-01T10:00:00').toISOString(),
      duration: 4320,
      status: 'completed',
      folder_id: 'folder-4'
    },
    transcription: {
      id: 'trans-4',
      content: [
        { text: 'Velkommen til sprint planning for desember. La oss gå gjennom backloggen.', timestamp: 0 },
        { text: 'Vi har 23 user stories klare for denne sprinten.', timestamp: 5 },
        { text: 'La oss prioritere de viktigste. Hva er kritisk for neste release?', timestamp: 11 },
        { text: 'Brukerautentisering må være ferdig. Det blokkerer flere andre features.', timestamp: 17 },
        { text: 'Enig. Det er story nummer 1. Hva er estimate på den?', timestamp: 23 },
        { text: 'Vi estimerer 8 story points. Det inkluderer testing og dokumentasjon.', timestamp: 28 },
        { text: 'OK, la oss ta den. Neste prioritet?', timestamp: 35 },
        { text: 'Dashboard-optimalisering. Brukere klager på treg lasting.', timestamp: 40 },
        { text: 'Det er 5 story points. Vi bør også inkludere API-caching som en del av løsningen.', timestamp: 46 },
        { text: 'Bra poeng. Det blir totalt 8 points da.', timestamp: 53 },
        { text: 'Vi har også bug-fixing som må gjøres. Det er 10 kritiske bugs.', timestamp: 59 },
        { text: 'La oss allokere 30% av kapasiteten til bugs. Det gir oss rom til 12-15 story points til nye features.', timestamp: 66 },
        { text: 'Perfekt. Da tar vi autentisering, dashboard, og kanskje notifikasjoner?', timestamp: 74 },
        { text: 'Ja, notifikasjoner er 5 points. Det passer bra.', timestamp: 80 },
        { text: 'Da har vi en plan. Total kapasitet er 31 story points denne sprinten.', timestamp: 86 }
      ],
      summary_text: 'Sprint planning for desember prioriterte 31 story points fordelt på brukerautentisering (8 pts), dashboard-optimalisering (8 pts), notifikasjoner (5 pts), og bug-fixing (10 pts). Autentisering er kritisk og blokkerer andre features. 30% av kapasitet allokeres til bug-fixing.',
      summary_topics: [
        'Sprint planning desember',
        'Backlog prioritering',
        'Brukerautentisering',
        'Dashboard optimalisering',
        'Bug-fixing allokering'
      ],
      action_items: [
        'Starte arbeid på brukerautentisering umiddelbart',
        'Tildele ressurser til dashboard-optimalisering',
        'Identifisere og prioritere de 10 kritiske bugs',
        'Sette opp notifikasjonssystem',
        'Daglige standup-møter for å følge fremdrift'
      ]
    },
    participants: [
      { id: 'p10', name: 'Lars Nilsen', email: 'lars@team.no' },
      { id: 'p11', name: 'Emma Sørensen', email: 'emma@team.no' },
      { id: 'p12', name: 'Jonas Berg', email: 'jonas@team.no' }
    ]
  },
  'rec-5': {
    id: 'rec-5',
    meeting: {
      id: 'rec-5',
      title: 'HR-møte - Ansettelsesprosess',
      created_at: new Date('2024-11-30T15:00:00').toISOString(),
      duration: 2160,
      status: 'completed'
    },
    transcription: {
      id: 'trans-5',
      content: [
        { text: 'Vi trenger å diskutere den nye ansettelsesprosessen for Q1.', timestamp: 0 },
        { text: 'Hvor mange stillinger skal vi fylle?', timestamp: 5 },
        { text: 'Vi har 6 åpne stillinger: 3 utviklere, 2 i salg, og 1 produktsjef.', timestamp: 10 },
        { text: 'Hva er tidslinjen?', timestamp: 17 },
        { text: 'Vi ønsker å ha alle ombord innen slutten av februar.', timestamp: 21 },
        { text: 'Det betyr at vi må starte rekrutteringen umiddelbart.', timestamp: 27 },
        { text: 'Enig. Hva med onboarding-prosessen?', timestamp: 32 },
        { text: 'Vi har oppdatert onboarding-programmet til 3 uker med mentor-ordning.', timestamp: 37 },
        { text: 'Bra! Hvordan går det med jobbannonsene?', timestamp: 44 },
        { text: 'De er klare og vil bli publisert på LinkedIn og Finn.no i morgen.', timestamp: 49 },
        { text: 'Perfekt. Vi bør også vurdere headhuntere for produktsjef-rollen.', timestamp: 55 },
        { text: 'God idé. Jeg kontakter to byråer jeg har jobbet med tidligere.', timestamp: 61 }
      ],
      summary_text: 'HR-møtet diskuterte rekruttering av 6 nye ansatte i Q1: 3 utviklere, 2 i salg, og 1 produktsjef. Målet er å ha alle ombord innen slutten av februar. Onboarding-programmet er oppdatert til 3 uker med mentor-ordning. Jobbannonsene publiseres på LinkedIn og Finn.no, og headhuntere vurderes for produktsjef-rollen.',
      summary_topics: [
        'Rekrutteringsbehov Q1',
        'Tidsplan for ansettelser',
        'Oppdatert onboarding-program',
        'Publisering av stillingsannonser',
        'Headhunter for produktsjef'
      ],
      action_items: [
        'Publisere jobbannonsene på LinkedIn og Finn.no',
        'Kontakte headhunter-byråer for produktsjef-rollen',
        'Koordinere intervjupaneler for de 6 stillingene',
        'Forberede onboarding-materiell for nye ansatte',
        'Oppdatere rekrutteringsstatus ukentlig'
      ]
    },
    participants: [
      { id: 'p13', name: 'Ingrid Hansen', email: 'ingrid@hr.no' },
      { id: 'p14', name: 'Per Johansen', email: 'per@selskap.no' }
    ]
  },
  'rec-6': {
    id: 'rec-6',
    meeting: {
      id: 'rec-6',
      title: 'Prosjektreview - Nettsted redesign',
      created_at: new Date('2024-11-29T11:00:00').toISOString(),
      duration: 3240,
      status: 'completed',
      folder_id: 'folder-4'
    },
    transcription: {
      id: 'trans-6',
      content: [
        { text: 'La oss gå gjennom fremdriften på nettsted redesign-prosjektet.', timestamp: 0 },
        { text: 'Vi er 70% ferdige med designfasen. Alle hovedsider er designet.', timestamp: 6 },
        { text: 'Flott! Når kan vi starte utvikling?', timestamp: 13 },
        { text: 'Vi venter på godkjenning av design fra stakeholders. Forventer svar neste uke.', timestamp: 18 },
        { text: 'OK. Hva med innholdsproduksjon?', timestamp: 25 },
        { text: 'Copywriting er 50% ferdig. Vi har profesjonelle bilder for alle seksjoner.', timestamp: 30 },
        { text: 'Utmerket. Hva er den største risikoen nå?', timestamp: 37 },
        { text: 'Tidsplanen er stram. Hvis design-godkjenningen tar lenger tid, kan vi få problemer.', timestamp: 42 },
        { text: 'La oss planlegge et backup-scenario. Kan vi starte med noen moduler parallelt?', timestamp: 49 },
        { text: 'Ja, vi kan starte med header og footer siden de er godkjent.', timestamp: 56 },
        { text: 'Perfekt. Da reduserer vi risikoen betydelig.', timestamp: 62 }
      ],
      summary_text: 'Prosjektreview viste at nettsted redesign er 70% ferdig i designfasen. Copywriting er 50% ferdig og profesjonelle bilder er klare. Hovedrisiko er tidsplan avhengig av stakeholder-godkjenning. Backup-plan er å starte utvikling av header og footer parallelt.',
      summary_topics: [
        'Designfase fremdrift',
        'Innholdsproduksjon status',
        'Stakeholder godkjenning',
        'Tidsplan og risikoer',
        'Backup-strategi'
      ],
      action_items: [
        'Følge opp stakeholders for design-godkjenning',
        'Starte utvikling av header og footer',
        'Fullføre resterende 50% av copywriting',
        'Planlegge utviklingssprint når design er godkjent',
        'Ukentlig statusoppdatering til alle interessenter'
      ]
    },
    participants: [
      { id: 'p15', name: 'Nina Larsen', email: 'nina@design.no' },
      { id: 'p16', name: 'Olav Berg', email: 'olav@dev.no' },
      { id: 'p17', name: 'Sara Nilsen', email: 'sara@marketing.no' }
    ]
  },
  'rec-7': {
    id: 'rec-7',
    meeting: {
      id: 'rec-7',
      title: 'Månedlig all-hands meeting',
      created_at: new Date('2024-11-28T14:00:00').toISOString(),
      duration: 2880,
      status: 'completed'
    },
    transcription: {
      id: 'trans-7',
      content: [
        { text: 'Velkommen til månedlig all-hands. Vi har mye positivt å dele i dag.', timestamp: 0 },
        { text: 'La oss starte med salgstallene. Vi har hatt vår beste måned noensinne!', timestamp: 7 },
        { text: 'Wow, det er fantastisk! Hva er tallene?', timestamp: 14 },
        { text: 'Vi har signert 12 nye kunder, som gir oss 2.5 millioner i årlig recurring revenue.', timestamp: 19 },
        { text: 'Det er utrolig bra jobbet av salgsteamet!', timestamp: 27 },
        { text: 'Produktteamet har også hatt en produktiv måned. Vi lanserte 5 nye features.', timestamp: 33 },
        { text: 'Brukertilbakemeldingene har vært svært positive, spesielt på notifikasjons-systemet.', timestamp: 40 },
        { text: 'Hva er fokus for neste måned?', timestamp: 47 },
        { text: 'Vi skal fokusere på kundeoppbevaring. Churnen var litt høy i oktober.', timestamp: 52 },
        { text: 'Vi planlegger også en julebuffet 20. desember. Alle er hjertelig velkomne!', timestamp: 59 },
        { text: 'Perfekt avslutning på året!', timestamp: 66 }
      ],
      summary_text: 'All-hands møtet feiret den beste måneden noensinne med 12 nye kunder og 2.5M i ny ARR. Produktteamet lanserte 5 nye features med positive tilbakemeldinger. Fokus fremover er kundeoppbevaring etter høyere churn i oktober. Julebuffet planlegges 20. desember.',
      summary_topics: [
        'Beste måned noensinne',
        'Salgssuksess - 12 nye kunder',
        'Produktlansering - 5 nye features',
        'Kundeoppbevaring fokus',
        'Julebuffet planlegging'
      ],
      action_items: [
        'Implementere customer success program for å redusere churn',
        'Analysere årsaker til økt churn i oktober',
        'Fortsette momentum i salg mot slutten av året',
        'Planlegge og bekrefte julebuffet 20. desember',
        'Kommunisere suksesshistorier til hele teamet'
      ]
    },
    participants: [
      { id: 'p18', name: 'CEO Henrik Johansen', email: 'henrik@ceo.no' },
      { id: 'p19', name: 'Sarah Marketing', email: 'sarah@marketing.no' },
      { id: 'p20', name: 'David Product', email: 'david@product.no' }
    ]
  },
  'rec-8': {
    id: 'rec-8',
    meeting: {
      id: 'rec-8',
      title: 'Team retrospektiv - November',
      created_at: new Date('2024-11-27T16:00:00').toISOString(),
      duration: 1800,
      status: 'completed',
      folder_id: 'folder-2'
    },
    transcription: {
      id: 'trans-8',
      content: [
        { text: 'Velkommen til retrospektiv for november. Hva gikk bra?', timestamp: 0 },
        { text: 'Samarbeidet mellom frontend og backend var mye bedre denne måneden.', timestamp: 6 },
        { text: 'Enig! De daglige synkroniseringsmøtene hjalp veldig.', timestamp: 12 },
        { text: 'Code review prosessen fungerte også bedre med de nye retningslinjene.', timestamp: 18 },
        { text: 'Bra! Hva kan vi forbedre?', timestamp: 24 },
        { text: 'Vi trenger bedre dokumentasjon. Flere ganger måtte jeg spørre om hvordan ting fungerte.', timestamp: 29 },
        { text: 'God poeng. Vi bør også forbedre testing-dekningen. Vi hadde noen bugs i prod.', timestamp: 36 },
        { text: 'Og møtene tar for lang tid. Vi bruker for mye tid i møter og for lite på koding.', timestamp: 43 },
        { text: 'OK, så action items er: bedre dokumentasjon, økt testing-dekning, og færre møter?', timestamp: 50 },
        { text: 'Ja, det oppsummerer det bra.', timestamp: 57 }
      ],
      summary_text: 'November retrospektiv fremhevet bedre samarbeid mellom frontend og backend, samt forbedret code review prosess. Forbedringsområder inkluderer bedre dokumentasjon, økt testing-dekning, og redusert møtetid for å gi mer tid til koding.',
      summary_topics: [
        'Forbedret teamsamarbeid',
        'Code review suksess',
        'Dokumentasjonsbehov',
        'Testing-dekning',
        'Møteoptimalisering'
      ],
      action_items: [
        'Opprette dokumentasjonsstandard for alle nye features',
        'Øke test coverage til minimum 80%',
        'Redusere ukentlige møter med 25%',
        'Implementere bedre onboarding-dokumentasjon',
        'Sette opp automatiske dokumentasjonssjekker i CI/CD'
      ]
    },
    participants: [
      { id: 'p21', name: 'Team Lead Anna', email: 'anna@team.no' },
      { id: 'p22', name: 'Developer Ben', email: 'ben@dev.no' },
      { id: 'p23', name: 'Developer Clara', email: 'clara@dev.no' }
    ]
  },
  'rec-9': {
    id: 'rec-9',
    meeting: {
      id: 'rec-9',
      title: 'Klientmøte - Status oppdatering',
      created_at: new Date('2024-11-26T10:30:00').toISOString(),
      duration: 1980,
      status: 'completed',
      folder_id: 'folder-3'
    },
    transcription: {
      id: 'trans-9',
      content: [
        { text: 'Takk for at dere tok dere tid. La oss gå gjennom prosjektstatusen.', timestamp: 0 },
        { text: 'Vi har fullført fase 1 og 2 som planlagt. Fase 3 starter neste uke.', timestamp: 6 },
        { text: 'Flott! Noen utfordringer vi bør være klar over?', timestamp: 13 },
        { text: 'Vi trenger tilgang til test-miljøet deres for å verifisere integrasjonene.', timestamp: 18 },
        { text: 'Det skal vi ordne. Når trenger dere det?', timestamp: 25 },
        { text: 'Innen fredag ville vært ideelt, så vi kan starte testing neste mandag.', timestamp: 30 },
        { text: 'Jeg sørger for at IT-avdelingen setter det opp i morgen.', timestamp: 37 },
        { text: 'Perfekt! Noen andre spørsmål?', timestamp: 42 },
        { text: 'Ja, vi lurer på om det er mulig å legge til en ekstra rapport i fase 3?', timestamp: 47 },
        { text: 'Det burde være mulig. Kan dere sende spesifikasjonene?', timestamp: 54 },
        { text: 'Selvfølgelig, jeg sender det i ettermiddag.', timestamp: 59 }
      ],
      summary_text: 'Statusoppdatering viste at fase 1 og 2 er fullført som planlagt. Fase 3 starter neste uke. Teamet trenger tilgang til klientens test-miljø innen fredag for å starte integrasjonstesting. Klient ønsker ekstra rapport i fase 3.',
      summary_topics: [
        'Fase 1 og 2 fullført',
        'Fase 3 oppstart',
        'Test-miljø tilgang',
        'Integrasjonstesting',
        'Ekstra rapport forespørsel'
      ],
      action_items: [
        'IT-avdelingen setter opp test-miljø tilgang innen onsdag',
        'Motta spesifikasjoner for ekstra rapport',
        'Starte integrasjonstesting neste mandag',
        'Evaluere ekstra rapport og estimere arbeidsinnsats',
        'Planlegge kick-off for fase 3'
      ]
    },
    participants: [
      { id: 'p24', name: 'Project Manager John', email: 'john@consult.no' },
      { id: 'p25', name: 'Client Lead Anna', email: 'anna@client.no' }
    ]
  },
  'rec-10': {
    id: 'rec-10',
    meeting: {
      id: 'rec-10',
      title: 'Sikkerhetsgjenomgang - Q4',
      created_at: new Date('2024-11-25T13:00:00').toISOString(),
      duration: 3600,
      status: 'completed',
      folder_id: 'folder-4'
    },
    transcription: {
      id: 'trans-10',
      content: [
        { text: 'Vi må gjennomgå sikkerhetsstatus for Q4. La oss starte med sårbarheter.', timestamp: 0 },
        { text: 'Vi har identifisert 15 sårbarheter i siste security scan. 3 er kritiske.', timestamp: 7 },
        { text: 'Hva er de kritiske sårbarhetene?', timestamp: 14 },
        { text: 'SQL injection risiko i admin-panelet, og to outdated dependencies med kjente sikkerhetshull.', timestamp: 19 },
        { text: 'Dette må fikses umiddelbart. Hva er tidsestimatet?', timestamp: 27 },
        { text: 'SQL injection kan fikses i dag. Dependencies krever testing, estimert 3 dager.', timestamp: 33 },
        { text: 'OK, prioriter det. Hva med penetration testing?', timestamp: 40 },
        { text: 'Vi har planlagt det for 5. desember med eksternt firma.', timestamp: 45 },
        { text: 'Bra. Sørg for at alle kritiske sårbarheter er fikset før den datoen.', timestamp: 52 },
        { text: 'Selvfølgelig. Jeg oppdaterer teamet umiddelbart.', timestamp: 58 }
      ],
      summary_text: 'Sikkerhetsgjenomgang for Q4 identifiserte 15 sårbarheter, inkludert 3 kritiske: SQL injection i admin-panel og 2 outdated dependencies. SQL injection fikses samme dag, dependencies krever 3 dagers testing. Penetration testing planlagt 5. desember.',
      summary_topics: [
        'Q4 sikkerhetsgjennomgang',
        'Kritiske sårbarheter',
        'SQL injection risiko',
        'Outdated dependencies',
        'Penetration testing'
      ],
      action_items: [
        'Fikse SQL injection sårbarheten i dag',
        'Oppdatere og teste kritiske dependencies innen 3 dager',
        'Fikse alle 15 identifiserte sårbarheter før 5. desember',
        'Forberede system for penetration testing',
        'Implementere automatisk dependency scanning'
      ]
    },
    participants: [
      { id: 'p26', name: 'Security Lead Michael', email: 'michael@security.no' },
      { id: 'p27', name: 'CTO Lisa', email: 'lisa@cto.no' },
      { id: 'p28', name: 'Senior Dev Tom', email: 'tom@dev.no' }
    ]
  },
  'rec-11': {
    id: 'rec-11',
    meeting: {
      id: 'rec-11',
      title: 'Styremøte - Strategi 2025',
      created_at: new Date('2024-11-22T14:00:00').toISOString(),
      duration: 4500,
      status: 'completed',
      folder_id: 'folder-1'
    },
    transcription: {
      id: 'trans-11',
      content: [
        { text: 'Velkommen til strategimøtet for 2025. Vi skal definere våre hovedmål.', timestamp: 0 },
        { text: 'Takk. Hva ser dere som de største mulighetene for neste år?', timestamp: 7 },
        { text: 'Vi ser tre hovedområder: internasjonal ekspansjon, produktdiversifisering, og AI-integrasjon.', timestamp: 14 },
        { text: 'Internasjonal ekspansjon høres spennende ut. Hvilke markeder?', timestamp: 22 },
        { text: 'Vi foreslår å starte med Sverige og Danmark. De har lignende kultur og språk.', timestamp: 28 },
        { text: 'Markedsanalysen viser at vi kan få 500 nye kunder i disse markedene første året.', timestamp: 36 },
        { text: 'Hva kreves av investeringer?', timestamp: 43 },
        { text: 'Vi estimerer 5 millioner for markedsføring og 3 millioner for lokale team.', timestamp: 48 },
        { text: 'Det er betydelig. Hva er ROI-estimatet?', timestamp: 55 },
        { text: 'Vi forventer break-even etter 18 måneder og 25% margin etter 3 år.', timestamp: 60 },
        { text: 'Det virker fornuftig. La oss diskutere AI-integrasjon.', timestamp: 67 },
        { text: 'AI kan hjelpe oss med å automatisere kundeservice og forbedre produktanbefalinger.', timestamp: 73 }
      ],
      summary_text: 'Strategimøte for 2025 identifiserte tre hovedområder: internasjonal ekspansjon til Sverige og Danmark, produktdiversifisering, og AI-integrasjon. Ekspansjon estimeres til 8M investering med break-even etter 18 måneder. Mål er 500 nye kunder første året.',
      summary_topics: [
        'Strategi 2025',
        'Internasjonal ekspansjon',
        'Sverige og Danmark markeder',
        'Investeringsbehov',
        'AI-integrasjon muligheter'
      ],
      action_items: [
        'Utvikle detaljert go-to-market plan for Sverige og Danmark',
        'Budsjettere 8M for internasjonal ekspansjon',
        'Starte rekruttering av lokale team-ledere',
        'Evaluere AI-teknologier for kundeservice',
        'Sette opp kvartalsvis review av internasjonaliseringsstrategi'
      ]
    },
    participants: [
      { id: 'p29', name: 'Styreleder Jan', email: 'jan@board.no' },
      { id: 'p30', name: 'CEO Maria', email: 'maria@ceo.no' },
      { id: 'p31', name: 'CFO Peter', email: 'peter@cfo.no' }
    ]
  },
  'rec-12': {
    id: 'rec-12',
    meeting: {
      id: 'rec-12',
      title: 'Team sync - Ukentlig',
      created_at: new Date('2024-11-21T09:00:00').toISOString(),
      duration: 1500,
      status: 'completed',
      folder_id: 'folder-2'
    },
    transcription: {
      id: 'trans-12',
      content: [
        { text: 'God morgen! La oss synkronisere på ukens oppgaver.', timestamp: 0 },
        { text: 'Jeg fullfører API-dokumentasjonen i dag.', timestamp: 5 },
        { text: 'Perfekt! Jeg trenger den for å starte frontend-integrasjonen.', timestamp: 10 },
        { text: 'Jeg jobber med brukergrensesnitt for settings-siden.', timestamp: 16 },
        { text: 'Når er det klart for review?', timestamp: 21 },
        { text: 'I morgen tidlig. Det er bare noen småjusteringer igjen.', timestamp: 25 },
        { text: 'Flott! Noen blokkere?', timestamp: 30 },
        { text: 'Nei, alt går som det skal.', timestamp: 34 },
        { text: 'Da sees vi på retrospektiv på fredag.', timestamp: 38 }
      ],
      summary_text: 'Ukentlig team sync hvor teammedlemmer oppdaterte på sine oppgaver. API-dokumentasjon fullføres i dag, brukergrensesnittet for settings-siden er klart for review i morgen. Ingen blokkere rapportert.',
      summary_topics: [
        'Ukentlig synkronisering',
        'API-dokumentasjon',
        'Frontend-integrasjon',
        'Settings UI',
        'Ingen blokkere'
      ],
      action_items: [
        'Fullføre API-dokumentasjon i dag',
        'Starte frontend-integrasjon når dokumentasjon er klar',
        'Få settings UI klar for review i morgen',
        'Planlegge retrospektiv på fredag'
      ]
    },
    participants: [
      { id: 'p32', name: 'Dev Alex', email: 'alex@dev.no' },
      { id: 'p33', name: 'Dev Sophie', email: 'sophie@dev.no' }
    ]
  },
  'rec-13': {
    id: 'rec-13',
    meeting: {
      id: 'rec-13',
      title: 'Produktdemo for stakeholders',
      created_at: new Date('2024-11-20T15:30:00').toISOString(),
      duration: 2400,
      status: 'completed',
      folder_id: 'folder-3'
    },
    transcription: {
      id: 'trans-13',
      content: [
        { text: 'Velkommen til produktdemoen. I dag skal vi vise de nye funksjonene.', timestamp: 0 },
        { text: 'La oss starte med dashboard-forbedringene. Som dere ser, laster det nå 3x raskere.', timestamp: 7 },
        { text: 'Wow, det er en betydelig forbedring!', timestamp: 14 },
        { text: 'Vi har også lagt til real-time notifikasjoner. Se her når jeg oppretter en oppgave.', timestamp: 19 },
        { text: 'Det ser veldig bra ut! Fungerer det på mobil også?', timestamp: 26 },
        { text: 'Ja, vi har optimalisert for alle plattformer. La meg vise mobil-versjonen.', timestamp: 31 },
        { text: 'Imponerende! Når kan vi lansere dette?', timestamp: 38 },
        { text: 'Vi planlegger lansering 1. desember etter siste testing-runde.', timestamp: 43 },
        { text: 'Perfekt timing før juleferien!', timestamp: 49 }
      ],
      summary_text: 'Produktdemo viste forbedret dashboard med 3x raskere lasting og nye real-time notifikasjoner. Alle forbedringer er optimalisert for både desktop og mobil. Lansering planlagt 1. desember.',
      summary_topics: [
        'Dashboard forbedringer',
        'Real-time notifikasjoner',
        'Ytelsesoptimalisering',
        'Mobil-optimalisering',
        'Lansering 1. desember'
      ],
      action_items: [
        'Fullføre siste testing-runde før lansering',
        'Forberede lanseringsplan og kommunikasjon',
        'Oppdatere brukerdokumentasjon for nye features',
        'Planlegge user onboarding for nye funksjoner',
        'Sette opp metrics for å måle feature adoption'
      ]
    },
    participants: [
      { id: 'p34', name: 'Product Manager Sarah', email: 'sarah@pm.no' },
      { id: 'p35', name: 'Stakeholder James', email: 'james@stake.no' }
    ]
  },
  'rec-14': {
    id: 'rec-14',
    meeting: {
      id: 'rec-14',
      title: 'Teknisk arkitektur diskusjon',
      created_at: new Date('2024-11-19T11:00:00').toISOString(),
      duration: 3120,
      status: 'completed',
      folder_id: 'folder-4'
    },
    transcription: {
      id: 'trans-14',
      content: [
        { text: 'Vi må diskutere arkitektur for det nye microservice-systemet.', timestamp: 0 },
        { text: 'Jeg foreslår at vi bruker event-driven arkitektur med message queues.', timestamp: 7 },
        { text: 'God idé. Hvilken teknologi tenker du på?', timestamp: 14 },
        { text: 'RabbitMQ eller Kafka. Kafka gir oss bedre skalerbarhet.', timestamp: 19 },
        { text: 'Men Kafka har høyere kompleksitet. Er det verdt det for vårt bruk?', timestamp: 26 },
        { text: 'Vi planlegger å vokse 10x neste år. Vi trenger skalerbarheten.', timestamp: 32 },
        { text: 'Fair point. Hva med database-strategi?', timestamp: 38 },
        { text: 'Jeg foreslår PostgreSQL som hovedbase og Redis for caching.', timestamp: 43 },
        { text: 'Enig. Vi bør også implementere read replicas for bedre performance.', timestamp: 50 }
      ],
      summary_text: 'Arkitekturdiskusjon for nytt microservice-system. Besluttet event-driven arkitektur med Kafka for skalerbarhet. PostgreSQL valgt som hoveddatabase med Redis for caching og read replicas for performance.',
      summary_topics: [
        'Microservice arkitektur',
        'Event-driven design',
        'Kafka vs RabbitMQ',
        'Database strategi',
        'Skaleringsplanlegging'
      ],
      action_items: [
        'Sette opp proof-of-concept med Kafka',
        'Evaluere kostnader for Kafka-infrastruktur',
        'Designe database schema for microservices',
        'Implementere Redis caching-lag',
        'Dokumentere arkitektur-beslutninger'
      ]
    },
    participants: [
      { id: 'p36', name: 'Architect Kevin', email: 'kevin@arch.no' },
      { id: 'p37', name: 'Senior Dev Linda', email: 'linda@dev.no' }
    ]
  },
  'rec-15': {
    id: 'rec-15',
    meeting: {
      id: 'rec-15',
      title: 'Salgs pipeline review',
      created_at: new Date('2024-11-18T10:00:00').toISOString(),
      duration: 2700,
      status: 'completed'
    },
    transcription: {
      id: 'trans-15',
      content: [
        { text: 'La oss gå gjennom salgs-pipelinen for november.', timestamp: 0 },
        { text: 'Vi har 45 aktive deals i pipeline. Total verdi er 15 millioner.', timestamp: 6 },
        { text: 'Det er bra! Hvilke deals er nærmest closing?', timestamp: 13 },
        { text: 'Vi har 8 deals i final stage. 5 av dem vil sannsynligvis close denne uken.', timestamp: 18 },
        { text: 'Utmerket! Hva er den gjennomsnittlige deal-størrelsen?', timestamp: 25 },
        { text: '333 000 kroner. Det er opp 20% fra forrige måned.', timestamp: 30 },
        { text: 'Flott! Noen utfordringer vi bør adressere?', timestamp: 37 },
        { text: 'Ja, lead-til-opportunity conversion rate har gått ned med 5%.', timestamp: 42 },
        { text: 'Vi må forbedre kvalifiseringsprosessen. Kanskje mer targeted marketing?', timestamp: 49 },
        { text: 'God idé. Jeg setter opp møte med marketing-teamet.', timestamp: 56 }
      ],
      summary_text: 'Pipeline review viste 45 aktive deals verdt 15M total. 8 deals i final stage med 5 forventet å close denne uken. Gjennomsnittlig deal-størrelse økt til 333k (+20%). Lead-til-opportunity conversion rate ned 5%, krever forbedret kvalifisering.',
      summary_topics: [
        'Salgs-pipeline status',
        '45 aktive deals',
        'Deal-størrelse økning',
        'Closing-forventninger',
        'Conversion rate utfordring'
      ],
      action_items: [
        'Følge opp de 8 deals i final stage',
        'Analysere årsaker til lavere conversion rate',
        'Møte med marketing om targeted campaigns',
        'Forbedre lead kvalifiseringsprosess',
        'Sette nye mål for Q4 salgsavslutning'
      ]
    },
    participants: [
      { id: 'p38', name: 'Sales Manager Robert', email: 'robert@sales.no' },
      { id: 'p39', name: 'Sales Rep Emma', email: 'emma@sales.no' }
    ]
  }
};

export function getMockMeetingDetail(id: string): MockMeetingDetail | null {
  return mockMeetingDetails[id] || null;
}
