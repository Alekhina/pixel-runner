"use client";

import { Press_Start_2P } from "next/font/google";
import { useEffect, useRef, type ReactNode } from "react";

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
    const panelRef = useRef<HTMLDivElement | null>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!open) return;

        const panel = panelRef.current;
        if (!panel) return;

        previousFocusRef.current = document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;

        const getFocusableElements = (): HTMLElement[] =>
            Array.from(
                panel.querySelectorAll<HTMLElement>(
                    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
                )
            ).filter((el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true");

        const focusable = getFocusableElements();
        (focusable[0] ?? panel).focus();

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
                return;
            }

            if (e.key !== "Tab") return;

            const items = getFocusableElements();
            if (items.length === 0) {
                e.preventDefault();
                panel.focus();
                return;
            }

            const first = items[0];
            const last = items[items.length - 1];
            const active = document.activeElement as HTMLElement | null;

            if (e.shiftKey) {
                if (active === first || !panel.contains(active)) {
                    e.preventDefault();
                    last.focus();
                }
                return;
            }

            if (active === last || !panel.contains(active)) {
                e.preventDefault();
                first.focus();
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => {
            window.removeEventListener("keydown", onKeyDown);
            previousFocusRef.current?.focus();
        };
    }, [open, onClose]);

    if (!open) return null;

    const sized = sizeStyles[size];
    const frameSrc = borderSrc ?? sized.borderSrc;
    const desktopSrc = borderDesktopSrc  ?? sized.borderDesktopSrc

    return(
        <>
            <div
                className="fixed inset-0 z-[5] bg-black/40"
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
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? "modal-title" : undefined}
                tabIndex={-1}
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
