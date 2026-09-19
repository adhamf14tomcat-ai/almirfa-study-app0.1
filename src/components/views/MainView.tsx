import React from 'react';
import {
  AppSettings,
  CustomSoundItem,
  DailyGoalStatus,
  LayoutConfig,
  QuoteItem,
  SubjectItem,
  TimerMode,
  WidgetType,
} from '../../types';
import { QuoteCardWidget } from '../widgets/QuoteCardWidget';
import { SubjectSelectorWidget } from '../widgets/SubjectSelectorWidget';
import { FocusTimerWidget } from '../widgets/FocusTimerWidget';
import { DailyProgressWidget } from '../widgets/DailyProgressWidget';
import { BottomAudioBarWidget } from '../widgets/BottomAudioBarWidget';

interface MainViewProps {
  layout: LayoutConfig;
  settings: AppSettings;
  quote: QuoteItem | null;
  savedQuotesCount: number;
  subjects: SubjectItem[];
  selectedSubjectId: string;
  dailyGoals: DailyGoalStatus;
  customSounds: CustomSoundItem[];
  onRegenerateQuote: () => void;
  onToggleSaveQuote: (q: QuoteItem) => void;
  onOpenQuotesNotebook: () => void;
  onSelectSubject: (id: string) => void;
  onManageSubjects: () => void;
  onUpdateSettings: (s: Partial<AppSettings>) => void;
  onSessionComplete: (data: {
    durationMinutes: number;
    mode: TimerMode;
    interruptionsCount: number;
  }) => void;
  onUpdateVolume: (type: 'ambient' | 'personal', vol: number) => void;
  onOpenSoundLibrary: () => void;
}

export const MainView: React.FC<MainViewProps> = ({
  layout,
  settings,
  quote,
  savedQuotesCount,
  subjects,
  selectedSubjectId,
  dailyGoals,
  customSounds,
  onRegenerateQuote,
  onToggleSaveQuote,
  onOpenQuotesNotebook,
  onSelectSubject,
  onManageSubjects,
  onUpdateSettings,
  onSessionComplete,
  onUpdateVolume,
  onOpenSoundLibrary,
}) => {
  const activeSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  // Render individual widget component by key
  const renderWidget = (widgetType: WidgetType) => {
    switch (widgetType) {
      case 'quote':
        return (
          <QuoteCardWidget
            key="quote"
            quote={quote}
            savedCount={savedQuotesCount}
            onRegenerate={onRegenerateQuote}
            onToggleSave={onToggleSaveQuote}
            onOpenQuotesNotebook={onOpenQuotesNotebook}
          />
        );
      case 'subject':
        return (
          <SubjectSelectorWidget
            key="subject"
            subjects={subjects}
            selectedSubjectId={selectedSubjectId}
            onSelectSubject={onSelectSubject}
            onManageSubjects={onManageSubjects}
          />
        );
      case 'timer':
        return (
          <FocusTimerWidget
            key="timer"
            settings={settings}
            activeSubject={activeSubject}
            onUpdateSettings={onUpdateSettings}
            onSessionComplete={onSessionComplete}
          />
        );
      case 'daily-progress':
        return (
          <DailyProgressWidget
            key="daily-progress"
            dailyGoals={dailyGoals}
          />
        );
      case 'audio-player':
        return (
          <BottomAudioBarWidget
            key="audio-player"
            ambientVolume={settings.ambientVolume}
            personalVolume={settings.personalVolume}
            onUpdateVolume={onUpdateVolume}
            customSounds={customSounds}
            dailyGoals={dailyGoals}
            onOpenSoundLibrary={onOpenSoundLibrary}
          />
        );
      default:
        return null;
    }
  };

  // Layout Preset 3: Minimalist (Timer alone with minimal controls)
  if (layout.preset === 'minimal') {
    return (
      <div className="w-full max-w-xl mx-auto py-4 sm:py-8 space-y-4">
        <FocusTimerWidget
          settings={settings}
          activeSubject={activeSubject}
          onUpdateSettings={onUpdateSettings}
          onSessionComplete={onSessionComplete}
        />
        <BottomAudioBarWidget
          ambientVolume={settings.ambientVolume}
          personalVolume={settings.personalVolume}
          onUpdateVolume={onUpdateVolume}
          customSounds={customSounds}
          dailyGoals={dailyGoals}
          onOpenSoundLibrary={onOpenSoundLibrary}
        />
      </div>
    );
  }

  // Layout Preset 2: Split side-by-side
  if (layout.preset === 'split') {
    return (
      <div className="w-full max-w-6xl mx-auto py-4 sm:py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Right side in RTL: Timer */}
        <div className="lg:col-span-7 space-y-5">
          <FocusTimerWidget
            settings={settings}
            activeSubject={activeSubject}
            onUpdateSettings={onUpdateSettings}
            onSessionComplete={onSessionComplete}
          />
          <BottomAudioBarWidget
            ambientVolume={settings.ambientVolume}
            personalVolume={settings.personalVolume}
            onUpdateVolume={onUpdateVolume}
            customSounds={customSounds}
            dailyGoals={dailyGoals}
            onOpenSoundLibrary={onOpenSoundLibrary}
          />
        </div>

        {/* Left side in RTL: Quote, Subject, Daily Progress */}
        <div className="lg:col-span-5 space-y-5">
          <QuoteCardWidget
            quote={quote}
            savedCount={savedQuotesCount}
            onRegenerate={onRegenerateQuote}
            onToggleSave={onToggleSaveQuote}
            onOpenQuotesNotebook={onOpenQuotesNotebook}
          />
          <SubjectSelectorWidget
            subjects={subjects}
            selectedSubjectId={selectedSubjectId}
            onSelectSubject={onSelectSubject}
            onManageSubjects={onManageSubjects}
          />
          <DailyProgressWidget dailyGoals={dailyGoals} />
        </div>
      </div>
    );
  }

  // Layout Preset 1: Central default (Reorderable via layout.widgets array)
  return (
    <div className="w-full max-w-3xl mx-auto py-4 sm:py-6 space-y-5">
      {layout.widgets.map((widgetType) => renderWidget(widgetType))}
    </div>
  );
};
