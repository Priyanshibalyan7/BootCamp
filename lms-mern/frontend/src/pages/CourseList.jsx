import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import api from '../api/axios';
import CourseCard from '../components/CourseCard';
import Loader from '../components/Loader';

const categories = [
  'All',
  'Web Development',
  'Data Science',
  'Mobile Development',
  'Design',
  'Business',
  'Marketing',
  'Programming Languages',
  'Other',
];

const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);
        if (category !== 'All') params.append('category', category);
        if (level !== 'All') params.append('level', level);
        params.append('page', page);
        params.append('limit', 9);

        const { data } = await api.get(`/courses?${params.toString()}`);
        setCourses(data.data);
        setPages(data.pages || 1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    const timeout = setTimeout(fetchCourses, 300);
    return () => clearTimeout(timeout);
  }, [keyword, category, level, page]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Browse Courses</h1>
        <p className="text-slate-500">Discover courses taught by expert instructors from around the world</p>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5 mb-8 space-y-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => {
              setPage(1);
              setKeyword(e.target.value);
            }}
            placeholder="Search for courses..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <select
            value={category}
            onChange={(e) => {
              setPage(1);
              setCategory(e.target.value);
            }}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={level}
            onChange={(e) => {
              setPage(1);
              setLevel(e.target.value);
            }}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {levels.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <Loader label="Fetching courses..." />
      ) : courses.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-slate-500 font-medium">No courses match your search.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>

          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-9 w-9 rounded-lg text-sm font-semibold transition ${
                    p === page
                      ? 'bg-primary-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CourseList;
