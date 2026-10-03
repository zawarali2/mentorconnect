import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/ui/ProtectedRoute";

import Home from "./pages/Home";
import Mentors from "./pages/Mentors";
import MentorProfile from "./pages/MentorProfile";
import CompleteMentorProfile from "./pages/CompleteMentorProfile";
import CheckBooking from "./pages/CheckBooking";
import Login from "./pages/Login";
import MentorSignup from "./pages/MentorSignup";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/mentors" element={<Mentors />} />
              <Route path="/mentors/:id" element={<MentorProfile />} />
              <Route path="/check-booking" element={<CheckBooking />} />
              <Route path="/mentor/login" element={<Login />} />
              <Route path="/mentor/signup" element={<MentorSignup />} />
              <Route path="/completeMentorProfile" element={<CompleteMentorProfile />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              {/* 404 */}
              <Route
                path="*"
                element={
                  <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                      <p className="text-5xl mb-4">🔍</p>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2 font-['Sora']">
                        Page Not Found
                      </h2>
                      <p className="text-gray-500 mb-4">
                        The page you're looking for doesn't exist.
                      </p>
                      <a
                        href="/"
                        className="text-[#e07a5f] font-medium hover:underline"
                      >
                        ← Go home
                      </a>
                    </div>
                  </div>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}
