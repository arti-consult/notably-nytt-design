import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Pencil, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockTags } from '@/lib/mockData';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

interface Tag {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
}

interface TagEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

export default function TagEditor({
  isOpen,
  onClose,
  onSave
}: TagEditorProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState('');
  const [editingIndex, setEditingIndex] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Load mock tags
      setTags(mockTags.map(t => ({
        id: t.id,
        name: t.name,
        user_id: 'demo-user',
        created_at: new Date().toISOString()
      })));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddTag = async () => {
    if (!newTag.trim()) return;

    setIsLoading(true);
    // Demo mode - simulate adding tag
    await new Promise(resolve => setTimeout(resolve, 300));

    const createdTag: Tag = {
      id: `tag-${Date.now()}`,
      name: newTag.trim(),
      user_id: 'demo-user',
      created_at: new Date().toISOString()
    };

    setTags(prev => [...prev, createdTag]);
    setNewTag('');
    setIsLoading(false);
  };

  const handleRemoveTag = async () => {
    if (!tagToDelete) return;

    setIsLoading(true);
    // Demo mode - simulate removing tag
    await new Promise(resolve => setTimeout(resolve, 300));

    setTags(prev => prev.filter(tag => tag.id !== tagToDelete.id));
    setTagToDelete(null);
    setIsLoading(false);
  };

  const startEditing = (tag: Tag) => {
    setEditingIndex(tag.id);
    setEditingValue(tag.name);
    setError(null);
  };

  const handleEditTag = async () => {
    if (!editingIndex) return;

    setIsLoading(true);
    // Demo mode - simulate editing tag
    await new Promise(resolve => setTimeout(resolve, 300));

    setTags(prev => prev.map(tag =>
      tag.id === editingIndex ? { ...tag, name: editingValue } : tag
    ));
    setEditingIndex(null);
    setEditingValue('');
    setIsLoading(false);
  };

  const handleClose = () => {
    if (onSave) {
      onSave();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md flex flex-col max-h-[90vh] border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Rediger etiketter</h3>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full"
              disabled={isLoading}
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <p className="text-xs text-amber-600 mb-4">
            Demo-modus: Endringer lagres kun lokalt
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Existing tags */}
            <div className="space-y-2">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center justify-between p-2 rounded-lg border border-gray-200 bg-gray-50"
                >
                  {editingIndex === tag.id ? (
                    <input
                      type="text"
                      value={editingValue}
                      onChange={(e) => {
                        setEditingValue(e.target.value);
                        setError(null);
                      }}
                      className="flex-1 px-3 py-1 rounded-md border border-violet-300 bg-white text-gray-900 focus:border-violet-500 focus:ring-violet-500 mr-2"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleEditTag();
                        } else if (e.key === 'Escape') {
                          setEditingIndex(null);
                          setEditingValue('');
                          setError(null);
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    <span className="text-gray-700">{tag.name}</span>
                  )}
                  <div className="flex items-center space-x-1">
                    {editingIndex === tag.id ? (
                      <button
                        onClick={handleEditTag}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                        disabled={isLoading}
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => startEditing(tag)}
                        className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg"
                        disabled={isLoading}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => setTagToDelete(tag)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add new tag */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => {
                  setNewTag(e.target.value);
                  setError(null);
                }}
                placeholder="Skriv inn ny etikett..."
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:ring-violet-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                disabled={isLoading}
              />
              <button
                onClick={handleAddTag}
                className="p-2 text-violet-600 hover:bg-violet-50 rounded-lg"
                disabled={isLoading || !newTag.trim()}
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              onClick={handleClose}
              className={cn(
                "px-4 py-2 rounded-lg text-white transition-colors",
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-violet-600 hover:bg-violet-700"
              )}
            >
              Lukk
            </button>
          </div>
        </div>
      </div>

      <DeleteConfirmationDialog
        isOpen={!!tagToDelete}
        onClose={() => setTagToDelete(null)}
        onConfirm={handleRemoveTag}
        title="Slett etikett"
        message={`Er du sikker på at du vil slette etiketten "${tagToDelete?.name}"? Denne handlingen kan ikke angres.`}
      />
    </div>
  );
}
