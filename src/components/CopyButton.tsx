"use client";

import { useState } from "react";

type Props = {
  value: string;
  className?: string;
  textClassName?: string;
};

function CopyButton({ value, className = "", textClassName = "" }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyToClipboard(value);
    if (!ok) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Скопировано" : "Скопировать промокод"}
      className={`inline-flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 ${className}`.trim()}
    >
      <span className={textClassName}>{value}</span>
      {copied ? (
        <svg
          viewBox="0 0 12 10"
          className="h-5 w-5 shrink-0 text-custom-lime"
          fill="none"
          aria-hidden
        >
          <path
            d="M1 5 L4.5 8.5 L11 1"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        </svg>
      ) : (
        <img
          src="/icon-copy.svg"
          alt=""
          aria-hidden
          loading="lazy"
          className="h-5 w-5 shrink-0"
        />
      )}
    </button>
  );
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export { copyToClipboard };
export default CopyButton;
