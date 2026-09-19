import React, { useState } from 'react';
import {
  CalendarDays,
  Target,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { AdaptivePlannerData, SubjectItem, StudySession } from '../../types';

interface AdaptivePlannerViewProps {
  planner: AdaptivePlannerData;
  subjects: SubjectItem[];
  sessions: StudySession[];
  onUpdatePlanner: (data: AdaptivePlannerData) => void;
}

export const AdaptivePlannerView: React.FC<AdaptivePlannerViewProps> = ({
  planner,
  subjects,
  sessions,
  onUpdatePlanner,
}) => {
  const [weeklyTargetHours, setWeeklyTargetHours] = useState(planner.weeklyTargetHours);
  const [availableDays, setAvailableDays] = useState<number[]>(planner.availableDays);
  const [dailyMaxHours, setDailyMaxHours] = useState(planner.dailyMaxHours);
  const [subjectPriorities, setSubjectPriorities] = useState(planner.subjectPriorities || {});

  // Calculate actual hours completed this current week (from Monday or Sunday)
  const now = new Date();
  const currentDayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday ...
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - currentDayOfWeek);
  weekStart.setHours(0, 0, 0, 0);

  const completedMinutesThisWeek = sessions
    .filter((s) => s.date && new Date(s.date) >= weekStart)
    .reduce((sum, s) => sum + s.durationMinutes, 0);

  const completedHoursThisWeek = parseFloat((completedMinutesThisWeek / 60).toFixed(1));
  const remainingHours = Math.max(0, parseFloat((weeklyTargetHours - completedHoursThisWeek).toFixed(1)));

  // Count remaining available days in the current week (days >= currentDayOfWeek in availableDays)
  const remainingAvailableDaysCount = availableDays.filter((d) => d >= currentDayOfWeek).length || 1;

  // New Adaptive Daily Target
  const calculatedDailyTargetHours = parseFloat(
    (remainingHours / remainingAvailableDaysCount).toFixed(1)
  );

  // Is target realistic?
  const isOverMax = calculatedDailyTargetHours > dailyMaxHours;
  const isGoalReached = remainingHours <= 0;

  const dayNames = [
    { id: 0, name: 'الأحد' },
    { id: 1, name: 'الإثنين' },
    { id: 2, name: 'الثلاثاء' },
    { id: 3, name: 'الأربعاء' },
    { id: 4, name: 'الخميس' },
    { id: 5, name: 'الجمعة' },
    { id: 6, name: 'السبت' },
  ];

  const toggleDay = (dayId: number) => {
    let updated: number[];
    if (availableDays.includes(dayId)) {
      if (availableDays.length <= 1) return; // Keep at least 1 day
      updated = availableDays.filter((d) => d !== dayId);
    } else {
      updated = [...availableDays, dayId].sort((a, b) => a - b);
    }
    setAvailableDays(updated);
    savePlanner(weeklyTargetHours, updated, dailyMaxHours, subjectPriorities);
  };

  const handlePriorityChange = (subjectId: string, priority: 'high' | 'medium' | 'low') => {
    const updated = { ...subjectPriorities, [subjectId]: priority };
    setSubjectPriorities(updated);
    savePlanner(weeklyTargetHours, availableDays, dailyMaxHours, updated);
  };

  const savePlanner = (
    wHours: number,
    aDays: number[],
    mHours: number,
    prio: Record<string, 'high' | 'medium' | 'low'>
  ) => {
    onUpdatePlanner({
      weeklyTargetHours: wHours,
      availableDays: aDays,
      dailyMaxHours: mHours,
      subjectPriorities: prio,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4 sm:py-6 space-y-6 text-right">
      {/* Header */}
      <div
        className="rounded-3xl p-6 sm:p-7 border shadow-xs"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
          <span>المنسق التكيفي للجداول والمذاكرة</span>
          <CalendarDays className="w-6 h-6 text-sky-500" />
        </h2>
        <p className="mt-1 text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
          محرك تخطيط ذكي يحسب هدفك اليومي التكيفي ديناميكيًا بناءً على إنجازك الفعلي والأيام المتبقية
        </p>
      </div>

      {/* Adaptive Recommendation Card */}
      <div
        className="rounded-3xl p-6 sm:p-7 border shadow-sm transition-all"
        style={{
          backgroundColor: isOverMax
            ? 'rgba(239, 68, 68, 0.05)'
            : isGoalReached
            ? 'rgba(16, 185, 129, 0.06)'
            : 'var(--bg-card)',
          borderColor: isOverMax ? 'rgba(239, 68, 68, 0.4)' : 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
              الهدف اليومي التكيفي المحسوب
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono mt-1" style={{ color: 'var(--primary-color)' }}>
              {isGoalReached ? '0.0' : calculatedDailyTargetHours} ساعة / اليوم
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="p-3 rounded-2xl border text-center" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-color)' }}>
              <span className="text-slate-500 block">المنجز هذا الأسبوع</span>
              <strong className="text-base text-emerald-600 dark:text-emerald-400">{completedHoursThisWeek} س</strong>
            </div>

            <div className="p-3 rounded-2xl border text-center" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-color)' }}>
              <span className="text-slate-500 block">المتبقي للهدف</span>
              <strong className="text-base text-sky-600 dark:text-sky-400">{remainingHours} س</strong>
            </div>
          </div>
        </div>

        {/* Realism Assessment Warning / Recommendation */}
        {isOverMax ? (
          <div className="mt-4 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs sm:text-sm leading-relaxed flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
            <div>
              <strong>تنبيه واقعية الجدول:</strong> الهدف اليومي المحسوب ({calculatedDailyTargetHours} ساعة) يتجاوز الحد الأقصى اليومي الذي حددته لنفسك ({dailyMaxHours} ساعات).
              <p className="mt-1 text-xs opacity-90">
                <strong>اقتراح المرفأ:</strong> إما تقليل الهدف الأسبوعي إلى {dailyMaxHours * remainingAvailableDaysCount + completedHoursThisWeek} ساعة، أو تفعيل أيام دراسة إضافية هذا الأسبوع لتفادي الإرهاق الذهني.
              </p>
            </div>
          </div>
        ) : isGoalReached ? (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm leading-relaxed flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
            <span>رائع! لقد حققت هدفك الأسبوعي بالكامل قبل انتهاء الأسبوع. خذ قسطًا من الراحة أو استمر بوتيرة حرة.</span>
          </div>
        ) : (
          <div className="mt-4 p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900 text-sky-800 dark:text-sky-300 text-xs leading-relaxed flex items-center gap-3">
            <Sparkles className="w-4 h-4 flex-shrink-0 text-sky-600" />
            <span>جدولك متوازن وواقعي جدًا. الالتزام بـ {calculatedDailyTargetHours} ساعة خلال {remainingAvailableDaysCount} أيام متبقية سيحقق هدفك دون ضغط.</span>
          </div>
        )}
      </div>

      {/* Configuration Controls */}
      <div
        className="rounded-3xl p-6 sm:p-7 border shadow-xs space-y-6"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        <h3 className="text-base font-bold">معايير الجدول الأسبوعي</h3>

        {/* Weekly Target Hours Slider */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span>الهدف الأسبوعي الكلي:</span>
            <span className="font-mono text-base text-blue-600 dark:text-blue-400 font-bold">{weeklyTargetHours} ساعة</span>
          </div>
          <input
            type="range"
            min="5"
            max="60"
            step="1"
            value={weeklyTargetHours}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setWeeklyTargetHours(val);
              savePlanner(val, availableDays, dailyMaxHours, subjectPriorities);
            }}
            className="w-full accent-blue-600"
          />
        </div>

        {/* Daily Max Hours Slider */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span>الحد الأقصى اليومي المسموح به:</span>
            <span className="font-mono text-base text-amber-600 dark:text-amber-400 font-bold">{dailyMaxHours} ساعات</span>
          </div>
          <input
            type="range"
            min="2"
            max="14"
            step="1"
            value={dailyMaxHours}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setDailyMaxHours(val);
              savePlanner(weeklyTargetHours, availableDays, val, subjectPriorities);
            }}
            className="w-full accent-amber-600"
          />
        </div>

        {/* Available Study Days Selector */}
        <div>
          <label className="block text-xs font-semibold mb-2.5">
            أيام المذاكرة المعتمدة في الأسبوع:
          </label>
          <div className="grid grid-cols-7 gap-2">
            {dayNames.map((d) => {
              const isSelected = availableDays.includes(d.id);
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => toggleDay(d.id)}
                  className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    isSelected ? 'bg-blue-600 text-white shadow-xs border-blue-600' : 'hover:opacity-80'
                  }`}
                  style={{
                    backgroundColor: isSelected ? 'var(--primary-color)' : 'var(--bg-elevated)',
                    borderColor: isSelected ? 'var(--primary-color)' : 'var(--border-color)',
                    color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                  }}
                >
                  {d.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Subject Priorities */}
      <div
        className="rounded-3xl p-6 sm:p-7 border shadow-xs"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        <h3 className="text-base font-bold mb-1">تحديد أولويات المواد</h3>
        <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
          تحدد أولوية كل مادة توزيع الوقت المتبقي في جلسات المرفأ
        </p>

        <div className="space-y-3">
          {subjects.map((sub) => {
            const prio = subjectPriorities[sub.id] || 'medium';

            return (
              <div
                key={sub.id}
                className="p-3.5 rounded-2xl border flex items-center justify-between gap-3"
                style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-color)' }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: sub.color }} />
                  <span className="text-xs font-bold">{sub.name}</span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-semibold">
                  <button
                    type="button"
                    onClick={() => handlePriorityChange(sub.id, 'high')}
                    className={`px-3 py-1 rounded-lg border transition cursor-pointer ${
                      prio === 'high' ? 'bg-rose-500 text-white border-rose-500 font-bold' : ''
                    }`}
                    style={{ borderColor: prio === 'high' ? '#f43f5e' : 'var(--border-color)' }}
                  >
                    أولوية قصوى
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePriorityChange(sub.id, 'medium')}
                    className={`px-3 py-1 rounded-lg border transition cursor-pointer ${
                      prio === 'medium' ? 'bg-amber-500 text-white border-amber-500 font-bold' : ''
                    }`}
                    style={{ borderColor: prio === 'medium' ? '#f59e0b' : 'var(--border-color)' }}
                  >
                    متوسطة
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePriorityChange(sub.id, 'low')}
                    className={`px-3 py-1 rounded-lg border transition cursor-pointer ${
                      prio === 'low' ? 'bg-slate-500 text-white border-slate-500 font-bold' : ''
                    }`}
                    style={{ borderColor: prio === 'low' ? '#64748b' : 'var(--border-color)' }}
                  >
                    منخفضة
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
