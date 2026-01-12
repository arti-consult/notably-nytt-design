import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check,
  ChevronDown,
  Edit3,
  Eye,
  Wand2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Template } from '@/lib/mockTemplates';
import {
  generateTemplateProposals,
  TemplateProposal,
  TemplateSection,
  generateAdjustedSection
} from '@/lib/mockTemplateWizard';

interface CreateTemplateWizardProps {
  onClose: () => void;
  onCreate: (template: Template) => void;
}

type WizardStep = 1 | 3 | 4;

const availableIcons = ['📝', '📊', '📋', '💼', '🎯', '📌', '✅', '📁', '🗂️', '📑', '🏷️', '⭐'];

export default function CreateTemplateWizard({ onClose, onCreate }: CreateTemplateWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [description, setDescription] = useState('');
  const [proposals, setProposals] = useState<TemplateProposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<TemplateProposal | null>(null);
  const [customizedSections, setCustomizedSections] = useState<TemplateSection[]>([]);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingInstructionId, setEditingInstructionId] = useState<string | null>(null);
  const [adjustingSection, setAdjustingSection] = useState<string | null>(null);
  const [sectionAdjustment, setSectionAdjustment] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [templateIcon, setTemplateIcon] = useState('📝');
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [previewProposal, setPreviewProposal] = useState<TemplateProposal | null>(null);
  const [showFullInstruction, setShowFullInstruction] = useState<Record<string, boolean>>({});

  // Step 1: Generate proposal and go directly to customization
  const handleGenerateProposals = () => {
    if (!description.trim()) return;

    const generatedProposals = generateTemplateProposals(description);
    const firstProposal = generatedProposals[0];

    setProposals(generatedProposals);
    setSelectedProposal(firstProposal);
    setCustomizedSections([...firstProposal.sections]);
    setTemplateName(firstProposal.name);
    setTemplateIcon(firstProposal.icon);
    setCurrentStep(3);
  };

  // Step 3: Adjust a section
  const handleAdjustSection = (sectionId: string) => {
    if (!sectionAdjustment.trim()) return;

    const sectionToAdjust = customizedSections.find(s => s.id === sectionId);
    if (!sectionToAdjust) return;

    // Start the magical AI animation
    setAdjustingSection(sectionId);

    // Simulate AI processing with a delay for the magical effect
    setTimeout(() => {
      const adjustedSection = generateAdjustedSection(sectionToAdjust, sectionAdjustment);

      setCustomizedSections(prev =>
        prev.map(s => s.id === sectionId ? adjustedSection : s)
      );

      setSectionAdjustment('');
      setEditingSection(null);
      setAdjustingSection(null);
    }, 1800); // 1.8 seconds for a magical feel
  };

  // Direct edit AI instruction
  const handleDirectEditInstruction = (sectionId: string, newInstruction: string) => {
    setCustomizedSections(prev =>
      prev.map(s => s.id === sectionId ? { ...s, aiInstruction: newInstruction } : s)
    );
    setEditingInstructionId(null);
  };

  // Truncate text helper
  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    const truncated = text.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    return lastSpace > 0 ? truncated.slice(0, lastSpace) + '...' : truncated + '...';
  };

  // Step 4: Create template
  const handleCreateTemplate = () => {
    if (!templateName.trim()) return;

    const sectionTitles = customizedSections.map(s => s.title);

    const newTemplate: Template = {
      id: `wizard-${Date.now()}`,
      name: templateName.trim(),
      description: selectedProposal?.description || 'AI-generert mal',
      category: 'standard',
      sections: sectionTitles,
      icon: templateIcon,
      isCustom: true,
      metadata: {
        aiGenerated: true,
        originalDescription: description,
        sectionsDetail: customizedSections
      }
    };

    onCreate(newTemplate);
  };

  const canProceedStep1 = description.trim().length > 10;
  const canProceedStep3 = templateName.trim().length > 0;

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
                  <p className="text-sm text-gray-600">La oss lage den perfekte malen sammen</p>
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
            <div className="flex items-center justify-center max-w-md mx-auto">
              {[1, 3, 4].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition-all",
                    currentStep === step
                      ? "bg-blue-600 text-white ring-4 ring-blue-100"
                      : currentStep > step
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  )}>
                    {currentStep > step ? <Check className="h-4 w-4" /> : (index + 1)}
                  </div>
                  {index < 2 && (
                    <div className={cn(
                      "w-32 h-1 mx-3 rounded-full transition-all",
                      currentStep > step ? "bg-blue-500" : "bg-gray-200"
                    )} />
                  )}
                </div>
              ))}
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
                        Jo mer detaljert du er, jo bedre forslag får du.
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
                        description.trim().length < 10 ? "text-gray-400" : "text-blue-600"
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

              {/* Step 3: Fine-tune sections */}
              {currentStep === 3 && selectedProposal && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <Edit3 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Finjuster seksjonene
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Klikk på en seksjon for å se hvordan AI-en vil generere innholdet. Du kan justere hver seksjon etter dine behov.
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
                        placeholder="F.eks. Ukentlig statusmøte"
                        className="flex-1 px-4 py-2 text-lg font-semibold bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Sections list */}
                  <div className="space-y-3">
                    {customizedSections.map((section, index) => (
                      <div
                        key={section.id}
                        className="border-2 border-gray-200 rounded-xl overflow-hidden transition-all hover:border-blue-300"
                      >
                        <button
                          onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                          className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className="flex items-center space-x-3 flex-1">
                            <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-lg text-sm font-semibold">
                              {index + 1}
                            </span>
                            <span className="text-2xl">{section.icon}</span>
                            <span className="font-medium text-gray-900">{section.title}</span>
                          </div>
                          <ChevronDown className={cn(
                            "h-5 w-5 text-gray-400 transition-transform",
                            expandedSection === section.id && "rotate-180"
                          )} />
                        </button>

                        <AnimatePresence>
                          {expandedSection === section.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-4">
                                {/* AI Instructions */}
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                      <Wand2 className="h-4 w-4 text-blue-600" />
                                      <h5 className="text-sm font-semibold text-gray-700">AI-instruksjon:</h5>
                                    </div>
                                    {editingInstructionId !== section.id && (
                                      <button
                                        onClick={() => setEditingInstructionId(section.id)}
                                        className="flex items-center space-x-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                                      >
                                        <Edit3 className="h-3 w-3" />
                                        <span>Rediger</span>
                                      </button>
                                    )}
                                  </div>
                                  {editingInstructionId === section.id ? (
                                    <div className="space-y-2">
                                      <textarea
                                        defaultValue={section.aiInstruction}
                                        onBlur={(e) => handleDirectEditInstruction(section.id, e.target.value)}
                                        rows={5}
                                        className="w-full px-3 py-2 text-sm rounded-lg border-2 border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                        autoFocus
                                      />
                                      <button
                                        onClick={() => setEditingInstructionId(null)}
                                        className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900"
                                      >
                                        Ferdig
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="relative">
                                      <div className="text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-200">
                                        <p>
                                          {showFullInstruction[section.id]
                                            ? section.aiInstruction
                                            : truncateText(section.aiInstruction, 150)}
                                        </p>
                                        {section.aiInstruction.length > 150 && (
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setShowFullInstruction(prev => ({
                                                ...prev,
                                                [section.id]: !prev[section.id]
                                              }));
                                            }}
                                            className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
                                          >
                                            {showFullInstruction[section.id] ? 'Vis mindre' : 'Vis mer'}
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Example Output */}
                                <div>
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Eye className="h-4 w-4 text-blue-600" />
                                    <h5 className="text-sm font-semibold text-gray-700">Eksempel på output:</h5>
                                  </div>
                                  <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg border border-blue-200 italic">
                                    "{section.exampleOutput}"
                                  </p>
                                </div>

                                {/* Custom adjustment */}
                                {adjustingSection === section.id ? (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-100 via-fuchsia-100 to-purple-100 p-6 border-2 border-blue-300"
                                  >
                                    {/* Animated background shimmer */}
                                    <motion.div
                                      animate={{
                                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                                      }}
                                      transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "linear"
                                      }}
                                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                      style={{ backgroundSize: '200% 100%' }}
                                    />

                                    {/* Content */}
                                    <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
                                      {/* Animated wand icon */}
                                      <motion.div
                                        animate={{
                                          rotate: [0, -10, 10, -10, 0],
                                          scale: [1, 1.1, 1, 1.1, 1],
                                        }}
                                        transition={{
                                          duration: 2,
                                          repeat: Infinity,
                                          ease: "easeInOut"
                                        }}
                                        className="relative"
                                      >
                                        <Wand2 className="h-8 w-8 text-blue-600" />

                                        {/* Sparkles around the wand */}
                                        {[...Array(3)].map((_, i) => (
                                          <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{
                                              opacity: [0, 1, 0],
                                              scale: [0, 1, 0],
                                              x: [0, (i - 1) * 20],
                                              y: [0, -20 - i * 10],
                                            }}
                                            transition={{
                                              duration: 1.5,
                                              repeat: Infinity,
                                              delay: i * 0.2,
                                              ease: "easeOut"
                                            }}
                                            className="absolute top-0 left-1/2"
                                          >
                                            <Sparkles className="h-4 w-4 text-fuchsia-500" />
                                          </motion.div>
                                        ))}
                                      </motion.div>

                                      {/* Pulsing text */}
                                      <motion.div
                                        animate={{
                                          opacity: [0.7, 1, 0.7],
                                        }}
                                        transition={{
                                          duration: 2,
                                          repeat: Infinity,
                                          ease: "easeInOut"
                                        }}
                                        className="text-center"
                                      >
                                        <p className="text-sm font-semibold text-gray-900 mb-1">
                                          ✨ AI justerer seksjonen...
                                        </p>
                                        <p className="text-xs text-gray-600">
                                          Dette tar bare et øyeblikk
                                        </p>
                                      </motion.div>

                                      {/* Animated dots */}
                                      <div className="flex space-x-1">
                                        {[0, 1, 2].map((i) => (
                                          <motion.div
                                            key={i}
                                            animate={{
                                              scale: [1, 1.5, 1],
                                              opacity: [0.3, 1, 0.3],
                                            }}
                                            transition={{
                                              duration: 1,
                                              repeat: Infinity,
                                              delay: i * 0.2,
                                            }}
                                            className="w-2 h-2 bg-blue-600 rounded-full"
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  </motion.div>
                                ) : editingSection === section.id ? (
                                  <div className="space-y-2">
                                    <label className="block text-xs font-medium text-gray-700">
                                      Beskriv hva som må endres:
                                    </label>
                                    <textarea
                                      value={sectionAdjustment}
                                      onChange={(e) => setSectionAdjustment(e.target.value)}
                                      placeholder="F.eks. 'Gjør det kortere' eller 'Legg til fokus på tekniske detaljer'"
                                      rows={2}
                                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                      autoFocus
                                    />
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => handleAdjustSection(section.id)}
                                        disabled={adjustingSection === section.id}
                                        className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        Juster
                                      </button>
                                      <button
                                        onClick={() => {
                                          setEditingSection(null);
                                          setSectionAdjustment('');
                                        }}
                                        disabled={adjustingSection === section.id}
                                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        Avbryt
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setEditingSection(section.id)}
                                    className="w-full px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                  >
                                    Be AI om å gjøre endringer
                                  </button>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 4: Preview */}
              {currentStep === 4 && selectedProposal && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <Eye className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Forhåndsvisning av din mal
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Sjekk at alt ser bra ut før du oppretter malen. Du kan alltid redigere eller slette den senere.
                      </p>
                    </div>
                  </div>

                  {/* Template preview card */}
                  <div className="bg-gradient-to-br from-blue-50 to-fuchsia-50 rounded-xl p-6 border-2 border-blue-200">
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="text-5xl">{templateIcon}</div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{templateName}</h3>
                        <p className="text-gray-600">{selectedProposal.description}</p>
                        <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                          <span className="inline-flex items-center">
                            <Sparkles className="h-4 w-4 mr-1 text-blue-600" />
                            AI-generert
                          </span>
                          <span>{customizedSections.length} seksjoner</span>
                        </div>
                      </div>
                    </div>

                    {/* Sections preview */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 mb-3">Seksjoner som inkluderes:</h4>
                      {customizedSections.map((section, index) => (
                        <div
                          key={section.id}
                          className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-gray-200"
                        >
                          <span className="flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-600 rounded-lg text-sm font-semibold flex-shrink-0">
                            {index + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xl">{section.icon}</span>
                              <span className="font-medium text-gray-900">{section.title}</span>
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-2">{section.aiInstruction}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Info box */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-sm text-blue-900">
                      <strong>💡 Tips:</strong> Når du bruker denne malen vil AI-en automatisk generere innhold for hver seksjon basert på instruksjonene du har sett i forrige steg.
                    </p>
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
                  onClick={() => setCurrentStep((prev) => (prev - 1) as WizardStep)}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Tilbake
                </button>
              )}
            </div>

            <div className="flex items-center space-x-3">
              {currentStep < 4 ? (
                <button
                  onClick={() => {
                    if (currentStep === 1) {
                      handleGenerateProposals();
                    } else if (currentStep === 3) {
                      setCurrentStep(4);
                    }
                  }}
                  disabled={
                    (currentStep === 1 && !canProceedStep1) ||
                    (currentStep === 3 && !canProceedStep3)
                  }
                  className={cn(
                    "inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold transition-all",
                    (currentStep === 1 && canProceedStep1) || (currentStep === 3 && canProceedStep3)
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-200"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  )}
                >
                  {currentStep === 1 ? 'Generer forslag' : 'Neste'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleCreateTemplate}
                  className="inline-flex items-center px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-200 transition-all"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Opprett mal
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
