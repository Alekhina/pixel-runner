import { DESKTOP_LAYOUT } from "./desktop";
import { MOBILE_LAYOUT } from "./mobile";
import type { GameLayout } from "./types";

export type {
  DrawLayout,
  GameLayout,
  PlayerLayout,
  SpeedLayout,
  WorldLayout,
} from "./types";
export { DESKTOP_LAYOUT } from "./desktop";
export { MOBILE_LAYOUT } from "./mobile";

const DESKTOP_BREAKPOINT_PX = 768;

export function getGameLayout(viewport: {
  w: number;
  h: number;
}): GameLayout {
  if (viewport.w >= DESKTOP_BREAKPOINT_PX) {
    return DESKTOP_LAYOUT;
  }
  return MOBILE_LAYOUT;
}
