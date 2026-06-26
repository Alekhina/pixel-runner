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
  exam:  { kind: "exam",  w: 70, h: 120,  y: 380, lane: "air", hitbox: { insetX: 6, insetY: 5, w: 45, h: 110 } },
  lake:  { kind: "lake",  w: 96, h: 24,  y: 475, lane: "pit", hitbox: { insetX: 8, insetY: 4, w: 80, h: 20 } },
  hole:  { kind: "hole",  w: 140, h: 84,  y: 450, lane: "pit", hitbox: { insetX: 40, insetY: 35, w: 60, h: 14 } },
  repair: { kind: "repair",  w: 64, h: 60,  y: 445, lane: "ground", hitbox: { insetX: 11, insetY: 12, w: 40, h: 40 } },
  bricks: { kind: "bricks", w: 96, h: 84, y: 455, lane: "ground", hitbox: { insetX: 10, insetY: 30, w: 70, h: 28 } },
  barrier: { kind: "barrier", w: 64, h: 64, y: 445, lane: "ground", hitbox: { insetX: 7, insetY: 5, w: 50, h: 60 }, },
};