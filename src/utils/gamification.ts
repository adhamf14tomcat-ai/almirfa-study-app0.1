import { BadgeItem, RankInfo, StreakData, StudySession, UserProfile } from '../types';
import { RANKS } from '../constants';

export function getCurrentRank(points: number): RankInfo {
  let matchedRank = RANKS[0];
  for (const rank of RANKS) {
    if (points >= rank.requiredPoints) {
      matchedRank = rank;
    }
  }
  return matchedRank;
}

export function getNextRank(points: number): { nextRank: RankInfo | null; pointsNeeded: number } {
  for (const rank of RANKS) {
    if (points < rank.requiredPoints) {
      return {
        nextRank: rank,
        pointsNeeded: rank.requiredPoints - points,
      };
    }
  }
  return { nextRank: null, pointsNeeded: 0 };
}

export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateStreakUpdate(
  currentStreakData: StreakData,
  todayTotalMinutes: number,
  todayStr: string = getLocalDateString(),
  autoUseShield: boolean = true
): { updatedStreak: StreakData; shieldUsed: boolean } {
  let { current, best, shields, lastQualifiedDate, shieldHistory } = { ...currentStreakData };
  let shieldUsed = false;

  // If already qualified today, return current
  if (lastQualifiedDate === todayStr) {
    return { updatedStreak: currentStreakData, shieldUsed: false };
  }

  // Has today reached 30 minutes?
  if (todayTotalMinutes >= 30) {
    if (!lastQualifiedDate) {
      current = 1;
    } else {
      const lastDate = new Date(lastQualifiedDate);
      const todayDate = new Date(todayStr);
      const diffTime = todayDate.getTime() - lastDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

      if (diffDays === 1) {
        current += 1;
      } else if (diffDays === 2 && shields > 0 && autoUseShield) {
        // Missed exactly 1 day, protect with streak shield!
        shields -= 1;
        shieldUsed = true;
        const missedDate = new Date(lastDate);
        missedDate.setDate(missedDate.getDate() + 1);
        shieldHistory.push({
          id: `shield_${Date.now()}`,
          date: getLocalDateString(missedDate),
          reason: 'حماية تلقائية لتفويت يوم دراسي',
          usedAt: new Date().toISOString(),
        });
        current += 1;
      } else if (diffDays > 1) {
        // Streak broken
        current = 1;
      }
    }

    if (current > best) {
      best = current;
    }
    lastQualifiedDate = todayStr;
  }

  return {
    updatedStreak: {
      current,
      best,
      shields,
      lastQualifiedDate,
      shieldHistory,
    },
    shieldUsed,
  };
}

export function evaluateBadges(
  currentBadges: BadgeItem[],
  sessions: StudySession[],
  streak: StreakData,
  profile: UserProfile
): { updatedBadges: BadgeItem[]; newlyUnlocked: BadgeItem[] } {
  const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  const totalCompletedSessions = sessions.filter((s) => s.isCompleted).length;
  const uniqueSubjects = new Set(sessions.map((s) => s.subjectId)).size;
  
  // Night sessions (started between 22:00 and 05:00)
  const nightSessionsCount = sessions.filter((s) => {
    const hour = new Date(s.startedAt).getHours();
    return hour >= 22 || hour < 5;
  }).length;

  // Uninterrupted sessions streak
  let currentUninterruptedStreak = 0;
  let maxUninterrupted = 0;
  for (const s of sessions) {
    if (s.interruptionsCount === 0 && s.isCompleted) {
      currentUninterruptedStreak++;
      if (currentUninterruptedStreak > maxUninterrupted) {
        maxUninterrupted = currentUninterruptedStreak;
      }
    } else {
      currentUninterruptedStreak = 0;
    }
  }

  const newlyUnlocked: BadgeItem[] = [];

  const updatedBadges = currentBadges.map((badge) => {
    let curVal = badge.currentValue;

    switch (badge.id) {
      case 'b_first_dock':
        curVal = totalCompletedSessions;
        break;
      case 'b_time_keeper':
        curVal = totalMinutes;
        break;
      case 'b_start_flame':
        curVal = streak.current;
        break;
      case 'b_steady_sailor':
        curVal = streak.current;
        break;
      case 'b_wave_crosser':
        curVal = totalCompletedSessions;
        break;
      case 'b_knowledge_trustee':
        curVal = uniqueSubjects;
        break;
      case 'b_night_watch':
        curVal = nightSessionsCount;
        break;
      case 'b_unbroken_path':
        curVal = maxUninterrupted;
        break;
      case 'b_captain_rank':
        curVal = profile.points;
        break;
      case 'b_mirfa_master':
        curVal = totalMinutes;
        break;
      default:
        break;
    }

    const isUnlockedNow = curVal >= badge.targetValue;
    if (isUnlockedNow && !badge.unlocked) {
      const unlockedBadge: BadgeItem = {
        ...badge,
        currentValue: curVal,
        unlocked: true,
        unlockedAt: new Date().toISOString(),
      };
      newlyUnlocked.push(unlockedBadge);
      return unlockedBadge;
    }

    return {
      ...badge,
      currentValue: curVal,
    };
  });

  return { updatedBadges, newlyUnlocked };
}
