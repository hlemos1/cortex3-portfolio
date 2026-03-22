import { calculateReadinessScore, type Project } from "@/lib/commercializationEngine";

const STORAGE_KEY = "cortex3_score_history";
const MAX_DAYS = 90;

export interface ScoreSnapshot {
  date: string; // ISO date (YYYY-MM-DD)
  scores: Record<string, number>; // projectId -> score
  avgScore: number;
  portfolioHealth: number;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function recordSnapshot(projects: Project[], portfolioHealth: number): void {
  const today = todayISO();
  const history = getHistory();

  // Deduplicate: skip if already recorded today
  if (history.some((s) => s.date === today)) return;

  const active = projects.filter((p) => !p.archived);
  const scores: Record<string, number> = {};
  let totalScore = 0;

  for (const p of active) {
    const score = calculateReadinessScore(p);
    scores[p.id] = score;
    totalScore += score;
  }

  const avgScore = active.length > 0 ? Math.round(totalScore / active.length) : 0;

  const snapshot: ScoreSnapshot = {
    date: today,
    scores,
    avgScore,
    portfolioHealth,
  };

  history.push(snapshot);

  // Keep only last MAX_DAYS entries
  const trimmed = history
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-MAX_DAYS);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage full or unavailable — silently fail
  }
}

export function getHistory(): ScoreSnapshot[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ScoreSnapshot[];
    return parsed.sort((a, b) => a.date.localeCompare(b.date));
  } catch {
    return [];
  }
}

export function getProjectHistory(projectId: string): { date: string; score: number }[] {
  return getHistory()
    .filter((s) => projectId in s.scores)
    .map((s) => ({ date: s.date, score: s.scores[projectId] }));
}

export function getPortfolioTrend(): { date: string; avgScore: number; health: number }[] {
  return getHistory().map((s) => ({
    date: s.date,
    avgScore: s.avgScore,
    health: s.portfolioHealth,
  }));
}
