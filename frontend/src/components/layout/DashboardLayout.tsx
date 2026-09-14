import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Upload,
  Layout,
  LogOut,
  User,
  ChevronDown,
  FileText,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/resumes/upload', icon: Upload, label: 'Upload Resume' },
  { to: '/templates', icon: Layout, label: 'Templates' },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/auth?mode=login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950">
      {/* ── Sidebar ── */}
      <aside className="flex w-60 flex-shrink-0 flex-col border-r border-zinc-800 bg-zinc-950">
        {/* Logo */}
        <div className="flex h-14 items-center gap-2 border-b border-zinc-800 px-5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight text-zinc-100">NeatResume</span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-0.5 p-3">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600/10 text-indigo-400'
                    : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100'
                }`
              }
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-zinc-800 p-3">
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen((o) => !o)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-zinc-800/60"
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600/20 text-sm font-bold text-indigo-400">
                {user?.name?.charAt(0).toUpperCase() ?? 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-zinc-200">{user?.name}</p>
                <p className="truncate text-[11px] text-zinc-500">{user?.email}</p>
              </div>
              <ChevronDown
                className={`h-4 w-4 flex-shrink-0 text-zinc-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {userMenuOpen && (
              <div className="absolute bottom-full left-0 mb-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 py-1 shadow-xl">
                <button
                  onClick={() => { setUserMenuOpen(false); }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                >
                  <User className="h-4 w-4" />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-zinc-800 hover:text-red-300 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
