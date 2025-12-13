import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useAuth } from '@/contexts/AuthContext';
import PageTransition from '@/components/PageTransition';

export default function RootLayout() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      {user && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumbs />
        </div>
      )}
      <PageTransition>
        <Outlet />
      </PageTransition>
      <Footer />
    </div>
  );
}