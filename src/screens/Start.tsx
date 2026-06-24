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
        <div className="
      flex flex-col justify-between items-center w-full text-center 
      h-screen pt-16 pb-26 px-4
      bg-[url('/bg-phone.png')] bg-cover bg-center bg-no-repeat

      md:h-auto md:min-h-screen  md:bg-[url('/bg-main.png')]
      md:pt-11 md:pb-15 md:px-12
       ">
            <div className="flex flex-col items-center">
                <div className="p-0 text-[18px] md:text-[40px] font-normal">
                    <p className={`${pressStart2P.className} uppercase text-white `}>Игры для взрослых</p>
                    <p className={`${pressStart2P.className} lowercase text-custom-lime`}>пора за руль</p>
                </div>
                <p className="text-cream-text pt-[14px] md:text-[24px] md:pt-[4px] ">Пройди путь до Кибертрака Вектор <br /> и открой скидку до 5000 ₽ на обучение.</p>
            </div>
            <Button onClick={onClick} className="w-full md:w-[268px] md:text-[20px]">Начать игру</Button>
        </div>
    )
}

export default Start;
