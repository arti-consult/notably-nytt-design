import { useState, useRef, useEffect } from 'react';
import { Filter, X, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface FilterOptions {
  status: 'all' | 'completed' | 'processing' | 'error';
  durationMin: number;
  durationMax: number;
  dateFrom: string;
  dateTo: string;
}

interface AdvancedFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onReset: () => void;
}

export default function AdvancedFilters({
  filters,
  onFiltersChange,
  onReset
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'status') return value !== 'all';
    if (key === 'durationMin') return value > 0;
    if (key === 'durationMax') return value < 10000;
    if (key === 'dateFrom' || key === 'dateTo') return value !== '';
    return false;
  }).length;

  // Close status dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    };

    if (isStatusDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isStatusDropdownOpen]);

  const statusOptions = [
    { value: 'all', label: 'Alle' },
    { value: 'completed', label: 'Fullført' },
    { value: 'processing', label: 'Prosesserer' },
    { value: 'error', label: 'Feil' }
  ] as const;

  const getStatusLabel = (value: string) => {
    return statusOptions.find(opt => opt.value === value)?.label || 'Alle';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors",
          isOpen || activeFilterCount > 0
            ? "bg-[#2C64E3] text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        )}
      >
        <Filter className="h-4 w-4" />
        Avanserte filtre
        {activeFilterCount > 0 && (
          <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs">
            {activeFilterCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-20"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Avanserte filtre</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Status filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <div className="relative" ref={statusDropdownRef}>
                  <button
                    onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-left flex items-center justify-between hover:border-gray-400 transition-colors focus:ring-2 focus:ring-[#2C64E3] focus:border-[#2C64E3]"
                  >
                    <span className="text-gray-900">{getStatusLabel(filters.status)}</span>
                    <ChevronDown className={cn(
                      "h-4 w-4 text-gray-500 transition-transform",
                      isStatusDropdownOpen && "rotate-180"
                    )} />
                  </button>

                  <AnimatePresence>
                    {isStatusDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-30"
                      >
                        {statusOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              onFiltersChange({
                                ...filters,
                                status: option.value
                              });
                              setIsStatusDropdownOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 transition-colors text-left"
                          >
                            <span className="text-sm text-gray-700">{option.label}</span>
                            {filters.status === option.value && (
                              <Check className="h-4 w-4 text-[#2C64E3]" />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Duration filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Varighet (sekunder)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.durationMin || ''}
                    onChange={(e) =>
                      onFiltersChange({
                        ...filters,
                        durationMin: Number(e.target.value) || 0
                      })
                    }
                    className="w-20 px-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2C64E3] focus:border-[#2C64E3]"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.durationMax === 10000 ? '' : filters.durationMax}
                    onChange={(e) =>
                      onFiltersChange({
                        ...filters,
                        durationMax: Number(e.target.value) || 10000
                      })
                    }
                    className="w-20 px-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2C64E3] focus:border-[#2C64E3]"
                  />
                </div>
              </div>

              {/* Date range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fra dato
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) =>
                      onFiltersChange({ ...filters, dateFrom: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2C64E3] focus:border-[#2C64E3]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Til dato
                  </label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) =>
                      onFiltersChange({ ...filters, dateTo: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2C64E3] focus:border-[#2C64E3]"
                  />
                </div>
              </div>
            </div>

            {/* Reset button */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  onReset();
                  setIsOpen(false);
                }}
                className="w-full text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                Nullstill alle filtre
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
