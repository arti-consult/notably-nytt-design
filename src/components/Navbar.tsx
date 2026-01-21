import { Link, useLocation } from 'react-router-dom';
import { LogOut, User, Settings, Shield, LayoutDashboard, HelpCircle, Users, UserCircle } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { useDemoUser, DemoUserMode, mockDemoUsers } from '@/contexts/DemoUserContext';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isAdmin } = useAdmin();
  const { mode, setMode, isSolo, isMember, isAdmin: isDemoAdmin } = useDemoUser();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();

  const isActiveLink = (path: string) => location.pathname === path;

  return (
    <nav className="fixed w-full z-50 glass-nav">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <Link to={user ? "/dashboard" : "/"} className="flex items-center">
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
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className={cn(
                    "text-sm font-medium transition-all duration-200 flex items-center space-x-2 px-4 py-2 rounded-xl",
                    isActiveLink('/dashboard')
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/help"
                  className={cn(
                    "text-sm font-medium transition-all duration-200 flex items-center space-x-2 px-4 py-2 rounded-xl",
                    isActiveLink('/help')
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <HelpCircle className="h-4 w-4" />
                  <span>Hjelp</span>
                </Link>
              </>
            )}
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
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                  {/* Demo user mode selector */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="text-xs text-gray-500 mb-2">Visningsmodus</div>

                    {/* Segmented control */}
                    <div className="flex rounded-lg bg-gray-100 p-1">
                      <button
                        onClick={() => setMode('solo')}
                        className={cn(
                          "flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all",
                          mode === 'solo'
                            ? "bg-emerald-500 text-white shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        )}
                      >
                        Solo
                      </button>
                      <button
                        onClick={() => setMode('member')}
                        className={cn(
                          "flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all",
                          mode === 'member'
                            ? "bg-amber-500 text-white shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        )}
                      >
                        Medlem
                      </button>
                      <button
                        onClick={() => setMode('admin')}
                        className={cn(
                          "flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all",
                          mode === 'admin'
                            ? "bg-blue-500 text-white shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        )}
                      >
                        Admin
                      </button>
                    </div>

                    {/* Current mode info */}
                    <div className={cn(
                      "mt-2 px-3 py-2 rounded-lg text-xs",
                      mode === 'solo' && "bg-emerald-50 text-emerald-700",
                      mode === 'member' && "bg-amber-50 text-amber-700",
                      mode === 'admin' && "bg-blue-50 text-blue-700"
                    )}>
                      <div className="flex items-center space-x-2">
                        {mode === 'solo' && <UserCircle className="h-4 w-4" />}
                        {mode === 'member' && <Users className="h-4 w-4" />}
                        {mode === 'admin' && <Shield className="h-4 w-4" />}
                        <span className="font-medium">{mockDemoUsers[mode].name}</span>
                      </div>
                      <div className="mt-0.5 text-[10px] opacity-75">
                        {mode === 'solo' && 'Individuell konto'}
                        {mode === 'member' && 'Teammedlem'}
                        {mode === 'admin' && 'Administrator'}
                      </div>
                    </div>
                  </div>
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
                      className="flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
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
                        to="/onboarding"
                        className="flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
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