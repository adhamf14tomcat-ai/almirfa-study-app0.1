import React from 'react';
import {
  Home,
  User,
  Award,
  BarChart3,
  Calendar,
  BookOpen,
  CalendarDays,
  Bookmark,
  Volume2,
  LayoutGrid,
  Palette,
  Timer,
  Database,
  Settings,
  X,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { APP_MOTTO } from '../constants';

export type ScreenTab =
  | 'home'
  | 'profile'
  | 'badges'
  | 'analytics'
  | 'heatmap'
  | 'subjects'
  | 'planner'
  | 'quotes'
  | 'sounds'
  | 'widgets'
  | 'appearance'
  | 'timer-settings'
  | 'backup'
  | 'settings';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
  onOpenOnboarding: () => void;
}

interface MenuItem {
  id: ScreenTab;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentTab,
  onSelectTab,
  onOpenOnboarding,
}) => {
  const menuItems: MenuItem[] = [
    { id: 'home', title: 'الرئيسية', icon: Home },
    { id: 'profile', title: 'الملف الشخصي والرتب', icon: User },
    { id: 'badges', title: 'معرض الأوسمة', icon: Award },
    { id: 'analytics', title: 'الإحصائيات', icon: BarChart3 },
    { id: 'heatmap', title: 'الخريطة الحرارية', icon: Calendar },
    { id: 'subjects', title: 'المواد الدراسية', icon: BookOpen },
    { id: 'planner', title: 'المنسق التكيفي للجداول', icon: CalendarDays },
    { id: 'quotes', title: 'دفتر المقولات', icon: Bookmark },
    { id: 'sounds', title: 'مكتبة الأصوات', icon: Volume2 },
    { id: 'widgets', title: 'ترتيب الودجات', icon: LayoutGrid },
    { id: 'appearance', title: 'المظهر والألوان والخطوط', icon: Palette },
    { id: 'timer-settings', title: 'إعدادات المؤقت', icon: Timer },
    { id: 'backup', title: 'النسخ الاحتياطي والاستعادة', icon: Database },
    { id: 'settings', title: 'إعدادات التطبيق', icon: Settings },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        id="app-sidebar"
        dir="rtl"
        aria-label="القائمة الجانبية للتنقل"
        className={`fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          backgroundColor: 'var(--bg-card)',
          color: 'var(--text-primary)',
          borderLeft: '1px solid var(--border-color)',
        }}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl select-none" role="img" aria-label="مرساة المرفأ">
              ⚓
            </span>
            <div>
              <h2 className="font-bold text-base leading-tight">قائمة المرفأ</h2>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                إدارة التركيز والعمل العميق
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="إغلاق القائمة"
            className="p-1.5 rounded-lg border transition hover:opacity-80"
            style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-elevated)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-link-${item.id}`}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer text-right ${
                  isActive
                    ? 'shadow-xs font-semibold'
                    : 'hover:bg-slate-500/10 opacity-90 hover:opacity-100'
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: 'var(--primary-color)',
                        color: '#ffffff',
                      }
                    : {
                        color: 'var(--text-primary)',
                      }
                }
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs opacity-50 w-4 text-center">{index + 1}</span>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'opacity-80'}`} />
                  <span>{item.title}</span>
                </div>

                {item.badge && (
                  <span
                    className="px-2 py-0.5 text-[10px] rounded-full font-bold"
                    style={{
                      backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'var(--bg-elevated)',
                      color: isActive ? '#fff' : 'var(--text-muted)',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info & Actions */}
        <div className="p-3 border-t space-y-2.5" style={{ borderColor: 'var(--border-color)' }}>
          <PWAInstallButton variant="sidebar" />

          <button
            onClick={() => {
              onOpenOnboarding();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition hover:opacity-80 cursor-pointer"
            style={{
              borderColor: 'var(--border-color)',
              backgroundColor: 'var(--bg-elevated)',
              color: 'var(--text-secondary)',
            }}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>دليل استخدام المرفأ</span>
          </button>

          <p className="text-[11px] text-center leading-tight italic opacity-75" style={{ color: 'var(--text-muted)' }}>
            «{APP_MOTTO}»
          </p>
        </div>
      </aside>
    </>
  );
};
