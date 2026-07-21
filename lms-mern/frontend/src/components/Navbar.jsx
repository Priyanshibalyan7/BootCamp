import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, X, LogOut, LayoutDashboard, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const dashboardPath =
    user?.role === 'admin'
      ? '/admin'
      : user?.role === 'instructor'
      ? '/instructor'
      : '/dashboard';

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 font-extrabold text-xl text-slate-900">
            <span className="bg-primary-600 text-white p-1.5 rounded-lg">
              <GraduationCap size={20} />
            </span>
            EduSphere
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/courses" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition">
              Browse Courses
            </Link>
            {user?.role === 'instructor' && (
              <Link to="/instructor" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition">
                Teach
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition">
                Admin Panel
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-primary-600 px-4 py-2 transition"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-primary-600 px-3 py-2 rounded-lg hover:bg-slate-50 transition"
                >
                  <span className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                  {user.name?.split(' ')[0]}
                </button>
                {menuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-card border border-slate-100 py-2"
                    onMouseLeave={() => setMenuOpen(false)}
                  >
                    <Link
                      to={dashboardPath}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <User size={16} /> Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button className="md:hidden text-slate-700" onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          <Link to="/courses" onClick={() => setOpen(false)} className="block text-sm font-medium text-slate-700">
            Browse Courses
          </Link>
          {user ? (
            <>
              <Link to={dashboardPath} onClick={() => setOpen(false)} className="block text-sm font-medium text-slate-700">
                Dashboard
              </Link>
              <Link to="/profile" onClick={() => setOpen(false)} className="block text-sm font-medium text-slate-700">
                Profile
              </Link>
              <button onClick={handleLogout} className="block text-sm font-medium text-red-600">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="block text-sm font-medium text-slate-700">
                Log in
              </Link>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="block text-sm font-semibold bg-primary-600 text-white px-4 py-2 rounded-lg text-center"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
