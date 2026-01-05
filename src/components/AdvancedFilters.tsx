import { useState } from 'react';
import { Filter, X } from 'lucide-react';
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

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'dateFrom' || key === 'dateTo') return value !== '';
    return false;
  }).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 transition-colors",
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

            {/* Reset button */}
            {activeFilterCount > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    onReset();
                    setIsOpen(false);
                  }}
                  className="w-full text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Nullstill filtre
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
