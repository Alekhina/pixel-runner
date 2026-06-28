"use client";

import { Handjet, Press_Start_2P } from "next/font/google";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

const handjet = Handjet({
  subsets: ["latin", "cyrillic"],
  variable: "--font-handjet",
});

type Props = {
  km: number;
  discount: number;
};

const MILESTONE_MESSAGES: Record<number, string> = {
  500: "Старт пройден",
  1000: "Driver Mode загружается",
  1500: "Ты держишь вектор",
  2000: "Серьезная заявка",
  2500: "Половина пути к легенде",
  3000: "Уровень водителя",
  5000: "Кибертрак открыт",
};

function Push({ km, discount }: Props) {
  const message = MILESTONE_MESSAGES[km] ?? "Скидка открыта";

  return (
    <>
      <img 
        src="./popup-border-mobile.svg"
        alt=""
        aria-hidden
        loading="lazy"
        className="block md:hidden pointer-events-none z-[7] absolute top-40 top-1/2 -translate-y-1/2 z-[3] h-[42px] w-[328px]"
      />
      <img 
        src="./popup-border-desktop.svg"
        alt=""
        aria-hidden
        loading="lazy"
        className="hidden md:block pointer-events-none z-[7] absolute top-40 top-1/2 -translate-y-1/2 z-[3] h-[48px] w-[384px]"
      />
      <div className="pointer-events-none flex justify-center items-center absolute top-40 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[328px] h-[42px] md:h-[48px] md:w-[384px] bg-black/20 rounded-2xl backdrop-blur-md text-center">
        <p className={`${handjet.className} text-[16px] md:text-[20px] text-cream-text`}>
          {message}. Скидка <span className="text-custom-yellow">{discount} ₽</span> открыта.
        </p>
      </div>
    </>
  );
}

export default Push;