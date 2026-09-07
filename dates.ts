import {
  addDays,
  addMonths,
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
} from "date-fns";
import { es } from "date-fns/locale";

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

export function todayKey(now = new Date()): string {
  return toDateKey(startOfDay(now));
}

export function isFutureKey(key: string, now = new Date()): boolean {
  return key > todayKey(now);
}

export function weekDays(anchor = new Date()): Date[] {
  const end = startOfDay(anchor);
  return Array.from({ length: 7 }, (_, i) => subDays(end, 6 - i));
}

export function monthDays(anchor = new Date()): Date[] {
  const start = startOfMonth(startOfDay(anchor));
  const end = endOfMonth(start);
  return eachDayOfInterval({ start, end });
}

export function monthGrid(anchor = new Date()): Date[] {
  const start = startOfWeek(startOfMonth(startOfDay(anchor)), {
    weekStartsOn: 1,
  });
  const end = endOfMonth(startOfDay(anchor));
  const last = startOfWeek(end, { weekStartsOn: 1 });
  const gridEnd = addDays(last, 6);
  return eachDayOfInterval({ start, end: gridEnd });
}

export function heatmapDays(weeks = 16, anchor = new Date()): Date[] {
  const end = startOfDay(anchor);
  const endWeek = addDays(startOfWeek(end, { weekStartsOn: 1 }), 6);
  const start = subDays(startOfWeek(end, { weekStartsOn: 1 }), (weeks - 1) * 7);
  return eachDayOfInterval({ start, end: endWeek });
}

export function weekdayLabel(date: Date, width: "narrow" | "short" = "narrow"): string {
  return format(date, width === "narrow" ? "EEEEE" : "EEE", { locale: es });
}

export function dayNumber(date: Date): string {
  return format(date, "d", { locale: es });
}

function sentenceCase(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function prettyDate(date: Date): string {
  return sentenceCase(format(date, "EEEE d 'de' MMMM", { locale: es }));
}

export function prettyMonth(date: Date): string {
  return sentenceCase(format(date, "LLLL yyyy", { locale: es }));
}

export function shortPrettyDate(date: Date): string {
  return format(date, "d MMM", { locale: es });
}

export function shiftMonth(anchor: Date, delta: number): Date {
  return delta >= 0 ? addMonths(anchor, delta) : subMonths(anchor, -delta);
}

export function daysBetween(a: Date, b: Date): number {
  return differenceInCalendarDays(startOfDay(b), startOfDay(a));
}

export const WEEKDAY_HEADERS = ["L", "M", "X", "J", "V", "S", "D"] as const;
