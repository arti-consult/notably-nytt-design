import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check,
  Edit3,
  Wand2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Template } from '@/lib/mockTemplates';
import { generateCustomPrompt } from '@/lib/mockTemplateWizard';

interface CreateTemplateWizardProps {
  onClose: () => void;
  onCreate: (template: Template) => void;
}

type WizardStep = 1 | 2;

const availableIcons = ['📝', '📊', '📋', '💼', '🎯', '📌', '✅', '📁', '🗂️', '📑', '🏷️', '⭐'];

export default function CreateTemplateWizard({ onClose, onCreate }: CreateTemplateWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [description, setDescription] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateIcon, setTemplateIcon] = useState('📝');
  const [showIconPicker, setShowIconPicker] = useState(false);

  // Step 1: Generate custom prompt
  const handleGeneratePrompt = () => {
    if (!description.trim()) return;

    const prompt = generateCustomPrompt(description);
    setGeneratedPrompt(prompt.content);
    setTemplateName(prompt.name);
    setTemplateIcon(prompt.icon);
    setCurrentStep(2);
  };

  // Step 2: Create template
  const handleCreateTemplate = () => {
    if (!templateName.trim() || !generatedPrompt.trim()) return;

    const newTemplate: Template = {
      id: `wizard-${Date.now()}`,
      name: templateName.trim(),
      description: 'AI-generert mal med egendefinert prompt',
      category: 'standard',
      sections: [],
      icon: templateIcon,
      isCustom: true,
      isCustomPrompt: true,
      customPrompt: generatedPrompt.trim()
    };

    onCreate(newTemplate);
  };

  const canProceedStep1 = description.trim().length > 10;
  const canProceedStep2 = templateName.trim().length > 0 && generatedPrompt.trim().length > 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-100 to-fuchsia-100 rounded-lg">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Lag mal med AI-hjelp</h2>
                  <p className="text-sm text-gray-600">Beskriv hva du trenger, vi hjelper deg å bygge den perfekte malen</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Progress indicator */}
            <div className="flex items-center space-x-2">
              {[1, 2].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all",
                    currentStep === step
                      ? "bg-blue-600 text-white ring-4 ring-blue-100"
                      : currentStep > step
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  )}>
                    {currentStep > step ? <Check className="h-4 w-4" /> : step}
                  </div>
                  {step < 2 && (
                    <div className={cn(
                      "flex-1 h-1 mx-2 rounded-full transition-all",
                      currentStep > step ? "bg-green-500" : "bg-gray-200"
                    )} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span className={currentStep === 1 ? "font-semibold text-blue-600" : ""}>Beskriv</span>
              <span className={currentStep === 2 ? "font-semibold text-blue-600" : ""}>Bekreft</span>
            </div>
          </div>

          {/* Content area */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {/* Step 1: Describe your meeting */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <Sparkles className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Fortell oss om møtene dine
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Beskriv hvilken type møter du holder, hva som er viktig å dokumentere, og hvem som skal lese referatene.
                        Jo mer detaljert du er, jo bedre prompt får du.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Beskrivelse av møtetype
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="For eksempel:

Vi har ukentlige statusmøter med utviklingsteamet hvor vi går gjennom fremgang, blokkere og planlegger neste sprint. Møtene varer ca 30-45 minutter og det er viktig å få med konkrete handlingspunkter og hvem som er ansvarlig.

eller

Vi møter kunder ukentlig for å diskutere prosjektfremdrift. Viktig å dokumentere kundens tilbakemeldinger, ønsker for endringer og neste steg. Referatet skal være profesjonelt og lett å dele med kunden etterpå."
                      rows={12}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-sm resize-none transition-all"
                      autoFocus
                    />
                    <div className="flex items-center justify-between text-xs">
                      <span className={cn(
                        "transition-colors",
                        description.trim().length < 10 ? "text-gray-400" : "text-green-600"
                      )}>
                        {description.trim().length} tegn
                      </span>
                      {description.trim().length < 10 && (
                        <span className="text-amber-600">Skriv minst noen setninger for best resultat</span>
                      )}
                    </div>
                  </div>

                  {/* Example prompts */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs font-medium text-gray-500 mb-3">💡 Eksempler på beskrivelser:</p>
                    <div className="space-y-2">
                      {[
                        "Daglige stand-up møter med utviklingsteamet, fokus på hva som ble gjort i går og hva som skal gjøres i dag",
                        "Månedlige styremøter med formelle vedtak og protokollføring",
                        "Brainstorming-workshops for produktutvikling med fokus på kreative ideer"
                      ].map((example, idx) => (
                        <button
                          key={idx}
                          onClick={() => setDescription(example)}
                          className="w-full text-left p-3 bg-white rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-colors border border-gray-100"
                        >
                          {example}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Review and edit prompt */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <Wand2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Slik kommer malen din til å se ut
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Vi har laget en AI-instruksjon basert på din beskrivelse. Du kan bekrefte eller redigere den.
                      </p>
                    </div>
                  </div>

                  {/* Template name and icon */}
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-fuchsia-50 rounded-xl border border-blue-200">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Gi malen et navn
                    </label>
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowIconPicker(!showIconPicker)}
                          className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
                        >
                          {templateIcon}
                        </button>
                        {showIconPicker && (
                          <div className="absolute top-full left-0 mt-2 p-3 bg-white rounded-xl shadow-xl border border-gray-200 z-10 w-64">
                            <p className="text-xs font-medium text-gray-500 mb-2">Velg ikon</p>
                            <div className="grid grid-cols-6 gap-1">
                              {availableIcons.map((emoji) => (
                                <button
                                  key={emoji}
                                  type="button"
                                  onClick={() => {
                                    setTemplateIcon(emoji);
                                    setShowIconPicker(false);
                                  }}
                                  className={cn(
                                    "w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all",
                                    templateIcon === emoji
                                      ? "bg-blue-100 ring-2 ring-blue-500"
                                      : "hover:bg-gray-100"
                                  )}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <input
                        type="text"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        placeholder="F.eks. Prosjektmøte - møtereferat"
                        className="flex-1 px-4 py-2 text-lg font-semibold bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Generated prompt display/edit */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        AI-instruksjon for malen
                      </label>
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        {isEditing ? 'Ferdig' : 'Rediger'}
                      </button>
                    </div>

                    {isEditing ? (
                      <textarea
                        value={generatedPrompt}
                        onChange={(e) => setGeneratedPrompt(e.target.value)}
                        rows={18}
                        className="w-full px-4 py-3 rounded-xl border-2 border-blue-300 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-sm font-mono resize-none transition-all"
                      />
                    ) : (
                      <div className="p-4 bg-white border-2 border-gray-200 rounded-xl max-h-[400px] overflow-y-auto">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
{generatedPrompt}
                        </pre>
                      </div>
                    )}

                    <p className="text-xs text-gray-500">
                      {isEditing
                        ? '✏️ Du kan justere instruksjonen for å få akkurat det resultatet du ønsker'
                        : '👁️ Slik vil AI-en generere møtereferatet ditt'
                      }
                    </p>
                  </div>

                  {/* Info box */}
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex items-start gap-2">
                      <Wand2 className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-amber-900 font-medium mb-1">
                          Om denne maltypen
                        </p>
                        <p className="text-sm text-amber-800">
                          Denne malen genererer ett sammenhengende referat basert på AI-instruksjonen over,
                          i stedet for separate moduler/seksjoner. Perfekt for kraftbrukere som vil ha full kontroll.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer with navigation */}
          <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between flex-shrink-0">
            <div>
              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Tilbake
                </button>
              )}
            </div>

            <div className="flex items-center space-x-3">
              {currentStep === 1 ? (
                <button
                  onClick={handleGeneratePrompt}
                  disabled={!canProceedStep1}
                  className={cn(
                    "inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold transition-all",
                    canProceedStep1
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-200"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  )}
                >
                  Generer mal
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleCreateTemplate}
                  disabled={!canProceedStep2}
                  className={cn(
                    "inline-flex items-center px-6 py-2.5 rounded-xl text-sm font-semibold transition-all",
                    canProceedStep2
                      ? "bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600 shadow-lg shadow-green-200"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  )}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Lagre mal
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
