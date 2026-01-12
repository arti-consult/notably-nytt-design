import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Calendar, Clock, Users, Video, ExternalLink, Sparkles, Check, ChevronRight, ChevronDown } from 'lucide-react';
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
type CalendarProvider = 'google' | 'microsoft';

export default function CalendarMeetingsModal({
  isOpen,
  onClose,
  onInviteAssistant,
}: CalendarMeetingsModalProps) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterType>('week');
  const [selectedCalendar, setSelectedCalendar] = useState<CalendarProvider>('google');
  const [isCalendarDropdownOpen, setIsCalendarDropdownOpen] = useState(false);
  const [autoRecordToggles, setAutoRecordToggles] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    mockCalendarMeetings.forEach(m => {
      initial[m.id] = m.autoRecordEnabled;
    });
    return initial;
  });

  // Mock: Check which calendars are connected (based on settings)
  const hasGoogleCalendar = true; // TODO: Get from user settings/integrations
  const hasMicrosoftCalendar = false; // TODO: Get from user settings/integrations

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
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-gradient-to-br from-[#2C64E3] to-[#5A8DF8] rounded-xl shadow-lg">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Kommende møter
                  </h2>
                  <p className="text-sm text-gray-500">
                    {filteredMeetings.length} møter synkronisert
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Calendar provider selector */}
            <div className="mt-4 relative">
              <button
                onClick={() => setIsCalendarDropdownOpen(!isCalendarDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all"
              >
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {selectedCalendar === 'google' ? 'Google Calendar' : 'Microsoft 365'}
                  </span>
                </div>
                <ChevronDown className={cn(
                  "h-4 w-4 text-gray-500 transition-transform",
                  isCalendarDropdownOpen && "rotate-180"
                )} />
              </button>

              {/* Dropdown menu */}
              <AnimatePresence>
                {isCalendarDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-10"
                  >
                    <button
                      onClick={() => {
                        if (hasGoogleCalendar) {
                          setSelectedCalendar('google');
                          setIsCalendarDropdownOpen(false);
                        } else {
                          navigate('/settings?tab=integrations');
                          setIsCalendarDropdownOpen(false);
                        }
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors",
                        selectedCalendar === 'google' && hasGoogleCalendar && "bg-blue-50"
                      )}
                    >
                      <span className="text-sm font-medium text-gray-700">Google Calendar</span>
                      {hasGoogleCalendar ? (
                        selectedCalendar === 'google' && (
                          <Check className="h-4 w-4 text-[#2C64E3]" />
                        )
                      ) : (
                        <span className="text-sm text-[#2C64E3] font-medium">Koble til</span>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        if (hasMicrosoftCalendar) {
                          setSelectedCalendar('microsoft');
                          setIsCalendarDropdownOpen(false);
                        } else {
                          navigate('/settings?tab=integrations');
                          setIsCalendarDropdownOpen(false);
                        }
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors border-t border-gray-100",
                        selectedCalendar === 'microsoft' && hasMicrosoftCalendar && "bg-blue-50"
                      )}
                    >
                      <span className="text-sm font-medium text-gray-700">Microsoft 365</span>
                      {hasMicrosoftCalendar ? (
                        selectedCalendar === 'microsoft' && (
                          <Check className="h-4 w-4 text-[#2C64E3]" />
                        )
                      ) : (
                        <span className="text-sm text-[#2C64E3] font-medium">Koble til</span>
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Filter tabs */}
            <div className="flex space-x-1 mt-4 p-1 bg-gray-100 rounded-xl">
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
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
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
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  Ingen møter
                </h3>
                <p className="text-gray-500">
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
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      {formatMeetingDate(dateKey)}
                    </h3>
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs text-gray-400">
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
                              ? "bg-gray-50 border-gray-200"
                              : "bg-white border-gray-200 hover:border-[#93C1FF] hover:shadow-md"
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              {/* Title and status */}
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className={cn(
                                  "font-medium truncate",
                                  meeting.status === 'completed'
                                    ? "text-gray-500"
                                    : "text-gray-900"
                                )}>
                                  {meeting.title}
                                </h4>
                                {meeting.status === 'completed' && (
                                  <span className="flex-shrink-0 px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-600">
                                    Fullført
                                  </span>
                                )}
                                {meeting.status === 'in-progress' && (
                                  <span className="flex-shrink-0 px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-600 animate-pulse">
                                    Pågår nå
                                  </span>
                                )}
                              </div>

                              {/* Time and details */}
                              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
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
                              <div className="flex items-center space-x-3 ml-4">
                                {/* Join meeting button */}
                                <a
                                  href={meeting.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                  <ExternalLink className="h-4 w-4 text-gray-600" />
                                </a>
                              </div>
                            )}
                          </div>

                          {/* Recording toggle for upcoming meetings */}
                          {meeting.status === 'upcoming' && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-900">
                                  Skal Notably være med i møtet?
                                </span>
                                <button
                                  onClick={() => handleToggleAutoRecord(meeting.id)}
                                  className={cn(
                                    "relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#2C64E3] focus:ring-offset-2",
                                    isAutoRecordOn ? "bg-[#2C64E3]" : "bg-gray-200"
                                  )}
                                >
                                  <span
                                    className={cn(
                                      "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out",
                                      isAutoRecordOn ? "translate-x-5" : "translate-x-0"
                                    )}
                                  />
                                </button>
                              </div>
                            </div>
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
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2 text-gray-500">
                <Check className="h-4 w-4 text-emerald-500" />
                <span>
                  Synkronisert med {selectedCalendar === 'google' ? 'Google Calendar' : 'Microsoft 365'}
                </span>
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
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
