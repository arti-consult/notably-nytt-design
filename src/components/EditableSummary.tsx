import { useState } from 'react';
import { Pencil, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditableSummaryProps {
  summaryText: string;
  topics: string[];
  actionItems: string[];
  onSave: (data: {
    summaryText: string;
    topics: string[];
    actionItems: string[];
  }) => Promise<void>;
}

export default function EditableSummary({
  summaryText,
  topics,
  actionItems,
  onSave
}: EditableSummaryProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSummary, setEditedSummary] = useState(summaryText);
  const [editedTopics, setEditedTopics] = useState(topics);
  const [editedActionItems, setEditedActionItems] = useState(actionItems);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await onSave({
        summaryText: editedSummary.trim(),
        topics: editedTopics.filter(t => t.trim()),
        actionItems: editedActionItems.filter(a => a.trim())
      });

      setIsEditing(false);
    } catch (err) {
      console.error('Error saving summary:', err);
      setError(err instanceof Error ? err.message : 'Kunne ikke lagre endringer');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedSummary(summaryText);
    setEditedTopics(topics);
    setEditedActionItems(actionItems);
    setError(null);
    setIsEditing(false);
  };

  const addListItem = (list: string[], setList: (items: string[]) => void) => {
    setList([...list, '']);
  };

  const updateListItem = (
    index: number,
    value: string,
    list: string[],
    setList: (items: string[]) => void
  ) => {
    const newList = [...list];
    newList[index] = value;
    setList(newList);
  };

  const removeListItem = (
    index: number,
    list: string[],
    setList: (items: string[]) => void
  ) => {
    setList(list.filter((_, i) => i !== index));
  };

  if (!isEditing) {
    return (
      <div className="space-y-6">
        {/* Header with Edit button */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Sammendrag</h3>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{summaryText}</p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors ml-4 flex-shrink-0"
            title="Rediger"
          >
            <Pencil className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Topics as Tags */}
        {topics.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Nøkkeltemaer</h3>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-violet-100 text-violet-700 border border-violet-200"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Items with Checkmarks */}
        {actionItems.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Aksjonspunkter</h3>
            <div className="space-y-2">
              {actionItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100"
                >
                  <CheckCircle2 className="h-5 w-5 text-violet-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Edit Summary */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sammendrag
        </label>
        <textarea
          value={editedSummary}
          onChange={(e) => setEditedSummary(e.target.value)}
          rows={6}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none resize-none"
        />
      </div>

      {/* Edit Topics */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nøkkeltemaer
        </label>
        <div className="space-y-2">
          {editedTopics.map((topic, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={topic}
                onChange={(e) => updateListItem(index, e.target.value, editedTopics, setEditedTopics)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                placeholder="Skriv inn tema..."
              />
              <button
                onClick={() => removeListItem(index, editedTopics, setEditedTopics)}
                className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => addListItem(editedTopics, setEditedTopics)}
            className="w-full py-2 px-4 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-violet-500 hover:text-violet-600 transition-colors flex items-center justify-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Legg til tema
          </button>
        </div>
      </div>

      {/* Edit Action Items */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Aksjonspunkter
        </label>
        <div className="space-y-2">
          {editedActionItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={item}
                onChange={(e) => updateListItem(index, e.target.value, editedActionItems, setEditedActionItems)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                placeholder="Skriv inn aksjonspunkt..."
              />
              <button
                onClick={() => removeListItem(index, editedActionItems, setEditedActionItems)}
                className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => addListItem(editedActionItems, setEditedActionItems)}
            className="w-full py-2 px-4 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-violet-500 hover:text-violet-600 transition-colors flex items-center justify-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Legg til aksjonspunkt
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-2">
        <button
          onClick={handleCancel}
          disabled={isLoading}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Avbryt
        </button>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className={cn(
            "px-4 py-2 rounded-lg text-white transition-colors",
            isLoading
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
    </div>
  );
}
