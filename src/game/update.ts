import {
  CANVAS,
  CHUNK_WIDTH,
  DESPAWN_BEHIND_X,
  DISTANCE_GOAL,
  INITIAL_BARRIER_X,
  MIN_CHUNK_GAP,
  SPAWN_AHEAD_X,
} from "./config";
import { generateChunk, spawnChunkFromItems } from "./generator";
import type { Obstacle } from "./types";

export type ObstacleWorld = {
  obstacles: Obstacle[];
  nextChunkIndex: number;
  worldEndX: number;
  nextObstacleId: number;
};

function getDifficulty(distance: number): number {
  return Math.min(distance / DISTANCE_GOAL, 1);
}

export function initObstacleWorld(): ObstacleWorld {
  const chunkStartX = INITIAL_BARRIER_X;
  const items = generateChunk(0, 0);
  const obstacles = spawnChunkFromItems(items, chunkStartX, 0);

  return {
    obstacles,
    nextChunkIndex: 1,
    worldEndX: chunkStartX + CHUNK_WIDTH,
    nextObstacleId: obstacles.length,
  };
}

export function updateObstacles(
  world: ObstacleWorld,
  scrollDelta: number,
  distance: number,
): ObstacleWorld {
  let obstacles = world.obstacles
    .map((obs) => ({
      ...obs,
      x: obs.x - scrollDelta,
      hitbox: {
        ...obs.hitbox,
        x: obs.hitbox.x - scrollDelta,
      },
    }))
    .filter((obs) => obs.x + obs.w >= DESPAWN_BEHIND_X);

  let { nextChunkIndex, worldEndX, nextObstacleId } = world;
  worldEndX -= scrollDelta;

  const difficulty = getDifficulty(distance);

  while (worldEndX < CANVAS.w + SPAWN_AHEAD_X) {
    const chunkStartX = worldEndX + MIN_CHUNK_GAP;
    const items = generateChunk(nextChunkIndex, distance);
    const spawned = spawnChunkFromItems(items, chunkStartX, nextObstacleId);

    obstacles = obstacles.concat(spawned);
    nextObstacleId += spawned.length;
    worldEndX = chunkStartX + CHUNK_WIDTH;
    nextChunkIndex += 1;
  }

  return {
    obstacles,
    nextChunkIndex,
    worldEndX,
    nextObstacleId,
  };
}