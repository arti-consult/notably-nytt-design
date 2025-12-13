import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  Shield,
  Lock,
  Database,
  Mail,
  Server,
  Trash2,
  Cookie,
  Mic,
  Users,
  Scale,
  Eye,
  Share2,
  Clock
} from 'lucide-react';

// Google icon component
const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

// Microsoft icon component
const MicrosoftIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.4 24H0V12.6h11.4V24z" fill="#00A4EF"/>
    <path d="M24 24H12.6V12.6H24V24z" fill="#FFB900"/>
    <path d="M11.4 11.4H0V0h11.4v11.4z" fill="#F25022"/>
    <path d="M24 11.4H12.6V0H24v11.4z" fill="#7FBA00"/>
  </svg>
);

const sections = [
  {
    id: 'datasenter-sikkerhet',
    title: 'Datasenter og sikkerhet',
    icon: Server,
    content: `All kundedata—inkludert transkripsjoner, AI-notater, embeddings, møtemetadata og opptak—lagres i EU på GDPR-kompatibel infrastruktur. Supabase driver Postgres og Storage i EU (Frankfurt), mens Vercel leverer applikasjonen fra EU-datasentre. Tilgang til produksjonssystemene er begrenset, loggført og sikret med minste privilegium.`
  },
  {
    id: 'personopplysninger',
    title: 'Personopplysninger vi behandler',
    icon: Database,
    content: `Vi behandler bare informasjonen som er nødvendig for å levere tjenesten:

**Kontodata**
- Navn, e-postadresse, innloggingshendelser og medlemskap i arbeidsområdet

**Møtekontekst**
- Kalenderhendelser, opptakslenker og preferanser på arbeidsområdenivå som trengs for sikre opptak

**Innhold du legger inn**
- Møtelyd, transkripsjoner, AI-genererte notater, maler og semantiske embeddings

**Fakturadata**
- Planvalg og Stripe-kundeidentifikatorer (håndteres direkte av Stripe; vi lagrer aldri kortnummer)

Vi selger ikke personopplysninger og beholder dem bare så lenge arbeidsområdet ditt er aktivt eller loven krever det.`
  },
  {
    id: 'google-data',
    title: 'Google-data vi får tilgang til',
    icon: Eye,
    isGoogle: true,
    content: `Når du velger å koble en Google-konto, ber vi kun om lese-tilgang som trengs for å synkronisere møtene dine.

**Grunnleggende profil**
- Navn, e-postadresse og profilbilde levert gjennom Google-pålogging via Supabase Auth for å opprette og sikre kontoen din

**Kalendermetadata**
- Lese-tilgang til møtetitler, beskrivelser, start- og sluttider, arrangør- og deltakerlister samt møtelenker fra kalenderne du velger

**Varsler om endringer**
- Webhook- eller polling-varsler fra Recall.ai som viser når hendelser opprettes, oppdateres eller avlyses slik at Notably holder seg synkronisert

Vi ber aldri om skrivetilgang til Google Kalender eller tilgang til Gmail-data.`
  },
  {
    id: 'google-bruk',
    title: 'Hvordan vi bruker Google-data',
    icon: Eye,
    isGoogle: true,
    content: `Google-data brukes kun til å holde funksjonene du har aktivert i gang:

- Speile kommende møter i Notably-dashbordet og holde planleggingsmetadata oppdatert
- Planlegge, deduplisere og sende Recall.ai-opptaksboten til møter med gyldige lenker
- Forhåndsfylle møtekontekst for transkripsjon, AI-notater og semantisk søk etter at opptaket er ferdig

Vi bruker ikke Google-data til annonsering, profilering eller andre formål.`
  },
  {
    id: 'google-deling',
    title: 'Hvem vi deler Google-data med',
    icon: Share2,
    isGoogle: true,
    content: `Begrensede Google-data deles med våre databehandlere for å levere tjenesten:

**Recall.ai (kalender + bot)**
- Mottar OAuth-oppfriskingstokenet og kalendermetadata for å synkronisere hendelser og sende opptaksboten. Recall lagrer tokenet sikkert og begrenser tilgangen.

**Supabase (database + lagring)**
- Lagrer kalendermetadata, møtetranskripsjoner og arbeidsområdeinnstillinger i EU med radnivåsikkerhet og kryptering.

**Vercel (applikasjonshotell)**
- Leverer Notably-nettappen og API-ene; Google-data som sendes gjennom appen er kryptert under transport.

Vi selger aldri Google-brukerdata eller deler dem med annonsører.`
  },
  {
    id: 'lagring-beskyttelse',
    title: 'Lagring og beskyttelse',
    icon: Lock,
    content: `Kalendermetadata og møtekontekst fra Google lagres i Supabase sin EU-region med kryptering i ro, strenge tilgangskontroller og revisjonsspor.

OAuth-oppfriskingstoken sendes direkte til Recall.ai; vi lagrer ikke Google-tilgangs- eller oppfriskingstoken i vår infrastruktur.

Tilgang til produksjonsdata er begrenset til klarerte medarbeidere med konfidensialitetsavtaler, og overvåking hindrer uautorisert bruk.`
  },
  {
    id: 'lagringstid-sletting',
    title: 'Lagringstid og sletting',
    icon: Trash2,
    content: `Google-data beholdes kun så lenge de trengs for møteflyten du har aktivert:

- Frakobling av Google-kalender fra Innstillinger eller Google Sikkerhet stanser umiddelbart nye hendelser og tilbakekaller token
- Når du sletter et møte, arbeidsområde eller opptak fjernes tilhørende Google-metadata, transkripsjoner, embeddings og Recall.ai-kalender innen 30 dager (ofte raskere)
- Du kan sende en e-post til legal@notably.no for å be om raskere sletting; vi svarer innen 30 dager og bekrefter når Recall.ai og Supabase er tømt

Sikkerhetskopier med Google-data følger samme tidsplan og slettes automatisk etter retensjonsperioden.`
  },
  {
    id: 'microsoft-data',
    title: 'Microsoft-data vi får tilgang til',
    icon: Eye,
    isMicrosoft: true,
    content: `Når du kobler en Microsoft Outlook- eller Office 365-konto, ber vi bare om lese-tilgang som trengs for å synkronisere møtene dine.

**Grunnleggende profil**
- Navn, e-postadresse og profilbilde hentet via Microsoft OAuth-strømmen slik at vi kan opprette og sikre kontoen din

**Kalendermetadata**
- Lese-tilgang til møtetitler, beskrivelser, start- og sluttider, arrangører, deltakere og konferanselenker fra kalenderne du godkjenner

**Varsler om endringer**
- Webhook-varsler fra Recall.ai som forteller når møter opprettes, oppdateres eller avlyses slik at Notably holder seg synkronisert

Vi ber aldri om skrivetilgang til Microsoft 365-kalenderne dine eller e-posten din.`
  },
  {
    id: 'microsoft-bruk',
    title: 'Hvordan vi bruker Microsoft-data',
    icon: Eye,
    isMicrosoft: true,
    content: `Microsoft-data behandles kun for å levere funksjonene du har slått på:

- Vise kommende Outlook-møter i Notably og holde planleggingsdetaljene korrekte
- Planlegge, deduplisere og sende Recall.ai-opptaksboten til møter med gyldige konferanselenker
- Gi møtekontekst til transkripsjon, AI-notater og semantisk søk etter at opptaket er fullført

Vi bruker ikke Microsoft-data til annonsering, profilering eller andre formål.`
  },
  {
    id: 'microsoft-deling',
    title: 'Hvem vi deler Microsoft-data med',
    icon: Share2,
    isMicrosoft: true,
    content: `Begrensede Microsoft-data deles med betrodde databehandlere kun for å drifte tjenesten:

**Recall.ai (kalender + bot)**
- Mottar OAuth-oppfriskingstokenet og kalendermetadata for å synkronisere Outlook-hendelser og sende opptaksboten. Tokenet lagres sikkert og knyttes til arbeidsområdet ditt.

**Supabase (database + lagring)**
- Lagrer møtemetadata, transkripsjoner og arbeidsområdeinnstillinger i EU med radnivåsikkerhet.

**Vercel (applikasjonshotell)**
- Leverer Notably-nettappen; Microsoft-data som sendes gjennom appen er kryptert i transport.

Vi selger aldri Microsoft-brukerdata eller deler dem med annonsører.`
  },
  {
    id: 'microsoft-sletting',
    title: 'Lagringstid og sletting av Microsoft-data',
    icon: Clock,
    isMicrosoft: true,
    content: `Microsoft-data beholdes bare så lenge det er nødvendig for møteflyten du har aktivert:

- Kobler du fra Microsoft Outlook i Innstillinger eller trekker tilbake tilgangen i Microsoft-portalen, stopper nye hendelser umiddelbart
- Når du sletter et møte, arbeidsområde eller opptak, fjerner vi tilhørende Microsoft-metadata, transkripsjoner, embeddings og Recall.ai-kalenderen innen 30 dager (vanligvis raskere)
- Send en e-post til legal@notably.no for å be om raskere sletting; vi bekrefter når Recall.ai og Supabase er tømt

Sikkerhetskopier med Microsoft-data følger samme tidsplan og slettes automatisk etter retensjonsperioden.`
  },
  {
    id: 'informasjonskapsler',
    title: 'Informasjonskapsler og lokal lagring',
    icon: Cookie,
    content: `Notably bruker kun strengt nødvendige informasjonskapsler for å holde deg innlogget, sikre økten og huske samtykkevalgene dine. Vi setter ikke valgfrie analyse-kapsler. Når du lukker banneret lagrer vi samtykket i en funksjonell kapsel slik at du slipper å se meldingen hver gang.`
  },
  {
    id: 'opptak',
    title: 'Hvordan møtene blir tatt opp',
    icon: Mic,
    content: `Møtelyden fanges av en dedikert Recall.ai-bot som vi planlegger på dine vegne basert på konferansedetaljene fra kalenderen du har koblet til.

Recall.ai-boten spiller inn møtet, krypterer lydfilen og leverer den til Notably; ingen hos Notably eller Recall.ai lytter på møtet direkte.

Vi henter opptaket, lagrer det i vårt private Supabase-område i EU, kjører transkripsjon og oppsummering, og sletter filen når du fjerner møtet eller lagringsperioden er over.`
  },
  {
    id: 'underleverandorer',
    title: 'Underleverandører',
    icon: Users,
    content: `Vi samarbeider med følgende leverandører som tilfredsstiller GDPR-kravene og samsvarer med denne erklæringen:

**Supabase (EU West)**
- Primærlagring av data, autentisering og håndheving av radnivåsikkerhet.

**Vercel (EU-regionen)**
- Applikasjonshotell og levering av Notably-nettappen fra EU.

**Recall.ai**
- Kalendersynkronisering og planlegging av opptaksboten som deltar i møtene.

**ElevenLabs Scribe**
- Automatisk tale-til-tekst og diariserte høyttakersegmenter.

**OpenAI**
- Generering av AI-oppsummeringer, strukturerte notater og semantiske embeddings.

Hver leverandør mottar bare minimumsdataene som trengs for å levere tjenesten. Vi vurderer underleverandører jevnlig og varsler om endringer før de trer i kraft.`
  },
  {
    id: 'rettigheter',
    title: 'Rettighetene dine',
    icon: Scale,
    content: `Administratorer kan laste ned transkripsjoner, slette møter eller starte full kontosletting når som helst. Sletting opphever Recall.ai-kalendere, fjerner data i Supabase, sletter embeddings og tar bort media fra opptaksbøtten. Du kan be om innsyn, retting eller sletting ved å kontakte oss.

For personvernspørsmål kontakt legal@notably.no. Vi svarer innen 30 dager.`
  }
];

export default function PrivacyPage() {
  return (
    <main className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Tilbake
          </Link>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
              <Shield className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Personvernerklæring</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Sist oppdatert: 28. oktober 2025
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-900/20 dark:to-fuchsia-900/20 rounded-xl p-6 mb-8 border border-violet-100 dark:border-violet-800/50">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Notably AI fanger, transkriberer og oppsummerer møtene dine samtidig som vi følger GDPR og globale personvernkrav. Denne erklæringen forklarer hvordan vi behandler personopplysninger, hvilke partnere vi bruker, og hvilke kontrollmuligheter du har.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm dark:shadow-none dark:border dark:border-gray-800 p-6 mb-8">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Innholdsfortegnelse</h2>
          <nav className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors py-1"
              >
                <span className="text-violet-600 dark:text-violet-400 mr-2 text-sm w-5">{index + 1}.</span>
                <span className="text-sm">{section.title}</span>
                {(section as any).isGoogle && (
                  <GoogleIcon className="h-3.5 w-3.5 ml-1.5 flex-shrink-0" />
                )}
                {(section as any).isMicrosoft && (
                  <MicrosoftIcon className="h-3.5 w-3.5 ml-1.5 flex-shrink-0" />
                )}
              </a>
            ))}
          </nav>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-sm dark:shadow-none dark:border dark:border-gray-800 p-6 scroll-mt-24"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-violet-50 dark:bg-violet-900/30 rounded-lg">
                  {(section as any).isGoogle ? (
                    <GoogleIcon className="h-5 w-5" />
                  ) : (section as any).isMicrosoft ? (
                    <MicrosoftIcon className="h-5 w-5" />
                  ) : (
                    <section.icon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  )}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {index + 1}. {section.title}
                </h2>
              </div>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                {section.content.split('\n\n').map((paragraph, pIndex) => (
                  <div key={pIndex} className="mb-4">
                    {paragraph.split('\n').map((line, lIndex) => {
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return (
                          <h3 key={lIndex} className="font-semibold text-gray-900 dark:text-white mt-4 mb-2">
                            {line.replace(/\*\*/g, '')}
                          </h3>
                        );
                      }
                      if (line.startsWith('- ')) {
                        return (
                          <li key={lIndex} className="text-gray-600 dark:text-gray-300 ml-4">
                            {line.substring(2).replace(/\*\*/g, '')}
                          </li>
                        );
                      }
                      return (
                        <p key={lIndex} className="text-gray-600 dark:text-gray-300">
                          {line}
                        </p>
                      );
                    })}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Contact Footer */}
        <div className="mt-12 bg-gray-100 dark:bg-gray-800/50 rounded-xl p-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <Mail className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            <span className="font-medium text-gray-900 dark:text-white">Kontakt oss</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
            For personvernspørsmål, kontakt{' '}
            <a href="mailto:legal@notably.no" className="text-violet-600 dark:text-violet-400 hover:underline">
              legal@notably.no
            </a>
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-xs">
            Vi svarer innen 30 dager.
          </p>
        </div>

        {/* Terms Link */}
        <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>Ved å bruke Notably godtar du denne personvernerklæringen.</p>
          <p className="mt-2">
            Se også våre{' '}
            <Link to="/terms" className="text-violet-600 dark:text-violet-400 hover:underline">
              vilkår for bruk
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
