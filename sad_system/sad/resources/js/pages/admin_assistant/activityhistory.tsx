import React from 'react';
import MainLayout from '@/layouts/mainlayout';

export default function ActivityHistory() {
  return (
    <MainLayout>
      <div className="p-4 font-poppins">
        <h1 className="text-2xl font-bold text-red-600">Activity History</h1>
        <p>Track and view all processed activities.</p>
      </div>
    </MainLayout>
  );
}
