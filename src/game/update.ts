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

export function initObstacleWorld(
  layout: GameLayout,
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
  const obstacles = world.obstacles;
  const despawnX = worldLayout.despawnBehindX;

  let writeIndex = 0;
  for (let i = 0; i < obstacles.length; i++) {
    const obs = obstacles[i]!;
    const x = obs.x - scrollDelta;
    if (x + obs.w >= despawnX) {
      obs.x = x;
      obs.hitbox.x -= scrollDelta;
      if (writeIndex !== i) {
        obstacles[writeIndex] = obs;
      }
      writeIndex += 1;
    }
  }
  obstacles.length = writeIndex;

  world.worldEndX -= scrollDelta;

  while (world.worldEndX < canvas.w + worldLayout.spawnAheadX) {
    const chunkStartX = world.worldEndX + worldLayout.minChunkGap;
    const items = generateChunk(
      world.nextChunkIndex,
      distance,
      world.seed,
      layout,
    );
    const spawned = spawnChunkFromItems(
      items,
      chunkStartX,
      world.nextObstacleId,
      layout.obstacles,
    );

    for (let i = 0; i < spawned.length; i++) {
      obstacles.push(spawned[i]!);
    }

    world.nextObstacleId += spawned.length;
    world.worldEndX = chunkStartX + worldLayout.chunkWidth;
    world.nextChunkIndex += 1;
  }

  if (!world.finishCarSpawned && distance >= DISTANCE_GOAL - 50) {
    world.finishCarSpawned = true;
    const def = layout.obstacles.finish_car;
    const mobileFinishCarOffsetX = layout.id === "mobile" ? 70 : 0;
    const spawnX = canvas.w + layout.world.spawnAheadX + mobileFinishCarOffsetX;
    obstacles.push({
      id: "finish_car",
      kind: "finish_car",
      x: spawnX,
      y: def.y,
      w: def.w,
      h: def.h,
      hitbox: { x: spawnX, y: def.y, w: 0, h: 0 },
    });
    world.nextObstacleId += 1;
  }

  return world;
}
