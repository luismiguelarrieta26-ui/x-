import {
  BookOpen,
  Brain,
  Coffee,
  Droplets,
  Dumbbell,
  Footprints,
  Heart,
  Leaf,
  Moon,
  Music,
  PenLine,
  Sun,
  type LucideIcon,
} from "lucide-react";
import type { HabitColorId, HabitIconId } from "./types";

export const HABIT_COLOR_CLASS: Record<
  HabitColorId,
  { bg: string; text: string; ring: string; fill: string }
> = {
  forest: {
    bg: "bg-habit-forest",
    text: "text-habit-forest",
    ring: "ring-habit-forest",
    fill: "fill-habit-forest",
  },
  clay: {
    bg: "bg-habit-clay",
    text: "text-habit-clay",
    ring: "ring-habit-clay",
    fill: "fill-habit-clay",
  },
  slate: {
    bg: "bg-habit-slate",
    text: "text-habit-slate",
    ring: "ring-habit-slate",
    fill: "fill-habit-slate",
  },
  ochre: {
    bg: "bg-habit-ochre",
    text: "text-habit-ochre",
    ring: "ring-habit-ochre",
    fill: "fill-habit-ochre",
  },
  rose: {
    bg: "bg-habit-rose",
    text: "text-habit-rose",
    ring: "ring-habit-rose",
    fill: "fill-habit-rose",
  },
  teal: {
    bg: "bg-habit-teal",
    text: "text-habit-teal",
    ring: "ring-habit-teal",
    fill: "fill-habit-teal",
  },
  ink: {
    bg: "bg-habit-ink",
    text: "text-habit-ink",
    ring: "ring-habit-ink",
    fill: "fill-habit-ink",
  },
  olive: {
    bg: "bg-habit-olive",
    text: "text-habit-olive",
    ring: "ring-habit-olive",
    fill: "fill-habit-olive",
  },
};

export const HABIT_ICONS: Record<HabitIconId, LucideIcon> = {
  droplets: Droplets,
  book: BookOpen,
  walk: Footprints,
  brain: Brain,
  moon: Moon,
  dumbbell: Dumbbell,
  sun: Sun,
  heart: Heart,
  coffee: Coffee,
  pen: PenLine,
  music: Music,
  leaf: Leaf,
};

export const HABIT_ICON_LABELS: Record<HabitIconId, string> = {
  droplets: "Agua",
  book: "Lectura",
  walk: "Caminar",
  brain: "Mente",
  moon: "Descanso",
  dumbbell: "Fuerza",
  sun: "Mañana",
  heart: "Cuidado",
  coffee: "Ritual",
  pen: "Escribir",
  music: "Música",
  leaf: "Naturaleza",
};
