import React from 'react';
import { Timer, ShieldAlert, Coffee, Bell, Play, Sparkles } from 'lucide-react';
import { AppSettings, TimerMode } from '../../types';

interface TimerSettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
}

export const TimerSettingsView: React.FC<TimerSettingsViewProps> = ({
  settings,
  onUpdateSettings,
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
          <span>إعدادات مؤقت التركيز</span>
          <Timer className="w-6 h-6 text-sky-500" />
        </h2>
        <p className="mt-1 text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
          تخصيص الفترات الزمنية، وسلوك الوضع الصارم، والإشعارات النغمية
        </p>
      </div>

      {/* Default Durations */}
      <div
        className="rounded-3xl p-6 sm:p-7 border shadow-xs space-y-5"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        <h3 className="text-base font-bold">المدد الافتراضية لجلسات بومودورو</h3>

        {/* Focus Duration */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span>مدة التركيز الافتراضية:</span>
            <span className="font-mono text-base text-blue-600 dark:text-blue-400 font-bold">
              {settings.focusMinutes} دقيقة
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="120"
            step="5"
            value={settings.focusMinutes}
            onChange={(e) => onUpdateSettings({ focusMinutes: parseInt(e.target.value) })}
            className="w-full accent-blue-600"
          />
        </div>

        {/* Short Break */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span>مدة الاستراحة القصيرة:</span>
            <span className="font-mono text-base text-emerald-600 dark:text-emerald-400 font-bold">
              {settings.shortBreakMinutes} دقائق
            </span>
          </div>
          <input
            type="range"
            min="3"
            max="20"
            step="1"
            value={settings.shortBreakMinutes}
            onChange={(e) => onUpdateSettings({ shortBreakMinutes: parseInt(e.target.value) })}
            className="w-full accent-emerald-600"
          />
        </div>

        {/* Long Break */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span>مدة الاستراحة الطويلة:</span>
            <span className="font-mono text-base text-purple-600 dark:text-purple-400 font-bold">
              {settings.longBreakMinutes} دقيقة
            </span>
          </div>
          <input
            type="range"
            min="15"
            max="45"
            step="5"
            value={settings.longBreakMinutes}
            onChange={(e) => onUpdateSettings({ longBreakMinutes: parseInt(e.target.value) })}
            className="w-full accent-purple-600"
          />
        </div>

        {/* Loops */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span>عدد دورات التركيز قبل الاستراحة الطويلة:</span>
            <span className="font-mono text-base text-amber-600 dark:text-amber-400 font-bold">
              {settings.loops} دورات
            </span>
          </div>
          <div className="flex items-center gap-2">
            {[2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                onClick={() => onUpdateSettings({ loops: num })}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                  settings.loops === num ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : ''
                }`}
                style={{
                  backgroundColor: settings.loops === num ? 'var(--primary-color)' : 'var(--bg-elevated)',
                  borderColor: settings.loops === num ? 'var(--primary-color)' : 'var(--border-color)',
                  color: settings.loops === num ? '#fff' : 'var(--text-secondary)',
                }}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Behavioral Toggles */}
      <div
        className="rounded-3xl p-6 sm:p-7 border shadow-xs space-y-4"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        <h3 className="text-base font-bold">خيارات السلوك التلقائي والوضع الصارم</h3>

        {/* Strict Mode */}
        <label
          className="flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition hover:bg-slate-500/5"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs">الوضع الصارم (Strict Mode)</h4>
              <p className="text-[11px] text-slate-500 leading-tight">
                إيقاف المؤقت فورًا وتسجيل انقطاع عند الخروج من تبويب التطبيق عبر Page Visibility API
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.strictMode}
            onChange={(e) => onUpdateSettings({ strictMode: e.target.checked })}
            className="w-5 h-5 rounded-md accent-blue-600 cursor-pointer"
          />
        </label>

        {/* Chime Sound */}
        <label
          className="flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition hover:bg-slate-500/5"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs">نغمة اكتمال الجلسة الهادئة</h4>
              <p className="text-[11px] text-slate-500 leading-tight">
                عزف رنين ناعم ومريح عند انتهاء وقت الجلسة أو الاستراحة
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.soundEnabled}
            onChange={(e) => onUpdateSettings({ soundEnabled: e.target.checked })}
            className="w-5 h-5 rounded-md accent-blue-600 cursor-pointer"
          />
        </label>

        {/* Auto start break */}
        <label
          className="flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition hover:bg-slate-500/5"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs">بدء الاستراحة تلقائيًا</h4>
              <p className="text-[11px] text-slate-500 leading-tight">
                الانتقال المباشر إلى وقت الاستراحة فور انتهاء جلسة التركيز
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.autoStartBreak}
            onChange={(e) => onUpdateSettings({ autoStartBreak: e.target.checked })}
            className="w-5 h-5 rounded-md accent-blue-600 cursor-pointer"
          />
        </label>

        {/* Auto start focus */}
        <label
          className="flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition hover:bg-slate-500/5"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Play className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs">بدء الجلسة التالية تلقائيًا</h4>
              <p className="text-[11px] text-slate-500 leading-tight">
                بدء جلسة التركيز الجديدة فور انتهاء دقائق الاستراحة دون انتظار
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.autoStartFocus}
            onChange={(e) => onUpdateSettings({ autoStartFocus: e.target.checked })}
            className="w-5 h-5 rounded-md accent-blue-600 cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
};
