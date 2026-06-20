"use client";

import { getDiscount } from "@/lib/discount";
import { CharacterId } from "@/lib/characters";
import { RUN_FRAMES } from "@/lib/characters";
import { MILESTONE_POPUP_MS } from "@/game/config";
import { CANVAS, PLAYER, SPEEDS } from "@/game/config";
import { DISTANCE_GOAL } from "@/game/config";
import { DISCOUNT_TIERS } from "@/lib/discount";
import { drawFrame } from "@/game/draw";
import { buildObstacles } from "@/game/state";
import type { GameAssets, GameResult, GameState } from "@/game/types";
import { useRef } from "react";
import { useEffect, useState } from "react";
import { isColliding } from "@/game/collision";
import { Handjet, Press_Start_2P } from "next/font/google";
import ProgressBar, { type ProgressBarHandle } from "@/components/ProgressBar";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Push from "@/components/Push";
import { initObstacleWorld, updateObstacles } from "@/game/update";
import { getObstacleSpeed, getBgSpeed } from "@/game/speeds";

type Props = {
    character: CharacterId,
    onComplete: (result: GameResult) => void,
}

const handjet = Handjet({
  subsets: ["latin", "cyrillic"],
  variable: "--font-handjet",
});

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

function loadImage(src: string): HTMLImageElement {
  const img = new Image();
  img.src = src;
  return img;
}

function Game({ character, onComplete }: Props) {
    const [endResult, setEndResult] = useState<GameResult | null>(null);
    const [milestonePopup, setMilestonePopup] = useState<{
        km: number;
        discount: number;
        } | null>(null);

        const showMilestoneRef = useRef<(km: number) => void>(() => {});

        showMilestoneRef.current = (km: number) => {
        setMilestonePopup({ km, discount: km }); // скидка = порог
        };

        // автоскрытие через 2.5 сек
        useEffect(() => {
        if (!milestonePopup) return;

        const id = window.setTimeout(() => {
            setMilestonePopup(null);
        }, MILESTONE_POPUP_MS);

        return () => clearTimeout(id);
        }, [milestonePopup]);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const distanceRef = useRef<HTMLSpanElement | null>(null);
    const progressRef = useRef<ProgressBarHandle | null>(null);
    const onEndRef = useRef(onComplete);
    onEndRef.current = onComplete;

    useEffect(() => {
        let cancelled = false;
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
        
        const backgrounds = [
            loadImage("/bg-day.png"),
            loadImage("/bg-evening.png"),
            loadImage("/bg-night.png"),
        ]

        const runFrames = RUN_FRAMES[character].map(loadImage);
        
        const assets: GameAssets = {
            backgrounds,
            runFrames,
            obstacles: {
                konus: loadImage("/konus.png"),
                exam: loadImage("/exam.png"),
                lake: loadImage("/lake.png"),
                hole: loadImage("/hole.png"),
                stop: loadImage("/stop.png"),
                repair: loadImage("/repair.png"),
                heap: loadImage("./heap.png"),
            }
        }
        
        let status: GameState["status"] = "playing";
        let playerY = PLAYER.groundY;
        let playerVY = 0;
        let jumpUntil = 0;
        let distance = 0;
        const JUMP_SPRITE_MS = 800;
        const jumpUp = 200;

        const passedMilestones = new Set<number>();
        
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space" || e.code === "ArrowUp") {
                e.preventDefault();
                if (playerY >= PLAYER.groundY) {
                    playerVY = PLAYER.jumpVY;
                    jumpUntil = performance.now() + JUMP_SPRITE_MS;
                }
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

        backgrounds[0].onload = () => {
            let last = performance.now();
            let bgIndex = 0;
            let bgOffset = 0;
            let barrierX = 350;
            let delta_t = 1;
            let g = PLAYER.gravity;
            let obstacleWorld = initObstacleWorld();

            const loop = (now: number) => {
                if (status !== "playing") {
                    return;
                }

                if (cancelled === true) {
                    return;
                }

                const bgSpeed = getBgSpeed(distance);
                const barrierSpeed = getObstacleSpeed(distance);

                const dt = Math.min((now - last) / 1000, 0.05);
                last = now;
                const bg = assets.backgrounds[bgIndex];
                const bgW = bg.naturalWidth * (h / bg.naturalHeight);
                bgOffset += bgSpeed * dt;

                if (bgOffset >= bgW && bgIndex < assets.backgrounds.length - 1) {
                    bgOffset -= bgW;
                    bgIndex += 1;
                }

                const scrollDelta = barrierSpeed * dt;
                obstacleWorld = updateObstacles(obstacleWorld, scrollDelta, distance);
                
                playerVY += g * delta_t;
                playerY += playerVY * delta_t;
                playerY = Math.min(playerY, PLAYER.groundY);

                distance += 0.5;
                const currentKm = Math.floor(distance);
                for (const tier of DISCOUNT_TIERS) {
                    if (currentKm >= tier && !passedMilestones.has(tier)) {
                        passedMilestones.add(tier);
                        showMilestoneRef.current(tier);
                    }
                }

                if (distanceRef.current) {
                    distanceRef.current.textContent = `${Math.floor(distance)}`;
                }
                progressRef.current?.setValue(Math.floor(distance));

                if (distance >= DISTANCE_GOAL) {
                    status = "won";
                    setEndResult({
                        distance: DISTANCE_GOAL,
                        character,
                        reason: "victory",
                    });
                    return;
                }

                const state: GameState ={
                    status,
                    playerY,
                    playerVY,
                    groundY: PLAYER.groundY,
                    obstacles: obstacleWorld.obstacles,
                    distance, 
                    bgIndex,
                    bgOffset,
                }

                if (status === "playing" && isColliding(state)) {
                    status = "crashed";
                    setEndResult({
                        distance: distance,
                        character,
                        reason: "crash",
                    });

                    return;
                }
                
                drawFrame(ctx, state, assets, now);          
                rafId = requestAnimationFrame(loop);
            };

            rafId = requestAnimationFrame(loop);
        };

        return () => {
            cancelled = true;
            cancelAnimationFrame(rafId);
            window.removeEventListener("keydown", onKeyDown);
            canvas.removeEventListener("pointerdown", onPointerDown);
        };
    }, [character]);

    let characterIcon = "./kodik-icon.svg";
    if (character === "vekta") {
        characterIcon = "./vecta-icon.svg"
    }

    return (
        <div className="flex flex-col relative items-center justify-center">
            <img src="./hud-border.svg"
                alt=""
                aria-hidden
                className="pointer-events-none absolute top-5 z-[1]"
            ></img>
            <div id="hud" className="flex flex-col absolute top-[20px] items-center h-[90px] w-[328px] bg-black/20 rounded-2xl backdrop-blur-md justify-center z-[0]">
                <div id="hud-top" className="flex flex-row gap-[16px]">
                    <img 
                        src="./hud-small-border.svg"
                        alt=""
                        aria-hidden
                        className="pointer-events-none absolute top-4 z-[1]"
                    ></img>
                    <div className="h-[32px] w-[32px] bg-black/30 backdrop-blur-md rounded-lg"><img src={characterIcon}></img></div>
                    <div id="progress"  className="flex flex-col relative top-[0px]">
                        <div className={`${pressStart2P.className} relative top-[0px] text-[10px] text-center text-white`}>ПРОБЕГ <span ref={distanceRef} className="text-custom-yellow">0</span>/5000 км</div>
                        <ProgressBar ref={progressRef} max={5000} className="relative top-[0px] mt-2" />
                    </div>
                    <img 
                        src="./hud-small-border.svg"
                        alt=""
                        aria-hidden
                        className="pointer-events-none absolute top-4 left-70 z-[2]"
                    ></img>
                    <div className="flex items-center justify-center h-[32px] w-[32px] bg-black/30 backdrop-blur-md rounded-lg"><img src="./volume.svg" className="h-[16px] w-[16px]"></img></div>
                </div>
                <div id="hud-bottom" className="flex flex-row justify-between gap-[120px]">
                    <div className={`${handjet.className} text-cream-text`}>
                        Попытка 1/3
                    </div>
                    <div className={`${handjet.className} text-cream-text`}>
                        Рекорд
                    </div>
                </div>
            </div>
            {milestonePopup && (
                <Push
                km={milestonePopup.km}
                discount={milestonePopup.discount}
                />
            )}
            <Modal
                open={endResult !== null}
                onClose={() => {}}
                title={endResult?.reason === "victory" ? "Победа!" : "Заезд завершен!"}
                className="absolute b-[130px] z-[2]"
            >
                {endResult && (
                <>
                    <p className="mb-4 text-[16px] text-center text-cream-text">
                        Ты прошел {Math.floor(endResult.distance)} км.
                        {getDiscount(endResult.distance) > 0
                            ? ` Открыта скидка ${getDiscount(endResult.distance)} ₽.`
                            : " Скидка пока не открыта."}
                    </p>
                    <div className="flex justify-between">
                        <p className={`${handjet.className} uppercase text-[24px] text-cream-text`}>Текущая попытка</p>
                        <p className={`${handjet.className} uppercase text-[24px] text-custom-yellow`}>1/3</p>
                    </div>
                    <div className="flex justify-between">
                        <p className={`${handjet.className} uppercase text-[24px] text-cream-text`}>Лучший результат</p>
                        <p className={`${handjet.className} uppercase text-[24px] text-custom-yellow`}>{Math.floor(endResult.distance)} км</p>
                    </div>
                    <div className="flex justify-between">
                        <p className={`${handjet.className} uppercase text-[24px] text-cream-text`}>Доступная скидка</p>
                        <p className={`${handjet.className} uppercase text-[24px] text-custom-yellow`}>{getDiscount(endResult.distance)} ₽</p>
                    </div>
                    <div className="flex justify-between">                
                        <p className={`${handjet.className} uppercase text-[24px] text-cream-text`}>Оставшиеся попытки</p>
                        <p className={`${handjet.className} uppercase text-[24px] text-custom-yellow`}>2</p>
                    </div>
                    <Button className="w-full text-black text-[16px]" onClick={() => {}}>
                        Попробовать еще
                    </Button>
                    <Button className="w-full text-black text-[16px]" onClick={() => {}}>
                        Забрать скидку
                    </Button>
                    <p className="text-cream-text text-[12px]">Условия скидки: 7 дней, не суммируется, один номер - один промокод</p>
                </>
                )}
            </Modal>
            <canvas ref={canvasRef}></canvas>
        </div>
    );
}

export default Game;