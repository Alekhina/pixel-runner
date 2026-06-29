export const DEBUG_HITBOXES = true;

export const DISTANCE_GOAL = 5000;

export const MILESTONE_POPUP_MS = 2500;
export const VICTORY_TRANSITION_MS = 1750;

export const GROUND_SNAP_EPS = 15;

/** Сколько ms помнить нажатие прыжка до приземления. */
export const JUMP_BUFFER_MS = 100;

export function isPlayerGrounded(playerY: number, groundY: number): boolean {
  return playerY >= groundY - GROUND_SNAP_EPS;
}

export const CANVAS = { w: 360, h: 640 };

export const CHUNK_WIDTH = 860;
export const MIN_GROUND_GAP = 150;   // подогнать по jump + speed
export const MIN_CHUNK_GAP = 300;    // «пустой» отдых между чанками
export const SPAWN_AHEAD_X = 400;    // спавн за правым краем canvas (360)
export const DESPAWN_BEHIND_X = -120;
export const MIN_PIT_GAP = 320;

export const PLAYER = {
    x: -10,
    drawW: 160,
    drawH: 160,
    groundY: 360,
    hitbox: { insetX: 55, insetY: 20, w: 50, h: 120 },
    jumpVY: -20,
    gravity: 1,
};

export const SPEEDS = {
    bg: 120,
    bgMax: 168,
    obstacles: 450,
    obstaclesMax: 450,
};

export const OBSTACLE_LAYOUT = [
  { kind: "konus" as const, offsetX: 400, y: 330, w: 60, h: 75 },
];

export const INITIAL_BARRIER_X = 350;
