import React from 'react';
import MainLayout from '@/layouts/mainlayout'; // ✅ import your main layout

export default function BorrowEquipment() {
  return (
    <MainLayout>
      <div className="p-4 font-poppins">
        <h1 className="text-2xl font-bold text-red-600">Borrow Equipment</h1>
        <p>Manage your borrowed equipment here.</p>
      </div>
    </MainLayout>
  );
}
