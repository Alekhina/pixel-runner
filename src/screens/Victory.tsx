"use client";

import { useEffect, useState } from "react";
import Promo from "@/components/Promo";
import { Press_Start_2P } from "next/font/google";
import Button from "@/components/Button";
import { updateGame, type PlayerSessionState } from "@/lib/api-client";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

type Props = {
  sessionId: string;
  promoCode: string | null;
  bestDiscount: number;
  onSessionUpdate: (session: PlayerSessionState) => void;
};

function Victory({
  sessionId,
  promoCode,
  bestDiscount,
  onSessionUpdate,
}: Props) {
  const [displayCode, setDisplayCode] = useState<string | null>(promoCode);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);

  useEffect(() => {
    if (promoCode) {
      setDisplayCode(promoCode);
    }
  }, [promoCode]);

  const handleClaim = async () => {
    if (displayCode && !displayCode.includes("XXXX")) return;

    setIsClaiming(true);
    setClaimError(null);

    try {
      const updated = await updateGame({
        sessionId,
        action: "claim_discount",
      });
      setDisplayCode(updated.promoCode);
      onSessionUpdate(updated);
    } catch (error) {
      setClaimError(
        error instanceof Error ? error.message : "Не удалось получить промокод",
      );
    } finally {
      setIsClaiming(false);
    }
  };

  const promo =
    displayCode && !displayCode.includes("XXXX")
      ? displayCode
      : `VECTOR-${bestDiscount}-XXXX`;

  return (
    <>
      <div className="flex h-screen w-full flex-col items-center mx-auto bg-[url('/bg-victory-mobile.png')] md:bg-[url('/bg-victory-main.png')] bg-cover bg-center bg-no-repeat px-[16px] pb-[102px] md:pb-[100px] pt-[62px] md:pt-[45px]">
        <div className="flex flex-col items-center gap-1">
          <h2
            id="modal-title"
            className={`mb-1 text-center ${pressStart2P.className} uppercase text-[18px] md:text-[40px] text-custom-lime`}
          >
            Driver Mode: On
          </h2>
          <p className="text-[16px] md:text-[24px] text-center text-cream-text max-w-[328px] md:max-w-[428px]">
            Ты добрался до Кибертрака Вектор. Скидка {bestDiscount} ₽ открыта!
          </p>
        </div>
        <div className="mt-auto md:mt-[251px] flex w-full md:w-[342px] flex-col gap-5 md:gap-1">
          <div className="block w-full md:hidden">
            <Promo size="medium" code={promo} className="mb-0" />
          </div>
          <div className="hidden w-full md:block">
            <Promo size="large" code={promo} className="mb-0" />
          </div>
          <Button
            className="w-full text-black md:text-[20px]"
            onClick={handleClaim}
            disabled={isClaiming || Boolean(displayCode && !displayCode.includes("XXXX"))}
          >
            Забрать {bestDiscount} ₽
          </Button>
          {claimError ? (
            <p className="text-center text-[14px] text-chili-red">{claimError}</p>
          ) : null}
        </div>
        <p className="text-[12px] pt-[16px] md:text-[16px] text-center text-cream-text w-full md:max-w-[486px]">
          Скидка действует 7 дней. Не суммируется с другими акциями. Один номер
          — один промокод.
        </p>
      </div>
    </>
  );
}

export default Victory;
