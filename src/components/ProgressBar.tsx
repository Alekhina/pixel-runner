import { forwardRef, useImperativeHandle, useRef } from "react";

type Props = {
    max?: number,
    className?: string,
}


export type ProgressBarHandle = {
    setValue: (value: number) => void;
};

const ProgressBar = forwardRef<ProgressBarHandle, Props>(function ProgressBar(
    {  max=5000, className="" },
    ref,
) {
    const fillRef = useRef<HTMLDivElement>(null);
    const maxRef = useRef(max);
    maxRef.current = max;

    useImperativeHandle(ref, () => ({
        setValue(value: number) {
            const ratio = Math.min(Math.max(value / maxRef.current, 0), 1);
            if (fillRef.current) {
                fillRef.current.style.width = `${ratio * 100}%`;
            }
        },
    }));

    return (
        <>
            <div className={`h-[10px] w-[200px] bg-white/40 overflow-hidden backdrop-blur-md rounded-full ${className}`.trim()}>
                <div ref={fillRef} className="h-full w-0 rounded-full bg-custom-yellow" />
            </div>
        </>
    );
});


export default ProgressBar;