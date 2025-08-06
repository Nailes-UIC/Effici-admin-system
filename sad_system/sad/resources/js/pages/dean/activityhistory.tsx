import React from 'react';
import MainLayout from '@/layouts/mainlayout';

export default function ActivityHistory() {
  return (
    <MainLayout>
      <div className="p-4 font-poppins">
        <h1 className="text-2xl font-bold text-red-600">Dean Activity History</h1>
        <p>Overview of previously handled requests and activities.</p>
      </div>
    </MainLayout>
  );
}
