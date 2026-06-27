import { GameState } from "./types";
import { GameAssets } from "./types";
import { DEBUG_HITBOXES } from "./config";
import { Area } from "./types";
import { getPlayerHitbox } from "./collision";

export function drawFrame(
    ctx: CanvasRenderingContext2D,
    state: GameState,
    assets: GameAssets,
    now: number,
): void {
    drawBackground(ctx, state, assets);
    drawRoad(ctx, state, assets); 
    drawObstacles(ctx, state, assets);
    drawPlayer(ctx, state, assets, now);
    drawDebugHitboxes(ctx, state);
}

function drawBackground(ctx:CanvasRenderingContext2D, state: GameState, assets: GameAssets): void {
    const h = state.layout.canvas.h;
    const bg = assets.backgrounds[state.bgIndex];
    if (!bg?.naturalHeight) return;

    const scale = h / bg.naturalHeight;
    const bgW = bg.naturalWidth * scale;
    const nextBg = assets.backgrounds[state.bgIndex + 1];

    if (nextBg?.naturalHeight) {
        const x = -state.bgOffset;
        ctx.drawImage(bg, x, 0, bgW, h);

        const nextScale = h / nextBg.naturalHeight;
        const nextW = nextBg.naturalWidth * nextScale;
        ctx.drawImage(nextBg, x + bgW, 0, nextW, h);
        return;
    }

    const x1 = -(state.bgOffset % bgW);
    ctx.drawImage(bg, x1, 0, bgW, h);
    ctx.drawImage(bg, x1 + bgW, 0, bgW, h);
}

function drawRoad(ctx: CanvasRenderingContext2D, state: GameState, assets: GameAssets): void {
    const road = assets.road;
    if (!road?.naturalHeight) return;
    const h = state.layout.draw.roadDrawH;
    const canvasH = state.layout.canvas.h;
    const scale = h / road.naturalHeight;
    const roadW = road.naturalWidth * scale;
    const roadY = canvasH - h;
    const x1 = -(state.roadOffset % roadW);
    ctx.drawImage(road, x1, roadY, roadW, h);
    ctx.drawImage(road, x1 + roadW, roadY, roadW, h);
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
        state.layout.player.x,
        state.playerY,
        state.layout.player.drawW,
        state.layout.player.drawH,
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