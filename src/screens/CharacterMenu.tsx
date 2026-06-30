"use client";

import React from "react";
// import { CHARACTERS } from "@/lib/characters";
import CharacterSelector from "@/components/CharacterSelector";
import CharacterSelectorMain from "@/components/CharacterSelectorMain";
import { useState } from "react";
import { CharacterId } from "@/lib/characters";
import Button from "@/components/Button";
import AccentText from "@/components/AccentText";

type Props = {
  value: CharacterId | null;
  onChange: (id: CharacterId) => void;
  onClick: () => void;
  disabled?: boolean;
};

function CharacterMenu({ value, onChange, onClick, disabled = false }: Props) {
  // const [character, setCharacter] = useState<CharacterId | null>(null);

  return (
    <div className="flex min-h-0 flex-col flex-1 gap-11 md:justify-between items-center w-full h-dvh max-h-dvh overflow-y-auto bg-[url('/bg-character-mobile.png')] md:bg-[url('/bg-character-main.png')] bg-cover bg-center bg-no-repeat pt-[70px] md:pt-[50px]  md:pb-15 px-[16px]">
      <div className="shrink-0 flex flex-col mx-auto text-center">
        <AccentText className="text-center uppercase text-[18px] md:text-[40px] text-white font-bold">
          Кто поведет тебя
        </AccentText>
        <AccentText className=" text-[18px] md:text-[40px]">
          к Кибертраку?
        </AccentText>
      </div>
      <div className="block shrink-0 md:hidden">
        <CharacterSelector value={value} onChange={onChange} />
      </div>

      <div className="hidden md:flex md:min-h-0 md:flex-1 md:w-full md:items-center md:justify-center">
        <CharacterSelectorMain value={value} onChange={onChange} />
      </div>

      <Button disabled={!value || disabled} onClick={onClick} className="w-full  shrink-0 md:w-[215px]">
        На старт
      </Button>
    </div>
  );
}

export default CharacterMenu;
