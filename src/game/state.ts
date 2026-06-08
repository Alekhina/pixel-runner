import { INITIAL_BARRIER_X, OBSTACLE_LAYOUT, PLAYER } from "./config";
import type { GameState, Obstacle } from "./types";

export function buildObstacles(barrierX: number): Obstacle[] {
    return OBSTACLE_LAYOUT.map((t, i) => {
        const x = barrierX + t.offsetX;
        return {
            id: String(i),
            kind: t.kind,
            x,
            y: t.y,
            w: t.w,
            h: t.h,
            hitbox: { x, y: t.y, w: t.w, h: t.h },
        };
    });
}

export function createInitialState(): GameState {
    return {
        status: "playing",
        playerY: PLAYER.groundY,
        playerVY: 0,
        groundY: PLAYER.groundY,
        obstacles: buildObstacles(INITIAL_BARRIER_X),
        distance: 0,
        bgOffset: 0,
    };
}
