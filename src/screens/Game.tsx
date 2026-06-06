"use client";

import { CharacterId } from "@/lib/characters";
import { RUN_FRAMES } from "@/lib/characters";
import { useRef } from "react";
import { useEffect } from "react";

type Props = {
    character: CharacterId,
}

function Game({ character }: Props) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = window.devicePixelRatio ?? 1;
        const w = 360;
        const h = 640;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);

        ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

        const bg = new Image();
        bg.src = "/background-2.jpg";

        // const RUN_FRAMES_KODIK = [
        //     "/characters/kodik-1.png",
        //     "/characters/kodik-2.png",
        //     "/characters/kodik-3.png",
        //     "/characters/kodik-4.png",
        //     "/characters/kodik-5.png",
        //     "/characters/kodik-6.png",
        //     "/characters/kodik-7.png",
        // ];

        // const RUN_FRAMES_VECTA = [
        //     "/characters/vecta-1.png",
        //     "/characters/vecta-2.png",
        //     "/characters/vecta-3.png",
        //     "/characters/vecta-4.png",
        //     "/characters/vecta-5.png",
        //     "/characters/vecta-6.png",
        //     "/characters/vecta-7.png",
        // ]

        const runImages = RUN_FRAMES[character].map((src) => {
            const img = new Image();
            img.src = src;
            return img;
        });

        let characterDraw = runImages[0];
        let useJumpFrame = false;
        let jumpUntil = 0;
        const JUMP_SPRITE_MS = 800;

        const konusImg = new Image();
        konusImg.src = '/konus.png';

        const examImg = new Image();
        examImg.src = '/exam.png';

        const lakeImg = new Image();
        lakeImg.src = '/lake.png';

        const holeImg = new Image();
        holeImg.src = '/hole.png';

        const stopImg = new Image();
        stopImg.src = '/stop.png';

        let playerY = 270;
        const jumpUp = 200;
        let playerVY = 0;


        const onKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space" || e.code === "ArrowUp") {
                e.preventDefault();
                // playerY = Math.max(270 - 200, playerY - jumpUp);
                playerVY = -20;
                console.log(playerVY);
                useJumpFrame = true;
                jumpUntil = performance.now() + JUMP_SPRITE_MS;
            }
            if (e.code === "ArrowDown") {
                e.preventDefault();
                playerY = Math.min(270, playerY + jumpUp);
            }
        };

        const onPointerDown = () => {
            if (playerY >= 270) {
                playerVY = -20;
                jumpUntil = performance.now() + JUMP_SPRITE_MS;
            }
        };
        canvas.addEventListener("pointerdown", onPointerDown);

        window.addEventListener("keydown", onKeyDown);

        let rafId = 0;

        bg.onload = () => {
            let last = performance.now();
            let offsetX = 0;
            let bgSpeed = 40;
            let barrierX = 350;
            let barrierSpeed = 300;

            let delta_t = 1;
            let g = 1;

            const scale = h / bg.naturalHeight;
            const bgW = bg.naturalWidth * scale;

            const loop = (now: number) => {
                const isJumpSprite = performance.now() < jumpUntil;
                const dt = Math.min((now - last) / 1000, 0.05);
                last = now;
                offsetX = (offsetX + bgSpeed * dt) % bgW;
                barrierX = (barrierX - barrierSpeed * dt) % bgW;
                const x1 = -offsetX;
                ctx.drawImage(bg, x1, 0, bgW, h);
                ctx.drawImage(bg, x1 + bgW, 0, bgW, h);
                ctx.drawImage(konusImg, barrierX, 330, 60, 75);
                ctx.drawImage(lakeImg, barrierX + 400, 390, 90, 20);
                ctx.drawImage(holeImg, barrierX + 750, 390, 90, 20);
                ctx.drawImage(stopImg, barrierX + 1000, 290, 50, 120);
                
                if (playerY >= 270) {
                    if (Math.floor(now / 80) % 6 === 0) {
                        characterDraw = runImages[0];
                    } else if (Math.floor(now / 80) % 6 === 1) {
                        characterDraw = runImages[1];
                    } else if (Math.floor(now / 80) % 6 === 2) {
                        characterDraw = runImages[2];
                    } else if (Math.floor(now / 80) % 6 === 3) {
                        characterDraw = runImages[3];
                    } else if (Math.floor(now / 80) % 6 === 4) {
                        characterDraw = runImages[4];
                    } else if (Math.floor(now / 80) % 6 === 5) {
                        characterDraw = runImages[5];
                    }
                } else {
                    characterDraw = runImages[6];
                }
                
                
                playerVY += g * delta_t
                playerY += playerVY * delta_t
                
                playerY = Math.min(playerY, 270)
                // if (playerY > 270) {
                    // playerVY = 0;
                // }

                ctx.drawImage(
                        characterDraw,
                        30,
                        playerY,
                        150,
                        150
                    );

                // ctx.drawImage(
                //     characterImg,
                //     48,
                //     playerY,
                //     110,
                //     150
                // );

                rafId = requestAnimationFrame(loop);
            };

            rafId = requestAnimationFrame(loop);
        }
    // return () => {
    //     cancelAnimationFrame(rafId);
    //     window.removeEventListener("keydown", onKeyDown);
    // };
    }, [character]);

    return (
        <div className="flex  items-center justify-center">
            <canvas ref={canvasRef} className="bg-green-500"></canvas>
        </div>
    )
}

export default Game;