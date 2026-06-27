import { MIN_GROUND_GAP, MIN_PIT_GAP, CHUNK_WIDTH } from "./config";
import { MOBILE_LAYOUT } from "./layout/mobile";
import type { ObstacleLane } from "./obstacle-defs";
import type { ChunkSpawnItem } from "./types";

function def(kind: ChunkSpawnItem["kind"]) {
  return MOBILE_LAYOUT.obstacles[kind];
}

function rightEdge(item: ChunkSpawnItem): number {
  return item.offsetX + def(item.kind).w;
}

function gapBetween(a: ChunkSpawnItem, b: ChunkSpawnItem): number {
  const left = a.offsetX <= b.offsetX ? a : b;
  const right = a.offsetX <= b.offsetX ? b : a;
  return right.offsetX - rightEdge(left);
}

function byLane(items: ChunkSpawnItem[], lane: ObstacleLane) {
  return items
    .filter((item) => def(item.kind).lane === lane)
    .sort((a, b) => a.offsetX - b.offsetX);
}

function hasMinGapInLane(
  items: ChunkSpawnItem[],
  minGap: number,
): boolean {
  for (let i = 1; i < items.length; i++) {
    if (gapBetween(items[i - 1], items[i]) < minGap) return false;
  }
  return true;
}

function groundPitCompatible(
  ground: ChunkSpawnItem[],
  pit: ChunkSpawnItem[],
): boolean {
  for (const g of ground) {
    for (const p of pit) {
      const gEnd = rightEdge(g);
      const overlapStart = Math.max(g.offsetX, p.offsetX);
      const overlapEnd = Math.min(gEnd, rightEdge(p));
      if (overlapEnd > overlapStart) return false;
      if (p.offsetX >= gEnd && p.offsetX - gEnd < MIN_PIT_GAP) return false;
    }
  }
  return true;
}

function airGroundCompatible(
  ground: ChunkSpawnItem[],
  air: ChunkSpawnItem[],
): boolean {
  for (const a of air) {
    for (const g of ground) {
      const overlap =
        a.offsetX < rightEdge(g) && rightEdge(a) > g.offsetX;
      if (overlap) return false;
    }
  }
  return true;
}

export function isChunkPassable(items: ChunkSpawnItem[]): boolean {
  if (items.length === 0) return true;

  for (const item of items) {
    if (item.offsetX < 0 || rightEdge(item) > CHUNK_WIDTH) return false;
  }

  const ground = byLane(items, "ground");
  const pit = byLane(items, "pit");
  const air = byLane(items, "air");

  if (!hasMinGapInLane(ground, MIN_GROUND_GAP)) return false;
  if (!hasMinGapInLane(pit, MIN_PIT_GAP)) return false;
  if (!groundPitCompatible(ground, pit)) return false;
  if (!airGroundCompatible(ground, air)) return false;

  return true;
}