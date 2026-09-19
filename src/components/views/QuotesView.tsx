import React, { useState } from 'react';
import { Bookmark, BookmarkCheck, Plus, Trash2, X, Sparkles, Quote } from 'lucide-react';
import { QuoteItem } from '../../types';

interface QuotesViewProps {
  quotes: QuoteItem[];
  onToggleSaveQuote: (quote: QuoteItem) => void;
  onAddCustomQuote: (quote: { text: string; source: string }) => void;
  onDeleteQuote: (id: string) => void;
}

export const QuotesView: React.FC<QuotesViewProps> = ({
  quotes,
  onToggleSaveQuote,
  onAddCustomQuote,
  onDeleteQuote,
}) => {
  const [filter, setFilter] = useState<'saved' | 'all'>('saved');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newText, setNewText] = useState('');
  const [newSource, setNewSource] = useState('');

  const displayedQuotes =
    filter === 'saved' ? quotes.filter((q) => q.isSaved) : quotes;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    onAddCustomQuote({
      text: newText.trim(),
      source: newSource.trim() || 'مجهول',
    });

    setNewText('');
    setNewSource('');
    setShowAddModal(false);
  };

  const savedCount = quotes.filter((q) => q.isSaved).length;

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
            <span>دفتر المقولات والحكم</span>
            <Bookmark className="w-6 h-6 text-sky-500" />
          </h2>
          <p className="mt-1 text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
            مقتطفات ملهمة تعزز العزيمة والتركيز، مع إمكانية تدوين وحفظ مقولاتك المفضلة
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold text-white shadow-md transition cursor-pointer hover:opacity-90 active:scale-95"
            style={{ backgroundColor: 'var(--primary-color)' }}
          >
            <Plus className="w-4 h-4" />
            <span>إضافة مقولة خاصة</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('saved')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold border transition cursor-pointer ${
            filter === 'saved' ? 'shadow-xs' : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            backgroundColor: filter === 'saved' ? 'var(--primary-color)' : 'var(--bg-elevated)',
            borderColor: 'var(--border-color)',
            color: filter === 'saved' ? '#ffffff' : 'var(--text-primary)',
          }}
        >
          المقولات المحفوظة ({savedCount})
        </button>

        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold border transition cursor-pointer ${
            filter === 'all' ? 'shadow-xs' : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            backgroundColor: filter === 'all' ? 'var(--primary-color)' : 'var(--bg-elevated)',
            borderColor: 'var(--border-color)',
            color: filter === 'all' ? '#ffffff' : 'var(--text-primary)',
          }}
        >
          جميع المقولات ({quotes.length})
        </button>
      </div>

      {/* Quotes Cards Grid */}
      {displayedQuotes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayedQuotes.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-3xl border shadow-xs transition-all flex flex-col justify-between gap-4 relative overflow-hidden"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              <div>
                <p className="text-base font-medium leading-relaxed">
                  «{item.text}»
                </p>
                {item.source && (
                  <p className="mt-2 text-xs font-normal opacity-75" style={{ color: 'var(--text-muted)' }}>
                    — {item.source}
                  </p>
                )}
              </div>

              {/* Footer Controls */}
              <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onToggleSaveQuote(item)}
                    title={item.isSaved ? 'إزالة من المحفوظات' : 'حفظ في المفضلة'}
                    className="p-1.5 rounded-xl border transition cursor-pointer hover:opacity-80"
                    style={{
                      backgroundColor: item.isSaved ? 'rgba(2, 132, 199, 0.12)' : 'var(--bg-elevated)',
                      borderColor: item.isSaved ? '#0284c7' : 'var(--border-color)',
                      color: item.isSaved ? '#0284c7' : 'var(--text-muted)',
                    }}
                  >
                    {item.isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>

                  {item.isCustom && (
                    <button
                      onClick={() => {
                        if (confirm('هل تريد حذف هذه المقولة المخصصة؟')) {
                          onDeleteQuote(item.id);
                        }
                      }}
                      className="p-1.5 rounded-xl border text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                      style={{ borderColor: 'var(--border-color)' }}
                      title="حذف المقولة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {item.isCustom && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium">
                    مقولة شخصية
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="p-12 rounded-3xl border text-center space-y-2"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          <Quote className="w-8 h-8 mx-auto opacity-30" />
          <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
            لا توجد مقولات محفوظة حالياً
          </p>
          <p className="text-xs text-slate-500">
            يمكنك حفظ أي مقولة تنال إعجابك في الواجهة الرئيسية لتظهر هنا دائمًا.
          </p>
        </div>
      )}

      {/* Add Custom Quote Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <form
            onSubmit={handleAddSubmit}
            className="w-full max-w-md rounded-3xl p-6 shadow-2xl border transition-all text-right"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg border transition hover:opacity-80"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
              <h3 className="font-bold text-base">إضافة مقولة ملهمة جديدة</h3>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                  نص المقولة أو الحكمة
                </label>
                <textarea
                  required
                  rows={4}
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="اكتب المقولة التي تحفزك هنا..."
                  className="w-full p-3 rounded-xl border text-sm resize-none"
                  style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-color)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                  القائل أو المصدر (اختياري)
                </label>
                <input
                  type="text"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  placeholder="مثال: ابن القيم، ستيف جوبز، مثل عربي..."
                  className="w-full p-2.5 rounded-xl border text-sm"
                  style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-color)' }}
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl border text-xs font-semibold"
                style={{ borderColor: 'var(--border-color)' }}
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl text-xs font-bold text-white shadow-md cursor-pointer"
                style={{ backgroundColor: 'var(--primary-color)' }}
              >
                حفظ في الدفتر
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
