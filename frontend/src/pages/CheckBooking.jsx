import { useState } from "react";
import { bookingAPI } from "../services/api";

const statusColors = {
  pending: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", label: "Pending" },
  accepted: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", label: "Accepted" },
  rejected: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", label: "Rejected" },
  completed: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", label: "Completed" },
};

export default function CheckBooking() {
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleCheck = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const data = await bookingAPI.checkByEmail(email.trim());
      setBookings(data.bookings || []);
    } catch (err) {
      setError(err.message || "Failed to check bookings.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 font-['Sora'] mb-2">
            Check Booked Sessions
          </h1>
          <p className="text-gray-500">
            Enter the email address you used when booking to see all your
            session requests and their current status — no login required.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <form onSubmit={handleCheck} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter the email you used for booking..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e07a5f]/30 focus:border-[#e07a5f]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#e07a5f] text-white font-semibold rounded-xl hover:bg-[#c96c51] transition-colors disabled:opacity-60 cursor-pointer whitespace-nowrap"
            >
              {loading ? "Checking..." : "Check Bookings"}
            </button>
          </form>
          {error && (
            <p className="text-sm text-red-600 mt-3">{error}</p>
          )}
        </div>

        {/* Results */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#e07a5f] border-t-transparent"></div>
          </div>
        )}

        {!loading && searched && (
          <>
            {bookings === null ? null : bookings.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                <p className="text-5xl mb-4">📭</p>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-['Sora']">
                  No bookings found
                </h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">
                  No booking requests were found for{" "}
                  <span className="font-medium">{email}</span>. Make sure you're
                  using the same email you used when booking.{" "}
                  <a href="/mentors" className="text-[#e07a5f] hover:underline">
                    Browse mentors →
                  </a>
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500 mb-4">
                  {bookings.length} booking{bookings.length !== 1 && "s"} found
                  for <span className="font-medium">{email}</span>
                </p>

                <div className="space-y-4">
                  {bookings.map((booking) => {
                    const colors = statusColors[booking.status] || statusColors.pending;
                    return (
                      <div
                        key={booking._id}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                      >
                        {/* Status Bar */}
                        <div className={`px-6 py-3 ${colors.bg} border-b ${colors.border} flex items-center justify-between`}>
                          <div className="flex items-center gap-2">
                            <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                              booking.status === "pending" ? "bg-yellow-500" :
                              booking.status === "accepted" ? "bg-green-500" :
                              booking.status === "rejected" ? "bg-red-500" : "bg-blue-500"
                            }`}></span>
                            <span className={`font-semibold text-sm ${colors.text}`}>
                              {colors.label}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            Booked {new Date(booking.createdAt).toLocaleDateString("en-US", {
                              year: "numeric", month: "short", day: "numeric",
                            })}
                          </span>
                        </div>

                        <div className="p-6">
                          {/* Mentor Info */}
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#e07a5f]/20 to-[#3d405b]/20 flex items-center justify-center text-[#e07a5f] text-sm font-bold font-['Sora']">
                              {booking.mentorName?.split(" ").map(n => n[0]).join("").slice(0, 2)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{booking.mentorName}</p>
                              <p className="text-xs text-gray-500">{booking.mentorRole}</p>
                            </div>
                          </div>

                          {/* Booking Details */}
                          <div className="grid sm:grid-cols-2 gap-3 text-sm mb-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <span>📅</span>
                              <span>
                                {new Date(booking.preferredDate).toLocaleDateString("en-US", {
                                  weekday: "long", year: "numeric", month: "long", day: "numeric",
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <span>🕐</span>
                              <span>{booking.preferredTime}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <span>🎓</span>
                              <span>{booking.university}</span>
                            </div>
                          </div>

                          {/* Your Message */}
                          <div className="bg-gray-50 rounded-lg p-3 mb-4">
                            <p className="text-xs text-gray-500 mb-1">Your Message:</p>
                            <p className="text-sm text-gray-700">{booking.message}</p>
                          </div>

                          {/* Meeting Link — only when accepted */}
                          {booking.status === "accepted" && (
                            <div className="mt-4">
                              {booking.meetingLink ? (
                                <a
                                  href={booking.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-5 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-md"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                  Join Meeting
                                </a>
                              ) : (
                                <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm rounded-lg px-4 py-3">
                                  <p className="font-medium mb-1">✅ Your session has been accepted!</p>
                                  <p>The meeting link will appear here once the mentor adds it. Check back shortly.</p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Mentor Note */}
                          {booking.mentorNote && (
                            <div className="mt-4 p-3 rounded-lg border border-gray-200">
                              <p className="text-xs text-gray-500 mb-1">
                                Note from {booking.mentorName?.split(" ")[0]}:
                              </p>
                              <p className="text-sm text-gray-700">{booking.mentorNote}</p>
                            </div>
                          )}

                          {/* Pending — guidance */}
                          {booking.status === "pending" && (
                            <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm rounded-lg px-4 py-3">
                              <p className="font-medium mb-1">⏳ Waiting for mentor response</p>
                              <p>Your booking request is being reviewed. Check back here to see when the mentor accepts or rejects your request.</p>
                            </div>
                          )}

                          {/* Rejected — guidance */}
                          {booking.status === "rejected" && (
                            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                              <p className="font-medium mb-1">😔 Session was declined</p>
                              <p>The mentor wasn't available for this session. {" "}
                                <a href="/mentors" className="underline font-medium">
                                  Browse other mentors →
                                </a>
                              </p>
                            </div>
                          )}

                          {/* Completed */}
                          {booking.status === "completed" && (
                            <div className="mt-4 bg-blue-50 border border-blue-200 text-blue-700 text-sm rounded-lg px-4 py-3">
                              <p className="font-medium mb-1">🎉 Session completed!</p>
                              <p>This mentoring session has been marked as completed. We hope it was helpful!</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
