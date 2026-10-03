import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import StarRating from "../components/ui/StarRating";
import IntroVideo from "../components/mentor/IntroVideo";
import { mentorAPI, bookingAPI } from "../services/api";
import staticMentors from "../data/mentors";

export default function MentorProfile() {
  const { id } = useParams();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking form state
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    studentName: "",
    studentEmail: "",
    university: "",
    message: "",
    preferredDate: "",
    preferredTime: "",
  });

  // Generate time slots: 08:00 to 20:30 in 30-min increments
  const timeSlots = [];
  for (let hour = 8; hour <= 20; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, "0")}:00`);
    timeSlots.push(`${hour.toString().padStart(2, "0")}:30`);
  }

  // Today's date in YYYY-MM-DD for min date
  const today = new Date().toISOString().split("T")[0];

  // Fetch mentor
  useEffect(() => {
    setLoading(true);
    setError(null);

    mentorAPI
      .getById(id)
      .then((data) => setMentor(data.mentor))
      .catch(() => {
        // Fall back to static data
        const staticMentor = staticMentors.find((m) => m._id === id);
        if (staticMentor) {
          setMentor(staticMentor);
        } else {
          setError("Mentor not found.");
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Helper: update single form field
  const set = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  // Submit booking
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // Validate
    const empty = Object.entries(form).find(([, v]) => !v.trim());
    if (empty) {
      setFormError("All fields are required. Please fill out the complete form.");
      return;
    }
    if (!form.studentEmail.includes("@")) {
      setFormError("Please provide a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      await bookingAPI.create({
        ...form,
        mentorId: mentor._id || id,
      });
      setSubmitted(true);
    } catch (err) {
      setFormError(err.message || "Failed to submit booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#e07a5f] border-t-transparent"></div>
      </div>
    );
  }

  // --- Error State ---
  if (error || !mentor) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-4xl mb-4">😕</p>
        <h2 className="text-xl font-semibold text-gray-900 mb-2 font-['Sora']">
          {error || "Mentor not found"}
        </h2>
        <Link to="/mentors" className="text-[#e07a5f] hover:underline text-sm">
          ← Back to mentor directory
        </Link>
      </div>
    );
  }

  const initials = mentor.name
    ? mentor.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "MC";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div
        className="relative"
        style={{
          background: `linear-gradient(135deg, ${mentor.avatarBg || "#e07a5f"}dd, ${mentor.avatarBg || "#e07a5f"})`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link
            to="/mentors"
            className="inline-flex items-center text-white/80 hover:text-white text-sm mb-6 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to mentors
          </Link>
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-white text-2xl font-bold font-['Sora'] border-2 border-white/30">
              {mentor.avatar || initials}
            </div>
            <div className="text-white">
              <h1 className="text-2xl sm:text-3xl font-bold font-['Sora']">
                {mentor.name}
              </h1>
              <p className="text-white/80 text-lg mt-1">{mentor.role}</p>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <StarRating rating={mentor.rating} size="sm" />
                <span className="text-white/70 text-sm">
                  {mentor.sessions} sessions completed
                </span>
                {mentor.price && (
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                    {mentor.price}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left — Profile Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 font-['Sora']">
                About
              </h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {mentor.bio}
              </p>
            </section>

            {/* Academic Background */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 font-['Sora']">
                Education
              </h2>
              <div className="space-y-2 text-sm text-gray-600">
                {mentor.university && (
                  <p className="flex items-center gap-2">
                    <span>🎓</span> {mentor.university}
                  </p>
                )}
                {mentor.major && (
                  <p className="flex items-center gap-2">
                    <span>📚</span> {mentor.major}
                  </p>
                )}
                {mentor.gradYear && (
                  <p className="flex items-center gap-2">
                    <span>📅</span> Graduated {mentor.gradYear}
                  </p>
                )}
              </div>
            </section>

            {/* Skills */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 font-['Sora']">
                Skills & Expertise
              </h2>
              <div className="flex flex-wrap gap-2">
                {(mentor.skills || []).map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 bg-orange-50 text-[#e07a5f] rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* Intro Video */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 font-['Sora']">
                Introduction Video
              </h2>
              <IntroVideo videoId={mentor.videoId} />
            </section>

            {/* Reviews */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 font-['Sora']">
                Student Reviews ({(mentor.reviews || []).length})
              </h2>
              {(mentor.reviews || []).length === 0 ? (
                <p className="text-sm text-gray-500">
                  No reviews yet. Be the first to book a session!
                </p>
              ) : (
                <div className="space-y-4">
                  {(mentor.reviews || []).map((review, idx) => (
                    <div
                      key={idx}
                      className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 text-sm">
                          {review.name}
                        </span>
                        <StarRating rating={review.stars} size="sm" />
                      </div>
                      <p className="text-sm text-gray-600">{review.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right — Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                {!showForm && !submitted && (
                  <>
                    <div className="text-center mb-6">
                      <span className="text-3xl font-bold text-[#e07a5f] font-['Sora']">
                        {mentor.price || "Free"}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">
                        30-minute session
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mb-6 text-center leading-relaxed">
                      Get personalized guidance from {mentor.name?.split(" ")[0]}. 
                      Book a session with no sign-up required.
                    </p>
                    <button
                      onClick={() => setShowForm(true)}
                      className="w-full py-3 bg-[#e07a5f] text-white font-semibold rounded-xl hover:bg-[#c96c51] transition-colors cursor-pointer shadow-md shadow-[#e07a5f]/25"
                    >
                      Book a Session
                    </button>

                    {/* Mentor quick info */}
                    <div className="border-t border-gray-100 mt-6 pt-6 space-y-3">
                      {mentor.university && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>🎓</span> {mentor.university}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>⭐</span> {mentor.rating} rating
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>📅</span> {mentor.sessions} sessions completed
                      </div>
                    </div>
                  </>
                )}

                {/* Booking Form */}
                {showForm && !submitted && (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 font-['Sora']">
                      Book a Session
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-3">
                      {[
                        { key: "studentName", label: "Your Full Name", type: "text", placeholder: "e.g. Ali Hassan" },
                        { key: "studentEmail", label: "Your Email Address", type: "email", placeholder: "e.g. ali@example.com" },
                        { key: "university", label: "Your University", type: "text", placeholder: "e.g. AWKUM Mardan" },
                      ].map(({ key, label, type, placeholder }) => (
                        <div key={key}>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            {label}
                          </label>
                          <input
                            type={type}
                            value={form[key]}
                            onChange={set(key)}
                            placeholder={placeholder}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e07a5f]/30 focus:border-[#e07a5f]"
                          />
                        </div>
                      ))}

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Message for Mentor
                        </label>
                        <textarea
                          value={form.message}
                          onChange={set("message")}
                          placeholder="What do you want to discuss?"
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e07a5f]/30 focus:border-[#e07a5f] resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Preferred Date
                          </label>
                          <input
                            type="date"
                            value={form.preferredDate}
                            onChange={set("preferredDate")}
                            min={today}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e07a5f]/30 focus:border-[#e07a5f]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Preferred Time
                          </label>
                          <select
                            value={form.preferredTime}
                            onChange={set("preferredTime")}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e07a5f]/30 focus:border-[#e07a5f] bg-white"
                          >
                            <option value="">Select time</option>
                            {timeSlots.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 italic">
                        Preferred Time (mentor will confirm)
                      </p>

                      {formError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
                          {formError}
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowForm(false);
                            setFormError("");
                          }}
                          className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="flex-1 py-2.5 bg-[#e07a5f] text-white text-sm font-semibold rounded-lg hover:bg-[#c96c51] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {submitting ? "Submitting..." : "Send Booking Request"}
                        </button>
                      </div>
                    </form>
                  </>
                )}

                {/* Success State */}
                {submitted && (
                  <div className="text-center py-4">
                    <div className="text-5xl mb-4">✅</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 font-['Sora']">
                      Booking Submitted!
                    </h3>
                    <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                      Your request has been sent to {mentor.name}. You can check
                      the status of your booking anytime using the link below.
                    </p>
                    <Link
                      to="/check-booking"
                      className="inline-block w-full py-3 bg-[#3d405b] text-white font-semibold rounded-xl hover:bg-[#2d304a] transition-colors"
                    >
                      Check Booked Sessions
                    </Link>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setShowForm(false);
                        setForm({
                          studentName: "",
                          studentEmail: "",
                          university: "",
                          message: "",
                          preferredDate: "",
                          preferredTime: "",
                        });
                      }}
                      className="text-sm text-[#e07a5f] mt-4 hover:underline cursor-pointer"
                    >
                      Book another session
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
