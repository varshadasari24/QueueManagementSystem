import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Bell,
  Home,
  ListTodo,
  LogOut,
  PlusCircle,
  Settings,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: Home },
  { to: '/dashboard/my-queues', label: 'My Queues', icon: ListTodo },
  { to: '/dashboard/create-queue', label: 'Create Queue', icon: PlusCircle },
  { to: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
];

function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('qms-token');
    localStorage.removeItem('qms-manager');
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 lg:flex-row lg:p-6">
        <aside className="w-full rounded-[28px] border border-slate-200 bg-white/80 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm lg:max-w-[260px] lg:p-5">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600">
                QueueFlow
              </p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900">Operations</h1>
            </div>
            <button
              type="button"
              className="rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
            </button>
          </div>

          <nav aria-label="Sidebar navigation" className="space-y-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </aside>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
