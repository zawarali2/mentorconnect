# MentorConnect

A full-stack mentor marketplace web application built with React, Node.js, Express, and MongoDB.

**Final Year Project — Abdul Wali Khan University Mardan (2025–2026)**

Team: Zawar Ali, M. Saad, Zohaib Akbar | Supervisor: Mr. Zia-ur-Rahman

---

## Features

- 🧑‍🏫 **Mentor Directory** — Browse mentors by skill, search by name
- 📅 **Book Sessions** — Students book sessions without creating an account
- 📋 **Check Booked Sessions** — Students check booking status by email
- 🔐 **Mentor Auth** — Secure signup/login with bcrypt + JWT
- 📊 **Mentor Dashboard** — Accept, reject, manage bookings, add meeting links

## Tech Stack

| Layer    | Technology               |
| -------- | ------------------------ |
| Frontend | React 18, Vite            |
| Backend  | Node.js, Express 4        |
| Database | MongoDB Atlas + Mongoose  |
| Auth     | bcryptjs, jsonwebtoken    |

## Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)

### Backend Setup

```bash
cd backend
npm install
```

1. Copy `.env.example` to `.env` and fill in your MongoDB Atlas URI:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/mentorconnect?retryWrites=true&w=majority
   JWT_SECRET=your_secret_key_here
   PORT=5000
   CLIENT_URL=http://localhost:5173
   ```

2. Start the server:
   ```bash
   npm run dev
   ```

3. Seed mentor data (after first run):
   ```bash
   curl -X POST http://localhost:5000/api/mentors/seed
   ```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

## API Endpoints

| Method | Endpoint                          | Auth     | Description              |
| ------ | --------------------------------- | -------- | ------------------------ |
| POST   | /api/auth/signup                  | No       | Mentor registration      |
| POST   | /api/auth/login                   | No       | Mentor login             |
| GET    | /api/auth/me                      | Yes      | Current mentor           |
| GET    | /api/mentors                      | No       | All mentors (search/filter) |
| GET    | /api/mentors/:id                  | No       | Single mentor            |
| POST   | /api/mentors/seed                 | No       | Seed sample data         |
| POST   | /api/bookings                     | No       | Student submits booking  |
| GET    | /api/bookings/check?email=        | No       | Check bookings by email  |
| GET    | /api/bookings/mentor              | Yes      | Mentor's bookings        |
| PATCH  | /api/bookings/:id/status          | Yes      | Accept/reject/complete   |
| PATCH  | /api/bookings/:id/meeting-link    | Yes      | Add meeting link         |
