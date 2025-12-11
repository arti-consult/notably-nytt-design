import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  Mic,
  ChevronRight,
  BarChart,
  Clock3,
  Search,
  Folder,
  Tag as TagIcon,
  X,
  FolderPlus,
  Edit2,
  MoreVertical,
  Pencil,
  Trash2,
  CheckSquare,
  Square,
  Video
} from 'lucide-react';
import RecordingModal from '@/components/RecordingModal';
import FileUploadModal from '@/components/FileUploadModal';
import FolderRenameModal from '@/components/FolderRenameModal';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import TagEditor from '@/components/TagEditor';
import Pagination from '@/components/Pagination';
import { cn } from '@/lib/utils';
import { useFolders } from '@/contexts/FolderContext';
import { toast } from '@/components/ui/toast';
import { mockRecordings, mockTags } from '@/lib/mockData';

const ITEMS_PER_PAGE = 10;

interface Recording {
  id: string;
  title: string;
  created_at: string;
  duration: number;
  status: 'processing' | 'completed' | 'error';
  folder_id?: string;
  tags?: Array<{
    id: string;
    name: string;
  }>;
}

interface Tag {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export default function DashboardPage() {
  const { folders, addFolder, removeFolder, updateFolder } = useFolders();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [activeFolderMenu, setActiveFolderMenu] = useState<string | null>(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedFolderForAction, setSelectedFolderForAction] = useState<{ id: string; name: string } | null>(null);
  const [showTagEditor, setShowTagEditor] = useState(false);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecordings, setSelectedRecordings] = useState<Set<string>>(new Set());
  const [dateRange, setDateRange] = useState<'total' | 'day' | 'week' | 'month'>('total');
  const [isBulkEditMode, setIsBulkEditMode] = useState(false);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

  // Last inn mock-data ved oppstart
  useEffect(() => {
    setTimeout(() => {
      setRecordings(mockRecordings);
      setAvailableTags(mockTags);
      setIsLoading(false);
    }, 300);
  }, []);

  const handleRecordingComplete = () => {
    // Mock: Legg til nytt opptak i listen
    const newRecording: Recording = {
      id: `rec-${Date.now()}`,
      title: 'Nytt opptak',
      created_at: new Date().toISOString(),
      duration: 0,
      status: 'processing',
      tags: []
    };
    setRecordings(prev => [newRecording, ...prev]);
    toast.success('Opptak startet');
  };

  const getFilteredRecordingsByDate = (recordings: Recording[]) => {
    if (dateRange === 'total') return recordings;

    const now = new Date();
    const startDate = new Date();

    switch (dateRange) {
      case 'day':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - now.getDay());
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'month':
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        break;
    }

    return recordings.filter(recording => {
      const recordingDate = new Date(recording.created_at);
      return recordingDate >= startDate && recordingDate <= now;
    });
  };

  const toggleTag = (tag: Tag) => {
    setActiveTags(prev => {
      const newTags = new Set(prev);
      if (newTags.has(tag.id)) {
        newTags.delete(tag.id);
      } else {
        newTags.add(tag.id);
      }
      return newTags;
    });
  };

  const handleAddFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      await addFolder(newFolderName.trim());
      setNewFolderName('');
      setShowNewFolderInput(false);
    } catch (error) {
      console.error('Error adding folder:', error);
    }
  };

  const handleFolderAction = (id: string, name: string, action: 'rename' | 'delete') => {
    setSelectedFolderForAction({ id, name });
    if (action === 'rename') {
      setShowRenameModal(true);
    } else {
      setShowDeleteDialog(true);
    }
    setActiveFolderMenu(null);
  };

  const handleRenameFolder = async (newName: string) => {
    if (!selectedFolderForAction) return;

    try {
      await updateFolder(selectedFolderForAction.id, newName);
      setShowRenameModal(false);
      setSelectedFolderForAction(null);
    } catch (error) {
      console.error('Error renaming folder:', error);
      throw error;
    }
  };

  const handleDeleteFolder = async () => {
    if (!selectedFolderForAction) return;

    try {
      await removeFolder(selectedFolderForAction.id);
      if (activeFolder === selectedFolderForAction.id) {
        setActiveFolder(null);
      }
      setShowDeleteDialog(false);
      setSelectedFolderForAction(null);
    } catch (error) {
      console.error('Error deleting folder:', error);
      throw error;
    }
  };

  const formatDuration = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds < 0) return '0s';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const parts = [];

    if (hours > 0) {
      parts.push(`${hours}t`);
    }
    if (minutes > 0 || hours > 0) {
      parts.push(`${minutes}m`);
    }
    if (remainingSeconds > 0 || parts.length === 0) {
      parts.push(`${remainingSeconds}s`);
    }

    return parts.join(' ');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('no', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filterRecordings = (recordings: Recording[]) => {
    let filtered = recordings;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(recording => {
        if (recording.title.toLowerCase().includes(query)) return true;
        if (recording.tags?.some(tag =>
          tag.name.toLowerCase().includes(query)
        )) return true;
        const folder = folders.find(f => f.id === recording.folder_id);
        if (folder?.name.toLowerCase().includes(query)) return true;
        return false;
      });
    }

    if (activeFolder) {
      filtered = filtered.filter(recording => recording.folder_id === activeFolder);
    }

    if (activeTags.size > 0) {
      filtered = filtered.filter(recording =>
        recording.tags?.some(tag => activeTags.has(tag.id))
      );
    }

    return filtered;
  };

  const filteredRecordings = filterRecordings(recordings);
  const totalPages = Math.ceil(filteredRecordings.length / ITEMS_PER_PAGE);

  const getCurrentPageRecordings = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRecordings.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const handleStartRecording = () => {
    setShowRecordingModal(true);
  };

  // Mock bulk delete - kun lokal state
  const handleBulkDelete = async () => {
    if (selectedRecordings.size === 0) return;

    setRecordings(prev => prev.filter(r => !selectedRecordings.has(r.id)));
    toast.success(`${selectedRecordings.size} opptak ble slettet`);
    setSelectedRecordings(new Set());
    setIsBulkEditMode(false);
    setShowBulkDeleteDialog(false);
  };

  const toggleRecordingSelection = (recordingId: string) => {
    setSelectedRecordings(prev => {
      const newSet = new Set(prev);
      if (newSet.has(recordingId)) {
        newSet.delete(recordingId);
      } else {
        newSet.add(recordingId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen pt-16 bg-gray-50/50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Mine opptak</h1>
            <p className="text-gray-600">Her finner du alle dine møteopptak</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-1 inline-flex">
            <button
              onClick={() => setDateRange('total')}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                dateRange === 'total'
                  ? "bg-violet-100 text-violet-700"
                  : "text-gray-600 hover:text-violet-600"
              )}
            >
              Totalt
            </button>
            <button
              onClick={() => setDateRange('day')}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                dateRange === 'day'
                  ? "bg-violet-100 text-violet-700"
                  : "text-gray-600 hover:text-violet-600"
              )}
            >
              I dag
            </button>
            <button
              onClick={() => setDateRange('week')}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                dateRange === 'week'
                  ? "bg-violet-100 text-violet-700"
                  : "text-gray-600 hover:text-violet-600"
              )}
            >
              Denne uken
            </button>
            <button
              onClick={() => setDateRange('month')}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                dateRange === 'month'
                  ? "bg-violet-100 text-violet-700"
                  : "text-gray-600 hover:text-violet-600"
              )}
            >
              Denne måneden
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="feature-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Totalt antall opptak</p>
                <h3 className="text-2xl font-semibold">
                  {getFilteredRecordingsByDate(recordings).length}
                </h3>
              </div>
              <BarChart className="h-8 w-8 text-violet-600" />
            </div>
          </div>

          <div className="feature-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Timer totalt</p>
                <h3 className="text-2xl font-semibold">
                  {(() => {
                    const totalSeconds = getFilteredRecordingsByDate(recordings)
                      .reduce((acc, rec) => acc + (rec.duration || 0), 0);
                    const hours = Math.floor(totalSeconds / 3600);
                    const minutes = Math.floor((totalSeconds % 3600) / 60);
                    return `${hours}t ${minutes}m`;
                  })()}
                </h3>
              </div>
              <Clock3 className="h-8 w-8 text-violet-600" />
            </div>
          </div>

          <div className="feature-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-1">
                  <p className="text-sm text-gray-600 mb-1">Tid spart</p>
                  <div className="group relative">
                    <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center cursor-help">
                      <span className="text-xs text-gray-500 font-medium">i</span>
                    </div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="text-center">
                        Estimert tid spart basert på automatisk generering av møtereferat, hovedtemaer og handlingspunkter.
                      </div>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-semibold">
                  {(() => {
                    const totalSeconds = getFilteredRecordingsByDate(recordings)
                      .reduce((acc, rec) => acc + (rec.duration || 0), 0);
                    const savedSeconds = totalSeconds * 0.5;
                    const hours = Math.floor(savedSeconds / 3600);
                    const minutes = Math.floor((savedSeconds % 3600) / 60);

                    if (hours > 0) {
                      return `${hours}t ${minutes}m`;
                    } else if (minutes > 0) {
                      return `${minutes}m`;
                    } else {
                      return '0m';
                    }
                  })()}
                </h3>
              </div>
              <Clock3 className="h-8 w-8 text-violet-600" />
            </div>
          </div>

          <div className="feature-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Snitt varighet</p>
                {recordings.length > 0 ? (
                  <h3 className="text-2xl font-semibold">
                    {(() => {
                      const filteredRecordings = getFilteredRecordingsByDate(recordings);
                      const avgSeconds = filteredRecordings.reduce((acc, rec) => acc + (rec.duration || 0), 0) /
                        (filteredRecordings.length || 1);
                      const hours = Math.floor(avgSeconds / 3600);
                      const minutes = Math.floor((avgSeconds % 3600) / 60);
                      const seconds = Math.floor(avgSeconds % 60);

                      if (hours > 0) {
                        return `${hours}t ${minutes}m`;
                      } else if (minutes > 0) {
                        return `${minutes}m ${seconds}s`;
                      } else {
                        return `${seconds}s`;
                      }
                    })()}
                  </h3>
                ) : (
                  <h3 className="text-2xl font-semibold">0s</h3>
                )}
              </div>
              <Clock className="h-8 w-8 text-violet-600" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            className="feature-card flex items-center"
            onClick={handleStartRecording}
          >
            <div className="feature-icon mr-4">
              <Mic className="h-5 w-5" />
            </div>
            <div className="text-left">
              <h3 className="font-medium mb-1">Start opptak</h3>
              <p className="text-sm text-gray-600">
                Begynn å ta opp et møte nå
              </p>
            </div>
          </button>

          <button
            className="feature-card flex items-center"
            onClick={() => setShowUploadModal(true)}
          >
            <div className="feature-icon mr-4">
              <FileText className="h-5 w-5" />
            </div>
            <div className="text-left">
              <h3 className="font-medium mb-1">Last opp opptak</h3>
              <p className="text-sm text-gray-600">
                Last opp eksisterende lydopptak
              </p>
            </div>
          </button>

          <button
            className="feature-card flex items-center"
            onClick={() => toast.info('Direkteinvitasjon kommer snart!')}
          >
            <div className="feature-icon mr-4">
              <Video className="h-5 w-5" />
            </div>
            <div className="text-left">
              <h3 className="font-medium mb-1">Direkteinvitasjon</h3>
              <p className="text-sm text-gray-600">
                Send Notably til et møte umiddelbart
              </p>
            </div>
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex-1 relative">
                <input
                  type="search"
                  placeholder="Søk i opptak, transkripsjoner, etiketter..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 pl-10 focus:border-violet-500 focus:ring-violet-500"
                />
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                ) : (
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                )}
              </div>
              <button
                onClick={() => {
                  setIsBulkEditMode(!isBulkEditMode);
                  if (!isBulkEditMode) {
                    setSelectedRecordings(new Set());
                  }
                }}
                className={cn(
                  "ml-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isBulkEditMode
                    ? "bg-violet-100 text-violet-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {isBulkEditMode ? 'Avslutt redigering' : 'Rediger møter'}
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Søk i titler, etiketter og mapper
            </div>
          </div>
        </div>

        {/* Organization and Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* Folders and Tags Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Folders */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Mapper</h3>
                <button
                  onClick={() => setShowNewFolderInput(true)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600"
                >
                  <FolderPlus className="h-4 w-4" />
                </button>
              </div>

              {showNewFolderInput && (
                <div className="flex items-center space-x-2 mb-3">
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Mappenavn..."
                    className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddFolder();
                      if (e.key === 'Escape') setShowNewFolderInput(false);
                    }}
                  />
                  <button
                    onClick={handleAddFolder}
                    className="p-1.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                  >
                    <FolderPlus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setShowNewFolderInput(false)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className="space-y-1">
                <button
                  onClick={() => setActiveFolder(null)}
                  className={cn(
                    "w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors",
                    !activeFolder ? "bg-violet-50 text-violet-600" : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <Folder className="h-4 w-4 mr-2" />
                  Alle mapper
                </button>

                {folders.map(folder => (
                  <div
                    key={folder.id}
                    className="relative group"
                  >
                    <button
                      onClick={() => setActiveFolder(folder.id)}
                      className={cn(
                        "w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors",
                        activeFolder === folder.id ? "bg-violet-50 text-violet-600" : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <Folder className="h-4 w-4 mr-2" />
                      {folder.name}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveFolderMenu(activeFolderMenu === folder.id ? null : folder.id);
                      }}
                      className={cn(
                        "absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-opacity",
                        activeFolderMenu === folder.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      )}
                    >
                      <MoreVertical className="h-4 w-4 text-gray-400" />
                    </button>
                    {activeFolderMenu === folder.id && (
                      <div className="absolute right-0 top-0 mt-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                        <button
                          onClick={() => handleFolderAction(folder.id, folder.name, 'rename')}
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Endre navn
                        </button>
                        <button
                          onClick={() => handleFolderAction(folder.id, folder.name, 'delete')}
                          className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Slett mappe
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Etiketter</h3>
                <button
                  onClick={() => setShowTagEditor(true)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag)}
                    className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full text-sm transition-colors",
                      activeTags.has(tag.id)
                        ? "bg-violet-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    <TagIcon className="h-3 w-3 mr-1" />
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recordings List */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-600 mx-auto"></div>
                  <p className="text-gray-600 mt-4">Henter opptak...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-600">{error}</div>
              ) : getCurrentPageRecordings().length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  {searchQuery
                    ? 'Ingen opptak funnet for dette søket'
                    : activeFolder
                    ? 'Ingen opptak i denne mappen'
                    : activeTags.size > 0
                    ? 'Ingen opptak med valgte etiketter'
                    : 'Ingen opptak funnet'}
                </div>
              ) : (
                <>
                  {getCurrentPageRecordings().map((recording) => (
                    <div
                      key={recording.id}
                      className={cn(
                        "feature-card flex items-center justify-between group",
                        selectedRecordings.has(recording.id) && "bg-violet-50/50 border-violet-200"
                      )}
                    >
                      <div
                        className="flex-1 flex items-center space-x-4"
                      >
                        {isBulkEditMode && (
                        <button
                          onClick={() => toggleRecordingSelection(recording.id)}
                          className="p-2 hover:bg-violet-100 rounded-lg transition-colors"
                        >
                          {selectedRecordings.has(recording.id) ? (
                            <CheckSquare className="h-5 w-5 text-violet-600" />
                          ) : (
                            <Square className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                        )}
                        <div className={cn(
                          "p-3 rounded-xl",
                          recording.status === 'completed'
                            ? 'bg-green-100 text-green-600'
                            : recording.status === 'processing'
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-red-100 text-red-600'
                        )}>
                          <Mic className="h-5 w-5" />
                        </div>
                        <Link
                          to={`/meetings/${recording.id}`}
                          className="min-w-0 flex-1 flex items-center group"
                        >
                          <div className="flex-1">
                            <h3 className="font-medium mb-1">{recording.title}</h3>
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{formatDate(recording.created_at)}</span>
                              <span className="mx-2">•</span>
                              <span>{formatDuration(recording.duration)}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              {recording.folder_id && (
                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-violet-50 text-violet-600 text-xs">
                                  <Folder className="h-3 w-3 mr-1" />
                                  {folders.find(f => f.id === recording.folder_id)?.name}
                              </span>
                              )}
                              {recording.tags?.map(tag => (
                                <span
                                  key={tag.id}
                                  className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs"
                                >
                                  <TagIcon className="h-3 w-3 mr-1" />
                                  {tag.name}
                                </span>
                              ))}
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity ml-4" />
                        </Link>
                      </div>
                    </div>
                  ))}

                  {/* Bulk Delete Controls */}
                  {selectedRecordings.size > 0 && (
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg border border-gray-200 p-4 flex items-center space-x-4">
                      <span className="text-sm text-gray-600">
                        {selectedRecordings.size} opptak valgt
                      </span>
                      <button
                        onClick={() => setShowBulkDeleteDialog(true)}
                        className="button-primary bg-red-600 hover:bg-red-700 flex items-center"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Slett valgte
                      </button>
                      <button
                        onClick={() => setSelectedRecordings(new Set())}
                        className="button-secondary"
                      >
                        Avbryt
                      </button>
                    </div>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <RecordingModal
        isOpen={showRecordingModal}
        onClose={() => setShowRecordingModal(false)}
        onComplete={handleRecordingComplete}
      />

      <FileUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadComplete={handleRecordingComplete}
      />

      <FolderRenameModal
        isOpen={showRenameModal}
        onClose={() => {
          setShowRenameModal(false);
          setSelectedFolderForAction(null);
        }}
        onRename={handleRenameFolder}
        currentName={selectedFolderForAction?.name || ''}
      />

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setSelectedFolderForAction(null);
        }}
        onConfirm={handleDeleteFolder}
        title="Slett mappe"
        message={`Er du sikker på at du vil slette mappen "${selectedFolderForAction?.name}"? Alle opptak i mappen vil bli flyttet til "Alle mapper".`}
      />

      <TagEditor
        isOpen={showTagEditor}
        onClose={() => setShowTagEditor(false)}
        onSave={() => {}}
      />

      <DeleteConfirmationDialog
        isOpen={showBulkDeleteDialog}
        onClose={() => setShowBulkDeleteDialog(false)}
        onConfirm={handleBulkDelete}
        title="Slett opptak"
        message={`Er du sikker på at du vil slette ${selectedRecordings.size} opptak? Denne handlingen kan ikke angres.`}
      />
    </div>
  );
}
