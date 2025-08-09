import React, { useState } from "react";
import MainLayout from "@/layouts/mainlayout";
import { FaCalendarAlt, FaPaperclip } from "react-icons/fa";

export default function ActivityRequest() {
  const [category, setCategory] = useState("Minor – For low-priority or informal requests");

  return (
    <MainLayout>
      <div className="p-6 font-poppins bg-gray-50 min-h-screen text-black">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Requests", value: 24, color: "text-red-500" },
            { label: "Pending", value: 8, color: "text-yellow-500" },
            { label: "Approved", value: 12, color: "text-green-500" },
            { label: "Rejected", value: 4, color: "text-red-500" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition-all text-center"
            >
              <div className="text-sm text-gray-500">{stat.label}</div>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Schedule Availability */}
          <div className="bg-white rounded-2xl p-4 shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Schedule Availability</h2>
              <button className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600">
                View Calendar
              </button>
            </div>
            <div className="text-sm text-gray-500 mb-2">May 2025</div>
            {/* Calendar */}
            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="font-semibold text-gray-700">{d}</div>
              ))}
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 2;
                if (day < 1 || day > 31) {
                  return <div key={i}></div>;
                }
                let event = "";
                if (day === 29) event = "Meeting";
                if (day === 1) event = "Workshop";
                return (
                  <div
                    key={i}
                    className={`relative p-2 rounded-lg border ${
                      event ? "bg-green-50 border-green-400" : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    {day}
                    {event && (
                      <div className="absolute text-[10px] left-1 right-1 bottom-1 bg-green-100 text-green-800 rounded px-1">
                        {event}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Request Categorization */}
          <div className="bg-white rounded-2xl p-4 shadow">
            <h2 className="font-semibold mb-2">Request Categorization</h2>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none bg-white text-black"
            >
              <option>Minor – Low-priority</option>
              <option>Normal – Standard process</option>
              <option>Urgent – Time sensitive</option>
            </select>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-6 mt-6 shadow">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Activity Name</label>
              <input
                type="text"
                placeholder="Enter Activity name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Activity Purpose</label>
              <textarea
                placeholder="Describe the purpose of your activity"
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none text-black"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Activity Date & Time</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                <FaCalendarAlt className="text-gray-500 mr-2" />
                <input
                  type="datetime-local"
                  className="flex-1 outline-none bg-white text-black"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Attachments</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50">
                <FaPaperclip className="mx-auto text-gray-500 text-xl mb-2" />
                <p className="text-sm text-gray-500">Drag and drop files here or</p>
                <button className="text-red-500 font-medium hover:underline">
                  Browse Files
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button className="bg-red-500 text-black px-6 py-2 rounded-lg hover:bg-red-600 shadow">
              Submit Request
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
