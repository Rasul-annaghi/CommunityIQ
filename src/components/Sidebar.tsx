import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Sparkles, MapPin, Settings, Calendar, ClipboardList, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Sidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Member Quiz', icon: ClipboardList, path: '/quiz' },
    { name: 'Recommendations', icon: Sparkles, path: '/recommendations' },
    { name: 'Venues', icon: MapPin, path: '/venues' },
    { name: 'Community Insights', icon: Users, path: '/insights' },
    { name: 'History', icon: Calendar, path: '/history' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold">
          CQ
        </div>
        <span className="text-xl font-semibold text-gray-900 tracking-tight">CommunityIQ</span>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-medium text-emerald-700">
            {user?.email?.charAt(0).toUpperCase() ?? '?'}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-medium text-gray-900 truncate">{user?.email ?? 'Member'}</span>
            <span className="text-xs text-gray-500">CommunityIQ</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
