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
};

function getDifficulty(distance: number): number {
  return Math.min(distance / DISTANCE_GOAL, 1);
}

export function initObstacleWorld(
  layout: GameLayout,
  seed = createRunSeed(),
): ObstacleWorld {
  const { world } = layout;
  const chunkStartX = world.initialBarrierX;
  const items = generateChunk(0, 0, seed);
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
    const items = generateChunk(nextChunkIndex, distance, seed);
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

  return {
    obstacles,
    nextChunkIndex,
    worldEndX,
    nextObstacleId,
    seed,
  };
}
