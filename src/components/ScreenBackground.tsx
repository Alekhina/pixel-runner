import Image from "next/image";

type Props = {
  mobileSrc: string;
  desktopSrc: string;
  priority?: boolean;
  className?: string;
};

export default function ScreenBackground({
  mobileSrc,
  desktopSrc,
  priority = false,
  className = "",
}: Props) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 -z-10 ${className}`.trim()}
      aria-hidden
    >
      <Image
        src={mobileSrc}
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover object-center md:hidden"
      />
      <Image
        src={desktopSrc}
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        className="hidden object-cover object-center md:block"
      />
    </div>
  );
}
