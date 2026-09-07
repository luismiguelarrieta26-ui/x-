import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { isFutureKey, toDateKey } from "./dates";
import { createSeed } from "./seed";
import type { Habit, HabitColorId, HabitIconId, HabitsSnapshot } from "./types";

type HabitsState = HabitsSnapshot & {
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
  addHabit: (input: {
    name: string;
    color: HabitColorId;
    icon: HabitIconId;
  }) => string;
  updateHabit: (
    id: string,
    patch: Partial<Pick<Habit, "name" | "color" | "icon">>,
  ) => void;
  deleteHabit: (id: string) => void;
  toggleCheck: (habitId: string, dateKey: string) => void;
};

const emptySnapshot: HabitsSnapshot = {
  habits: [],
  checks: {},
  hasOnboarded: false,
};

export const useHabitsStore = create<HabitsState>()(
  persist(
    (set, get) => ({
      ...emptySnapshot,
      hydrated: false,
      setHydrated: (value) => set({ hydrated: value }),
      addHabit: ({ name, color, icon }) => {
        const id =
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `h-${Date.now()}`;
        const habit: Habit = {
          id,
          name: name.trim(),
          color,
          icon,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          habits: [...state.habits, habit],
          hasOnboarded: true,
        }));
        return id;
      },
      updateHabit: (id, patch) => {
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === id
              ? {
                  ...habit,
                  ...patch,
                  name: patch.name !== undefined ? patch.name.trim() : habit.name,
                }
              : habit,
          ),
        }));
      },
      deleteHabit: (id) => {
        set((state) => {
          const { [id]: _removed, ...rest } = state.checks;
          return {
            habits: state.habits.filter((habit) => habit.id !== id),
            checks: rest,
          };
        });
      },
      toggleCheck: (habitId, dateKey) => {
        if (isFutureKey(dateKey)) return;
        const habit = get().habits.find((item) => item.id === habitId);
        if (!habit) return;
        const createdKey = toDateKey(new Date(habit.createdAt));
        if (dateKey < createdKey) return;
        set((state) => {
          const current = state.checks[habitId] ?? [];
          const has = current.includes(dateKey);
          return {
            checks: {
              ...state.checks,
              [habitId]: has
                ? current.filter((key) => key !== dateKey)
                : [...current, dateKey],
            },
          };
        });
      },
    }),
    {
      name: "racha-habits-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        habits: state.habits,
        checks: state.checks,
        hasOnboarded: state.hasOnboarded,
      }),
      skipHydration: true,
    },
  ),
);

let hydrationPromise: Promise<void> | null = null;

export function hydrateHabitsStore(): Promise<void> {
  if (hydrationPromise) return hydrationPromise;
  hydrationPromise = (async () => {
    await useHabitsStore.persist.rehydrate();
    const state = useHabitsStore.getState();
    if (!state.hasOnboarded) {
      useHabitsStore.setState({
        ...createSeed(),
        hydrated: true,
      });
    } else {
      useHabitsStore.setState({ hydrated: true });
    }
  })();
  return hydrationPromise;
}
