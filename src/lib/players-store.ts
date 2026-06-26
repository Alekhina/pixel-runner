import { randomUUID } from "crypto";

import type { CharacterId } from "@/lib/characters";
import { getDiscount } from "@/lib/discount";
import { normalizePhoneDigits } from "@/lib/form-validation";
import {
  MAX_ATTEMPTS,
  PlayerStoreError,
  type GameStatus,
  type LeadData,
  type Player,
} from "@/lib/player";
import { getSupabase } from "@/lib/supabase-server";

const PROMO_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

type PlayerRow = {
  phone: string;
  session_id: string;
  first_name: string;
  last_name: string;
  city: string;
  attempts_used: number;
  attempts_left: number;
  best_distance_km: number;
  best_discount: number;
  promo_code: string | null;
  character: CharacterId | null;
  status: GameStatus;
  created_at: string;
  updated_at: string;
};

function nowIso(): string {
  return new Date().toISOString();
}

function touch(player: Player): Player {
  return { ...player, updatedAt: nowIso() };
}

function rowToPlayer(row: PlayerRow): Player {
  return {
    sessionId: row.session_id,
    phone: row.phone,
    firstName: row.first_name,
    lastName: row.last_name,
    city: row.city,
    attemptsUsed: row.attempts_used,
    attemptsLeft: row.attempts_left,
    bestDistanceKm: row.best_distance_km,
    bestDiscount: row.best_discount,
    promoCode: row.promo_code,
    character: row.character,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function playerToRow(player: Player): PlayerRow {
  return {
    phone: player.phone,
    session_id: player.sessionId,
    first_name: player.firstName,
    last_name: player.lastName,
    city: player.city,
    attempts_used: player.attemptsUsed,
    attempts_left: player.attemptsLeft,
    best_distance_km: player.bestDistanceKm,
    best_discount: player.bestDiscount,
    promo_code: player.promoCode,
    character: player.character,
    status: player.status,
    created_at: player.createdAt,
    updated_at: player.updatedAt,
  };
}

async function savePlayer(player: Player): Promise<Player> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("players")
    .upsert(playerToRow(player), { onConflict: "phone" });

  if (error) {
    console.error("Supabase savePlayer failed:", error);
    throw new Error(error.message);
  }

  return player;
}

async function requirePlayerBySessionId(sessionId: string): Promise<Player> {
  const player = await getPlayerBySessionId(sessionId);
  if (!player) {
    throw new PlayerStoreError("Сессия не найдена", "SESSION_NOT_FOUND");
  }
  return player;
}

export function generatePromoCode(discount: number): string {
  let suffix = "";
  for (let i = 0; i < 4; i += 1) {
    suffix += PROMO_CHARS[Math.floor(Math.random() * PROMO_CHARS.length)];
  }
  return `VECTOR-${discount}-${suffix}`;
}

function createPlayer(phone: string, lead: LeadData): Player {
  const timestamp = nowIso();
  return {
    sessionId: randomUUID(),
    phone,
    firstName: lead.firstName.trim(),
    lastName: lead.lastName.trim(),
    city: lead.city.trim(),
    attemptsUsed: 0,
    attemptsLeft: MAX_ATTEMPTS,
    bestDistanceKm: 0,
    bestDiscount: 0,
    promoCode: null,
    character: null,
    status: "left_contacts",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export async function getOrCreatePlayer(
  phoneInput: string,
  lead: LeadData,
): Promise<Player> {
  const phone = normalizePhoneDigits(phoneInput);
  const existing = await getPlayerByPhone(phone);

  if (existing) {
    const updated = touch({
      ...existing,
      firstName: lead.firstName.trim(),
      lastName: lead.lastName.trim(),
      city: lead.city.trim(),
    });
    return savePlayer(updated);
  }

  return savePlayer(createPlayer(phone, lead));
}

export async function getPlayerBySessionId(
  sessionId: string,
): Promise<Player | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("session_id", sessionId)
    .maybeSingle();

  if (error) {
    console.error("Supabase getPlayerBySessionId failed:", error);
    throw new Error(error.message);
  }

  return data ? rowToPlayer(data as PlayerRow) : null;
}

export async function getPlayerByPhone(
  phoneInput: string,
): Promise<Player | null> {
  const phone = normalizePhoneDigits(phoneInput);
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("phone", phone)
    .maybeSingle();

  if (error) {
    console.error("Supabase getPlayerByPhone failed:", error);
    throw new Error(error.message);
  }

  return data ? rowToPlayer(data as PlayerRow) : null;
}

export async function setCharacter(
  sessionId: string,
  character: CharacterId,
): Promise<Player> {
  const player = await requirePlayerBySessionId(sessionId);
  return savePlayer(
    touch({
      ...player,
      character,
      status: "selected_character",
    }),
  );
}

export async function startAttempt(sessionId: string): Promise<Player> {
  const player = await requirePlayerBySessionId(sessionId);

  if (player.attemptsLeft <= 0) {
    throw new PlayerStoreError("Попытки закончились", "NO_ATTEMPTS_LEFT");
  }

  if (player.status === "started_game") {
    return player;
  }

  return savePlayer(
    touch({
      ...player,
      attemptsUsed: player.attemptsUsed + 1,
      attemptsLeft: player.attemptsLeft - 1,
      status: "started_game",
    }),
  );
}

export async function finishAttempt(
  sessionId: string,
  distanceKm: number,
): Promise<Player> {
  const player = await requirePlayerBySessionId(sessionId);

  const km = Math.max(0, Math.floor(distanceKm));
  const discount = getDiscount(km);
  const bestDistanceKm = Math.max(player.bestDistanceKm, km);
  const bestDiscount = Math.max(player.bestDiscount, discount);
  const reachedVictory = km >= 5000;

  return savePlayer(
    touch({
      ...player,
      bestDistanceKm,
      bestDiscount,
      status: reachedVictory ? "reached_5000_km" : "finished_game",
    }),
  );
}

export async function claimDiscount(sessionId: string): Promise<Player> {
  const player = await requirePlayerBySessionId(sessionId);

  if (player.bestDiscount <= 0) {
    throw new PlayerStoreError("Скидка ещё не открыта", "NO_DISCOUNT");
  }

  const promoCode = player.promoCode ?? generatePromoCode(player.bestDiscount);

  return savePlayer(
    touch({
      ...player,
      promoCode,
      status: "claimed_discount",
    }),
  );
}
