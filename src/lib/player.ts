import type { CharacterId } from "@/lib/characters";

export const MAX_ATTEMPTS = 3;

export type GameStatus =
  | "left_contacts"
  | "selected_character"
  | "started_game"
  | "finished_game"
  | "claimed_discount"
  | "reached_5000_km";

export type Player = {
  sessionId: string;
  phone: string;
  firstName: string;
  lastName: string;
  city: string;
  attemptsUsed: number;
  attemptsLeft: number;
  bestDistanceKm: number;
  bestDiscount: number;
  promoCode: string | null;
  character: CharacterId | null;
  status: GameStatus;
  createdAt: string;
  updatedAt: string;
};

export type PlayersDatabase = Record<string, Player>;

export type LeadData = {
  firstName: string;
  lastName: string;
  city: string;
};

export class PlayerStoreError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "PlayerStoreError";
    this.code = code;
  }
}
