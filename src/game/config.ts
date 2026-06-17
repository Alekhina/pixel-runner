export const DEBUG_HITBOXES = true;

export const DISTANCE_GOAL = 5000;

export const MILESTONE_POPUP_MS = 2500;

export const CANVAS = { w: 360, h: 640 };

export const PLAYER = {
    x: 30,
    drawW: 150,
    drawH: 150,
    groundY: 270,
    hitbox: { insetX: 40, insetY: 20, w: 60, h: 110 },
    jumpVY: -20,
    gravity: 1,
};

export const SPEEDS = {
    bg: 40,
    obstacles: 300,
};

export const OBSTACLE_LAYOUT = [
  { kind: "konus" as const, offsetX: 400, y: 330, w: 60, h: 75 },
//   { kind: "lake" as const, offsetX: 400, y: 390, w: 90, h: 20 },
//   { kind: "hole" as const, offsetX: 750, y: 390, w: 90, h: 20 },
//   { kind: "stop" as const, offsetX: 1000, y: 290, w: 50, h: 120 },
];

export const INITIAL_BARRIER_X = 350;
