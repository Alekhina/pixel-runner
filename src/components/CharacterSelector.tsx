"use client";

import { CHARACTERS } from "@/lib/characters";
import { CharacterId } from "@/lib/characters";

type Props = {
    value: CharacterId | null,
    onChange: (id: CharacterId) => void;
}

function CharacterSelector({  value, onChange  }: Props) {
    const selectedVecta = value === CHARACTERS[0].id;
    const selectedKodik = value === CHARACTERS[1].id;

    return (
        <div role="radiogroup" className="flex gap-[12px]">
            <button role="radio" onClick={() => onChange(CHARACTERS[0].id)} className="flex-col cursor-pointer items-center gap-3 rounded-2xl transition hover:ring-1 hover:ring-red-500 hover:shadow-[0_0_16px_red]" >
                <div className="flex items-center justify-center"><img className="h-[280px] w-[158px]" src={'/vecta-card-modile.png'}></img></div>
            </button>
            <button role="radio" onClick={() => onChange(CHARACTERS[1].id)} className="flex-col cursor-pointer items-center gap-3 rounded-2xl transition hover:ring-1 hover:ring-custom-lime hover:shadow-[0_0_16px_#77FF00]">
                <div className="flex items-center justify-center"><img className="h-[280px] w-[158px]" src={'/kodik-card-mobile.png'}></img></div>
            </button>
        </div>
    )
}

export default CharacterSelector;
