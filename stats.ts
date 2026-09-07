import { addDays, startOfDay, subDays } from "date-fns";
import { toDateKey } from "./dates";
import type { Habit } from "./types";

export function checkSet(checks: Record<string, string[]>, habitId: string): Set<string> {
  return new Set(checks[habitId] ?? []);
}

export function isChecked(
  checks: Record<string, string[]>,
  habitId: string,
  dateKey: string,
): boolean {
  return (checks[habitId] ?? []).includes(dateKey);
}

export function currentStreak(
  dates: Iterable<string>,
  now = new Date(),
): number {
  const set = dates instanceof Set ? dates : new Set(dates);
  const today = startOfDay(now);
  const todayK = toDateKey(today);
  let cursor = set.has(todayK) ? today : subDays(today, 1);
  let streak = 0;
  while (set.has(toDateKey(cursor))) {
    streak += 1;
    cursor = subDays(cursor, 1);
  }
  return streak;
}

export function longestStreak(dates: Iterable<string>): number {
  const sorted = [...dates].sort();
  if (sorted.length === 0) return 0;
  let best = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i += 1) {
    const prev = sorted[i - 1]!;
    const cur = sorted[i]!;
    const prevDate = new Date(
      Number(prev.slice(0, 4)),
      Number(prev.slice(5, 7)) - 1,
      Number(prev.slice(8, 10)),
    );
    const expected = toDateKey(addDays(prevDate, 1));
    if (cur === expected) {
      run += 1;
      best = Math.max(best, run);
    } else if (cur !== prev) {
      run = 1;
    }
  }
  return best;
}

export function completionsInRange(
  dates: Set<string>,
  start: Date,
  end: Date,
): number {
  let count = 0;
  const startK = toDateKey(startOfDay(start));
  const endK = toDateKey(startOfDay(end));
  for (const key of dates) {
    if (key >= startK && key <= endK) count += 1;
  }
  return count;
}

export function expectedDays(createdAt: string, start: Date, end: Date): number {
  const created = startOfDay(new Date(createdAt));
  const from = startOfDay(start) < created ? created : startOfDay(start);
  const to = startOfDay(end);
  if (to < from) return 0;
  return Math.round((to.getTime() - from.getTime()) / 86_400_000) + 1;
}

export function completionRate(
  dates: Set<string>,
  createdAt: string,
  start: Date,
  end: Date,
): number {
  const total = expectedDays(createdAt, start, end);
  if (total <= 0) return 0;
  return completionsInRange(dates, start, end) / total;
}

export function dayCompletion(
  habits: Habit[],
  checks: Record<string, string[]>,
  dateKey: string,
): { done: number; total: number } {
  const active = habits.filter((habit) => {
    const created = toDateKey(startOfDay(new Date(habit.createdAt)));
    return created <= dateKey;
  });
  const done = active.filter((habit) =>
    (checks[habit.id] ?? []).includes(dateKey),
  ).length;
  return { done, total: active.length };
}

export type HabitStats = {
  current: number;
  longest: number;
  rate30: number;
  rate7: number;
  total: number;
};

export function habitStats(
  habit: Habit,
  checks: Record<string, string[]>,
  now = new Date(),
): HabitStats {
  const dates = checkSet(checks, habit.id);
  const today = startOfDay(now);
  return {
    current: currentStreak(dates, today),
    longest: longestStreak(dates),
    rate30: completionRate(dates, habit.createdAt, subDays(today, 29), today),
    rate7: completionRate(dates, habit.createdAt, subDays(today, 6), today),
    total: dates.size,
  };
}
