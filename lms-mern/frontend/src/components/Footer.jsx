import { GraduationCap } from 'lucide-react';

const Footer = () => (
  <footer className="bg-slate-900 text-slate-300 mt-24">
    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
          <span className="bg-primary-600 p-1.5 rounded-lg">
            <GraduationCap size={18} />
          </span>
          EduSphere
        </div>
        <p className="text-sm text-slate-400">
          A modern learning management system built with the MERN stack &mdash; MongoDB, Express, React and Node.js.
        </p>
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3">Platform</h4>
        <ul className="space-y-2 text-sm text-slate-400">
          <li>Browse Courses</li>
          <li>Become an Instructor</li>
          <li>Pricing</li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3">Company</h4>
        <ul className="space-y-2 text-sm text-slate-400">
          <li>About Us</li>
          <li>Careers</li>
          <li>Contact</li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3">Legal</h4>
        <ul className="space-y-2 text-sm text-slate-400">
          <li>Privacy Policy</li>
          <li>Terms of Service</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
      &copy; {new Date().getFullYear()} EduSphere LMS. All rights reserved.
    </div>
  </footer>
);

export default Footer;
