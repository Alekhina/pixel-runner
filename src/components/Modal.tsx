"use client";

import { Press_Start_2P } from "next/font/google";
import { useEffect, type ReactNode } from "react";

const pressStart2P = Press_Start_2P({
    weight: "400",
    subsets: ["latin"],
});

type ModalSize = "default" | "discount" | "gameover";

type Props = {
    open: boolean,
    children: ReactNode,
    title: string,
    onClose: () => void,
    className?: string,
    panelClassName?: string,
    borderClassName?: string,
    borderSrc?: string,
    borderDesktopSrc?: string,
    size?: ModalSize,
    closeOnBackdrop?: boolean,
}

const sizeStyles: Record<ModalSize, { panel: string; border: string; borderSrc: string; borderDesktopSrc: string }> = {
    default: {
        panel: "h-[478px] md:h-[548px] w-[328px] md:w-[588px]",
        border: "h-[478px] md:h-[548px] w-[328px] md:w-[588px]",
        borderSrc: "/modal-border.svg",
        borderDesktopSrc:"/modal-border-desktop.svg",
    },
    discount: {
        panel: "h-[382px] md:h-[477px] w-[328px] md:w-[588px]",
        border: "h-[382px] md:h-[477px] w-[328px] md:w-[588px]",
        borderSrc: "/modal-border-discount.svg",
        borderDesktopSrc:"/modal-border-discount-desktop.svg",
    },
    gameover: {
        panel: "h-[424px] md:h-[508px] w-[328px] md:w-[588px]",
        border: "h-[424px] md:h-[508px] w-[328px] md:w-[588px]",
        borderSrc: "/modal-border-gameover.svg",        
        borderDesktopSrc: "/modal-border-gameover-desktop.svg", 
      },
};

function Modal({
    open,
    onClose,
    title,
    children,
    className = "",
    panelClassName = "",
    borderClassName = "",
    borderSrc,
    borderDesktopSrc,
    size = "default",
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

    const sized = sizeStyles[size];
    const frameSrc = borderSrc ?? sized.borderSrc;
    const desktopSrc = borderDesktopSrc  ?? sized.borderDesktopSrc

    return(
        <>
            <div
                className="absolute left-1/2 top-1/2 z-[5] h-[640px] w-[360px] -translate-x-1/2 -translate-y-1/2 bg-black/40"
                aria-hidden
                onClick={closeOnBackdrop ? onClose : undefined}
            />
            <img
                src={frameSrc}
                alt=""
                aria-hidden
                loading="lazy"
                className={`pointer-events-none absolute left-1/2 top-1/2 z-[7] -translate-x-1/2 -translate-y-1/2 block md:hidden ${sized.border} ${borderClassName}`.trim()}
            />
            <img
                src={desktopSrc}
                alt=""
                aria-hidden
                loading="lazy"
                className={`pointer-events-none absolute left-1/2 top-1/2 z-[7] -translate-x-1/2 -translate-y-1/2 hidden md:block ${sized.border} ${borderClassName}`.trim()}
            />
            <div
                className={`
                absolute left-1/2 top-1/2 z-[6] -translate-x-1/2 -translate-y-1/2
                ${sized.panel}
                overflow-hidden
                bg-black/30 backdrop-blur-md
                rounded-4xl
                p-4 md:p-7
                ${panelClassName}
                ${className}
                `.trim()}
                onClick={(e) => e.stopPropagation()}
            >
                {title && (
                <h2
                    id="modal-title"
                    className={`mb-1 text-center ${pressStart2P.className} uppercase text-[18px] md:text-[32px] text-custom-lime`}
                >
                    {title}
                </h2>
                )}
                <div className="text-[10px] md:text-[24px] leading-relaxed">{children}</div>
            </div>
        </>
    )
}

export default Modal;