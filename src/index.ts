/**
 * @file index.ts
 * @description This file serves as the main entry point for the skin3d library, exporting all necessary classes and functions.
 * @author Cosmic-fi
 * @license MIT
 */

// Export from model.js
export * from "./model.js";

// Export from skin3d.js - explicitly export the main Render class
export { Render } from "./skin3d.js";
export * from "./skin3d.js";

// Export from animation.js - explicitly export all animation classes
export {
	PlayerAnimation,
	FunctionAnimation,
	IdleAnimation,
	WalkingAnimation,
	RunningAnimation,
	FlyingAnimation,
	WaveAnimation,
	CrouchAnimation,
	HitAnimation
} from "./animation.js";
export * from "./animation.js";

// Export from nametag.js
export * from "./nametag.js";
