import { useState, useMemo } from 'react';
import { X, Calendar, Clock, Users, Video, ExternalLink, Sparkles, Check, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  CalendarMeeting,
  mockCalendarMeetings,
  formatMeetingDate,
  getPlatformInfo,
} from '@/lib/mockCalendarMeetings';

interface CalendarMeetingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInviteAssistant?: (meeting: CalendarMeeting) => void;
}

type FilterType = 'today' | 'week' | 'all';

export default function CalendarMeetingsModal({
  isOpen,
  onClose,
  onInviteAssistant,
}: CalendarMeetingsModalProps) {
  const [filter, setFilter] = useState<FilterType>('week');
  const [autoRecordToggles, setAutoRecordToggles] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    mockCalendarMeetings.forEach(m => {
      initial[m.id] = m.autoRecordEnabled;
    });
    return initial;
  });

  const filteredMeetings = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const weekFromNow = new Date(today);
    weekFromNow.setDate(weekFromNow.getDate() + 7);

    return mockCalendarMeetings.filter(meeting => {
      if (meeting.status === 'cancelled') return false;

      const meetingDate = new Date(meeting.date);
      meetingDate.setHours(0, 0, 0, 0);

      switch (filter) {
        case 'today':
          return meetingDate.getTime() === today.getTime();
        case 'week':
          return meetingDate >= today && meetingDate <= weekFromNow;
        case 'all':
          return meetingDate >= today;
        default:
          return true;
      }
    });
  }, [filter]);

  // Group meetings by date
  const groupedMeetings = useMemo(() => {
    const groups: Record<string, CalendarMeeting[]> = {};
    filteredMeetings.forEach(meeting => {
      const dateKey = meeting.date;
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(meeting);
    });

    // Sort by time within each group
    Object.keys(groups).forEach(dateKey => {
      groups[dateKey].sort((a, b) => a.time.localeCompare(b.time));
    });

    return groups;
  }, [filteredMeetings]);

  const sortedDates = Object.keys(groupedMeetings).sort();

  const handleToggleAutoRecord = (meetingId: string) => {
    setAutoRecordToggles(prev => ({
      ...prev,
      [meetingId]: !prev[meetingId],
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl shadow-lg">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Kommende møter
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {filteredMeetings.length} møter synkronisert
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Filter tabs */}
            <div className="flex space-x-1 mt-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
              {[
                { id: 'today', label: 'I dag' },
                { id: 'week', label: 'Denne uken' },
                { id: 'all', label: 'Alle' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as FilterType)}
                  className={cn(
                    "flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    filter === tab.id
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Meeting list */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {sortedDates.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                  Ingen møter
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {filter === 'today'
                    ? 'Ingen møter planlagt for i dag'
                    : filter === 'week'
                    ? 'Ingen møter denne uken'
                    : 'Ingen kommende møter'}
                </p>
              </div>
            ) : (
              sortedDates.map((dateKey) => (
                <div key={dateKey}>
                  {/* Date header */}
                  <div className="flex items-center space-x-2 mb-3">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                      {formatMeetingDate(dateKey)}
                    </h3>
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {groupedMeetings[dateKey].length} møte{groupedMeetings[dateKey].length !== 1 ? 'r' : ''}
                    </span>
                  </div>

                  {/* Meetings for this date */}
                  <div className="space-y-3">
                    {groupedMeetings[dateKey].map((meeting) => {
                      const platformInfo = getPlatformInfo(meeting.platform);
                      const isAutoRecordOn = autoRecordToggles[meeting.id];

                      return (
                        <motion.div
                          key={meeting.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={cn(
                            "p-4 rounded-xl border transition-all",
                            meeting.status === 'completed'
                              ? "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                              : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600 hover:shadow-md"
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              {/* Title and status */}
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className={cn(
                                  "font-medium truncate",
                                  meeting.status === 'completed'
                                    ? "text-gray-500 dark:text-gray-400"
                                    : "text-gray-900 dark:text-white"
                                )}>
                                  {meeting.title}
                                </h4>
                                {meeting.status === 'completed' && (
                                  <span className="flex-shrink-0 px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400">
                                    Fullført
                                  </span>
                                )}
                                {meeting.status === 'in-progress' && (
                                  <span className="flex-shrink-0 px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 animate-pulse">
                                    Pågår nå
                                  </span>
                                )}
                              </div>

                              {/* Time and details */}
                              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                <span className="flex items-center space-x-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  <span>{meeting.time}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Users className="h-3.5 w-3.5" />
                                  <span>{meeting.participants.length} deltaker{meeting.participants.length !== 1 ? 'e' : ''}</span>
                                </span>
                                <span className="flex items-center space-x-1.5">
                                  <span className={cn("w-2 h-2 rounded-full", platformInfo.color)} />
                                  <span>{platformInfo.name}</span>
                                </span>
                              </div>
                            </div>

                            {/* Actions */}
                            {meeting.status === 'upcoming' && (
                              <div className="flex items-center space-x-2 ml-4">
                                {/* Auto-record toggle */}
                                <button
                                  onClick={() => handleToggleAutoRecord(meeting.id)}
                                  className={cn(
                                    "flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                                    isAutoRecordOn
                                      ? "bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400"
                                      : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                                  )}
                                >
                                  <Sparkles className="h-3.5 w-3.5" />
                                  <span>{isAutoRecordOn ? 'Auto-opptak på' : 'Auto-opptak av'}</span>
                                </button>

                                {/* Join meeting button */}
                                <a
                                  href={meeting.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                >
                                  <ExternalLink className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                                </a>
                              </div>
                            )}
                          </div>

                          {/* Invite assistant button for upcoming meetings */}
                          {meeting.status === 'upcoming' && onInviteAssistant && (
                            <button
                              onClick={() => onInviteAssistant(meeting)}
                              className="mt-3 w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md"
                            >
                              <Sparkles className="h-4 w-4" />
                              <span>Inviter Notably-assistent</span>
                            </button>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                <Check className="h-4 w-4 text-emerald-500" />
                <span>Synkronisert med Google Calendar</span>
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
              >
                Lukk
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
