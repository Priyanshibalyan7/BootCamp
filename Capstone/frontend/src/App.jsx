import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Student
import StudentDashboard from "./pages/student/Dashboard";

// Instructor
import InstructorDashboard from "./pages/instructor/Dashboard";

// Admin
import AdminDashboard from "./pages/admin/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Student */}

        <Route
          path="/student/dashboard"
          element={<StudentDashboard />}
        />

        {/* Instructor */}

        <Route
          path="/instructor/dashboard"
          element={<InstructorDashboard />}
        />

        {/* Admin */}

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;