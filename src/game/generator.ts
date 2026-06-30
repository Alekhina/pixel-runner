import { isChunkPassable } from "./chunk-validation";
import { getChunkTemplates, type ChunkTemplate } from "./chunk-templates";
import type { ObstacleDef } from "./obstacle-defs";
import type { GameLayout } from "./layout/types";
import { MOBILE_LAYOUT } from "./layout/mobile";
import type { ChunkSpawnItem, Obstacle, ObstacleKind } from "./types";

function mulberry32(seed: number): () => number {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickTemplate(
  distanceKm: number,
  chunkIndex: number,
  seed: number,
  layout: GameLayout,
): ChunkTemplate {
  const templates = getChunkTemplates(layout.id);
  const eligible = templates.filter((t) => {
    if (distanceKm < t.minKm) return false;
    if (t.maxKm != null && distanceKm > t.maxKm) return false;
    return true;
  });
  const totalWeight = eligible.reduce((s, t) => s + t.weight, 0);
  let roll = mulberry32(seed + chunkIndex * 31)() * totalWeight;
  for (const t of eligible) {
    roll -= t.weight;
    if (roll <= 0) return t;
  }
  return eligible[eligible.length - 1]!;
}

export function spawnChunkFromItems(
  items: ChunkSpawnItem[],
  chunkStartX: number,
  idStart: number,
  obstacleDefs: Record<ObstacleKind, ObstacleDef>,
): Obstacle[] {
  return items.map((item, i) => {
    const def = obstacleDefs[item.kind];
    const x = chunkStartX + item.offsetX;
    const hitbox = def.hitbox
      ? {
          x: x + def.hitbox.insetX,
          y: def.y + def.hitbox.insetY,
          w: def.hitbox.w,
          h: def.hitbox.h,
        }
      : { x, y: def.y, w: def.w, h: def.h };

    return {
      id: String(idStart + i),
      kind: item.kind,
      x,
      y: def.y,
      w: def.w,
      h: def.h,
      hitbox,
    };
  });
}

export function createRunSeed(): number {
  return (Math.random() * 0xffffffff) >>> 0;
}

function chunkValidationContext(layout: GameLayout) {
  return {
    world: layout.world,
    // Шаблоны считают зазоры по mobile-ширинам (чанки не масштабируются).
    obstacles: MOBILE_LAYOUT.obstacles,
  };
}

export function generateChunk(
  chunkIndex: number,
  distanceKm: number,
  seed: number,
  layout: GameLayout,
): ChunkSpawnItem[] {
  if (chunkIndex === 0) {
    return [];
  }

  const template = pickTemplate(distanceKm, chunkIndex, seed, layout);
  const items = template.items.map((item) => ({ ...item }));
  if (!isChunkPassable(items, chunkValidationContext(layout))) {
    console.warn(`Template ${template.id} failed validation`);
    return [];
  }
  return items;
}

export function spawnChunk(
  chunkIndex: number,
  difficulty: number,
  seed: number,
  chunkStartX: number,
  idStart: number,
  obstacleDefs: Record<ObstacleKind, ObstacleDef>,
  layout: GameLayout,
): Obstacle[] {
  const items = generateChunk(chunkIndex, difficulty, seed, layout);
  return spawnChunkFromItems(items, chunkStartX, idStart, obstacleDefs);
}
