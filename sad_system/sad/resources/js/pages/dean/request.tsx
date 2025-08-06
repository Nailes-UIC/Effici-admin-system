import React from 'react';
import MainLayout from '@/layouts/mainlayout';

export default function Request() {
  return (
    <MainLayout>
      <div className="p-4 font-poppins">
        <h1 className="text-2xl font-bold text-red-600">Dean Request View</h1>
        <p>Approve or reject activity requests submitted by students.</p>
      </div>
    </MainLayout>
  );
}
