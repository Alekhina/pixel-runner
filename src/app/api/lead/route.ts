import { NextResponse } from "next/server";

import {
  validateLeadForm,
  type LeadFormFields,
} from "@/lib/form-validation";
import { PlayerStoreError } from "@/lib/player";
import { getOrCreatePlayer, getPlayerByPhone } from "@/lib/players-store";

function parseLeadBody(body: unknown): LeadFormFields {
  const data = body && typeof body === "object" ? body as Record<string, unknown> : {};

  return {
    firstName: typeof data.firstName === "string" ? data.firstName : "",
    lastName: typeof data.lastName === "string" ? data.lastName : "",
    city: typeof data.city === "string" ? data.city : "",
    phone: typeof data.phone === "string" ? data.phone : "",
    consent: data.consent === true,
    honeypot: typeof data.honeypot === "string" ? data.honeypot : "",
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const values = parseLeadBody(body);
    const errors = validateLeadForm(values);

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: "Validation failed", errors },
        { status: 400 },
      );
    }

    const existing = await getPlayerByPhone(values.phone);
    const player = await getOrCreatePlayer(values.phone, {
      firstName: values.firstName,
      lastName: values.lastName,
      city: values.city,
    });

    return NextResponse.json({
      sessionId: player.sessionId,
      attemptsLeft: player.attemptsLeft,
      attemptsUsed: player.attemptsUsed,
      bestDistanceKm: player.bestDistanceKm,
      bestDiscount: player.bestDiscount,
      isReturning: existing !== null,
    });
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
        { status: 400 },
      );
    }

    console.error("POST /api/lead failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
