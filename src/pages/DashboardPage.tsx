import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Flame,
  TrendingUp,
  Zap,
  Trophy
} from 'lucide-react';
import RecordingModal from '@/components/RecordingModal';
import FileUploadModal from '@/components/FileUploadModal';
import DirectInviteModal from '@/components/DirectInviteModal';
import CalendarMeetingsModal from '@/components/CalendarMeetingsModal';
import FolderRenameModal from '@/components/FolderRenameModal';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import TagEditor from '@/components/TagEditor';
import Pagination from '@/components/Pagination';
import { cn } from '@/lib/utils';
import { useFolders } from '@/contexts/FolderContext';
import { toast } from '@/components/ui/toast';
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

    // Apply date filter
    filtered = getFilteredRecordingsByDate(filtered);

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
    <div className="min-h-screen pt-16 bg-gray-50/50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto p-6">
        {/* Personlig velkomst med glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 relative"
        >
          {/* Bakgrunns-gradient blob */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-violet-400/30 to-fuchsia-400/30 dark:from-violet-600/20 dark:to-fuchsia-600/20 rounded-full blur-3xl" />
          <div className="absolute -top-5 right-20 w-32 h-32 bg-gradient-to-br from-fuchsia-400/20 to-pink-400/20 dark:from-fuchsia-600/15 dark:to-pink-600/15 rounded-full blur-3xl" />

          {/* Glassmorphism card */}
          <div className="relative backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 rounded-2xl border border-white/50 dark:border-gray-700/50 shadow-lg shadow-violet-500/5 dark:shadow-violet-500/10 p-6 overflow-hidden">
            {/* Subtil shimmer-effekt */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" style={{ animationDelay: '1s' }} />

            <div className="relative flex items-center justify-between">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex items-center gap-2 mb-1"
                >
                  <Sparkles className="h-5 w-5 text-violet-500 dark:text-violet-400" />
                  <span className="text-sm font-medium text-violet-600 dark:text-violet-400">Velkommen tilbake</span>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
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
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                    <Zap className="h-3.5 w-3.5" />
                    <span className="text-sm font-medium">{formatMinutesToHours(userStats.estimatedTimeSaved)} spart</span>
                  </div>

                  {/* Streak */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-100/80 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400">
                    <Flame className="h-3.5 w-3.5" />
                    <span className="text-sm font-medium">{userStats.currentStreak} dager streak</span>
                  </div>

                  {/* Denne måneden */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-100/80 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span className="text-sm font-medium">{userStats.recordingsThisMonth} opptak i desember</span>
                  </div>
                </motion.div>
              </div>

              {/* Trophy ikon - matcher gamification stats */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5, type: 'spring' }}
                className="hidden md:flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-500/30"
              >
                <Trophy className="h-7 w-7 text-white" />
              </motion.div>
            </div>
          </div>
        </motion.div>

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
              <h3 className="font-medium mb-1 text-gray-900 dark:text-white">Start opptak</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
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
              <h3 className="font-medium mb-1 text-gray-900 dark:text-white">Last opp opptak</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Last opp eksisterende lydopptak
              </p>
            </div>
          </button>

          <button
            className="feature-card flex items-center"
            onClick={() => setShowDirectInviteModal(true)}
          >
            <div className="feature-icon mr-4">
              <Video className="h-5 w-5" />
            </div>
            <div className="text-left">
              <h3 className="font-medium mb-1 text-gray-900 dark:text-white">Direkteinvitasjon</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Send Notably til et møte umiddelbart
              </p>
            </div>
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm dark:shadow-none dark:border dark:border-gray-800 p-4 mb-6">
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex-1 relative">
                <input
                  type="search"
                  placeholder="Søk i opptak, transkripsjoner, etiketter..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 pl-10 focus:border-violet-500 dark:focus:border-violet-500 focus:ring-violet-500"
                />
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
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
                    ? "bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                )}
              >
                {isBulkEditMode ? 'Avslutt redigering' : 'Rediger møter'}
              </button>
            </div>
            <div className="mt-3 flex items-center space-x-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">Periode:</span>
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
                      ? "bg-violet-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Organization and Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* Folders and Tags Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Meny - Quick Access */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm dark:shadow-none dark:border dark:border-gray-800 overflow-hidden">
              <div className="px-4 py-3 bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-violet-900/20 dark:to-fuchsia-900/20 border-b border-violet-100 dark:border-violet-800/30">
                <div className="flex items-center space-x-2">
                  <div className="p-1 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-md">
                    <Zap className="h-3.5 w-3.5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Meny</h3>
                </div>
              </div>

              {/* Calendar Mini Card */}
              <div className={cn(
                "p-3 border-b border-gray-100 dark:border-gray-800",
                !isCalendarConnected && "bg-gradient-to-r from-violet-50/50 to-fuchsia-50/50 dark:from-violet-900/10 dark:to-fuchsia-900/10"
              )}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={cn(
                      "p-1.5 rounded-lg",
                      isCalendarConnected
                        ? "bg-green-100 dark:bg-green-900/30"
                        : "bg-white dark:bg-gray-800 shadow-sm dark:shadow-none"
                    )}>
                      <CalendarIcon className={cn(
                        "h-4 w-4",
                        isCalendarConnected ? "text-green-600 dark:text-green-400" : "text-violet-600 dark:text-violet-400"
                      )} />
                    </div>
                    <span className="font-medium text-sm text-gray-900 dark:text-white">Kalender</span>
                  </div>
                  {isCalendarConnected && (
                    <span className="flex items-center text-xs text-green-600 dark:text-green-400">
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
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 truncate">
                            <span className="truncate">{nextMeeting.title}</span>
                            <span className="mx-1">•</span>
                            <span className={cn(isUrgent && "text-orange-600 dark:text-orange-400 font-medium")}>
                              {timeUntil}
                            </span>
                          </p>
                        );
                      }
                      return (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                          Ingen kommende møter
                        </p>
                      );
                    })()}
                    <button
                      onClick={() => setShowCalendarMeetingsModal(true)}
                      className="w-full text-xs font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 flex items-center justify-center py-1.5 rounded-lg bg-violet-50 dark:bg-violet-900/20 hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors"
                    >
                      Se alle møter
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </button>
                  </>
                ) : (
                  // Not connected - show connection buttons
                  <>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                      Koble til for automatisk transkripsjon
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setIsCalendarConnected(true);
                          toast.success('Microsoft 365 kalender tilkoblet!');
                        }}
                        className="flex-1 inline-flex items-center justify-center px-2 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-violet-300 dark:hover:border-violet-500 transition-colors"
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
                        className="flex-1 inline-flex items-center justify-center px-2 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-violet-300 dark:hover:border-violet-500 transition-colors"
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
                className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
              >
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                    <FileText className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="font-medium text-sm text-gray-900 dark:text-white">Maler</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-0.5 transition-all" />
              </Link>

              {/* Innstillinger Link Row */}
              <Link
                to="/settings"
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
              >
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                    <Settings className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </div>
                  <span className="font-medium text-sm text-gray-900 dark:text-white">Innstillinger</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>

            {/* Folders */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm dark:shadow-none dark:border dark:border-gray-800 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900 dark:text-white">Mapper</h3>
                <button
                  onClick={() => setShowNewFolderInput(true)}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400"
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
                    className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-violet-500 focus:ring-violet-500"
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
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400"
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
                    !activeFolder
                      ? "bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
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
                        activeFolder === folder.id
                          ? "bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
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
                      <div className="absolute right-0 top-0 mt-8 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                        <button
                          onClick={() => handleFolderAction(folder.id, folder.name, 'rename')}
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Endre navn
                        </button>
                        <button
                          onClick={() => handleFolderAction(folder.id, folder.name, 'delete')}
                          className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
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
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm dark:shadow-none dark:border dark:border-gray-800 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900 dark:text-white">Etiketter</h3>
                <button
                  onClick={() => setShowTagEditor(true)}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400"
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
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
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
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-600 dark:border-violet-400 mx-auto"></div>
                  <p className="text-gray-600 dark:text-gray-400 mt-4">Henter opptak...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-600 dark:text-red-400">{error}</div>
              ) : getCurrentPageRecordings().length === 0 ? (
                <div className="text-center py-8 text-gray-600 dark:text-gray-400">
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
                        selectedRecordings.has(recording.id) && "bg-violet-50/50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800"
                      )}
                    >
                      <div
                        className="flex-1 flex items-center space-x-4"
                      >
                        {isBulkEditMode && (
                        <button
                          onClick={() => toggleRecordingSelection(recording.id)}
                          className="p-2 hover:bg-violet-100 dark:hover:bg-violet-900/30 rounded-lg transition-colors"
                        >
                          {selectedRecordings.has(recording.id) ? (
                            <CheckSquare className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                          ) : (
                            <Square className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                        )}
                        <div className={cn(
                          "p-3 rounded-xl",
                          recording.status === 'completed'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                            : recording.status === 'processing'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                        )}>
                          <Mic className="h-5 w-5" />
                        </div>
                        <Link
                          to={`/meetings/${recording.id}`}
                          className="min-w-0 flex-1 flex items-center group"
                        >
                          <div className="flex-1">
                            <h3 className="font-medium mb-1 text-gray-900 dark:text-white">{recording.title}</h3>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{formatDate(recording.created_at)}</span>
                              <span className="mx-2">•</span>
                              <span>{formatDuration(recording.duration)}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              {recording.folder_id && (
                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-xs">
                                  <Folder className="h-3 w-3 mr-1" />
                                  {folders.find(f => f.id === recording.folder_id)?.name}
                              </span>
                              )}
                              {recording.tags?.map(tag => (
                                <span
                                  key={tag.id}
                                  className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs"
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
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-900 rounded-xl shadow-lg dark:shadow-2xl border border-gray-200 dark:border-gray-700 p-4 flex items-center space-x-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
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
