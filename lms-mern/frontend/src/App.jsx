import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CourseList from './pages/CourseList';
import CourseDetail from './pages/CourseDetail';
import LessonView from './pages/LessonView';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import CourseEditor from './pages/CourseEditor';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/:id" element={<CourseDetail />} />

          {/* Authenticated routes (any role) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/:courseId/lessons/:lessonId"
            element={
              <ProtectedRoute>
                <LessonView />
              </ProtectedRoute>
            }
          />

          {/* Student-only routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Instructor-only routes */}
          <Route
            path="/instructor"
            element={
              <ProtectedRoute roles={['instructor', 'admin']}>
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/courses/new"
            element={
              <ProtectedRoute roles={['instructor', 'admin']}>
                <CourseEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/courses/:id/edit"
            element={
              <ProtectedRoute roles={['instructor', 'admin']}>
                <CourseEditor />
              </ProtectedRoute>
            }
          />

          {/* Admin-only routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
