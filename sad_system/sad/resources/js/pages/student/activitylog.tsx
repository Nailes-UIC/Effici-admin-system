import React from 'react';
import MainLayout from '@/layouts/mainlayout';

export default function ActivityLog() {
  return (
    <MainLayout>
      <div className="p-4 font-poppins">
        <h1 className="text-2xl font-bold text-red-600">Activity Log</h1>
        <p>View the history of your activities here.</p>
      </div>
    </MainLayout>
  );
}
