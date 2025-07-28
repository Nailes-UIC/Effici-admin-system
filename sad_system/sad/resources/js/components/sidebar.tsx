import { usePage } from '@inertiajs/react'

type UserRole = 'student' | 'admin_assistant' | 'dean'
type MenuItem = { name: string; href: string }

const menuItems: Record<UserRole, MenuItem[]> = {
  student: [
    { name: 'Dashboard', href: '/student/dashboard' },
    { name: 'Courses', href: '/student/courses' },
  ],
  admin_assistant: [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'User Management', href: '/admin/users' },
  ],
  dean: [
    { name: 'Dashboard', href: '/dean/dashboard' },
    { name: 'Reports', href: '/dean/reports' },
  ],
}

export default function Sidebar() {
  const { auth } = usePage().props as any
  const role = (auth?.user?.role ?? 'student') as UserRole

  const links = menuItems[role] || []

  return (
    <aside className="w-64 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Sidebar</h2>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} className="hover:text-gray-300">{link.name}</a>
          </li>
        ))}
      </ul>
    </aside>
  )
}
