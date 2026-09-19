import React, { useState } from 'react';
import {
  Play,
  BookOpen,
  ShieldAlert,
  Volume2,
  Star,
  Flame,
  X,
  ChevronRight,
  ChevronLeft,
  Check,
} from 'lucide-react';
import { APP_MOTTO } from '../../constants';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'مرحباً بك في المرفأ',
      subtitle: 'مرساك الآمن للدراسة والعمل العميق والإنتاجية الهادئة',
      icon: '⚓',
      content: (
        <div className="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <p>
            صُمم تطبيق «المرفأ» لمساعدتك على تجنب التشتت وبناء عادات دراسية راسخة. التطبيق يعمل محلياً بالكامل على جهازك دون إنترنت أو تسجيل دخول.
          </p>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-center font-medium italic text-sky-800 dark:text-sky-300">
            «{APP_MOTTO}»
          </div>
        </div>
      ),
    },
    {
      title: 'بدء جلسات التركيز',
      subtitle: 'اختر بين نمط بومودورو أو العداد التصاعدي المفتوح',
      icon: '⏱️',
      content: (
        <div className="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <p>
            في نمط <strong>Pomodoro</strong>، اختر الفترات السريعة (30 أو 45 أو 50 أو 60 دقيقة) أو خصص الساعات والدقائق يدويًا مع دورات استراحة مجدولة.
          </p>
          <p>
            في نمط <strong>Stopwatch</strong>، يبدأ العداد تصاعدياً من الصفر مع قياس دقيق بالزمن الحقيقي دون تأثر بإغلاق الشاشة أو ضعف المعالج.
          </p>
        </div>
      ),
    },
    {
      title: 'المواد الدراسية والوضع الصارم',
      subtitle: 'اربط كل دقيقة بمادتها واحمِ تركيزك من الانقطاع',
      icon: '🛡️',
      content: (
        <div className="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <p>
            اختر المادة الدراسية قبل بدء الجلسة لتوزيع إحصائياتك وخريطتك الحرارية بدقة لكل مادة وأهدافها.
          </p>
          <p>
            عند تفعيل <strong>الوضع الصارم</strong>، يراقب التطبيق حضورك. إذا غادرت التطبيق أو انتقلت لتبويب آخر، يتوقف المؤقت تلقائيًا ويسجل انقطاعًا للحفاظ على أمانة الإنجاز.
          </p>
        </div>
      ),
    },
    {
      title: 'المشغل الصوتي المزدوج',
      subtitle: 'أصوات بيئية طبيعية مدمجة مع دعم رفع ملفاتك الصوتية',
      icon: '🎧',
      content: (
        <div className="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <p>
            يحتوي الشريط السفلي على مسارين صوتيين مستقلين تمامًا: أصوات بيئية كالمطر والموقد وأمواج البحر، ومسار لملفاتك الخاصة (MP3 أو WAV) المحفوظة داخل ذاكرة جهازك.
          </p>
          <p>
            يمكنك ضبط مستوى صوت كل مسار وتشغيلهما معاً لصنع جو المذاكرة الأنسب لك.
          </p>
        </div>
      ),
    },
    {
      title: 'الستريك والرتب والأوسمة',
      subtitle: 'نظام تقدير وتدرج حقيقي يكافئ الاستمرارية',
      icon: '🏆',
      content: (
        <div className="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <p>
            يُحتسب يوم الستريك عند إكمال <strong>30 دقيقة</strong> مذاكرة على الأقل في اليوم. وتحصل على <strong>درع تجميد</strong> لحماية سلسلتك إذا حالت ظروف قاهرة دون دراستك.
          </p>
          <p>
            تكسب نقطة لكل 60 دقيقة مكتملة لترتقي من رتبة «رفيق الرصيف» حتى «سيد الأعماق»، وتفتح 10 أوسمة إنجاز فريدة.
          </p>
        </div>
      ),
    },
  ];

  const currentStepData = steps[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div
        className="w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border transition-all text-right"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border transition hover:opacity-80"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-500/10" style={{ color: 'var(--text-muted)' }}>
              {step + 1} من {steps.length}
            </span>
            <span className="font-bold text-sm">دليل المرفأ</span>
          </div>
        </div>

        {/* Slide Body */}
        <div className="mt-5 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{currentStepData.icon}</span>
            <div>
              <h3 className="text-lg font-bold">{currentStepData.title}</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {currentStepData.subtitle}
              </p>
            </div>
          </div>

          <div className="mt-4">{currentStepData.content}</div>
        </div>

        {/* Step dots & navigation */}
        <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-1.5">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === step ? 'w-6 bg-blue-600' : 'w-2 bg-slate-300 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="px-3 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer hover:opacity-80"
                style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-elevated)' }}
              >
                السابق
              </button>
            )}

            {step < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="flex items-center gap-1 px-5 py-2 rounded-xl text-xs font-bold text-white shadow-sm cursor-pointer"
                style={{ backgroundColor: 'var(--primary-color)' }}
              >
                <span>التالي</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1 px-6 py-2 rounded-xl text-xs font-bold text-white shadow-md cursor-pointer"
                style={{ backgroundColor: 'var(--primary-color)' }}
              >
                <Check className="w-4 h-4" />
                <span>ابدأ رحلتك</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
