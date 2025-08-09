import {
  FaHome,
  FaFileAlt,
  FaChartLine,
  FaLock,
  FaBook,
  FaEdit,
  FaSignOutAlt,
  FaUser,
  FaChevronDown,
} from 'react-icons/fa';
import { usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import { ReactElement, useState, useRef, useEffect } from 'react';

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
  const user = auth?.user ?? { first_name: 'Guest', role: 'student' };
  const currentPath = url ?? '';

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    setShowConfirm(false);
    Inertia.post('/logout');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !(dropdownRef.current as any).contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <aside className="w-64 h-screen bg-[#e6232a] text-white flex flex-col justify-between shadow-lg font-[Poppins] overflow-hidden fixed left-0 top-0">
      {/* Header */}
      <div>
        <div className="flex items-center justify-center gap-3 px-4 py-6 border-b border-[#e6232a]">
          <img src="/images/logo.png" alt="EfficiAdmin Logo" className="w-7 h-7 object-contain" />
          <span className="text-xl font-bold tracking-wide leading-none">EfficiAdmin</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col px-4 pt-6 space-y-10">
          {menuItems[role]?.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out ${
                currentPath === item.href
                  ? 'bg-white/20 text-white shadow-inner'
                  : 'hover:bg-white/10'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="text-sm font-medium">{item.name}</span>
            </a>
          ))}
        </nav>
      </div>

      {/* Profile Dropdown */}
      <div className="relative px-4 py-6" ref={dropdownRef}>
        <div
          className="flex items-center justify-between bg-white text-black rounded-xl p-2 cursor-pointer shadow-md"
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          <div className="flex items-center gap-3">
            <img
              src="/images/profile.png"
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold leading-tight">{user.first_name}</p>
              <p className="text-xs opacity-80 capitalize">{user.role.replace('_', ' ')}</p>
            </div>
          </div>
          <FaChevronDown className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </div>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-48 bg-white text-black rounded-xl shadow-md z-50 text-sm overflow-hidden">
            <a
              href="/profile"
              className="flex items-center gap-2 px-4 py-2 hover:bg-black/10 transition"
            >
              <FaUser className="text-xs" />
              <span>Profile</span>
            </a>
            <button
              className="flex w-full items-center gap-2 px-4 py-2 hover:bg-black/10 transition"
              onClick={() => {
                setShowConfirm(true);
                setDropdownOpen(false);
              }}
            >
              <FaSignOutAlt className="text-xs" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[9999]">
          <div className="bg-white text-black p-6 rounded-xl shadow-lg w-[90%] max-w-sm">
            <h2 className="text-lg font-bold mb-2">Logout Confirmation</h2>
            <p className="text-sm mb-4">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-1.5 text-sm rounded bg-gray-200 hover:bg-gray-300 transition"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1.5 text-sm rounded bg-red-500 text-white hover:bg-red-600 transition"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
