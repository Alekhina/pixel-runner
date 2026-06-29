import type { ObstacleDef } from "../obstacle-defs";
import type { ObstacleKind } from "../types";
import { obstacle, playerGroundY } from "./obstacle-helpers";
import type { GameLayout } from "./types";

const GROUND_LINE = 500;

const obstacles: Record<ObstacleKind, ObstacleDef> = {
  konus: obstacle(GROUND_LINE, "konus", 58, 60, "ground", {
    horizontal: 20,
    vertical: 11,
  }),
  stop: obstacle(GROUND_LINE, "stop", 48, 120, "ground", {
    horizontal: 10,
    vertical: 10,
  }),
  exam: obstacle(GROUND_LINE, "exam", 70, 120, "air", {
    horizontal: 10,
    vertical: 10,
  }),
  lake: obstacle(GROUND_LINE, "lake", 96, 24, "pit", {
    horizontal: 10,
    vertical: 10,
  }),
  hole: obstacle(GROUND_LINE, "hole", 140, 36, "pit", {
    horizontal: 17,
    vertical: 20,
  }),
  repair: obstacle(GROUND_LINE, "repair", 64, 60, "ground", {
    horizontal: 20,
    vertical: 11,
  }),
  bricks: obstacle(GROUND_LINE, "bricks", 96, 84, "ground", {
    horizontal: 10,
    vertical: 10,
  }),
  barrier: obstacle(GROUND_LINE, "barrier", 64, 64, "ground", {
    horizontal: 10,
    vertical: 10,
  }),
};

export const MOBILE_LAYOUT: GameLayout = {
  id: "mobile",
  canvas: { w: 360, h: 640 },
  player: {
    x: -10,
    drawW: 160,
    drawH: 160,
    groundY: playerGroundY(GROUND_LINE, 160),
    hitbox: { insetX: 55, insetY: 20, w: 50, h: 120 },
    jumpVY: -20,
    gravity: 1,
  },
  obstacles,
  world: {
    chunkWidth: 860,
    minGroundGap: 150,
    minChunkGap: 300,
    spawnAheadX: 400,
    despawnBehindX: -120,
    minPitGap: 320,
    initialBarrierX: 350,
  },
  speeds: {
    bg: 120,
    bgMax: 168,
    obstacles: 300,
    obstaclesMax: 450,
  },
  draw: {
    roadDrawH: 680,
  },
};

/** Mobile: игровые параметры из пресета + canvas под viewport. */
export function createMobileLayout(viewport: {
  w: number;
  h: number;
}): GameLayout {
  return {
    ...MOBILE_LAYOUT,
    canvas: { w: viewport.w, h: viewport.h },
  };
}

export { GROUND_LINE };
