import React from 'react';
import { RefreshCw, Bookmark, BookmarkCheck } from 'lucide-react';
import { QuoteItem } from '../../types';

interface QuoteCardWidgetProps {
  quote: QuoteItem | null;
  savedCount: number;
  onRegenerate: () => void;
  onToggleSave: (quote: QuoteItem) => void;
  onOpenQuotesNotebook: () => void;
}

export const QuoteCardWidget: React.FC<QuoteCardWidgetProps> = ({
  quote,
  savedCount,
  onRegenerate,
  onToggleSave,
  onOpenQuotesNotebook,
}) => {
  if (!quote) return null;

  return (
    <div
      id="quote-widget-card"
      className="w-full rounded-2xl p-5 sm:p-6 transition-all duration-300 border shadow-xs text-right relative overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Decorative quote mark in background */}
      <span
        className="absolute -top-3 -right-2 text-7xl font-serif select-none pointer-events-none opacity-5 dark:opacity-10"
        aria-hidden="true"
      >
        “
      </span>

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Quote Content */}
        <div className="flex-1 pr-1">
          <p className="text-base sm:text-lg font-medium leading-relaxed tracking-normal">
            «{quote.text}»
          </p>
          {quote.source && (
            <p className="mt-2 text-xs font-normal" style={{ color: 'var(--text-muted)' }}>
              — {quote.source}
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
          {/* Saved count badge button */}
          <button
            onClick={onOpenQuotesNotebook}
            title="فتح دفتر المقولات المحفوظة"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer hover:opacity-80"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-secondary)',
            }}
          >
            <span>{savedCount} محفوظة</span>
          </button>

          {/* Save/Favorite toggle */}
          <button
            id="quote-save-btn"
            onClick={() => onToggleSave(quote)}
            title={quote.isSaved ? 'إزالة من المحفوظات' : 'حفظ في دفتر المرفأ'}
            aria-label={quote.isSaved ? 'إزالة المقولة' : 'حفظ المقولة'}
            className="p-2 rounded-xl border transition cursor-pointer hover:opacity-80"
            style={{
              backgroundColor: quote.isSaved ? 'rgba(2, 132, 199, 0.12)' : 'var(--bg-elevated)',
              borderColor: quote.isSaved ? '#0284c7' : 'var(--border-color)',
              color: quote.isSaved ? '#0284c7' : 'var(--text-muted)',
            }}
          >
            {quote.isSaved ? <BookmarkCheck className="w-4 h-4 fill-sky-600" /> : <Bookmark className="w-4 h-4" />}
          </button>

          {/* Regenerate quote */}
          <button
            id="quote-regenerate-btn"
            onClick={onRegenerate}
            title="مقولة أخرى"
            aria-label="توليد مقولة أخرى"
            className="p-2 rounded-xl border transition cursor-pointer hover:opacity-80 active:rotate-180 duration-300"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
