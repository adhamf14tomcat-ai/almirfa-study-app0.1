import React from 'react';
import { Target, CheckCircle } from 'lucide-react';
import { DailyGoalStatus } from '../../types';

interface DailyProgressWidgetProps {
  dailyGoals: DailyGoalStatus;
  onEditGoal?: () => void;
}

export const DailyProgressWidget: React.FC<DailyProgressWidgetProps> = ({
  dailyGoals,
  onEditGoal,
}) => {
  const target = Math.max(1, dailyGoals.targetMinutes);
  const completed = dailyGoals.completedMinutes;
  const percentage = Math.min(100, Math.round((completed / target) * 100));
  const isGoalReached = completed >= target;

  return (
    <div
      id="daily-progress-widget"
      className="w-full p-4 rounded-2xl border shadow-xs text-right"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isGoalReached ? (
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          ) : (
            <Target className="w-4 h-4 text-sky-500" />
          )}
          <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
            الهدف اليومي: {completed} من {target} دقيقة ({percentage}%)
          </span>
        </div>

        {onEditGoal && (
          <button
            onClick={onEditGoal}
            className="text-[11px] font-medium opacity-80 hover:opacity-100 hover:underline cursor-pointer"
            style={{ color: 'var(--primary-color)' }}
          >
            تعديل الهدف
          </button>
        )}
      </div>

      {/* Progress Track */}
      <div
        className="w-full h-2.5 rounded-full overflow-hidden"
        style={{ backgroundColor: 'var(--bg-elevated)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: isGoalReached ? '#10b981' : 'var(--primary-color)',
          }}
        />
      </div>
    </div>
  );
};
