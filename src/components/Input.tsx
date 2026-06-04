import type { InputHTMLAttributes } from "react";
import { Press_Start_2P } from "next/font/google";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

type InputProps = {
  label?: string;
  className?: string;
  wrapperClassName?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const inputStyles =
  "w-full h-[48px] px-4 box-border " +
  "bg-white/90 text-foreground placeholder:text-foreground/50 " +
  "border-2 border-[var(--color-brown-shadow)] " +
  "outline-none focus:border-custom-lime " +
  "disabled:cursor-not-allowed disabled:opacity-50";

const labelStyles =
  `${pressStart2P.className} text-[12px] uppercase text-[var(--color-cream-text)]`;

function Input({
  label,
  id,
  className = "",
  wrapperClassName = "",
  ...props
}: InputProps) {
  const inputId = id ?? (label ? `input-${label}` : undefined);

  return (
    <div className={`flex w-full flex-col gap-1 ${wrapperClassName}`.trim()}>
      {label ? (
        <label htmlFor={inputId} className={labelStyles}>
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        className={`${pressStart2P.className} ${inputStyles} ${className}`.trim()}
        {...props}
      />
    </div>
  );
}

export default Input;