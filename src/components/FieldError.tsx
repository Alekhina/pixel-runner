import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

function FieldError({ children, className = "" }: Props) {
  return (
    <p
      className={`mt-2 flex items-start gap-1 text-[12px] leading-tight text-chili-red ${className}`.trim()}
    >
      <img
        src="/hint.svg"
        alt=""
        aria-hidden
        loading="lazy"
        className="mt-0.5 h-3 w-3 shrink-0"
      />
      {children}
    </p>
  );
}

export default FieldError;
