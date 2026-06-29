import { createDesktopLayout } from "./desktop";
import { createMobileLayout } from "./mobile";
import type { GameLayout } from "./types";

export type {
  DrawLayout,
  GameLayout,
  PlayerLayout,
  SpeedLayout,
  WorldLayout,
} from "./types";
export {
  computeGroundLine,
  computeRoadDrawH,
} from "./obstacle-helpers";
export {
  createDesktopLayout,
  DESKTOP_LAYOUT,
  SCALE,
} from "./desktop";
export { createMobileLayout, GROUND_LINE, MOBILE_LAYOUT } from "./mobile";

const DESKTOP_BREAKPOINT_PX = 768;

export function getGameLayout(viewport: {
  w: number;
  h: number;
}): GameLayout {
  if (viewport.w >= DESKTOP_BREAKPOINT_PX) {
    return createDesktopLayout(viewport);
  }
  return createMobileLayout(viewport);
}
