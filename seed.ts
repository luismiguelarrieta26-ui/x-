import { startOfDay, subDays } from "date-fns";
import { toDateKey } from "./dates";
import type { Habit, HabitsSnapshot } from "./types";

const SEED_CREATED = "2026-06-01T08:00:00.000Z";

const SEED_HABITS: Habit[] = [
  {
    id: "h-agua",
    name: "Beber agua",
    color: "teal",
    icon: "droplets",
    createdAt: SEED_CREATED,
  },
  {
    id: "h-leer",
    name: "Leer 20 min",
    color: "clay",
    icon: "book",
    createdAt: SEED_CREATED,
  },
  {
    id: "h-caminar",
    name: "Caminar",
    color: "forest",
    icon: "walk",
    createdAt: SEED_CREATED,
  },
  {
    id: "h-meditar",
    name: "Meditar",
    color: "slate",
    icon: "brain",
    createdAt: SEED_CREATED,
  },
  {
    id: "h-dormir",
    name: "Dormir a las 23",
    color: "rose",
    icon: "moon",
    createdAt: SEED_CREATED,
  },
];

function daysAgoKeys(
  today: Date,
  predicate: (daysAgo: number) => boolean,
  span = 70,
): string[] {
  const keys: string[] = [];
  for (let i = span; i >= 0; i -= 1) {
    if (predicate(i)) keys.push(toDateKey(subDays(today, i)));
  }
  return keys;
}

export function createSeed(now = new Date()): HabitsSnapshot {
  const today = startOfDay(now);
  return {
    hasOnboarded: true,
    habits: SEED_HABITS,
    checks: {
      "h-agua": daysAgoKeys(today, (i) => i <= 6 || i % 5 !== 0),
      "h-leer": daysAgoKeys(today, (i) => i <= 13 || (i % 7 !== 3 && i % 6 !== 0)),
      "h-caminar": daysAgoKeys(today, (i) => i <= 3 || (i % 3 !== 0 && i % 8 !== 1)),
      "h-meditar": daysAgoKeys(
        today,
        (i) => i !== 0 && i !== 1 && i % 2 === 0 && i % 9 !== 0,
      ),
      "h-dormir": daysAgoKeys(today, (i) => i === 1 || i === 2 || (i > 2 && i % 4 !== 0)),
    },
  };
}
