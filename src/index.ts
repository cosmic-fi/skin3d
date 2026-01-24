/**
 * @file index.ts
 * @description This file serves as the main entry point for the skin3d library, exporting all necessary classes and functions.
 * @author Cosmic-fi
 * @license MIT
 */

// Export from Model.js
export * from "./Model.js";

// Export from skin3d.js - explicitly export the main Render class
export { Render } from "./skin3d.js";
export * from "./skin3d.js";

// Export from Animation.js - explicitly export all animation classes
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
} from "./Animation.js";
export * from "./Animation.js";

// Export from Nametag.js
export * from "./Nametag.js";
