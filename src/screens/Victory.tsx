"use client";

import Promo from "@/components/Promo";
import { Press_Start_2P } from "next/font/google";
import Button from "@/components/Button";

const pressStart2P = Press_Start_2P({
    weight: "400",
    subsets: ["latin"],
});

function Victory() {
    return (
        <>
            <div className="flex h-[640px] w-[360px] flex-col mx-auto bg-[url('/bg-victory-mobile.png')] bg-cover bg-center bg-no-repeat px-[16px] pb-[102px] pt-[62px]">
                <div className="flex flex-col items-center gap-1">
                    <h2
                        id="modal-title"
                        className={`mb-1 text-center ${pressStart2P.className} uppercase text-[18px] text-custom-lime`}
                    >Driver Mode: On</h2>
                    <p className="text-[16px] text-center text-cream-text">
                        Ты добрался до Кибертрака Вектор. Скидка 5000 ₽ открыта!
                    </p>
                </div>
                <div className="mt-auto flex w-full flex-col gap-5">
                    <div className="block w-full md:hidden">
                        <Promo size="medium" code="VECTOR-5000-ХХХХ" className="mb-0" />
                    </div>
                    <div className="hidden w-full md:block">
                        <Promo size="large" code="VECTOR-5000-ХХХХ" className="mb-0" />
                    </div>
                    <Button className="w-full text-black">Забрать 5000 ₽</Button>
                </div>
            </div>
        </>

    )
}
    
export default Victory;