import React from 'react';
import { Settings, Target, HelpCircle, ShieldCheck, Heart, Sparkles, Smartphone } from 'lucide-react';
import { AppSettings, DailyGoalStatus } from '../../types';
import { APP_MOTTO } from '../../constants';

interface SettingsViewProps {
  settings: AppSettings;
  dailyGoals: DailyGoalStatus;
  onUpdateDailyTarget: (minutes: number) => void;
  onOpenOnboarding: () => void;
  onNavigateToTab: (tab: any) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  dailyGoals,
  onUpdateDailyTarget,
  onOpenOnboarding,
  onNavigateToTab,
}) => {
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
          <span>إعدادات وتفضيلات التطبيق</span>
          <Settings className="w-6 h-6 text-sky-500" />
        </h2>
        <p className="mt-1 text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
          تحكم في الهدف اليومي العام، والمساعد الإرشادي، وخيارات الخصوصية
        </p>
      </div>

      {/* Daily Target Setting */}
      <div
        className="rounded-3xl p-6 sm:p-7 border shadow-xs space-y-4"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-sky-600 dark:text-sky-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold">هدف المذاكرة اليومي</h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              حدد عدد الدقائق الإجمالي التي تطمح لإنجازها يوميًا في المرفأ
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span>الهدف اليومي:</span>
            <span className="font-mono text-base text-blue-600 dark:text-blue-400 font-bold">
              {dailyGoals.targetMinutes} دقيقة ({(dailyGoals.targetMinutes / 60).toFixed(1)} ساعة)
            </span>
          </div>
          <input
            type="range"
            min="30"
            max="480"
            step="15"
            value={dailyGoals.targetMinutes}
            onChange={(e) => onUpdateDailyTarget(parseInt(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>
      </div>

      {/* Quick Links Hub */}
      <div
        className="rounded-3xl p-6 sm:p-7 border shadow-xs space-y-3"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        <h3 className="text-base font-bold mb-2">روابط سريعة للتخصيص</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => onNavigateToTab('appearance')}
            className="p-4 rounded-2xl border text-right transition cursor-pointer hover:bg-slate-500/5 flex items-center justify-between"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <div>
              <span className="font-bold text-xs block">المظهر والألوان والخطوط</span>
              <span className="text-[11px] text-slate-500">التبديل بين 9 سمات و4 خطوط عربية</span>
            </div>
            <span className="text-lg">🎨</span>
          </button>

          <button
            onClick={() => onNavigateToTab('timer-settings')}
            className="p-4 rounded-2xl border text-right transition cursor-pointer hover:bg-slate-500/5 flex items-center justify-between"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <div>
              <span className="font-bold text-xs block">خيارات المؤقت والوضع الصارم</span>
              <span className="text-[11px] text-slate-500">إدارة فترات بومودورو والاستراحات</span>
            </div>
            <span className="text-lg">⏱️</span>
          </button>

          <button
            onClick={() => onNavigateToTab('widgets')}
            className="p-4 rounded-2xl border text-right transition cursor-pointer hover:bg-slate-500/5 flex items-center justify-between"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <div>
              <span className="font-bold text-xs block">ترتيب الودجات ونمط الشاشة</span>
              <span className="text-[11px] text-slate-500">مركزي، مقسوم جانبي، أو مينيمال</span>
            </div>
            <span className="text-lg">📐</span>
          </button>

          <button
            onClick={() => onNavigateToTab('backup')}
            className="p-4 rounded-2xl border text-right transition cursor-pointer hover:bg-slate-500/5 flex items-center justify-between"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <div>
              <span className="font-bold text-xs block">النسخ الاحتياطي والاستعادة</span>
              <span className="text-[11px] text-slate-500">تنزيل ملف JSON أو استرجاعه</span>
            </div>
            <span className="text-lg">💾</span>
          </button>
        </div>
      </div>

      {/* App Guide & About */}
      <div
        className="rounded-3xl p-6 sm:p-7 border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        <div>
          <h3 className="text-base font-bold flex items-center gap-2">
            <span>دليل استخدام المرفأ</span>
            <HelpCircle className="w-4 h-4 text-sky-500" />
          </h3>
          <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
            استعرض مجددًا خطوات البدء وشرح كيفية عمل الستريك والمؤقت والدروع
          </p>
        </div>

        <button
          onClick={onOpenOnboarding}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold border transition cursor-pointer hover:opacity-80"
          style={{
            borderColor: 'var(--border-color)',
            backgroundColor: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
          }}
        >
          <HelpCircle className="w-4 h-4" />
          <span>فتح الدليل الإرشادي</span>
        </button>
      </div>

      {/* Motto & Offline Certificate Footer */}
      <div className="p-6 rounded-3xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 text-center space-y-2 text-xs">
        <p className="font-bold text-sm" style={{ color: 'var(--primary-color)' }}>
          «{APP_MOTTO}»
        </p>
        <p className="text-slate-500 dark:text-slate-400">
          تطبيق «المرفأ» (Al-Mirfa) • تطبيق ويب تقدمي PWA محلي ومستقل 100% • IndexedDB Storage
        </p>
      </div>
    </div>
  );
};
