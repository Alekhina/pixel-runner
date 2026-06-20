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
    <div className="pointer-events-none absolute top-[140px] z-40 w-[328px] border-2 border-white bg-black/20 backdrop-blur-md px-4 py-3 text-center">
      <p className={`${handjet.className} text-[16px] text-custom-yellow`}>
        Driver mode загружается.
      </p>
      <p className={`${handjet.className} mt-2 text-[16px] text-white`}>
        Cкидка {discount} ₽ открыта.
      </p>
    </div>
  );
}

export default Push;