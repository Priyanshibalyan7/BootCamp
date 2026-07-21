import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PlusCircle, Trash2, Pencil, Save, ArrowLeft, X } from 'lucide-react';
import api from '../api/axios';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const emptyCourse = {
  title: '',
  description: '',
  shortDescription: '',
  category: 'Web Development',
  level: 'Beginner',
  price: 0,
  thumbnail: '',
  tags: '',
};

const emptyLesson = { title: '', content: '', videoUrl: '', duration: 10, isPreview: false };

const categories = [
  'Web Development',
  'Data Science',
  'Mobile Development',
  'Design',
  'Business',
  'Marketing',
  'Programming Languages',
  'Other',
];

const CourseEditor = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyCourse);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [lessonForm, setLessonForm] = useState(emptyLesson);
  const [editingLessonId, setEditingLessonId] = useState(null);

  useEffect(() => {
    if (!isEditMode) return;
    const fetchCourse = async () => {
      try {
        const { data } = await api.get(`/courses/${id}`);
        const c = data.data;
        setForm({
          title: c.title,
          description: c.description,
          shortDescription: c.shortDescription || '',
          category: c.category,
          level: c.level,
          price: c.price,
          thumbnail: c.thumbnail,
          tags: (c.tags || []).join(', '),
        });
        setLessons(c.lessons || []);
      } catch (err) {
        toast.error('Failed to load course');
        navigate('/instructor');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };
    try {
      if (isEditMode) {
        await api.put(`/courses/${id}`, payload);
        toast.success('Course updated successfully');
      } else {
        const { data } = await api.post('/courses', payload);
        toast.success('Course created! Now add some lessons.');
        navigate(`/instructor/courses/${data.data._id}/edit`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  const openLessonModal = (lesson = null) => {
    if (lesson) {
      setLessonForm({
        title: lesson.title,
        content: lesson.content,
        videoUrl: lesson.videoUrl || '',
        duration: lesson.duration || 10,
        isPreview: lesson.isPreview || false,
      });
      setEditingLessonId(lesson._id);
    } else {
      setLessonForm(emptyLesson);
      setEditingLessonId(null);
    }
    setShowLessonModal(true);
  };

  const handleLessonSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLessonId) {
        const { data } = await api.put(`/lessons/${editingLessonId}`, lessonForm);
        setLessons(lessons.map((l) => (l._id === editingLessonId ? data.data : l)));
        toast.success('Lesson updated');
      } else {
        const { data } = await api.post(`/courses/${id}/lessons`, {
          ...lessonForm,
          order: lessons.length,
        });
        setLessons([...lessons, data.data]);
        toast.success('Lesson added');
      }
      setShowLessonModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save lesson');
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Delete this lesson?')) return;
    try {
      await api.delete(`/lessons/${lessonId}`);
      setLessons(lessons.filter((l) => l._id !== lessonId));
      toast.success('Lesson deleted');
    } catch (err) {
      toast.error('Failed to delete lesson');
    }
  };

  if (loading) return <Loader label="Loading course editor..." />;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <Link to="/instructor" className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary-600 mb-6">
        <ArrowLeft size={16} /> Back to my courses
      </Link>

      <h1 className="text-2xl font-extrabold text-slate-900 mb-8">
        {isEditMode ? 'Edit Course' : 'Create a New Course'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card border border-slate-100 p-6 space-y-5">
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">Course Title</label>
          <input
            type="text"
            name="title"
            required
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Complete React Developer Course"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">Short Description</label>
          <input
            type="text"
            name="shortDescription"
            value={form.shortDescription}
            onChange={handleChange}
            placeholder="A one-line summary shown on course cards"
            maxLength={200}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">Full Description</label>
          <textarea
            name="description"
            required
            rows={5}
            value={form.description}
            onChange={handleChange}
            placeholder="Describe what students will learn in this course..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Level</label>
            <select
              name="level"
              value={form.level}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            >
              {['Beginner', 'Intermediate', 'Advanced'].map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Price (USD, 0 for free)</label>
            <input
              type="number"
              name="price"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Thumbnail URL</label>
            <input
              type="text"
              name="thumbnail"
              value={form.thumbnail}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="react, javascript, frontend"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl transition"
        >
          <Save size={18} /> {saving ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Course'}
        </button>
      </form>

      {isEditMode && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Lessons ({lessons.length})</h2>
            <button
              onClick={() => openLessonModal()}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
            >
              <PlusCircle size={16} /> Add Lesson
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-card border border-slate-100 divide-y divide-slate-100">
            {lessons.length === 0 && <p className="p-6 text-sm text-slate-500">No lessons yet. Add your first one!</p>}
            {lessons.map((lesson, idx) => (
              <div key={lesson._id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <span className="h-8 w-8 rounded-lg bg-slate-100 text-slate-500 text-sm font-semibold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-medium text-slate-800 text-sm">
                      {lesson.title} {lesson.isPreview && <span className="text-xs text-primary-600 font-semibold ml-1">(Preview)</span>}
                    </p>
                    <p className="text-xs text-slate-400">{lesson.duration} min</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openLessonModal(lesson)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDeleteLesson(lesson._id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showLessonModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg text-slate-900">
                {editingLessonId ? 'Edit Lesson' : 'Add Lesson'}
              </h3>
              <button onClick={() => setShowLessonModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleLessonSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Lesson Title</label>
                <input
                  type="text"
                  required
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Content</label>
                <textarea
                  required
                  rows={4}
                  value={lessonForm.content}
                  onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Video URL (embed link, optional)</label>
                <input
                  type="text"
                  value={lessonForm.videoUrl}
                  onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/embed/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Duration (min)</label>
                  <input
                    type="number"
                    min="0"
                    value={lessonForm.duration}
                    onChange={(e) => setLessonForm({ ...lessonForm, duration: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>
                <label className="flex items-center gap-2 mt-6 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={lessonForm.isPreview}
                    onChange={(e) => setLessonForm({ ...lessonForm, isPreview: e.target.checked })}
                    className="rounded border-slate-300"
                  />
                  Free preview lesson
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-xl transition"
              >
                {editingLessonId ? 'Save Lesson' : 'Add Lesson'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseEditor;
