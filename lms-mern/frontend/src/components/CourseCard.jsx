import { Link } from 'react-router-dom';
import { Star, Clock, BarChart3 } from 'lucide-react';

const CourseCard = ({ course }) => {
  return (
    <Link
      to={`/courses/${course._id}`}
      className="group bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200 flex flex-col"
    >
      <div className="aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-full w-fit mb-2">
          {course.category}
        </span>
        <h3 className="font-bold text-slate-900 leading-snug line-clamp-2 mb-1">{course.title}</h3>
        <p className="text-sm text-slate-500 mb-3">{course.instructor?.name || 'Unknown Instructor'}</p>

        <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
          <span className="flex items-center gap-1">
            <BarChart3 size={14} /> {course.level}
          </span>
          <span className="flex items-center gap-1">
            <Star size={14} className="text-amber-400 fill-amber-400" />
            {course.averageRating > 0 ? course.averageRating.toFixed(1) : 'New'}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-extrabold text-slate-900">
            {course.price > 0 ? `$${course.price.toFixed(2)}` : 'Free'}
          </span>
          <span className="text-sm font-semibold text-primary-600 group-hover:underline">View Course &rarr;</span>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
