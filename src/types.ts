export type AppearanceMode = 'light' | 'dark' | 'oled' | 'auto';

export type ThemePalette =
  | 'paper-ink'
  | 'navy-maritime'
  | 'vintage-olive'
  | 'warm-terracotta'
  | 'muted-blue'
  | 'desert-sand'
  | 'library-green'
  | 'archival-violet'
  | 'classic-grey';

export type ColorPalette = ThemePalette;

export type FontFamily =
  | 'Tajawal'
  | 'Cairo'
  | 'Readex Pro'
  | 'Vazirmatn'
  | 'tajawal'
  | 'cairo'
  | 'readex'
  | 'vazirmatn';

export type TimerMode = 'pomodoro' | 'stopwatch';

export type LayoutPreset = 'central' | 'split' | 'minimal';

export type WidgetType = 'quote' | 'subject' | 'timer' | 'daily-progress' | 'audio-player';

export interface UserProfile {
  name: string;
  level: number;
  points: number;
  streak: number;
  bestStreak: number;
  lastStudyDate: string | null;
  hasSeenOnboarding?: boolean;
}

export interface RankInfo {
  id: string;
  name: string;
  requiredPoints: number;
  description: string;
  isHonorary?: boolean;
  badgeColor?: string;
}

export interface AppSettings {
  appearanceMode: AppearanceMode;
  appearance?: AppearanceMode;
  oledMode: boolean;
  theme: ThemePalette;
  palette?: ThemePalette;
  font: FontFamily;
  fontFamily?: FontFamily;
  uiScale: number; // 0.8, 0.9, 1.0, 1.1, 1.2
  timerMode: TimerMode;
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  loops: number;
  strictMode: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  autoStartBreak: boolean;
  autoStartFocus: boolean;
  ambientVolume: number;
  personalVolume: number;
  autoUseShield: boolean;
}

export interface SubjectItem {
  id: string;
  name: string;
  color: string;
  targetMinutes: number;
  createdAt: string;
}

export interface StudySession {
  id: string;
  durationMinutes: number;
  mode: TimerMode | 'break';
  subjectId: string;
  subjectName?: string;
  startedAt: string;
  completedAt?: string;
  endedAt?: string;
  date?: string;
  rating: number; // 1 to 5
  note: string;
  interruptionsCount: number;
  isCompleted: boolean;
}

export interface DailyGoalStatus {
  targetMinutes: number;
  completedMinutes: number;
  date: string | null;
}

export interface ShieldUsage {
  id: string;
  date: string;
  reason: string;
  usedAt: string;
}

export interface StreakData {
  current: number;
  best: number;
  shields: number;
  lastQualifiedDate: string | null;
  shieldHistory: ShieldUsage[];
}

export interface BadgeItem {
  id: string;
  name: string;
  description: string;
  condition: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  icon: string;
  unlocked: boolean;
  unlockedAt: string | null;
}

export interface QuoteItem {
  id: string;
  text: string;
  source: string;
  isSaved: boolean;
  isCustom: boolean;
  createdAt?: string;
}

export interface CustomSoundItem {
  id: string;
  name: string;
  fileName?: string;
  fileType?: string;
  size?: number;
  sizeBytes?: number;
  base64Data?: string;
  createdAt: string;
}

export interface LayoutConfig {
  preset: LayoutPreset;
  widgets: WidgetType[];
}

export interface SubjectPriority {
  subjectId: string;
  priority: 'high' | 'medium' | 'low';
}

export interface AdaptivePlannerState {
  weeklyTargetHours: number;
  availableDays: number[]; // 0 for Sunday, 1 Monday, ... 6 Saturday
  dailyMaxHours: number;
  subjectPriorities: any;
}

export type AdaptivePlannerData = AdaptivePlannerState;

export interface AppFullBackup {
  appName: 'Al-Mirfa';
  version: string;
  exportedAt: string;
  profile: UserProfile;
  settings: AppSettings;
  subjects: SubjectItem[];
  sessions: StudySession[];
  dailyGoals: DailyGoalStatus;
  streak: StreakData;
  badges: BadgeItem[];
  quotes: QuoteItem[];
  customSounds: CustomSoundItem[];
  layout: LayoutConfig;
  planner: AdaptivePlannerState;
}
