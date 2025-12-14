import { useState, useEffect } from 'react';
import { X, Folder, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FolderRenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRename: (newName: string) => Promise<void>;
  currentName: string;
}

export default function FolderRenameModal({
  isOpen,
  onClose,
  onRename,
  currentName
}: FolderRenameModalProps) {
  const [newName, setNewName] = useState(currentName);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset newName when modal opens with a different folder
  useEffect(() => {
    if (isOpen) {
      setNewName(currentName);
      setError(null);
    }
  }, [isOpen, currentName]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newName.trim()) {
      setError('Vennligst skriv inn et mappenavn');
      return;
    }

    if (newName.trim() === currentName) {
      onClose();
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await onRename(newName.trim());
      onClose();
    } catch (err) {
      console.error('Error renaming folder:', err);
      setError(err instanceof Error ? err.message : 'Kunne ikke endre navn på mappen');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Endre mappenavn</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
              disabled={isLoading}
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="folderName" className="block text-sm font-medium text-gray-700 mb-2">
                Mappenavn
              </label>
              <div className="relative">
                <Folder className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="folderName"
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                    setError(null);
                  }}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:border-violet-500 focus:ring-violet-500"
                  disabled={isLoading}
                  autoFocus
                  onFocus={(e) => e.target.select()}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={isLoading || !newName.trim() || newName.trim() === currentName}
              className={cn(
                "px-4 py-2 rounded-lg text-white transition-colors",
                isLoading || !newName.trim() || newName.trim() === currentName
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-violet-600 hover:bg-violet-700"
              )}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Lagrer...
                </div>
              ) : (
                'Lagre'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}