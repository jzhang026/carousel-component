import { cubicBezier } from "./cubicBezier";
export const linear = (t) => t;
export const ease = cubicBezier(0.25, 0.1, 0.25, 1);
