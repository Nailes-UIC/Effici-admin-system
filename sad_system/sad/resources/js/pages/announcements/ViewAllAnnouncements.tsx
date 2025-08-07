// resources/js/Pages/Announcements/ViewAllAnnouncements.tsx

import MainLayout from '@/layouts/mainlayout';
import { FaBullhorn } from 'react-icons/fa';

interface Announcement {
  title: string;
  date: string;
  description: string;
  createdBy: 'admin_assistant' | 'dean' | 'student';
}

interface Props {
  announcements: Announcement[];
}

export default function ViewAllAnnouncements({ announcements }: Props) {
  const filtered = announcements.filter(
    (a) => a.createdBy === 'admin_assistant' || a.createdBy === 'dean'
  );

  return (
    <MainLayout>
      <div className="p-6 font-poppins space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600">All Announcements</h1>
          <p className="text-gray-500">Catch up on the latest news and notices</p>
        </div>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <FaBullhorn className="text-red-500" /> Announcement Board
          </h2>
          <div className="space-y-4">
            {filtered.length > 0 ? (
              filtered.map((a, index) => (
                <div
                  key={index}
                  className="bg-white p-5 border rounded-xl shadow hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full uppercase tracking-wide">
                      {a.createdBy}
                    </span>
                    <span className="text-xs text-gray-400">{a.date}</span>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">{a.title}</h3>
                  <p className="text-sm text-gray-600">{a.description}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No announcements posted.</p>
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
