import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, BookOpen, User as UserIcon } from 'lucide-react';
import api from '../api/axios';
import Loader from '../components/Loader';
import DashboardSidebar from '../components/DashboardSidebar';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const { data } = await api.get('/enrollments/my-courses');
        setEnrollments(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  const links = [
    { to: '/dashboard', label: 'My Learning', icon: <LayoutDashboard size={18} />, end: true },
    { to: '/courses', label: 'Browse Courses', icon: <BookOpen size={18} /> },
    { to: '/profile', label: 'Profile', icon: <UserIcon size={18} /> },
  ];

  const completedCount = enrollments.filter((e) => e.completed).length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-6">
      <DashboardSidebar links={links} title="Student Menu" />

      <div className="flex-1">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-slate-500 mb-8">Here's an overview of your learning progress</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5">
            <p className="text-3xl font-extrabold text-slate-900">{enrollments.length}</p>
            <p className="text-sm text-slate-500">Enrolled Courses</p>
          </div>
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5">
            <p className="text-3xl font-extrabold text-green-600">{completedCount}</p>
            <p className="text-sm text-slate-500">Completed</p>
          </div>
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5">
            <p className="text-3xl font-extrabold text-primary-600">{enrollments.length - completedCount}</p>
            <p className="text-sm text-slate-500">In Progress</p>
          </div>
        </div>

        <h2 className="text-lg font-bold text-slate-900 mb-4">My Courses</h2>

        {loading ? (
          <Loader label="Loading your courses..." />
        ) : enrollments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-10 text-center">
            <p className="text-slate-500 mb-4">You haven't enrolled in any courses yet.</p>
            <Link
              to="/courses"
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-xl transition"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {enrollments.map((e) => (
              <div key={e._id} className="bg-white rounded-2xl shadow-card border border-slate-100 p-5 flex flex-col">
                <img
                  src={e.course?.thumbnail}
                  alt={e.course?.title}
                  className="w-full aspect-video object-cover rounded-xl mb-4"
                />
                <h3 className="font-bold text-slate-900 mb-1 line-clamp-2">{e.course?.title}</h3>
                <p className="text-sm text-slate-500 mb-3">{e.course?.instructor?.name}</p>
                <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{ width: `${e.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{e.progress}% complete</span>
                  {e.course?.lessons?.[0] && (
                    <Link
                      to={`/learn/${e.course._id}/lessons/${e.course.lessons[0]._id || e.course.lessons[0]}`}
                      className="text-sm font-semibold text-primary-600 hover:underline"
                    >
                      {e.progress > 0 ? 'Continue' : 'Start'} &rarr;
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
