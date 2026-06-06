export type CharacterId = "vekta" | "kodik"

export const CHARACTERS = [
    {
        id: "vekta" as const,
        name: "Векта",
        image: "/characters/vecta.png",
    },
    {
        id: "kodik" as const,
        name: "Кодик",
        image: "/characters/kodik.png",
    }
];

export const RUN_FRAMES: Record<CharacterId, string[]> = {
  vekta: [
    "/characters/vecta-1.png",
    "/characters/vecta-2.png",
    "/characters/vecta-3.png",
    "/characters/vecta-4.png",
    "/characters/vecta-5.png",
    "/characters/vecta-6.png",
    "/characters/vecta-7.png",
  ],
  kodik: [
    "/characters/kodik-1.png",
    "/characters/kodik-2.png",
    "/characters/kodik-3.png",
    "/characters/kodik-4.png",
    "/characters/kodik-5.png",
    "/characters/kodik-6.png",
    "/characters/kodik-7.png",
  ],
};
