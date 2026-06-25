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
            <div className="flex h-screen w-full flex-col items-center mx-auto bg-[url('/bg-victory-mobile.png')] md:bg-[url('/bg-victory-main.png')] bg-cover bg-center bg-no-repeat px-[16px] pb-[102px] pt-[62px] md:pt-[45px]">
                <div className="flex flex-col items-center gap-1">
                    <h2
                        id="modal-title"
                        className={`mb-1 text-center ${pressStart2P.className} uppercase text-[18px] md:text-[40px] text-custom-lime`}
                    >Driver Mode: On</h2>
                    <p className="text-[16px] md:text-[24px] text-center text-cream-text">
                        Ты добрался до Кибертрака Вектор. Скидка 5000 ₽ открыта!
                    </p>
                </div>
                <div className="mt-auto flex w-full md:w-[342px] flex-col gap-5">
                    <div className="block w-full md:hidden">
                        <Promo size="medium" code="VECTOR-5000-ХХХХ" className="mb-0" />
                    </div>
                    <div className="hidden w-full md:block">
                        <Promo size="large" code="VECTOR-5000-ХХХХ" className="mb-0" />
                    </div>
                    <Button className="w-full text-black md:text-[20px]">Забрать 5000 ₽</Button>
                </div>
            </div>
        </>

    )
}
    
export default Victory;