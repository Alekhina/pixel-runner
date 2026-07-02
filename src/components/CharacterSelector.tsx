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
            <button role="radio" onClick={() => onChange(CHARACTERS[0].id)} className="flex flex-col cursor-pointer items-center gap-3 rounded-2xl transition hover:shadow-[0_0_16px_red]" >
                <div className="flex items-center justify-center">
                    <img
                        src="/vecta-card-modile.png"
                        alt=""
                        loading="lazy"
                        width={158}
                        height={280}
                        className={`h-[280px] w-[158px] transition ${selectedVecta ? "[filter:drop-shadow(0_0_8px_red)_drop-shadow(0_0_20px_red)]" : ""}`}
                    />
                </div>
            </button>
            <button role="radio" onClick={() => onChange(CHARACTERS[1].id)} className="flex flex-col cursor-pointer items-center gap-3 rounded-2xl transition hover:shadow-[0_0_16px_#77FF00]">
                <div className="flex items-center justify-center">
                    <img
                        src="/kodik-card-mobile.png"
                        alt=""
                        loading="lazy"
                        width={158}
                        height={280}
                        className={`h-[280px] w-[158px] transition ${selectedKodik ? "[filter:drop-shadow(0_0_8px_#77FF00)_drop-shadow(0_0_20px_#77FF00)]" : ""}`}
                    />
                </div>
            </button>
        </div>
    )
}

export default CharacterSelector;
