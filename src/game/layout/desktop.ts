import { MOBILE_LAYOUT } from "./mobile";
import type { GameLayout } from "./types";

/** Широкий canvas = viewport; спрайты и физика — как на mobile. */
export function createDesktopLayout(viewport: {
  w: number;
  h: number;
}): GameLayout {
  return {
    ...MOBILE_LAYOUT,
    id: "desktop",
    canvas: { w: viewport.w, h: viewport.h },
  };
}
