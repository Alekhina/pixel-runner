import type { ObstacleDef } from "../obstacle-defs";
import type { ObstacleKind } from "../types";
import { MOBILE_LAYOUT } from "./mobile";
import { obstacleY, playerGroundY } from "./obstacle-helpers";
import type { GameLayout } from "./types";

/** Множитель размеров спрайтов player / obstacles (w, h, hitbox). Чанки не масштабируются. */
export const SCALE: number = 1.2;

const PLAYER_X_OFFSET = 150;

const GROUND_LINE = 515;

function s(n: number): number {
  return Math.round(n * SCALE);
}

function scaleObstacle(def: ObstacleDef): ObstacleDef {
  const h = s(def.h);
  return {
    ...def,
    w: s(def.w),
    h,
    y: obstacleY(GROUND_LINE, h, def.lane),
    hitbox: {
      insetX: s(def.hitbox!.insetX),
      insetY: s(def.hitbox!.insetY),
      w: s(def.hitbox!.w),
      h: s(def.hitbox!.h),
    },
  };
}

const obstacles = Object.fromEntries(
  Object.entries(MOBILE_LAYOUT.obstacles).map(([kind, def]) => [
    kind,
    scaleObstacle(def),
  ]),
) as Record<ObstacleKind, ObstacleDef>;

const mobilePlayer = MOBILE_LAYOUT.player;
const drawW = s(mobilePlayer.drawW);
const drawH = s(mobilePlayer.drawH);

const mobileWorld = MOBILE_LAYOUT.world;
const DESKTOP_CHUNK_WIDTH = 1200;
const DESKTOP_MIN_CHUNK_GAP = 50;

const mobileSpeeds = MOBILE_LAYOUT.speeds;
const OBSTACLE_SPEED_SCALE = 1.5;

function buildDesktopLayout(canvas: { w: number; h: number }): GameLayout {
  return {
    id: "desktop",
    canvas,
    player: {
      x: s(mobilePlayer.x) + PLAYER_X_OFFSET,
      drawW,
      drawH,
      groundY: playerGroundY(GROUND_LINE, drawH),
      hitbox: {
        insetX: s(mobilePlayer.hitbox.insetX),
        insetY: s(mobilePlayer.hitbox.insetY),
        w: s(mobilePlayer.hitbox.w),
        h: s(mobilePlayer.hitbox.h),
      },
      jumpVY: s(mobilePlayer.jumpVY),
      gravity: mobilePlayer.gravity,
    },
    obstacles,
    world: {
      ...mobileWorld,
      chunkWidth: DESKTOP_CHUNK_WIDTH,
      minChunkGap: DESKTOP_MIN_CHUNK_GAP,
    },
    speeds: {
      ...mobileSpeeds,
      obstacles: Math.round(mobileSpeeds.obstacles * OBSTACLE_SPEED_SCALE),
      obstaclesMax: Math.round(mobileSpeeds.obstaclesMax * OBSTACLE_SPEED_SCALE),
    },
    draw: MOBILE_LAYOUT.draw,
  };
}

export const DESKTOP_LAYOUT = buildDesktopLayout(MOBILE_LAYOUT.canvas);

export function createDesktopLayout(viewport: {
  w: number;
  h: number;
}): GameLayout {
  return buildDesktopLayout({ w: viewport.w, h: viewport.h });
}

export { GROUND_LINE };
