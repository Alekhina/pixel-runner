"use client";

import { getDiscount } from "@/lib/discount";
import { CharacterId } from "@/lib/characters";
import { RUN_FRAMES } from "@/lib/characters";
import {
  DISTANCE_GOAL,
  GROUND_SNAP_EPS,
  isPlayerGrounded,
  JUMP_BUFFER_MS,
} from "@/game/config";
import { MILESTONE_POPUP_MS, VICTORY_TRANSITION_MS } from "@/game/config";
import { getGameLayout } from "@/game/layout";
import { DISCOUNT_TIERS } from "@/lib/discount";
import { drawFrame } from "@/game/draw";
import type {
  DrawableImage,
  GameAssets,
  GameResult,
  GameState,
  ObstacleKind,
} from "@/game/types";
import { useRef } from "react";
import {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { isColliding } from "@/game/collision";
import { Handjet, Press_Start_2P } from "next/font/google";
import ProgressBar, { type ProgressBarHandle } from "@/components/ProgressBar";
import Modal from "@/components/Modal";
import Promo from "@/components/Promo";
import Button from "@/components/Button";
import { copyToClipboard } from "@/components/CopyButton";
import Push from "@/components/Push";
import { initObstacleWorld, updateObstacles } from "@/game/update";
import { getObstacleSpeed, getBgSpeed } from "@/game/speeds";
import { updateGame, type PlayerSessionState } from "@/lib/api-client";
import { MAX_ATTEMPTS } from "@/lib/player";

type Props = {
  character: CharacterId;
  sessionId: string;
  attemptsUsed: number;
  attemptsLeft: number;
  bestDistanceKm: number;
  bestDiscount: number;
  promoCode: string | null;
  onSessionUpdate: (session: PlayerSessionState) => void;
  onComplete: (result: GameResult) => void;
  onGoHome: () => void;
};

const handjet = Handjet({
  subsets: ["latin", "cyrillic"],
  variable: "--font-handjet",
});

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

export type MilestoneLayerHandle = {
  show: (km: number) => void;
  hide: () => void;
};

// Изолированный слой попапа чекпоинта: держит собственное состояние и
// перерисовывается сам, не вызывая ре-рендер всего Game (с тяжёлым HUD).
const MilestoneLayer = forwardRef<MilestoneLayerHandle>(
  function MilestoneLayer(_props, ref) {
    const [popup, setPopup] = useState<{ km: number; discount: number } | null>(
      null
    );

    useImperativeHandle(
      ref,
      () => ({
        show: (km: number) => setPopup({ km, discount: km }),
        hide: () => setPopup(null),
      }),
      []
    );

    useEffect(() => {
      if (!popup) return;

      const id = window.setTimeout(() => {
        setPopup(null);
      }, MILESTONE_POPUP_MS);

      return () => clearTimeout(id);
    }, [popup]);

    if (!popup) return null;

    return <Push km={popup.km} discount={popup.discount} />;
  }
);

function loadImage(src: string): HTMLImageElement {
  const img = new Image();
  img.src = src;
  return img;
}

function Game({
  character,
  sessionId,
  attemptsUsed,
  attemptsLeft,
  bestDistanceKm,
  bestDiscount,
  promoCode,
  onSessionUpdate,
  onComplete,
  onGoHome,
}: Props) {
  const [endResult, setEndResult] = useState<GameResult | null>(null);
  const [discountView, setDiscountView] = useState(false);
  const [runKey, setRunKey] = useState(0);
  const [startError, setStartError] = useState<string | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [promoCopied, setPromoCopied] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    attemptsUsed,
    attemptsLeft,
    bestDistanceKm,
    bestDiscount,
    promoCode,
  });
  const milestoneLayerRef = useRef<MilestoneLayerHandle | null>(null);
  const [pendingVictory, setPendingVictory] = useState<GameResult | null>(null);

  useEffect(() => {
    setSessionStats({
      attemptsUsed,
      attemptsLeft,
      bestDistanceKm,
      bestDiscount,
      promoCode,
    });
  }, [attemptsUsed, attemptsLeft, bestDistanceKm, bestDiscount, promoCode]);

  const showMilestoneRef = useRef<(km: number) => void>(() => {});
  showMilestoneRef.current = (km: number) => {
    milestoneLayerRef.current?.show(km);
  };

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!pendingVictory) return;

    const id = window.setTimeout(() => {
      onCompleteRef.current(pendingVictory);
    }, VICTORY_TRANSITION_MS);

    return () => clearTimeout(id);
  }, [pendingVictory]);

  const handleRetry = async () => {
    if (sessionStats.attemptsLeft <= 0) return;

    try {
      await pendingFinishRef.current.catch(() => {});
    } catch {
      // finish failed — still allow retry
    }

    setDiscountView(false);
    milestoneLayerRef.current?.hide();
    setStartError(null);
    setEndResult(null);
    setDistanceHud(0);
    progressRefMobile.current?.setValue(0);
    progressRefDesktop.current?.setValue(0);
    setRunKey((k) => k + 1);
  };

  const applySessionUpdate = (updated: PlayerSessionState) => {
    setSessionStats({
      attemptsUsed: updated.attemptsUsed,
      attemptsLeft: updated.attemptsLeft,
      bestDistanceKm: updated.bestDistanceKm,
      bestDiscount: updated.bestDiscount,
      promoCode: updated.promoCode,
    });
    onSessionUpdate(updated);
  };

  const handleClaimDiscount = async () => {
    setIsClaiming(true);
    try {
      const updated = await updateGame({
        sessionId,
        action: "claim_discount",
      });
      applySessionUpdate(updated);
      setDiscountView(true);
    } catch (error) {
      setStartError(
        error instanceof Error ? error.message : "Не удалось получить промокод"
      );
    } finally {
      setIsClaiming(false);
    }
  };

  const handleTakeDiscount = async () => {
    const code = sessionStats.promoCode;
    if (!code) return;

    const ok = await copyToClipboard(code);
    if (!ok) return;

    setPromoCopied(true);
    window.setTimeout(() => setPromoCopied(false), 2000);
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const distanceRefMobile = useRef<HTMLSpanElement | null>(null);
  const distanceRefDesktop = useRef<HTMLSpanElement | null>(null);
  const discountRefDesktop = useRef<HTMLSpanElement | null>(null);
  const progressRefMobile = useRef<ProgressBarHandle | null>(null);
  const progressRefDesktop = useRef<ProgressBarHandle | null>(null);

  const setDistanceHud = (value: number) => {
    const text = String(value);
    if (distanceRefMobile.current) {
      distanceRefMobile.current.textContent = text;
    }
    if (distanceRefDesktop.current) {
      distanceRefDesktop.current.textContent = text;
    }
    if (discountRefDesktop.current) {
      discountRefDesktop.current.textContent = String(getDiscount(value));
    }
  };
  const activeRunIdRef = useRef(0);
  const pendingFinishRef = useRef<Promise<void>>(Promise.resolve());
  const lastCrashResultRef = useRef<GameResult | null>(null);

  useEffect(() => {
    const runId = ++activeRunIdRef.current;
    let cancelled = false;
    let rafId = 0;
    let cleanup = () => {};

    const finishRunForAttempt = (result: GameResult) => {
      const runIdAtFinish = runId;

      const task = async () => {
        if (result.reason === "crash") {
          lastCrashResultRef.current = result;
          setEndResult(result);
        }

        try {
          const updated = await updateGame({
            sessionId,
            action: "finish_attempt",
            distanceKm: result.distance,
            reason: result.reason,
          });

          applySessionUpdate(updated);

          if (
            result.reason === "victory" &&
            runIdAtFinish === activeRunIdRef.current
          ) {
            setPendingVictory(result);
          }
        } catch (error) {
          if (runIdAtFinish !== activeRunIdRef.current) return;

          setStartError(
            error instanceof Error
              ? error.message
              : "Не удалось сохранить результат",
          );
          if (result.reason === "crash") {
            setEndResult(result);
          }
        }
      };

      pendingFinishRef.current = task();
      return pendingFinishRef.current;
    };

    async function startRun() {
      setStartError(null);

      try {
        await pendingFinishRef.current.catch(() => {});
        const updated = await updateGame({
          sessionId,
          action: "start_attempt",
        });
        if (cancelled) return;
        applySessionUpdate(updated);
      } catch (error) {
        if (cancelled) return;
        setStartError(
          error instanceof Error ? error.message : "Не удалось начать заезд",
        );
        if (lastCrashResultRef.current) {
          setEndResult(lastCrashResultRef.current);
        }
        return;
      }

      if (cancelled || runId !== activeRunIdRef.current) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const layout = getGameLayout({
        w: window.innerWidth,
        h: window.innerHeight,
      });
      const { player } = layout;
      const { w, h } = layout.canvas;
      const dpr = window.devicePixelRatio ?? 1;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);

      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const backgrounds = [
        loadImage("/bg-morning.png"),
        loadImage("/bg-day.png"),
        loadImage("/bg-evening.png"),
        loadImage("/bg-night.png"),
      ];

      const road = loadImage("/road.png");

      const runFrames = RUN_FRAMES[character].map(loadImage);

      const assets: GameAssets = {
        backgrounds,
        runFrames,
        road,
        obstacles: {
          konus: loadImage("/obstacles/konus.png"),
          exam: loadImage("/obstacles/exam.png"),
          lake: loadImage("/obstacles/lake.png"),
          hole: loadImage("/obstacles/hole.png"),
          stop: loadImage("/obstacles/stop.png"),
          repair: loadImage("/obstacles/repair.png"),
          bricks: loadImage("/obstacles/bricks.png"),
          barrier: loadImage("/obstacles/barrier.png"),
          finish_car: loadImage("track/track-1.png"),
        },
      };

      let status: GameState["status"] = "playing";
      let playerY = player.groundY;
      let playerVY = 0;
      let jumpUntil = 0;
      let jumpBufferedUntil = 0;
      let distance = 0;
      const JUMP_SPRITE_MS = 800;

      const passedMilestones = new Set<number>();

      const executeJump = () => {
        playerVY = player.jumpVY;
        jumpUntil = performance.now() + JUMP_SPRITE_MS;
        jumpBufferedUntil = 0;
      };

      const tryJump = () => {
        jumpBufferedUntil = performance.now() + JUMP_BUFFER_MS;
        if (isPlayerGrounded(playerY, player.groundY)) {
          executeJump();
        }
      };

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.code === "Space" || e.code === "ArrowUp") {
          e.preventDefault();
          tryJump();
        }
      };

      const onPointerDown = () => {
        tryJump();
      };

      canvas.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("keydown", onKeyDown);

      const startGameLoop = () => {
        if (cancelled || runId !== activeRunIdRef.current) return;

        lastCrashResultRef.current = null;

        let last = performance.now();
        let bgIndex = 0;
        let bgOffset = 0;
        let roadOffset = 0;
        let obstacleWorld = initObstacleWorld(layout);

        // 60 FPS baseline — physics was originally tuned per-frame at ~60 Hz
        const stepHz = 60;

        const stopLoop = () => {
          cancelAnimationFrame(rafId);
          rafId = 0;
        };

        const loop = (now: number) => {
          if (status !== "playing") {
            return;
          }

          if (cancelled || runId !== activeRunIdRef.current) {
            stopLoop();
            return;
          }

          const bgSpeed = getBgSpeed(distance, layout.speeds);
          const barrierSpeed = getObstacleSpeed(distance, layout.speeds);

          const dt = Math.min((now - last) / 1000, 0.05);
          last = now;
          const step = dt * stepHz;
          const bg = assets.backgrounds[bgIndex];
          const bgW = bg.naturalWidth * (h / bg.naturalHeight);
          bgOffset += bgSpeed * dt;

          if (bgOffset >= bgW && bgIndex < assets.backgrounds.length - 1) {
            bgOffset -= bgW;
            bgIndex += 1;
          }

          const scrollDelta = barrierSpeed * dt;
          roadOffset += scrollDelta;

          obstacleWorld = updateObstacles(
            obstacleWorld,
            scrollDelta,
            distance,
            layout
          );

          playerVY += player.gravity * step;
          playerY += playerVY * step;
          playerY = Math.min(playerY, player.groundY);
          if (player.groundY - playerY <= GROUND_SNAP_EPS) {
            playerY = player.groundY;
            if (playerVY > 0) playerVY = 0;
          }

          if (
            jumpBufferedUntil > 0 &&
            now < jumpBufferedUntil &&
            isPlayerGrounded(playerY, player.groundY)
          ) {
            executeJump();
          }

          distance += 0.5 * step;
          const currentKm = Math.floor(distance);
          for (const tier of DISCOUNT_TIERS) {
            if (currentKm >= tier && !passedMilestones.has(tier)) {
              passedMilestones.add(tier);
              showMilestoneRef.current(tier);
            }
          }

          const distanceValue = Math.floor(distance);
          setDistanceHud(distanceValue);
          progressRefMobile.current?.setValue(distanceValue);
          progressRefDesktop.current?.setValue(distanceValue);


          if (distance >= DISTANCE_GOAL) {
            status = "won";
            stopLoop();
            void finishRunForAttempt({
              distance: DISTANCE_GOAL,
              character,
              reason: "victory",
            });
            return;
          }

          const state: GameState = {
            status,
            playerY,
            playerVY,
            groundY: player.groundY,
            layout,
            obstacles: obstacleWorld.obstacles,
            distance,
            bgIndex,
            bgOffset,
            roadOffset,
          };

          if (status === "playing" && isColliding(state)) {
            status = "crashed";
            stopLoop();
            void finishRunForAttempt({
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

      const prescaleToCanvas = (
        img: HTMLImageElement,
        wCss: number,
        hCss: number,
      ): HTMLCanvasElement => {
        const c = document.createElement("canvas");
        c.width = Math.max(1, Math.round(wCss * dpr));
        c.height = Math.max(1, Math.round(hCss * dpr));
        const cctx = c.getContext("2d");
        if (cctx) {
          cctx.imageSmoothingEnabled = true;
          cctx.imageSmoothingQuality = "high";
          cctx.drawImage(img, 0, 0, c.width, c.height);
        }
        return c;
      };

      const obstacleImages = assets.obstacles as Record<
        ObstacleKind,
        HTMLImageElement
      >;

      const startWithPrescaledAssets = async () => {
        const sources = [road, ...Object.values(obstacleImages)];
        await Promise.all(sources.map((im) => im.decode().catch(() => {})));
        if (cancelled || runId !== activeRunIdRef.current) return;

        const prescaledObstacles = {} as Record<ObstacleKind, DrawableImage>;
        (Object.keys(obstacleImages) as ObstacleKind[]).forEach((kind) => {
          const def = layout.obstacles[kind];
          prescaledObstacles[kind] = prescaleToCanvas(
            obstacleImages[kind],
            def.w,
            def.h,
          );
        });
        assets.obstacles = prescaledObstacles;

        // Road is a wide, soft scrolling texture. Bake it into a capped-size
        // canvas (aspect preserved) so it is never a multi-megapixel texture
        // that the GPU re-uploads mid-run. drawRoad derives on-screen width
        // from the aspect ratio, so capping resolution is visually transparent.
        const roadAspect = road.naturalWidth / road.naturalHeight;
        const roadH = layout.draw.roadDrawH;
        const roadWdisplay = roadH * roadAspect;
        const ROAD_TEX_MAX_W = 2048;
        const roadTexW = Math.min(Math.round(roadWdisplay * dpr), ROAD_TEX_MAX_W);
        const roadTexH = Math.max(1, Math.round(roadTexW / roadAspect));
        const roadCanvas = document.createElement("canvas");
        roadCanvas.width = roadTexW;
        roadCanvas.height = roadTexH;
        const roadCtx = roadCanvas.getContext("2d");
        if (roadCtx) {
          roadCtx.imageSmoothingEnabled = true;
          roadCtx.imageSmoothingQuality = "high";
          roadCtx.drawImage(road, 0, 0, roadTexW, roadTexH);
        }
        assets.road = roadCanvas;

        startGameLoop();
      };

      void startWithPrescaledAssets();

      cleanup = () => {
        cancelled = true;
        cancelAnimationFrame(rafId);
        window.removeEventListener("keydown", onKeyDown);
        canvas.removeEventListener("pointerdown", onPointerDown);
      };
    }

    startRun();

    return () => {
      cleanup();
    };
  }, [character, runKey, sessionId]);

  let characterIcon = "./kodik-icon.svg";
  if (character === "vekta") {
    characterIcon = "./vecta-icon.svg";
  }

  const isEndModalOpen = endResult?.reason === "crash";
  const isExhaustedWithoutDiscount =
    sessionStats.attemptsLeft <= 0 &&
    sessionStats.bestDistanceKm < DISCOUNT_TIERS[0];
  const availableDiscount = endResult ? getDiscount(endResult.distance) : 0;

  return (
    <div className="fixed inset-0 flex h-dvh w-full flex-col items-center justify-center overflow-hidden">
      {!isEndModalOpen && (
        <>
          <div className="block md:hidden">
            <img
              src="./hud-border.svg"
              alt=""
              aria-hidden
              className="pointer-events-none absolute top-5 z-[1] left-1/2 -translate-x-1/2 "
            ></img>
            <div
              id="hud"
              className="flex flex-col absolute top-[20px] items-center h-[90px] w-[328px] bg-black/20 rounded-2xl backdrop-blur-md justify-center z-[0] left-1/2 -translate-x-1/2"
            >
              <div id="hud-top" className="flex flex-row gap-[16px]">
                <img
                  src="./hud-small-border.svg"
                  alt=""
                  aria-hidden
                  className="pointer-events-none absolute top-4 z-[1]"
                ></img>
                <div className="h-[32px] w-[32px] bg-black/30 backdrop-blur-md rounded-lg">
                  <img src={characterIcon}></img>
                </div>
                <div id="progress" className="flex flex-col relative top-[0px]">
                  <div
                    className={`${pressStart2P.className} relative top-[0px] text-[10px] text-center text-white`}
                  >
                    ПРОБЕГ{" "}
                    <span ref={distanceRefMobile} className="text-custom-yellow">
                      0
                    </span>
                    /5000 км
                  </div>
                  <ProgressBar
                    ref={progressRefMobile}
                    max={5000}
                    className="relative top-[0px] mt-2"
                  />
                </div>
                <img
                  src="./hud-small-border.svg"
                  alt=""
                  aria-hidden
                  className="pointer-events-none absolute top-4 left-70 z-[2]"
                ></img>
                <div className="flex items-center justify-center h-[32px] w-[32px] bg-black/30 backdrop-blur-md rounded-lg">
                  <img src="./volume.svg" className="h-[16px] w-[16px]"></img>
                </div>
              </div>
              <div
                id="hud-bottom"
                className="flex flex-row justify-between gap-[120px]"
              >
                <div className={`${handjet.className} text-cream-text`}>
                  Попытка:{" "}
                  <span className={`${pressStart2P.className} text-[10px]`}>
                    {sessionStats.attemptsUsed}/{MAX_ATTEMPTS}
                  </span>
                </div>
                <div className={`${handjet.className} text-cream-text`}>
                  Рекорд:{" "}
                  <span className={`${pressStart2P.className} text-[10px]`}>
                    {Math.floor(sessionStats.bestDistanceKm)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:flex justify-between items-center w-full absolute top-5 px-10">
            <div className="relative h-[82px] w-[82px] shrink-0">
              <img
                src="./hud-small-border.svg"
                alt=""
                aria-hidden
                className="absolute z-[1] inset-0 w-full h-full pointer-events-none"
              />
              <div className="relative w-full h-full flex items-center justify-center bg-black/30 backdrop-blur-md rounded-3xl">
                <img src={characterIcon} className="h-[82px] w-[82px]" alt="" />
              </div>
            </div>

            <div className="flex gap-[24px] items-center">
              <div className="relative w-[136px] h-[82px] shrink-0">
                <img
                  src="./hud-medium-border-desktop.svg"
                  alt=""
                  aria-hidden
                  className="absolute z-[1] inset-0 w-full h-full pointer-events-none"
                />
                <div className="relative w-full h-full flex flex-col  items-center justify-center bg-black/30 backdrop-blur-md rounded-2xl">
                  <div
                    className={`${handjet.className} uppercase text-white text-[16px]`}
                  >
                    Попытка
                  </div>
                  <div
                    className={`${pressStart2P.className} text-[24px] text-white`}
                  >
                    {sessionStats.attemptsUsed}/{MAX_ATTEMPTS}
                  </div>
                </div>
              </div>

              <div className="relative w-[384px] h-[82px] shrink-0">
                <img
                  src="./hud-border-desktop.svg"
                  alt=""
                  aria-hidden
                  className="absolute z-[1] inset-0 w-full h-full pointer-events-none"
                />
                <div className="relative w-full h-full flex flex-col gap-[3px] items-center justify-center bg-black/30 backdrop-blur-md rounded-2xl px-2">
                  <div
                    className={`${pressStart2P.className} relative text-[16px] text-center text-white`}
                  >
                    ПРОБЕГ{" "}
                    <span ref={distanceRefDesktop} className="text-custom-yellow">
                      0
                    </span>
                    /5000 км
                  </div>
                  <ProgressBar
                    ref={progressRefDesktop}
                    max={5000}
                    className="w-[320px] h-[10px] text-[16px] relative mt-2"
                  />
                </div>
              </div>

              <div className="relative w-[136px] h-[82px] shrink-0">
                <img
                  src="./hud-medium-border-desktop.svg"
                  alt=""
                  aria-hidden
                  className="absolute z-[1] inset-0 w-full h-full pointer-events-none"
                />
                <div className="relative w-full h-full flex flex-col gap-[5px] items-center justify-center bg-black/30 backdrop-blur-md rounded-2xl px-2">
                  <div
                    className={`${handjet.className} text-cream-text text-[16px] uppercase  text-center`}
                  >
                    Лучший результат
                  </div>
                  <div
                    className={`${pressStart2P.className} text-[16px] text-white`}
                  >
                    {Math.floor(sessionStats.bestDistanceKm)}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-[82px] w-[82px] shrink-0">
              <img
                src="./hud-small-border-desktop.svg"
                alt=""
                aria-hidden
                className="absolute z-[1] inset-0 w-full h-full pointer-events-none"
              />
              <div className="relative w-full h-full flex items-center justify-center bg-black/20 backdrop-blur-md rounded-2xl">
                <img src="./volume.svg" className="h-[48px] w-[48px]" alt="" />
              </div>
            </div>
          </div>

          <div className="hidden md:flex absolute bottom-9 inset-x-0 justify-between px-20 pointer-events-none z-[2]">
            <span
              className={`${pressStart2P.className} text-[16px] uppercase text-cream-text`}
            >
              цель: 5000 км
            </span>
            <span
              className={`${pressStart2P.className} text-[16px] uppercase text-cream-text`}
            >
              скидка: <span ref={discountRefDesktop}>0</span> ₽
            </span>
          </div>
        </>
      )}
      <MilestoneLayer ref={milestoneLayerRef} />
      {startError && !isEndModalOpen ? (
        <p className="absolute top-[120px] z-10 max-w-[328px] rounded bg-chili-red px-4 py-2 text-center text-[14px] text-white">
          {startError}
        </p>
      ) : null}
      <Modal
        open={isEndModalOpen}
        onClose={() => {}}
        closeOnBackdrop={false}
        size={discountView ? "discount" : "default"}
        title={discountView ? "СКИДКА У ТЕБЯ!" : "Заезд завершен!"}
      >
        {discountView && endResult ? (
          <>
            <p className="mb-4 md:mb-7 text-[16px] leading-[20px] md:text-[24px] md:leading-[32px] text-center text-cream-text">
              Ты открыл промокод на {sessionStats.bestDiscount} ₽.
              <br />
              Скопируй его и используй при записи на обучение.
            </p>
            <Promo
              size="small"
              code={sessionStats.promoCode ?? "VECTOR-XXXX-XXXX"}
              className="md:hidden"
            />
            <Promo
              size="large"
              code={sessionStats.promoCode ?? "VECTOR-XXXX-XXXX"}
              className="hidden md:block md:mx-auto"
            />
            <Button
              className="mb-3 w-full text-black md:mt-3"
              onClick={handleTakeDiscount}
              disabled={!sessionStats.promoCode}
            >
              {promoCopied
                ? "скопировано!"
                : `забрать ${sessionStats.bestDiscount} ₽`}
            </Button>
            <p className="text-cream-text text-[12px] leading-[14px] md:w-[524px] md:text-center md:leading-[20px] md:text-[16px]">
              Скидка действует 7 дней. Не суммируется с другими акциями. Один
              номер — один промокод.
            </p>
          </>
        ) : endResult ? (
          <>
            {isExhaustedWithoutDiscount ? (
              <p className="mb-4 md:mb-5 text-[16px] md:text-[24px] leading-[16px] md:leading-[32px] text-center text-cream-text">
                Ты прошел {Math.floor(endResult.distance)} км.
                <br />
                До скидки не хватило{" "}
                {DISCOUNT_TIERS[0] - Math.floor(endResult.distance)} км.
                <br />
                Попытки закончились.
              </p>
            ) : (
              <>
                <p className="text-[16px] md:text-[24px] leading-[16px] md:leading-[32px] text-center text-cream-text">
                  Ты прошел {Math.floor(endResult.distance)} км.
                </p>
                <p className="mb-4 md:mb-5  leading-[16px] md:leading-[32px] text-[16px] md:text-[24px] text-center text-cream-text">
                  {getDiscount(endResult.distance) > 0
                    ? ` Открыта скидка ${getDiscount(endResult.distance)} ₽.`
                    : " Скидка пока не открыта."}
                </p>
              </>
            )}
            <div className="flex items-end justify-between">
              <p
                className={`${handjet.className} uppercase text-[24px] text-cream-text`}
              >
                Текущая попытка:
              </p>
              <span
                className="mb-3 min-w-1 flex-1 bg-repeat-x text-cream-text"
                style={{
                  height: "2px",
                  backgroundImage:
                    "radial-gradient(circle, currentColor 1px, transparent 1.5px)",
                  backgroundSize: "8px 1px",
                }}
                aria-hidden
              />
              <p
                className={`${handjet.className} uppercase text-[24px] text-custom-yellow`}
              >
                {sessionStats.attemptsUsed}/{MAX_ATTEMPTS}
              </p>
            </div>
            <div className="flex items-end justify-between">
              <p
                className={`${handjet.className} uppercase text-[24px] text-cream-text`}
              >
                Лучший результат:
              </p>
              <span
                className="mb-3 min-w-1 flex-1 bg-repeat-x text-cream-text"
                style={{
                  height: "2px",
                  backgroundImage:
                    "radial-gradient(circle, currentColor 1px, transparent 1.5px)",
                  backgroundSize: "8px 1px",
                }}
                aria-hidden
              />
              <p
                className={`${handjet.className} uppercase text-[24px] text-custom-yellow`}
              >
                {Math.floor(sessionStats.bestDistanceKm)} км
              </p>
            </div>
            <div className="flex items-end justify-between">
              <p
                className={`${handjet.className} uppercase text-[24px] text-cream-text`}
              >
                Доступная скидка:
              </p>
              <span
                className="mb-3 min-w-1 flex-1 bg-repeat-x text-cream-text"
                style={{
                  height: "2px",
                  backgroundImage:
                    "radial-gradient(circle, currentColor 1px, transparent 1.5px)",
                  backgroundSize: "8px 1px",
                }}
                aria-hidden
              />
              <p
                className={`${handjet.className} uppercase text-[24px] text-custom-yellow`}
              >
                {sessionStats.bestDiscount} ₽
              </p>
            </div>
            <div className="flex mb-5 md:mb-3 items-end justify-between">
              <p
                className={`${handjet.className} uppercase text-[24px] text-cream-text`}
              >
                Оставшиеся попытки:
              </p>
              <span
                className="mb-3 min-w-1 flex-1 bg-repeat-x text-cream-text"
                style={{
                  height: "2px",
                  backgroundImage:
                    "radial-gradient(circle, currentColor 1px, transparent 1.5px)",
                  backgroundSize: "8px 1px",
                }}
                aria-hidden
              />
              <p
                className={`${handjet.className} uppercase text-[24px] text-custom-yellow`}
              >
                {sessionStats.attemptsLeft}
              </p>
            </div>
            {isExhaustedWithoutDiscount ? (
              <Button className="mb-3 w-full text-black" onClick={onGoHome}>
                На главную
              </Button>
            ) : (
              <>
                <Button
                  className="mb-2 w-full text-black"
                  onClick={handleRetry}
                  disabled={sessionStats.attemptsLeft <= 0}
                >
                  Новый заезд
                </Button>
                <Button
                  variant="secondary"
                  className="mb-3 w-full text-black"
                  onClick={handleClaimDiscount}
                  disabled={isClaiming || sessionStats.bestDiscount <= 0}
                >
                  Забрать скидку
                </Button>
              </>
            )}
            <p className="text-cream-text leading-[14px] text-[12px] md:w-[524px] md:text-center md:leading-[20px] md:text-[16px]">
              Скидка действует 7 дней. Не суммируется с другими акциями. Один
              номер — один промокод.
            </p>
          </>
        ) : null}
      </Modal>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default Game;
