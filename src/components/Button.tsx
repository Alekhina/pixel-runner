import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Press_Start_2P } from "next/font/google";

type Props = {
  children: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

const styles = 
    "h-[52px] px-[16px] disabled:bg-brown-shadow uppercase bg-custom-yellow shadow-[inset_4px_4px_0_0_var(--color-light-shadow),inset_-4px_-4px_0_0_var(--color-brown-shadow)] cursor-pointer";

function Button({
  children,
  className = "",
  type = "button",
  ...props
}: Props) {
    return (
        <button type={type} className={`${pressStart2P.className} ${styles} ${className}`.trim()}{...props}>{children}</button>
    )
}

export default Button;