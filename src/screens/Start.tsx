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
        <div className="flex px-[16px] w-[360px] h-[640px] pt-[74px] mx-auto bg-[url('/bg-phone.png')] bg-cover bg-center bg-no-repeat flex-col items-center justify-center">
            <h1 className={`${pressStart2P.className} text-center text-[18px] uppercase leading-[40px] text-white font-normal`}>Игры для взрослых</h1>
            <h2 className={`${pressStart2P.className} text-center text-[18px] lowercase leading-[40px] text-custom-lime font-normal`}>пора за руль</h2>
            <h2 className="text-cream-text text-center">Пройди путь до Кибертрака Вектор и открой скидку до 5000 ₽ на обучение.</h2>
            <Button onClick={onClick}>Начать игру</Button>
        </div>
    )
}

export default Start;
