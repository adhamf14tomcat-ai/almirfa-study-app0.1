import React, { useState, useEffect } from 'react';
import { dbService } from './services/db';
import {
  AppSettings,
  CustomSoundItem,
  DailyGoalStatus,
  LayoutConfig,
  QuoteItem,
  StreakData,
  StudySession,
  SubjectItem,
  TimerMode,
  UserProfile,
  BadgeItem,
  AdaptivePlannerData,
} from './types';
import {
  INITIAL_PROFILE,
  INITIAL_SETTINGS,
  INITIAL_LAYOUT,
  INITIAL_PLANNER,
  INITIAL_STREAK,
  INITIAL_DAILY_GOAL,
} from './constants';
import { getCurrentRank, getLocalDateString, calculateStreakUpdate, evaluateBadges } from './utils/gamification';

// Components
import { Header } from './components/Header';
import { Sidebar, ScreenTab } from './components/Sidebar';
import { SessionRatingModal } from './components/modals/SessionRatingModal';
import { OnboardingModal } from './components/modals/OnboardingModal';

// Views
import { MainView } from './components/views/MainView';
import { ProfileView } from './components/views/ProfileView';
import { BadgesView } from './components/views/BadgesView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { HeatmapView } from './components/views/HeatmapView';
import { SubjectsView } from './components/views/SubjectsView';
import { AdaptivePlannerView } from './components/views/AdaptivePlannerView';
import { QuotesView } from './components/views/QuotesView';
import { SoundsView } from './components/views/SoundsView';
import { WidgetOrderView } from './components/views/WidgetOrderView';
import { AppearanceView } from './components/views/AppearanceView';
import { TimerSettingsView } from './components/views/TimerSettingsView';
import { BackupView } from './components/views/BackupView';
import { SettingsView } from './components/views/SettingsView';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<ScreenTab>('home');
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  // App State
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);
  const [layout, setLayout] = useState<LayoutConfig>(INITIAL_LAYOUT);
  const [planner, setPlanner] = useState<AdaptivePlannerData>(INITIAL_PLANNER);
  const [streak, setStreak] = useState<StreakData>(INITIAL_STREAK);
  const [dailyGoals, setDailyGoals] = useState<DailyGoalStatus>(INITIAL_DAILY_GOAL);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [badges, setBadges] = useState<BadgeItem[]>([]);
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [activeQuote, setActiveQuote] = useState<QuoteItem | null>(null);
  const [customSounds, setCustomSounds] = useState<CustomSoundItem[]>([]);

  // Session Rating Modal
  const [ratingModalData, setRatingModalData] = useState<{
    isOpen: boolean;
    durationMinutes: number;
    mode: TimerMode;
    interruptionsCount: number;
  } | null>(null);

  // Initialize and load from IndexedDB
  useEffect(() => {
    const loadData = async () => {
      try {
        await dbService.init();

        const [
          loadedProfile,
          loadedSettings,
          loadedLayout,
          loadedPlanner,
          loadedStreak,
          loadedDailyGoals,
          loadedSubjects,
          loadedSessions,
          loadedBadges,
          loadedQuotes,
          loadedSounds,
        ] = await Promise.all([
          dbService.getProfile(),
          dbService.getSettings(),
          dbService.getLayout(),
          dbService.getPlanner(),
          dbService.getStreak(),
          dbService.getDailyGoals(),
          dbService.getSubjects(),
          dbService.getSessions(),
          dbService.getBadges(),
          dbService.getQuotes(),
          dbService.getSounds(),
        ]);

        setProfile(loadedProfile);
        setSettings(loadedSettings);
        setLayout(loadedLayout);
        setPlanner(loadedPlanner);
        setStreak(loadedStreak);
        setDailyGoals(loadedDailyGoals);
        setSubjects(loadedSubjects);
        setSelectedSubjectId(loadedSubjects[0]?.id || 'sub_general');
        setSessions(loadedSessions);
        setBadges(loadedBadges);
        setQuotes(loadedQuotes);
        setCustomSounds(loadedSounds);

        // Set initial quote
        if (loadedQuotes.length > 0) {
          const rand = loadedQuotes[Math.floor(Math.random() * loadedQuotes.length)];
          setActiveQuote(rand);
        }

        // Check if first-run onboarding should show
        if (!loadedProfile.hasSeenOnboarding) {
          setOnboardingOpen(true);
        }
      } catch (err) {
        console.error('Error loading Mirfa database:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Update Theme, Font, and Appearance on Document Root
  useEffect(() => {
    const root = document.documentElement;

    // Palette theme
    root.setAttribute('data-theme', settings.palette || settings.theme || 'navy-maritime');

    // Font Family
    root.setAttribute('data-font', (settings.fontFamily || settings.font || 'Tajawal').toString());

    // Font Scale
    root.style.fontSize = `${16 * settings.uiScale}px`;

    // Lighting Mode
    const isDarkSystem = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.remove('dark', 'oled-mode');

    if (settings.appearance === 'dark') {
      root.classList.add('dark');
    } else if (settings.appearance === 'oled') {
      root.classList.add('dark', 'oled-mode');
    } else if (settings.appearance === 'auto') {
      if (isDarkSystem) {
        root.classList.add('dark');
      }
    }
  }, [settings.palette, settings.fontFamily, settings.appearance, settings.uiScale]);

  // Handle Session Completion
  const handleSessionComplete = async (data: {
    durationMinutes: number;
    mode: TimerMode;
    interruptionsCount: number;
  }) => {
    setRatingModalData({
      isOpen: true,
      durationMinutes: data.durationMinutes,
      mode: data.mode,
      interruptionsCount: data.interruptionsCount,
    });
  };

  // Save session to IndexedDB & evaluate streaks, points, and badges
  const handleSaveSessionRating = async (rating: number, note: string) => {
    if (!ratingModalData) return;

    const todayStr = getLocalDateString();
    const durationMins = ratingModalData.durationMinutes;

    const newSession: StudySession = {
      id: `session_${Date.now()}`,
      subjectId: selectedSubjectId,
      durationMinutes: durationMins,
      startedAt: new Date(Date.now() - durationMins * 60 * 1000).toISOString(),
      endedAt: new Date().toISOString(),
      date: todayStr,
      mode: ratingModalData.mode,
      rating,
      note,
      interruptionsCount: ratingModalData.interruptionsCount,
      isCompleted: true,
    };

    // 1. Save session to DB
    await dbService.saveSession(newSession);
    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);

    // 2. Update Daily Goals
    const newCompletedMins = dailyGoals.completedMinutes + durationMins;
    const updatedDailyGoals: DailyGoalStatus = {
      ...dailyGoals,
      completedMinutes: newCompletedMins,
      date: todayStr,
    };
    await dbService.saveDailyGoals(updatedDailyGoals);
    setDailyGoals(updatedDailyGoals);

    // 3. Calculate Streak update
    const { updatedStreak } = calculateStreakUpdate(streak, newCompletedMins, todayStr);
    await dbService.saveStreak(updatedStreak);
    setStreak(updatedStreak);

    // 4. Update Profile Points (1 point per 60 minutes)
    const pointsGained = Math.floor(durationMins / 60) || (newCompletedMins % 60 === 0 ? 1 : 0);
    const newTotalPoints = profile.points + (durationMins >= 30 ? 1 : 0);
    const updatedProfile: UserProfile = {
      ...profile,
      points: newTotalPoints,
      level: Math.floor(newTotalPoints / 10) + 1,
    };
    await dbService.saveProfile(updatedProfile);
    setProfile(updatedProfile);

    // 5. Evaluate Badges
    const { updatedBadges } = evaluateBadges(badges, updatedSessions, updatedStreak, updatedProfile);
    await dbService.saveBadges(updatedBadges);
    setBadges(updatedBadges);

    setRatingModalData(null);
  };

  const handleSkipRating = () => {
    handleSaveSessionRating(5, '');
  };

  // Quote actions
  const handleRegenerateQuote = () => {
    if (quotes.length === 0) return;
    const rand = quotes[Math.floor(Math.random() * quotes.length)];
    setActiveQuote(rand);
  };

  const handleToggleSaveQuote = async (targetQuote: QuoteItem) => {
    const updated = { ...targetQuote, isSaved: !targetQuote.isSaved };
    await dbService.saveQuote(updated);
    const updatedList = quotes.map((q) => (q.id === targetQuote.id ? updated : q));
    setQuotes(updatedList);
    if (activeQuote?.id === targetQuote.id) {
      setActiveQuote(updated);
    }
  };

  const handleAddCustomQuote = async (data: { text: string; source: string }) => {
    const newQuote: QuoteItem = {
      id: `q_custom_${Date.now()}`,
      text: data.text,
      source: data.source,
      isSaved: true,
      isCustom: true,
    };
    await dbService.saveQuote(newQuote);
    setQuotes((prev) => [newQuote, ...prev]);
  };

  const handleDeleteQuote = async (id: string) => {
    await dbService.deleteQuote(id);
    setQuotes((prev) => prev.filter((q) => q.id !== id));
  };

  // Subject actions
  const handleAddSubject = async (subData: Omit<SubjectItem, 'id' | 'createdAt'>) => {
    const newSub: SubjectItem = {
      ...subData,
      id: `sub_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    await dbService.saveSubject(newSub);
    setSubjects((prev) => [...prev, newSub]);
    setSelectedSubjectId(newSub.id);
  };

  const handleUpdateSubject = async (sub: SubjectItem) => {
    await dbService.saveSubject(sub);
    setSubjects((prev) => prev.map((s) => (s.id === sub.id ? sub : s)));
  };

  const handleDeleteSubject = async (id: string) => {
    await dbService.deleteSubject(id);
    const filtered = subjects.filter((s) => s.id !== id);
    setSubjects(filtered);
    if (selectedSubjectId === id) {
      setSelectedSubjectId(filtered[0]?.id || '');
    }
  };

  // Sound actions
  const handleAddCustomSound = async (soundData: {
    name: string;
    base64Data: string;
    sizeBytes: number;
  }) => {
    const newSound: CustomSoundItem = {
      id: `sound_${Date.now()}`,
      name: soundData.name,
      base64Data: soundData.base64Data,
      sizeBytes: soundData.sizeBytes,
      createdAt: new Date().toISOString(),
    };
    await dbService.saveSound(newSound);
    setCustomSounds((prev) => [...prev, newSound]);
  };

  const handleUpdateCustomSoundName = async (id: string, newName: string) => {
    const target = customSounds.find((s) => s.id === id);
    if (!target) return;
    const updated = { ...target, name: newName };
    await dbService.saveSound(updated);
    setCustomSounds((prev) => prev.map((s) => (s.id === id ? updated : s)));
  };

  const handleDeleteCustomSound = async (id: string) => {
    await dbService.deleteSound(id);
    setCustomSounds((prev) => prev.filter((s) => s.id !== id));
  };

  // Streak Shield Manual Activation
  const handleUseStreakShield = async () => {
    if (streak.shields <= 0) return;
    const todayStr = getLocalDateString();
    const updatedStreak: StreakData = {
      ...streak,
      shields: streak.shields - 1,
      current: streak.current + 1,
      lastQualifiedDate: todayStr,
      shieldHistory: [
        ...streak.shieldHistory,
        {
          id: `shield_${Date.now()}`,
          date: todayStr,
          reason: 'تفعيل يدوي لحماية الستريك',
          usedAt: new Date().toISOString(),
        },
      ],
    };
    await dbService.saveStreak(updatedStreak);
    setStreak(updatedStreak);
  };

  // Settings & Layout actions
  const handleUpdateSettings = async (partial: Partial<AppSettings>) => {
    const updated = { ...settings, ...partial };
    await dbService.saveSettings(updated);
    setSettings(updated);
  };

  const handleUpdateLayout = async (newLayout: LayoutConfig) => {
    await dbService.saveLayout(newLayout);
    setLayout(newLayout);
  };

  const handleUpdatePlanner = async (newPlanner: AdaptivePlannerData) => {
    await dbService.savePlanner(newPlanner);
    setPlanner(newPlanner);
  };

  const handleUpdateProfileName = async (name: string) => {
    const updated = { ...profile, name };
    await dbService.saveProfile(updated);
    setProfile(updated);
  };

  const handleUpdateDailyTarget = async (minutes: number) => {
    const updated = { ...dailyGoals, targetMinutes: minutes };
    await dbService.saveDailyGoals(updated);
    setDailyGoals(updated);
  };

  const handleCloseOnboarding = async () => {
    setOnboardingOpen(false);
    const updated = { ...profile, hasSeenOnboarding: true };
    await dbService.saveProfile(updated);
    setProfile(updated);
  };

  const handleReloadAll = async () => {
    setIsLoading(true);
    try {
      const [
        p,
        s,
        l,
        pl,
        st,
        dg,
        subs,
        sess,
        b,
        q,
        sounds,
      ] = await Promise.all([
        dbService.getProfile(),
        dbService.getSettings(),
        dbService.getLayout(),
        dbService.getPlanner(),
        dbService.getStreak(),
        dbService.getDailyGoals(),
        dbService.getSubjects(),
        dbService.getSessions(),
        dbService.getBadges(),
        dbService.getQuotes(),
        dbService.getSounds(),
      ]);

      setProfile(p);
      setSettings(s);
      setLayout(l);
      setPlanner(pl);
      setStreak(st);
      setDailyGoals(dg);
      setSubjects(subs);
      setSelectedSubjectId(subs[0]?.id || '');
      setSessions(sess);
      setBadges(b);
      setQuotes(q);
      setCustomSounds(sounds);
      if (q.length > 0) setActiveQuote(q[0]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetAllData = async () => {
    await dbService.resetAllData();
    await handleReloadAll();
    setCurrentTab('home');
  };

  // Font family class
  const fontClass =
    settings.fontFamily === 'tajawal'
      ? 'font-tajawal'
      : settings.fontFamily === 'cairo'
      ? 'font-cairo'
      : settings.fontFamily === 'readex'
      ? 'font-readex'
      : 'font-vazirmatn';

  const currentRank = getCurrentRank(profile.points);
  const activeSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  if (isLoading) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex flex-col items-center justify-center p-6 text-center font-tajawal"
        style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}
      >
        <span className="text-5xl animate-bounce mb-4">⚓</span>
        <h2 className="text-xl font-bold">جاري تحميل المرفأ...</h2>
        <p className="text-xs text-slate-500 mt-1">تجهيز بيئة العمل والتركيز الهادئ</p>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className={`min-h-screen flex flex-col transition-colors duration-200 ${fontClass}`}
      style={{
        backgroundColor: 'var(--bg-page)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Top Header */}
      <Header
        onOpenSidebar={() => setSidebarOpen(true)}
        profile={profile}
        streak={streak}
        currentRank={currentRank}
        onOpenProfile={() => setCurrentTab('profile')}
        onOpenStreakShield={() => setCurrentTab('profile')}
      />

      {/* 14-Section Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenOnboarding={() => setOnboardingOpen(true)}
      />

      {/* Main Container Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-4 sm:px-6 sm:py-6">
        {currentTab === 'home' && (
          <MainView
            layout={layout}
            settings={settings}
            quote={activeQuote}
            savedQuotesCount={quotes.filter((q) => q.isSaved).length}
            subjects={subjects}
            selectedSubjectId={selectedSubjectId}
            dailyGoals={dailyGoals}
            customSounds={customSounds}
            onRegenerateQuote={handleRegenerateQuote}
            onToggleSaveQuote={handleToggleSaveQuote}
            onOpenQuotesNotebook={() => setCurrentTab('quotes')}
            onSelectSubject={(id) => setSelectedSubjectId(id)}
            onManageSubjects={() => setCurrentTab('subjects')}
            onUpdateSettings={handleUpdateSettings}
            onSessionComplete={handleSessionComplete}
            onUpdateVolume={(type, vol) => {
              if (type === 'ambient') handleUpdateSettings({ ambientVolume: vol });
              else handleUpdateSettings({ personalVolume: vol });
            }}
            onOpenSoundLibrary={() => setCurrentTab('sounds')}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            profile={profile}
            streak={streak}
            sessions={sessions}
            onUpdateProfileName={handleUpdateProfileName}
            onUseStreakShield={handleUseStreakShield}
          />
        )}

        {currentTab === 'badges' && <BadgesView badges={badges} />}

        {currentTab === 'analytics' && (
          <AnalyticsView
            sessions={sessions}
            subjects={subjects}
            streak={streak}
            dailyGoals={dailyGoals}
          />
        )}

        {currentTab === 'heatmap' && (
          <HeatmapView sessions={sessions} subjects={subjects} />
        )}

        {currentTab === 'subjects' && (
          <SubjectsView
            subjects={subjects}
            sessions={sessions}
            onAddSubject={handleAddSubject}
            onUpdateSubject={handleUpdateSubject}
            onDeleteSubject={handleDeleteSubject}
          />
        )}

        {currentTab === 'planner' && (
          <AdaptivePlannerView
            planner={planner}
            subjects={subjects}
            sessions={sessions}
            onUpdatePlanner={handleUpdatePlanner}
          />
        )}

        {currentTab === 'quotes' && (
          <QuotesView
            quotes={quotes}
            onToggleSaveQuote={handleToggleSaveQuote}
            onAddCustomQuote={handleAddCustomQuote}
            onDeleteQuote={handleDeleteQuote}
          />
        )}

        {currentTab === 'sounds' && (
          <SoundsView
            customSounds={customSounds}
            onAddCustomSound={handleAddCustomSound}
            onUpdateCustomSoundName={handleUpdateCustomSoundName}
            onDeleteCustomSound={handleDeleteCustomSound}
          />
        )}

        {currentTab === 'widgets' && (
          <WidgetOrderView layout={layout} onUpdateLayout={handleUpdateLayout} />
        )}

        {currentTab === 'appearance' && (
          <AppearanceView settings={settings} onUpdateSettings={handleUpdateSettings} />
        )}

        {currentTab === 'timer-settings' && (
          <TimerSettingsView settings={settings} onUpdateSettings={handleUpdateSettings} />
        )}

        {currentTab === 'backup' && (
          <BackupView
            onDataRestored={handleReloadAll}
            onResetAllData={handleResetAllData}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            settings={settings}
            dailyGoals={dailyGoals}
            onUpdateDailyTarget={handleUpdateDailyTarget}
            onOpenOnboarding={() => setOnboardingOpen(true)}
            onNavigateToTab={(tab) => setCurrentTab(tab)}
          />
        )}
      </main>

      {/* Post-Session Rating & Reflection Modal */}
      {ratingModalData && activeSubject && (
        <SessionRatingModal
          isOpen={ratingModalData.isOpen}
          durationMinutes={ratingModalData.durationMinutes}
          mode={ratingModalData.mode}
          subject={activeSubject}
          interruptionsCount={ratingModalData.interruptionsCount}
          onSaveSession={handleSaveSessionRating}
          onSkip={handleSkipRating}
        />
      )}

      {/* Onboarding Guide Modal */}
      <OnboardingModal
        isOpen={onboardingOpen}
        onClose={handleCloseOnboarding}
      />
    </div>
  );
}
