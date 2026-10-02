import React from 'react';
import {
  Settings,
  Palette,
  Timer,
  LayoutGrid,
  Database,
  ArrowRight,
  Home,
  CheckCircle2,
} from 'lucide-react';
import { ScreenTab } from '../Sidebar';

interface SettingsTabsNavProps {
  currentTab: ScreenTab;
  onNavigate: (tab: ScreenTab) => void;
  onBackToHome?: () => void;
}

interface SettingsSubTab {
  id: ScreenTab;
  title: string;
  shortTitle: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export const SETTINGS_SUB_TABS: SettingsSubTab[] = [
  {
    id: 'settings',
    title: 'إعدادات عامة وهدف اليوم',
    shortTitle: 'عام',
    icon: Settings,
    description: 'الهدف اليومي، المساعد، والخصوصية',
  },
  {
    id: 'appearance',
    title: 'المظهر والألوان والخطوط',
    shortTitle: 'المظهر والخطوط',
    icon: Palette,
    description: 'السمات اللونية والخطوط العربية',
  },
  {
    id: 'timer-settings',
    title: 'المؤقت والوضع الصارم',
    shortTitle: 'المؤقت',
    icon: Timer,
    description: 'فترات بومودورو والاستراحات والصرامة',
  },
  {
    id: 'widgets',
    title: 'ترتيب الودجات ونمط الشاشة',
    shortTitle: 'الودجات والتخطيط',
    icon: LayoutGrid,
    description: 'إعادة الترتيب وأنماط العرض الثلاثة',
  },
  {
    id: 'backup',
    title: 'النسخ الاحتياطي والاستعادة',
    shortTitle: 'النسخ الاحتياطي',
    icon: Database,
    description: 'تصدير واستيراد ملف JSON محلياً',
  },
];

export const SettingsTabsNav: React.FC<SettingsTabsNavProps> = ({
  currentTab,
  onNavigate,
  onBackToHome,
}) => {
  const activeTabMeta = SETTINGS_SUB_TABS.find((t) => t.id === currentTab) || SETTINGS_SUB_TABS[0];
  const currentIndex = SETTINGS_SUB_TABS.findIndex((t) => t.id === currentTab);

  const prevTab = currentIndex > 0 ? SETTINGS_SUB_TABS[currentIndex - 1] : null;
  const nextTab =
    currentIndex >= 0 && currentIndex < SETTINGS_SUB_TABS.length - 1
      ? SETTINGS_SUB_TABS[currentIndex + 1]
      : null;

  return (
    <div className="w-full mb-6 space-y-3">
      {/* Top Breadcrumb & Return Bar */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-2xl border backdrop-blur-xs transition-colors"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="flex items-center gap-2 text-xs">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              title="العودة لمكتب التركيز (الرئيسية)"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 transition cursor-pointer smooth-nav-pill"
              style={{ borderColor: 'rgba(2, 132, 199, 0.25)' }}
            >
              <Home className="w-3.5 h-3.5" />
              <span>الرئيسية ⚓</span>
            </button>
          )}

          <span className="opacity-40">/</span>
          <span className="font-semibold text-slate-500 dark:text-slate-400">إعدادات التطبيق</span>
          <span className="opacity-40">/</span>
          <span
            className="font-bold px-2 py-0.5 rounded-md"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              color: 'var(--text-primary)',
            }}
          >
            {activeTabMeta.shortTitle}
          </span>
        </div>

        {/* Quick Prev / Next Shortcuts */}
        <div className="flex items-center gap-1.5 text-xs">
          {prevTab && (
            <button
              onClick={() => onNavigate(prevTab.id)}
              title={`الانتقال إلى: ${prevTab.title}`}
              className="px-2.5 py-1 rounded-lg border text-[11px] font-medium transition cursor-pointer hover:bg-slate-500/10 smooth-nav-pill flex items-center gap-1"
              style={{
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--bg-elevated)',
              }}
            >
              <span>السابق:</span>
              <span className="font-semibold">{prevTab.shortTitle}</span>
            </button>
          )}

          {nextTab && (
            <button
              onClick={() => onNavigate(nextTab.id)}
              title={`الانتقال إلى: ${nextTab.title}`}
              className="px-2.5 py-1 rounded-lg border text-[11px] font-medium transition cursor-pointer hover:bg-slate-500/10 smooth-nav-pill flex items-center gap-1"
              style={{
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--bg-elevated)',
              }}
            >
              <span>التالي:</span>
              <span className="font-semibold">{nextTab.shortTitle}</span>
              <ArrowRight className="w-3 h-3 rotate-180" />
            </button>
          )}
        </div>
      </div>

      {/* Segmented Sub-Tabs Bar */}
      <div
        className="p-1.5 rounded-2xl border shadow-xs overflow-x-auto no-scrollbar"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="flex items-center gap-1.5 min-w-max sm:min-w-0 sm:grid sm:grid-cols-5">
          {SETTINGS_SUB_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer smooth-nav-pill transition-all ${
                  isActive
                    ? 'shadow-xs scale-[1.02]'
                    : 'hover:bg-slate-500/10 opacity-75 hover:opacity-100'
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: 'var(--primary-color)',
                        color: '#ffffff',
                      }
                    : {
                        backgroundColor: 'transparent',
                        color: 'var(--text-primary)',
                      }
                }
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'opacity-80'}`} />
                <span className="truncate">{tab.shortTitle}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white opacity-90 animate-pulse hidden sm:inline-block" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
