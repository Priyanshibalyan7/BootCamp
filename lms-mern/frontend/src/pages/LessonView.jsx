import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle, PlayCircle, Lock, ArrowLeft, ArrowRight } from 'lucide-react';
import api from '../api/axios';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LessonView = () => {
  const { courseId, lessonId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [courseRes, lessonRes, enrollRes] = await Promise.all([
        api.get(`/courses/${courseId}`),
        api.get(`/lessons/${lessonId}`),
        api.get(`/enrollments/${courseId}/status`),
      ]);
      setCourse(courseRes.data.data);
      setLesson(lessonRes.data.data);
      setEnrollment(enrollRes.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to load lesson');
      navigate(`/courses/${courseId}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, lessonId]);

  const handleMarkComplete = async () => {
    try {
      const { data } = await api.put(`/enrollments/${courseId}/complete-lesson/${lessonId}`);
      setEnrollment(data.data);
      toast.success('Lesson marked as complete!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update progress');
    }
  };

  if (loading) return <Loader label="Loading lesson..." />;
  if (!course || !lesson) return null;

  const lessons = course.lessons || [];
  const currentIndex = lessons.findIndex((l) => l._id === lessonId);
  const prevLesson = lessons[currentIndex - 1];
  const nextLesson = lessons[currentIndex + 1];
  const isCompleted = enrollment?.completedLessons?.some((l) => l === lessonId || l._id === lessonId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-4 gap-6">
      <aside className="lg:col-span-1 order-2 lg:order-1">
        <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-4 sticky top-24">
          <Link to={`/courses/${course._id}`} className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary-600 mb-4">
            <ArrowLeft size={16} /> Back to course
          </Link>
          <h3 className="font-bold text-slate-900 mb-3 text-sm">{course.title}</h3>
          {enrollment && (
            <div className="mb-4">
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all"
                  style={{ width: `${enrollment.progress}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">{enrollment.progress}% complete</p>
            </div>
          )}
          <div className="space-y-1 max-h-[60vh] overflow-y-auto">
            {lessons.map((l, idx) => {
              const complete = enrollment?.completedLessons?.some((c) => c === l._id || c._id === l._id);
              const canAccess = l.isPreview || enrollment || course.instructor?._id === user?._id;
              return canAccess ? (
                <Link
                  key={l._id}
                  to={`/learn/${course._id}/lessons/${l._id}`}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition ${
                    l._id === lessonId ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {complete ? (
                    <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                  ) : (
                    <Circle size={16} className="text-slate-300 shrink-0" />
                  )}
                  <span className="line-clamp-1">{idx + 1}. {l.title}</span>
                </Link>
              ) : (
                <div key={l._id} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-400">
                  <Lock size={16} className="shrink-0" />
                  <span className="line-clamp-1">{idx + 1}. {l.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      <main className="lg:col-span-3 order-1 lg:order-2">
        <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
          <div className="aspect-video bg-slate-900 flex items-center justify-center text-white">
            {lesson.videoUrl ? (
              <iframe
                src={lesson.videoUrl}
                title={lesson.title}
                className="w-full h-full"
                allowFullScreen
              />
            ) : (
              <div className="text-center">
                <PlayCircle size={48} className="mx-auto mb-2 text-slate-500" />
                <p className="text-slate-400 text-sm">No video attached to this lesson</p>
              </div>
            )}
          </div>

          <div className="p-6">
            <h1 className="text-2xl font-extrabold text-slate-900 mb-2">{lesson.title}</h1>
            <p className="text-sm text-slate-400 mb-6">{lesson.duration} min read/watch</p>
            <div className="prose prose-slate max-w-none text-slate-700 whitespace-pre-line leading-relaxed">
              {lesson.content}
            </div>

            {lesson.resources?.length > 0 && (
              <div className="mt-8">
                <h3 className="font-bold text-slate-900 mb-3">Resources</h3>
                <ul className="space-y-2">
                  {lesson.resources.map((r, idx) => (
                    <li key={idx}>
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary-600 hover:underline text-sm"
                      >
                        {r.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 mt-10 pt-6 border-t border-slate-100">
              <div>
                {prevLesson && (
                  <Link
                    to={`/learn/${course._id}/lessons/${prevLesson._id}`}
                    className="flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-primary-600"
                  >
                    <ArrowLeft size={16} /> Previous
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-3">
                {enrollment && !isCompleted && (
                  <button
                    onClick={handleMarkComplete}
                    className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
                  >
                    Mark as Complete
                  </button>
                )}
                {isCompleted && (
                  <span className="flex items-center gap-2 text-green-600 text-sm font-semibold">
                    <CheckCircle2 size={18} /> Completed
                  </span>
                )}
                {nextLesson && (
                  <Link
                    to={`/learn/${course._id}/lessons/${nextLesson._id}`}
                    className="flex items-center gap-1 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
                  >
                    Next <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LessonView;
