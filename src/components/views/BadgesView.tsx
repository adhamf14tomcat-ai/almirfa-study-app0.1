import React, { useState } from 'react';
import { Award, Lock, CheckCircle2, X, Sparkles, Calendar } from 'lucide-react';
import { BadgeItem } from '../../types';

interface BadgesViewProps {
  badges: BadgeItem[];
}

export const BadgesView: React.FC<BadgesViewProps> = ({ badges }) => {
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);

  const unlockedCount = badges.filter((b) => b.unlocked).length;

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
            <span>معرض أوسمة المرفأ</span>
            <Award className="w-6 h-6 text-amber-500" />
          </h2>
          <p className="mt-1 text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
            أوسمة إنجاز فريدة تُمنح عند بلوغ محطات التركيز والاستمرارية في رحلتك
          </p>
        </div>

        <div
          className="px-5 py-3 rounded-2xl border text-center font-mono"
          style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-color)' }}
        >
          <div className="text-xl font-bold" style={{ color: 'var(--primary-color)' }}>
            {unlockedCount} / {badges.length}
          </div>
          <div className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
            أوسمة مفتوحة
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {badges.map((badge) => {
          const isUnlocked = badge.unlocked;
          const progress = Math.min(100, Math.round((badge.currentValue / badge.targetValue) * 100));

          return (
            <button
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className="group p-4 rounded-3xl border flex flex-col items-center text-center transition-all duration-200 cursor-pointer hover:scale-102 hover:shadow-md relative overflow-hidden"
              style={{
                backgroundColor: isUnlocked ? 'var(--bg-card)' : 'var(--bg-elevated)',
                borderColor: isUnlocked ? 'rgba(2, 132, 199, 0.4)' : 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              {/* Badge Icon circle */}
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl my-2 shadow-xs transition-transform group-hover:rotate-6 ${
                  isUnlocked ? '' : 'grayscale opacity-40'
                }`}
                style={{
                  backgroundColor: isUnlocked ? 'rgba(2, 132, 199, 0.12)' : 'var(--border-color)',
                }}
              >
                {badge.icon}
              </div>

              {/* Title */}
              <h3 className="text-xs font-bold mt-1 line-clamp-1">{badge.name}</h3>

              {/* Status pill */}
              <div className="mt-2 w-full">
                {isUnlocked ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>مكتمل</span>
                  </span>
                ) : (
                  <div className="w-full">
                    <div className="flex items-center justify-between text-[9px] mb-1 opacity-70">
                      <Lock className="w-2.5 h-2.5 inline" />
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full overflow-hidden bg-slate-300 dark:bg-slate-700">
                      <div
                        className="h-full bg-slate-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Badge Details Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div
            className="w-full max-w-sm rounded-3xl p-6 shadow-2xl border transition-all text-center relative"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          >
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 left-4 p-1.5 rounded-lg border transition hover:opacity-80"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>

            {/* Icon */}
            <div
              className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-4xl shadow-md my-3 ${
                selectedBadge.unlocked ? '' : 'grayscale opacity-50'
              }`}
              style={{ backgroundColor: 'rgba(2, 132, 199, 0.12)' }}
            >
              {selectedBadge.icon}
            </div>

            <h3 className="text-lg font-bold">{selectedBadge.name}</h3>
            <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {selectedBadge.description}
            </p>

            {/* Progress / Completion info */}
            <div
              className="mt-5 p-4 rounded-2xl border text-right space-y-2.5"
              style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-color)' }}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold">شرط الوسام:</span>
                <span className="font-mono font-bold">
                  {selectedBadge.currentValue} / {selectedBadge.targetValue}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full overflow-hidden bg-slate-300 dark:bg-slate-700">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, Math.round((selectedBadge.currentValue / selectedBadge.targetValue) * 100))}%`,
                    backgroundColor: selectedBadge.unlocked ? '#10b981' : 'var(--primary-color)',
                  }}
                />
              </div>

              {selectedBadge.unlocked ? (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>تم فتح هذا الوسام بنجاح!</span>
                  </div>
                  {selectedBadge.unlockedAt && (
                    <span className="font-mono text-[10px] opacity-70">
                      {new Date(selectedBadge.unlockedAt).toLocaleDateString('ar-EG')}
                    </span>
                  )}
                </div>
              ) : (
                <div className="pt-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                  متبقي {Math.max(0, selectedBadge.targetValue - selectedBadge.currentValue)} لإنجاز هذا الوسام
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedBadge(null)}
              className="mt-5 w-full py-2.5 rounded-xl text-xs font-bold text-white shadow-xs cursor-pointer"
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
