import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  FileText,
  Check,
  Plus,
  Star,
  Search,
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Wand2,
  AlertTriangle,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/toast';
import { mockTemplates, Template } from '@/lib/mockTemplates';
import { motion, AnimatePresence } from 'framer-motion';

const availableIcons = ['📝', '📊', '📋', '💼', '🎯', '📌', '✅', '📁', '🗂️', '📑', '🏷️', '⭐'];

interface TemplateCardProps {
  template: Template;
  isSelected: boolean;
  onSelect: () => void;
  onPreview: () => void;
  onDelete?: () => void;
}

function TemplateCard({ template, isSelected, onSelect, onPreview, onDelete }: TemplateCardProps) {
  return (
    <div
      className={cn(
        "relative bg-white rounded-xl shadow-sm overflow-hidden transition-all cursor-pointer group flex flex-col h-full",
        isSelected
          ? "ring-2 ring-blue-600 shadow-md"
          : "hover:shadow-md hover:ring-1 hover:ring-blue-200"
      )}
      onClick={onPreview}
    >
      {template.isDefault && (
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            <Star className="h-3 w-3 mr-1" />
            Standard
          </span>
        </div>
      )}
      {template.isCustom && !template.isCustomPrompt && (
        <div className="absolute top-3 right-3 flex items-center gap-1">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
            <Sparkles className="h-3 w-3 mr-1" />
            Egendefinert
          </span>
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1 rounded-full bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
              title="Slett mal"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}
      {template.isCustomPrompt && (
        <div className="absolute top-3 right-3 flex items-center gap-1">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-fuchsia-100 text-fuchsia-700">
            <Wand2 className="h-3 w-3 mr-1" />
            AI-prompt
          </span>
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1 rounded-full bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
              title="Slett mal"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}

      <div className="p-5 flex-1">
        <div className="text-3xl mb-3">{template.icon}</div>
        <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>

        {template.isCustomPrompt ? (
          <div className="flex items-center gap-2 text-xs text-fuchsia-600">
            <Wand2 className="h-3.5 w-3.5" />
            <span>Egendefinert AI-instruksjon</span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-1">
            {template.sections.slice(0, 3).map((section, index) => (
              <span
                key={index}
                className="inline-block px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600"
              >
                {section}
              </span>
            ))}
            {template.sections.length > 3 && (
              <span className="inline-block px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                +{template.sections.length - 3} mer
              </span>
            )}
          </div>
        )}
      </div>

      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={cn(
            "inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
            isSelected
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-600"
          )}
        >
          {isSelected ? (
            <>
              <Check className="h-4 w-4 mr-1" />
              Valgt
            </>
          ) : (
            'Velg som standard'
          )}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPreview();
          }}
          className="text-sm text-gray-500 hover:text-blue-600"
        >
          Forhåndsvis
        </button>
      </div>
    </div>
  );
}

interface TemplatePreviewModalProps {
  template: Template | null;
  onClose: () => void;
  onSelect: () => void;
  isSelected: boolean;
}

function TemplatePreviewModal({ template, onClose, onSelect, isSelected }: TemplatePreviewModalProps) {
  if (!template) return null;

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
          className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{template.icon}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">{template.name}</h2>
                    {template.isCustomPrompt && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-fuchsia-100 text-fuchsia-700">
                        <Wand2 className="h-3 w-3 mr-1" />
                        AI-prompt
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600">{template.description}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[50vh]">
            {template.isCustomPrompt ? (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <Wand2 className="h-5 w-5 text-fuchsia-600" />
                  <h3 className="font-semibold">AI-instruksjoner:</h3>
                </div>
                <div className="p-4 bg-gradient-to-br from-fuchsia-50 to-blue-50 border border-fuchsia-200 rounded-xl">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {template.customPrompt}
                  </p>
                </div>
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">
                      Denne malen genererer fritekst-output uten strukturerte seksjoner.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-semibold mb-4">Seksjoner i denne malen:</h3>
                <div className="space-y-2">
                  {template.sections.map((section, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                        {index + 1}
                      </span>
                      <span>{section}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="button-secondary"
            >
              Lukk
            </button>
            <button
              onClick={onSelect}
              className={cn(
                "button-primary inline-flex items-center",
                isSelected && "bg-green-600 hover:bg-green-700"
              )}
            >
              {isSelected ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Mal er valgt
                </>
              ) : (
                'Velg denne malen'
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Pre-defined modules that users can choose from
const availableModules = [
  {
    id: 'meeting-info',
    title: 'Møteinformasjon',
    description: 'Dato, tidspunkt, varighet og møtetype',
    icon: '📅',
    category: 'basis'
  },
  {
    id: 'participants',
    title: 'Deltakere',
    description: 'Liste over alle som deltok i møtet',
    icon: '👥',
    category: 'basis'
  },
  {
    id: 'summary',
    title: 'Sammendrag',
    description: 'Kort oppsummering av møtets hovedpunkter',
    icon: '📝',
    category: 'basis'
  },
  {
    id: 'agenda',
    title: 'Agenda',
    description: 'Strukturert oversikt over møtets planlagte punkter',
    icon: '📋',
    category: 'basis'
  },
  {
    id: 'discussion',
    title: 'Diskusjonspunkter',
    description: 'Detaljert gjennomgang av temaer som ble diskutert',
    icon: '💬',
    category: 'innhold'
  },
  {
    id: 'decisions',
    title: 'Beslutninger',
    description: 'Konkrete vedtak og avgjørelser som ble tatt',
    icon: '✅',
    category: 'innhold'
  },
  {
    id: 'action-items',
    title: 'Handlingspunkter',
    description: 'Oppgaver med ansvarlig person og frist',
    icon: '🎯',
    category: 'oppfølging'
  },
  {
    id: 'next-steps',
    title: 'Neste steg',
    description: 'Planlagte aktiviteter og veien videre',
    icon: '➡️',
    category: 'oppfølging'
  },
  {
    id: 'blockers',
    title: 'Utfordringer',
    description: 'Hindringer og problemer som må løses',
    icon: '🚧',
    category: 'innhold'
  },
  {
    id: 'key-insights',
    title: 'Nøkkelinnsikter',
    description: 'Viktige funn og lærdommer fra møtet',
    icon: '💡',
    category: 'innhold'
  },
  {
    id: 'questions',
    title: 'Spørsmål og svar',
    description: 'Oversikt over spørsmål som ble stilt og besvart',
    icon: '❓',
    category: 'innhold'
  },
  {
    id: 'quotes',
    title: 'Viktige sitater',
    description: 'Betydningsfulle utsagn fra deltakerne',
    icon: '💎',
    category: 'innhold'
  },
  {
    id: 'timeline',
    title: 'Tidslinje',
    description: 'Kronologisk oversikt med tidsstempler',
    icon: '⏱️',
    category: 'struktur'
  },
  {
    id: 'risks',
    title: 'Risikoer',
    description: 'Identifiserte risikoer og mulige tiltak',
    icon: '⚠️',
    category: 'innhold'
  },
  {
    id: 'followup',
    title: 'Oppfølging',
    description: 'Punkter som krever videre oppfølging',
    icon: '🔄',
    category: 'oppfølging'
  }
];

const moduleCategories = [
  { id: 'basis', label: 'Grunnleggende' },
  { id: 'innhold', label: 'Innhold' },
  { id: 'oppfølging', label: 'Oppfølging' },
  { id: 'struktur', label: 'Struktur' }
];

interface CreateTemplateModalProps {
  onClose: () => void;
  onCreate: (template: Template) => void;
}

function CreateTemplateModal({ onClose, onCreate }: CreateTemplateModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('📝');
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [showIconPicker, setShowIconPicker] = useState(false);

  // Power user: custom prompt mode
  const [isCustomPromptMode, setIsCustomPromptMode] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showModeConfirmation, setShowModeConfirmation] = useState(false);

  const toggleModule = (moduleId: string) => {
    setSelectedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleSwitchToCustomMode = () => {
    if (selectedModules.length > 0) {
      setShowModeConfirmation(true);
    } else {
      setIsCustomPromptMode(true);
    }
  };

  const confirmSwitchToCustomMode = () => {
    setSelectedModules([]);
    setIsCustomPromptMode(true);
    setShowModeConfirmation(false);
  };

  const handleSwitchToModuleMode = () => {
    setIsCustomPromptMode(false);
    setCustomPrompt('');
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error('Vennligst skriv inn et navn for malen');
      return;
    }

    if (isCustomPromptMode) {
      // Custom prompt template
      if (!customPrompt.trim()) {
        toast.error('Vennligst skriv inn instruksjoner for AI-en');
        return;
      }

      const newTemplate: Template = {
        id: `custom-prompt-${Date.now()}`,
        name: name.trim(),
        description: description.trim() || 'Egendefinert AI-prompt mal',
        category: 'standard',
        sections: [], // No sections for custom prompt templates
        icon,
        isCustom: true,
        isCustomPrompt: true,
        customPrompt: customPrompt.trim()
      };

      onCreate(newTemplate);
      toast.success('Egendefinert prompt-mal opprettet!');
      onClose();
    } else {
      // Module-based template
      const moduleTitles = selectedModules.map(id =>
        availableModules.find(m => m.id === id)?.title || ''
      ).filter(Boolean);

      if (moduleTitles.length === 0) {
        toast.error('Velg minst én modul');
        return;
      }

      const newTemplate: Template = {
        id: `custom-${Date.now()}`,
        name: name.trim(),
        description: description.trim() || 'Egendefinert mal',
        category: 'standard',
        sections: moduleTitles,
        icon,
        isCustom: true
      };

      onCreate(newTemplate);
      toast.success('Mal opprettet!');
      onClose();
    }
  };

  const selectedCount = selectedModules.length;

  return (
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
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Opprett egen mal</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Name input section - highlighted */}
          <div className={cn(
            "p-4 rounded-xl border-2 transition-colors",
            name.trim()
              ? "border-blue-200 bg-blue-50/50"
              : "border-amber-300 bg-amber-50"
          )}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gi malen et navn <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-4">
              {/* Icon picker */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowIconPicker(!showIconPicker)}
                  className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
                >
                  {icon}
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
                            setIcon(emoji);
                            setShowIconPicker(false);
                          }}
                          className={cn(
                            "w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all",
                            icon === emoji
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
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="F.eks. Ukentlig statusmøte"
                  className="w-full px-3 py-2 text-lg font-semibold bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  autoFocus
                />
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Kort beskrivelse (valgfritt)"
                  className="w-full px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content area - conditional based on mode */}
        <div className="flex-1 overflow-y-auto p-6">
          {isCustomPromptMode ? (
            /* Custom Prompt Mode View */
            <div className="space-y-6">
              {/* Back to module mode */}
              <button
                type="button"
                onClick={handleSwitchToModuleMode}
                className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Tilbake til modulbasert mal
              </button>

              {/* Info box */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-fuchsia-50 to-blue-50 border border-fuchsia-200">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-fuchsia-100">
                    <Wand2 className="h-5 w-5 text-fuchsia-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-fuchsia-900">Egendefinert AI-prompt</h4>
                    <p className="text-sm text-fuchsia-700 mt-1">
                      Skriv dine egne instruksjoner til AI-en. Møtereferatet blir generert som fritekst basert på prompten din, uten forhåndsdefinerte seksjoner.
                    </p>
                  </div>
                </div>
              </div>

              {/* Custom prompt textarea */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Instruksjoner til AI-en <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Beskriv hvordan du vil at møtereferatet skal struktureres og hva det skal inneholde. For eksempel:

«Lag et detaljert møtereferat med fokus på tekniske beslutninger. Inkluder alle kodeeksempler som ble diskutert. List opp alle bugs som ble nevnt med prioritet.»

eller

«Skriv et kort og konsist sammendrag på maks 200 ord. Fokuser kun på de viktigste beslutningene og hvem som er ansvarlig for oppfølging.»"
                  rows={10}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-fuchsia-500 focus:ring-fuchsia-500 placeholder-gray-400 resize-none"
                />
                <p className="text-xs text-gray-500">
                  Tips: Vær så spesifikk som mulig. Jo mer detaljerte instruksjoner, jo bedre resultat.
                </p>
              </div>

            </div>
          ) : (
            /* Module-based Mode View */
            <>
              <div className="mb-5">
                <h3 className="text-base font-semibold text-gray-900 mb-1">Velg moduler for malen</h3>
                <p className="text-sm text-gray-500">Kryss av for seksjonene du vil inkludere i møtereferatet</p>
              </div>

              {/* Modules by category */}
              <div className="space-y-6">
                {moduleCategories.map(category => {
                  const categoryModules = availableModules.filter(m => m.category === category.id);
                  if (categoryModules.length === 0) return null;

                  return (
                    <div key={category.id}>
                      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        {category.label}
                      </h4>
                      <div className="space-y-2">
                        {categoryModules.map(module => {
                          const isSelected = selectedModules.includes(module.id);
                          return (
                            <button
                              key={module.id}
                              type="button"
                              onClick={() => toggleModule(module.id)}
                              className={cn(
                                "w-full flex items-start gap-3 p-3 rounded-xl border-2 transition-all text-left",
                                isSelected
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                              )}
                            >
                              <div className={cn(
                                "w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors",
                                isSelected
                                  ? "bg-blue-600 border-blue-600"
                                  : "border-gray-300"
                              )}>
                                {isSelected && <Check className="h-3 w-3 text-white" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{module.icon}</span>
                                  <span className={cn(
                                    "font-medium",
                                    isSelected ? "text-blue-900" : "text-gray-900"
                                  )}>
                                    {module.title}
                                  </span>
                                </div>
                                <p className={cn(
                                  "text-sm mt-0.5",
                                  isSelected ? "text-blue-700" : "text-gray-500"
                                )}>
                                  {module.description}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Power user option */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleSwitchToCustomMode}
                  className="w-full p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-fuchsia-300 hover:bg-fuchsia-50/50 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-fuchsia-100 transition-colors">
                      <Wand2 className="h-5 w-5 text-gray-500 group-hover:text-fuchsia-600 transition-colors" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700 group-hover:text-fuchsia-900 transition-colors">
                          Lage din helt egen mal?
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 group-hover:bg-fuchsia-100 group-hover:text-fuchsia-600 transition-colors">
                          Power user
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5 group-hover:text-fuchsia-700 transition-colors">
                        Skriv ditt eget prompt og få full kontroll over AI-outputen
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-fuchsia-500 transition-colors" />
                  </div>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Mode switch confirmation modal */}
        <AnimatePresence>
          {showModeConfirmation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 rounded-2xl"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-full bg-amber-100">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Bytte modus?</h3>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  Du har valgt {selectedModules.length} {selectedModules.length === 1 ? 'modul' : 'moduler'}.
                  Ved å bytte til egendefinert prompt-modus vil disse valgene bli fjernet.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowModeConfirmation(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Avbryt
                  </button>
                  <button
                    type="button"
                    onClick={confirmSwitchToCustomMode}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-fuchsia-600 text-white hover:bg-fuchsia-700 transition-colors"
                  >
                    Fortsett
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between flex-shrink-0">
          <div className="text-sm text-gray-500">
            {isCustomPromptMode ? (
              customPrompt.trim() ? (
                <span className="text-fuchsia-600">Egendefinert prompt-mal</span>
              ) : (
                <span className="text-amber-600">Skriv instruksjoner til AI-en</span>
              )
            ) : (
              selectedCount === 0 ? (
                <span className="text-amber-600">Velg minst én modul</span>
              ) : (
                <span>{selectedCount} {selectedCount === 1 ? 'modul' : 'moduler'} valgt</span>
              )
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Avbryt
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                !name.trim() ||
                (isCustomPromptMode ? !customPrompt.trim() : selectedCount === 0)
              }
              className={cn(
                "px-5 py-2 rounded-xl text-sm font-medium transition-all",
                name.trim() && (isCustomPromptMode ? customPrompt.trim() : selectedCount > 0)
                  ? "bg-gradient-to-r from-[#2C64E3] to-[#5A8DF8] text-white hover:from-[#1F49C6] hover:to-[#4A81EB] hover:shadow-lg"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              )}
            >
              Opprett mal
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>('template-1');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [customTemplates, setCustomTemplates] = useState<Template[]>([]);

  // Combine mock templates with custom templates
  const allTemplates = [...mockTemplates, ...customTemplates];

  const filteredTemplates = allTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'all' ||
                            (selectedCategory === 'custom' && template.isCustom);
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    toast.success('Mal valgt! Den vil brukes som standard for nye opptak.');
  };

  const handleCreateTemplate = (template: Template) => {
    setCustomTemplates([...customTemplates, template]);
  };

  const handleDeleteTemplate = (templateId: string) => {
    setCustomTemplates(prev => prev.filter(t => t.id !== templateId));
    // If the deleted template was selected, reset to default
    if (selectedTemplate === templateId) {
      setSelectedTemplate('template-1');
    }
    toast.success('Malen ble slettet');
  };

  const selectedTemplateName = allTemplates.find(t => t.id === selectedTemplate)?.name;

  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Tilbake til dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold">Maler for møtereferat</h1>
              </div>
              <p className="text-gray-600">
                Velg en mal som passer til dine møter. Malen brukes når du eksporterer eller redigerer sammendrag.
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="button-secondary inline-flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Opprett egen mal
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="search"
                placeholder="Søk etter maler..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                  selectedCategory === 'all'
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                Alle maler
              </button>
              <button
                onClick={() => setSelectedCategory('custom')}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                  selectedCategory === 'custom'
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                Mine maler
              </button>
            </div>
          </div>
        </div>

        {/* Selected Template Info */}
        {selectedTemplate && selectedTemplateName && (
          <div className="bg-gradient-to-r from-blue-50 to-fuchsia-50 border border-blue-100 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-3">
              <Check className="h-5 w-5 text-blue-600" />
              <span className="text-blue-900">
                <strong>{selectedTemplateName}</strong> er din aktive mal
              </span>
            </div>
          </div>
        )}

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplate === template.id}
              onSelect={() => handleSelectTemplate(template.id)}
              onPreview={() => setPreviewTemplate(template)}
              onDelete={template.isCustom ? () => handleDeleteTemplate(template.id) : undefined}
            />
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            {selectedCategory === 'custom' ? (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ingen egne maler ennå</h3>
                <p className="text-gray-600 mb-4">Opprett din første egendefinerte mal</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="button-primary inline-flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Opprett egen mal
                </button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ingen maler funnet</h3>
                <p className="text-gray-600">Prøv et annet søkeord</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onSelect={() => {
            handleSelectTemplate(previewTemplate.id);
            setPreviewTemplate(null);
          }}
          isSelected={selectedTemplate === previewTemplate.id}
        />
      )}

      {/* Create Template Modal */}
      {showCreateModal && (
        <CreateTemplateModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateTemplate}
        />
      )}
    </main>
  );
}
