import React from 'react';
import { Palette, Sun, Moon, Smartphone, Check, Type, ZoomIn } from 'lucide-react';
import { AppSettings, AppearanceMode, ColorPalette, ThemePalette, FontFamily } from '../../types';
import { THEME_PALETTES } from '../../constants';

interface AppearanceViewProps {
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
}

export const AppearanceView: React.FC<AppearanceViewProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const fontOptions: { id: FontFamily; name: string; sample: string }[] = [
    { id: 'tajawal', name: 'خط تجوّل (Tajawal)', sample: 'كل جلسة هادئة تقرّبك من هدفك' },
    { id: 'cairo', name: 'خط القاهرة (Cairo)', sample: 'كل جلسة هادئة تقرّبك من هدفك' },
    { id: 'readex', name: 'خط ريديكس برو (Readex Pro)', sample: 'كل جلسة هادئة تقرّبك من هدفك' },
    { id: 'vazirmatn', name: 'خط وزير متن (Vazirmatn)', sample: 'كل جلسة هادئة تقرّبك من هدفك' },
  ];

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
          <span>المظهر والألوان والخطوط</span>
          <Palette className="w-6 h-6 text-sky-500" />
        </h2>
        <p className="mt-1 text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
          خصص التجربة البصرية لمرفأك بين 9 سمات كلاسيكية و4 خطوط عربية مصقولة
        </p>
      </div>

      {/* Lighting Mode Selector */}
      <div
        className="rounded-3xl p-6 sm:p-7 border shadow-xs"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        <h3 className="text-base font-bold mb-1">نمط الإضاءة</h3>
        <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
          اختر النمط المناسب لراحة عينيك أثناء المذاكرة
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Light */}
          <button
            onClick={() => onUpdateSettings({ appearance: 'light' })}
            className={`p-4 rounded-2xl border text-center transition cursor-pointer ${
              settings.appearance === 'light' ? 'ring-2 ring-blue-500 shadow-xs' : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: settings.appearance === 'light' ? 'rgba(2, 132, 199, 0.08)' : 'var(--bg-elevated)',
              borderColor: settings.appearance === 'light' ? '#0284c7' : 'var(--border-color)',
            }}
          >
            <Sun className="w-6 h-6 mx-auto mb-2 text-amber-500" />
            <span className="text-xs font-bold block">فاتح (Light)</span>
          </button>

          {/* Dark */}
          <button
            onClick={() => onUpdateSettings({ appearance: 'dark' })}
            className={`p-4 rounded-2xl border text-center transition cursor-pointer ${
              settings.appearance === 'dark' ? 'ring-2 ring-blue-500 shadow-xs' : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: settings.appearance === 'dark' ? 'rgba(2, 132, 199, 0.08)' : 'var(--bg-elevated)',
              borderColor: settings.appearance === 'dark' ? '#0284c7' : 'var(--border-color)',
            }}
          >
            <Moon className="w-6 h-6 mx-auto mb-2 text-indigo-400" />
            <span className="text-xs font-bold block">داكن (Dark)</span>
          </button>

          {/* OLED */}
          <button
            onClick={() => onUpdateSettings({ appearance: 'oled' })}
            className={`p-4 rounded-2xl border text-center transition cursor-pointer ${
              settings.appearance === 'oled' ? 'ring-2 ring-blue-500 shadow-xs' : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: settings.appearance === 'oled' ? 'rgba(2, 132, 199, 0.08)' : 'var(--bg-elevated)',
              borderColor: settings.appearance === 'oled' ? '#0284c7' : 'var(--border-color)',
            }}
          >
            <div className="w-6 h-6 mx-auto mb-2 rounded-full bg-black border border-slate-700" />
            <span className="text-xs font-bold block">أسود فاحم (OLED)</span>
          </button>

          {/* Auto */}
          <button
            onClick={() => onUpdateSettings({ appearance: 'auto' })}
            className={`p-4 rounded-2xl border text-center transition cursor-pointer ${
              settings.appearance === 'auto' ? 'ring-2 ring-blue-500 shadow-xs' : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: settings.appearance === 'auto' ? 'rgba(2, 132, 199, 0.08)' : 'var(--bg-elevated)',
              borderColor: settings.appearance === 'auto' ? '#0284c7' : 'var(--border-color)',
            }}
          >
            <Smartphone className="w-6 h-6 mx-auto mb-2 text-sky-500" />
            <span className="text-xs font-bold block">تلقائي النظام (Auto)</span>
          </button>
        </div>
      </div>

      {/* 9 Classic Palettes */}
      <div
        className="rounded-3xl p-6 sm:p-7 border shadow-xs"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        <h3 className="text-base font-bold mb-1">الباليتات اللونية الكلاسيكية التسع</h3>
        <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
          تدرجات هادئة مجردة مستوحاة من البيئات الدراسية الراقية
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {THEME_PALETTES.map((palette) => {
            const isSelected = settings.palette === palette.id;

            return (
              <button
                key={palette.id}
                onClick={() => onUpdateSettings({ palette: palette.id as ThemePalette })}
                className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
                  isSelected ? 'ring-2 ring-blue-500 shadow-xs' : 'opacity-85 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: isSelected ? '#0284c7' : 'var(--border-color)',
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-xs">{palette.name}</span>
                  {isSelected && <Check className="w-4 h-4 text-sky-600 dark:text-sky-400" />}
                </div>

                {/* Swatches preview */}
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-6 h-6 rounded-lg border shadow-xs inline-block"
                    style={{ backgroundColor: palette.preview.primary }}
                  />
                  <span
                    className="w-6 h-6 rounded-lg border shadow-xs inline-block"
                    style={{ backgroundColor: palette.preview.accent }}
                  />
                  <span
                    className="w-6 h-6 rounded-lg border shadow-xs inline-block"
                    style={{ backgroundColor: palette.preview.bg }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Typography Selector (4 Arabic Fonts) */}
      <div
        className="rounded-3xl p-6 sm:p-7 border shadow-xs"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        <h3 className="text-base font-bold mb-1 flex items-center gap-2">
          <Type className="w-5 h-5 text-sky-500" />
          <span>الخط العربي للتطبيق</span>
        </h3>
        <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
          اختر الخط المفضل للقراءة والتركيز
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {fontOptions.map((f) => {
            const isSelected = settings.fontFamily === f.id;
            const fontClass =
              f.id === 'tajawal'
                ? 'font-tajawal'
                : f.id === 'cairo'
                ? 'font-cairo'
                : f.id === 'readex'
                ? 'font-readex'
                : 'font-vazirmatn';

            return (
              <button
                key={f.id}
                onClick={() => onUpdateSettings({ fontFamily: f.id })}
                className={`p-4 rounded-2xl border text-right transition cursor-pointer ${fontClass} ${
                  isSelected ? 'ring-2 ring-blue-500 shadow-xs' : 'opacity-80 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: isSelected ? 'rgba(2, 132, 199, 0.08)' : 'var(--bg-elevated)',
                  borderColor: isSelected ? '#0284c7' : 'var(--border-color)',
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-sm">{f.name}</span>
                  {isSelected && <Check className="w-4 h-4 text-sky-600" />}
                </div>
                <p className="text-xs opacity-75">{f.sample}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* UI Scale Slider (80% to 120%) */}
      <div
        className="rounded-3xl p-6 sm:p-7 border shadow-xs"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ZoomIn className="w-5 h-5 text-sky-500" />
            <h3 className="text-base font-bold">مقياس حجم الواجهة (UI Scale)</h3>
          </div>
          <span className="text-base font-bold font-mono text-blue-600 dark:text-blue-400">
            {Math.round(settings.uiScale * 100)}%
          </span>
        </div>

        <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
          لتكبير أو تصغير عناصر التطبيق ليتناسب تمامًا مع شاشة هاتفك أو جهازك اللوحي (iPad)
        </p>

        <input
          type="range"
          min="0.8"
          max="1.2"
          step="0.05"
          value={settings.uiScale}
          onChange={(e) => onUpdateSettings({ uiScale: parseFloat(e.target.value) })}
          className="w-full accent-blue-600"
        />

        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 font-mono">
          <span>80% (أصغر)</span>
          <span>100% (افتراضي)</span>
          <span>120% (أكبر)</span>
        </div>
      </div>
    </div>
  );
};
