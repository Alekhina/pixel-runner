import type { ChunkSpawnItem } from "./types";
import { MIN_GROUND_GAP, MIN_PIT_GAP } from "./config";
import { OBSTACLE_DEFS } from "./obstacle-defs";

export type ChunkTemplate = {
  id: string;
  minKm: number;       // с какого пробега доступен
  maxKm?: number;      // опционально — только для ранней игры
  weight: number;      // чем больше — тем чаще выпадает
  items: ChunkSpawnItem[];
};

function after(
  prev: ChunkSpawnItem,
  kind: ChunkSpawnItem["kind"],
  gap: number,
): ChunkSpawnItem {
  const prevW = OBSTACLE_DEFS[prev.kind].w;
  return { kind, offsetX: prev.offsetX + prevW + gap };
}

export const CHUNK_TEMPLATES: ChunkTemplate[] = [
  //   {
  //   id: "konus",
  //   minKm: 0,
  //   weight: 5,
  //   items: [],
  // },
  {
    id: "double-konus",
    minKm: 0,
    weight: 5,
    items: (() => {
        const konus = { kind: "konus" as const, offsetX: 200 };
        return [konus, after(konus, "konus", MIN_GROUND_GAP + 150)];
    })(),
  },
  {
    id: "double-konus-2",
    minKm: 0,
    weight: 5,
    items: (() => {
        const konus = { kind: "konus" as const, offsetX: 200 };
        return [konus, after(konus, "konus", MIN_GROUND_GAP + 200)];
    })(),
  },
  // {
  //   id: "double-konus-3",
  //   minKm: 200,
  //   weight: 5,
  //   items: (() => {
  //       const konus = { kind: "konus" as const, offsetX: 200 };
  //       return [konus, after(konus, "konus", MIN_GROUND_GAP)];
  //   })(),
  // },
  {
    id: "lake-then-konus",
    minKm: 150,
    weight: 3,
    items: [
      { kind: "lake", offsetX: 400 },
      { kind: "konus", offsetX: 220 + 140 + MIN_PIT_GAP }
    ],
  },
  // {
  //   id: "double-lake",
  //   minKm: 150,
  //   weight: 3,
  //   items: [
  //     { kind: "lake", offsetX: 400 },
  //     { kind: "lake", offsetX: 220 + 110 + MIN_PIT_GAP }
  //   ],
  // },
  // {
  //   id: "repair-then-hole",
  //   minKm: 500,
  //   weight: 3,
  //   items: [
  //     { kind: "repair", offsetX: 220 },
  //     { kind: "hole", offsetX: 220 + 72 + MIN_PIT_GAP },
  //   ],
  // },
  // {
  //   id: "konus-then-lake",
  //   minKm: 400,
  //   weight: 3,
  //   items: [
  //     { kind: "konus", offsetX: 120 },
  //     { kind: "lake", offsetX: 120 + 60 + MIN_PIT_GAP },
  //   ],
  // },
  // {
  //   id: "repair-then-heap",
  //   minKm: 400,
  //   weight: 4,
  //   items: [
  //     { kind: "repair", offsetX: 180 },
  //     { kind: "heap", offsetX: 180 + 80 + MIN_GROUND_GAP },
  //   ],
  // },
  // {
  //   id: "stop-then-konus",
  //   minKm: 400,
  //   weight: 2,
  //   items: [{ kind: "stop", offsetX: 380 },
  //           { kind: "konus", offsetX: 120 + 60 + MIN_PIT_GAP }
  //   ],
  // },
  // {
  //   id: "triple-light",
  //   minKm: 1000,
  //   weight: 2,
  //   items: (() => {
  //     const hole = { kind: "hole" as const, offsetX: 100 };
  //     const konus = after(hole, "konus", MIN_GROUND_GAP);
  //     const lake = after(konus, "lake", MIN_PIT_GAP);
  //     return [hole, konus, lake];
  //   })(),
  // },
];