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
