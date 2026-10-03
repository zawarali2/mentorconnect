import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MentorCard from "../components/mentor/MentorCard";
import { mentorAPI } from "../services/api";
import staticMentors from "../data/mentors";

export default function Home() {
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    // Try API first, fall back to static data
    mentorAPI
      .getAll()
      .then((data) => setMentors(data.mentors?.slice(0, 4) || []))
      .catch(() => setMentors(staticMentors.slice(0, 4)));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#fef0ea] via-white to-[#e8edf5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-[#e07a5f]/10 text-[#e07a5f] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                🎓 AWKUM Final Year Project
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight font-['Sora'] mb-4">
                Find Your{" "}
                <span className="bg-gradient-to-r from-[#e07a5f] to-[#3d405b] bg-clip-text text-transparent">
                  Perfect Mentor
                </span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg">
                Connect with experienced professionals who were once in your
                shoes. Book a free one-on-one session and get personalized
                guidance — no account required.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/mentors"
                  className="inline-flex items-center px-6 py-3 bg-[#e07a5f] text-white font-semibold rounded-xl hover:bg-[#c96c51] transition-colors shadow-lg shadow-[#e07a5f]/25"
                >
                  Browse Mentors
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  to="/check-booking"
                  className="inline-flex items-center px-6 py-3 bg-white text-[#3d405b] font-semibold rounded-xl border-2 border-[#3d405b]/20 hover:border-[#3d405b]/40 transition-colors"
                >
                  Check Booked Sessions
                </Link>
              </div>
              {/* Trust signal */}
              <div className="flex items-center gap-6 mt-8 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> No sign-up needed
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> 100% Free sessions
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Verified mentors
                </div>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-gradient-to-br from-[#e07a5f] to-[#3d405b] rounded-full opacity-10 absolute -top-10 -right-10"></div>
                <div className="relative bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                  {/* Illustrated booking card */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[#e07a5f]/20 flex items-center justify-center text-lg">
                      🧑‍🏫
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Ahmed Khan</p>
                      <p className="text-xs text-gray-500">Senior Software Engineer</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-yellow-400">★★★★★</span>
                      <span className="text-gray-600">4.9</span>
                      <span className="text-gray-400">(127 sessions)</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {["React", "Node.js", "MongoDB"].map((s) => (
                        <span key={s} className="text-xs bg-orange-50 text-[#e07a5f] px-2 py-0.5 rounded-full">
                          {s}
                        </span>
                      ))}
                    </div>
                    <button className="w-full py-2.5 bg-[#e07a5f] text-white text-sm font-semibold rounded-lg mt-3">
                      Book Free Session →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 font-['Sora']">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🔍",
                title: "1. Find a Mentor",
                desc: "Browse our directory, filter by skills, and find someone with the expertise you need.",
              },
              {
                icon: "📅",
                title: "2. Book a Session",
                desc: "Pick a date and time that works for you. No account or payment required.",
              },
              {
                icon: "✅",
                title: "3. Check Status",
                desc: "Visit the Check Booked Sessions page anytime to see if your request was accepted and get your meeting link.",
              },
            ].map((step) => (
              <div
                key={step.title}
                className="text-center p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2 font-['Sora']">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Mentors */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 font-['Sora']">
              Featured Mentors
            </h2>
            <Link
              to="/mentors"
              className="text-[#e07a5f] font-semibold text-sm hover:underline"
            >
              View All →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mentors.map((mentor) => (
              <MentorCard key={mentor._id} mentor={mentor} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
