import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from '@/contexts/AuthContext';
import { FolderProvider } from '@/contexts/FolderContext';
import { AdminProvider } from '@/contexts/AdminContext';
import { DemoUserProvider } from '@/contexts/DemoUserContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import ProtectedAdminRoute from '@/components/admin/ProtectedAdminRoute';
import ScrollToTop from '@/components/ScrollToTop';
import UsersPage from '@/pages/admin/UsersPage';
import AnalyticsDashboard from '@/pages/admin/AnalyticsDashboard';
import OrganizationsPage from '@/pages/admin/OrganizationsPage';
import OrganizationDetailsPage from '@/pages/admin/OrganizationDetailsPage';
import RootLayout from './layouts/RootLayout';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import MeetingDetailsPage from './pages/MeetingDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import EnterprisePage from './pages/EnterprisePage';
import HowItWorksPage from './pages/HowItWorksPage';
import AboutPage from './pages/AboutPage';
import SettingsPage from './pages/settings/SettingsPage';
import DocsPage from './pages/DocsPage';
import ContactPage from './pages/ContactPage';
import TemplatesPage from './pages/TemplatesPage';
import SupportPage from './pages/SupportPage';
import HelpPage from './pages/HelpPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import OnboardingPage from './pages/OnboardingPage';

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Onboarding route - uses its own layout */}
        <Route path="/onboarding" element={<OnboardingPage />} />

        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="admin" element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          } />
          <Route path="admin/users" element={
            <ProtectedAdminRoute>
              <UsersPage />
            </ProtectedAdminRoute>
          } />
          <Route path="admin/organizations" element={
            <ProtectedAdminRoute>
              <OrganizationsPage />
            </ProtectedAdminRoute>
          } />
          <Route path="admin/organizations/:id" element={
            <ProtectedAdminRoute>
              <OrganizationDetailsPage />
            </ProtectedAdminRoute>
          } />
          <Route path="admin/analytics" element={
            <ProtectedAdminRoute>
              <AnalyticsDashboard />
            </ProtectedAdminRoute>
          } />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="meetings/:id" element={<MeetingDetailsPage />} />
          <Route path="settings" element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="features" element={<FeaturesPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="enterprise" element={<EnterprisePage />} />
          <Route path="how-it-works" element={<HowItWorksPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="docs" element={<DocsPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="organization" element={<Navigate to="/settings?tab=team" replace />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="help" element={<HelpPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="terms" element={<TermsPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <FolderProvider>
          <AdminProvider>
            <DemoUserProvider>
              <ScrollToTop />
              <AppRoutes />
            </DemoUserProvider>
          </AdminProvider>
        </FolderProvider>
      </AuthProvider>
    </Router>
  );
}
