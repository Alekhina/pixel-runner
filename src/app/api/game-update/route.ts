import { NextResponse } from "next/server";

import type { CharacterId } from "@/lib/characters";
import { CHARACTERS } from "@/lib/characters";
import type { Player } from "@/lib/player";
import { PlayerStoreError } from "@/lib/player";
import {
  claimDiscount,
  finishAttempt,
  setCharacter,
  startAttempt,
} from "@/lib/players-store";

const GAME_UPDATE_ACTIONS = [
  "select_character",
  "start_attempt",
  "finish_attempt",
  "claim_discount",
] as const;

type GameUpdateAction = (typeof GAME_UPDATE_ACTIONS)[number];

type GameUpdateBody = {
  sessionId: string;
  action: GameUpdateAction;
  character?: CharacterId;
  distanceKm?: number;
  reason?: "crash" | "victory";
};

function isGameUpdateAction(value: unknown): value is GameUpdateAction {
  return typeof value === "string"
    && GAME_UPDATE_ACTIONS.includes(value as GameUpdateAction);
}

function isCharacterId(value: unknown): value is CharacterId {
  return typeof value === "string"
    && CHARACTERS.some((character) => character.id === value);
}

function parseGameUpdateBody(body: unknown): GameUpdateBody | { error: string } {
  const data = body && typeof body === "object" ? body as Record<string, unknown> : {};

  if (typeof data.sessionId !== "string" || !data.sessionId.trim()) {
    return { error: "sessionId is required" };
  }

  if (!isGameUpdateAction(data.action)) {
    return { error: "Invalid action" };
  }

  const parsed: GameUpdateBody = {
    sessionId: data.sessionId.trim(),
    action: data.action,
  };

  if (data.character !== undefined) {
    if (!isCharacterId(data.character)) {
      return { error: "Invalid character" };
    }
    parsed.character = data.character;
  }

  if (data.distanceKm !== undefined) {
    if (typeof data.distanceKm !== "number" || !Number.isFinite(data.distanceKm) || data.distanceKm < 0) {
      return { error: "Invalid distanceKm" };
    }
    parsed.distanceKm = data.distanceKm;
  }

  if (data.reason !== undefined) {
    if (data.reason !== "crash" && data.reason !== "victory") {
      return { error: "Invalid reason" };
    }
    parsed.reason = data.reason;
  }

  return parsed;
}

function toPlayerResponse(player: Player) {
  return {
    sessionId: player.sessionId,
    attemptsLeft: player.attemptsLeft,
    attemptsUsed: player.attemptsUsed,
    bestDistanceKm: player.bestDistanceKm,
    bestDiscount: player.bestDiscount,
    promoCode: player.promoCode,
    character: player.character,
    status: player.status,
  };
}

function storeErrorStatus(code: string): number {
  switch (code) {
    case "SESSION_NOT_FOUND":
      return 404;
    case "NO_ATTEMPTS_LEFT":
      return 403;
    default:
      return 400;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = parseGameUpdateBody(body);

    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const { sessionId, action, character, distanceKm } = parsed;

    let player: Player;

    switch (action) {
      case "select_character":
        if (!character) {
          return NextResponse.json(
            { error: "character is required for select_character" },
            { status: 400 },
          );
        }
        player = await setCharacter(sessionId, character);
        break;

      case "start_attempt":
        player = await startAttempt(sessionId);
        break;

      case "finish_attempt":
        if (distanceKm === undefined) {
          return NextResponse.json(
            { error: "distanceKm is required for finish_attempt" },
            { status: 400 },
          );
        }
        player = await finishAttempt(sessionId, distanceKm);
        break;

      case "claim_discount":
        player = await claimDiscount(sessionId);
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json(toPlayerResponse(player));
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 },
      );
    }

    if (error instanceof PlayerStoreError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: storeErrorStatus(error.code) },
      );
    }

    console.error("POST /api/game-update failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
