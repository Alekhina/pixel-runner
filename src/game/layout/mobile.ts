import type { ObstacleDef } from "../obstacle-defs";
import type { ObstacleKind } from "../types";
import {
  computeGroundLine,
  computeRoadDrawH,
  DESIGN_CANVAS_H,
  obstacle,
  playerGroundY,
  repositionObstacles,
} from "./obstacle-helpers";
import type { GameLayout } from "./types";

function buildObstacleDefs(groundLine: number): Record<ObstacleKind, ObstacleDef> {
  return {
    konus: obstacle(groundLine, "konus", 58, 60, "ground", {
      horizontal: 20,
      vertical: 11,
    }),
    stop: obstacle(groundLine, "stop", 48, 120, "ground", {
      horizontal: 10,
      vertical: 10,
    }),
    exam: obstacle(groundLine, "exam", 70, 120, "air", {
      horizontal: 10,
      vertical: 10,
    }),
    lake: obstacle(groundLine, "lake", 96, 24, "pit", {
      horizontal: 10,
      vertical: 10,
    }),
    hole: obstacle(groundLine, "hole", 140, 36, "pit", {
      horizontal: 17,
      vertical: 20,
    }),
    repair: obstacle(groundLine, "repair", 64, 60, "ground", {
      horizontal: 20,
      vertical: 11,
    }),
    bricks: obstacle(groundLine, "bricks", 96, 84, "ground", {
      horizontal: 10,
      vertical: 10,
    }),
    barrier: obstacle(groundLine, "barrier", 64, 64, "ground", {
      horizontal: 10,
      vertical: 10,
    }),
  };
}

const PRESET_GROUND_LINE = computeGroundLine(DESIGN_CANVAS_H);
const presetObstacles = buildObstacleDefs(PRESET_GROUND_LINE);

export const MOBILE_LAYOUT: GameLayout = {
  id: "mobile",
  canvas: { w: 360, h: DESIGN_CANVAS_H },
  player: {
    x: -10,
    drawW: 160,
    drawH: 160,
    groundY: playerGroundY(PRESET_GROUND_LINE, 160),
    hitbox: { insetX: 55, insetY: 20, w: 50, h: 120 },
    jumpVY: -20,
    gravity: 1,
  },
  obstacles: presetObstacles,
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
    roadDrawH: computeRoadDrawH(DESIGN_CANVAS_H),
  },
};

function applyRoadAnchoredLayout(
  base: GameLayout,
  canvas: { w: number; h: number },
): GameLayout {
  const groundLine = computeGroundLine(canvas.h);
  const roadDrawH = computeRoadDrawH(canvas.h);

  return {
    ...base,
    canvas,
    draw: { roadDrawH },
    obstacles: repositionObstacles(base.obstacles, groundLine),
    player: {
      ...base.player,
      groundY: playerGroundY(groundLine, base.player.drawH),
    },
  };
}

/** Mobile: canvas под viewport + GROUND_LINE по дороге. */
export function createMobileLayout(viewport: {
  w: number;
  h: number;
}): GameLayout {
  return applyRoadAnchoredLayout(MOBILE_LAYOUT, {
    w: viewport.w,
    h: viewport.h,
  });
}

export { PRESET_GROUND_LINE as GROUND_LINE };
