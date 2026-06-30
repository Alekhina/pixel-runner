import { CharacterId } from "@/lib/characters";
import type { GameLayout } from "./layout/types";

export type Area = { 
    x: number,
    y: number,
    w: number,
    h: number,
};

export type Obstacle = {
    id: string,
    kind: ObstacleKind,
    x: number,
    y: number,
    w: number,
    h: number,
    hitbox: Area,
};

export type GameStatus = "playing" | "crashed" | "won";
export type GameEndReason = "crash" | "victory";

export type ObstacleKind = "konus" | "lake" | "hole" | "stop" | "exam" | "repair" | "bricks" | "barrier" | "finish_car";

export type GameState = {
    status: GameStatus;
    playerY: number;
    playerVY: number;
    groundY: number;
    layout: GameLayout;
    obstacles: Obstacle[];
    distance: number; 
    bgIndex: number;
    bgOffset: number;
    roadOffset: number;
};
export type GameResult = {
    distance: number;
    character: CharacterId;
    reason: GameEndReason;
};

export type DrawableImage = HTMLImageElement | HTMLCanvasElement;

export type GameAssets = {
    backgrounds: HTMLImageElement[];
    road: DrawableImage;
    runFrames: HTMLImageElement[];
    obstacles: Record<ObstacleKind, DrawableImage>;
};

export type ChunkSpawnItem = {
    kind: ObstacleKind;
    offsetX: number;
};