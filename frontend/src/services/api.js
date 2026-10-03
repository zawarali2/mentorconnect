const API_BASE = "/api";

// Shared request helper
async function request(endpoint, options = {}) {
  const token = localStorage.getItem("mentorconnect_token");

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

// Auth API
export const authAPI = {
  signup: (userData) =>
    request("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  getMe: () => request("/auth/me"),
};

export const mentorAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/mentors${query ? `?${query}` : ""}`);
  },

  getById: (id) => request(`/mentors/${id}`),

  seed: () =>
    request("/mentors/seed", {
      method: "POST",
    }),

  createProfile: (mentorData) =>
    request("/mentors/profile", {
      method: "POST",
      body: JSON.stringify(mentorData),
    }),
};

// Booking API
export const bookingAPI = {
  create: (bookingData) =>
    request("/bookings", {
      method: "POST",
      body: JSON.stringify(bookingData),
    }),

  checkByEmail: (email) =>
    request(`/bookings/check?email=${encodeURIComponent(email)}`),

  getMentorBookings: () =>
    request("/bookings/mentor"),

  updateStatus: (id, { status, meetingLink, mentorNote }) =>
    request(`/bookings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, meetingLink, mentorNote }),
    }),

  updateMeetingLink: (id, meetingLink) =>
    request(`/bookings/${id}/meeting-link`, {
      method: "PATCH",
      body: JSON.stringify({ meetingLink }),
    }),
};
