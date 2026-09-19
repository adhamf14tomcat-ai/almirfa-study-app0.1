import React, { useState } from 'react';
import { Star, CheckCircle, Sparkles, X } from 'lucide-react';
import { SubjectItem, TimerMode } from '../../types';

interface SessionRatingModalProps {
  isOpen: boolean;
  durationMinutes: number;
  mode: TimerMode;
  subject: SubjectItem;
  interruptionsCount: number;
  onSaveSession: (rating: number, note: string) => void;
  onSkip: () => void;
}

export const SessionRatingModal: React.FC<SessionRatingModalProps> = ({
  isOpen,
  durationMinutes,
  mode,
  subject,
  interruptionsCount,
  onSaveSession,
  onSkip,
}) => {
  const [rating, setRating] = useState(5);
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div
        className="w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border transition-all text-right animate-scaleIn"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <button
            onClick={onSkip}
            className="p-1.5 rounded-lg border transition hover:opacity-80"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>

          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg">تقييم جلسة المرفأ</h3>
            <span className="text-xl">⚓</span>
          </div>
        </div>

        {/* Completed Stats Pill */}
        <div
          className="mt-4 p-3.5 rounded-2xl border flex items-center justify-between text-xs"
          style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: subject.color }} />
            <span className="font-semibold">{subject.name}</span>
          </div>
          <div className="flex items-center gap-3 font-mono">
            <span>{durationMinutes} دقيقة مكتملة</span>
            {interruptionsCount > 0 && (
              <span className="text-amber-600 dark:text-amber-400">({interruptionsCount} انقطاع)</span>
            )}
          </div>
        </div>

        {/* Star Rating (1 to 5) */}
        <div className="my-5 text-center">
          <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
            كيف كان مستوى انغماسك وتركيزك في هذه الجلسة؟
          </label>
          <div className="flex items-center justify-center gap-2 py-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-2 rounded-xl transition cursor-pointer hover:scale-110 active:scale-95"
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    star <= rating
                      ? 'fill-amber-400 text-amber-500'
                      : 'text-slate-300 dark:text-slate-700'
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
            {rating === 5
              ? 'انغماس تام وتدفق معرفي رائع'
              : rating === 4
              ? 'تركيز عالٍ وإنتاجية ممتازة'
              : rating === 3
              ? 'جلسة متوازنة مع بعض التشتت'
              : rating === 2
              ? 'تركيز متذبذب'
              : 'صعوبة في التركيز'}
          </span>
        </div>

        {/* Note field */}
        <div className="mb-6">
          <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
            ملاحظة إنجاز الجلسة (اختياري)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="ما الفصول أو المسائل أو الأهداف التي أنجزتها في هذه الجلسة؟"
            rows={3}
            className="w-full p-3 rounded-2xl border text-sm resize-none focus:outline-hidden"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSkip}
            className="flex-1 py-3 rounded-2xl border text-xs font-semibold transition cursor-pointer hover:opacity-80"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-secondary)',
            }}
          >
            تخطي التقييم
          </button>
          <button
            type="button"
            onClick={() => onSaveSession(rating, note)}
            className="flex-2 py-3 rounded-2xl text-xs font-bold text-white shadow-md transition cursor-pointer hover:opacity-90 active:scale-98"
            style={{ backgroundColor: 'var(--primary-color)' }}
          >
            حفظ الجلسة في المرفأ
          </button>
        </div>
      </div>
    </div>
  );
};
