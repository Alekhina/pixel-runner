import type { ObstacleDef } from "../obstacle-defs";
import type { ObstacleKind } from "../types";
import { MOBILE_LAYOUT } from "./mobile";
import { obstacleY } from "./obstacle-helpers";
import type { GameLayout } from "./types";

const SCALE = 1.5;
const GROUND_LINE = 500;

function s(n: number): number {
  return Math.round(n * SCALE);
}

function scaleObstacle(def: ObstacleDef): ObstacleDef {
  const h = s(def.h);
  return {
    ...def,
    w: s(def.w),
    h,
    y: obstacleY(GROUND_LINE, h),
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

export const DESKTOP_LAYOUT: GameLayout = {
  id: "desktop",
  canvas: MOBILE_LAYOUT.canvas,
  player: {
    x: s(mobilePlayer.x),
    drawW,
    drawH,
    groundY: mobilePlayer.groundY - (drawH - mobilePlayer.drawH),
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
  world: MOBILE_LAYOUT.world,
  speeds: MOBILE_LAYOUT.speeds,
  draw: MOBILE_LAYOUT.draw,
};

export { GROUND_LINE, SCALE };
