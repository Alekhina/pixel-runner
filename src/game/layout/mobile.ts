import type { ObstacleDef } from "../obstacle-defs";
import type { ObstacleKind } from "../types";
import { obstacle, playerGroundY } from "./obstacle-helpers";
import type { GameLayout } from "./types";

const GROUND_LINE = 500;

const obstacles: Record<ObstacleKind, ObstacleDef> = {
  konus: obstacle(GROUND_LINE, "konus", 64, 60, "ground", {
    insetX: 12,
    insetY: 5,
    w: 40,
    h: 50,
  }),
  stop: obstacle(GROUND_LINE, "stop", 48, 120, "ground", {
    insetX: 6,
    insetY: 5,
    w: 40,
    h: 110,
  }),
  exam: obstacle(GROUND_LINE, "exam", 70, 120, "air", {
    insetX: 6,
    insetY: 5,
    w: 45,
    h: 110,
  }),
  lake: obstacle(GROUND_LINE, "lake", 96, 24, "pit", {
    insetX: 8,
    insetY: 4,
    w: 80,
    h: 20,
  }),
  hole: obstacle(GROUND_LINE, "hole", 140, 36, "pit", {
    insetX: 40,
    insetY: 35,
    w: 60,
    h: 14,
  }),
  repair: obstacle(GROUND_LINE, "repair", 64, 60, "ground", {
    insetX: 11,
    insetY: 12,
    w: 40,
    h: 40,
  }),
  bricks: obstacle(GROUND_LINE, "bricks", 96, 84, "ground", {
    insetX: 10,
    insetY: 30,
    w: 70,
    h: 28,
  }),
  barrier: obstacle(GROUND_LINE, "barrier", 64, 64, "ground", {
    insetX: 7,
    insetY: 5,
    w: 50,
    h: 60,
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

export { GROUND_LINE };
