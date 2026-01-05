import { useState } from 'react';
import { X, Tag as TagIcon, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Tag {
  id: string;
  name: string;
}

interface BulkTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableTags: Tag[];
  onApplyTags: (tagIds: string[]) => void;
  selectedCount: number;
}

export default function BulkTagModal({
  isOpen,
  onClose,
  availableTags,
  onApplyTags,
  selectedCount
}: BulkTagModalProps) {
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const toggleTag = (tagId: string) => {
    const newSet = new Set(selectedTags);
    if (newSet.has(tagId)) {
      newSet.delete(tagId);
    } else {
      newSet.add(tagId);
    }
    setSelectedTags(newSet);
  };

  const handleApply = () => {
    onApplyTags(Array.from(selectedTags));
    setSelectedTags(new Set());
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md border border-gray-200">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">
              Legg til etiketter
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {selectedCount} opptak valgt
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-2">
            {availableTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all",
                  selectedTags.has(tag.id)
                    ? "border-[#2C64E3] bg-[#F0F5FF]"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div className="flex items-center gap-2">
                  <TagIcon className={cn(
                    "h-4 w-4",
                    selectedTags.has(tag.id) ? "text-[#2C64E3]" : "text-gray-400"
                  )} />
                  <span className={cn(
                    "font-medium",
                    selectedTags.has(tag.id) ? "text-[#2C64E3]" : "text-gray-700"
                  )}>
                    {tag.name}
                  </span>
                </div>
                {selectedTags.has(tag.id) && (
                  <div className="w-5 h-5 rounded-full bg-[#2C64E3] flex items-center justify-center">
                    <Plus className="h-3 w-3 text-white rotate-45" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Avbryt
            </button>
            <button
              onClick={handleApply}
              disabled={selectedTags.size === 0}
              className={cn(
                "px-4 py-2 rounded-lg text-white transition-colors",
                selectedTags.size === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#2C64E3] hover:bg-[#1F49C6]"
              )}
            >
              Legg til {selectedTags.size > 0 && `(${selectedTags.size})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
