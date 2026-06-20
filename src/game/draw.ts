import { GameState } from "./types";
import { GameAssets } from "./types";
import { DEBUG_HITBOXES, PLAYER } from "./config";
import { Area } from "./types";
import { getPlayerHitbox } from "./collision";

export function drawFrame(
    ctx: CanvasRenderingContext2D,
    state: GameState,
    assets: GameAssets,
    now: number,
): void {
    drawBackground(ctx, state, assets);
    drawObstacles(ctx, state, assets);
    drawPlayer(ctx, state, assets, now);
    drawDebugHitboxes(ctx, state);
}

function drawBackground(ctx:CanvasRenderingContext2D, state: GameState, assets: GameAssets): void {
    const w = 360;
    const h = 640;
    const x1 = - state.bgOffset;
    const bg = assets.backgrounds[state.bgIndex];
    if (!bg) return;

    const scale = h / bg.naturalHeight;
    const bgW = bg.naturalWidth * scale;
    ctx.drawImage(bg, x1, 0, bgW, h);
    ctx.drawImage(bg, x1 + bgW, 0, bgW, h);
}

function drawObstacles(ctx:CanvasRenderingContext2D, state: GameState, assets: GameAssets): void {
    const obstacles = state.obstacles;;
    const sprites = assets.obstacles;
    for (const obs of obstacles) {
        ctx.drawImage(sprites[obs.kind], obs.x, obs.y, obs.w, obs.h);
    }
}

function drawPlayer(ctx:CanvasRenderingContext2D, state: GameState, assets: GameAssets, now: number): void {
    let characterDraw = assets.runFrames[0];

    if (state.playerY >= state.groundY) {
        if (Math.floor(now / 80) % 6 === 0) {
            characterDraw = assets.runFrames[0];
        } else if (Math.floor(now / 80) % 6 === 1) {
            characterDraw = assets.runFrames[1];
        } else if (Math.floor(now / 80) % 6 === 2) {
            characterDraw = assets.runFrames[2];
        } else if (Math.floor(now / 80) % 6 === 3) {
            characterDraw = assets.runFrames[3];
        } else if (Math.floor(now / 80) % 6 === 4) {
            characterDraw = assets.runFrames[4];
        } else if (Math.floor(now / 80) % 6 === 5) {
            characterDraw = assets.runFrames[5];
        }
    } else {
        characterDraw = assets.runFrames[6];
    }
    
    ctx.drawImage(
        characterDraw,
        PLAYER.x,
        state.playerY,
        PLAYER.drawW,
        PLAYER.drawH,
    );
}

function strokeSprite(ctx:CanvasRenderingContext2D, spriteHitbox: Area) {
    ctx.save();
    ctx.strokeStyle = "white";
    ctx.strokeRect(spriteHitbox.x, spriteHitbox.y, spriteHitbox.w, spriteHitbox.h);
    ctx.restore();
}

function drawDebugHitboxes(ctx:CanvasRenderingContext2D, state: GameState): void {
    if (!DEBUG_HITBOXES) {
        return;
    }
    strokeSprite(ctx, getPlayerHitbox(state));
    state.obstacles.forEach((obs) => {strokeSprite(ctx, obs.hitbox)});
}