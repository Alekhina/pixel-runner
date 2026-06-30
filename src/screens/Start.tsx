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
                    <p className={`${pressStart2P.className} uppercase leading-normal  text-white `}>Игры для взрослых</p>
                    <p className={`${pressStart2P.className} lowercase leading-none text-custom-lime`}>пора за руль</p>
                </div>
                <p className="text-cream-text pt-[19px] md:text-[24px] md:pt-[16px] ">Пройди путь до Кибертрака Вектор <br /> и открой скидку до 5000 ₽ на обучение.</p>
            </div>
            <div className="flex w-full flex-col gap-3 md:grid md:grid-cols-[1fr_auto_1fr] md:items-end md:gap-0">
                <span className={`${pressStart2P.className} hidden md:flex flex-row gap-3 text-cream-text md:justify-self-start text-[16px]`}>
                    <span className="leading-none">3 попытки</span>
                    <img
                        src="./icon-heart.svg"
                        alt=""
                        className="h-[21px] w-[28px]"
                    />
                </span>
                <Button onClick={onClick} className="w-full md:w-[268px] md:justify-self-center">
                    Начать игру
                </Button>
                <div className="hidden md:block" aria-hidden />
            </div>
        </div>
    )
}

export default Start;
