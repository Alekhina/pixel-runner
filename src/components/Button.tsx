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

const disabledShadow =
  "disabled:shadow-[inset_4px_4px_0_0_#BDD3FF33,inset_-4px_-4px_0_0_#464E5D,6px_6px_0_0_black] " +
  "md:disabled:shadow-[inset_4px_4px_0_0_#BDD3FF33,inset_-4px_-4px_0_0_#464E5D,8px_8px_0_0_black]";

const primaryShadow =
  "shadow-[inset_4px_4px_0_0_var(--color-light-shadow),inset_-4px_-4px_0_0_var(--color-brown-shadow),6px_6px_0_0_black] " +
  "md:shadow-[inset_4px_4px_0_0_var(--color-light-shadow),inset_-4px_-4px_0_0_var(--color-brown-shadow),8px_8px_0_0_black] " +
  "active:shadow-[inset_4px_4px_0_0_var(--color-light-shadow),inset_-4px_-4px_0_0_var(--color-brown-shadow),4px_4px_0_0_black] " +
  "md:active:shadow-[inset_4px_4px_0_0_var(--color-light-shadow),inset_-4px_-4px_0_0_var(--color-brown-shadow),6px_6px_0_0_black]";

const secondaryShadow =
  "shadow-[inset_4px_4px_0_0_var(--color-cream-button-light-shadow),inset_-4px_-4px_0_0_var(--color-cream-button-dark-shadow),6px_6px_0_0_black] " +
  "md:shadow-[inset_4px_4px_0_0_var(--color-cream-button-light-shadow),inset_-4px_-4px_0_0_var(--color-cream-button-dark-shadow),8px_8px_0_0_black] " +
  "hover:shadow-[inset_4px_4px_0_0_var(--color-cream-button-light-shadow),inset_-4px_-4px_0_0_var(--color-cream-button-dark-shadow-hover),6px_6px_0_0_black] " +
  "md:hover:shadow-[inset_4px_4px_0_0_var(--color-cream-button-light-shadow),inset_-4px_-4px_0_0_var(--color-cream-button-dark-shadow-hover),8px_8px_0_0_black] " +
  "active:shadow-[inset_4px_4px_0_0_var(--color-cream-button-light-shadow-pressed),inset_-4px_-4px_0_0_var(--color-cream-button-dark-shadow-hover),4px_4px_0_0_black] " +
  "md:active:shadow-[inset_4px_4px_0_0_var(--color-cream-button-light-shadow-pressed),inset_-4px_-4px_0_0_var(--color-cream-button-dark-shadow-hover),6px_6px_0_0_black]";

const styles =
  "h-[48px] md:h-[60px] inline-flex items-center justify-center px-[12px] text-[16px] md:text-[20px] uppercase cursor-pointer border-[4px] border-black disabled:bg-disabled disabled:cursor-not-allowed " +
  "transition-transform duration-300 ease-out " +
  "hover:-translate-y-0.5 active:translate-y-0 disabled:hover:translate-y-0 disabled:active:translate-y-0 ";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-custom-yellow text-black hover:bg-custom-yellow-hover active:bg-custom-yellow-pressed " +
    primaryShadow,
  secondary:
    "bg-cream-text text-black hover:bg-cream-button-hover active:bg-cream-button-pressed " +
    secondaryShadow,
};

function Button({
  children,
  className = "",
  variant = "primary",
  type = "button",
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={`${pressStart2P.className} ${styles} ${variantStyles[variant]} ${disabledShadow} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
