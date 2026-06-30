import { DISTANCE_GOAL } from "./config";
import { createRunSeed, generateChunk, spawnChunkFromItems } from "./generator";
import type { GameLayout } from "./layout/types";
import type { Obstacle } from "./types";
export type ObstacleWorld = {
  obstacles: Obstacle[];
  nextChunkIndex: number;
  worldEndX: number;
  nextObstacleId: number;
  seed: number;
  finishCarSpawned: boolean;
};

function getDifficulty(distance: number): number {
  return Math.min(distance / DISTANCE_GOAL, 1);
}

export function initObstacleWorld(  layout: GameLayout,
  seed = createRunSeed(),
): ObstacleWorld {
  const { world } = layout;
  const chunkStartX = world.initialBarrierX;
  const items = generateChunk(0, 0, seed, layout);
  const obstacles = spawnChunkFromItems(
    items,
    chunkStartX,
    0,
    layout.obstacles,
  );

  return {
    obstacles,
    nextChunkIndex: 1,
    worldEndX: chunkStartX + world.chunkWidth,
    nextObstacleId: obstacles.length,
    seed,
    finishCarSpawned: false,
  };
}

export function updateObstacles(
  world: ObstacleWorld,
  scrollDelta: number,
  distance: number,
  layout: GameLayout,
): ObstacleWorld {
  const { canvas, world: worldLayout } = layout;

  let obstacles = world.obstacles
    .map((obs) => ({
      ...obs,
      x: obs.x - scrollDelta,
      hitbox: {
        ...obs.hitbox,
        x: obs.hitbox.x - scrollDelta,
      },
    }))
    .filter((obs) => obs.x + obs.w >= worldLayout.despawnBehindX);

  let { nextChunkIndex, worldEndX, nextObstacleId, seed } = world;
  worldEndX -= scrollDelta;

  getDifficulty(distance);

  while (worldEndX < canvas.w + worldLayout.spawnAheadX) {
    const chunkStartX = worldEndX + worldLayout.minChunkGap;
    const items = generateChunk(nextChunkIndex, distance, seed, layout);
    const spawned = spawnChunkFromItems(
      items,
      chunkStartX,
      nextObstacleId,
      layout.obstacles,
    );

    obstacles = obstacles.concat(spawned);
    nextObstacleId += spawned.length;
    worldEndX = chunkStartX + worldLayout.chunkWidth;
    nextChunkIndex += 1;
  }

  let { finishCarSpawned } = world;

  if (!finishCarSpawned && distance >= DISTANCE_GOAL - 50) {
    finishCarSpawned = true;
    const def = layout.obstacles.finish_car;
    const mobileFinishCarOffsetX = layout.id === "mobile" ? 50 : 0;
    const spawnX = canvas.w + layout.world.spawnAheadX + mobileFinishCarOffsetX;
    obstacles = obstacles.concat({
      id: "finish_car",
      kind: "finish_car",
      x: spawnX,
      y: def.y,
      w: def.w,
      h: def.h,
      hitbox: { x: spawnX, y: def.y, w: 0, h: 0 },
    });
    nextObstacleId += 1;
  }

  return {
    obstacles,
    nextChunkIndex,
    worldEndX,
    nextObstacleId,
    seed,
    finishCarSpawned,
  };
}
