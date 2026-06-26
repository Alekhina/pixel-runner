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
    <div className="flex flex-col flex-1 gap-[45px] md:gap-[40px] items-center w-full h-screen bg-[url('/bg-character-mobile.png')] md:bg-[url('/bg-character-main.png')] bg-cover bg-center bg-no-repeat items-center pt-[70px] md:pt-[45px] pb-[102px] px-[16px]">
      <div className="flex-col mx-auto text-center gap-[8px] md:gap-[4px]">
        <AccentText className="text-center uppercase text-[18px] md:text-[40px] text-white font-bold">
          Кто поведет тебя
        </AccentText>
        <AccentText className=" text-[18px] md:text-[40px]">
          {" "}
          к Кибертраку?
        </AccentText>
      </div>
      <div className="block md:hidden">
        <CharacterSelector value={value} onChange={onChange} />
      </div>

      <div className="hidden md:block">
        <CharacterSelectorMain value={value} onChange={onChange} />
      </div>

      <Button disabled={!value || disabled} onClick={onClick} className="w-full md:w-[208px]">
        На старт
      </Button>
    </div>
  );
}

export default CharacterMenu;
