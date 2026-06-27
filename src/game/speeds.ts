import { DISTANCE_GOAL } from "./config";
import type { SpeedLayout } from "./layout/types";

export function getProgress(distanceKm: number): number {
  return Math.min(Math.max(distanceKm / DISTANCE_GOAL, 0), 1);
}

export function getObstacleSpeed(distanceKm: number, speeds: SpeedLayout): number {
  const t = getProgress(distanceKm);
  return speeds.obstacles + (speeds.obstaclesMax - speeds.obstacles) * t;
}

export function getBgSpeed(distanceKm: number, speeds: SpeedLayout): number {
  const t = getProgress(distanceKm);
  return speeds.bg + (speeds.bgMax - speeds.bg) * t;
}
