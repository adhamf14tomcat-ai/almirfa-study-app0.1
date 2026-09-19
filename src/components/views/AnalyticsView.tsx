import React from 'react';
import {
  Clock,
  Calendar,
  Award,
  TrendingUp,
  Star,
  ShieldAlert,
  Flame,
  CheckCircle2,
  BookOpen,
  Target,
} from 'lucide-react';
import { StudySession, SubjectItem, StreakData, DailyGoalStatus } from '../../types';
import { getLocalDateString } from '../../utils/gamification';

interface AnalyticsViewProps {
  sessions: StudySession[];
  subjects: SubjectItem[];
  streak: StreakData;
  dailyGoals: DailyGoalStatus;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  sessions,
  subjects,
  streak,
  dailyGoals,
}) => {
  const todayStr = getLocalDateString();
  const now = new Date();

  // 1. Today's total time
  const todayMinutes = sessions
    .filter((s) => s.date === todayStr)
    .reduce((sum, s) => sum + s.durationMinutes, 0);

  // 2. Week hours (past 7 days)
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - 7);
  const weekMinutes = sessions
    .filter((s) => s.date && new Date(s.date) >= weekStart)
    .reduce((sum, s) => sum + s.durationMinutes, 0);

  // 3. Month hours (past 30 days)
  const monthStart = new Date(now);
  monthStart.setDate(monthStart.getDate() - 30);
  const monthMinutes = sessions
    .filter((s) => s.date && new Date(s.date) >= monthStart)
    .reduce((sum, s) => sum + s.durationMinutes, 0);

  // 4. All-time cumulative minutes
  const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  // 5. Daily Average (based on unique active days or minimum 1)
  const uniqueDates = new Set(sessions.map((s) => s.date).filter(Boolean));
  const activeDaysCount = Math.max(1, uniqueDates.size);
  const dailyAverageMinutes = Math.round(totalMinutes / activeDaysCount);

  // 6. Most studied subject
  const subjectMinutesMap: Record<string, number> = {};
  sessions.forEach((s) => {
    subjectMinutesMap[s.subjectId] = (subjectMinutesMap[s.subjectId] || 0) + s.durationMinutes;
  });

  let topSubjectId = '';
  let maxSubjectMinutes = 0;
  Object.entries(subjectMinutesMap).forEach(([id, mins]) => {
    if (mins > maxSubjectMinutes) {
      maxSubjectMinutes = mins;
      topSubjectId = id;
    }
  });
  const topSubject = subjects.find((s) => s.id === topSubjectId);

  // 7. Best day in history
  const dayMinutesMap: Record<string, number> = {};
  sessions.forEach((s) => {
    if (s.date) {
      dayMinutesMap[s.date] = (dayMinutesMap[s.date] || 0) + s.durationMinutes;
    }
  });
  let bestDayDate = '—';
  let bestDayMinutes = 0;
  Object.entries(dayMinutesMap).forEach(([d, mins]) => {
    if (mins > bestDayMinutes) {
      bestDayMinutes = mins;
      bestDayDate = d;
    }
  });

  // 8. Average rating
  const ratedSessions = sessions.filter((s) => s.rating && s.rating > 0);
  const avgRating =
    ratedSessions.length > 0
      ? (ratedSessions.reduce((sum, s) => sum + (s.rating || 0), 0) / ratedSessions.length).toFixed(1)
      : '5.0';

  // 9. Completed sessions & Interruptions
  const completedSessionsCount = sessions.filter((s) => s.isCompleted).length;
  const totalInterruptions = sessions.reduce((sum, s) => sum + (s.interruptionsCount || 0), 0);

  // Format hours and mins
  const formatMins = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0) return `${h} س و ${m} د`;
    return `${m} دقيقة`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4 sm:py-6 space-y-6 text-right">
      {/* Title */}
      <div
        className="rounded-3xl p-6 sm:p-7 border shadow-xs"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
          <span>لوحة الإحصائيات وتحليل الإنجاز</span>
          <TrendingUp className="w-6 h-6 text-sky-500" />
        </h2>
        <p className="mt-1 text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
          بيانات دقيقة وفعلية لجميع جلسات عملك ودراستك المسجلة محلياً في جهازك
        </p>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Today */}
        <div
          className="p-5 rounded-3xl border shadow-xs"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center justify-between text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
            <span>اليوم الحالي</span>
            <Clock className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono" style={{ color: 'var(--text-primary)' }}>
            {formatMins(todayMinutes)}
          </div>
          <div className="text-[10px] mt-1 text-slate-500">من أصل هدف {dailyGoals.targetMinutes} د</div>
        </div>

        {/* Week */}
        <div
          className="p-5 rounded-3xl border shadow-xs"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center justify-between text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
            <span>آخر 7 أيام</span>
            <Calendar className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
            {(weekMinutes / 60).toFixed(1)} س
          </div>
          <div className="text-[10px] mt-1 text-slate-500">{weekMinutes} دقيقة إجمالية</div>
        </div>

        {/* Month */}
        <div
          className="p-5 rounded-3xl border shadow-xs"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center justify-between text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
            <span>آخر 30 يوم</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
            {(monthMinutes / 60).toFixed(1)} س
          </div>
          <div className="text-[10px] mt-1 text-slate-500">{monthMinutes} دقيقة إجمالية</div>
        </div>

        {/* All-time */}
        <div
          className="p-5 rounded-3xl border shadow-xs"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center justify-between text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
            <span>المجموع التراكمي</span>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-purple-600 dark:text-purple-400">
            {totalHours} س
          </div>
          <div className="text-[10px] mt-1 text-slate-500">{totalMinutes} دقيقة من التركيز</div>
        </div>
      </div>

      {/* Secondary Metrics Card */}
      <div
        className="rounded-3xl p-6 border shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-6"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        {/* Daily Average */}
        <div className="border-b sm:border-b-0 sm:border-l pb-4 sm:pb-0 pl-0 sm:pl-4" style={{ borderColor: 'var(--border-color)' }}>
          <span className="text-xs block font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
            المعدل اليومي لأيام النشاط
          </span>
          <div className="text-2xl font-bold font-mono" style={{ color: 'var(--primary-color)' }}>
            {formatMins(dailyAverageMinutes)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">عبر {activeDaysCount} يوم دراسي مسجل</p>
        </div>

        {/* Most studied subject */}
        <div className="border-b sm:border-b-0 sm:border-l pb-4 sm:pb-0 pl-0 sm:pl-4" style={{ borderColor: 'var(--border-color)' }}>
          <span className="text-xs block font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
            أكثر مادة دراسية إنجازًا
          </span>
          <div className="flex items-center gap-2">
            {topSubject && <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: topSubject.color }} />}
            <span className="text-xl font-bold">{topSubject ? topSubject.name : '—'}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{formatMins(maxSubjectMinutes)} مسجلة</p>
        </div>

        {/* Best Day */}
        <div>
          <span className="text-xs block font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
            أفضل يوم إنجاز تاريخي
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {bestDayMinutes > 0 ? formatMins(bestDayMinutes) : '—'}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{bestDayDate !== '—' ? `بتاريخ ${bestDayDate}` : 'بانتظار جلستك الأولى'}</p>
        </div>
      </div>

      {/* Quality & Integrity Indicators */}
      <div
        className="rounded-3xl p-6 border shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-4"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        {/* Average Focus Rating */}
        <div className="p-3">
          <div className="flex items-center gap-1.5 text-xs text-amber-500 font-semibold mb-1">
            <Star className="w-4 h-4 fill-amber-400" />
            <span>متوسط التقييم</span>
          </div>
          <div className="text-xl font-bold font-mono">{avgRating} / 5.0</div>
          <span className="text-[10px] text-slate-500">من {ratedSessions.length} جلسة مقيمة</span>
        </div>

        {/* Completed Sessions */}
        <div className="p-3">
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>الجلسات المكتملة</span>
          </div>
          <div className="text-xl font-bold font-mono">{completedSessionsCount}</div>
          <span className="text-[10px] text-slate-500">إجمالي {sessions.length} جلسة</span>
        </div>

        {/* Interruptions Count */}
        <div className="p-3">
          <div className="flex items-center gap-1.5 text-xs text-rose-500 font-semibold mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>مرات الانقطاع</span>
          </div>
          <div className="text-xl font-bold font-mono">{totalInterruptions}</div>
          <span className="text-[10px] text-slate-500">في الوضع الصارم</span>
        </div>

        {/* Best Streak */}
        <div className="p-3">
          <div className="flex items-center gap-1.5 text-xs text-orange-500 font-semibold mb-1">
            <Flame className="w-4 h-4 fill-orange-500" />
            <span>أفضل ستريك</span>
          </div>
          <div className="text-xl font-bold font-mono">{streak.best} أيام</div>
          <span className="text-[10px] text-slate-500">الحالي: {streak.current} يوم</span>
        </div>
      </div>

      {/* Distribution by Subject */}
      <div
        className="rounded-3xl p-6 border shadow-xs"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        <h3 className="text-base font-bold mb-1 flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          <span>توزيع ساعات الدراسة حسب المواد</span>
        </h3>
        <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
          مقارنة الوقت المنقضي في كل مادة ونسبته من إجمالي وقت الدراسة
        </p>

        <div className="space-y-3.5">
          {subjects.map((sub) => {
            const subMinutes = subjectMinutesMap[sub.id] || 0;
            const percent = totalMinutes > 0 ? Math.round((subMinutes / totalMinutes) * 100) : 0;

            return (
              <div key={sub.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: sub.color }} />
                    <span className="font-semibold">{sub.name}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-slate-500 font-normal">{percent}%</span>
                    <span className="font-bold">{formatMins(subMinutes)}</span>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${percent}%`, backgroundColor: sub.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
