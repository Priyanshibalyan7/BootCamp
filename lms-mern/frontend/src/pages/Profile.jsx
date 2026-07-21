import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUserState } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
    password: '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name: form.name, bio: form.bio, avatar: form.avatar };
      if (form.password) payload.password = form.password;
      const { data } = await api.put('/auth/profile', payload);
      updateUserState(data.data);
      toast.success('Profile updated successfully');
      setForm({ ...form, password: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-extrabold text-slate-900 mb-8">My Profile</h1>

      <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-2xl font-bold overflow-hidden">
            {form.avatar ? (
              <img src={form.avatar} alt={form.name} className="h-full w-full object-cover" />
            ) : (
              user?.name?.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <p className="font-bold text-slate-900">{user?.name}</p>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <span className="text-xs font-semibold capitalize bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full mt-1 inline-block">
              {user?.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Avatar URL</label>
            <input
              type="text"
              name="avatar"
              value={form.avatar}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Bio</label>
            <textarea
              name="bio"
              rows={4}
              value={form.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">New Password (optional)</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl transition"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
