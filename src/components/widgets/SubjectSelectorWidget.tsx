import React from 'react';
import { BookOpen, Plus, Settings2 } from 'lucide-react';
import { SubjectItem } from '../../types';

interface SubjectSelectorWidgetProps {
  subjects: SubjectItem[];
  selectedSubjectId: string;
  onSelectSubject: (id: string) => void;
  onManageSubjects: () => void;
}

export const SubjectSelectorWidget: React.FC<SubjectSelectorWidgetProps> = ({
  subjects,
  selectedSubjectId,
  onSelectSubject,
  onManageSubjects,
}) => {
  const currentSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  return (
    <div
      id="subject-selector-widget"
      className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl border shadow-xs"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs"
          style={{ backgroundColor: currentSubject ? currentSubject.color : 'var(--primary-color)' }}
        >
          <BookOpen className="w-4 h-4" />
        </div>

        <div className="text-right">
          <label htmlFor="subject-select" className="text-[11px] block font-medium" style={{ color: 'var(--text-muted)' }}>
            المادة الدراسية الحالية
          </label>
          <div className="relative mt-0.5">
            <select
              id="subject-select"
              value={selectedSubjectId}
              onChange={(e) => onSelectSubject(e.target.value)}
              className="font-bold text-sm bg-transparent border-0 cursor-pointer pr-0 pl-6 focus:ring-0 focus:outline-hidden"
              style={{ color: 'var(--text-primary)' }}
            >
              {subjects.map((sub) => (
                <option
                  key={sub.id}
                  value={sub.id}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {sub.name} {sub.targetMinutes > 0 ? `(${sub.targetMinutes} دقيقة)` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center">
        <button
          onClick={onManageSubjects}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition cursor-pointer hover:opacity-80"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-secondary)',
          }}
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>إدارة المواد</span>
        </button>
      </div>
    </div>
  );
};
