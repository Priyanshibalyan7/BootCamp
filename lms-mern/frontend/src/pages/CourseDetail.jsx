import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Clock, BarChart3, PlayCircle, Lock, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrollment, setEnrollment] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  const fetchCourse = async () => {
    try {
      const { data } = await api.get(`/courses/${id}`);
      setCourse(data.data);
    } catch (err) {
      toast.error('Course not found');
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollment = async () => {
    if (!user || user.role !== 'student') return;
    try {
      const { data } = await api.get(`/enrollments/${id}/status`);
      setEnrollment(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    fetchEnrollment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, id]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }
    if (user.role !== 'student') {
      toast.error('Only students can enroll in courses');
      return;
    }
    setEnrolling(true);
    try {
      const { data } = await api.post(`/enrollments/${id}`);
      setEnrollment(data.data);
      toast.success('Successfully enrolled!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/courses/${id}/reviews`, reviewForm);
      toast.success('Review submitted!');
      fetchCourse();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) return <Loader label="Loading course details..." />;
  if (!course) return null;

  const totalDuration = course.lessons?.reduce((acc, l) => acc + (l.duration || 0), 0) || 0;

  return (
    <div>
      <section className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <span className="inline-block bg-primary-600/20 text-primary-300 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              {course.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4">{course.title}</h1>
            <p className="text-slate-300 mb-6 max-w-2xl">{course.shortDescription || course.description}</p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300">
              <span className="flex items-center gap-1.5">
                <Star size={16} className="text-amber-400 fill-amber-400" />
                {course.averageRating > 0 ? course.averageRating.toFixed(1) : 'New'} ({course.ratings?.length || 0} reviews)
              </span>
              <span className="flex items-center gap-1.5">
                <BarChart3 size={16} /> {course.level}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={16} /> {totalDuration} min total
              </span>
              <span>{course.enrolledStudents?.length || 0} students enrolled</span>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <div className="h-11 w-11 rounded-full bg-primary-600 flex items-center justify-center font-bold">
                {course.instructor?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm text-slate-400">Created by</p>
                <p className="font-semibold">{course.instructor?.name}</p>
              </div>
            </div>
          </div>

          <div className="bg-white text-slate-900 rounded-2xl shadow-xl p-6 h-fit">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full aspect-video object-cover rounded-xl mb-5"
            />
            <p className="text-3xl font-extrabold mb-4">
              {course.price > 0 ? `$${course.price.toFixed(2)}` : 'Free'}
            </p>

            {enrollment ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-600 font-semibold text-sm">
                  <CheckCircle2 size={18} /> You're enrolled
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div
                    className="bg-primary-600 h-2.5 rounded-full transition-all"
                    style={{ width: `${enrollment.progress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500">{enrollment.progress}% complete</p>
                {course.lessons?.[0] && (
                  <Link
                    to={`/learn/${course._id}/lessons/${course.lessons[0]._id}`}
                    className="block text-center bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl transition"
                  >
                    Continue Learning
                  </Link>
                )}
              </div>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition"
              >
                {enrolling ? 'Enrolling...' : 'Enroll Now'}
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">About this course</h2>
            <p className="text-slate-600 whitespace-pre-line leading-relaxed">{course.description}</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Course Content</h2>
            <div className="bg-white rounded-2xl shadow-card border border-slate-100 divide-y divide-slate-100">
              {course.lessons?.length === 0 && (
                <p className="p-5 text-slate-500 text-sm">No lessons added yet.</p>
              )}
              {course.lessons?.map((lesson, idx) => {
                const canAccess = lesson.isPreview || enrollment || course.instructor?._id === user?._id;
                return (
                  <div key={lesson._id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <span className="h-8 w-8 rounded-lg bg-slate-100 text-slate-500 text-sm font-semibold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{lesson.title}</p>
                        <p className="text-xs text-slate-400">{lesson.duration} min</p>
                      </div>
                    </div>
                    {canAccess ? (
                      <Link
                        to={`/learn/${course._id}/lessons/${lesson._id}`}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <PlayCircle size={20} />
                      </Link>
                    ) : (
                      <Lock size={18} className="text-slate-300" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Student Reviews</h2>
            {enrollment && (
              <form onSubmit={handleReviewSubmit} className="bg-white rounded-2xl shadow-card border border-slate-100 p-5 mb-6 space-y-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    >
                      <Star
                        size={22}
                        className={star <= reviewForm.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Share your thoughts about this course..."
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                />
                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition"
                >
                  Submit Review
                </button>
              </form>
            )}

            <div className="space-y-4">
              {course.ratings?.length === 0 && <p className="text-slate-500 text-sm">No reviews yet.</p>}
              {course.ratings?.map((r, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-card border border-slate-100 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm text-slate-800">{r.user?.name || 'Student'}</p>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6">
            <h3 className="font-bold text-slate-900 mb-3">About the Instructor</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                {course.instructor?.name?.charAt(0).toUpperCase()}
              </div>
              <p className="font-semibold text-slate-800">{course.instructor?.name}</p>
            </div>
            <p className="text-sm text-slate-500">{course.instructor?.bio || 'No bio provided.'}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetail;
