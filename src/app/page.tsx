"use client";

import dynamic from "next/dynamic";
import CharacterMenu from "@/screens/CharacterMenu";
import type { CharacterId } from "@/lib/characters";
import {
  mergeSession,
  type PlayerSessionState,
  updateGame,
} from "@/lib/api-client";
import type { Screen } from "@/lib/screens";
import { useCallback, useState } from "react";

const Game = dynamic(() => import("@/screens/Game"), {
  loading: () => (
    <div className="flex h-[640px] w-[360px] items-center justify-center mx-auto">
      Загрузка…
    </div>
  ),
  ssr: false,
});

const Form = dynamic(() => import("@/screens/Form"));
const Victory = dynamic(() => import("@/screens/Victory"));
const Start = dynamic(() => import("@/screens/Start"));

export default function Home() {
  const [screen, setScreen] = useState<Screen>("start");
  const [character, setCharacter] = useState<CharacterId | null>(null);
  const [session, setSession] = useState<PlayerSessionState | null>(null);
  const [isStartingGame, setIsStartingGame] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);

  const handleSessionUpdate = useCallback((update: PlayerSessionState) => {
    setSession((current) => mergeSession(current, update));
  }, []);

  const handleLeadSuccess = useCallback((nextSession: PlayerSessionState) => {
    setSession(nextSession);
    setCharacter(nextSession.character);
    setStartError(null);
    setScreen("character");
  }, []);

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
