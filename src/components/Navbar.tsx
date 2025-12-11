import { Link } from 'react-router-dom';
import { LogOut, User, Settings, Shield } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isAdmin } = useAdmin();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="fixed w-full z-50 glass-nav">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center">
            <img src="/notably-logo.png" alt="Notably" className="h-8" />
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {!user ? (
              <>
                <Link to="/features" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  Funksjoner
                </Link>
                <Link to="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  Priser
                </Link>
                <Link to="/enterprise" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  Enterprise
                </Link>
                <Link to="/how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  Se hvordan
                </Link>
              </>
            ) : null}
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-2 hover:bg-gray-100 rounded-full flex items-center"
              >
                <User className="h-5 w-5 text-gray-600" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Innstillinger
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center px-4 py-2 text-sm text-violet-600 hover:bg-violet-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Admin Panel
                    </Link>
                  )}
                  {user && (
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logg ut
                    </button>
                  )}
                  {!user && (
                    <>
                      <div className="border-t border-gray-200 my-1" />
                      <Link
                        to="/login"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Logg inn
                      </Link>
                      <Link
                        to="/register"
                        className="flex items-center px-4 py-2 text-sm text-violet-600 hover:bg-violet-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Prøv gratis
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}