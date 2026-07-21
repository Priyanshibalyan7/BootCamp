import { useEffect, useState } from 'react';
import { LayoutDashboard, Users, User as UserIcon, ShieldCheck, Trash2 } from 'lucide-react';
import api from '../api/axios';
import Loader from '../components/Loader';
import DashboardSidebar from '../components/DashboardSidebar';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/users/stats/overview'),
        api.get('/users'),
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRoleChange = async (userId, role) => {
    try {
      const { data } = await api.put(`/users/${userId}`, { role });
      setUsers(users.map((u) => (u._id === userId ? data.data : u)));
      toast.success('User role updated');
    } catch (err) {
      toast.error('Failed to update role');
    }
  };

  const toggleActive = async (user) => {
    try {
      const { data } = await api.put(`/users/${user._id}`, { isActive: !user.isActive });
      setUsers(users.map((u) => (u._id === user._id ? data.data : u)));
      toast.success(data.data.isActive ? 'User activated' : 'User deactivated');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await api.delete(`/users/${userId}`);
      setUsers(users.filter((u) => u._id !== userId));
      toast.success('User deleted');
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const links = [
    { to: '/admin', label: 'Overview', icon: <LayoutDashboard size={18} />, end: true },
    { to: '/profile', label: 'Profile', icon: <UserIcon size={18} /> },
  ];

  if (loading) return <Loader label="Loading admin dashboard..." />;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-6">
      <DashboardSidebar links={links} title="Admin Menu" />

      <div className="flex-1">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Platform Overview</h1>
        <p className="text-slate-500 mb-8">Monitor and manage the entire EduSphere platform</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total Users', value: stats.totalUsers },
            { label: 'Students', value: stats.totalStudents },
            { label: 'Instructors', value: stats.totalInstructors },
            { label: 'Total Courses', value: stats.totalCourses },
            { label: 'Published Courses', value: stats.publishedCourses },
            { label: 'Total Enrollments', value: stats.totalEnrollments },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl shadow-card border border-slate-100 p-5">
              <p className="text-2xl font-extrabold text-slate-900">{s.value}</p>
              <p className="text-sm text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Users size={20} className="text-slate-700" />
          <h2 className="text-lg font-bold text-slate-900">User Management</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-100">
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Role</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="px-5 py-3 font-medium text-slate-800 flex items-center gap-2">
                    {u.role === 'admin' && <ShieldCheck size={14} className="text-primary-600" />}
                    {u.name}
                  </td>
                  <td className="px-5 py-3 text-slate-500">{u.email}</td>
                  <td className="px-5 py-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => toggleActive(u)}
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        u.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                      }`}
                    >
                      {u.isActive ? 'Active' : 'Deactivated'}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
