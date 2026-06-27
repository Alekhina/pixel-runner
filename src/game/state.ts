import { INITIAL_BARRIER_X, OBSTACLE_LAYOUT } from "./config";
import { MOBILE_LAYOUT } from "./layout/mobile";
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
    const layout = MOBILE_LAYOUT;
    return {
        status: "playing",
        playerY: layout.player.groundY,
        playerVY: 0,
        groundY: layout.player.groundY,
        layout,
        obstacles: buildObstacles(INITIAL_BARRIER_X),
        distance: 0,
        bgIndex: 0,
        bgOffset: 0,
        roadOffset: 0,
    };
}
