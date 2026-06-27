import type { ObstacleDef } from "../obstacle-defs";
import type { ObstacleLane } from "../obstacle-defs";
import type { ObstacleKind } from "../types";

export function obstacleY(groundLine: number, h: number): number {
  return groundLine - h;
}

export function obstacle(
  groundLine: number,
  kind: ObstacleKind,
  w: number,
  h: number,
  lane: ObstacleLane,
  hitbox: NonNullable<ObstacleDef["hitbox"]>,
): ObstacleDef {
  return { kind, w, h, y: obstacleY(groundLine, h), lane, hitbox };
}
