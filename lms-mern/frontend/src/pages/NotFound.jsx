import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => (
  <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center text-center px-4">
    <p className="text-7xl font-extrabold text-primary-600 mb-2">404</p>
    <h1 className="text-2xl font-bold text-slate-900 mb-2">Page not found</h1>
    <p className="text-slate-500 mb-8 max-w-md">
      The page you're looking for doesn't exist or may have been moved.
    </p>
    <Link
      to="/"
      className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl transition"
    >
      <Home size={18} /> Back to Home
    </Link>
  </div>
);

export default NotFound;
