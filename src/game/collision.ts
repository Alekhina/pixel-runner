import { PLAYER } from "./config"; 
import { Area } from "./types";
import type { GameState } from "./types";

function areasIntersect(area_1: Area, area_2: Area): boolean {
    return (
        area_1.x < area_2.x + area_2.w &&
        area_1.x + area_1.w > area_2.x &&
        area_1.y < area_2.y + area_2.h &&
        area_1.y + area_1.h > area_2.y
    );
}

export function isColliding(state: GameState): boolean {
    let res = false;
    const playerHitbox = getPlayerHitbox(state);
    state.obstacles.forEach((obs) => {
        if (areasIntersect(playerHitbox, obs.hitbox) === true) {
            res = true;
        }
    })

    return res;
}

export function getPlayerHitbox(state: GameState) {
    const { x, hitbox } = PLAYER;
    return ({
        x: x + hitbox.insetX,
        y: state.playerY + hitbox.insetY,
        w: hitbox.w,
        h: hitbox.h,
    })
}