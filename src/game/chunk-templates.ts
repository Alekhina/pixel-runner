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
//     id: "rest",
//     minKm: 0,
//     weight: 2,
//     items: [],
//   },
  {
    id: "solo-konus-center",
    minKm: 0,
    weight: 5,
    items: [{ kind: "konus", offsetX: 420 }],
  },
  {
    id: "solo-lake",
    minKm: 100,
    weight: 3,
    items: [{ kind: "lake", offsetX: 400 }],
  },
//   {
//     id: "double-hole",
//     minKm: 100,
//     weight: 3,
//     items: [
//       { kind: "hole", offsetX: 220 },
//       { kind: "hole", offsetX: 220 + 72 + MIN_PIT_GAP }, // 588
//     ],
//   },
//   {
//     id: "double-konus",
//     minKm: 150,
//     weight: 4,
//     items: (() => {
//         const stop = { kind: "stop" as const, offsetX: 200 };
//         return [stop, after(stop, "konus", MIN_GROUND_GAP)];
//     })(),
//   },
//   {
//     id: "konus-then-lake",
//     minKm: 400,
//     weight: 3,
//     items: [
//       { kind: "konus", offsetX: 120 },
//       { kind: "lake", offsetX: 120 + 60 + MIN_PIT_GAP },     // 500 при gap=320
//     ],
//   },
//   {
//     id: "double",
//     minKm: 150,
//     weight: 4,
//     items: [
//       { kind: "repair", offsetX: 180 },
//       { kind: "heap", offsetX: 180 + 70 + MIN_GROUND_GAP }, // 520 при gap=280
//     ],
//   },
//   {
//     id: "stop-then-konus",
//     minKm: 500,
//     weight: 2,
//     items: [{ kind: "stop", offsetX: 380 },
//             { kind: "konus", offsetX: 120 + 60 + MIN_PIT_GAP }
//     ],
//   },
//   {
//     id: "triple-light",
//     minKm: 600,
//     weight: 2,
//     items: [
//       { kind: "hole", offsetX: 100 },
//       { kind: "konus", offsetX: 100 + 60 + MIN_GROUND_GAP },
//       { kind: "lake", offsetX: 100 + 60 + MIN_GROUND_GAP + 60 + MIN_PIT_GAP },
//     ],
//   },
];