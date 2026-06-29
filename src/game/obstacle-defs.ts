import type { ObstacleKind } from "./types";

export type ObstacleLane = "ground" | "air" | "pit";

/** Отступы hitbox от краёв спрайта с каждой стороны, в процентах (0–50). */
export type HitboxMarginsPercent = {
  horizontal: number;
  vertical: number;
};

export type ObstacleDef = {
  kind: ObstacleKind;
  w: number;
  h: number;
  y: number;
  lane: ObstacleLane;
  hitboxMargins: HitboxMarginsPercent;
  hitbox: { insetX: number; insetY: number; w: number; h: number };
};
