import type { InputHTMLAttributes } from "react";
import { Handjet, Press_Start_2P } from "next/font/google";

const handjet = Handjet({
  subsets: ["latin", "cyrillic"],
  variable: "--font-handjet",
});

// const pressStart2P = Press_Start_2P({
//   weight: "400",
//   subsets: ["latin", "cyrillic"],
// });

type InputProps = {
  label?: string;
  className?: string;
  wrapperClassName?: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const inputStyles =
  "w-full h-[44px] px-4 box-border " +
  "bg-white/90 text-foreground placeholder:text-foreground/50 " +
  "shadow-[inset_4px_4px_0_0_var(--color-inner-shadow-input)] " +
  // "aria-invalid:border-red-500 aria-invalid:focus:border-red-500 " +
  // "shadow-[inset_4px_4px_0_0_var(--color-inner-shadow-input), inset_0_0_0_2px_var(--color-inner-border-input)] " +
  "placeholder:text-foreground/50 " +
  "placeholder:[font-family:var(--font-handjet)] " +
  "placeholder:text-[24px] " +
  "border-2 border-[var(--color-inner-border-input)] " +
  "outline-none focus:border-custom-yellow " +
  "disabled:cursor-not-allowed disabled:opacity-50";

const labelStyles =
      "";
//   `${pressStart2P.className} text-[12px] uppercase text-[var(--color-cream-text)]`;

function Input({
  label,
  id,
  className = "",
  wrapperClassName = "",
  error = "",
  ...props
}: InputProps) {
  const inputId = id ?? (label ? `input-${label}` : undefined);

  return (
    <div className={`flex w-full flex-col ${wrapperClassName}`.trim()}>
      {label ? (
        <label htmlFor={inputId} className={labelStyles}>
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        className={`${handjet.variable} ${inputStyles} ${
          error ? "border-1 border-chili-red focus:border-chili-red" : ""
        } ${className}`.trim()}
        {...props}
      />
      {error ? (
        <p className="text-[12px] leading-tight text-chili-red">{error}</p>
      ) : null}
    </div>
  );
}

export default Input;