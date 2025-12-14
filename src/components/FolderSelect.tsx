import { useState } from 'react';
import { Folder, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFolders } from '@/contexts/FolderContext';

interface FolderSelectProps {
  currentFolderId: string | null;
  onFolderChange: (folderId: string | null) => Promise<void>;
  disabled?: boolean;
}

export default function FolderSelect({ 
  currentFolderId, 
  onFolderChange,
  disabled = false 
}: FolderSelectProps) {
  const { folders } = useFolders();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentFolder = folders.find(f => f.id === currentFolderId);

  const handleFolderChange = async (folderId: string | null) => {
    try {
      setIsLoading(true);
      setError(null);
      await onFolderChange(folderId);
      setIsOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunne ikke endre mappe');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Mappe
      </label>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled || isLoading}
          className={cn(
            "w-full flex items-center justify-between px-4 py-2 rounded-lg border text-left transition-colors",
            currentFolder
              ? "bg-violet-50 border-violet-200"
              : "bg-white border-gray-300",
            (disabled || isLoading)
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-50"
          )}
        >
          <div className="flex items-center min-w-0">
            <Folder className={cn(
              "h-4 w-4 flex-shrink-0 mr-2",
              currentFolder ? "text-violet-600" : "text-gray-400"
            )} />
            <span className={cn(
              "truncate",
              currentFolder ? "text-gray-900" : "text-gray-600"
            )}>
              {currentFolder?.name || 'Ingen mappe valgt'}
            </span>
          </div>
          <ChevronDown className={cn(
            "h-4 w-4 text-gray-400 transition-transform",
            isOpen && "transform rotate-180"
          )} />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-lg border border-gray-200 shadow-lg max-h-48 overflow-y-auto">
            <div className="p-1">
              {/* Ingen mappe-alternativ */}
              <button
                onClick={() => handleFolderChange(null)}
                className={cn(
                  "w-full flex items-center px-3 py-2 rounded-md text-left text-sm transition-colors",
                  !currentFolderId
                    ? "bg-violet-50 text-violet-900"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                <X className="h-4 w-4 mr-2 text-gray-400" />
                Ingen mappe
              </button>

              {/* Liste over mapper */}
              {folders.map(folder => (
                <button
                  key={folder.id}
                  onClick={() => handleFolderChange(folder.id)}
                  className={cn(
                    "w-full flex items-center px-3 py-2 rounded-md text-left text-sm transition-colors",
                    currentFolderId === folder.id
                      ? "bg-violet-50 text-violet-900"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <Folder className="h-4 w-4 mr-2 text-gray-400" />
                  {folder.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}