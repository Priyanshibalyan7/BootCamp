import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, User as UserIcon, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';
import Loader from '../components/Loader';
import DashboardSidebar from '../components/DashboardSidebar';
import toast from 'react-hot-toast';

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const { data } = await api.get('/courses/instructor/my-courses');
      setCourses(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course? This cannot be undone.')) return;
    try {
      await api.delete(`/courses/${id}`);
      toast.success('Course deleted');
      setCourses(courses.filter((c) => c._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete course');
    }
  };

  const togglePublish = async (course) => {
    try {
      const { data } = await api.put(`/courses/${course._id}`, { published: !course.published });
      setCourses(courses.map((c) => (c._id === course._id ? data.data : c)));
      toast.success(data.data.published ? 'Course published' : 'Course unpublished');
    } catch (err) {
      toast.error('Failed to update course status');
    }
  };

  const links = [
    { to: '/instructor', label: 'My Courses', icon: <LayoutDashboard size={18} />, end: true },
    { to: '/instructor/courses/new', label: 'Create Course', icon: <PlusCircle size={18} /> },
    { to: '/profile', label: 'Profile', icon: <UserIcon size={18} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-6">
      <DashboardSidebar links={links} title="Instructor Menu" />

      <div className="flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">My Courses</h1>
            <p className="text-slate-500">Manage and track your published content</p>
          </div>
          <Link
            to="/instructor/courses/new"
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-4 py-2.5 rounded-xl transition"
          >
            <PlusCircle size={18} /> New Course
          </Link>
        </div>

        {loading ? (
          <Loader label="Loading your courses..." />
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-10 text-center">
            <p className="text-slate-500 mb-4">You haven't created any courses yet.</p>
            <Link
              to="/instructor/courses/new"
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-xl transition"
            >
              Create Your First Course
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 divide-y divide-slate-100">
            {courses.map((course) => (
              <div key={course._id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full sm:w-32 aspect-video object-cover rounded-xl"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900">{course.title}</h3>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        course.published ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                      }`}
                    >
                      {course.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    {course.category} &middot; {course.enrolledStudents?.length || 0} students &middot; $
                    {course.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePublish(course)}
                    title={course.published ? 'Unpublish' : 'Publish'}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
                  >
                    {course.published ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <Link
                    to={`/instructor/courses/${course._id}/edit`}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
                    title="Edit course"
                  >
                    <Pencil size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                    title="Delete course"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
