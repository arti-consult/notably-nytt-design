import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  HardDrive,
  Settings,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdmin } from '@/contexts/AdminContext';

interface NavItem {
  icon: typeof LayoutDashboard;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    href: '/admin'
  },
  {
    icon: Users,
    label: 'Users',
    href: '/admin/users'
  },
  {
    icon: HardDrive,
    label: 'Content',
    href: '/admin/content'
  },
  {
    icon: Settings,
    label: 'Settings',
    href: '/admin/settings'
  }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isAdmin } = useAdmin();
  const location = useLocation();

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Sidebar */}
      <div className={cn(
        "fixed top-16 bottom-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out transform",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-lg",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-lg bg-white shadow-md hover:bg-gray-50"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Main content */}
      <div className={cn(
        "transition-all duration-200",
        isSidebarOpen ? "lg:pl-64" : "lg:pl-0"
      )}>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}