import { GameState } from "./types";
import { GameAssets, DrawableImage } from "./types";
import { DEBUG_HITBOXES, isPlayerGrounded } from "./config";
import { Area } from "./types";
import { getPlayerHitbox } from "./collision";

export function drawableW(img: DrawableImage): number {
    return img instanceof HTMLImageElement ? img.naturalWidth : img.width;
}
export function drawableH(img: DrawableImage): number {
    return img instanceof HTMLImageElement ? img.naturalHeight : img.height;
}

function imgW(img: DrawableImage): number {
    return drawableW(img);
}
function imgH(img: DrawableImage): number {
    return drawableH(img);
}

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
    const bgNatH = imgH(bg);
    if (!bgNatH) return;

    const bgW = (imgW(bg) / bgNatH) * h;
    const nextBg = assets.backgrounds[state.bgIndex + 1];
    const nextNatH = imgH(nextBg);

    if (nextNatH) {
        const x = -state.bgOffset;
        ctx.drawImage(bg, x, 0, bgW, h);

        const nextW = (imgW(nextBg) / nextNatH) * h;
        ctx.drawImage(nextBg, x + bgW, 0, nextW, h);
        return;
    }

    const x1 = -(state.bgOffset % bgW);
    ctx.drawImage(bg, x1, 0, bgW, h);
    ctx.drawImage(bg, x1 + bgW, 0, bgW, h);
}

function drawRoad(ctx: CanvasRenderingContext2D, state: GameState, assets: GameAssets): void {
    const road = assets.road;
    if (!imgH(road)) return;
    const h = state.layout.draw.roadDrawH;
    const canvasH = state.layout.canvas.h;
    const scale = h / imgH(road);
    const roadW = imgW(road) * scale;
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

    if (isPlayerGrounded(state.playerY, state.groundY)) {
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