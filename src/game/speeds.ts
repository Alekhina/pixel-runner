import { DISTANCE_GOAL, SPEEDS } from "./config";

export function getProgress(distanceKm: number): number {
  return Math.min(Math.max(distanceKm / DISTANCE_GOAL, 0), 1);
}

export function getObstacleSpeed(distanceKm: number): number {
  const t = getProgress(distanceKm);
  return SPEEDS.obstacles + (SPEEDS.obstaclesMax - SPEEDS.obstacles) * t;
}

export function getBgSpeed(distanceKm: number): number {
  const t = getProgress(distanceKm);
  return SPEEDS.bg + (SPEEDS.bgMax - SPEEDS.bg) * t;
}