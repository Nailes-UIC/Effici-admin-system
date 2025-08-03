import MainLayout from '@/layouts/mainlayout';

interface Event {
  title: string;
  date: string;
  createdBy: 'student' | 'admin_assistant' | 'dean';
}

interface Announcement {
  title: string;
  date: string;
  description: string;
  createdBy: 'admin_assistant' | 'dean' | 'student';
}

interface AdminDashboardProps {
  events?: Event[]; // Optional now
  announcements?: Announcement[]; // Optional now
}

export default function AdminDashboard({ events = [], announcements = [] }: AdminDashboardProps) {
  const filteredAnnouncements = announcements.filter(
    (a) => a.createdBy === 'admin_assistant' || a.createdBy === 'dean'
  );

  return (
    <MainLayout>
      <div className="p-4 space-y-6 font-poppins">
        {/* Header Image */}
        <div className="rounded-2xl overflow-hidden shadow">
          <div className="relative">
            <img
              src="/images/uic-bg.png"
              alt="UIC Building"
              className="w-full h-72 object-cover"
            />
            <div className="absolute inset-0 bg-white/40 backdrop-blur-sm flex flex-col items-center justify-center px-4 space-y-2">
              <img
                src="/images/uic-logo.png"
                alt="UIC Logo"
                className="w-16 h-16 md:w-20 md:h-20 object-contain"
              />
              <h1 className="text-3xl md:text-5xl font-bold text-white text-center drop-shadow">
                University of the Immaculate Conception
              </h1>
            </div>
          </div>
        </div>

        {/* Events & Announcements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Events */}
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-red-600">Events</h2>
              <a href="#" className="text-sm text-red-500 hover:underline">
                View All
              </a>
            </div>
            <div className="space-y-3 text-sm">
              {events.length > 0 ? (
                events.map((event, index) => (
                  <div key={index}>
                    <div className="font-semibold">📅 {event.title}</div>
                    <div className="text-gray-500">{event.date}</div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No events available.</p>
              )}
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-red-600">Announcements</h2>
              <a href="#" className="text-sm text-red-500 hover:underline">
                View All
              </a>
            </div>
            <div className="space-y-4 text-sm">
              {filteredAnnouncements.length > 0 ? (
                filteredAnnouncements.map((a, index) => (
                  <div key={index}>
                    <div className="font-bold">📢 {a.title}</div>
                    <div className="text-xs text-gray-500">{a.date}</div>
                    <p>{a.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No announcements available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
