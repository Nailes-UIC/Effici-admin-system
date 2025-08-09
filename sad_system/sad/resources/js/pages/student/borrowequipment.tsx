import React from "react";
import MainLayout from "@/layouts/mainlayout";
import { Calendar, Tv, Speaker, Projector, Cable } from "lucide-react";

export default function BorrowEquipment() {
  return (
    <MainLayout>
      <div className="p-6 font-poppins text-black space-y-8">
        {/* Available Equipment */}
        <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Available Equipment</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-left border-b border-gray-200">
                <th className="p-3 font-medium">Equipment</th>
                <th className="p-3 font-medium">Description</th>
                <th className="p-3 font-medium">Quantity Available</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50 transition-colors border-b border-gray-200">
                <td className="p-3 flex items-center gap-2">
                  <Tv className="w-5 h-5 text-blue-500" /> TV
                </td>
                <td className="p-3">Smart TV for presentations</td>
                <td className="p-3">3</td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors border-b border-gray-200">
                <td className="p-3 flex items-center gap-2">
                  <Speaker className="w-5 h-5 text-green-500" /> Speaker
                </td>
                <td className="p-3">Portable speakers</td>
                <td className="p-3">5</td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors border-b border-gray-200">
                <td className="p-3 flex items-center gap-2">
                  <Projector className="w-5 h-5 text-purple-500" /> Projector
                </td>
                <td className="p-3">Full HD projector</td>
                <td className="p-3">2</td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-3 flex items-center gap-2">
                  <Cable className="w-5 h-5 text-yellow-500" /> HDMI Cable
                </td>
                <td className="p-3">2-meter cable</td>
                <td className="p-3">10</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Book Equipment */}
        <div className="bg-white shadow-sm rounded-lg p-6 space-y-4 border border-gray-200">
          <h2 className="text-lg font-semibold">Book Equipment</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400 outline-none">
              <option>TV</option>
              <option>Speaker</option>
              <option>Projector</option>
              <option>HDMI Cable</option>
            </select>

            <input
              type="number"
              placeholder="Quantity"
              className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <input
              type="text"
              placeholder="Purpose"
              className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-blue-400">
                <input type="datetime-local" className="w-full outline-none" />
                <Calendar size={18} className="ml-2 text-gray-500" />
              </div>
            </div>

            {/* End Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-blue-400">
                <input type="datetime-local" className="w-full outline-none" />
                <Calendar size={18} className="ml-2 text-gray-500" />
              </div>
            </div>
          </div>

          <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg w-full transition-colors">
            Book Equipment
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
