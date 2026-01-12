# Technical Stack Overview - Notably Frontend

**Project:** Notably Design
**Version:** 0.1.0
**Purpose:** Complete technical reference for backend integration
**Date:** January 12, 2026

---

## Core Technologies

### Framework & Language
- **React** 18.2.0 - UI framework
- **TypeScript** 5.2.2 - Type-safe JavaScript
- **Vite** 5.1.4 - Build tool and dev server (fast HMR, optimized builds)

### Routing
- **React Router DOM** 6.22.2
  - Declarative routing with `<Routes>` and `<Route>`
  - Protected routes for authentication (`ProtectedRoute`, `ProtectedAdminRoute`)
  - Location: [src/App.tsx](src/App.tsx)

---

## Styling & UI

### CSS Framework
- **Tailwind CSS** 3.4.1
  - Utility-first CSS framework
  - PostCSS 8.4.35 for processing
  - Autoprefixer 10.4.17 for browser compatibility
  - Config: [tailwind.config.js](tailwind.config.js)

### UI Libraries
- **Lucide React** 0.344.0 - Icon library (modern, tree-shakeable)
- **Framer Motion** 11.0.8 - Animation library for smooth transitions
- **clsx** 2.1.0 + **tailwind-merge** 2.2.1 - Conditional className utilities
  - Combined in `src/lib/utils.ts` as `cn()` function

---

## Data Visualization
- **Chart.js** 4.4.2 - Charting library
- **react-chartjs-2** 5.2.0 - React wrapper for Chart.js
- Used in: Dashboard analytics, meeting statistics

---

## Security
- **DOMPurify** 3.0.9 - HTML sanitization to prevent XSS attacks
- Used when rendering user-generated content or rich text

---

## State Management

### Context API (No Redux)
The project uses React Context API for global state:

1. **AuthContext** - User authentication state
   - Location: `src/contexts/AuthContext.tsx`
   - Provides: `user`, `login()`, `logout()`, `isAuthenticated`

2. **AdminContext** - Admin role permissions
   - Location: `src/contexts/AdminContext.tsx`
   - Provides: `isAdmin`, admin-specific functionality

3. **DemoUserContext** - Demo mode with multiple personas
   - Location: `src/contexts/DemoUserContext.tsx`
   - Modes: `solo`, `member`, `admin`
   - Used for showcasing different user experiences

---

## Development Tools

### Code Quality
- **ESLint** 8.56.0
  - TypeScript ESLint plugin and parser
  - React Hooks plugin
  - React Refresh plugin
  - Config: [.eslintrc.cjs](.eslintrc.cjs)

### Testing
- **Vitest** 1.3.1 - Fast unit test runner (Vite-native)
- Run: `npm test`

### TypeScript Configuration
- Strict mode enabled
- Path aliases configured:
  - `@/` → `src/`
  - Example: `import { cn } from '@/lib/utils'`
- Config: [tsconfig.json](tsconfig.json)

---

## Project Structure

```
notably-nytt-design/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page-level components
│   │   └── settings/     # Nested settings pages
│   ├── contexts/         # React Context providers
│   ├── lib/              # Utilities and mock data
│   │   ├── utils.ts      # Helper functions (cn, etc.)
│   │   ├── mockTemplates.ts
│   │   ├── mockMeetingDetails.ts
│   │   └── mockCalendarMeetings.ts
│   ├── types/            # TypeScript type definitions
│   ├── hooks/            # Custom React hooks
│   └── App.tsx           # Main app component with routing
├── public/               # Static assets
├── CLEANUP_REPORT.md     # Code cleanup recommendations
└── TECH_STACK.md         # This file
```

---

## Development Commands

```bash
# Start development server (with HMR)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run tests
npm test

# Lint code
npm run lint

# Install dependencies
npm install
```

### Dev Server
- Runs on `http://localhost:5173` by default
- Hot Module Replacement (HMR) enabled
- Fast refresh for React components

---

## Mock Data Strategy

### Current Approach
The frontend is fully functional with mock data to showcase UI/UX without backend.

### Mock Data Files
All located in `src/lib/`:
- `mockTemplates.ts` - Meeting templates
- `mockMeetingDetails.ts` - Individual meeting data
- `mockCalendarMeetings.ts` - Calendar integration mock
- `mockTemplateWizard.ts` - AI template wizard data

### ⚠️ Backend Integration Points
These mock files should be replaced with API calls. See recommended approach below.

---

## Recommended Backend Integration Approach

### 1. Create API Service Layer

**Structure:**
```
src/
└── services/
    ├── api.ts              # Base axios configuration
    ├── auth.service.ts     # Authentication endpoints
    ├── meetings.service.ts # Meeting CRUD operations
    ├── templates.service.ts # Template management
    └── calendar.service.ts # Calendar integrations
```

### 2. Base API Configuration (api.ts)
```typescript
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 3. Environment Variables
Create `.env` file:
```
VITE_API_URL=http://localhost:3000/api
VITE_APP_ENV=development
```

### 4. Migration Path
1. Keep mock data files initially
2. Create service files with TODO comments
3. Gradually replace mock imports with API calls
4. Use feature flags if needed for gradual rollout

**Example Service:**
```typescript
// src/services/meetings.service.ts
import { api } from './api';
import { mockMeetingDetails } from '@/lib/mockMeetingDetails'; // Keep during transition

export const getMeetings = async () => {
  // TODO: Replace with actual API call
  // return api.get('/meetings').then(res => res.data);

  // Temporary mock
  return Promise.resolve(mockMeetingDetails);
};
```

---

## TypeScript Interfaces

### Key Type Locations
- `src/types/` - Global type definitions
- Component-level types defined in same file or nearby `.types.ts`

### Important Interfaces to Preserve
When creating backend API contracts, reference existing frontend types:
- Meeting types
- Template types
- User types
- Authentication types

---

## Authentication Flow

### Current Implementation (Mock)
- Uses Context API (AuthContext)
- Stores user state in localStorage
- Protected routes check authentication status

### Backend Integration Needed
1. Login endpoint → JWT token
2. Token storage (localStorage or httpOnly cookies)
3. Token refresh mechanism
4. Logout endpoint
5. Update AuthContext to use real API

---

## Key Features & Components

### 1. Dashboard
- Meeting overview
- Calendar integration
- Statistics and analytics (Chart.js)

### 2. Template System
- Pre-built meeting templates
- AI-assisted template creation wizard
- Custom template builder

### 3. Meeting Management
- Recording functionality (placeholder)
- Transcription display
- AI-generated summaries
- Action items tracking

### 4. Settings
- User profile
- Team management
- Integrations (Microsoft 365, Google Calendar)
- Subscription plans

### 5. Admin Panel
- User management
- Organization overview
- Analytics

---

## Browser Support
Based on Vite defaults:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- No IE11 support

---

## Performance Considerations

### Build Output
- Vite creates optimized production builds
- Code splitting by route (React.lazy if needed)
- Tree-shaking for unused code
- Minification enabled by default

### Bundle Size
- Current estimate: ~150-200KB (minified + gzipped)
- After cleanup (see CLEANUP_REPORT.md): ~130-180KB

---

## Security Notes

### Frontend Security
1. **XSS Prevention**: DOMPurify sanitizes all user-generated HTML
2. **CSRF**: Backend should implement CSRF tokens
3. **Authentication**: Use httpOnly cookies or secure token storage
4. **API Keys**: Never commit API keys (use .env, keep .env in .gitignore)

### Current Placeholder Security
- Mock authentication (no real password validation)
- No rate limiting
- No input validation beyond basic form validation

---

## Database Schema Recommendations

### Core Entities (to be implemented in backend)

1. **Users**
   - id, email, name, password_hash
   - organization_id (foreign key)
   - role (solo, member, admin)
   - created_at, updated_at

2. **Organizations**
   - id, name, subscription_plan
   - settings (JSON)

3. **Meetings**
   - id, title, user_id, organization_id
   - audio_url, transcription_text
   - ai_summary, action_items (JSON)
   - date, duration, created_at

4. **Templates**
   - id, name, description
   - sections (JSON), is_custom
   - user_id (null for default templates)

5. **Integrations**
   - user_id, provider (microsoft, google)
   - access_token, refresh_token
   - expires_at

---

## Deployment

### Build Output
- Run: `npm run build`
- Output: `dist/` folder
- Contains: Optimized HTML, CSS, JS, and assets

### Hosting Recommendations
- **Static Hosting**: Vercel, Netlify, AWS S3 + CloudFront
- **SPA Routing**: Configure server to redirect all routes to `index.html`

### Environment Variables for Production
```
VITE_API_URL=https://api.notably.no
VITE_APP_ENV=production
```

---

## Known Issues & Limitations

### Current Mock Limitations
1. No real authentication/authorization
2. Data doesn't persist (localStorage only)
3. No real-time updates
4. No file uploads (audio files for meetings)
5. Calendar integrations are UI-only

### Cleanup Required
See [CLEANUP_REPORT.md](CLEANUP_REPORT.md) for:
- ~2,800 lines of unused code
- Duplicate files
- Unused components

---

## API Endpoints to Implement

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/me
```

### Meetings
```
GET    /api/meetings
POST   /api/meetings
GET    /api/meetings/:id
PUT    /api/meetings/:id
DELETE /api/meetings/:id
POST   /api/meetings/:id/upload-audio
GET    /api/meetings/:id/transcription
```

### Templates
```
GET    /api/templates
POST   /api/templates
GET    /api/templates/:id
PUT    /api/templates/:id
DELETE /api/templates/:id
```

### Organizations (Admin)
```
GET    /api/organizations/:id
PUT    /api/organizations/:id
GET    /api/organizations/:id/members
POST   /api/organizations/:id/invite
```

### Calendar Integrations
```
GET    /api/integrations/calendar
POST   /api/integrations/microsoft/connect
POST   /api/integrations/google/connect
DELETE /api/integrations/:provider
```

---

## Questions for Backend Developer?

If you have questions about:
- Specific component behavior
- Data flow and state management
- Expected API responses
- Authentication requirements

Reference the code directly or create issues in the repository.

---

## Next Steps for Backend Integration

### Week 1: Setup
1. Review this document and CLEANUP_REPORT.md
2. Set up backend project (Node.js/Python/Go/etc.)
3. Design database schema
4. Create base API structure

### Week 2-3: Core APIs
1. Implement authentication system
2. Create meeting CRUD endpoints
3. Create template endpoints
4. Set up file storage for audio files

### Week 4: Integration
1. Replace mock data with API calls in frontend
2. Test authentication flow
3. Test data persistence
4. Deploy to staging environment

---

**Last Updated:** January 12, 2026
**Maintained By:** Claude Code Analysis
**For Questions:** Contact project maintainer

---

## Quick Reference Card

| Task | Command |
|------|---------|
| Start dev server | `npm run dev` |
| Build production | `npm run build` |
| Run tests | `npm test` |
| Lint code | `npm run lint` |
| Preview build | `npm run preview` |

| Framework | Version |
|-----------|---------|
| React | 18.2.0 |
| TypeScript | 5.2.2 |
| Vite | 5.1.4 |
| Tailwind CSS | 3.4.1 |
| React Router | 6.22.2 |

| Path Alias | Maps To |
|------------|---------|
| `@/` | `src/` |

**Dev Server URL:** http://localhost:5173
**TypeScript Config:** tsconfig.json
**Tailwind Config:** tailwind.config.js
**Vite Config:** vite.config.ts
