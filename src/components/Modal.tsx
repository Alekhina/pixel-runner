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
        <div
            className={`
            w-[328px] h-[480px]
            bg-black/30 backdrop-blur-md        
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
    )
}

export default Modal;