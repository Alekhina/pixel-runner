import type { CharacterId } from "@/lib/characters";
import type { LeadFormFields } from "@/lib/form-validation";
import type { GameStatus } from "@/lib/player";

export type PlayerSessionState = {
  sessionId: string;
  attemptsLeft: number;
  attemptsUsed: number;
  bestDistanceKm: number;
  bestDiscount: number;
  promoCode: string | null;
  character: CharacterId | null;
  status?: GameStatus;
  isReturning?: boolean;
};

type LeadResponse = {
  sessionId: string;
  attemptsLeft: number;
  attemptsUsed: number;
  bestDistanceKm: number;
  bestDiscount: number;
  isReturning: boolean;
};

type ApiError = {
  error: string;
  code?: string;
  errors?: Record<string, string>;
};

export type GameUpdatePayload = {
  sessionId: string;
  action: "get_session" | "select_character" | "start_attempt" | "finish_attempt" | "claim_discount";
  character?: CharacterId;
  distanceKm?: number;
  reason?: "crash" | "victory";
};

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    const error = data as ApiError;
    const message = error.error ?? "Request failed";
    const err = new Error(message) as Error & { code?: string; errors?: Record<string, string> };
    err.code = error.code;
    err.errors = error.errors;
    throw err;
  }

  return data as T;
}

export async function submitLead(
  values: LeadFormFields,
): Promise<PlayerSessionState> {
  const response = await fetch("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  const data = await parseResponse<LeadResponse>(response);

  return {
    ...data,
    promoCode: null,
    character: null,
  };
}

export async function updateGame(
  payload: GameUpdatePayload,
): Promise<PlayerSessionState> {
  const response = await fetch("/api/game-update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return parseResponse<PlayerSessionState>(response);
}

export async function fetchSession(
  sessionId: string,
): Promise<PlayerSessionState> {
  return updateGame({
    sessionId,
    action: "get_session",
  });
}

export function mergeSession(
  current: PlayerSessionState | null,
  update: Partial<PlayerSessionState> & { sessionId: string },
): PlayerSessionState {
  return {
    sessionId: update.sessionId,
    attemptsLeft: update.attemptsLeft ?? current?.attemptsLeft ?? 0,
    attemptsUsed: update.attemptsUsed ?? current?.attemptsUsed ?? 0,
    bestDistanceKm: update.bestDistanceKm ?? current?.bestDistanceKm ?? 0,
    bestDiscount: update.bestDiscount ?? current?.bestDiscount ?? 0,
    promoCode: update.promoCode !== undefined ? update.promoCode : (current?.promoCode ?? null),
    character: update.character !== undefined ? update.character : (current?.character ?? null),
    status: update.status ?? current?.status,
    isReturning: update.isReturning ?? current?.isReturning,
  };
}
