import React from "react";
import { Press_Start_2P } from "next/font/google";
import Button from "@/components/Button";

type Props = {
    onClick: () => void,
}

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

function Start({onClick}: Props) {
    return (
        <div className="flex justify-between pb-[102px] px-[16px] w-[360px] h-[640px] pt-[62px] mx-auto bg-[url('/bg-phone.png')] bg-cover bg-center bg-no-repeat flex-col items-center">
            <div className="">
                <div className="flex-col gap-[8px]">
                    <p className={`${pressStart2P.className} text-center p-0 text-[18px] uppercase text-white font-normal`}>Игры для взрослых</p>
                    <p className={`${pressStart2P.className} text-center p-0 text-[18px] lowercase text-custom-lime font-normal`}>пора за руль</p>
                </div>
                <p className="text-cream-text pt-[14px] text-center">Пройди путь до Кибертрака Вектор и открой скидку до 5000 ₽ на обучение.</p>
            </div>
            <Button onClick={onClick} className="w-full">Начать игру</Button>
        </div>
    )
}

export default Start;
