"use client";

import { Press_Start_2P } from "next/font/google";
import Button from "@/components/Button";

const pressStart2P = Press_Start_2P({
    weight: "400",
    subsets: ["latin"],
});

function Victory() {
    return (
        <>
            <div className="flex justify-between pb-[102px] px-[16px] w-[360px] h-[640px] pt-[62px] mx-auto bg-[url('/bg-victory-mobile.png')] bg-cover bg-center bg-no-repeat flex-col items-center">
                <div className="flex-col gap-1">
                    <h2
                        id="modal-title"
                        className={`mb-1 text-center ${pressStart2P.className} uppercase text-[18px] text-custom-lime`}
                    >Driver Mode: On</h2>
                    <p className="text-[16px] text-center text-cream-text">
                        Ты добрался до Кибертрака Вектор. Скидка 5000 ₽ открыта!
                    </p>
                </div>
                <Button className="mb-2 w-full text-black text-[16px]">Забрать 5000 ₽</Button>
            </div>
        </>

    )
}

export default Victory;