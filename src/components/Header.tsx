import React from 'react';
import { Menu, Flame, Award, Shield, Settings, Home } from 'lucide-react';
import { UserProfile, StreakData, RankInfo } from '../types';
import { ScreenTab } from './Sidebar';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  onOpenSidebar: () => void;
  profile: UserProfile;
  streak: StreakData;
  currentRank: RankInfo;
  onOpenProfile: () => void;
  onOpenStreakShield: () => void;
  currentTab?: ScreenTab;
  onSelectTab?: (tab: ScreenTab) => void;
  onGoHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSidebar,
  profile,
  streak,
  currentRank,
  onOpenProfile,
  onOpenStreakShield,
  currentTab = 'home',
  onSelectTab,
  onGoHome,
}) => {
  const isSettingsActive = [
    'settings',
    'appearance',
    'timer-settings',
    'widgets',
    'backup',
  ].includes(currentTab);

  const handleSettingsClick = () => {
    if (!onSelectTab) return;
    if (isSettingsActive) {
      if (onGoHome) onGoHome();
      else onSelectTab('home');
    } else {
      onSelectTab('settings');
    }
  };

  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 w-full backdrop-blur-md transition-colors border-b px-4 py-2.5 sm:px-6"
      style={{
        backgroundColor: 'rgba(var(--header-bg, 255, 255, 255), 0.85)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Right side in RTL: Sidebar Toggle and App Logo */}
        <div className="flex items-center gap-3">
          <button
            id="sidebar-toggle-btn"
            onClick={onOpenSidebar}
            aria-label="فتح القائمة الجانبية"
            className="p-2 rounded-xl border transition-colors cursor-pointer hover:opacity-80 smooth-nav-pill"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={onGoHome}
            title="المرفأ - العودة للرئيسية"
            className="flex items-center gap-2 select-none text-right cursor-pointer group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform" role="img" aria-label="شعار المرفأ">
              ⚓
            </span>
            <div>
              <h1 className="text-lg font-bold tracking-tight leading-none" style={{ color: 'var(--text-primary)' }}>
                المرفأ
              </h1>
              <span className="text-[10px] tracking-wider uppercase opacity-70" style={{ color: 'var(--text-muted)' }}>
                Al-Mirfa Focus
              </span>
            </div>
          </button>

          {/* Quick Return to Focus Desk button if away from home */}
          {currentTab !== 'home' && onGoHome && (
            <button
              onClick={onGoHome}
              title="العودة لمكتب التركيز (الرئيسية)"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 transition cursor-pointer smooth-nav-pill animate-fade-in"
              style={{ borderColor: 'rgba(2, 132, 199, 0.25)' }}
            >
              <Home className="w-3.5 h-3.5" />
              <span>الرئيسية</span>
            </button>
          )}
        </div>

        {/* Center/Left in RTL: Profile Badge & Streak & Settings & PWA Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Settings Toggle Button */}
          {onSelectTab && (
            <button
              id="header-settings-toggle-btn"
              onClick={handleSettingsClick}
              title={isSettingsActive ? 'العودة لمكتب التركيز' : 'إعدادات وتفضيلات التطبيق'}
              className={`p-2 rounded-xl border text-xs font-medium cursor-pointer transition smooth-nav-pill ${
                isSettingsActive ? 'shadow-xs scale-105' : 'hover:opacity-80'
              }`}
              style={
                isSettingsActive
                  ? {
                      backgroundColor: 'var(--primary-color)',
                      borderColor: 'var(--primary-color)',
                      color: '#ffffff',
                    }
                  : {
                      backgroundColor: 'var(--bg-elevated)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-secondary)',
                    }
              }
            >
              <Settings className={`w-4 h-4 ${isSettingsActive ? 'rotate-90 transition-transform' : ''}`} />
            </button>
          )}

          <PWAInstallButton variant="header" />

          {/* Streak Shield Quick Indicator */}
          <button
            id="streak-shield-btn"
            onClick={onOpenStreakShield}
            title="دروع حماية الستريك"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium cursor-pointer transition hover:opacity-90"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-color)',
              color: streak.shields > 0 ? '#0284c7' : 'var(--text-muted)',
            }}
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="font-semibold">{streak.shields}</span>
          </button>

          {/* Streak Days Badge */}
          <div
            id="streak-indicator-badge"
            title={`الستريك الحالي: ${streak.current} يوم`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold select-none"
            style={{
              backgroundColor: streak.current > 0 ? 'rgba(234, 88, 12, 0.12)' : 'var(--bg-elevated)',
              borderColor: streak.current > 0 ? 'rgba(234, 88, 12, 0.3)' : 'var(--border-color)',
              color: streak.current > 0 ? '#ea580c' : 'var(--text-muted)',
            }}
          >
            <Flame className={`w-3.5 h-3.5 ${streak.current > 0 ? 'fill-orange-500 animate-bounce' : ''}`} />
            <span>{streak.current} يوم</span>
          </div>

          {/* User Profile Mini Card */}
          <button
            id="header-profile-card"
            onClick={onOpenProfile}
            aria-label="عرض الملف الشخصي والرتب"
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-right transition cursor-pointer hover:shadow-xs hover:opacity-90"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-xs"
              style={{ backgroundColor: 'var(--primary-color)' }}
            >
              <Award className="w-4 h-4" />
            </div>

            <div className="hidden md:block leading-tight text-right">
              <div className="text-xs font-bold flex items-center gap-1">
                <span>{profile.name}</span>
                <span className="text-[10px] font-normal px-1.5 py-0.2 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  {currentRank.name}
                </span>
              </div>
              <div className="text-[10px] flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                <span>{profile.points} نقطة</span>
                <span>•</span>
                <span>المستوى {profile.level}</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
