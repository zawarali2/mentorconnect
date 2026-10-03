import { Link } from "react-router-dom";
import StarRating from "../ui/StarRating";

/**
 * MentorCard — used in the directory grid and home page.
 */
export default function MentorCard({ mentor }) {
  const initials = mentor.name
    ? mentor.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "MC";

  return (
    <Link
      to={`/mentors/${mentor._id}`}
      className="block bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden no-underline border border-gray-100"
    >
      {/* Card Header */}
      <div
        className="h-24 relative"
        style={{
          background: `linear-gradient(135deg, ${mentor.avatarBg || "#e07a5f"}aa, ${mentor.avatarBg || "#e07a5f"})`,
        }}
      >
        <div className="absolute -bottom-6 left-4 w-14 h-14 rounded-full border-4 border-white flex items-center justify-center text-white font-bold text-lg font-['Sora']"
          style={{ backgroundColor: mentor.avatarBg || "#e07a5f" }}>
          {mentor.avatar || initials}
        </div>
        {mentor.price === "Free" && (
          <span className="absolute top-3 right-3 bg-white/90 text-[#e07a5f] text-xs font-semibold px-2.5 py-1 rounded-full">
            Free
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 pt-8">
        <h3 className="font-semibold text-gray-900 mb-0.5 font-['Sora'] text-base">
          {mentor.name}
        </h3>
        <p className="text-sm text-gray-500 mb-2">{mentor.role}</p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={mentor.rating} size="sm" />
          <span className="text-xs text-gray-400">
            ({mentor.sessions} sessions)
          </span>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1">
          {(mentor.skills || []).slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="text-xs bg-orange-50 text-[#e07a5f] px-2 py-0.5 rounded-full font-medium"
            >
              {skill}
            </span>
          ))}
          {(mentor.skills || []).length > 3 && (
            <span className="text-xs text-gray-400">
              +{mentor.skills.length - 3} more
            </span>
          )}
        </div>

        {/* University */}
        {mentor.university && (
          <p className="text-xs text-gray-400 mt-3 truncate">
            🎓 {mentor.university}
          </p>
        )}
      </div>
    </Link>
  );
}
