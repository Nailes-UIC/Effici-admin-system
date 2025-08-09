import React from "react";
import MainLayout from "@/layouts/mainlayout";
import { FaSearch, FaFilter, FaEye, FaTimes, FaTrash } from "react-icons/fa";

export default function ActivityLog() {
  const requests = [
    {
      type: "Activity Request",
      date: "April 1, 2025, 2:00 P.M.",
      status: "Approved",
    },
    {
      type: "Equipment Request",
      date: "March 28, 2025, 11:00 A.M.",
      status: "Pending",
    },
  ];

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      Approved: "bg-green-100 text-green-700",
      Pending: "bg-yellow-100 text-yellow-700",
      Cancelled: "bg-red-100 text-red-700",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          colors[status] || "bg-gray-100 text-gray-700"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <MainLayout>
      <div className="p-6 font-poppins text-black">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Activity Log</h1>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-3 mb-4">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search request..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-black"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg px-4 py-2 text-black">
            <FaFilter /> Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg shadow-sm bg-white border border-gray-200">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-left text-black border-b border-gray-200">
                <th className="px-6 py-3 font-medium">Request Type</th>
                <th className="px-6 py-3 font-medium">Date & Time</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, idx) => (
                <tr
                  key={idx}
                  className="border-t border-gray-200 hover:bg-gray-50 transition-colors text-black"
                >
                  <td className="px-6 py-3">{req.type}</td>
                  <td className="px-6 py-3">{req.date}</td>
                  <td className="px-6 py-3">{getStatusBadge(req.status)}</td>
                  <td className="px-6 py-3 flex gap-2">
                    <button className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm">
                      <FaEye /> View
                    </button>
                    <button className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm">
                      <FaTimes /> Cancel
                    </button>
                    <button className="p-2 text-gray-500 hover:text-red-600 rounded-lg border border-gray-300 hover:border-red-400">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-end items-center gap-2 p-4 text-black border-t border-gray-200">
            <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-100">
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg bg-blue-500 text-white text-sm">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-100">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-100">
              3
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-100">
              Next
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
