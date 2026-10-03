import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

const statusColors = {
  pending: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
  accepted: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  rejected: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  completed: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
};

export default function Dashboard() {
  const {
    user,
    bookingsLoading,
    pendingBookings,
    acceptedBookings,
    rejectedBookings,
    completedBookings,
    updateBookingStatus,
    addMeetingLink,
    fetchMentorBookings,
  } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState("pending");
  const [actionLoading, setActionLoading] = useState({});
  const [actionError, setActionError] = useState({});

  // Local state for note, link inputs per booking
  const [meetingLinks, setMeetingLinks] = useState({});
  const [mentorNotes, setMentorNotes] = useState({});
  const [linkInputs, setLinkInputs] = useState({}); // for "add link" on accepted

  const setNote = (id) => (e) =>
    setMentorNotes((p) => ({ ...p, [id]: e.target.value }));
  const setLink = (id) => (e) =>
    setMeetingLinks((p) => ({ ...p, [id]: e.target.value }));
  const setAddLink = (id) => (e) =>
    setLinkInputs((p) => ({ ...p, [id]: e.target.value }));

  // Accept booking
  const handleAccept = async (bookingId) => {
    setActionLoading((p) => ({ ...p, [bookingId]: true }));
    setActionError((p) => ({ ...p, [bookingId]: "" }));
    try {
      await updateBookingStatus(bookingId, {
        status: "accepted",
        meetingLink: meetingLinks[bookingId] || "",
        mentorNote: mentorNotes[bookingId] || "",
      });
      // Clear local inputs
      setMeetingLinks((p) => ({ ...p, [bookingId]: "" }));
      setMentorNotes((p) => ({ ...p, [bookingId]: "" }));
    } catch (err) {
      setActionError((p) => ({ ...p, [bookingId]: err.message }));
    } finally {
      setActionLoading((p) => ({ ...p, [bookingId]: false }));
    }
  };

  // Reject booking
  const handleReject = async (bookingId) => {
    setActionLoading((p) => ({ ...p, [bookingId]: true }));
    setActionError((p) => ({ ...p, [bookingId]: "" }));
    try {
      await updateBookingStatus(bookingId, {
        status: "rejected",
        mentorNote: mentorNotes[bookingId] || "",
      });
      setMentorNotes((p) => ({ ...p, [bookingId]: "" }));
    } catch (err) {
      setActionError((p) => ({ ...p, [bookingId]: err.message }));
    } finally {
      setActionLoading((p) => ({ ...p, [bookingId]: false }));
    }
  };

  // Mark as completed
  const handleComplete = async (bookingId) => {
    setActionLoading((p) => ({ ...p, [bookingId]: true }));
    try {
      await updateBookingStatus(bookingId, { status: "completed" });
    } catch (err) {
      setActionError((p) => ({ ...p, [bookingId]: err.message }));
    } finally {
      setActionLoading((p) => ({ ...p, [bookingId]: false }));
    }
  };

  // Add meeting link to already accepted booking
  const handleAddLink = async (bookingId) => {
    const link = linkInputs[bookingId];
    if (!link?.trim()) return;
    setActionLoading((p) => ({ ...p, [`link-${bookingId}`]: true }));
    try {
      await addMeetingLink(bookingId, link.trim());
      setLinkInputs((p) => ({ ...p, [bookingId]: "" }));
    } catch (err) {
      setActionError((p) => ({ ...p, [`link-${bookingId}`]: err.message }));
    } finally {
      setActionLoading((p) => ({ ...p, [`link-${bookingId}`]: false }));
    }
  };

  const tabs = [
    { key: "pending", label: "Pending", count: pendingBookings.length, bookings: pendingBookings },
    { key: "accepted", label: "Accepted", count: acceptedBookings.length, bookings: acceptedBookings },
    { key: "rejected", label: "Rejected", count: rejectedBookings.length, bookings: rejectedBookings },
    { key: "completed", label: "Completed", count: completedBookings.length, bookings: completedBookings },
  ];

  const currentTab = tabs.find((t) => t.key === activeTab);
  const currentBookings = currentTab?.bookings || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 font-['Sora']">
                Welcome, {user?.name?.split(" ")[0]}!
              </h1>
              <p className="text-gray-500 mt-1">
                Manage your incoming session requests
              </p>
            </div>
            <button
              onClick={fetchMentorBookings}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {tabs.map(({ key, label, count }) => (
            <div
              key={key}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center"
            >
              <p className="text-2xl font-bold text-gray-900 font-['Sora']">{count}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 mb-6">
          {tabs.map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-5 py-3 text-sm font-medium rounded-t-lg transition-colors cursor-pointer relative ${
                activeTab === key
                  ? "text-[#e07a5f] bg-white border border-gray-200 border-b-white -mb-px"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {label}
              {count > 0 && (
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === key
                    ? "bg-[#e07a5f]/10 text-[#e07a5f]"
                    : "bg-gray-100 text-gray-500"
                }`}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {bookingsLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#e07a5f] border-t-transparent"></div>
          </div>
        ) : currentBookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <p className="text-4xl mb-3">
              {activeTab === "pending" ? "📭" : activeTab === "accepted" ? "✅" : activeTab === "rejected" ? "❌" : "🎉"}
            </p>
            <p className="text-gray-500">
              No {activeTab} session requests.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentBookings.map((booking) => {
              const isLoading = actionLoading[booking._id];
              const linkLoading = actionLoading[`link-${booking._id}`];
              const err = actionError[booking._id];
              const linkErr = actionError[`link-${booking._id}`];

              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="p-5 sm:p-6">
                    {/* Student info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {booking.studentName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.studentEmail} · {booking.university}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>📅</span>
                        <span>
                          {new Date(booking.preferredDate).toLocaleDateString("en-US", {
                            year: "numeric", month: "short", day: "numeric",
                          })}
                        </span>
                        <span className="mx-1">·</span>
                        <span>🕐 {booking.preferredTime}</span>
                      </div>
                    </div>

                    {/* Student message */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-xs text-gray-500 mb-1">Student's Message:</p>
                      <p className="text-sm text-gray-700">{booking.message}</p>
                    </div>

                    {/* Meeting link display for accepted */}
                    {booking.status === "accepted" && booking.meetingLink && (
                      <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <span>🔗</span>
                          <a
                            href={booking.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-700 font-medium underline truncate max-w-[300px]"
                          >
                            {booking.meetingLink}
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Mentor note display */}
                    {booking.mentorNote && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 mb-4 text-sm text-gray-600">
                        <span className="font-medium">Your note:</span> {booking.mentorNote}
                      </div>
                    )}

                    {/* Actions for PENDING bookings */}
                    {activeTab === "pending" && (
                      <div className="space-y-3">
                        {/* Optional note */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Note for student (optional)
                          </label>
                          <textarea
                            value={mentorNotes[booking._id] || ""}
                            onChange={setNote(booking._id)}
                            placeholder="Add a personal note..."
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e07a5f]/30 focus:border-[#e07a5f] resize-none"
                          />
                        </div>

                        {/* Optional meeting link */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Meeting link (optional — can add later)
                          </label>
                          <input
                            type="url"
                            value={meetingLinks[booking._id] || ""}
                            onChange={setLink(booking._id)}
                            placeholder="Google Meet / Zoom link"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e07a5f]/30 focus:border-[#e07a5f]"
                          />
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAccept(booking._id)}
                            disabled={isLoading}
                            className="flex-1 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60 cursor-pointer"
                          >
                            {isLoading ? "Processing..." : "✅ Accept"}
                          </button>
                          <button
                            onClick={() => handleReject(booking._id)}
                            disabled={isLoading}
                            className="flex-1 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60 cursor-pointer"
                          >
                            {isLoading ? "Processing..." : "❌ Reject"}
                          </button>
                        </div>

                        {err && (
                          <p className="text-xs text-red-600">{err}</p>
                        )}
                      </div>
                    )}

                    {/* Actions for ACCEPTED bookings */}
                    {activeTab === "accepted" && (
                      <div className="space-y-3">
                        {/* Add meeting link if missing */}
                        {!booking.meetingLink && (
                          <div className="flex gap-2 items-end">
                            <div className="flex-1">
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Add meeting link
                              </label>
                              <input
                                type="url"
                                value={linkInputs[booking._id] || ""}
                                onChange={setAddLink(booking._id)}
                                placeholder="Google Meet / Zoom link"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e07a5f]/30 focus:border-[#e07a5f]"
                              />
                            </div>
                            <button
                              onClick={() => handleAddLink(booking._id)}
                              disabled={linkLoading}
                              className="px-4 py-2 bg-[#3d405b] text-white text-sm font-medium rounded-lg hover:bg-[#2d304a] transition-colors disabled:opacity-60 cursor-pointer whitespace-nowrap"
                            >
                              {linkLoading ? "Saving..." : "Save Link"}
                            </button>
                          </div>
                        )}
                        {linkErr && (
                          <p className="text-xs text-red-600">{linkErr}</p>
                        )}

                        {/* Mark as completed */}
                        <button
                          onClick={() => handleComplete(booking._id)}
                          disabled={isLoading}
                          className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 cursor-pointer"
                        >
                          {isLoading ? "Processing..." : "🎉 Mark as Completed"}
                        </button>
                      </div>
                    )}

                    {/* Actions for REJECTED bookings — no actions, just info */}
                    {activeTab === "rejected" && (
                      <div className="text-sm text-gray-500 italic">
                        Declined on {new Date(booking.updatedAt).toLocaleDateString("en-US", {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                      </div>
                    )}

                    {/* Actions for COMPLETED bookings — no actions */}
                    {activeTab === "completed" && (
                      <div className="text-sm text-gray-500 italic">
                        Completed on {new Date(booking.updatedAt).toLocaleDateString("en-US", {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
