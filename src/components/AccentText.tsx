import { Press_Start_2P } from "next/font/google";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

const styles = "text-custom-lime"

function AccentText({children, className}: Props) {
    return (
        <>
            <p className={`${pressStart2P.className} ${styles} ${className}`.trim()}>{children}</p>
        </>
    )
}

export default AccentText;