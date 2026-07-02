"use client";

import dynamic from "next/dynamic";
import CharacterMenu from "@/screens/CharacterMenu";
import type { CharacterId } from "@/lib/characters";
import { CHARACTERS } from "@/lib/characters";
import {
  fetchSession,
  mergeSession,
  type PlayerSessionState,
  updateGame,
} from "@/lib/api-client";
import type { Screen } from "@/lib/screens";
import { Press_Start_2P } from "next/font/google";
import { useCallback, useEffect, useState } from "react";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

const Game = dynamic(() => import("@/screens/Game"), {
  loading: () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      <span
        className={`${pressStart2P.className} text-[16px] uppercase text-cream-text`}
      >
        загрузка...
      </span>
    </div>
  ),
  ssr: false,
});

const Form = dynamic(() => import("@/screens/Form"));
const Victory = dynamic(() => import("@/screens/Victory"));
const Start = dynamic(() => import("@/screens/Start"));

const SESSION_ID_KEY = "pixel-runner.sessionId";
const SCREEN_KEY = "pixel-runner.screen";
const CHARACTER_KEY = "pixel-runner.character";

function isScreen(value: string | null): value is Screen {
  return value === "start"
    || value === "form"
    || value === "character"
    || value === "game"
    || value === "completion"
    || value === "victory";
}

function isCharacter(value: string | null): value is CharacterId {
  return !!value && CHARACTERS.some((item) => item.id === value);
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("start");
  const [character, setCharacter] = useState<CharacterId | null>(null);
  const [session, setSession] = useState<PlayerSessionState | null>(null);
  const [isStartingGame, setIsStartingGame] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);
  const [isHydratingSession, setIsHydratingSession] = useState(true);

  const handleSessionUpdate = useCallback((update: PlayerSessionState) => {
    setSession((current) => mergeSession(current, update));
  }, []);

  const handleLeadSuccess = useCallback((nextSession: PlayerSessionState) => {
    setSession(nextSession);
    setCharacter(nextSession.character);
    setStartError(null);
    setScreen("character");
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function hydrateSession() {
      const storedSessionId = window.localStorage.getItem(SESSION_ID_KEY);
      const storedScreen = window.localStorage.getItem(SCREEN_KEY);
      const storedCharacter = window.localStorage.getItem(CHARACTER_KEY);

      if (!storedSessionId) {
        setIsHydratingSession(false);
        return;
      }

      try {
        const restored = await fetchSession(storedSessionId);
        if (cancelled) return;

        const nextCharacter = restored.character ?? (isCharacter(storedCharacter) ? storedCharacter : null);
        const nextScreen = isScreen(storedScreen) ? storedScreen : "character";

        setSession(restored);
        setCharacter(nextCharacter);
        setStartError(null);

        if ((nextScreen === "game" || nextScreen === "victory") && !nextCharacter) {
          setScreen("character");
        } else {
          setScreen(nextScreen);
        }
      } catch {
        if (cancelled) return;
        window.localStorage.removeItem(SESSION_ID_KEY);
        window.localStorage.removeItem(SCREEN_KEY);
        window.localStorage.removeItem(CHARACTER_KEY);
        setSession(null);
        setCharacter(null);
        setScreen("start");
      } finally {
        if (!cancelled) {
          setIsHydratingSession(false);
        }
      }
    }

    void hydrateSession();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (isHydratingSession) return;

    if (session?.sessionId) {
      window.localStorage.setItem(SESSION_ID_KEY, session.sessionId);
      window.localStorage.setItem(SCREEN_KEY, screen);
      if (character) {
        window.localStorage.setItem(CHARACTER_KEY, character);
      } else {
        window.localStorage.removeItem(CHARACTER_KEY);
      }
      return;
    }

    window.localStorage.removeItem(SESSION_ID_KEY);
    window.localStorage.removeItem(CHARACTER_KEY);
    window.localStorage.setItem(SCREEN_KEY, "start");
  }, [isHydratingSession, session?.sessionId, screen, character]);

  const handleCharacterStart = useCallback(async () => {
    if (!session || !character) return;

    setIsStartingGame(true);
    setStartError(null);

    try {
      const updated = await updateGame({
        sessionId: session.sessionId,
        action: "select_character",
        character,
      });
      handleSessionUpdate(updated);
      setScreen("game");
    } catch (error) {
      setStartError(
        error instanceof Error ? error.message : "Не удалось сохранить персонажа",
      );
    } finally {
      setIsStartingGame(false);
    }
  }, [session, character, handleSessionUpdate]);

  if (isHydratingSession) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <span
          className={`${pressStart2P.className} text-[16px] uppercase text-cream-text`}
        >
          загрузка...
        </span>
      </div>
    );
  }

  return (
    <>
      {(() => {
        switch (screen) {
          case "start":
            return <Start onClick={() => setScreen("form")} />;
          case "form":
            return <Form onSuccess={handleLeadSuccess} />;
          case "character":
            return (
              <>
                <CharacterMenu
                  value={character}
                  onChange={setCharacter}
                  onClick={handleCharacterStart}
                  disabled={isStartingGame}
                />
                {startError ? (
                  <p className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded bg-chili-red px-4 py-2 text-center text-[14px] text-white">
                    {startError}
                  </p>
                ) : null}
              </>
            );
          case "game":
            return session && character ? (
              <Game
                character={character}
                sessionId={session.sessionId}
                attemptsUsed={session.attemptsUsed}
                attemptsLeft={session.attemptsLeft}
                bestDistanceKm={session.bestDistanceKm}
                bestDiscount={session.bestDiscount}
                promoCode={session.promoCode}
                onSessionUpdate={handleSessionUpdate}
                onComplete={(result) => {
                  if (result.reason === "victory") {
                    setScreen("victory");
                  }
                }}
                onGoHome={() => setScreen("start")}
              />
            ) : null;
          case "victory":
            return session ? (
              <Victory
                sessionId={session.sessionId}
                promoCode={session.promoCode}
                bestDiscount={session.bestDiscount}
                onSessionUpdate={handleSessionUpdate}
              />
            ) : null;
          default:
            return null;
        }
      })()}
    </>
  );
}
