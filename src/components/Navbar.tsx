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
                <Link to="/features" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Funksjoner
                </Link>
                <Link to="/pricing" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Priser
                </Link>
                <Link to="/enterprise" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Enterprise
                </Link>
                <Link to="/how-it-works" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Se hvordan
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className={cn(
                    "text-sm font-medium transition-colors flex items-center space-x-1.5",
                    isActiveLink('/dashboard')
                      ? "text-violet-600 dark:text-violet-400"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/support"
                  className={cn(
                    "text-sm font-medium transition-colors flex items-center space-x-1.5",
                    isActiveLink('/support')
                      ? "text-violet-600 dark:text-violet-400"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
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
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full flex items-center"
              >
                <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                  {/* Demo user mode selector */}
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Visningsmodus</div>

                    {/* Segmented control */}
                    <div className="flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
                      <button
                        onClick={() => setMode('solo')}
                        className={cn(
                          "flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all",
                          mode === 'solo'
                            ? "bg-emerald-500 text-white shadow-sm"
                            : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
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
                            : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        )}
                      >
                        Medlem
                      </button>
                      <button
                        onClick={() => setMode('admin')}
                        className={cn(
                          "flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all",
                          mode === 'admin'
                            ? "bg-violet-500 text-white shadow-sm"
                            : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        )}
                      >
                        Admin
                      </button>
                    </div>

                    {/* Current mode info */}
                    <div className={cn(
                      "mt-2 px-3 py-2 rounded-lg text-xs",
                      mode === 'solo' && "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
                      mode === 'member' && "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
                      mode === 'admin' && "bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
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
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Innstillinger
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center px-4 py-2 text-sm text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30"
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
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logg ut
                    </button>
                  )}
                  {!user && (
                    <>
                      <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                      <Link
                        to="/login"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Logg inn
                      </Link>
                      <Link
                        to="/register"
                        className="flex items-center px-4 py-2 text-sm text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30"
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