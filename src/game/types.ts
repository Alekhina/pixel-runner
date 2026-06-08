import { CharacterId } from "@/lib/characters";

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

type GameStatus = "playing" | "crashed";

export type ObstacleKind = "konus" | "lake" | "hole" | "stop" | "exam";

export type GameState = {
    status: GameStatus;
    playerY: number;
    playerVY: number;
    groundY: number;
    obstacles: Obstacle[];
    distance: number; 
    bgOffset: number;
    // jumpUntil: number;
    // elapsed: number;
};
export type GameResult = {
    distance: number;
    character: CharacterId;
};

export type GameAssets = {
    bg: HTMLImageElement;
    runFrames: HTMLImageElement[];
    obstacles: Record<ObstacleKind, HTMLImageElement>;
};
