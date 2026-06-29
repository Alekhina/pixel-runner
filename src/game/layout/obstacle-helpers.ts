import type { ObstacleDef } from "../obstacle-defs";
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

export function obstacle(
  groundLine: number,
  kind: ObstacleKind,
  w: number,
  h: number,
  lane: ObstacleLane,
  hitbox: NonNullable<ObstacleDef["hitbox"]>,
): ObstacleDef {
  return { kind, w, h, y: obstacleY(groundLine, h, lane), lane, hitbox };
}
