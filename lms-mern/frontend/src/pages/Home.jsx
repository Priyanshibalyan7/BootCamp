import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, ArrowRight } from 'lucide-react';
import api from '../api/axios';
import CourseCard from '../components/CourseCard';
import Loader from '../components/Loader';

const stats = [
  { icon: <BookOpen size={22} />, label: 'Courses', value: '500+' },
  { icon: <Users size={22} />, label: 'Active Students', value: '20K+' },
  { icon: <Award size={22} />, label: 'Certified Instructors', value: '150+' },
];

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get('/courses?limit=6');
        setCourses(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-white/15 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
              #1 MERN Stack Learning Platform
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
              Learn new skills, <br /> anytime, anywhere.
            </h1>
            <p className="text-lg text-primary-50/90 mb-8 max-w-lg">
              Join thousands of learners mastering web development, data science, design and more with expert-led courses.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/courses"
                className="bg-white text-primary-700 font-semibold px-6 py-3 rounded-xl shadow-lg hover:bg-primary-50 transition flex items-center gap-2"
              >
                Explore Courses <ArrowRight size={18} />
              </Link>
              <Link
                to="/register"
                className="border border-white/40 font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition"
              >
                Join for Free
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              src="https://placehold.co/560x420/2749e8/ffffff?text=EduSphere+LMS"
              alt="Learning illustration"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
        <div className="bg-white rounded-2xl shadow-card border border-slate-100 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {stats.map((s) => (
            <div key={s.label} className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                {s.icon}
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900">{s.value}</p>
                <p className="text-sm text-slate-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Featured Courses</h2>
            <p className="text-slate-500 mt-1">Hand-picked courses to get you started</p>
          </div>
          <Link to="/courses" className="text-sm font-semibold text-primary-600 hover:underline hidden sm:block">
            View all &rarr;
          </Link>
        </div>

        {loading ? (
          <Loader label="Loading featured courses..." />
        ) : courses.length === 0 ? (
          <p className="text-slate-500">No courses available yet. Check back soon!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-extrabold mb-4">Ready to start teaching?</h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Share your knowledge with thousands of eager learners. Create and publish your own course in minutes.
          </p>
          <Link
            to="/register"
            className="bg-primary-600 hover:bg-primary-700 transition px-8 py-3 rounded-xl font-semibold inline-block"
          >
            Become an Instructor
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
