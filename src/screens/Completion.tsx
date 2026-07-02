import { Press_Start_2P } from "next/font/google";
import Button from "@/components/Button";
import ScreenBackground from "@/components/ScreenBackground";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

type Props = {
    onClick: () => void,
}

function Completion({ onClick }: Props) {
    return (
        <div className="relative flex justify-between pb-[102px] px-[16px] h-screen w-full pt-[62px] mx-auto flex-col items-center">
            <ScreenBackground
                mobileSrc="/bg-character-mobile.png"
                desktopSrc="/bg-character-main.png"
            />
            <div className="">
                <div className="flex-col center pt-[150px] gap-[8px]">
                    <p className={`${pressStart2P.className} text-center p-0 text-[18px] md:text-[40px] uppercase text-white font-normal`}>- Are you winning, son?</p>
                    <p className={`${pressStart2P.className} text-center p-0 text-[18px] md:text-[40px] lowercase text-custom-lime font-normal`}>- Noooo...</p>
                </div>
            </div>
            <Button onClick={onClick} className="w-full md:w-[400px]">Пробовать еще!</Button>
        </div>
    )
}

export default Completion;