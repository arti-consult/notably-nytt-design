interface MockUser {
  id: string;
  email: string;
  name: string;
  organization?: string;
  created_at: string;
}

interface MockRecording {
  id: string;
  title: string;
  created_at: string;
  duration: number;
  status: 'processing' | 'completed' | 'error' | 'pending_upload';
  folder_id?: string;
  tags?: Array<{
    id: string;
    name: string;
  }>;
}

// Mock bruker for demo
export const mockUser: MockUser = {
  id: 'demo-user',
  email: 'demo@notably.no',
  name: 'Demo Bruker',
  organization: 'Demo Organisasjon AS',
  created_at: new Date('2024-01-01').toISOString()
};

interface MockFolder {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface MockTag {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const mockFolders: MockFolder[] = [
  {
    id: 'folder-1',
    name: 'Styremøter',
    user_id: 'demo-user',
    created_at: new Date('2024-11-01').toISOString(),
    updated_at: new Date('2024-11-01').toISOString()
  },
  {
    id: 'folder-2',
    name: 'Ukentlige team-møter',
    user_id: 'demo-user',
    created_at: new Date('2024-11-05').toISOString(),
    updated_at: new Date('2024-11-05').toISOString()
  },
  {
    id: 'folder-3',
    name: 'Klientmøter',
    user_id: 'demo-user',
    created_at: new Date('2024-11-10').toISOString(),
    updated_at: new Date('2024-11-10').toISOString()
  },
  {
    id: 'folder-4',
    name: 'Prosjektplanlegging',
    user_id: 'demo-user',
    created_at: new Date('2024-11-15').toISOString(),
    updated_at: new Date('2024-11-15').toISOString()
  }
];

export const mockTags: MockTag[] = [
  {
    id: 'tag-1',
    name: 'Viktig',
    user_id: 'demo-user',
    created_at: new Date('2024-11-01').toISOString(),
    updated_at: new Date('2024-11-01').toISOString()
  },
  {
    id: 'tag-2',
    name: 'Oppfølging',
    user_id: 'demo-user',
    created_at: new Date('2024-11-01').toISOString(),
    updated_at: new Date('2024-11-01').toISOString()
  },
  {
    id: 'tag-3',
    name: 'Q4 2024',
    user_id: 'demo-user',
    created_at: new Date('2024-11-01').toISOString(),
    updated_at: new Date('2024-11-01').toISOString()
  },
  {
    id: 'tag-4',
    name: 'Strategi',
    user_id: 'demo-user',
    created_at: new Date('2024-11-01').toISOString(),
    updated_at: new Date('2024-11-01').toISOString()
  },
  {
    id: 'tag-5',
    name: 'Teknisk',
    user_id: 'demo-user',
    created_at: new Date('2024-11-01').toISOString(),
    updated_at: new Date('2024-11-01').toISOString()
  }
];

export const mockRecordings: MockRecording[] = [
  {
    id: 'rec-pending-1',
    title: 'Kundeworkshop - Produktutvikling',
    created_at: new Date('2024-12-03T11:30:00').toISOString(),
    duration: 2400,
    status: 'pending_upload',
    folder_id: 'folder-3',
    tags: [
      { id: 'tag-1', name: 'Viktig' },
      { id: 'tag-2', name: 'Oppfølging' }
    ]
  },
  {
    id: 'rec-1',
    title: 'Styremøte Q4 2024 - Budsjettgjennomgang',
    created_at: new Date('2024-12-02T14:00:00').toISOString(),
    duration: 3780,
    status: 'completed',
    folder_id: 'folder-1',
    tags: [
      { id: 'tag-1', name: 'Viktig' },
      { id: 'tag-3', name: 'Q4 2024' },
      { id: 'tag-4', name: 'Strategi' }
    ]
  },
  {
    id: 'rec-2',
    title: 'Team standup - Ukentlig gjennomgang',
    created_at: new Date('2024-12-02T09:00:00').toISOString(),
    duration: 1620,
    status: 'completed',
    folder_id: 'folder-2',
    tags: [
      { id: 'tag-2', name: 'Oppfølging' }
    ]
  },
  {
    id: 'rec-3',
    title: 'Klientmøte - Ny produktlansering',
    created_at: new Date('2024-12-01T13:30:00').toISOString(),
    duration: 2700,
    status: 'completed',
    folder_id: 'folder-3',
    tags: [
      { id: 'tag-1', name: 'Viktig' },
      { id: 'tag-4', name: 'Strategi' }
    ]
  },
  {
    id: 'rec-4',
    title: 'Sprint Planning - Desember 2024',
    created_at: new Date('2024-12-01T10:00:00').toISOString(),
    duration: 4320,
    status: 'completed',
    folder_id: 'folder-4',
    tags: [
      { id: 'tag-5', name: 'Teknisk' }
    ]
  },
  {
    id: 'rec-5',
    title: 'HR-møte - Ansettelsesprosess',
    created_at: new Date('2024-11-30T15:00:00').toISOString(),
    duration: 2160,
    status: 'completed',
    tags: [
      { id: 'tag-2', name: 'Oppfølging' }
    ]
  },
  {
    id: 'rec-6',
    title: 'Prosjektreview - Nettsted redesign',
    created_at: new Date('2024-11-29T11:00:00').toISOString(),
    duration: 3240,
    status: 'completed',
    folder_id: 'folder-4',
    tags: [
      { id: 'tag-5', name: 'Teknisk' },
      { id: 'tag-2', name: 'Oppfølging' }
    ]
  },
  {
    id: 'rec-7',
    title: 'Månedlig all-hands meeting',
    created_at: new Date('2024-11-28T14:00:00').toISOString(),
    duration: 2880,
    status: 'completed',
    tags: [
      { id: 'tag-1', name: 'Viktig' }
    ]
  },
  {
    id: 'rec-8',
    title: 'Team retrospektiv - November',
    created_at: new Date('2024-11-27T16:00:00').toISOString(),
    duration: 1800,
    status: 'completed',
    folder_id: 'folder-2',
    tags: [
      { id: 'tag-2', name: 'Oppfølging' }
    ]
  },
  {
    id: 'rec-9',
    title: 'Klientmøte - Status oppdatering',
    created_at: new Date('2024-11-26T10:30:00').toISOString(),
    duration: 1980,
    status: 'completed',
    folder_id: 'folder-3',
    tags: []
  },
  {
    id: 'rec-10',
    title: 'Sikkerhetsgjenomgang - Q4',
    created_at: new Date('2024-11-25T13:00:00').toISOString(),
    duration: 3600,
    status: 'completed',
    folder_id: 'folder-4',
    tags: [
      { id: 'tag-1', name: 'Viktig' },
      { id: 'tag-5', name: 'Teknisk' }
    ]
  },
  {
    id: 'rec-11',
    title: 'Styremøte - Strategi 2025',
    created_at: new Date('2024-11-22T14:00:00').toISOString(),
    duration: 4500,
    status: 'completed',
    folder_id: 'folder-1',
    tags: [
      { id: 'tag-1', name: 'Viktig' },
      { id: 'tag-4', name: 'Strategi' }
    ]
  },
  {
    id: 'rec-12',
    title: 'Team sync - Ukentlig',
    created_at: new Date('2024-11-21T09:00:00').toISOString(),
    duration: 1500,
    status: 'completed',
    folder_id: 'folder-2',
    tags: []
  },
  {
    id: 'rec-13',
    title: 'Produktdemo for stakeholders',
    created_at: new Date('2024-11-20T15:30:00').toISOString(),
    duration: 2400,
    status: 'completed',
    folder_id: 'folder-3',
    tags: [
      { id: 'tag-1', name: 'Viktig' }
    ]
  },
  {
    id: 'rec-14',
    title: 'Teknisk arkitektur diskusjon',
    created_at: new Date('2024-11-19T11:00:00').toISOString(),
    duration: 3120,
    status: 'completed',
    folder_id: 'folder-4',
    tags: [
      { id: 'tag-5', name: 'Teknisk' }
    ]
  },
  {
    id: 'rec-15',
    title: 'Salgs pipeline review',
    created_at: new Date('2024-11-18T10:00:00').toISOString(),
    duration: 2700,
    status: 'completed',
    tags: [
      { id: 'tag-4', name: 'Strategi' }
    ]
  }
];
