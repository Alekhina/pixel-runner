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

function Push({ km, discount }: Props) {
  return (
    <>
      <img 
        src="./popup-border-mobile.svg"
        alt=""
        aria-hidden
        loading="lazy"
        className="pointer-events-none z-[7] absolute left-1/2 top-1/2 z-[3] h-[42px] w-[328px] -translate-x-1/2 -translate-y-1/2"
      />
      <div className="pointer-events-none absolute top-[140px] z-40 w-[328px] h-[42px] border-2 border-white bg-black/20 backdrop-blur-md px-4 py-3 text-center">
        <p className={`${handjet.className} text-[16px] text-cream-text`}>
          Driver mode загружается. Cкидка <span className="text-custom-yellow">{discount} ₽</span> открыта.
        </p>
      </div>
    </>
  );
}

export default Push;