import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Clock,
  Mic,
  ChevronRight,
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
  Video,
  Calendar as CalendarIcon,
  Settings,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';
import RecordingModal from '@/components/RecordingModal';
import FileUploadModal from '@/components/FileUploadModal';
import DirectInviteModal from '@/components/DirectInviteModal';
import CalendarMeetingsModal from '@/components/CalendarMeetingsModal';
import FolderRenameModal from '@/components/FolderRenameModal';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import TagEditor from '@/components/TagEditor';
import BulkTagModal from '@/components/BulkTagModal';
import BulkMoveDropdown from '@/components/BulkMoveDropdown';
import AdvancedFilters, { FilterOptions } from '@/components/AdvancedFilters';
import Pagination from '@/components/Pagination';
import { SkeletonCardList } from '@/components/SkeletonCard';
import { cn } from '@/lib/utils';
import { useFolders } from '@/contexts/FolderContext';
import { toast } from '@/components/ui/toast';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { mockRecordings, mockTags } from '@/lib/mockData';
import { mockCalendarMeetings } from '@/lib/mockCalendarMeetings';

const ITEMS_PER_PAGE = 10;

// Tidsbasert hilsen
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'God morgen';
  if (hour >= 12 && hour < 17) return 'God ettermiddag';
  if (hour >= 17 && hour < 22) return 'God kveld';
  return 'God natt';
};

const userName = 'Sander';

// Gamification stats
const userStats = {
  totalRecordings: 45,
  totalMinutesTranscribed: 1890, // 31t 30min
  estimatedTimeSaved: 945, // 15t 45min
  recordingsThisMonth: 12,
  currentStreak: 5, // dager på rad
};

// Formater minutter til timer og minutter
const formatMinutesToHours = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours}t`;
  return `${hours}t ${mins}min`;
};

// Finn neste kommende møte
const getNextMeeting = () => {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  // Finn møter i dag som ikke er fullført
  const upcomingToday = mockCalendarMeetings
    .filter(m => m.date === todayStr && m.status === 'upcoming')
    .sort((a, b) => a.time.localeCompare(b.time));

  if (upcomingToday.length > 0) {
    return upcomingToday[0];
  }

  // Ellers finn neste møte i fremtiden
  const futureMeetings = mockCalendarMeetings
    .filter(m => m.date > todayStr && m.status === 'upcoming')
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  return futureMeetings.length > 0 ? futureMeetings[0] : null;
};

// Formater tid til neste møte
const formatTimeUntilMeeting = (meeting: { date: string; time: string }) => {
  const now = new Date();
  // Time format is "14:00 - 15:30", extract start time
  const startTime = meeting.time.split(' - ')[0];
  const [hours, minutes] = startTime.split(':').map(Number);
  const meetingDate = new Date(meeting.date);
  meetingDate.setHours(hours, minutes, 0, 0);

  const diffMs = meetingDate.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 0) return 'Startet';
  if (diffMins === 0) return 'Starter nå';
  if (diffMins < 60) return `om ${diffMins} min`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    const remainingMins = diffMins % 60;
    if (remainingMins === 0) return `om ${diffHours}t`;
    return `om ${diffHours}t ${remainingMins}min`;
  }

  // Mer enn 24 timer - vis dag
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const meetingDay = new Date(meeting.date);
  meetingDay.setHours(0, 0, 0, 0);

  if (meetingDay.getTime() === tomorrow.getTime()) {
    return `i morgen kl. ${startTime}`;
  }

  return meetingDate.toLocaleDateString('nb-NO', { weekday: 'short', day: 'numeric' });
};

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
  const { addAction, undo, redo, canUndo, canRedo } = useUndoRedo();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDirectInviteModal, setShowDirectInviteModal] = useState(false);
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
  const [showBulkTagModal, setShowBulkTagModal] = useState(false);
  const [draggedRecording, setDraggedRecording] = useState<string | null>(null);
  const [dropTargetFolder, setDropTargetFolder] = useState<string | null>(null);
  const [advancedFilters, setAdvancedFilters] = useState<FilterOptions>({
    status: 'all',
    durationMin: 0,
    durationMax: 10000,
    dateFrom: '',
    dateTo: ''
  });
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);
  const [isCalendarBannerDismissed, setIsCalendarBannerDismissed] = useState(false);
  const [showCalendarMeetingsModal, setShowCalendarMeetingsModal] = useState(false);

  // Mock upcoming meetings (vises når kalender er tilkoblet)
  const mockUpcomingMeetings = [
    {
      id: 'meeting-1',
      title: 'Ukentlig team-møte',
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 timer fra nå
      platform: 'Teams',
      joinUrl: '#'
    },
    {
      id: 'meeting-2',
      title: 'Klientpresentasjon',
      startTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 timer fra nå
      platform: 'Teams',
      joinUrl: '#'
    },
    {
      id: 'meeting-3',
      title: 'Sprint planning',
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // I morgen
      platform: 'Google Meet',
      joinUrl: '#'
    }
  ];

  const formatMeetingTime = (date: Date) => {
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow = date.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();

    const timeStr = date.toLocaleTimeString('no', { hour: '2-digit', minute: '2-digit' });

    if (isToday) return `I dag ${timeStr}`;
    if (isTomorrow) return `I morgen ${timeStr}`;
    return date.toLocaleDateString('no', { weekday: 'short', day: 'numeric', month: 'short' }) + ` ${timeStr}`;
  };

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
    toast.success('Opptak startet! Transkribering pågår...', {
      duration: 4000
    });
  };

  const handleFileUploadComplete = () => {
    // Mock: Legg til opplastet fil i listen
    const newRecording: Recording = {
      id: `rec-${Date.now()}`,
      title: 'Opplastet fil',
      created_at: new Date().toISOString(),
      duration: 0,
      status: 'processing',
      tags: []
    };
    setRecordings(prev => [newRecording, ...prev]);
    toast.success('Fil lastet opp! Transkribering startet automatisk', {
      duration: 4000
    });
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
      const folderName = newFolderName.trim();
      setNewFolderName('');
      setShowNewFolderInput(false);
      toast.success(`Mappe "${folderName}" opprettet`, {
        duration: 3000
      });
    } catch (error) {
      console.error('Error adding folder:', error);
      toast.error('Kunne ikke opprette mappe. Prøv igjen.', {
        duration: 4000
      });
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

    const oldName = selectedFolderForAction.name;
    try {
      await updateFolder(selectedFolderForAction.id, newName);
      setShowRenameModal(false);
      setSelectedFolderForAction(null);
      toast.success(`Mappe "${oldName}" omdøpt til "${newName}"`, {
        duration: 3000
      });
    } catch (error) {
      console.error('Error renaming folder:', error);
      toast.error('Kunne ikke endre mappenavn. Prøv igjen.', {
        duration: 4000
      });
      throw error;
    }
  };

  const handleDeleteFolder = async () => {
    if (!selectedFolderForAction) return;

    const folderName = selectedFolderForAction.name;
    const folderId = selectedFolderForAction.id;

    try {
      await removeFolder(folderId);
      if (activeFolder === folderId) {
        setActiveFolder(null);
      }
      setShowDeleteDialog(false);
      setSelectedFolderForAction(null);
      toast.success(`Mappe "${folderName}" slettet`, {
        duration: 3000
      });
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast.error('Kunne ikke slette mappe. Prøv igjen.', {
        duration: 4000
      });
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

    // Apply date filter
    filtered = getFilteredRecordingsByDate(filtered);

    // Apply advanced filters
    if (advancedFilters.status !== 'all') {
      filtered = filtered.filter(r => r.status === advancedFilters.status);
    }

    if (advancedFilters.durationMin > 0) {
      filtered = filtered.filter(r => r.duration >= advancedFilters.durationMin);
    }

    if (advancedFilters.durationMax < 10000) {
      filtered = filtered.filter(r => r.duration <= advancedFilters.durationMax);
    }

    if (advancedFilters.dateFrom) {
      const fromDate = new Date(advancedFilters.dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter(r => new Date(r.created_at) >= fromDate);
    }

    if (advancedFilters.dateTo) {
      const toDate = new Date(advancedFilters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(r => new Date(r.created_at) <= toDate);
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

  // Mock bulk delete - kun lokal state med undo
  const handleBulkDelete = async () => {
    if (selectedRecordings.size === 0) return;

    const deletedRecordings = recordings.filter(r => selectedRecordings.has(r.id));
    const count = selectedRecordings.size;

    // Optimistic delete
    setRecordings(prev => prev.filter(r => !selectedRecordings.has(r.id)));
    setSelectedRecordings(new Set());
    setIsBulkEditMode(false);
    setShowBulkDeleteDialog(false);

    // Add undo action
    addAction({
      type: 'delete',
      description: `Slettet ${count} opptak`,
      undo: () => {
        setRecordings(prev => [...deletedRecordings, ...prev].sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ));
      },
      redo: () => {
        setRecordings(prev => prev.filter(r => !deletedRecordings.some(d => d.id === r.id)));
      }
    });

    toast.success(`${count} opptak ble slettet`, {
      action: {
        label: 'Angre',
        onClick: () => {
          if (undo()) {
            toast.info('Opptak gjenopprettet');
          }
        }
      },
      duration: 8000
    } as any);
  };

  // Mock bulk move - kun lokal state
  const handleBulkMove = async (targetFolderId: string | null) => {
    if (selectedRecordings.size === 0) return;

    const count = selectedRecordings.size;
    const folderName = targetFolderId
      ? folders.find(f => f.id === targetFolderId)?.name
      : 'Alle mapper';

    setRecordings(prev => prev.map(r =>
      selectedRecordings.has(r.id)
        ? { ...r, folder_id: targetFolderId || undefined }
        : r
    ));

    toast.success(`${count} opptak flyttet til ${folderName}`, {
      duration: 3000
    });
    setSelectedRecordings(new Set());
    setIsBulkEditMode(false);
  };

  // Mock bulk tag - kun lokal state
  const handleBulkTag = async (tagIds: string[]) => {
    if (selectedRecordings.size === 0 || tagIds.length === 0) return;

    const count = selectedRecordings.size;
    const tagNames = tagIds
      .map(id => availableTags.find(t => t.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    setRecordings(prev => prev.map(r => {
      if (!selectedRecordings.has(r.id)) return r;

      const existingTagIds = r.tags?.map(t => t.id) || [];
      const newTags = [...(r.tags || [])];

      tagIds.forEach(tagId => {
        if (!existingTagIds.includes(tagId)) {
          const tag = availableTags.find(t => t.id === tagId);
          if (tag) {
            newTags.push({ id: tag.id, name: tag.name });
          }
        }
      });

      return { ...r, tags: newTags };
    }));

    toast.success(`${tagNames} lagt til ${count} opptak`, {
      duration: 4000
    });
    setSelectedRecordings(new Set());
    setIsBulkEditMode(false);
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

  // Drag & drop handlers for moving recordings to folders
  const handleDragStart = (recordingId: string) => {
    setDraggedRecording(recordingId);
  };

  const handleDragEnd = () => {
    setDraggedRecording(null);
    setDropTargetFolder(null);
  };

  const handleDropOnFolder = async (folderId: string | null) => {
    if (!draggedRecording) return;

    const recording = recordings.find(r => r.id === draggedRecording);
    if (!recording) return;

    const folderName = folderId
      ? folders.find(f => f.id === folderId)?.name
      : 'Alle mapper';

    // Optimistic update
    setRecordings(prev => prev.map(r =>
      r.id === draggedRecording ? { ...r, folder_id: folderId || undefined } : r
    ));

    toast.success(`"${recording.title}" flyttet til ${folderName}`, {
      duration: 3000
    });

    handleDragEnd();
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'cmd+z': () => {
      if (canUndo && undo()) {
        toast.info('Handling angret', { duration: 2000 });
      }
    },
    'ctrl+z': () => {
      if (canUndo && undo()) {
        toast.info('Handling angret', { duration: 2000 });
      }
    },
    'cmd+shift+z': () => {
      if (canRedo && redo()) {
        toast.info('Handling gjentatt', { duration: 2000 });
      }
    },
    'ctrl+y': () => {
      if (canRedo && redo()) {
        toast.info('Handling gjentatt', { duration: 2000 });
      }
    }
  });

  return (
    <div className="min-h-screen pt-16 bg-gray-50/50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Personlig velkomst med glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 relative"
        >
          {/* Glassmorphism card */}
          <div className="relative backdrop-blur-xl bg-white/70 rounded-2xl border border-white/50 shadow-lg shadow-[#2C64E3]/5 p-6">

            <div className="relative flex items-center justify-between">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex items-center gap-2 mb-1"
                >
                  <Sparkles className="h-5 w-5 text-[#2C64E3]" />
                  <span className="text-sm font-medium text-[#2C64E3]">Velkommen tilbake</span>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-2xl md:text-3xl font-bold text-gray-900"
                >
                  {getGreeting()}, {userName}!
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex flex-wrap items-center gap-3 mt-2"
                >
                  {/* Tid spart - hovedstat */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100/80 text-emerald-700">
                    <Zap className="h-3.5 w-3.5" />
                    <span className="text-sm font-medium">{formatMinutesToHours(userStats.estimatedTimeSaved)} spart</span>
                  </div>
                </motion.div>
              </div>

              <div className="hidden md:block w-16" aria-hidden="true"></div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            className="feature-card dashboard-card flex items-center"
            onClick={handleStartRecording}
          >
            <div className="feature-icon dashboard-feature-icon mr-4">
              <Mic className="h-5 w-5" />
            </div>
            <div className="text-left">
              <h3 className="font-medium mb-1 text-gray-900">Start opptak</h3>
              <p className="text-sm text-gray-600">
                Begynn å ta opp et møte nå
              </p>
            </div>
          </button>

          <button
            className="feature-card dashboard-card flex items-center"
            onClick={() => setShowUploadModal(true)}
          >
            <div className="feature-icon dashboard-feature-icon mr-4">
              <FileText className="h-5 w-5" />
            </div>
            <div className="text-left">
              <h3 className="font-medium mb-1 text-gray-900">Last opp opptak</h3>
              <p className="text-sm text-gray-600">
                Last opp eksisterende lydopptak
              </p>
            </div>
          </button>

          <button
            className="feature-card dashboard-card flex items-center"
            onClick={() => setShowDirectInviteModal(true)}
          >
            <div className="feature-icon dashboard-feature-icon mr-4">
              <Video className="h-5 w-5" />
            </div>
            <div className="text-left">
              <h3 className="font-medium mb-1 text-gray-900">Direkteinvitasjon</h3>
              <p className="text-sm text-gray-600">
                Send Notably til et møte umiddelbart
              </p>
            </div>
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="relative">
            <div className="flex items-center">
              <div className="flex-1 relative">
                <input
                  type="search"
                  placeholder="Søk i opptak, transkripsjoner, etiketter..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 pl-10 focus:border-[#2C64E3] focus:ring-[#2C64E3]"
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
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 mr-1">Periode:</span>
                  {[
                    { value: 'total', label: 'Totalt' },
                    { value: 'day', label: 'I dag' },
                    { value: 'week', label: 'Denne uken' },
                    { value: 'month', label: 'Denne måneden' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setDateRange(option.value as 'total' | 'day' | 'week' | 'month')}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                        dateRange === option.value
                          ? "bg-[#2C64E3] text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                <AdvancedFilters
                  filters={advancedFilters}
                  onFiltersChange={setAdvancedFilters}
                  onReset={() => setAdvancedFilters({
                    status: 'all',
                    durationMin: 0,
                    durationMax: 10000,
                    dateFrom: '',
                    dateTo: ''
                  })}
                />
              </div>

              <button
                onClick={() => {
                  setIsBulkEditMode(!isBulkEditMode);
                  if (!isBulkEditMode) {
                    setSelectedRecordings(new Set());
                  }
                }}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isBulkEditMode
                    ? "text-[#2C64E3]"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                {isBulkEditMode ? 'Avslutt redigering' : 'Rediger møter'}
              </button>
            </div>
          </div>
        </div>

        {/* Organization and Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* Folders and Tags Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Meny - Quick Access */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-gradient-to-r from-[#E4ECFF] to-[#F0F5FF] border-b border-[#CFE0FF]">
                <div className="flex items-center space-x-2">
                  <div className="p-1 bg-gradient-to-br from-[#2C64E3] to-[#5A8DF8] rounded-md">
                    <Zap className="h-3.5 w-3.5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Meny</h3>
                </div>
              </div>

              <div className="p-3 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={cn(
                      "p-1.5 rounded-lg",
                      isCalendarConnected
                        ? "bg-green-100"
                        : "bg-white shadow-sm"
                    )}>
                      <CalendarIcon className={cn(
                        "h-4 w-4",
                        isCalendarConnected ? "text-green-600" : "text-[#2C64E3]"
                      )} />
                    </div>
                    <span className="font-medium text-sm text-gray-900">Kalender</span>
                  </div>
                  {isCalendarConnected && (
                    <span className="flex items-center text-xs text-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Tilkoblet
                    </span>
                  )}
                </div>

                {isCalendarConnected ? (
                  // Connected state - show next meeting preview
                  <>
                    {(() => {
                      const nextMeeting = getNextMeeting();
                      if (nextMeeting) {
                        const timeUntil = formatTimeUntilMeeting(nextMeeting);
                        const isUrgent = timeUntil.includes('min') || timeUntil === 'Starter nå';
                        return (
                          <p className="text-xs text-gray-600 mb-2 truncate">
                            <span className="truncate">{nextMeeting.title}</span>
                            <span className="mx-1">•</span>
                            <span className={cn(isUrgent ? "text-[#2C64E3] font-medium" : "text-[#2C64E3]")}>
                              {timeUntil}
                            </span>
                          </p>
                        );
                      }
                      return (
                        <p className="text-xs text-gray-500 mb-2">
                          Ingen kommende møter
                        </p>
                      );
                    })()}
                    <button
                      onClick={() => setShowCalendarMeetingsModal(true)}
                      className="w-full text-xs font-medium text-[#2C64E3] hover:text-[#1F49C6] flex items-center justify-center py-1.5 rounded-lg bg-[#F0F5FF] hover:bg-[#E0EBFF] transition-colors"
                    >
                      Se alle møter
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </button>
                  </>
                ) : (
                  // Not connected - show connection buttons
                  <>
                    <p className="text-xs text-gray-500 mb-2">
                      Koble til for automatisk transkripsjon
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setIsCalendarConnected(true);
                          toast.success('Microsoft 365 kalender tilkoblet!');
                        }}
                        className="flex-1 inline-flex items-center justify-center px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-[#93C1FF] transition-colors"
                      >
                        <svg className="h-3 w-3 mr-1" viewBox="0 0 23 23">
                          <path fill="#f35325" d="M1 1h10v10H1z"/>
                          <path fill="#81bc06" d="M12 1h10v10H12z"/>
                          <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                          <path fill="#ffba08" d="M12 12h10v10H12z"/>
                        </svg>
                        Microsoft
                      </button>
                      <button
                        onClick={() => {
                          setIsCalendarConnected(true);
                          toast.success('Google Calendar tilkoblet!');
                        }}
                        className="flex-1 inline-flex items-center justify-center px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-[#93C1FF] transition-colors"
                      >
                        <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Google
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Maler Link Row */}
              <Link
                to="/templates"
                className="flex items-center justify-between px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-slate-100">
                    <FileText className="h-4 w-4 text-slate-600" />
                  </div>
                  <span className="font-medium text-sm text-gray-900">Maler</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" />
              </Link>

              {/* Innstillinger Link Row */}
              <Link
                to="/settings"
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-slate-100">
                    <Settings className="h-4 w-4 text-slate-600" />
                  </div>
                  <span className="font-medium text-sm text-gray-900">Innstillinger</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>

            {/* Folders */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Mapper</h3>
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
                    className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-[#2C64E3] focus:ring-[#2C64E3]"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddFolder();
                      if (e.key === 'Escape') {
                        setShowNewFolderInput(false);
                        setNewFolderName('');
                      }
                    }}
                    onBlur={() => {
                      if (!newFolderName.trim()) {
                        setShowNewFolderInput(false);
                      }
                    }}
                  />
                  <button
                    onClick={handleAddFolder}
                    className="p-1.5 bg-[#2C64E3] text-white rounded-lg hover:bg-[#1F49C6]"
                  >
                    <FolderPlus className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className="space-y-1">
                <button
                  onClick={() => setActiveFolder(null)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (draggedRecording) setDropTargetFolder('all');
                  }}
                  onDragLeave={() => setDropTargetFolder(null)}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleDropOnFolder(null);
                  }}
                  className={cn(
                    "w-full flex items-center px-3 py-2 rounded-lg text-sm transition-all",
                    !activeFolder
                      ? "bg-[#F0F5FF] text-[#2C64E3]"
                      : "text-gray-600 hover:bg-gray-50",
                    dropTargetFolder === 'all' && draggedRecording && "ring-2 ring-[#2C64E3] bg-[#E4ECFF]"
                  )}
                >
                  <Folder className="h-4 w-4 mr-2" />
                  Alle mapper
                </button>

                <AnimatePresence mode="popLayout">
                  {folders.map(folder => (
                    <motion.div
                      key={folder.id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="relative group"
                    >
                      <button
                      onClick={() => setActiveFolder(folder.id)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (draggedRecording) setDropTargetFolder(folder.id);
                      }}
                      onDragLeave={() => setDropTargetFolder(null)}
                      onDrop={(e) => {
                        e.preventDefault();
                        handleDropOnFolder(folder.id);
                      }}
                      className={cn(
                        "w-full flex items-center px-3 py-2 rounded-lg text-sm transition-all",
                        activeFolder === folder.id
                          ? "bg-[#F0F5FF] text-[#2C64E3]"
                          : "text-gray-600 hover:bg-gray-50",
                        dropTargetFolder === folder.id && draggedRecording && "ring-2 ring-[#2C64E3] bg-[#E4ECFF]"
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
                    </motion.div>
                ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Etiketter</h3>
                <button
                  onClick={() => setShowTagEditor(true)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <AnimatePresence mode="popLayout">
                  {availableTags.map(tag => (
                    <motion.button
                      key={tag.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        "inline-flex items-center px-3 py-1 rounded-full text-sm transition-colors",
                        activeTags.has(tag.id)
                          ? "bg-[#2C64E3] text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                    >
                      <TagIcon className="h-3 w-3 mr-1" />
                      {tag.name}
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Recordings List */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {isLoading ? (
                <SkeletonCardList count={ITEMS_PER_PAGE} />
              ) : error ? (
                <div className="text-center py-8 text-red-600">{error}</div>
              ) : getCurrentPageRecordings().length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-center py-16"
                >
                  {searchQuery ? (
                    // Empty state for search
                    <div className="max-w-md mx-auto">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <Search className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Ingen resultater funnet
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Prøv å søke med andre søkeord eller fjern filtre
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setActiveTags(new Set());
                          setAdvancedFilters({
                            status: 'all',
                            durationMin: 0,
                            durationMax: 10000,
                            dateFrom: '',
                            dateTo: ''
                          });
                        }}
                        className="px-4 py-2 bg-[#2C64E3] hover:bg-[#1F49C6] text-white rounded-lg font-medium transition-colors"
                      >
                        Nullstill søk
                      </button>
                    </div>
                  ) : activeFolder || activeTags.size > 0 ? (
                    // Empty state for folder/tag filter
                    <div className="max-w-md mx-auto">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F0F5FF] flex items-center justify-center">
                        <Folder className="h-8 w-8 text-[#2C64E3]" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Ingen opptak her
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {activeFolder
                          ? `Mappen "${folders.find(f => f.id === activeFolder)?.name}" er tom`
                          : 'Ingen opptak med valgte etiketter'}
                      </p>
                      <button
                        onClick={() => {
                          setActiveFolder(null);
                          setActiveTags(new Set());
                        }}
                        className="px-4 py-2 bg-[#2C64E3] hover:bg-[#1F49C6] text-white rounded-lg font-medium transition-colors"
                      >
                        Vis alle opptak
                      </button>
                    </div>
                  ) : (
                    // Empty state for no recordings at all
                    <div className="max-w-md mx-auto">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#E4ECFF] to-[#F0F5FF] flex items-center justify-center">
                        <Mic className="h-10 w-10 text-[#2C64E3]" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Kom i gang med ditt første opptak
                      </h3>
                      <p className="text-gray-600 mb-8">
                        Start et nytt opptak eller last opp en eksisterende lydfil for å få transkribering og AI-analyse
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                          onClick={handleStartRecording}
                          className="px-6 py-3 bg-[#2C64E3] hover:bg-[#1F49C6] text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <Mic className="h-5 w-5" />
                          Start opptak
                        </button>
                        <button
                          onClick={() => setShowUploadModal(true)}
                          className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <FileText className="h-5 w-5" />
                          Last opp fil
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <>
                  <AnimatePresence mode="popLayout">
                    {getCurrentPageRecordings().map((recording) => (
                      <motion.div
                        key={recording.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        draggable={!isBulkEditMode}
                        onDragStart={() => handleDragStart(recording.id)}
                        onDragEnd={handleDragEnd}
                        onClick={isBulkEditMode ? () => toggleRecordingSelection(recording.id) : undefined}
                        className={cn(
                          "feature-card dashboard-card flex items-center justify-between group",
                          selectedRecordings.has(recording.id) && "bg-[#E4ECFF]/60 border-[#CFE0FF]",
                          isBulkEditMode && "cursor-pointer hover:bg-[#F0F5FF]",
                          !isBulkEditMode && "cursor-move",
                          draggedRecording === recording.id && "opacity-50"
                        )}
                      >
                      <div
                        className="flex-1 flex items-center space-x-4"
                      >
                        {isBulkEditMode && (
                        <div
                          className="p-2 rounded-lg transition-colors"
                        >
                          {selectedRecordings.has(recording.id) ? (
                            <CheckSquare className="h-5 w-5 text-[#2C64E3]" />
                          ) : (
                            <Square className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
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
                          onClick={(e) => {
                            if (isBulkEditMode) {
                              e.preventDefault();
                            }
                          }}
                          className="min-w-0 flex-1 flex items-center group"
                        >
                          <div className="flex-1">
                            <h3 className="font-medium mb-1 text-gray-900">{recording.title}</h3>
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{formatDate(recording.created_at)}</span>
                              <span className="mx-2">•</span>
                              <span>{formatDuration(recording.duration)}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              {recording.folder_id && (
                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-[#F0F5FF] text-[#2C64E3] text-xs">
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
                    </motion.div>
                  ))}
                  </AnimatePresence>

                  {/* Bulk Actions Controls */}
                  {selectedRecordings.size > 0 && (
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg border border-gray-200 p-4 flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700">
                        {selectedRecordings.size} valgt
                      </span>

                      {/* Folder dropdown */}
                      <BulkMoveDropdown
                        folders={folders}
                        onMove={handleBulkMove}
                        selectedCount={selectedRecordings.size}
                      />

                      {/* Tag button */}
                      <button
                        onClick={() => setShowBulkTagModal(true)}
                        className="text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center transition-colors"
                      >
                        <TagIcon className="h-4 w-4 mr-2" />
                        Etiketter
                      </button>

                      {/* Delete button */}
                      <button
                        onClick={() => setShowBulkDeleteDialog(true)}
                        className="text-sm px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center transition-colors"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Slett
                      </button>

                      {/* Cancel button */}
                      <button
                        onClick={() => setSelectedRecordings(new Set())}
                        className="text-sm px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
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
        onUploadComplete={handleFileUploadComplete}
      />

      <DirectInviteModal
        isOpen={showDirectInviteModal}
        onClose={() => setShowDirectInviteModal(false)}
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

      <BulkTagModal
        isOpen={showBulkTagModal}
        onClose={() => setShowBulkTagModal(false)}
        availableTags={availableTags}
        onApplyTags={handleBulkTag}
        selectedCount={selectedRecordings.size}
      />

      <CalendarMeetingsModal
        isOpen={showCalendarMeetingsModal}
        onClose={() => setShowCalendarMeetingsModal(false)}
        onInviteAssistant={(meeting) => {
          setShowCalendarMeetingsModal(false);
          setShowDirectInviteModal(true);
        }}
      />
    </div>
  );
}
