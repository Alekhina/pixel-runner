"use client";

import { Press_Start_2P } from "next/font/google";
import { useEffect, type ReactNode } from "react";

const pressStart2P = Press_Start_2P({
    weight: "400",
    subsets: ["latin"],
});

type Props = {
    open: boolean,
    children: ReactNode,
    title: string,
    onClose: () => void,
    className?: string,
    closeOnBackdrop?: boolean,
}

function Modal({
    open,
    onClose,
    title,
    children,
    className = "",
    closeOnBackdrop = true,
}: Props) {
    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    if (!open) return null;

    return(
        <>
        <img
            src="/modal-border.svg"
            alt=""
            aria-hidden
            loading="lazy"
            className="pointer-events-none absolute left-1/2 top-1/2 z-[3] h-[600px] w-[328px] -translate-x-1/2 -translate-y-1/2"
        />
        <div
            className={`
            w-[328px] h-[480px]
            bg-black/30 backdrop-blur-md   
            rounded-4xl     
            p-4
            ${className}
            `.trim()}
            onClick={(e) => e.stopPropagation()}
        >
            {title && (
            <h2
                id="modal-title"
                className={`mb-4 text-center ${pressStart2P.className} text-[24px] text-custom-lime`}
            >
                {title}
            </h2>
            )}
            <div className="text-[10px] leading-relaxed">{children}</div>
        </div>
        </>
    )
}

export default Modal;