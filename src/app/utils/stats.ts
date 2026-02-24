// Sistema de estadísticas persistentes usando localStorage

export interface GameStats {
  totalWins: number;
  totalLosses: number;
  currentStreak: number;
  bestStreak: number;
  totalRounds: number;
  gamesPlayed: number;
  lastDifficulty: "easy" | "normal" | "hard";
}

const STATS_KEY = "el_pistolero_stats";

const DEFAULT_STATS: GameStats = {
  totalWins: 0,
  totalLosses: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalRounds: 0,
  gamesPlayed: 0,
  lastDifficulty: "normal",
};

export function getStats(): GameStats {
  try {
    const stored = localStorage.getItem(STATS_KEY);
    if (stored) {
      return { ...DEFAULT_STATS, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error("Error loading stats:", e);
  }
  return DEFAULT_STATS;
}

export function saveStats(stats: GameStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error("Error saving stats:", e);
  }
}

export function recordWin(difficulty: "easy" | "normal" | "hard"): GameStats {
  const stats = getStats();
  stats.totalWins++;
  stats.currentStreak++;
  stats.gamesPlayed++;
  stats.lastDifficulty = difficulty;
  if (stats.currentStreak > stats.bestStreak) {
    stats.bestStreak = stats.currentStreak;
  }
  saveStats(stats);
  return stats;
}

export function recordLoss(difficulty: "easy" | "normal" | "hard"): GameStats {
  const stats = getStats();
  stats.totalLosses++;
  stats.currentStreak = 0;
  stats.gamesPlayed++;
  stats.lastDifficulty = difficulty;
  saveStats(stats);
  return stats;
}

export function recordRound(): void {
  const stats = getStats();
  stats.totalRounds++;
  saveStats(stats);
}

export function resetStats(): void {
  saveStats(DEFAULT_STATS);
}
