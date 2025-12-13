import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  FileText,
  CheckCircle,
  Server,
  CreditCard,
  Mail,
  Shield,
  UserX,
  Scale,
  Key
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

const sections = [
  {
    id: 'tjenestebeskrivelse',
    title: 'Tjenestebeskrivelse',
    icon: FileText,
    content: `Notably AI fanger virtuelle møter, lagrer mediene sikkert i EU, transkriberer med ElevenLabs Scribe og lager AI-oppsummeringer med OpenAI.

Kalendersynk, møteopptak og bot-planlegging koordineres via Recall.ai, som opererer på våre vegne i denne arbeidsflyten.

Supabase driver databasen og lagringen i EU, mens Vercel hoster applikasjonen i EU.`
  },
  {
    id: 'akseptabel-bruk',
    title: 'Akseptabel bruk',
    icon: CheckCircle,
    content: `Du godtar følgende når du bruker Notably:

- Ta bare opp møter der alle deltakere har gitt nødvendig samtykke.
- Ikke last opp, del eller lagre innhold som krenker opphavsrett eller andre rettigheter.
- Unngå å introdusere skadevare, omgå sikkerhet eller teste infrastrukturen uten avtale.
- Bruk tjenesten i tråd med lovverket, inkludert GDPR og regler for møteregistrering.`
  },
  {
    id: 'konto-tilgang',
    title: 'Konto og tilgang',
    icon: Key,
    content: `Du er selv ansvarlig for å holde innloggingen din sikker og for handlinger som skjer via kontoen.

Innlogging bygger på Supabase Auth-token lagret i sikre, httpOnly-informasjonskapsler.

Samtykkebanneret bekrefter at vi kun bruker nødvendige kapsler slik at du slipper gjentatte varsler.`
  },
  {
    id: 'datasenter-etterlevelse',
    title: 'Datasenter og etterlevelse',
    icon: Server,
    content: `Vi lagrer kundedata utelukkende på GDPR-kompatible servere i EU.

**Supabase** leverer database, lagring og radnivåsikkerhet fra Frankfurt.

**Vercel** serverer nettappen fra EU med sterke sikkerhetstiltak.

Våre underleverandører, inkludert Recall.ai, ElevenLabs og OpenAI, er bundet av databehandleravtaler som matcher disse kravene.

Mer informasjon om personvern finner du i vår personvernerklæring.`
  },
  {
    id: 'google-api',
    title: 'Bruk av Google API-er',
    icon: FileText,
    isGoogle: true,
    content: `Når du kobler en Google-konto, gir du oss lese-tilgang til Google Calendar API kun for å levere møteopptak.

**Scopes vi ber om:**
Vi ber om scopene calendar.readonly og calendar.events.readonly via Recall.ai. Vi ber aldri om skrivetilgang eller Gmail-scopes.

**Frakobling:**
Du kan koble fra når som helst i Notably-innstillingene eller på Googles sikkerhetsdashbord. Vi ber Recall.ai om å tilbakekalle token med en gang du kobler fra.

**Databruk:**
Google-data brukes kun til å synkronisere møter, planlegge opptaksboten og lage transkripsjoner/notater. Data deles ikke med uavhengige tredjeparter eller til annonsering.

Vår bruk av informasjon mottatt fra Google API-er følger Google API Services User Data Policy, inkludert kravene til begrenset bruk.`
  },
  {
    id: 'fakturering',
    title: 'Fakturering',
    icon: CreditCard,
    content: `Betalte planer håndteres gjennom Stripe.

Prøver varer i 14 dager med mindre noe annet oppgis.

Planendringer kan skje umiddelbart eller ved neste fakturaperiode.

Stripe lagrer betalingsdetaljene sikkert; vi mottar aldri kortdata.`
  },
  {
    id: 'sletting-konto',
    title: 'Sletting av konto',
    icon: UserX,
    content: `Du kan avslutte abonnementet når som helst i faktureringsinnstillingene.

Arbeidsområdeeiere kan også starte full sletting, som fjerner:
- Kalendere
- Opptak
- Transkripsjoner
- Embeddings
- AI-notater

Alt slettes fra Supabase og vår opptaksinfrastruktur.

Vi kan stanse tilgangen ved regelbrudd eller manglende betaling.`
  },
  {
    id: 'ansvarsbegrensning',
    title: 'Ansvarsbegrensning',
    icon: Scale,
    content: `Notably AI leveres "som den er".

Så langt loven tillater er vi ikke ansvarlige for indirekte, tilfeldige eller avledede tap som oppstår ved bruk av tjenesten.

Vårt samlede ansvar er begrenset til avgiftene betalt de siste tolv månedene.`
  },
  {
    id: 'kontakt',
    title: 'Kontakt',
    icon: Mail,
    content: `Spørsmål om disse vilkårene kan sendes til legal@notably.no.`
  }
];

export default function TermsPage() {
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
              <FileText className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Vilkår for bruk</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Sist oppdatert: 28. oktober 2025
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-violet-900/20 dark:to-fuchsia-900/20 rounded-xl p-6 mb-8 border border-violet-100 dark:border-violet-800/50">
          <p className="text-gray-700 dark:text-gray-300">
            Disse vilkårene beskriver avtalen mellom deg og Notably AI. Ved å opprette en konto eller bruke tjenesten godtar du reglene nedenfor.
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
                <span className="text-violet-600 dark:text-violet-400 mr-2 w-5">{index + 1}.</span>
                {'isGoogle' in section && section.isGoogle && (
                  <GoogleIcon className="h-4 w-4 mr-1.5 flex-shrink-0" />
                )}
                <span className="truncate">{section.title}</span>
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
                  {'isGoogle' in section && section.isGoogle ? (
                    <GoogleIcon className="h-5 w-5" />
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
                          <li key={lIndex} className="text-gray-600 dark:text-gray-300 ml-4 list-disc">
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
        <div className="mt-12 bg-white dark:bg-gray-900 rounded-xl shadow-sm dark:shadow-none dark:border dark:border-gray-800 p-6">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Ved å bruke Notably godtar du disse vilkårene for bruk.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:legal@notably.no"
                className="inline-flex items-center px-4 py-2 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-lg hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors"
              >
                <Mail className="h-4 w-4 mr-2" />
                legal@notably.no
              </a>
              <Link
                to="/privacy"
                className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Shield className="h-4 w-4 mr-2" />
                Personvernerklæring
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
