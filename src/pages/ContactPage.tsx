import { useState } from 'react';
import { 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare,
  Users,
  Briefcase,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const contactMethods = [
  {
    icon: MessageSquare,
    title: 'Chat med oss',
    description: 'Få øyeblikkelig hjelp fra vårt support-team',
    action: 'Start chat',
    href: '#chat'
  },
  {
    icon: Mail,
    title: 'Send e-post',
    description: 'Vi svarer innen 24 timer',
    action: 'kontakt@notably.no',
    href: 'mailto:kontakt@notably.no'
  },
  {
    icon: Phone,
    title: 'Ring oss',
    description: 'Man-Fre, 09:00-16:00',
    action: '+47 XXX XX XXX',
    href: 'tel:+47XXXXXXXX'
  }
];

const offices = [
  {
    city: 'Oslo',
    address: 'Karl Johans gate 25',
    postal: '0159 Oslo',
    phone: '+47 XXX XX XXX',
    email: 'oslo@notably.no'
  },
  {
    city: 'Bergen',
    address: 'Torgallmenningen 8',
    postal: '5014 Bergen',
    phone: '+47 XXX XX XXX',
    email: 'bergen@notably.no'
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    employees: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        company: '',
        employees: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setSubmitStatus(null);
  };

  return (
    <main className="pt-16">
      {/* Hero Section */}
      <section className="hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-violet-100 mb-8">
              <Building className="h-4 w-4 text-violet-600 mr-2" />
              <span className="text-sm font-medium text-violet-600">Kontakt oss</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              <span className="gradient-text">La oss snakke sammen</span>
            </h1>
            <p className="text-xl text-gray-600">
              Vi er her for å hjelpe deg med å finne den beste løsningen for din bedrift
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <a
                key={index}
                href={method.href}
                className="feature-card group flex flex-col items-center text-center p-8"
              >
                <div className="feature-icon mb-6">
                  <method.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{method.title}</h3>
                <p className="text-gray-600 mb-6">{method.description}</p>
                <span className="text-violet-600 font-medium group-hover:text-violet-700">
                  {method.action}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Form */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="max-w-lg">
                <h2 className="text-3xl font-bold mb-2">Send oss en melding</h2>
                <p className="text-gray-600 mb-8">
                  Fortell oss om dine behov, så hjelper vi deg med å finne den beste løsningen
                </p>

                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-600 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span>Takk for din henvendelse! Vi tar kontakt snart.</span>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span>Noe gikk galt. Vennligst prøv igjen.</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Navn
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      E-post
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                      Bedrift
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="employees" className="block text-sm font-medium text-gray-700 mb-1">
                      Antall ansatte
                    </label>
                    <select
                      id="employees"
                      name="employees"
                      value={formData.employees}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                    >
                      <option value="">Velg antall</option>
                      <option value="1-10">1-10</option>
                      <option value="11-50">11-50</option>
                      <option value="51-200">51-200</option>
                      <option value="201-500">201-500</option>
                      <option value="501+">501+</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Melding
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      "button-primary w-full justify-center",
                      isSubmitting && "opacity-75 cursor-not-allowed"
                    )}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Sender...
                      </div>
                    ) : (
                      'Send melding'
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="lg:sticky lg:top-24 space-y-8">
              <div className="feature-card">
                <h3 className="text-xl font-semibold mb-6">Våre kontorer</h3>
                <div className="space-y-8">
                  {offices.map((office, index) => (
                    <div key={index} className="flex space-x-4">
                      <MapPin className="h-5 w-5 text-violet-600 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium mb-2">{office.city}</h4>
                        <p className="text-gray-600">{office.address}</p>
                        <p className="text-gray-600">{office.postal}</p>
                        <div className="mt-4 space-y-2">
                          <p className="text-sm text-gray-600">
                            <Phone className="h-4 w-4 inline mr-2" />
                            {office.phone}
                          </p>
                          <p className="text-sm text-gray-600">
                            <Mail className="h-4 w-4 inline mr-2" />
                            {office.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="feature-card">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 rounded-xl bg-violet-100">
                    <Users className="h-6 w-6 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Enterprise</h3>
                    <p className="text-gray-600">For større organisasjoner</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  Trenger du en skreddersydd løsning for din organisasjon? 
                  Vårt enterprise-team hjelper deg med å finne den perfekte løsningen.
                </p>
                <a 
                  href="/enterprise"
                  className="inline-flex items-center text-violet-600 hover:text-violet-700 font-medium"
                >
                  <Briefcase className="h-5 w-5 mr-2" />
                  Les mer om Enterprise
                  <ArrowRight className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}