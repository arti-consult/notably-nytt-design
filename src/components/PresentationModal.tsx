import { useState, useEffect, useCallback } from 'react';
import {
  X,
  Presentation,
  ChevronDown,
  Check,
  ExternalLink,
  Copy,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  PresentationType,
  PresentationOptions,
  GeneratedPresentation,
  presentationTypes,
  slideCountOptions,
  languageOptions,
  generationSteps,
  defaultPresentationOptions,
  mockGeneratePresentation
} from '@/lib/presentationTypes';

interface PresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingId: string;
  meetingTitle: string;
  meetingSummary: string;
}

type ModalState = 'form' | 'generating' | 'success' | 'error';

export default function PresentationModal({
  isOpen,
  onClose,
  meetingId,
  meetingTitle,
  meetingSummary
}: PresentationModalProps) {
  const [state, setState] = useState<ModalState>('form');
  const [options, setOptions] = useState<PresentationOptions>(defaultPresentationOptions);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showSlideDropdown, setShowSlideDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<GeneratedPresentation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setState('form');
      setOptions(defaultPresentationOptions);
      setCurrentStep(0);
      setResult(null);
      setError(null);
      setCopied(false);
    }
  }, [isOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowTypeDropdown(false);
      setShowSlideDropdown(false);
      setShowLanguageDropdown(false);
    };
    if (showTypeDropdown || showSlideDropdown || showLanguageDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showTypeDropdown, showSlideDropdown, showLanguageDropdown]);

  // Escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const selectedType = presentationTypes.find(t => t.id === options.type)!;

  const handleGenerate = useCallback(async () => {
    setState('generating');
    setCurrentStep(0);
    setError(null);

    // Simulate progress through steps
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < generationSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 800);

    try {
      const presentation = await mockGeneratePresentation(options, {
        id: meetingId,
        title: meetingTitle,
        summary: meetingSummary
      });
      clearInterval(stepInterval);
      setResult(presentation);
      setState('success');
    } catch (err) {
      clearInterval(stepInterval);
      setError(err instanceof Error ? err.message : 'En feil oppstod');
      setState('error');
    }
  }, [options, meetingId, meetingTitle, meetingSummary]);

  const handleCopyLink = useCallback(() => {
    if (result?.url) {
      navigator.clipboard.writeText(result.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result]);

  const handleOpenInGamma = useCallback(() => {
    if (result?.url) {
      window.open(result.url, '_blank');
    }
  }, [result]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-violet-100 rounded-lg">
                <Presentation className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {state === 'generating' ? 'Genererer presentasjon...' :
                   state === 'success' ? 'Presentasjon klar!' :
                   state === 'error' ? 'Noe gikk galt' :
                   'Lag presentasjon'}
                </h3>
                <p className="text-sm text-gray-500">
                  {state === 'form' && 'Generer en profesjonell presentasjon fra møtenotater'}
                  {state === 'generating' && 'Dette tar vanligvis 30-60 sekunder'}
                  {state === 'success' && 'Din presentasjon er klar i Gamma'}
                  {state === 'error' && 'Prøv igjen eller kontakt support'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {state === 'form' && (
            <div className="space-y-6">
              {/* Presentation Type Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Presentasjonstype
                </label>
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowTypeDropdown(!showTypeDropdown);
                      setShowSlideDropdown(false);
                      setShowLanguageDropdown(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <selectedType.icon className="h-5 w-5 text-violet-500" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{selectedType.name}</p>
                        <p className="text-sm text-gray-500">{selectedType.description}</p>
                      </div>
                    </div>
                    <ChevronDown className={cn(
                      "h-5 w-5 text-gray-400 transition-transform",
                      showTypeDropdown && "rotate-180"
                    )} />
                  </button>

                  {showTypeDropdown && (
                    <div className="absolute z-20 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 py-2 max-h-64 overflow-auto">
                      {presentationTypes.map(type => (
                        <button
                          key={type.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOptions(prev => ({ ...prev, type: type.id, slideCount: type.defaultSlides }));
                            setShowTypeDropdown(false);
                          }}
                          className={cn(
                            "w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors",
                            options.type === type.id && "bg-violet-50"
                          )}
                        >
                          <type.icon className={cn(
                            "h-5 w-5",
                            options.type === type.id ? "text-violet-600" : "text-gray-400"
                          )} />
                          <div className="text-left flex-1">
                            <p className={cn(
                              "font-medium",
                              options.type === type.id ? "text-violet-600" : "text-gray-900"
                            )}>{type.name}</p>
                            <p className="text-sm text-gray-500">{type.description}</p>
                          </div>
                          {options.type === type.id && (
                            <Check className="h-5 w-5 text-violet-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Settings Section */}
              <div className="p-4 bg-gray-50 rounded-xl space-y-4">
                <h4 className="text-sm font-medium text-gray-700">Innstillinger</h4>

                {/* Language and Slide Count */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Language */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Språk</label>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowLanguageDropdown(!showLanguageDropdown);
                          setShowTypeDropdown(false);
                          setShowSlideDropdown(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm"
                      >
                        <span className="text-gray-900">
                          {languageOptions.find(l => l.value === options.language)?.label}
                        </span>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </button>
                      {showLanguageDropdown && (
                        <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                          {languageOptions.map(lang => (
                            <button
                              key={lang.value}
                              onClick={(e) => {
                                e.stopPropagation();
                                setOptions(prev => ({ ...prev, language: lang.value }));
                                setShowLanguageDropdown(false);
                              }}
                              className={cn(
                                "w-full px-3 py-2 text-sm text-left hover:bg-gray-50",
                                options.language === lang.value && "bg-violet-50 text-violet-600"
                              )}
                            >
                              {lang.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Slide Count */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Antall slides</label>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowSlideDropdown(!showSlideDropdown);
                          setShowTypeDropdown(false);
                          setShowLanguageDropdown(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm"
                      >
                        <span className="text-gray-900">{options.slideCount} slides</span>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </button>
                      {showSlideDropdown && (
                        <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                          {slideCountOptions.map(count => (
                            <button
                              key={count}
                              onClick={(e) => {
                                e.stopPropagation();
                                setOptions(prev => ({ ...prev, slideCount: count }));
                                setShowSlideDropdown(false);
                              }}
                              className={cn(
                                "w-full px-3 py-2 text-sm text-left hover:bg-gray-50",
                                options.slideCount === count && "bg-violet-50 text-violet-600"
                              )}
                            >
                              {count} slides
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Include Options */}
                <div>
                  <label className="block text-xs text-gray-500 mb-2">Inkluder i presentasjonen</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'includeParticipants', label: 'Deltakerliste' },
                      { key: 'includeActionItems', label: 'Aksjonspunkter' },
                      { key: 'includeTimeline', label: 'Tidslinje' },
                      { key: 'includeTranscription', label: 'Transkripsjon' }
                    ].map(item => (
                      <label
                        key={item.key}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={options[item.key as keyof PresentationOptions] as boolean}
                          onChange={(e) => setOptions(prev => ({ ...prev, [item.key]: e.target.checked }))}
                          className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                        />
                        <span className="text-sm text-gray-700">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Custom Instructions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Egne instruksjoner (valgfritt)
                </label>
                <textarea
                  value={options.customInstructions}
                  onChange={(e) => setOptions(prev => ({ ...prev, customInstructions: e.target.value }))}
                  placeholder="F.eks: Fokuser på budsjett. Bruk profesjonell tone. Inkluder grafer..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:ring-violet-500 resize-none text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Disse instruksjonene sendes til Gamma for å tilpasse presentasjonen
                </p>
              </div>
            </div>
          )}

          {state === 'generating' && (
            <div className="py-8">
              {/* Spinner */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-violet-100" />
                  <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-violet-600 border-t-transparent animate-spin" />
                  <Presentation className="absolute inset-0 m-auto h-6 w-6 text-violet-600" />
                </div>
              </div>

              {/* Progress Steps */}
              <div className="space-y-3 max-w-xs mx-auto">
                {generationSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center space-x-3">
                    {index < currentStep ? (
                      <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    ) : index === currentStep ? (
                      <div className="h-5 w-5 rounded-full border-2 border-violet-500 border-t-transparent animate-spin flex-shrink-0" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                    )}
                    <span className={cn(
                      "text-sm",
                      index < currentStep ? "text-emerald-600" :
                      index === currentStep ? "text-gray-900 font-medium" :
                      "text-gray-400"
                    )}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {state === 'success' && result && (
            <div className="py-4">
              {/* Success Card */}
              <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-xl p-4 mb-6 border border-violet-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    {(() => {
                      const TypeIcon = presentationTypes.find(t => t.id === result.type)?.icon || Presentation;
                      return <TypeIcon className="h-6 w-6 text-violet-600" />;
                    })()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{result.title}</p>
                    <p className="text-sm text-gray-600">
                      {result.slideCount} slides • {options.language === 'no' ? 'Norsk' : 'English'}
                    </p>
                  </div>
                  <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                </div>
              </div>

              <p className="text-center text-sm text-gray-500 mb-4">
                Din presentasjon er klar i Gamma
              </p>
            </div>
          )}

          {state === 'error' && (
            <div className="py-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <p className="text-gray-900 font-medium mb-2">{error}</p>
              <p className="text-sm text-gray-500">
                Prøv igjen eller kontakt support hvis problemet vedvarer
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
          {state === 'form' && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Avbryt
              </button>
              <button
                onClick={handleGenerate}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-medium flex items-center space-x-2 transition-colors"
              >
                <Presentation className="h-4 w-4" />
                <span>Generer</span>
              </button>
            </>
          )}

          {state === 'generating' && (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Avbryt
            </button>
          )}

          {state === 'success' && (
            <>
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span>Kopiert!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Kopier lenke</span>
                  </>
                )}
              </button>
              <button
                onClick={handleOpenInGamma}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-medium flex items-center space-x-2 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Åpne i Gamma</span>
              </button>
            </>
          )}

          {state === 'error' && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Lukk
              </button>
              <button
                onClick={() => setState('form')}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-medium transition-colors"
              >
                Prøv igjen
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
