"use client";
import { useRef } from "react";
import { useEffect } from "react";

function Game() {
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
        bg.src = "/background.jpg";

        // const characterImg = new Image();
        // characterImg.src = "/characters/vecta.png"; 
        // characterImg.src = "/characters/runner.gif";

        const RUN_FRAMES = [
            "/characters/kodik-1.png",
            "/characters/kodik-2.png",
            "/characters/kodik-3.png",
            "/characters/kodik-4.png",
            "/characters/kodik-5.png",
            "/characters/kodik-6.png",
            "/characters/kodik-7.png",
        ];

        const runImages = RUN_FRAMES.map((src) => {
            const img = new Image();
            img.src = src;
            return img;
        });

        let characterDraw = runImages[0];
        let useJumpFrame = false;
        let jumpUntil = 0; // 0 = не в режиме прыжка
        const JUMP_SPRITE_MS = 800; 

        const konusImg = new Image();
        konusImg.src = '/konus.png';

        let playerY = 270;
        const jumpUp = 80;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space" || e.code === "ArrowUp") {
                e.preventDefault();
                playerY = Math.max(270 - 200, playerY - jumpUp);
                useJumpFrame = true;
                jumpUntil = performance.now() + JUMP_SPRITE_MS;
            }
            if (e.code === "ArrowDown") {
                e.preventDefault();
                playerY = Math.min(270, playerY + jumpUp);
            }
        };

        window.addEventListener("keydown", onKeyDown);

        let rafId = 0;

        bg.onload = () => {
            let last = performance.now();
            let offsetX = 0;
            let bgSpeed = 40;
            let barrierX = 350;
            let barrierSpeed = 150;

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
                ctx.drawImage(konusImg, barrierX, 330, 80, 90);
                ctx.drawImage(konusImg, barrierX + 200, 330, 80, 90);
                ctx.drawImage(konusImg, barrierX + 450, 330, 80, 90);
                ctx.drawImage(konusImg, barrierX + 600, 330, 80, 90);

                // if (!isJumpSprite) {
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
                    // useJumpFrame = false;
                }
            
                if (playerY < 270) {
                    if (playerY < 250) {
                        playerY += 2;
                    } else {
                        playerY += 4;
                    }
                }
                // if (Math.floor(now / 150) % 7 === 0) {
                    
                // } else if (Math.floor(now / 150) % 7 === 1) {
                //     ctx.drawImage(
                //         runImages[1],
                //         48,
                //         playerY,
                //         150,
                //         150
                //     );
                // } else if (Math.floor(now / 150) % 7 === 2) {
                //     ctx.drawImage(
                //         runImages[2],
                //         48,
                //         playerY,
                //         150,
                //         150
                //     );
                // } else if (Math.floor(now / 150) % 7 === 3) {
                //     ctx.drawImage(
                //         runImages[3],
                //         48,
                //         playerY,
                //         150,
                //         150
                //     );
                // } else if (Math.floor(now / 150) % 7 === 4) {
                //     ctx.drawImage(
                //         runImages[4],
                //         48,
                //         playerY,
                //         150,
                //         150
                //     );
                // } else if (Math.floor(now / 150) % 7 === 5) {
                //     ctx.drawImage(
                //         runImages[5],
                //         48,
                //         playerY,
                //         150,
                //         150
                //     );
                // } else if (Math.floor(now / 150) % 7 === 6) {
                //     ctx.drawImage(
                //         runImages[6],
                //         48,
                //         playerY,
                //         150,
                //         150
                //     );
                // }

                ctx.drawImage(
                        characterDraw,
                        48,
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
    }, []);

    return (
        <div className="flex  items-center justify-center">
            <canvas ref={canvasRef} className="bg-green-500"></canvas>
        </div>
    )
}

export default Game;