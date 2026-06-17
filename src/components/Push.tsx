"use client";

import { Press_Start_2P } from "next/font/google";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

type Props = {
  km: number;
  discount: number;
};

function Push({ km, discount }: Props) {
  return (
    <div className="pointer-events-none absolute top-[140px] z-40 w-[328px] border-2 border-white bg-black/40 backdrop-blur-md px-4 py-3 text-center">
      <p className={`${pressStart2P.className} text-[14px] text-custom-yellow`}>
        {km} км!
      </p>
      <p className={`${pressStart2P.className} mt-2 text-[10px] text-white`}>
        Открыта скидка {discount} ₽
      </p>
    </div>
  );
}

export default Push;