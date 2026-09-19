import {
  AppSettings,
  BadgeItem,
  CustomSoundItem,
  DailyGoalStatus,
  LayoutConfig,
  QuoteItem,
  StudySession,
  StreakData,
  SubjectItem,
  UserProfile,
  AppFullBackup,
  AdaptivePlannerState,
} from '../types';
import {
  INITIAL_BADGES,
  INITIAL_DAILY_GOALS,
  INITIAL_LAYOUT,
  INITIAL_PROFILE,
  INITIAL_QUOTES,
  INITIAL_SETTINGS,
  INITIAL_STREAK,
  INITIAL_SUBJECT,
  INITIAL_PLANNER,
} from '../constants';

const DB_NAME = 'mirfa-db';
const DB_VERSION = 2;

const STORES = [
  'profile',
  'settings',
  'subjects',
  'sessions',
  'dailyGoals',
  'streak',
  'badges',
  'quotes',
  'sounds',
  'backups',
  'layout',
  'planner',
] as const;

export class MirfaDatabase {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<IDBDatabase> | null = null;

  public async init(): Promise<IDBDatabase> {
    return this.getDB();
  }

  public async getDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        STORES.forEach((storeName) => {
          if (!db.objectStoreNames.contains(storeName)) {
            if (storeName === 'subjects' || storeName === 'sessions' || storeName === 'badges' || storeName === 'quotes' || storeName === 'sounds' || storeName === 'backups') {
              db.createObjectStore(storeName, { keyPath: 'id' });
            } else {
              db.createObjectStore(storeName);
            }
          }
        });
      };

      request.onsuccess = async (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        await this.seedInitialDataIfEmpty();
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error('IndexedDB open error:', (event.target as IDBOpenDBRequest).error);
        reject((event.target as IDBOpenDBRequest).error);
      };
    });

    return this.initPromise;
  }

  private async seedInitialDataIfEmpty(): Promise<void> {
    const profile = await this.getSingleton<UserProfile>('profile', 'main');
    if (!profile) {
      await this.setSingleton('profile', 'main', INITIAL_PROFILE);
    }

    const settings = await this.getSingleton<AppSettings>('settings', 'main');
    if (!settings) {
      await this.setSingleton('settings', 'main', INITIAL_SETTINGS);
    }

    const subjects = await this.getAll<SubjectItem>('subjects');
    if (subjects.length === 0) {
      await this.putItem('subjects', INITIAL_SUBJECT);
    }

    const dailyGoals = await this.getSingleton<DailyGoalStatus>('dailyGoals', 'main');
    if (!dailyGoals) {
      await this.setSingleton('dailyGoals', 'main', INITIAL_DAILY_GOALS);
    }

    const streak = await this.getSingleton<StreakData>('streak', 'main');
    if (!streak) {
      await this.setSingleton('streak', 'main', INITIAL_STREAK);
    }

    const badges = await this.getAll<BadgeItem>('badges');
    if (badges.length === 0) {
      for (const badge of INITIAL_BADGES) {
        await this.putItem('badges', badge);
      }
    }

    const quotes = await this.getAll<QuoteItem>('quotes');
    if (quotes.length === 0) {
      for (const quote of INITIAL_QUOTES) {
        await this.putItem('quotes', quote);
      }
    }

    const layout = await this.getSingleton<LayoutConfig>('layout', 'main');
    if (!layout) {
      await this.setSingleton('layout', 'main', INITIAL_LAYOUT);
    }

    const planner = await this.getSingleton<AdaptivePlannerState>('planner', 'main');
    if (!planner) {
      await this.setSingleton('planner', 'main', INITIAL_PLANNER);
    }
  }

  // Generic helpers
  public async getSingleton<T>(storeName: string, key: string): Promise<T | null> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  public async setSingleton<T>(storeName: string, key: string, value: T): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(value, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  public async getAll<T>(storeName: string): Promise<T[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  public async getItem<T>(storeName: string, id: string): Promise<T | null> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  public async putItem<T>(storeName: string, item: T): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(item);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  public async deleteItem(storeName: string, id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  public async clearStore(storeName: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // Full backup generator
  public async createFullBackup(includeSounds = false): Promise<AppFullBackup> {
    const profile = (await this.getSingleton<UserProfile>('profile', 'main')) || INITIAL_PROFILE;
    const settings = (await this.getSingleton<AppSettings>('settings', 'main')) || INITIAL_SETTINGS;
    const subjects = await this.getAll<SubjectItem>('subjects');
    const sessions = await this.getAll<StudySession>('sessions');
    const dailyGoals = (await this.getSingleton<DailyGoalStatus>('dailyGoals', 'main')) || INITIAL_DAILY_GOALS;
    const streak = (await this.getSingleton<StreakData>('streak', 'main')) || INITIAL_STREAK;
    const badges = await this.getAll<BadgeItem>('badges');
    const quotes = await this.getAll<QuoteItem>('quotes');
    const customSounds = includeSounds ? await this.getAll<CustomSoundItem>('sounds') : [];
    const layout = (await this.getSingleton<LayoutConfig>('layout', 'main')) || INITIAL_LAYOUT;
    const planner = (await this.getSingleton<AdaptivePlannerState>('planner', 'main')) || INITIAL_PLANNER;

    return {
      appName: 'Al-Mirfa',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      profile,
      settings,
      subjects,
      sessions,
      dailyGoals,
      streak,
      badges,
      quotes,
      customSounds,
      layout,
      planner,
    };
  }

  // Restore backup
  public async restoreFullBackup(backup: AppFullBackup): Promise<boolean> {
    if (backup.appName !== 'Al-Mirfa') {
      throw new Error('الملف المحدد ليس نسخة احتياطية صالحة لتطبيق المرفأ.');
    }

    if (!backup.profile || !backup.settings || !Array.isArray(backup.subjects)) {
      throw new Error('ملف النسخة الاحتياطية تنقصه بعض الحقول الأساسية المطلوبة.');
    }

    // Save automated backup first
    const autoBackup = await this.createFullBackup(false);
    await this.putItem('backups', {
      id: `auto_${Date.now()}`,
      name: `نسخة تلقائية قبل الاستعادة (${new Date().toLocaleTimeString('ar-EG')})`,
      createdAt: new Date().toISOString(),
      data: autoBackup,
    });

    // Write restored data
    await this.setSingleton('profile', 'main', backup.profile);
    await this.setSingleton('settings', 'main', backup.settings);

    await this.clearStore('subjects');
    for (const sub of backup.subjects) {
      await this.putItem('subjects', sub);
    }

    await this.clearStore('sessions');
    if (Array.isArray(backup.sessions)) {
      for (const ses of backup.sessions) {
        await this.putItem('sessions', ses);
      }
    }

    if (backup.dailyGoals) {
      await this.setSingleton('dailyGoals', 'main', backup.dailyGoals);
    }

    if (backup.streak) {
      await this.setSingleton('streak', 'main', backup.streak);
    }

    if (Array.isArray(backup.badges) && backup.badges.length > 0) {
      await this.clearStore('badges');
      for (const b of backup.badges) {
        await this.putItem('badges', b);
      }
    }

    if (Array.isArray(backup.quotes) && backup.quotes.length > 0) {
      await this.clearStore('quotes');
      for (const q of backup.quotes) {
        await this.putItem('quotes', q);
      }
    }

    if (Array.isArray(backup.customSounds) && backup.customSounds.length > 0) {
      for (const s of backup.customSounds) {
        await this.putItem('sounds', s);
      }
    }

    if (backup.layout) {
      await this.setSingleton('layout', 'main', backup.layout);
    }

    if (backup.planner) {
      await this.setSingleton('planner', 'main', backup.planner);
    }

    return true;
  }

  // Clear all data and reset to defaults
  public async resetAllData(): Promise<void> {
    for (const store of STORES) {
      await this.clearStore(store);
    }
    await this.seedInitialDataIfEmpty();
  }

  // Typed convenience getters & setters
  public async getProfile(): Promise<UserProfile> {
    return (await this.getSingleton<UserProfile>('profile', 'main')) || INITIAL_PROFILE;
  }
  public async saveProfile(profile: UserProfile): Promise<void> {
    await this.setSingleton('profile', 'main', profile);
  }

  public async getSettings(): Promise<AppSettings> {
    return (await this.getSingleton<AppSettings>('settings', 'main')) || INITIAL_SETTINGS;
  }
  public async saveSettings(settings: AppSettings): Promise<void> {
    await this.setSingleton('settings', 'main', settings);
  }

  public async getLayout(): Promise<LayoutConfig> {
    return (await this.getSingleton<LayoutConfig>('layout', 'main')) || INITIAL_LAYOUT;
  }
  public async saveLayout(layout: LayoutConfig): Promise<void> {
    await this.setSingleton('layout', 'main', layout);
  }

  public async getPlanner(): Promise<AdaptivePlannerState> {
    return (await this.getSingleton<AdaptivePlannerState>('planner', 'main')) || INITIAL_PLANNER;
  }
  public async savePlanner(planner: AdaptivePlannerState): Promise<void> {
    await this.setSingleton('planner', 'main', planner);
  }

  public async getDailyGoals(): Promise<DailyGoalStatus> {
    return (await this.getSingleton<DailyGoalStatus>('dailyGoals', 'main')) || INITIAL_DAILY_GOALS;
  }
  public async saveDailyGoals(goals: DailyGoalStatus): Promise<void> {
    await this.setSingleton('dailyGoals', 'main', goals);
  }

  public async getStreak(): Promise<StreakData> {
    return (await this.getSingleton<StreakData>('streak', 'main')) || INITIAL_STREAK;
  }
  public async saveStreak(streak: StreakData): Promise<void> {
    await this.setSingleton('streak', 'main', streak);
  }

  public async getSubjects(): Promise<SubjectItem[]> {
    return await this.getAll<SubjectItem>('subjects');
  }
  public async saveSubject(subject: SubjectItem): Promise<void> {
    await this.putItem('subjects', subject);
  }
  public async deleteSubject(id: string): Promise<void> {
    await this.deleteItem('subjects', id);
  }

  public async getSessions(): Promise<StudySession[]> {
    return await this.getAll<StudySession>('sessions');
  }
  public async saveSession(session: StudySession): Promise<void> {
    await this.putItem('sessions', session);
  }

  public async getBadges(): Promise<BadgeItem[]> {
    return await this.getAll<BadgeItem>('badges');
  }
  public async saveBadges(badges: BadgeItem[]): Promise<void> {
    for (const b of badges) {
      await this.putItem('badges', b);
    }
  }

  public async getQuotes(): Promise<QuoteItem[]> {
    return await this.getAll<QuoteItem>('quotes');
  }
  public async saveQuote(quote: QuoteItem): Promise<void> {
    await this.putItem('quotes', quote);
  }
  public async deleteQuote(id: string): Promise<void> {
    await this.deleteItem('quotes', id);
  }

  public async getSounds(): Promise<CustomSoundItem[]> {
    return await this.getAll<CustomSoundItem>('sounds');
  }
  public async saveSound(sound: CustomSoundItem): Promise<void> {
    await this.putItem('sounds', sound);
  }
  public async deleteSound(id: string): Promise<void> {
    await this.deleteItem('sounds', id);
  }

  public async exportBackupJSON(includeSounds = false): Promise<string> {
    const backup = await this.createFullBackup(includeSounds);
    return JSON.stringify(backup, null, 2);
  }

  public async importBackupJSON(jsonStr: string): Promise<boolean> {
    const parsed = JSON.parse(jsonStr) as AppFullBackup;
    return await this.restoreFullBackup(parsed);
  }
}

export const dbService = new MirfaDatabase();
