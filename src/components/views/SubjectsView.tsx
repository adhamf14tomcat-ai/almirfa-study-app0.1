import React, { useState } from 'react';
import { BookOpen, Plus, Edit2, Trash2, Check, X, Clock, Target } from 'lucide-react';
import { SubjectItem, StudySession } from '../../types';

interface SubjectsViewProps {
  subjects: SubjectItem[];
  sessions: StudySession[];
  onAddSubject: (subject: Omit<SubjectItem, 'id' | 'createdAt'>) => void;
  onUpdateSubject: (subject: SubjectItem) => void;
  onDeleteSubject: (id: string) => void;
}

const PRESET_COLORS = [
  '#0284c7', // Sky
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#f97316', // Orange
  '#14b8a6', // Teal
  '#64748b', // Slate
];

export const SubjectsView: React.FC<SubjectsViewProps> = ({
  subjects,
  sessions,
  onAddSubject,
  onUpdateSubject,
  onDeleteSubject,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectItem | null>(null);

  const [name, setName] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [targetMinutes, setTargetMinutes] = useState(60);

  const handleOpenAdd = () => {
    setName('');
    setColor(PRESET_COLORS[0]);
    setTargetMinutes(60);
    setEditingSubject(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (sub: SubjectItem) => {
    setName(sub.name);
    setColor(sub.color);
    setTargetMinutes(sub.targetMinutes || 60);
    setEditingSubject(sub);
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingSubject) {
      onUpdateSubject({
        ...editingSubject,
        name: name.trim(),
        color,
        targetMinutes,
      });
    } else {
      onAddSubject({
        name: name.trim(),
        color,
        targetMinutes,
      });
    }

    setShowAddModal(false);
  };

  // Calculate stats per subject
  const subjectStats = (id: string) => {
    const subSessions = sessions.filter((s) => s.subjectId === id);
    const totalMinutes = subSessions.reduce((sum, s) => sum + s.durationMinutes, 0);
    const count = subSessions.length;
    return { totalMinutes, count };
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4 sm:py-6 space-y-6 text-right">
      {/* Header */}
      <div
        className="rounded-3xl p-6 sm:p-7 border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        <div>
          <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
            <span>إدارة المواد والمشاريع</span>
            <BookOpen className="w-6 h-6 text-sky-500" />
          </h2>
          <p className="mt-1 text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
            نظّم وقتك وخصص ألوانًا وأهدافًا لكل مادة دراسية أو مشروع بحثي
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-white shadow-md transition cursor-pointer hover:opacity-90 active:scale-95"
          style={{ backgroundColor: 'var(--primary-color)' }}
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مادة جديدة</span>
        </button>
      </div>

      {/* Subject List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {subjects.map((sub) => {
          const stats = subjectStats(sub.id);
          const hours = (stats.totalMinutes / 60).toFixed(1);

          return (
            <div
              key={sub.id}
              className="p-5 rounded-3xl border shadow-xs transition-all flex flex-col justify-between gap-4"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-xs flex-shrink-0"
                    style={{ backgroundColor: sub.color }}
                  >
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">{sub.name}</h3>
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <Target className="w-3.5 h-3.5" />
                      <span>الهدف: {sub.targetMinutes} دقيقة</span>
                    </div>
                  </div>
                </div>

                {/* Edit & Delete actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(sub)}
                    className="p-1.5 rounded-xl border transition hover:opacity-80"
                    style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-elevated)' }}
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                  </button>

                  {subjects.length > 1 && (
                    <button
                      onClick={() => {
                        if (confirm(`هل أنت متأكد من رغبتك في حذف مادة «${sub.name}»؟`)) {
                          onDeleteSubject(sub.id);
                        }
                      }}
                      className="p-1.5 rounded-xl border transition hover:bg-rose-500/10 text-rose-500"
                      style={{ borderColor: 'var(--border-color)' }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Stats Footer */}
              <div
                className="p-3 rounded-2xl border flex items-center justify-between text-xs"
                style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-color)' }}
              >
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-500" />
                  <span>الوقت المنجز:</span>
                </div>
                <span className="font-mono font-bold">
                  {hours} ساعة ({stats.count} جلسة)
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-3xl p-6 shadow-2xl border transition-all text-right"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg border transition hover:opacity-80"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
              <h3 className="font-bold text-base">
                {editingSubject ? 'تعديل المادة الدراسية' : 'إضافة مادة دراسية جديدة'}
              </h3>
            </div>

            <div className="mt-5 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                  اسم المادة أو المشروع
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: الرياضيات المتقدمة، البرمجة، الأحياء..."
                  className="w-full p-2.5 rounded-xl border text-sm"
                  style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-color)' }}
                />
              </div>

              {/* Target Minutes */}
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                  الهدف اليومي المخصص للمادة (بالدقائق)
                </label>
                <input
                  type="number"
                  min="15"
                  max="480"
                  step="15"
                  value={targetMinutes}
                  onChange={(e) => setTargetMinutes(parseInt(e.target.value) || 60)}
                  className="w-full p-2.5 rounded-xl border text-sm font-mono"
                  style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-color)' }}
                />
              </div>

              {/* Color Presets */}
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  لون المادة
                </label>
                <div className="flex items-center gap-2.5">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full transition cursor-pointer flex items-center justify-center ${
                        color === c ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: c }}
                    >
                      {color === c && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl border text-xs font-semibold"
                style={{ borderColor: 'var(--border-color)' }}
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl text-xs font-bold text-white shadow-md cursor-pointer"
                style={{ backgroundColor: 'var(--primary-color)' }}
              >
                {editingSubject ? 'حفظ التعديلات' : 'إضافة المادة'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
