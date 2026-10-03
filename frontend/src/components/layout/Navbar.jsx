import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

export default function Navbar() {
  const { user, logout } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#e07a5f] to-[#3d405b] flex items-center justify-center">
              <span className="text-white text-sm font-bold font-['Sora']">
                MC
              </span>
            </div>
            <span className="text-xl font-bold text-gray-900 font-['Sora']">
              MentorConnect
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1 sm:gap-4">
            <Link
              to="/"
              className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-[#e07a5f] rounded-lg hover:bg-orange-50 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/mentors"
              className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-[#e07a5f] rounded-lg hover:bg-orange-50 transition-colors"
            >
              Browse Mentors
            </Link>
            <Link
              to="/check-booking"
              className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-[#e07a5f] rounded-lg hover:bg-orange-50 transition-colors"
            >
              Check Booked Sessions
            </Link>

            {/* Authenticated: show dashboard & logout */}
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-3 py-2 text-sm font-medium text-white bg-[#e07a5f] hover:bg-[#c96c51] rounded-lg transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                >
                  Logout ({user.name?.split(" ")[0]})
                </button>
              </>
            ) : (
              <Link
                to="/mentor/login"
                className="px-4 py-2 text-sm font-medium text-white bg-[#3d405b] hover:bg-[#2d304a] rounded-lg transition-colors"
              >
                Mentor Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
