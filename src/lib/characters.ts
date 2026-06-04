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
