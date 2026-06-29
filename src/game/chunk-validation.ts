import type { ObstacleDef } from "./obstacle-defs";
import type { WorldLayout } from "./layout/types";
import { MOBILE_LAYOUT } from "./layout/mobile";
import type { ObstacleLane } from "./obstacle-defs";
import type { ChunkSpawnItem, ObstacleKind } from "./types";

export type ChunkValidationContext = {
  world: WorldLayout;
  obstacles: Record<ObstacleKind, ObstacleDef>;
};

function def(
  kind: ChunkSpawnItem["kind"],
  obstacles: Record<ObstacleKind, ObstacleDef>,
) {
  return obstacles[kind];
}

function rightEdge(
  item: ChunkSpawnItem,
  obstacles: Record<ObstacleKind, ObstacleDef>,
): number {
  return item.offsetX + def(item.kind, obstacles).w;
}

function gapBetween(
  a: ChunkSpawnItem,
  b: ChunkSpawnItem,
  obstacles: Record<ObstacleKind, ObstacleDef>,
): number {
  const left = a.offsetX <= b.offsetX ? a : b;
  const right = a.offsetX <= b.offsetX ? b : a;
  return right.offsetX - rightEdge(left, obstacles);
}

function byLane(
  items: ChunkSpawnItem[],
  lane: ObstacleLane,
  obstacles: Record<ObstacleKind, ObstacleDef>,
) {
  return items
    .filter((item) => def(item.kind, obstacles).lane === lane)
    .sort((a, b) => a.offsetX - b.offsetX);
}

function hasMinGapInLane(
  items: ChunkSpawnItem[],
  minGap: number,
  obstacles: Record<ObstacleKind, ObstacleDef>,
): boolean {
  for (let i = 1; i < items.length; i++) {
    if (gapBetween(items[i - 1], items[i], obstacles) < minGap) return false;
  }
  return true;
}

function groundPitCompatible(
  ground: ChunkSpawnItem[],
  pit: ChunkSpawnItem[],
  obstacles: Record<ObstacleKind, ObstacleDef>,
  minPitGap: number,
): boolean {
  for (const g of ground) {
    for (const p of pit) {
      const gEnd = rightEdge(g, obstacles);
      const overlapStart = Math.max(g.offsetX, p.offsetX);
      const overlapEnd = Math.min(gEnd, rightEdge(p, obstacles));
      if (overlapEnd > overlapStart) return false;
      if (p.offsetX >= gEnd && p.offsetX - gEnd < minPitGap) return false;
    }
  }
  return true;
}

function airGroundCompatible(
  ground: ChunkSpawnItem[],
  air: ChunkSpawnItem[],
  obstacles: Record<ObstacleKind, ObstacleDef>,
): boolean {
  for (const a of air) {
    for (const g of ground) {
      const overlap =
        a.offsetX < rightEdge(g, obstacles) && rightEdge(a, obstacles) > g.offsetX;
      if (overlap) return false;
    }
  }
  return true;
}

export function isChunkPassable(
  items: ChunkSpawnItem[],
  ctx: ChunkValidationContext = {
    world: MOBILE_LAYOUT.world,
    obstacles: MOBILE_LAYOUT.obstacles,
  },
): boolean {
  const { world, obstacles } = ctx;
  if (items.length === 0) return true;

  for (const item of items) {
    if (item.offsetX < 0 || rightEdge(item, obstacles) > world.chunkWidth) {
      return false;
    }
  }

  const ground = byLane(items, "ground", obstacles);
  const pit = byLane(items, "pit", obstacles);
  const air = byLane(items, "air", obstacles);

  if (!hasMinGapInLane(ground, world.minGroundGap, obstacles)) return false;
  if (!hasMinGapInLane(pit, world.minPitGap, obstacles)) return false;
  if (!groundPitCompatible(ground, pit, obstacles, world.minPitGap)) {
    return false;
  }
  if (!airGroundCompatible(ground, air, obstacles)) return false;

  return true;
}