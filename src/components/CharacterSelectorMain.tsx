"use client";

import { CHARACTERS } from "@/lib/characters";
import { CharacterId } from "@/lib/characters";

type Props = {
    value: CharacterId | null,
    onChange: (id: CharacterId) => void;
}

const cardClass =
  "h-full max-h-[354px] w-auto max-w-[282px] object-contain transition";

function CharacterSelectorMain({  value, onChange  }: Props) {
    const selectedVecta = value === CHARACTERS[0].id;
    const selectedKodik = value === CHARACTERS[1].id;

    return (
        <div role="radiogroup" className="flex h-full min-h-0 w-full items-center justify-center gap-[24px]">
            <button role="radio" onClick={() => onChange(CHARACTERS[0].id)} className="flex h-full min-h-0 flex-col cursor-pointer items-center justify-center gap-3 rounded-3xl transition hover:shadow-[0_0_16px_red]" >
                <div className="flex h-full min-h-0 items-center justify-center"><img src={'/vecta-card.png'} loading="lazy" className={`${cardClass} ${selectedVecta ? "[filter:drop-shadow(0_0_8px_red)_drop-shadow(0_0_20px_red)]" : "hover:[filter:...]"}`} alt="" /></div>
            </button>
            <button role="radio" onClick={() => onChange(CHARACTERS[1].id)} className="flex h-full min-h-0 flex-col cursor-pointer items-center justify-center gap-3 rounded-3xl transition hover:shadow-[0_0_16px_#77FF00]">
                <div className="flex h-full min-h-0 items-center justify-center"><img src={'/kodik-card.png'} loading="lazy" className={`${cardClass} ${selectedKodik ? "[filter:drop-shadow(0_0_8px_#77FF00)_drop-shadow(0_0_20px_#77FF00)]" : "hover:[filter:...]"}`} alt="" /></div>
            </button>
        </div>
    )
}

export default CharacterSelectorMain;
