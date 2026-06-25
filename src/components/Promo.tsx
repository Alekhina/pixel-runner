"use client";

import CopyButton from "@/components/CopyButton";
import { Handjet, Press_Start_2P } from "next/font/google";

const handjet = Handjet({
  subsets: ["latin", "cyrillic"],
});

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin", "cyrillic"],
});

export type PromoSize = "small" | "medium" | "large";

type Props = {
  code: string;
  size?: PromoSize;
  className?: string;
};

const sizeStyles: Record<PromoSize, { box: string; border: string }> = {
  small: {
    box: "h-[86px] w-full",
    border: "/border-green-promo-small.svg",
  },
  medium: {
    box: "h-[85px] w-full",
    border: "/border-green-promo-medium.svg",
  },
  large: {
    box: "h-[97px] w-full",
    border: "/border-green-promo-large.svg",
  },
};

function Promo({ code, size = "small", className = "" }: Props) {
  const sized = sizeStyles[size];

  return (
    <div
      id="promo"
      className={`relative mb-3 min-w-0 ${sized.box} ${className}`.trim()}
    >
      <div
        className="absolute inset-0 rounded-xl bg-black/10 backdrop-blur-md"
        aria-hidden
      />
      <img
        src={sized.border}
        alt=""
        aria-hidden
        loading="lazy"
        className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
      />
      <div className="relative z-[2] flex h-full flex-col items-center justify-center gap-1 px-3">
        <p
          className={`${pressStart2P.className} uppercase text-[12px] md:text-[15px] text-custom-lime`}
        >
          промокод:
        </p>
        <CopyButton
          value={code}
          textClassName={`${handjet.className} text-[28px] md:text-[36px] leading-none text-cream-text`}
        />
      </div>
    </div>
  );
}

export default Promo;
