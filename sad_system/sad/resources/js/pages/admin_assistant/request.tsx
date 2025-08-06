import React from 'react';
import MainLayout from '@/layouts/mainlayout';

export default function Request() {
  return (
    <MainLayout>
      <div className="p-4 font-poppins">
        <h1 className="text-2xl font-bold text-red-600">Request Management</h1>
        <p>Review and manage student activity requests.</p>
      </div>
    </MainLayout>
  );
}
