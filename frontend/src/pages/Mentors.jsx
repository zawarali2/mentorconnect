import { useState, useEffect } from "react";
import MentorCard from "../components/mentor/MentorCard";
import { mentorAPI } from "../services/api";
import staticMentors, { allSkills } from "../data/mentors";

export default function Mentors() {
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch mentors
useEffect(() => {
  const fetchMentors = async () => {
    try {
      setLoading(true);

      const data = await mentorAPI.getAll();

      setMentors(data.mentors);
      setFilteredMentors(data.mentors);

    } catch (err) {

      console.log(err);

      // fallback if backend is down
      setMentors(staticMentors);
      setFilteredMentors(staticMentors);

    } finally {
      setLoading(false);
    }
  };

  fetchMentors();

}, []);

  // Filter on search / skill change
  useEffect(() => {
    let filtered = [...mentors];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(term) ||
          m.role.toLowerCase().includes(term) ||
          (m.skills || []).some((s) => s.toLowerCase().includes(term)) ||
          (m.university || "").toLowerCase().includes(term)
      );
    }

    if (selectedSkill) {
      filtered = filtered.filter((m) =>
        (m.skills || []).includes(selectedSkill)
      );
    }

    setFilteredMentors(filtered);
  }, [searchTerm, selectedSkill, mentors]);

  // Extract unique skills from CURRENT mentors (API or fallback)
  const availableSkills = [
    ...new Set(mentors.flatMap((m) => m.skills || [])),
  ].sort();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 font-['Sora'] mb-2">
            Browse Mentors
          </h1>
          <p className="text-gray-500">
            Find the right mentor for your specific needs. Filter by skill or
            search by name.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search input */}
            <div className="flex-1 relative">
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by name, role, or skill..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e07a5f]/30 focus:border-[#e07a5f] text-sm"
              />
            </div>

            {/* Skill filter */}
            {selectedSkill && (
              <button
                onClick={() => setSelectedSkill("")}
                className="text-sm text-[#e07a5f] hover:underline self-center"
              >
                Clear filter ✕
              </button>
            )}
          </div>

          {/* Skill Chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            {(availableSkills.length > 0 ? availableSkills : allSkills).map(
              (skill) => (
                <button
                  key={skill}
                  onClick={() =>
                    setSelectedSkill(selectedSkill === skill ? "" : skill)
                  }
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                    selectedSkill === skill
                      ? "bg-[#e07a5f] text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-[#e07a5f]"
                  }`}
                >
                  {skill}
                </button>
              )
            )}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#e07a5f] border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-2">⚠️ {error}</p>
            <p className="text-sm text-gray-500">
              Showing static data instead.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              {filteredMentors.length} mentor
              {filteredMentors.length !== 1 && "s"} found
            </p>
            {filteredMentors.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">🔍</p>
                <p className="text-gray-500">
                  No mentors match your search. Try different keywords or clear
                  the filter.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMentors.map((mentor) => (
                  <MentorCard key={mentor._id} mentor={mentor} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
