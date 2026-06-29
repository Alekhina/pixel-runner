import type { ChunkSpawnItem } from "./types";
import { MIN_GROUND_GAP, MIN_PIT_GAP } from "./config";
import type { GameLayout } from "./layout/types";
import { MOBILE_LAYOUT } from "./layout/mobile";

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
  const prevW = MOBILE_LAYOUT.obstacles[prev.kind].w;
  return { kind, offsetX: prev.offsetX + prevW + gap };
}

export const CHUNK_TEMPLATES: ChunkTemplate[] = [
  //   {
  //   id: "empty",
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
  {
    id: "hole-then-konus",
    minKm: 0,
    weight: 5,
    items: (() => {
        const hole = { kind: "hole" as const, offsetX: 200 };
        return [hole, after(hole, "konus", MIN_GROUND_GAP + 150)];
    })(),
  },
  {
    id: "konus-then-hole",
    minKm: 0,
    weight: 5,
    items: (() => {
        const konus = { kind: "konus" as const, offsetX: 200 };
        return [konus, after(konus, "hole", MIN_PIT_GAP)];
    })(),
  },
  {
    id: "",
    minKm: 0,
    weight: 5,
    items: (() => {
        const konus = { kind: "konus" as const, offsetX: 200 };
        return [konus, after(konus, "hole", MIN_PIT_GAP)];
    })(),
  },
    {
      id: "barrier-then-hole",
      minKm: 500,
      weight: 5,
      items: (() => {
        const barrier = { kind: "barrier" as const, offsetX: 200 };
        return [barrier, after(barrier, "hole", MIN_PIT_GAP)];
    })(),
    },
    {
      id: "stop-then-konus",
      minKm: 1000,
      weight: 2,
      items: (() => {
        const stop = { kind: "stop" as const, offsetX: 200 };
        return [stop, after(stop, "konus", MIN_GROUND_GAP + 130)];
      })(),
    },
    {
      id: "double-stop",
      minKm: 1000,
      weight: 2,
      items: (() => {
        const stop = { kind: "stop" as const, offsetX: 200 };
        return [stop, after(stop, "stop", MIN_GROUND_GAP + 150)];
      })(),
    },
    {
      id: "exam-then-konus",
      minKm: 2000,
      weight: 2,
      items: (() => {
        const exam = { kind: "exam" as const, offsetX: 200 };
        return [exam, after(exam, "konus", MIN_GROUND_GAP + 120)];
      })(),
    },
    {
      id: "exam-then-stop",
      minKm: 2000,
      weight: 2,
      items: (() => {
        const exam = { kind: "exam" as const, offsetX: 200 };
        return [exam, after(exam, "stop", MIN_GROUND_GAP + 140)];
      })(),
    },
    {
      id: "double-barrier",
      minKm: 2500,
      weight: 5,
      items: (() => {
        const barrier = { kind: "barrier" as const, offsetX: 200 };
        return [barrier, after(barrier, "barrier", MIN_GROUND_GAP + 100)];
    })(),
    },
    {
      id: "lake-then-konus",
      minKm: 2500,
      weight: 3,
      items: (() => {
        const lake = { kind: "lake" as const, offsetX: 200 };
        return [lake, after(lake, "konus", MIN_GROUND_GAP + 100)];
      })(),
    },
    {
      id: "double-lake",
      minKm: 2500,
      weight: 3,
      items: (() => {
        const lake = { kind: "lake" as const, offsetX: 200 };
        return [lake, after(lake, "lake", MIN_PIT_GAP)];
      })(),
    },
    {
      id: "repair-then-hole",
      minKm: 1500,
      weight: 3,
      items: (() => {
        const repair = { kind: "repair" as const, offsetX: 200 };
        return [repair, after(repair, "hole", MIN_PIT_GAP)];
      })(),
    },
    {
      id: "repair-repair",
      minKm: 1500,
      weight: 3,
      items: (() => {
        const repair = { kind: "repair" as const, offsetX: 120 };
        return [repair, after(repair, "repair", MIN_PIT_GAP)];
      })(),
    },
    {
      id: "repair-then-bricks",
      minKm: 3000,
      weight: 4,
      items: (() => {
        const repair = { kind: "repair" as const, offsetX: 180 };
        return [repair, after(repair, "bricks", MIN_GROUND_GAP + 80)];
      })(),
    },
];

/** Только desktop: серии из 3 препятствий (нужен увеличенный chunkWidth). */
export const CHUNK_TEMPLATES_DESKTOP: ChunkTemplate[] = [
  {
    id: "triple-konus",
    minKm: 0,
    weight: 6,
    items: (() => {
      const k1 = { kind: "konus" as const, offsetX: 200 };
      const k2 = after(k1, "konus", MIN_GROUND_GAP + 150);
      const k3 = after(k2, "konus", MIN_GROUND_GAP + 150);
      return [k1, k2, k3];
    })(),
  },
  {
    id: "triple-konus-wide",
    minKm: 500,
    weight: 4,
    items: (() => {
      const k1 = { kind: "konus" as const, offsetX: 180 };
      const k2 = after(k1, "konus", MIN_GROUND_GAP + 200);
      const k3 = after(k2, "konus", MIN_GROUND_GAP + 200);
      return [k1, k2, k3];
    })(),
  },
  {
    id: "konus-hole-konus",
    minKm: 500,
    weight: 5,
    items: (() => {
      const k1 = { kind: "konus" as const, offsetX: 200 };
      const hole = after(k1, "hole", MIN_PIT_GAP);
      const k2 = after(hole, "konus", MIN_GROUND_GAP + 120);
      return [k1, hole, k2];
    })(),
  },
  {
    id: "triple-barrier",
    minKm: 2500,
    weight: 5,
    items: (() => {
      const b1 = { kind: "barrier" as const, offsetX: 200 };
      const b2 = after(b1, "barrier", MIN_GROUND_GAP + 100);
      const b3 = after(b2, "barrier", MIN_GROUND_GAP + 100);
      return [b1, b2, b3];
    })(),
  },
];

export function getChunkTemplates(layoutId: GameLayout["id"]): ChunkTemplate[] {
  if (layoutId === "desktop") {
    return [...CHUNK_TEMPLATES, ...CHUNK_TEMPLATES_DESKTOP];
  }
  return CHUNK_TEMPLATES;
}