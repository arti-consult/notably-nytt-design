// Mock data for calendar meetings (upcoming)
export interface CalendarMeeting {
  id: string;
  title: string;
  date: string; // ISO date string
  time: string; // e.g., "14:00 - 15:00"
  duration: number; // minutes
  platform: 'google-meet' | 'zoom' | 'teams' | 'whereby';
  meetingLink: string;
  participants: string[];
  autoRecordEnabled: boolean;
  status: 'upcoming' | 'in-progress' | 'completed' | 'cancelled';
  calendarSource: 'google' | 'microsoft';
}

// Helper to get dates relative to today
const getRelativeDate = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

export const mockCalendarMeetings: CalendarMeeting[] = [
  // I dag
  {
    id: 'cal-1',
    title: 'Standup med utviklingsteamet',
    date: getRelativeDate(0),
    time: '09:00 - 09:15',
    duration: 15,
    platform: 'google-meet',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    participants: ['Anna Hansen', 'Erik Olsen', 'Maria Berg'],
    autoRecordEnabled: true,
    status: 'completed',
    calendarSource: 'google',
  },
  {
    id: 'cal-2',
    title: 'Produktmøte Q1 2025',
    date: getRelativeDate(0),
    time: '14:00 - 15:30',
    duration: 90,
    platform: 'zoom',
    meetingLink: 'https://zoom.us/j/123456789',
    participants: ['Demo Bruker', 'Anna Hansen', 'Kunden AS', 'Ole Nordmann'],
    autoRecordEnabled: true,
    status: 'upcoming',
    calendarSource: 'google',
  },
  {
    id: 'cal-3',
    title: '1:1 med Anna',
    date: getRelativeDate(0),
    time: '16:00 - 16:30',
    duration: 30,
    platform: 'google-meet',
    meetingLink: 'https://meet.google.com/xyz-uvwx-rst',
    participants: ['Anna Hansen'],
    autoRecordEnabled: false,
    status: 'upcoming',
    calendarSource: 'google',
  },
  // I morgen
  {
    id: 'cal-4',
    title: 'Sprint planning',
    date: getRelativeDate(1),
    time: '10:00 - 11:00',
    duration: 60,
    platform: 'teams',
    meetingLink: 'https://teams.microsoft.com/l/meetup-join/123',
    participants: ['Hele teamet'],
    autoRecordEnabled: true,
    status: 'upcoming',
    calendarSource: 'microsoft',
  },
  {
    id: 'cal-5',
    title: 'Kundemøte - Innovasjon AS',
    date: getRelativeDate(1),
    time: '13:00 - 14:00',
    duration: 60,
    platform: 'zoom',
    meetingLink: 'https://zoom.us/j/987654321',
    participants: ['Per Innovasjon', 'Kari Teknologi'],
    autoRecordEnabled: true,
    status: 'upcoming',
    calendarSource: 'google',
  },
  // Om 2 dager
  {
    id: 'cal-6',
    title: 'Designgjennomgang',
    date: getRelativeDate(2),
    time: '11:00 - 12:00',
    duration: 60,
    platform: 'google-meet',
    meetingLink: 'https://meet.google.com/design-123',
    participants: ['Maria Berg', 'Erik Olsen'],
    autoRecordEnabled: true,
    status: 'upcoming',
    calendarSource: 'google',
  },
  // Om 3 dager
  {
    id: 'cal-7',
    title: 'Ukentlig statusmøte',
    date: getRelativeDate(3),
    time: '09:00 - 09:30',
    duration: 30,
    platform: 'teams',
    meetingLink: 'https://teams.microsoft.com/l/meetup-join/456',
    participants: ['Hele organisasjonen'],
    autoRecordEnabled: true,
    status: 'upcoming',
    calendarSource: 'microsoft',
  },
  {
    id: 'cal-8',
    title: 'Budsjettgjennomgang',
    date: getRelativeDate(3),
    time: '14:00 - 15:00',
    duration: 60,
    platform: 'zoom',
    meetingLink: 'https://zoom.us/j/budget2025',
    participants: ['CFO', 'Ledelsen'],
    autoRecordEnabled: false,
    status: 'upcoming',
    calendarSource: 'google',
  },
  // Om 5 dager
  {
    id: 'cal-9',
    title: 'Retrospektiv sprint 12',
    date: getRelativeDate(5),
    time: '15:00 - 16:00',
    duration: 60,
    platform: 'google-meet',
    meetingLink: 'https://meet.google.com/retro-sprint12',
    participants: ['Utviklingsteamet'],
    autoRecordEnabled: true,
    status: 'upcoming',
    calendarSource: 'google',
  },
  // Om en uke
  {
    id: 'cal-10',
    title: 'Kvartalsgjennomgang Q1',
    date: getRelativeDate(7),
    time: '10:00 - 12:00',
    duration: 120,
    platform: 'teams',
    meetingLink: 'https://teams.microsoft.com/l/meetup-join/q1review',
    participants: ['Hele selskapet'],
    autoRecordEnabled: true,
    status: 'upcoming',
    calendarSource: 'microsoft',
  },
];

// Helper functions
export const getMeetingsForToday = (): CalendarMeeting[] => {
  const today = getRelativeDate(0);
  return mockCalendarMeetings.filter(m => m.date === today);
};

export const getMeetingsForWeek = (): CalendarMeeting[] => {
  const today = new Date();
  const weekFromNow = new Date();
  weekFromNow.setDate(today.getDate() + 7);

  return mockCalendarMeetings.filter(m => {
    const meetingDate = new Date(m.date);
    return meetingDate >= today && meetingDate <= weekFromNow;
  });
};

export const getUpcomingMeetings = (): CalendarMeeting[] => {
  return mockCalendarMeetings.filter(m => m.status === 'upcoming');
};

export const formatMeetingDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  // Reset hours for comparison
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  if (date.getTime() === today.getTime()) {
    return 'I dag';
  } else if (date.getTime() === tomorrow.getTime()) {
    return 'I morgen';
  } else {
    return date.toLocaleDateString('nb-NO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  }
};

export const getPlatformInfo = (platform: CalendarMeeting['platform']) => {
  const platforms = {
    'google-meet': { name: 'Google Meet', color: 'bg-emerald-500' },
    'zoom': { name: 'Zoom', color: 'bg-blue-500' },
    'teams': { name: 'Teams', color: 'bg-violet-500' },
    'whereby': { name: 'Whereby', color: 'bg-orange-500' },
  };
  return platforms[platform];
};
