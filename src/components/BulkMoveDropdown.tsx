import { useState, useRef, useEffect } from 'react';
import { Folder, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface BulkMoveDropdownProps {
  folders: Array<{ id: string; name: string }>;
  onMove: (folderId: string | null) => void;
  selectedCount: number;
}

export default function BulkMoveDropdown({
  folders,
  onMove,
  selectedCount
}: BulkMoveDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectFolder = (folderId: string | null) => {
    onMove(folderId);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 transition-colors"
      >
        <Folder className="h-4 w-4" />
        Flytt til...
        <ChevronDown className={cn(
          "h-4 w-4 transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
          >
            {/* Header */}
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-xs font-medium text-gray-500">
                Flytt {selectedCount} opptak til:
              </p>
            </div>

            {/* Options */}
            <div className="max-h-64 overflow-y-auto">
              {/* Alle mapper option */}
              <button
                onClick={() => handleSelectFolder(null)}
                className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-[#F0F5FF] transition-colors">
                    <Folder className="h-4 w-4 text-gray-600 group-hover:text-[#2C64E3]" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Alle mapper
                  </span>
                </div>
              </button>

              {/* Separator */}
              {folders.length > 0 && (
                <div className="my-1 mx-4 border-t border-gray-100" />
              )}

              {/* Folder options */}
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => handleSelectFolder(folder.id)}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F0F5FF] flex items-center justify-center group-hover:bg-[#E4ECFF] transition-colors">
                      <Folder className="h-4 w-4 text-[#2C64E3]" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {folder.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
