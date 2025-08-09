import Sidebar from '@/components/sidebar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar stays fixed */}
      <Sidebar />
      
      {/* Main content area shifted right */}
      <main className="flex-1 bg-gray-100 p-6 ml-64">
        {children}
      </main>
    </div>
  )
}
