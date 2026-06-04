"use client"

import React from "react";
// import { CHARACTERS } from "@/lib/characters";
import CharacterSelector from "@/components/CharacterSelector";
import { useState } from "react";
import { CharacterId } from "@/lib/characters";

type Props = {
    onClick: () => void,
}

function CharacterMenu({onClick}: Props) {
    const [character, setCharacter] = useState<CharacterId | null>(null);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-6">
            <h1 className="text-center text-2xl font-bold">Кто поведет тебя к Кибертраку?</h1>
            <CharacterSelector value={character} onChange={setCharacter}></CharacterSelector>
            <button disabled={!character} onClick={onClick} className="rounded-xl cursor-pointer bg-green-500 hover:bg-green-600 px-8 py-3 text-white disabled:opacity-40">На старт</button>
        </div>
    )
}

export default CharacterMenu;
