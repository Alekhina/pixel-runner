"use client"

import React from "react";
// import { CHARACTERS } from "@/lib/characters";
import CharacterSelector from "@/components/CharacterSelector";
import { useState } from "react";
import { CharacterId } from "@/lib/characters";
import Button from "@/components/Button";
import AccentText from "@/components/AccentText";

type Props = {
    onClick: () => void,
}

function CharacterMenu({onClick}: Props) {
    const [character, setCharacter] = useState<CharacterId | null>(null);

    return (
        <div className="flex min-h-screen w-[360px] h-[640px] mx-auto flex-col bg-[url('/bg-character-mobile.png')] bg-cover bg-center bg-no-repeat items-center justify-center gap-8 p-6">
            <AccentText className="text-center uppercase text-[18px] text-white font-bold">Кто поведет тебя</AccentText>
            <AccentText className="lowercase text-[18px]"> к Кибертраку?</AccentText>
            <CharacterSelector value={character} onChange={setCharacter}></CharacterSelector>
            <Button disabled={!character} onClick={onClick}>На старт</Button>
        </div>
    )
}

export default CharacterMenu;
