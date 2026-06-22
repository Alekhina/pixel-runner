import type { ObstacleKind } from "./types";

export type ObstacleLane = "ground" | "air" | "pit";

export type ObstacleDef = {
  kind: ObstacleKind;
  w: number;
  h: number;
  y: number;
  lane: ObstacleLane;
  hitbox?: { insetX: number; insetY: number; w: number; h: number };
};

export const OBSTACLE_DEFS: Record<ObstacleKind, ObstacleDef> = {
  konus: { kind: "konus", w: 64, h: 64, y: 445, lane: "ground" },
  stop:  { kind: "stop",  w: 48, h: 120, y: 380, lane: "ground" },
  exam:  { kind: "exam",  w: 48, h: 96,  y: 425, lane: "air" },
  lake:  { kind: "lake",  w: 72, h: 24,  y: 475, lane: "pit" },
  hole:  { kind: "hole",  w: 72, h: 24,  y: 475, lane: "pit" },
  repair: { kind: "repair",  w: 64, h: 60,  y: 425, lane: "ground" },
  heap: { kind: "heap",  w: 96, h: 32,  y: 455, lane: "ground" },

  // + repair, barrier после добавления в ObstacleKind
};