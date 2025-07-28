import {
  FaHome,
  FaFileAlt,
  FaChartLine,
  FaLock,
  FaBook,
  FaEdit,
  FaSignOutAlt,
} from 'react-icons/fa';
import { usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import { ReactElement } from 'react';

type UserRole = 'student' | 'admin_assistant' | 'dean';

interface MenuItem {
  name: string;
  href: string;
  icon: ReactElement;
}

const menuItems: Record<UserRole, MenuItem[]> = {
  student: [
    { name: 'Home', href: '/student/dashboard', icon: <FaHome /> },
    { name: 'Activity Request', href: '/student/activity-request', icon: <FaFileAlt /> },
    { name: 'Borrow Equipment', href: '/student/borrow-equipment', icon: <FaLock /> },
    { name: 'Activity Log', href: '/student/activity-log', icon: <FaChartLine /> },
    { name: 'Revision', href: '/student/revision', icon: <FaBook /> },
    { name: 'Edit Document', href: '/student/edit-document', icon: <FaEdit /> },
  ],
  admin_assistant: [
    { name: 'Home', href: '/admin/dashboard', icon: <FaHome /> },
    { name: 'Request', href: '/admin/request', icon: <FaFileAlt /> },
    { name: 'Activity History', href: '/admin/activity-history', icon: <FaChartLine /> },
  ],
  dean: [
    { name: 'Home', href: '/dean/dashboard', icon: <FaHome /> },
    { name: 'Request', href: '/dean/request', icon: <FaFileAlt /> },
    { name: 'Activity History', href: '/dean/activity-history', icon: <FaChartLine /> },
  ],
};

export default function Sidebar() {
  const { auth, url } = usePage().props as any;
  const role = (auth?.user?.role ?? 'student') as UserRole;
  const links = menuItems[role] || [];

  const currentPath = url ?? '';

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    Inertia.post('/logout');
  };

  return (
    <aside className="w-64 h-screen bg-red-500 text-white flex flex-col justify-between shadow-lg overflow-hidden">
      {/* Header */}
      <div>
        <div className="flex items-center justify-center gap-2 px-4 py-6 border-b border-red-400">
          <img src="/images/logo.png" alt="EfficiAdmin Logo" className="w-6 h-6" />
          <div className="text-lg font-bold font-serif">EfficiAdmin</div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col px-4 py-4 space-y-10">
          {links.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                currentPath === item.href
                  ? 'bg-red-300 text-white'
                  : 'hover:bg-red-400'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="text-sm font-medium">{item.name}</span>
            </a>
          ))}
        </nav>
      </div>

      {/* Sign Out */}
      <div className="px-4 pb-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-400 transition"
        >
          <FaSignOutAlt className="text-base" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
