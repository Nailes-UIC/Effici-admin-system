import React, { useState, useEffect } from "react";
import MainLayout from "@/layouts/mainlayout";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPaperclip,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker-theme.css"; // custom theme file
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/react";
import type { PageProps as InertiaPageProps } from "@inertiajs/core";

type RequestStatus = "pending" | "under_review" | "approved" | "completed";

interface ActivityRequestItem {
  id: number;
  activity_name: string;
  activity_purpose: string;
  status: RequestStatus;
  start_datetime: string;
  end_datetime: string;
  category: string;
  files?: ActivityRequestFile[];
  created_at: string;
  updated_at: string;
}

interface ActivityRequestFile {
  id: number;
  activity_request_id: number;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
}

interface BookedActivity {
  date: string;
  name: string;
  isFullDay?: boolean;
  timeSlots?: string[];
}

// ✅ Extend Inertia's PageProps
interface PageProps extends InertiaPageProps {
  auth: {
    user: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      role: "student" | "admin_assistant" | "dean";
    };
  };
  activityRequests: ActivityRequestItem[];
  stats: {
    total: number;
    pending: number;
    under_review: number;
    approved: number;
    completed: number;
  };
  flash: {
    success?: string;
    error?: string;
  };
}

export default function ActivityRequest() {
  const { auth, activityRequests: initialRequests, stats: serverStats, flash } =
    usePage<PageProps>().props;

   console.log("✅ Full Props:", usePage<PageProps>().props);
  console.log("✅ Stats from server:", serverStats); // ✅ use serverStats
  console.log("✅ Requests from server:", initialRequests);
  const user = auth.user;

  const [category, setCategory] = useState("minor");
  const [requests, setRequests] = useState<ActivityRequestItem[]>(
    initialRequests || []
  );
  const [activityName, setActivityName] = useState("");
  const [activityPurpose, setActivityPurpose] = useState("");
  const [startDateTime, setStartDateTime] = useState<Date | null>(null);
  const [endDateTime, setEndDateTime] = useState<Date | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [notification, setNotification] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookedActivities, setBookedActivities] = useState<BookedActivity[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔔 Confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);

  // Handle flash messages
  useEffect(() => {
    if (flash.success) {
      triggerNotification("success", flash.success);
    }
    if (flash.error) {
      triggerNotification("error", flash.error);
    }
  }, [flash]);

  // ✅ Always sync with fresh server data
  useEffect(() => {
    console.log('Props updated:', { initialRequests, serverStats }); // Debug log
    setRequests(initialRequests || []);
  }, [initialRequests]);

  // ✅ Use stats directly from server, with fallback
  const stats = serverStats || {
    total: 0,
    pending: 0,
    approved: 0,
    under_review: 0,
    completed: 0,
  };

  // Debug: Log current stats
  console.log('Current stats:', stats);
  console.log('Current requests:', requests);

  // Approved/completed requests for calendar
  useEffect(() => {
    const activities: BookedActivity[] = requests
      .filter((r) => r.status === "approved" || r.status === "completed")
      .map((r) => ({
        date: new Date(r.start_datetime).toISOString().split("T")[0],
        name: r.activity_name,
        isFullDay: false,
        timeSlots: [],
      }));
    setBookedActivities(activities);
  }, [requests]);

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
      monthName: firstDay.toLocaleString("default", {
        month: "long",
        year: "numeric",
      }),
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

  const triggerNotification = (type: "error" | "success", message: string) => {
    setNotification({ type, message });
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
      setTimeout(() => setNotification(null), 300);
    }, 3000);
  };

  // 🟢 Actual submit handler
  const handleSubmit = async () => {
    if (user.role !== "student") {
      triggerNotification("error", "Only students can submit activity requests.");
      return;
    }

    if (
      !activityName.trim() ||
      !activityPurpose.trim() ||
      !startDateTime ||
      !endDateTime
    ) {
      triggerNotification("error", "Please fill in all required fields.");
      return;
    }

    if (endDateTime < startDateTime) {
      triggerNotification(
        "error",
        "End date/time cannot be earlier than start date/time."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("activity_name", activityName);
      formData.append("activity_purpose", activityPurpose);
      formData.append("category", category);
      formData.append(
        "start_datetime",
        startDateTime.toISOString().slice(0, 19).replace("T", " ")
      );
      formData.append(
        "end_datetime",
        endDateTime.toISOString().slice(0, 19).replace("T", " ")
      );

      attachments.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
      });

      Inertia.post("/activity-requests", formData, {
        forceFormData: true,
        preserveScroll: true,
        preserveState: false, // ✅ ensures new props come from server
        onSuccess: () => {
          setActivityName("");
          setActivityPurpose("");
          setStartDateTime(null);
          setEndDateTime(null);
          setAttachments([]);
          setConfirmChecked(false); // reset checkbox
          // ✅ Don't show notification here - let flash message handle it
        },
        onError: (errors) => {
          const errorMessage = Object.values(errors).flat().join(", ");
          triggerNotification(
            "error",
            errorMessage || "Failed to submit request."
          );
        },
        onFinish: () => {
          setIsSubmitting(false);
        },
      });
    } catch (error) {
      console.error("Submission error:", error);
      triggerNotification("error", "An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  const calendarInfo = getCalendarInfo();

  // 🟢 Confirm modal submit
  const confirmAndSubmit = () => {
    if (!confirmChecked) return;
    setShowConfirmModal(false);
    handleSubmit();
  };

  return (
    <MainLayout>
      {/* 🔔 Toast Notification */}
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
              aria-label="Close notification"
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
          <p className="text-gray-600">
            Students can submit requests for activities.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Requests", value: stats.total, color: "text-red-500" },
            { label: "Pending", value: stats.pending, color: "text-yellow-500" },
            { label: "Approved", value: stats.approved, color: "text-green-500" },
            { label: "Under Review", value: stats.under_review, color: "text-blue-500" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-2xl shadow text-center"
            >
              <div className="text-sm text-gray-500">{stat.label}</div>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Calendar + categorization */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Calendar */}
          <div className="bg-white rounded-2xl p-4 shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Schedule Availability</h2>
              <button className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600">
                View Calendar
              </button>
            </div>
            {/* Month nav */}
            <div className="flex justify-between items-center mb-2">
              <button
                onClick={() => navigateMonth("prev")}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <FaChevronLeft className="text-gray-600" />
              </button>
              <div className="text-sm text-gray-500">{calendarInfo.monthName}</div>
              <button
                onClick={() => navigateMonth("next")}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <FaChevronRight className="text-gray-600" />
              </button>
            </div>
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="font-semibold text-gray-700 p-1">
                  {d}
                </div>
              ))}
              {Array.from(
                { length: calendarInfo.startingDayOfWeek },
                (_, i) => (
                  <div key={`empty-${i}`} className="p-2"></div>
                )
              )}
              {Array.from({ length: calendarInfo.daysInMonth }, (_, i) => {
                const day = i + 1;
                const dateStr = `${calendarInfo.year}-${String(
                  calendarInfo.month + 1
                ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const booked = bookedActivities.find((a) => a.date === dateStr);
                return (
                  <div
                    key={day}
                    className={`relative flex flex-col items-center justify-center p-2 rounded-lg border min-h-[60px] ${
                      booked
                        ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                        : "bg-green-50 border-green-200 text-green-800"
                    }`}
                  >
                    <div className="font-medium text-lg">{day}</div>
                    {booked && (
                      <div className="absolute text-[9px] left-1 right-1 bottom-1 bg-white bg-opacity-80 rounded px-1">
                        {booked.name}
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
              <option value="minor">Minor – Low-priority</option>
              <option value="normal">Normal – Standard process</option>
              <option value="urgent">Urgent – Time sensitive</option>
            </select>
          </div>
        </div>

        {/* Request Form */}
        {user.role === "student" && (
          <div className="bg-white rounded-2xl p-6 mt-6 shadow">
            <h2 className="font-semibold mb-4">Submit New Request</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Activity Name
                </label>
                <input
                  type="text"
                  placeholder="Enter activity name"
                  value={activityName}
                  onChange={(e) => setActivityName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none text-black"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Activity Purpose
                </label>
                <textarea
                  placeholder="Describe the purpose of this activity"
                  value={activityPurpose}
                  onChange={(e) => setActivityPurpose(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none text-black"
                  disabled={isSubmitting}
                ></textarea>
              </div>

              {/* Start + End Date */}
              <div className="md:col-span-2 flex flex-col md:flex-row md:gap-4 max-w-2xl">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Start Date & Time
                  </label>
                  <DatePicker
                    selected={startDateTime}
                    onChange={(date) => setStartDateTime(date)}
                    showTimeSelect
                    timeIntervals={30}
                    dateFormat="Pp"
                    placeholderText="Select start date & time"
                    className="w-full border border-red-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none text-black"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    End Date & Time
                  </label>
                  <DatePicker
                    selected={endDateTime}
                    onChange={(date) => setEndDateTime(date)}
                    showTimeSelect
                    timeIntervals={30}
                    dateFormat="Pp"
                    minDate={startDateTime ?? undefined}
                    placeholderText="Select end date & time"
                    className="w-full border border-red-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none text-black"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* File Uploads */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Attachments
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50">
                  <FaPaperclip className="mx-auto text-gray-500 text-xl mb-2" />
                  <p className="text-sm text-gray-500">
                    Drag and drop files here or
                  </p>
                  <label className="text-red-500 font-medium hover:underline cursor-pointer">
                    Browse Files
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      disabled={isSubmitting}
                      onChange={(e) => {
                        if (e.target.files) {
                          setAttachments(Array.from(e.target.files));
                        }
                      }}
                    />
                  </label>
                  {attachments.length > 0 && (
                    <ul className="mt-2 text-sm text-left text-gray-600">
                      {attachments.map((file, index) => (
                        <li key={index}>• {file.name}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowConfirmModal(true)}
                disabled={isSubmitting}
                className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 🧾 Confirmation Modal – styled like your screenshot */}
      {showConfirmModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            {/* Close (X) */}
            <button
              onClick={() => setShowConfirmModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <FaTimes />
            </button>

            {/* Header */}
            <div className="flex items-center mb-3">
              <FaInfoCircle className="text-red-500 text-xl mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Submission
              </h3>
            </div>

            {/* Body text */}
            <p className="text-gray-600 text-sm leading-6 mb-4">
              Are you sure you want to submit the activity request? Please review
              your details before proceeding.
            </p>

            {/* Checkbox */}
            <label className="flex items-start space-x-3 mb-5 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-gray-300 accent-red-500"
                checked={confirmChecked}
                onChange={(e) => setConfirmChecked(e.target.checked)}
              />
              <span className="text-sm text-gray-800">
                I confirm that I have reviewed all the details and they are
                correct
              </span>
            </label>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmAndSubmit}
                disabled={!confirmChecked || isSubmitting}
                className={`px-4 py-2 rounded-lg text-white ${
                  confirmChecked && !isSubmitting
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-red-300 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Confirm & Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}