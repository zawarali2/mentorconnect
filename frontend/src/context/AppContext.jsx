import { createContext, useState, useEffect, useCallback } from "react";
import { authAPI, bookingAPI } from "../services/api";

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem("mentorconnect_token");
    const savedUser = localStorage.getItem("mentorconnect_user");

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("mentorconnect_token");
        localStorage.removeItem("mentorconnect_user");
      }
    }
    setAuthLoading(false);
  }, []);

  // Fetch mentor's bookings when user logs in
  useEffect(() => {
    if (user) {
      fetchMentorBookings();
    } else {
      setBookings([]);
    }
  }, [user]);

  const fetchMentorBookings = useCallback(async () => {
    setBookingsLoading(true);
    try {
      const data = await bookingAPI.getMentorBookings();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setBookingsLoading(false);
    }
  }, []);

  // Login
  const login = async (credentials) => {
    const data = await authAPI.login(credentials);
    localStorage.setItem("mentorconnect_token", data.token);
    localStorage.setItem("mentorconnect_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  // Signup
  const signup = async (userData) => {
    const data = await authAPI.signup(userData);
    localStorage.setItem("mentorconnect_token", data.token);
    localStorage.setItem("mentorconnect_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("mentorconnect_token");
    localStorage.removeItem("mentorconnect_user");
    setUser(null);
    setBookings([]);
  };

  // Update booking status (accept/reject/complete)
  const updateBookingStatus = async (bookingId, { status, meetingLink, mentorNote }) => {
    const data = await bookingAPI.updateStatus(bookingId, {
      status,
      meetingLink,
      mentorNote,
    });
    // Replace booking in state
    setBookings((prev) =>
      prev.map((b) => (b._id === bookingId ? data.booking : b))
    );
    return data;
  };

  // Add/update meeting link
  const addMeetingLink = async (bookingId, meetingLink) => {
    const data = await bookingAPI.updateMeetingLink(bookingId, meetingLink);
    setBookings((prev) =>
      prev.map((b) => (b._id === bookingId ? data.booking : b))
    );
    return data;
  };

  // Group bookings by status
  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const acceptedBookings = bookings.filter((b) => b.status === "accepted");
  const rejectedBookings = bookings.filter((b) => b.status === "rejected");
  const completedBookings = bookings.filter((b) => b.status === "completed");

  const value = {
    user,
    bookings,
    authLoading,
    bookingsLoading,
    pendingBookings,
    acceptedBookings,
    rejectedBookings,
    completedBookings,
    login,
    signup,
    logout,
    fetchMentorBookings,
    updateBookingStatus,
    addMeetingLink,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
