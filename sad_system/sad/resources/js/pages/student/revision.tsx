import React from 'react';
import MainLayout from '@/layouts/mainlayout';

export default function Revision() {
  return (
    <MainLayout>
      <div className="p-4 font-poppins">
        <h1 className="text-2xl font-bold text-red-600">Revision</h1>
        <p>Submit revisions for your requests.</p>
      </div>
    </MainLayout>
  );
}
