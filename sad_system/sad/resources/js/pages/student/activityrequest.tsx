import React from 'react';
import MainLayout from '@/layouts/mainlayout';

export default function ActivityRequest() {
  return (
    <MainLayout>
      <div className="p-4 font-poppins">
        <h1 className="text-2xl font-bold text-red-600">Activity Request</h1>
        <p>Here you can request new activities.</p>
      </div>
    </MainLayout>
  );
}
