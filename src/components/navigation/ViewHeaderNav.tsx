import React from 'react';
import { Home, Settings, ChevronLeft, ArrowRight } from 'lucide-react';
import { ScreenTab } from '../Sidebar';

interface ViewHeaderNavProps {
  currentTab: ScreenTab;
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  onBackToHome: () => void;
  onNavigateToTab?: (tab: ScreenTab) => void;
  relatedTabs?: { id: ScreenTab; label: string }[];
}

export const ViewHeaderNav: React.FC<ViewHeaderNavProps> = ({
  currentTab,
  title,
  subtitle,
  icon: Icon,
  onBackToHome,
  onNavigateToTab,
  relatedTabs,
}) => {
  return (
    <div className="w-full mb-6 space-y-3">
      <div
        className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-2xl border backdrop-blur-xs transition-colors"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
        }}
      >
        {/* Left/Right in RTL: Return to Home & Breadcrumb */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={onBackToHome}
            title="العودة لمكتب التركيز (الرئيسية)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 transition cursor-pointer smooth-nav-pill"
            style={{ borderColor: 'rgba(2, 132, 199, 0.25)' }}
          >
            <Home className="w-3.5 h-3.5" />
            <span>الرئيسية ⚓</span>
          </button>

          <span className="opacity-40">/</span>
          <span
            className="font-bold px-2 py-0.5 rounded-md flex items-center gap-1.5"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              color: 'var(--text-primary)',
            }}
          >
            {Icon && <Icon className="w-3.5 h-3.5 opacity-80" />}
            <span>{title}</span>
          </span>
        </div>

        {/* Right side: Quick Shortcuts & Settings */}
        <div className="flex items-center gap-2">
          {/* Related tabs shortcuts */}
          {relatedTabs && relatedTabs.length > 0 && onNavigateToTab && (
            <div className="hidden sm:flex items-center gap-1 text-xs">
              <span className="text-[11px] opacity-60 ml-1">انتقال سريع:</span>
              {relatedTabs.map((rel) => (
                <button
                  key={rel.id}
                  onClick={() => onNavigateToTab(rel.id)}
                  className="px-2.5 py-1 rounded-lg border text-[11px] font-medium transition cursor-pointer hover:bg-slate-500/10 smooth-nav-pill"
                  style={{
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-secondary)',
                    backgroundColor: 'var(--bg-elevated)',
                  }}
                >
                  {rel.label}
                </button>
              ))}
            </div>
          )}

          {/* Quick jump to Settings */}
          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab('settings')}
              title="الانتقال إلى إعدادات وتفضيلات التطبيق"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition cursor-pointer hover:bg-slate-500/10 smooth-nav-pill"
              style={{
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--bg-elevated)',
              }}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>الإعدادات</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
