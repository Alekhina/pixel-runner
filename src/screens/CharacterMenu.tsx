"use client"

import React from "react";
// import { CHARACTERS } from "@/lib/characters";
import CharacterSelector from "@/components/CharacterSelector";
import { useState } from "react";
import { CharacterId } from "@/lib/characters";
import Button from "@/components/Button";
import AccentText from "@/components/AccentText";

type Props = {
    value:CharacterId | null,
    onChange: (id: CharacterId  ) => void,
    onClick: () => void,
}

function CharacterMenu({value, onChange, onClick}: Props) {
    // const [character, setCharacter] = useState<CharacterId | null>(null);

    return (
        <div className="flex justify-between min-h-screen w-[360px] h-[640px] mx-auto flex-col bg-[url('/bg-character-mobile.png')] bg-cover bg-center bg-no-repeat items-center pt-[62px] pb-[102px] px-[16px]">
            <div className="flex-col mx-auto text-center gap-[8px]">
                <AccentText className="text-center uppercase text-[18px] text-white font-bold">Кто поведет тебя</AccentText>
                <AccentText className="lowercase text-[18px]"> к Кибертраку?</AccentText>
            </div>
            <CharacterSelector value={value} onChange={onChange}></CharacterSelector>
            <Button disabled={!value} onClick={onClick} className="w-full">На старт</Button>
        </div>
    )
}

export default CharacterMenu;
