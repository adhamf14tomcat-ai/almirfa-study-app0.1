import React from 'react';
import { LayoutGrid, ArrowUp, ArrowDown, Check, Columns, Square, Maximize2 } from 'lucide-react';
import { LayoutConfig, LayoutPreset, WidgetType } from '../../types';

interface WidgetOrderViewProps {
  layout: LayoutConfig;
  onUpdateLayout: (layout: LayoutConfig) => void;
}

export const WidgetOrderView: React.FC<WidgetOrderViewProps> = ({
  layout,
  onUpdateLayout,
}) => {
  const widgetLabels: Record<WidgetType, { title: string; desc: string }> = {
    quote: { title: 'بطاقة المقولة الملهمة', desc: 'عرض المقولة اليومية مع زر الحفظ والتوليد' },
    subject: { title: 'محدد المادة الدراسية', desc: 'اختيار المادة الفعالة وهدفها اليومي' },
    timer: { title: 'عداد ومؤقت التركيز الرئيسي', desc: 'مؤقت بومودورو أو العداد التصاعدي مع التوهج الهادئ' },
    'daily-progress': { title: 'شريط تقدم الهدف اليومي', desc: 'متابعة الدقائق المنجزة والنسبة المئوية لليوم' },
    'audio-player': { title: 'شريط المشغل الصوتي المزدوج', desc: 'التحكم في المسار البيئي والمسار الشخصي' },
  };

  const moveWidget = (index: number, direction: 'up' | 'down') => {
    const newWidgets = [...layout.widgets];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newWidgets.length) return;

    const temp = newWidgets[index];
    newWidgets[index] = newWidgets[targetIndex];
    newWidgets[targetIndex] = temp;

    onUpdateLayout({
      ...layout,
      widgets: newWidgets,
    });
  };

  const handlePresetSelect = (preset: LayoutPreset) => {
    onUpdateLayout({
      ...layout,
      preset,
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
          <span>تخصيص هيكل وترتيب الواجهة</span>
          <LayoutGrid className="w-6 h-6 text-sky-500" />
        </h2>
        <p className="mt-1 text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
          اختر النمط البصري المناسب لشاشتك ونسق ترتيب مكونات الشاشة الرئيسية بحرية
        </p>
      </div>

      {/* Preset Selector */}
      <div
        className="rounded-3xl p-6 sm:p-7 border shadow-xs"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        <h3 className="text-base font-bold mb-1">النمط الهيكلي العام</h3>
        <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
          اختر من بين 3 قوالب هيكلية معتمدة
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Central */}
          <button
            onClick={() => handlePresetSelect('central')}
            className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
              layout.preset === 'central' ? 'ring-2 ring-blue-500 shadow-xs' : 'opacity-80 hover:opacity-100'
            }`}
            style={{
              backgroundColor: layout.preset === 'central' ? 'rgba(2, 132, 199, 0.08)' : 'var(--bg-elevated)',
              borderColor: layout.preset === 'central' ? '#0284c7' : 'var(--border-color)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <Square className="w-5 h-5 text-sky-600" />
              {layout.preset === 'central' && <Check className="w-4 h-4 text-sky-600" />}
            </div>
            <h4 className="font-bold text-xs">مركزي هادئ (افتراضي)</h4>
            <p className="text-[11px] mt-1 text-slate-500 leading-tight">
              ترتيب رأسي متوازن يركز على المؤقت بالمنتصف.
            </p>
          </button>

          {/* Split */}
          <button
            onClick={() => handlePresetSelect('split')}
            className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
              layout.preset === 'split' ? 'ring-2 ring-blue-500 shadow-xs' : 'opacity-80 hover:opacity-100'
            }`}
            style={{
              backgroundColor: layout.preset === 'split' ? 'rgba(2, 132, 199, 0.08)' : 'var(--bg-elevated)',
              borderColor: layout.preset === 'split' ? '#0284c7' : 'var(--border-color)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <Columns className="w-5 h-5 text-sky-600" />
              {layout.preset === 'split' && <Check className="w-4 h-4 text-sky-600" />}
            </div>
            <h4 className="font-bold text-xs">مقسوم جانبي (Split)</h4>
            <p className="text-[11px] mt-1 text-slate-500 leading-tight">
              مثالي لأجهزة الآيباد والكمبيوتر، عمودان متجاوران.
            </p>
          </button>

          {/* Minimal */}
          <button
            onClick={() => handlePresetSelect('minimal')}
            className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
              layout.preset === 'minimal' ? 'ring-2 ring-blue-500 shadow-xs' : 'opacity-80 hover:opacity-100'
            }`}
            style={{
              backgroundColor: layout.preset === 'minimal' ? 'rgba(2, 132, 199, 0.08)' : 'var(--bg-elevated)',
              borderColor: layout.preset === 'minimal' ? '#0284c7' : 'var(--border-color)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <Maximize2 className="w-5 h-5 text-sky-600" />
              {layout.preset === 'minimal' && <Check className="w-4 h-4 text-sky-600" />}
            </div>
            <h4 className="font-bold text-xs">مينيمال مجرد</h4>
            <p className="text-[11px] mt-1 text-slate-500 leading-tight">
              مؤقت التركيز وحده مع شريط الصوت لتجنب أي تشتيت.
            </p>
          </button>
        </div>
      </div>

      {/* Widget Reordering List (Only in Central layout) */}
      <div
        className="rounded-3xl p-6 sm:p-7 border shadow-xs"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        <h3 className="text-base font-bold mb-1">تسلسل مكونات النمط المركزي</h3>
        <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
          استخدم الأسهم لتحريك كل عنصر للأعلى أو للأسفل حسب أولويتك
        </p>

        <div className="space-y-3">
          {layout.widgets.map((widgetKey, idx) => {
            const label = widgetLabels[widgetKey] || { title: widgetKey, desc: '' };

            return (
              <div
                key={widgetKey}
                className="p-4 rounded-2xl border flex items-center justify-between gap-3 transition-all"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-blue-500/10 text-sky-600 dark:text-sky-400 font-bold text-xs flex items-center justify-center font-mono">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-xs">{label.title}</h4>
                    <p className="text-[11px] text-slate-500">{label.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => moveWidget(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg border transition disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-500/10"
                    style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)' }}
                    title="تحريك للأعلى"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => moveWidget(idx, 'down')}
                    disabled={idx === layout.widgets.length - 1}
                    className="p-1.5 rounded-lg border transition disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-500/10"
                    style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)' }}
                    title="تحريك للأسفل"
                  >
                    <ArrowDown className="w-4 h-4" />
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
