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
        <div role="radiogroup" className="flex gap-6">
            <button role="radio" onClick={() => onChange(CHARACTERS[0].id)} className="flex-col cursor-pointer items-center gap-3 rounded-2xl transition" >
                <div className="flex h-32 w-32 items-center justify-center"><img className="h-40 hover:h-36" src={'/vecta-card.png'}></img></div>
            </button>
            <button role="radio" onClick={() => onChange(CHARACTERS[1].id)} className="flex-col cursor-pointer items-center gap-3 rounded-2xl transition">
                <div className="flex h-32 w-32 items-center justify-center"><img className="h-40 hover:h-36" src={'/kodik-card.png'}></img></div>
            </button>
        </div>
    )
}

export default CharacterSelector;
