import type { LineupFormation } from "../types/lineup";

export type FormationSlot = {
  id: string;
  label: string;
  lane: "gk" | "defense" | "midfield" | "attack";
  left: number;
  top: number;
};

export const FORMATION_OPTIONS: LineupFormation[] = ["4-3-3", "4-4-2", "3-5-2", "4-2-3-1"];

const row = (lane: FormationSlot["lane"], top: number, count: number, prefix: string, label: string): FormationSlot[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `${prefix}-${index + 1}`,
    label,
    lane,
    left: count === 1 ? 50 : 10 + (80 / (count - 1)) * index,
    top,
  }));

export const FORMATION_SLOTS: Record<LineupFormation, FormationSlot[]> = {
  "4-3-3": [
    ...row("gk", 91, 1, "gk", "GOL"),
    ...row("defense", 70, 4, "def", "DEF"),
    ...row("midfield", 47, 3, "mid", "MEI"),
    ...row("attack", 22, 3, "att", "ATA"),
  ],
  "4-4-2": [
    ...row("gk", 91, 1, "gk", "GOL"),
    ...row("defense", 70, 4, "def", "DEF"),
    ...row("midfield", 47, 4, "mid", "MEI"),
    ...row("attack", 22, 2, "att", "ATA"),
  ],
  "3-5-2": [
    ...row("gk", 91, 1, "gk", "GOL"),
    ...row("defense", 70, 3, "def", "ZAG"),
    ...row("midfield", 47, 5, "mid", "MEI"),
    ...row("attack", 22, 2, "att", "ATA"),
  ],
  "4-2-3-1": [
    ...row("gk", 91, 1, "gk", "GOL"),
    ...row("defense", 70, 4, "def", "DEF"),
    ...row("midfield", 53, 2, "vol", "VOL"),
    ...row("midfield", 35, 3, "mid", "MEI"),
    ...row("attack", 16, 1, "att", "ATA"),
  ],
};

export function getFormationSlots(formation: LineupFormation): FormationSlot[] {
  return FORMATION_SLOTS[formation] ?? FORMATION_SLOTS["4-3-3"];
}
