export default function Footer() {
  return (
    <footer className="bg-[#3d405b] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e07a5f] to-white flex items-center justify-center">
                <span className="text-white text-xs font-bold font-['Sora']">
                  MC
                </span>
              </div>
              <span className="text-lg font-bold font-['Sora']">
                MentorConnect
              </span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              A free mentor marketplace connecting students with experienced
              professionals for focused guidance sessions. Built with ❤️ as a
              Final Year Project at AWKUM.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-3 font-['Sora']">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="/mentors" className="hover:text-white transition-colors">
                  Browse Mentors
                </a>
              </li>
              <li>
                <a href="/check-booking" className="hover:text-white transition-colors">
                  Check Booked Sessions
                </a>
              </li>
              <li>
                <a href="/mentor/login" className="hover:text-white transition-colors">
                  Mentor Login
                </a>
              </li>
              <li>
                <a href="/mentor/signup" className="hover:text-white transition-colors">
                  Become a Mentor
                </a>
              </li>
            </ul>
          </div>

          {/* University */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-3 font-['Sora']">
              University
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              Abdul Wali Khan University Mardan
              <br />
              Department of Computer Science
              <br />
              Final Year Project 2025–2026
            </p>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-6 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} MentorConnect. Zawar Ali, M. Saad,
          Zohaib Akbar — AWKUM.
        </div>
      </div>
    </footer>
  );
}
