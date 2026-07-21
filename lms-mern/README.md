# EduSphere — MERN Stack LMS Portal

A full-featured Learning Management System built with **MongoDB, Express, React, and Node.js**. Includes role-based access for **Students**, **Instructors**, and **Admins**, course creation & lesson management, enrollment with progress tracking, ratings/reviews, and an admin panel.

## ✨ Features

- **Authentication** — JWT-based register/login, secure password hashing (bcrypt)
- **Role-based access** — Student, Instructor, Admin, each with tailored dashboards
- **Course management** — Instructors create, edit, publish/unpublish, and delete courses
- **Lesson management** — Add/edit/delete lessons with video embeds, resources, free previews
- **Enrollment & progress tracking** — Students enroll, complete lessons, track % progress
- **Reviews & ratings** — Enrolled students can rate and review courses
- **Admin panel** — Platform-wide stats, user role management, activate/deactivate/delete users
- **Search & filters** — Search courses by keyword, category, and level with pagination
- **Fully responsive UI** — Built with React + Tailwind CSS, interactive components throughout

## 🗂️ Project Structure

```
lms-mern/
├── backend/                 # Node.js + Express + MongoDB API
│   ├── config/db.js         # MongoDB connection
│   ├── controllers/         # Route logic (auth, course, lesson, enrollment, user)
│   ├── middleware/          # JWT auth, role guard, error handler
│   ├── models/               # Mongoose schemas (User, Course, Lesson, Enrollment)
│   ├── routes/               # Express routers
│   ├── utils/                # generateToken.js, seedData.js
│   ├── server.js             # App entry point
│   └── package.json
│
└── frontend/                 # React + Vite + Tailwind SPA
    ├── src/
    │   ├── api/axios.js      # Axios instance with JWT interceptor
    │   ├── components/       # Navbar, Footer, CourseCard, ProtectedRoute, etc.
    │   ├── context/AuthContext.jsx
    │   ├── pages/             # Home, Login, Register, CourseList, CourseDetail,
    │   │                       # LessonView, StudentDashboard, InstructorDashboard,
    │   │                       # CourseEditor, AdminDashboard, Profile, NotFound
    │   ├── App.jsx             # Route definitions
    │   └── main.jsx
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) running locally, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set your `MONGO_URI` and `JWT_SECRET`:

```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/lms_portal
JWT_SECRET=change_this_to_a_long_random_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

(Optional) Seed the database with demo users and courses:

```bash
npm run seed
```

This creates three demo accounts (all with password `password123`):
- `admin@lms.com` — Admin
- `instructor@lms.com` — Instructor
- `student@lms.com` — Student

Start the backend:

```bash
npm run dev
```

The API will run at `http://localhost:5000`. Test it: `GET http://localhost:5000/api/health`.

### 2. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
cp .env.example .env
```

The default `.env` points to `http://localhost:5000/api` — adjust if your backend runs elsewhere.

Start the frontend:

```bash
npm run dev
```

The app will run at `http://localhost:5173`. Vite is also configured to proxy `/api` requests to `http://localhost:5000` during development.

### 3. Login

Visit `http://localhost:5173`, click **Log in**, and use the quick demo login buttons, or register a new account as a Student or Instructor.

## 🔌 API Overview

| Method | Endpoint                                              | Description                        | Access             |
|--------|--------------------------------------------------------|-------------------------------------|---------------------|
| POST   | `/api/auth/register`                                   | Register a new user                | Public              |
| POST   | `/api/auth/login`                                       | Login                              | Public              |
| GET    | `/api/auth/me`                                          | Get current user                   | Private             |
| PUT    | `/api/auth/profile`                                     | Update profile                     | Private             |
| GET    | `/api/courses`                                          | List/search/filter courses         | Public              |
| GET    | `/api/courses/:id`                                      | Get course details                 | Public              |
| POST   | `/api/courses`                                          | Create course                      | Instructor/Admin    |
| PUT    | `/api/courses/:id`                                      | Update course                      | Owner/Admin         |
| DELETE | `/api/courses/:id`                                      | Delete course                      | Owner/Admin         |
| GET    | `/api/courses/instructor/my-courses`                    | Instructor's own courses           | Instructor/Admin    |
| POST   | `/api/courses/:id/reviews`                              | Add/update a review                | Enrolled student    |
| GET/POST | `/api/courses/:courseId/lessons`                      | List/add lessons                   | Public / Instructor |
| GET/PUT/DELETE | `/api/lessons/:id`                                | Get/update/delete a lesson         | Enrolled / Owner    |
| POST   | `/api/enrollments/:courseId`                            | Enroll in a course                 | Student             |
| GET    | `/api/enrollments/my-courses`                           | Get my enrollments                 | Student             |
| GET    | `/api/enrollments/:courseId/status`                     | Get enrollment/progress            | Private             |
| PUT    | `/api/enrollments/:courseId/complete-lesson/:lessonId`  | Mark lesson complete               | Student             |
| GET    | `/api/enrollments/course/:courseId/students`            | View enrolled students             | Owner/Admin         |
| GET    | `/api/users`                                             | List all users                     | Admin               |
| PUT/DELETE | `/api/users/:id`                                     | Update/delete a user               | Admin               |
| GET    | `/api/users/stats/overview`                              | Platform statistics                | Admin               |

## 🛠️ Tech Stack

- **Frontend:** React 18, React Router v6, Tailwind CSS, Axios, Lucide Icons, React Hot Toast, Vite
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt.js
- **Auth:** JSON Web Tokens stored in `localStorage`, sent via `Authorization: Bearer` header

## 📦 Production Build

Build the frontend:

```bash
cd frontend
npm run build
```

Set `NODE_ENV=production` in the backend `.env`. The Express server (`backend/server.js`) is already configured to serve the built frontend from `frontend/dist` when in production mode — just run the backend after building the frontend:

```bash
cd backend
npm start
```

## 📝 Notes

- Change `JWT_SECRET` to a strong random string before deploying.
- Update `CLIENT_URL` in the backend `.env` to match your deployed frontend URL for CORS.
- Thumbnail/avatar/video fields accept plain URLs — hook up a file upload service (e.g. Cloudinary, S3) if you need direct file uploads.
