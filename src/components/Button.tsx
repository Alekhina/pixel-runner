import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Press_Start_2P } from "next/font/google";

type ButtonVariant = "primary" | "secondary";

type Props = {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

const styles = 
    // "h-[52px] px-[16px] hover:bg-custom-yellow-hover active:bg-custom-yellow-pressed disabled:bg-disabled uppercase bg-custom-yellow shadow-[inset_4px_4px_0_0_var(--color-light-shadow),inset_-4px_-4px_0_0_var(--color-brown-shadow),6px_4px_0_0_black] disabled:shadow-[inset_4px_4px_0_0_var(--color-light-grey-shadow),inset_-4px_-4px_0_0_var(--color-grey-shadow),6px_4px_0_0_black] cursor-pointer border-[4px] border-black";
    "h-[52px] px-[16px] uppercase cursor-pointer border-[4px] border-black disabled:bg-disabled disabled:shadow-[inset_4px_4px_0_0_var(--color-light-grey-shadow),inset_-4px_-4px_0_0_var(--color-grey-shadow),6px_4px_0_0_black]";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-custom-yellow text-black hover:bg-custom-yellow-hover active:bg-custom-yellow-pressed shadow-[inset_4px_4px_0_0_var(--color-light-shadow),inset_-4px_-4px_0_0_var(--color-brown-shadow),6px_4px_0_0_black]",
  secondary:
    "bg-cream-text text-black hover:bg-cream-text active:bg-cream-text shadow-[inset_4px_4px_0_0_var(--color-cream-button-light-shadow),inset_-4px_-4px_0_0_var(--color-cream-button-dark-shadow),6px_4px_0_0_black]",
};

function Button({
  children,
  className = "",
  variant = "primary",
  type = "button",
  ...props
}: Props) {
    return (
        <button type={type} className={`${pressStart2P.className} ${styles} ${variantStyles[variant]} ${className}`.trim()}{...props}>{children}</button>
    )
}

export default Button;