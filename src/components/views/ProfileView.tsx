import React, { useState } from 'react';
import {
  Award,
  Shield,
  Flame,
  Clock,
  Edit2,
  Check,
  ChevronLeft,
  Calendar,
  History,
  AlertCircle,
} from 'lucide-react';
import { UserProfile, StreakData, StudySession } from '../../types';
import { RANKS } from '../../constants';
import { getCurrentRank, getNextRank, getLocalDateString } from '../../utils/gamification';

interface ProfileViewProps {
  profile: UserProfile;
  streak: StreakData;
  sessions: StudySession[];
  onUpdateProfileName: (name: string) => void;
  onUseStreakShield: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  streak,
  sessions,
  onUpdateProfileName,
  onUseStreakShield,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);

  const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  const currentRank = getCurrentRank(profile.points);
  const { nextRank, pointsNeeded } = getNextRank(profile.points);

  const handleSaveName = () => {
    if (nameInput.trim()) {
      onUpdateProfileName(nameInput.trim());
    }
    setIsEditingName(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4 sm:py-6 space-y-6 text-right">
      {/* Profile Overview Card */}
      <div
        className="rounded-3xl p-6 sm:p-8 border shadow-xs transition-all relative overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-right">
            {/* Avatar / Rank Icon */}
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center text-3xl shadow-md flex-shrink-0"
              style={{ backgroundColor: 'var(--primary-color)', color: '#ffffff' }}
            >
              ⚓
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="px-3 py-1 text-lg font-bold rounded-xl border bg-transparent"
                      style={{ borderColor: 'var(--border-color)' }}
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      className="p-1.5 rounded-lg text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-black">{profile.name}</h2>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="p-1 opacity-60 hover:opacity-100 cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              <div className="mt-1 flex items-center justify-center sm:justify-start gap-2">
                <span
                  className="px-3 py-0.5 rounded-full text-xs font-bold"
                  style={{ backgroundColor: 'rgba(2, 132, 199, 0.15)', color: 'var(--accent-color)' }}
                >
                  {currentRank.name}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  المستوى {profile.level}
                </span>
              </div>

              <p className="mt-2 text-xs leading-relaxed max-w-md" style={{ color: 'var(--text-muted)' }}>
                {currentRank.description}
              </p>
            </div>
          </div>

          {/* Points & Stats pills */}
          <div className="flex items-center gap-3">
            <div
              className="px-4 py-3 rounded-2xl border text-center min-w-[90px]"
              style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-color)' }}
            >
              <div className="text-2xl font-extrabold font-mono" style={{ color: 'var(--primary-color)' }}>
                {profile.points}
              </div>
              <div className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
                نقطة مكتسبة
              </div>
            </div>

            <div
              className="px-4 py-3 rounded-2xl border text-center min-w-[90px]"
              style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-color)' }}
            >
              <div className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                {totalHours}
              </div>
              <div className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
                ساعة عمل عميق
              </div>
            </div>
          </div>
        </div>

        {/* Progress towards Next Rank */}
        {nextRank && (
          <div className="mt-6 pt-5 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span style={{ color: 'var(--text-secondary)' }}>
                الرتبة القادمة: <strong>{nextRank.name}</strong>
              </span>
              <span style={{ color: 'var(--primary-color)' }}>
                متبقي {pointsNeeded} نقطة ({pointsNeeded} ساعة دراسة)
              </span>
            </div>

            <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-elevated)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round(
                      ((profile.points - currentRank.requiredPoints) /
                        (nextRank.requiredPoints - currentRank.requiredPoints)) *
                        100
                    )
                  )}%`,
                  backgroundColor: 'var(--primary-color)',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Streak & Streak Shield System */}
      <div
        className="rounded-3xl p-6 sm:p-7 border shadow-xs"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/10 text-sky-600 dark:text-sky-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold">دروع حماية الستريك (Streak Shields)</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                تحميك من انقطاع الستريك عند تفويت يوم مذاكرة لظرف طارئ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs block" style={{ color: 'var(--text-muted)' }}>
                الدروع المتوفرة
              </span>
              <span className="text-xl font-bold font-mono text-sky-600 dark:text-sky-400">
                {streak.shields} دروع
              </span>
            </div>

            <button
              onClick={onUseStreakShield}
              disabled={streak.shields <= 0}
              className="px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-500/10"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              استخدام درع يدويًا
            </button>
          </div>
        </div>

        {/* Shield Rules Explanation */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-500/5 text-xs leading-relaxed space-y-1.5" style={{ color: 'var(--text-secondary)' }}>
          <p className="font-semibold flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-500 inline" />
            <span>شروط الستريك والدروع:</span>
          </p>
          <ul className="list-disc pr-5 space-y-1 text-slate-600 dark:text-slate-300">
            <li>يُحسب اليوم في الستريك عند إكمال <strong>30 دقيقة متصلة أو متفرقة</strong> على الأقل في نفس اليوم.</li>
            <li>إذا فاتك يوم، يتدخل الدرع تلقائيًا ويجمد سلسلتك دون إعادة العداد إلى الصفر.</li>
            <li>تحصل على درع إضافي دوري كلما ثابرت وحافظت على عاداتك.</li>
          </ul>
        </div>

        {/* Shield History Log */}
        {streak.shieldHistory && streak.shieldHistory.length > 0 && (
          <div className="mt-5">
            <h4 className="text-xs font-bold mb-3 flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
              <History className="w-3.5 h-3.5" />
              <span>سجل استخدام الدروع:</span>
            </h4>
            <div className="space-y-2">
              {streak.shieldHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border flex items-center justify-between text-xs"
                  style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-color)' }}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-sky-500" />
                    <span>{item.reason}</span>
                  </div>
                  <span className="font-mono text-slate-500 dark:text-slate-400">{item.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Ranks Ladder (All 8 ranks) */}
      <div
        className="rounded-3xl p-6 sm:p-7 border shadow-xs"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        <h3 className="text-base font-bold mb-1">سلم رتب المرفأ</h3>
        <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
          كل 60 دقيقة من المذاكرة تكسبك نقطة واحدة لترتقي بين رتب المرفأ
        </p>

        <div className="space-y-3">
          {RANKS.map((rank) => {
            const isCurrent = currentRank.id === rank.id;
            const isUnlocked = profile.points >= rank.requiredPoints;

            return (
              <div
                key={rank.id}
                className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                  isCurrent ? 'ring-2 ring-blue-500 shadow-xs' : ''
                }`}
                style={{
                  backgroundColor: isCurrent
                    ? 'rgba(2, 132, 199, 0.08)'
                    : isUnlocked
                    ? 'var(--bg-card)'
                    : 'var(--bg-elevated)',
                  borderColor: isCurrent ? '#0284c7' : 'var(--border-color)',
                  opacity: isUnlocked ? 1 : 0.6,
                }}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-xs"
                    style={{ backgroundColor: rank.badgeColor }}
                  >
                    <Award className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{rank.name}</span>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                          رتبتك الحالية
                        </span>
                      )}
                    </div>
                    <span className="text-xs block" style={{ color: 'var(--text-muted)' }}>
                      {rank.description}
                    </span>
                  </div>
                </div>

                <div className="text-left font-mono font-bold text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {rank.requiredPoints} نقطة
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
