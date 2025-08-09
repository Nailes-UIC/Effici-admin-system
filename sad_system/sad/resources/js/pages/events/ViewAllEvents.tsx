// resources/js/Pages/Events/ViewAllEvents.tsx

import MainLayout from '@/layouts/mainlayout';
import { FaCalendarAlt } from 'react-icons/fa';
import CommentSection from '@/components/CommentSection';
import { useState } from 'react';

interface Event {
  title: string;
  date: string;
  createdBy: 'student' | 'admin_assistant' | 'dean';
}

interface Props {
  events: Event[];
}

interface Comment {
  text: string;
  author: string;
  date: string;
}

export default function ViewAllEvents({ events }: Props) {
  const [comments, setComments] = useState<Record<number, Comment[]>>({});

  const addComment = (eventIndex: number, text: string) => {
    const newComment = {
      text,
      author: 'You',
      date: new Date().toLocaleString(),
    };

    setComments((prev) => ({
      ...prev,
      [eventIndex]: [...(prev[eventIndex] || []), newComment],
    }));
  };

  return (
    <MainLayout>
      <div className="p-6 font-poppins space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600">All Events</h1>
          <p className="text-gray-500">Explore upcoming activities and programs</p>
        </div>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <FaCalendarAlt className="text-red-500" /> Events List
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {events.length > 0 ? (
              events.map((event, index) => (
                <div
                  key={index}
                  className="bg-white shadow rounded-xl p-5 border hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full uppercase tracking-wide">
                      {event.createdBy}
                    </span>
                    <span className="text-xs text-gray-400">{event.date}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>

                  <CommentSection
                    comments={comments[index] || []}
                    onAddComment={(text) => addComment(index, text)}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No events available.</p>
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
