/**
 * @file Animation.ts
 * @description This file defines the PlayerAnimation class and its subclasses for animating PlayerObject instances.
 * @author Cosmic-fi
 * @license MIT
 */

import { PlayerObject } from "./Model.js";

/**
 * Abstract base class for animations that can be played on a PlayerObject.
 */
export abstract class PlayerAnimation {
	/** 
	 * Animation speed multiplier. 
	 * @defaultValue 1.0 
	*/
	speed: number = 1.0;
	
	/** 
	 * Whether the animation is paused. 
	 * @defaultValue false 
	 */
	paused: boolean = false;

	/** Current animation progress. */
	progress: number = 0;

	/** Internal id counter for animations. */
	private currentId: number = 0;
	private progress0: Map<number, number> = new Map();
	private animationObjects: Map<number, (player: PlayerObject, progress: number, currentId: number) => void> =
		new Map();

	/**
	 * Update the animation state.
	 * @param player - The player object.
	 * @param deltaTime - Time elapsed since last call.
	 */
	update(player: PlayerObject, deltaTime: number): void {
		if (this.paused) return;
		const delta = deltaTime * this.speed;
		this.animate(player, delta);
		this.animationObjects.forEach((animation, id) => {
			const progress0 = this.progress0.get(id) as number;
			animation(player, this.progress - progress0, id);
		});
		this.progress += delta;
	}

	/**
	 * Add a new animation function and return its id.
	 * @param fn - Animation function (player, progress, id).
	 * @returns The id of the newly added animation.
	 */
	addAnimation(fn: (player: PlayerObject, progress: number, currentId: number) => void): number {
		const id = this.currentId++;
		this.progress0.set(id, this.progress);
		this.animationObjects.set(id, fn);
		return id;
	}

	/**
	 * Remove an animation by its id.
	 * @param id - The id of the animation to remove.
	 */
	removeAnimation(id: number | undefined): void {
		if (id !== undefined) {
			this.animationObjects.delete(id);
			this.progress0.delete(id);
		}
	}

	/**
	 * Subclasses must implement this to update the player state.
	 * @param player - The player object.
	 * @param delta - Progress difference since last call.
	 */
	protected abstract animate(player: PlayerObject, delta: number): void;
}

/**
 * Animation from a function.
 */
export class FunctionAnimation extends PlayerAnimation {
	fn: (player: PlayerObject, progress: number, delta: number) => void;

	constructor(fn: (player: PlayerObject, progress: number, delta: number) => void) {
		super();
		this.fn = fn;
	}

	/** @inheritdoc */
	protected animate(player: PlayerObject, delta: number): void {
		this.fn(player, this.progress, delta);
	}
}

/**
 * Idle animation (arms and cape sway gently).
 */
export class IdleAnimation extends PlayerAnimation {

	/** @inheritdoc */
	protected animate(player: PlayerObject): void {
		const t = this.progress * 2;
		const basicArmRotationZ = Math.PI * 0.02;
		player.skin.leftArm.rotation.z = Math.cos(t) * 0.03 + basicArmRotationZ;
		player.skin.rightArm.rotation.z = Math.cos(t + Math.PI) * 0.03 - basicArmRotationZ;
		const basicCapeRotationX = Math.PI * 0.06;
		player.cape.rotation.x = Math.sin(t) * 0.01 + basicCapeRotationX;
	}
}

/**
 * Walking animation (arms and legs swing, head bobs).
 */
export class WalkingAnimation extends PlayerAnimation {
	/** 
	 * Whether to shake head when walking. 
	 * @defaultValue true 
	 */
	headBobbing: boolean = true;

	/** @inheritdoc */
	protected animate(player: PlayerObject): void {
		const t = this.progress * 8;
		player.skin.leftLeg.rotation.x = Math.sin(t) * 0.5;
		player.skin.rightLeg.rotation.x = Math.sin(t + Math.PI) * 0.5;
		player.skin.leftArm.rotation.x = Math.sin(t + Math.PI) * 0.5;
		player.skin.rightArm.rotation.x = Math.sin(t) * 0.5;
		const basicArmRotationZ = Math.PI * 0.02;
		player.skin.leftArm.rotation.z = Math.cos(t) * 0.03 + basicArmRotationZ;
		player.skin.rightArm.rotation.z = Math.cos(t + Math.PI) * 0.03 - basicArmRotationZ;

		if (this.headBobbing) {
			player.skin.head.rotation.y = Math.sin(t / 4) * 0.2;
			player.skin.head.rotation.x = Math.sin(t / 5) * 0.1;
		} else {
			player.skin.head.rotation.y = 0;
			player.skin.head.rotation.x = 0;
		}

		const basicCapeRotationX = Math.PI * 0.06;
		player.cape.rotation.x = Math.sin(t / 1.5) * 0.06 + basicCapeRotationX;
	}
}

/**
 * Running animation (faster, more exaggerated swing).
 */
export class RunningAnimation extends PlayerAnimation {
	/** @inheritdoc */
	protected animate(player: PlayerObject): void {
		const t = this.progress * 15 + Math.PI * 0.5;
		player.skin.leftLeg.rotation.x = Math.cos(t + Math.PI) * 1.3;
		player.skin.rightLeg.rotation.x = Math.cos(t) * 1.3;
		player.skin.leftArm.rotation.x = Math.cos(t) * 1.5;
		player.skin.rightArm.rotation.x = Math.cos(t + Math.PI) * 1.5;
		const basicArmRotationZ = Math.PI * 0.1;
		player.skin.leftArm.rotation.z = Math.cos(t) * 0.1 + basicArmRotationZ;
		player.skin.rightArm.rotation.z = Math.cos(t + Math.PI) * 0.1 - basicArmRotationZ;
		player.position.y = Math.cos(t * 2);
		player.position.x = Math.cos(t) * 0.15;
		player.rotation.z = Math.cos(t + Math.PI) * 0.01;
		const basicCapeRotationX = Math.PI * 0.3;
		player.cape.rotation.x = Math.sin(t * 2) * 0.1 + basicCapeRotationX;
	}
}

/**
 * Clamps a number between a minimum and maximum value.
 * @param num - The number to clamp.
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @returns The clamped number.
 */
function clamp(num: number, min: number, max: number): number {
	return num <= min ? min : num >= max ? max : num;
}

/**
 * Flying animation (body rotates, elytra wings expand).
 */
export class FlyingAnimation extends PlayerAnimation {
	/** @inheritdoc */
	protected animate(player: PlayerObject): void {
		const t = this.progress > 0 ? this.progress * 20 : 0;
		const startProgress = clamp((t * t) / 100, 0, 1);

		player.rotation.x = (startProgress * Math.PI) / 2;
		player.skin.head.rotation.x = startProgress > 0.5 ? Math.PI / 4 - player.rotation.x : 0;

		const basicArmRotationZ = Math.PI * 0.25 * startProgress;
		player.skin.leftArm.rotation.z = basicArmRotationZ;
		player.skin.rightArm.rotation.z = -basicArmRotationZ;

		const elytraRotationX = 0.34906584;
		const elytraRotationZ = Math.PI / 2;
		const interpolation = Math.pow(0.9, t);
		player.elytra.leftWing.rotation.x = elytraRotationX + interpolation * (0.2617994 - elytraRotationX);
		player.elytra.leftWing.rotation.z = elytraRotationZ + interpolation * (0.2617994 - elytraRotationZ);
		player.elytra.updateRightWing();
	}
}

/**
 * Waving animation (one arm waves).
 */
export class WaveAnimation extends PlayerAnimation {
	/** 
	 * Which arm to wave. 
	 * defaultValue "left" 
	*/
	whichArm: "left" | "right";

	constructor(whichArm: "left" | "right" = "left") {
		super();
		this.whichArm = whichArm;
	}

	/** @inheritdoc */
	protected animate(player: PlayerObject): void {
		const t = this.progress * Math.PI;
		const targetArm = this.whichArm === "left" ? player.skin.leftArm : player.skin.rightArm;
		targetArm.rotation.x = 180;
		targetArm.rotation.z = Math.sin(t) * 0.5;
	}
}

/**
 * Crouch animation (body and limbs move to crouch pose).
 */
export class CrouchAnimation extends PlayerAnimation {
	/** 
	 * Show progress of animation. 
	 * @defaultValue false 
	 */
	showProgress: boolean = false;

	/** 
	 * Run this animation once. 
	 * @defaultValue false 
	 */
	runOnce: boolean = false;

	private isRunningHitAnimation: boolean = false;
	private hitAnimationSpeed: number = 1;
	private erp: number = 0; // Elytra rotate progress
	private isCrouched: boolean | undefined;

	/**
	 * Add the hit animation.
	 * @param speed - Speed of hit animation (default: same as crouch speed).
	 */
	addHitAnimation(speed: number = this.speed): void {
		this.isRunningHitAnimation = true;
		this.hitAnimationSpeed = speed;
	}

	/** @inheritdoc */
	protected animate(player: PlayerObject): void {
		let pr = this.progress * 8;
		if (pr === 0) this.isCrouched = undefined;
		if (this.runOnce) pr = clamp(pr, -1, 1);
		if (!this.showProgress) pr = Math.floor(pr);

		const sinVal = Math.abs(Math.sin((pr * Math.PI) / 2));
		player.skin.body.rotation.x = 0.4537860552 * sinVal;
		player.skin.body.position.z = 1.3256181 * sinVal - 3.4500310377 * sinVal;
		player.skin.body.position.y = -6 - 2.103677462 * sinVal;
		player.cape.position.y = 8 - 1.851236166577372 * sinVal;
		player.cape.rotation.x = (10.8 * Math.PI) / 180 + 0.294220265771 * sinVal;
		player.cape.position.z = -2 + 3.786619432 * sinVal - 3.4500310377 * sinVal;
		player.elytra.position.x = player.cape.position.x;
		player.elytra.position.y = player.cape.position.y;
		player.elytra.position.z = player.cape.position.z;
		player.elytra.rotation.x = player.cape.rotation.x - (10.8 * Math.PI) / 180;

		const pr1 = this.progress / this.speed;
		if (sinVal === 1) {
			this.erp = !this.isCrouched ? pr1 : this.erp;
			this.isCrouched = true;
			player.elytra.leftWing.rotation.z =
				0.26179944 + 0.4582006 * Math.abs(Math.sin((Math.min(pr1 - this.erp, 1) * Math.PI) / 2));
			player.elytra.updateRightWing();
		} else if (this.isCrouched !== undefined) {
			this.erp = this.isCrouched ? pr1 : this.erp;
			player.elytra.leftWing.rotation.z =
				0.72 - 0.4582006 * Math.abs(Math.sin((Math.min(pr1 - this.erp, 1) * Math.PI) / 2));
			player.elytra.updateRightWing();
			this.isCrouched = false;
		}

		player.skin.head.position.y = -3.618325234674 * sinVal;
		player.skin.leftArm.position.z = 3.618325234674 * sinVal - 3.4500310377 * sinVal;
		player.skin.rightArm.position.z = player.skin.leftArm.position.z;
		player.skin.leftArm.rotation.x = 0.410367746202 * sinVal;
		player.skin.rightArm.rotation.x = player.skin.leftArm.rotation.x;
		player.skin.leftArm.rotation.z = 0.1;
		player.skin.rightArm.rotation.z = -player.skin.leftArm.rotation.z;
		player.skin.leftArm.position.y = -2 - 2.53943318 * sinVal;
		player.skin.rightArm.position.y = player.skin.leftArm.position.y;
		player.skin.rightLeg.position.z = -3.4500310377 * sinVal;
		player.skin.leftLeg.position.z = player.skin.rightLeg.position.z;

		if (this.isRunningHitAnimation) {
			const pr2 = this.progress;
			let t = (this.progress * 18 * this.hitAnimationSpeed) / this.speed;
			if (this.speed === 0) t = 0;
			const isCrouching = Math.abs(Math.sin((pr2 * Math.PI) / 2)) === 1;
			player.skin.rightArm.rotation.x =
				-0.4537860552 + 2 * Math.sin(t + Math.PI) * 0.3 - (isCrouching ? 0.4537860552 : 0);
			const basicArmRotationZ = 0.01 * Math.PI + 0.06;
			player.skin.rightArm.rotation.z = -Math.cos(t) * 0.403 + basicArmRotationZ;
			player.skin.body.rotation.y = -Math.cos(t) * 0.06;
			player.skin.leftArm.rotation.x = Math.sin(t + Math.PI) * 0.077 + (isCrouching ? 0.47 : 0);
			player.skin.leftArm.rotation.z = -Math.cos(t) * 0.015 + 0.13 - (!isCrouching ? 0.05 : 0);
			if (!isCrouching) {
				player.skin.leftArm.position.z = Math.cos(t) * 0.3;
				player.skin.leftArm.position.x = 5 - Math.cos(t) * 0.05;
			}
		}
	}
}

/**
 * Hit animation (right arm swings).
 */
export class HitAnimation extends PlayerAnimation {
	/** @inheritdoc */
	protected animate(player: PlayerObject): void {
		const t = this.progress * 18;
		player.skin.rightArm.rotation.x = -0.4537860552 * 2 + 2 * Math.sin(t + Math.PI) * 0.3;
		const basicArmRotationZ = 0.01 * Math.PI + 0.06;
		player.skin.rightArm.rotation.z = -Math.cos(t) * 0.403 + basicArmRotationZ;
		player.skin.body.rotation.y = -Math.cos(t) * 0.06;
		player.skin.leftArm.rotation.x = Math.sin(t + Math.PI) * 0.077;
		player.skin.leftArm.rotation.z = -Math.cos(t) * 0.015 + 0.13 - 0.05;
		player.skin.leftArm.position.z = Math.cos(t) * 0.3;
		player.skin.leftArm.position.x = 5 - Math.cos(t) * 0.05;
	}
}
