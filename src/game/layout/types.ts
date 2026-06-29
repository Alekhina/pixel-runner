import type { ObstacleDef } from "../obstacle-defs";
import type { ObstacleKind } from "../types";

export type PlayerLayout = {
  x: number;
  drawW: number;
  drawH: number;
  groundY: number;
  hitbox: { insetX: number; insetY: number; w: number; h: number };
  jumpVY: number;
  gravity: number;
};

export type WorldLayout = {
  chunkWidth: number;
  minGroundGap: number;
  minChunkGap: number;
  spawnAheadX: number;
  despawnBehindX: number;
  minPitGap: number;
  initialBarrierX: number;
};

export type SpeedLayout = {
  bg: number;
  bgMax: number;
  obstacles: number;
  obstaclesMax: number;
};

export type DrawLayout = {
  roadDrawH: number;
};

export type GameLayout = {
  id: "mobile" | "desktop";
  canvas: { w: number; h: number };
  player: PlayerLayout;
  obstacles: Record<ObstacleKind, ObstacleDef>;
  world: WorldLayout;
  speeds: SpeedLayout;
  draw: DrawLayout;
};
