"use client";

import { CharacterId } from "@/lib/characters";
import { RUN_FRAMES } from "@/lib/characters";
import { CANVAS, PLAYER, SPEEDS } from "@/game/config";
import { drawFrame } from "@/game/draw";
import { buildObstacles } from "@/game/state";
import type { GameAssets, GameState } from "@/game/types";
import { useRef } from "react";
import { useEffect } from "react";

type Props = {
    character: CharacterId,
}

function loadImage(src: string): HTMLImageElement {
  const img = new Image();
  img.src = src;
  return img;
}

function Game({ character }: Props) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = window.devicePixelRatio ?? 1;
        const { w, h } = CANVAS;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);

        ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

        const bg = loadImage("/background-2.jpg");
        const runFrames = RUN_FRAMES[character].map(loadImage);

        const assets: GameAssets = {
            bg,
            runFrames,
            obstacles: {
                konus: loadImage("/konus.png"),
                exam: loadImage("/exam.png"),
                lake: loadImage("/lake.png"),
                hole: loadImage("/hole.png"),
                stop: loadImage("/stop.png"),
            }
        }

        let playerY = PLAYER.groundY;
        let playerVY = 0;
        let jumpUntil = 0;
        const JUMP_SPRITE_MS = 800;
        const jumpUp = 200;
        
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space" || e.code === "ArrowUp") {
                e.preventDefault();
                playerVY = PLAYER.jumpVY;
                jumpUntil = performance.now() + JUMP_SPRITE_MS;
            }
        };
        
        const onPointerDown = () => {
            if (playerY >= PLAYER.groundY) {
                playerVY = PLAYER.jumpVY;
                jumpUntil = performance.now() + JUMP_SPRITE_MS;
            }
        };
        
        canvas.addEventListener("pointerdown", onPointerDown);
        window.addEventListener("keydown", onKeyDown);

        let rafId = 0;

        bg.onload = () => {
            let last = performance.now();
            let bgOffset = 0;
            let barrierX = 350;
            let bgSpeed = SPEEDS.bg;
            let barrierSpeed = SPEEDS.obstacles;
            let delta_t = 1;
            let g = PLAYER.gravity;
            const scale = h / bg.naturalHeight;
            const bgW = bg.naturalWidth * scale;

            const loop = (now: number) => {
                const dt = Math.min((now - last) / 1000, 0.05);
                last = now;
                bgOffset = (bgOffset + bgSpeed * dt) % bgW;
                barrierX = (barrierX - barrierSpeed * dt) % bgW;
                
                playerVY += g * delta_t;
                playerY += playerVY * delta_t;
                playerY = Math.min(playerY, PLAYER.groundY);

                const state: GameState ={
                    status: "playing",
                    playerY: playerY,
                    playerVY: playerVY,
                    groundY: PLAYER.groundY,
                    obstacles: buildObstacles(barrierX),
                    distance: 0, 
                    bgOffset,
                }
                
                drawFrame(ctx, state, assets, now);          
                rafId = requestAnimationFrame(loop);
            };

            rafId = requestAnimationFrame(loop);
        };

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("keydown", onKeyDown);
            canvas.removeEventListener("pointerdown", onPointerDown);
        };
    }, [character]);

    return (
        <div className="flex  items-center justify-center">
            <canvas ref={canvasRef}></canvas>
        </div>
    );
}

export default Game;