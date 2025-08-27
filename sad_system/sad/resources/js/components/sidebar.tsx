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
import { usePage, Link } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import { ReactElement, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    { name: 'Request Tracking', href: '/student/request-tracking', icon: <FaEdit /> },
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
    <>
      <aside className="w-64 h-screen bg-gradient-to-b from-[#e6232a] via-[#c91c24] to-[#8a1a1a] text-white flex flex-col justify-between shadow-2xl font-[Poppins] overflow-hidden fixed left-0 top-0 transition-all duration-300">
        {/* Header */}
        <div>
          <div className="flex items-center justify-center gap-3 px-6 py-7 border-b border-[#e6232a] bg-white/10">
            <img src="/images/logo.png" alt="EfficiAdmin Logo" className="w-8 h-8 object-contain drop-shadow-lg" />
            <span className="text-2xl font-extrabold tracking-wide leading-none">EfficiAdmin</span>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col px-4 pt-8 space-y-5"> {/* Increased space-y from 3 to 5 */}
            {menuItems[role]?.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                preserveState={false}
                className={`flex items-center gap-3 px-5 py-3 rounded-lg transition-all duration-200 ease-in-out font-medium
  ${currentPath === item.href
    ? 'bg-white/30 text-white shadow-lg border-l-4 border-white scale-[1.05] font-bold'
    : 'hover:bg-white/20 hover:scale-[1.03] hover:shadow-md'
                }`}
              >
                <span className={`text-lg ${currentPath === item.href ? 'drop-shadow' : ''}`}>{item.icon}</span>
                <span className="text-base">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Profile Dropdown */}
        <div className="relative px-4 py-7" ref={dropdownRef}>
          <div
            className="flex items-center justify-between bg-white text-black rounded-xl p-2 cursor-pointer shadow-lg hover:shadow-xl transition"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            <div className="flex items-center gap-3">
              <img
                src="/images/profile.png"
                alt="Profile"
                className="w-11 h-11 rounded-full object-cover border-2 border-[#e6232a]"
              />
              <div>
                <p className="text-base font-semibold leading-tight">{user.first_name}</p>
                <p className="text-xs opacity-80 capitalize">{user.role.replace('_', ' ')}</p>
              </div>
            </div>
            <FaChevronDown className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Dropdown Menu with motion and gap */}
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.18 }}
                className="absolute bottom-[90px] left-1/2 -translate-x-1/2 w-52 bg-white text-black rounded-xl shadow-2xl z-50 text-base overflow-hidden border border-gray-200"
              >
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-5 py-3 hover:bg-gray-100 transition"
                >
                  <FaUser className="text-sm" />
                  <span>Profile</span>
                </Link>
                <hr className="border-t border-gray-200 my-1" />
                <button
                  className="flex w-full items-center gap-2 px-5 py-3 hover:bg-red-50 transition"
                  onClick={() => {
                    setShowConfirm(true);
                    setDropdownOpen(false);
                  }}
                >
                  <FaSignOutAlt className="text-sm text-red-500" />
                  <span className="text-red-500 font-semibold">Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[99999] animate-fade-in">
          <div className="bg-white text-black p-7 rounded-xl shadow-2xl w-[90%] max-w-sm relative">
            <h2 className="text-xl font-bold mb-2">Logout Confirmation</h2>
            <p className="text-base mb-4">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-5 py-2 text-base rounded bg-gray-200 hover:bg-gray-300 transition"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 text-base rounded bg-red-500 text-white hover:bg-red-600 transition font-semibold"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
