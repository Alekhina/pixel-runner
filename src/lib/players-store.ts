import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

import type { CharacterId } from "@/lib/characters";
import { getDiscount } from "@/lib/discount";
import { normalizePhoneDigits } from "@/lib/form-validation";
import {
  MAX_ATTEMPTS,
  PlayerStoreError,
  type LeadData,
  type Player,
  type PlayersDatabase,
} from "@/lib/player";

const DATA_DIR = path.join(process.cwd(), "data");
const PLAYERS_FILE = path.join(DATA_DIR, "players.json");

const PROMO_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

let writeChain: Promise<void> = Promise.resolve();

function withFileLock<T>(fn: () => Promise<T>): Promise<T> {
  const result = writeChain.then(fn);
  writeChain = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
}

async function ensureDataDir(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
}

async function readPlayers(): Promise<PlayersDatabase> {
  try {
    const raw = await readFile(PLAYERS_FILE, "utf8");
    const parsed = JSON.parse(raw) as PlayersDatabase;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return {};
    }
    throw error;
  }
}

async function writePlayers(data: PlayersDatabase): Promise<void> {
  await ensureDataDir();
  await writeFile(PLAYERS_FILE, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function nowIso(): string {
  return new Date().toISOString();
}

function touch(player: Player): Player {
  return { ...player, updatedAt: nowIso() };
}

function findBySessionId(
  db: PlayersDatabase,
  sessionId: string,
): Player | undefined {
  return Object.values(db).find((player) => player.sessionId === sessionId);
}

function requirePlayerBySessionId(
  db: PlayersDatabase,
  sessionId: string,
): Player {
  const player = findBySessionId(db, sessionId);
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

  return withFileLock(async () => {
    const db = await readPlayers();
    const existing = db[phone];

    if (existing) {
      const updated = touch({
        ...existing,
        firstName: lead.firstName.trim(),
        lastName: lead.lastName.trim(),
        city: lead.city.trim(),
      });
      db[phone] = updated;
      await writePlayers(db);
      return updated;
    }

    const player = createPlayer(phone, lead);
    db[phone] = player;
    await writePlayers(db);
    return player;
  });
}

export async function getPlayerBySessionId(
  sessionId: string,
): Promise<Player | null> {
  const db = await readPlayers();
  return findBySessionId(db, sessionId) ?? null;
}

export async function getPlayerByPhone(
  phoneInput: string,
): Promise<Player | null> {
  const phone = normalizePhoneDigits(phoneInput);
  const db = await readPlayers();
  return db[phone] ?? null;
}

export async function setCharacter(
  sessionId: string,
  character: CharacterId,
): Promise<Player> {
  return withFileLock(async () => {
    const db = await readPlayers();
    const player = requirePlayerBySessionId(db, sessionId);
    const updated = touch({
      ...player,
      character,
      status: "selected_character",
    });
    db[player.phone] = updated;
    await writePlayers(db);
    return updated;
  });
}

export async function startAttempt(sessionId: string): Promise<Player> {
  return withFileLock(async () => {
    const db = await readPlayers();
    const player = requirePlayerBySessionId(db, sessionId);

    if (player.attemptsLeft <= 0) {
      throw new PlayerStoreError("Попытки закончились", "NO_ATTEMPTS_LEFT");
    }

    // Повторный вызов без finish (React Strict Mode, remount) — не списываем попытку снова.
    if (player.status === "started_game") {
      return player;
    }

    const updated = touch({
      ...player,
      attemptsUsed: player.attemptsUsed + 1,
      attemptsLeft: player.attemptsLeft - 1,
      status: "started_game",
    });
    db[player.phone] = updated;
    await writePlayers(db);
    return updated;
  });
}

export async function finishAttempt(
  sessionId: string,
  distanceKm: number,
): Promise<Player> {
  return withFileLock(async () => {
    const db = await readPlayers();
    const player = requirePlayerBySessionId(db, sessionId);

    const km = Math.max(0, Math.floor(distanceKm));
    const discount = getDiscount(km);
    const bestDistanceKm = Math.max(player.bestDistanceKm, km);
    const bestDiscount = Math.max(player.bestDiscount, discount);
    const reachedVictory = km >= 5000;

    const updated = touch({
      ...player,
      bestDistanceKm,
      bestDiscount,
      status: reachedVictory ? "reached_5000_km" : "finished_game",
    });
    db[player.phone] = updated;
    await writePlayers(db);
    return updated;
  });
}

export async function claimDiscount(sessionId: string): Promise<Player> {
  return withFileLock(async () => {
    const db = await readPlayers();
    const player = requirePlayerBySessionId(db, sessionId);

    if (player.bestDiscount <= 0) {
      throw new PlayerStoreError("Скидка ещё не открыта", "NO_DISCOUNT");
    }

    const promoCode = player.promoCode ?? generatePromoCode(player.bestDiscount);
    const updated = touch({
      ...player,
      promoCode,
      status: "claimed_discount",
    });
    db[player.phone] = updated;
    await writePlayers(db);
    return updated;
  });
}
