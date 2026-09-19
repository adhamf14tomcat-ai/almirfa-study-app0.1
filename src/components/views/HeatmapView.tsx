import React, { useState, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X, Clock, Star } from 'lucide-react';
import { StudySession, SubjectItem } from '../../types';

interface HeatmapViewProps {
  sessions: StudySession[];
  subjects: SubjectItem[];
}

type TimeRange = '3months' | '6months' | '1year';

export const HeatmapView: React.FC<HeatmapViewProps> = ({ sessions, subjects }) => {
  const [range, setRange] = useState<TimeRange>('3months');
  const [selectedDay, setSelectedDay] = useState<{
    dateStr: string;
    totalMinutes: number;
    daySessions: StudySession[];
  } | null>(null);

  // Generate date grid for range
  const daysData = useMemo(() => {
    const daysCount = range === '3months' ? 90 : range === '6months' ? 180 : 365;
    const now = new Date();
    const result: {
      date: Date;
      dateStr: string;
      totalMinutes: number;
      sessions: StudySession[];
    }[] = [];

    // Map sessions by date string YYYY-MM-DD
    const sessionMap: Record<string, StudySession[]> = {};
    sessions.forEach((s) => {
      if (s.date) {
        if (!sessionMap[s.date]) sessionMap[s.date] = [];
        sessionMap[s.date].push(s);
      }
    });

    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const daySessions = sessionMap[dateStr] || [];
      const totalMinutes = daySessions.reduce((sum, s) => sum + s.durationMinutes, 0);

      result.push({
        date: d,
        dateStr,
        totalMinutes,
        sessions: daySessions,
      });
    }

    return result;
  }, [range, sessions]);

  // Color intensity calculation
  const getCellColor = (minutes: number) => {
    if (minutes === 0) {
      return 'bg-slate-200/60 dark:bg-slate-800/80 border-slate-300/40 dark:border-slate-700/40';
    }
    if (minutes < 30) {
      return 'bg-sky-200 dark:bg-sky-950 border-sky-300 dark:border-sky-800';
    }
    if (minutes < 60) {
      return 'bg-sky-400 dark:bg-sky-700 border-sky-500 dark:border-sky-600';
    }
    if (minutes < 120) {
      return 'bg-sky-600 dark:bg-sky-500 border-sky-700 dark:border-sky-400';
    }
    return 'bg-sky-800 dark:bg-sky-300 border-sky-900 dark:border-sky-200';
  };

  const getSubjectName = (id: string) => {
    return subjects.find((s) => s.id === id)?.name || 'مادة دراسية';
  };

  const getSubjectColor = (id: string) => {
    return subjects.find((s) => s.id === id)?.color || '#0284c7';
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4 sm:py-6 space-y-6 text-right">
      {/* Header with Range Switcher */}
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
            <span>الخريطة الحرارية للإنتاجية</span>
            <Calendar className="w-6 h-6 text-sky-500" />
          </h2>
          <p className="mt-1 text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
            تتبع بصري لمجهودك اليومي ومقدار الساعات المنفذة خلال الأشهر
          </p>
        </div>

        {/* Range Buttons */}
        <div
          className="flex items-center p-1 rounded-2xl border"
          style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-color)' }}
        >
          <button
            onClick={() => setRange('3months')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              range === '3months' ? 'shadow-xs font-bold' : 'opacity-70 hover:opacity-100'
            }`}
            style={
              range === '3months'
                ? { backgroundColor: 'var(--primary-color)', color: '#ffffff' }
                : { color: 'var(--text-secondary)' }
            }
          >
            3 أشهر
          </button>
          <button
            onClick={() => setRange('6months')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              range === '6months' ? 'shadow-xs font-bold' : 'opacity-70 hover:opacity-100'
            }`}
            style={
              range === '6months'
                ? { backgroundColor: 'var(--primary-color)', color: '#ffffff' }
                : { color: 'var(--text-secondary)' }
            }
          >
            6 أشهر
          </button>
          <button
            onClick={() => setRange('1year')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              range === '1year' ? 'shadow-xs font-bold' : 'opacity-70 hover:opacity-100'
            }`}
            style={
              range === '1year'
                ? { backgroundColor: 'var(--primary-color)', color: '#ffffff' }
                : { color: 'var(--text-secondary)' }
            }
          >
            سنة كاملة
          </button>
        </div>
      </div>

      {/* Heatmap Grid Card */}
      <div
        className="rounded-3xl p-6 sm:p-7 border shadow-xs overflow-x-auto"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        <div className="min-w-[650px]">
          {/* Days Grid */}
          <div className="flex flex-wrap gap-1.5 py-2">
            {daysData.map((item) => {
              return (
                <button
                  key={item.dateStr}
                  onClick={() =>
                    setSelectedDay({
                      dateStr: item.dateStr,
                      totalMinutes: item.totalMinutes,
                      daySessions: item.sessions,
                    })
                  }
                  title={`${item.dateStr}: ${item.totalMinutes} دقيقة (${item.sessions.length} جلسة)`}
                  className={`w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-md border transition-transform hover:scale-130 cursor-pointer ${getCellColor(
                    item.totalMinutes
                  )}`}
                />
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t flex flex-wrap items-center justify-between text-xs" style={{ borderColor: 'var(--border-color)' }}>
            <span style={{ color: 'var(--text-muted)' }}>اضغط على أي مربع لاستعراض تفاصيل اليوم</span>
            <div className="flex items-center gap-2">
              <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                أقل
              </span>
              <div className="flex items-center gap-1">
                <span className="w-3.5 h-3.5 rounded-xs bg-slate-200 dark:bg-slate-800 border" />
                <span className="w-3.5 h-3.5 rounded-xs bg-sky-200 dark:bg-sky-950 border" />
                <span className="w-3.5 h-3.5 rounded-xs bg-sky-400 dark:bg-sky-700 border" />
                <span className="w-3.5 h-3.5 rounded-xs bg-sky-600 dark:bg-sky-500 border" />
                <span className="w-3.5 h-3.5 rounded-xs bg-sky-800 dark:bg-sky-300 border" />
              </div>
              <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                أكثر
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Day Details Modal */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div
            className="w-full max-w-md rounded-3xl p-6 shadow-2xl border transition-all text-right max-h-[85vh] overflow-y-auto"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <button
                onClick={() => setSelectedDay(null)}
                className="p-1.5 rounded-lg border transition hover:opacity-80"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">تفاصيل جلسات اليوم</h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-500/10">
                  {selectedDay.dateStr}
                </span>
              </div>
            </div>

            {/* Total time pill */}
            <div
              className="my-4 p-4 rounded-2xl border flex items-center justify-between"
              style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-color)' }}
            >
              <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                إجمالي وقت المذاكرة
              </span>
              <span className="text-lg font-bold font-mono" style={{ color: 'var(--primary-color)' }}>
                {selectedDay.totalMinutes} دقيقة ({selectedDay.daySessions.length} جلسة)
              </span>
            </div>

            {/* Session List */}
            {selectedDay.daySessions.length > 0 ? (
              <div className="space-y-3">
                {selectedDay.daySessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-3.5 rounded-2xl border text-xs space-y-1.5"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: getSubjectColor(session.subjectId) }}
                        />
                        <span>{getSubjectName(session.subjectId)}</span>
                      </div>
                      <span className="font-mono">{session.durationMinutes} دقيقة</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{session.mode === 'pomodoro' ? 'مؤقت بومودورو' : 'عداد تصاعدي'}</span>
                      {session.rating && session.rating > 0 && (
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{session.rating} / 5</span>
                        </div>
                      )}
                    </div>

                    {session.note && (
                      <p className="mt-1 p-2 rounded-xl bg-slate-500/5 text-slate-600 dark:text-slate-300 italic">
                        «{session.note}»
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                لا توجد جلسات مسجلة في هذا اليوم.
              </div>
            )}

            <button
              onClick={() => setSelectedDay(null)}
              className="mt-6 w-full py-2.5 rounded-xl text-xs font-bold text-white shadow-xs cursor-pointer"
              style={{ backgroundColor: 'var(--primary-color)' }}
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
