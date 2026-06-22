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
  konus: { kind: "konus", w: 64, h: 64, y: 445, lane: "ground", hitbox: { insetX: 12, insetY: 5, w: 40, h: 50 }, },
  stop:  { kind: "stop",  w: 48, h: 120, y: 380, lane: "ground", hitbox: { insetX: 6, insetY: 5, w: 40, h: 110 } },
  exam:  { kind: "exam",  w: 48, h: 96,  y: 425, lane: "air" },
  lake:  { kind: "lake",  w: 96, h: 24,  y: 475, lane: "pit", hitbox: { insetX: 8, insetY: 4, w: 80, h: 20 } },
  hole:  { kind: "hole",  w: 96, h: 24,  y: 475, lane: "pit", hitbox: { insetX: 8, insetY: 5, w: 80, h: 20 } },
  repair: { kind: "repair",  w: 64, h: 60,  y: 445, lane: "ground", hitbox: { insetX: 10, insetY: 10, w: 50, h: 44 } },
  heap: { kind: "heap",  w: 96, h: 32,  y: 470, lane: "ground", hitbox: { insetX: 10, insetY: 5, w: 70, h: 28 } },
};