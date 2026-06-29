import type { HitboxMarginsPercent, ObstacleDef } from "../obstacle-defs";
import type { ObstacleLane } from "../obstacle-defs";
import type { ObstacleKind } from "../types";

export function groundAlignedY(groundLine: number, h: number): number {
  return groundLine - h;
}

export function playerGroundY(groundLine: number, h: number): number {
  return groundLine - Math.round((13 * h) / 14);
}

export function obstacleY(
  groundLine: number,
  h: number,
  lane: ObstacleLane,
): number {
  if (lane === "pit") {
    return groundLine - Math.round(3 * (h / 4));
  }
  return groundAlignedY(groundLine, h);
}

/** Центрированный hitbox: одинаковые отступы слева/справа и сверху/снизу. */
export function hitboxFromMargins(
  spriteW: number,
  spriteH: number,
  margins: HitboxMarginsPercent,
): ObstacleDef["hitbox"] {
  const hitboxW = Math.round(spriteW * (1 - (2 * margins.horizontal) / 100));
  const hitboxH = Math.round(spriteH * (1 - (2 * margins.vertical) / 100));
  return {
    insetX: Math.round((spriteW - hitboxW) / 2),
    insetY: Math.round((spriteH - hitboxH) / 2),
    w: hitboxW,
    h: hitboxH,
  };
}

export function obstacle(
  groundLine: number,
  kind: ObstacleKind,
  w: number,
  h: number,
  lane: ObstacleLane,
  hitboxMargins: HitboxMarginsPercent,
): ObstacleDef {
  return {
    kind,
    w,
    h,
    y: obstacleY(groundLine, h, lane),
    lane,
    hitboxMargins,
    hitbox: hitboxFromMargins(w, h, hitboxMargins),
  };
}
