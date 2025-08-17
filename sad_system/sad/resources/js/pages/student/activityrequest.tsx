import React, { useState } from "react";
import MainLayout from "@/layouts/mainlayout";
import { FaChevronLeft, FaChevronRight, FaPaperclip } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker-theme.css"; // custom theme file
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';


type RequestStatus = "pending" | "under_review" | "approved" | "completed";

interface ActivityRequestItem {
  id: number;
  name: string;
  purpose: string;
  status: RequestStatus;
  startDateTime?: Date | null;
  endDateTime?: Date | null;
  category: string;
  files?: File[];
}

interface BookedActivity {
  date: string;
  name: string;
  isFullDay?: boolean;
  timeSlots?: string[];
}

export default function ActivityRequest({ auth }: { auth: any }) {
  const user = auth.user; // comes from Laravel Inertia
  const [category, setCategory] = useState("minor");
  const [requests, setRequests] = useState<ActivityRequestItem[]>([]);
  const [activityName, setActivityName] = useState("");
  const [activityPurpose, setActivityPurpose] = useState("");
  const [startDateTime, setStartDateTime] = useState<Date | null>(null);
  const [endDateTime, setEndDateTime] = useState<Date | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [notification, setNotification] = useState<{ type: "error" | "success"; message: string } | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookedActivities, setBookedActivities] = useState<BookedActivity[]>([]);
   const requestsByWeek = [
  { week: 'Week 1', count: requests.filter(r => r.startDateTime && new Date(r.startDateTime).getDate() <= 7).length },
  { week: 'Week 2', count: requests.filter(r => r.startDateTime && new Date(r.startDateTime).getDate() <= 14 && new Date(r.startDateTime).getDate() > 7).length },
  { week: 'Week 3', count: requests.filter(r => r.startDateTime && new Date(r.startDateTime).getDate() <= 21 && new Date(r.startDateTime).getDate() > 14).length },
  { week: 'Week 4', count: requests.filter(r => r.startDateTime && new Date(r.startDateTime).getDate() > 21).length },
];
  // Stats
  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    underReview: requests.filter((r) => r.status === "under_review").length,
    completed: requests.filter((r) => r.status === "completed").length,
  };

  // Calendar helpers
  const getCalendarInfo = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return {
      year,
      month,
      daysInMonth: lastDay.getDate(),
      startingDayOfWeek: firstDay.getDay(),
      monthName: firstDay.toLocaleString("default", { month: "long", year: "numeric" }),
    };


  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      direction === "prev"
        ? newDate.setMonth(prev.getMonth() - 1)
        : newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const getDayStatus = (day: number) => {
    const { year, month } = getCalendarInfo();
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayBooking = bookedActivities.find((a) => a.date === dateStr);
    if (!dayBooking) return { status: "Available", className: "bg-green-50 border-green-200 text-green-800" };
    if (dayBooking.isFullDay || (dayBooking.timeSlots && dayBooking.timeSlots.length >= 3)) {
      return { status: "Unavailable", className: "bg-red-50 border-red-200 text-red-800" };
    }
    return { status: "Ongoing", className: "bg-yellow-50 border-yellow-200 text-yellow-800" };
  };

  const getDayActivity = (day: number) => {
    const { year, month } = getCalendarInfo();
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return bookedActivities.find((a) => a.date === dateStr)?.name || "";
  };

const triggerNotification = (type: "error" | "success", message: string) => {
  setNotification({ type, message });
  setShowNotification(true);

  setTimeout(() => {
    setShowNotification(false);
    setTimeout(() => setNotification(null), 300); // wait for animation to finish
  }, 3000);
};

const handleSubmit = () => {
  if (user.role !== "student") {
    triggerNotification("error", "Only students can submit activity requests.");
    return;
  }
  if (!activityName.trim() || !activityPurpose.trim() || !startDateTime || !endDateTime) {
    triggerNotification("error", "Please fill in all required fields.");
    return;
  }

  if (endDateTime < startDateTime) {
    triggerNotification("error", "End date/time cannot be earlier than start date/time.");
    return;
  }

  const newRequest: ActivityRequestItem = {
    id: Date.now(),
    name: activityName,
    purpose: activityPurpose,
    category,
    status: "pending",
    startDateTime,
    endDateTime,
    files: attachments,
  };

  setRequests((prev) => [...prev, newRequest]);

  // reset fields
  setActivityName("");
  setActivityPurpose("");
  setStartDateTime(null);
  setEndDateTime(null);
  setAttachments([]);

  triggerNotification("success", "Activity request submitted successfully!");
};


  // Update status
  const updateStatus = (id: number, newStatus: RequestStatus) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
  };

  const calendarInfo = getCalendarInfo();

  return (
    <MainLayout>
      {notification && (
  <div
    className={`fixed top-6 right-6 z-50 max-w-sm px-4 py-3 rounded-lg shadow-lg transition-all duration-500 transform ${
      showNotification
        ? "opacity-100 translate-y-0"
        : "opacity-0 -translate-y-4"
    } ${
      notification.type === "error"
        ? "bg-red-500 text-white"
        : "bg-green-500 text-white"
    }`}
  >
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium">{notification.message}</span>
      <button
        onClick={() => setShowNotification(false)}
        className="ml-3 text-white font-bold"
      >
        ×
      </button>
    </div>
  </div>
)}


      <div className="p-6 font-poppins min-h-screen text-black">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-black">Activity Request</h1>
          <p className="text-gray-600">Students can submit requests for activities.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Requests", value: stats.total, color: "text-red-500" },
            { label: "Pending", value: stats.pending, color: "text-yellow-500" },
            { label: "Approved", value: stats.approved, color: "text-green-500" },
            { label: "Under Review", value: stats.underReview, color: "text-blue-500" },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl shadow text-center">
              <div className="text-sm text-gray-500">{stat.label}</div>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Calendar + categorization */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Schedule Availability */}
          <div className="bg-white rounded-2xl p-4 shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Schedule Availability</h2>
              <button className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600">
                View Calendar
              </button>
            </div>
            {/* Month nav */}
            <div className="flex justify-between items-center mb-2">
              <button onClick={() => navigateMonth("prev")} className="p-1 hover:bg-gray-100 rounded">
                <FaChevronLeft className="text-gray-600" />
              </button>
              <div className="text-sm text-gray-500">{calendarInfo.monthName}</div>
              <button onClick={() => navigateMonth("next")} className="p-1 hover:bg-gray-100 rounded">
                <FaChevronRight className="text-gray-600" />
              </button>
            </div>
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="font-semibold text-gray-700 p-1">{d}</div>
              ))}
              {Array.from({ length: calendarInfo.startingDayOfWeek }, (_, i) => (
                <div key={`empty-${i}`} className="p-2"></div>
              ))}
              {Array.from({ length: calendarInfo.daysInMonth }, (_, i) => {
                const day = i + 1;
                const dayStatus = getDayStatus(day);
                const activity = getDayActivity(day);
                return (
                  <div
                    key={day}
                    className={`relative flex flex-col items-center justify-center p-2 rounded-lg border min-h-[60px] ${dayStatus.className}`}
                  >
                    <div className="font-medium text-lg">{day}</div>
                    {activity && (
                      <div className="absolute text-[9px] left-1 right-1 bottom-1 bg-white bg-opacity-80 rounded px-1">
                        {activity}
                      </div>
                    )}
                    <div className="absolute text-[8px] left-1 right-1 top-1 text-center">
                      {dayStatus.status}
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Legend */}
            <div className="mt-4 flex gap-4 text-xs font-bold">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-200 rounded"></div><span>Available</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-200 rounded"></div><span>Ongoing</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-200 rounded"></div><span>Unavailable</span>
              </div>
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
              <option value="minor">Minor – Low-priority</option>
              <option value="normal">Normal – Standard process</option>
              <option value="urgent">Urgent – Time sensitive</option>
            </select>
                <div className="bg-white rounded-2xl p-4 shadow mt-6">
  <h2 className="font-semibold mb-2">Requests by Week</h2>
  <ResponsiveContainer width="100%" height={120}>
    <LineChart data={requestsByWeek}>
      <XAxis dataKey="week" />
      <YAxis allowDecimals={false} />
      <Tooltip />
      <Line type="monotone" dataKey="count" stroke="#EF4444" strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
</div>

            
          </div>
        </div>

        {/* Request Form – visible only to students */}
        {user.role === "student" && (
          <div className="bg-white rounded-2xl p-6 mt-6 shadow">
            <h2 className="font-semibold mb-4">Submit New Request</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Activity Name</label>
                <input
                  type="text"
                  placeholder="Enter activity name"
                  value={activityName}
                  onChange={(e) => setActivityName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Activity Purpose</label>
                <textarea
                  placeholder="Describe the purpose of this activity"
                  value={activityPurpose}
                  onChange={(e) => setActivityPurpose(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none text-black"
                ></textarea>
              </div>

             {/* Start + End Date & Time side by side */}
<div className="md:col-span-2 flex flex-col md:flex-row md:gap-4 max-w-2xl">
  {/* Start Date & Time */}
  <div className="flex-1">
    <label className="block text-sm font-medium mb-1">Start Date & Time</label>
    <DatePicker
      selected={startDateTime}
      onChange={(date) => setStartDateTime(date)}
      showTimeSelect
      timeIntervals={30}
      dateFormat="Pp"
      placeholderText="Select start date & time"
      className="w-full border border-red-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none text-black"
    />
  </div>

  {/* End Date & Time */}
  <div className="flex-1">
    <label className="block text-sm font-medium mb-1">End Date & Time</label>
    <DatePicker
      selected={endDateTime}
      onChange={(date) => setEndDateTime(date)}
      showTimeSelect
      timeIntervals={30}
      dateFormat="Pp"
      minDate={startDateTime ?? undefined}
      placeholderText="Select end date & time"
      className="w-full border border-red-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none text-black"
    />
  </div>
</div>


              {/* File Uploads */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Attachments</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50">
                  <FaPaperclip className="mx-auto text-gray-500 text-xl mb-2" />
                  <p className="text-sm text-gray-500">Drag and drop files here or</p>
                  <label className="text-red-500 font-medium hover:underline cursor-pointer">
                    Browse Files
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          setAttachments(Array.from(e.target.files));
                        }
                      }}
                    />
                  </label>
                  {attachments.length > 0 && (
                    <ul className="mt-3 text-sm text-gray-600 text-left space-y-1">
                      {attachments.map((file, idx) => (
                        <li key={idx} className="flex items-center justify-between">
                          <span>📎 {file.name}</span>
                          <button
                            type="button"
                            className="text-red-500 text-xs hover:underline"
                            onClick={() => {
                              setAttachments((prev) => prev.filter((_, i) => i !== idx));
                            }}
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSubmit}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 shadow"
              >
                Submit Request
              </button>
            </div>
          </div>
        )}

        {/* Requests List */}
        {requests.length > 0 && (
          <div className="bg-white rounded-2xl p-6 mt-6 shadow">
            <h2 className="font-semibold mb-4">My Requests</h2>
            <ul className="space-y-3">
              {requests.map((req) => (
                <li key={req.id} className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span>
                      {req.name} — <span className="font-semibold text-gray-600">{req.status}</span>
                      {req.startDateTime && req.endDateTime && (
                        <span className="text-sm text-gray-500 ml-2">
                          ({req.startDateTime.toLocaleString()} - {req.endDateTime.toLocaleString()})
                        </span>
                      )}
                    </span>
                    <div className="space-x-2">
                      <button onClick={() => updateStatus(req.id, "under_review")} className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-600">
                        Under Review
                      </button>
                      <button onClick={() => updateStatus(req.id, "approved")} className="px-2 py-1 text-xs rounded bg-green-100 text-green-600">
                        Approve
                      </button>
                      <button onClick={() => updateStatus(req.id, "completed")} className="px-2 py-1 text-xs rounded bg-gray-200 text-gray-700">
                        Complete
                      </button>
                    </div>
                  </div>

                  {/* Show attached files */}
                  {req.files && req.files.length > 0 && (
                    <ul className="mt-2 text-sm text-gray-600 space-y-1">
                      {req.files.map((file, idx) => (
                        <li key={idx} className="flex items-center justify-between">
                          <span>📎 {file.name}</span>
                          <button
                            type="button"
                            className="text-red-500 text-xs hover:underline"
                            onClick={() => {
                              setRequests((prev) =>
                                prev.map((r) =>
                                  r.id === req.id
                                    ? { ...r, files: r.files?.filter((_, i) => i !== idx) }
                                    : r
                                )
                              );
                            }}
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
