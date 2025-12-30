<script>
	import { onMount, onDestroy } from 'svelte';
	import * as skin3d from 'skin3d';
	
	let canvas;
	let viewer;
	let container;
	
	// Available animations
	const animations = {
		idle: new skin3d.IdleAnimation(),
		walk: new skin3d.WalkingAnimation(),
		run: new skin3d.RunningAnimation(),
		fly: new skin3d.FlyingAnimation(),
		wave: new skin3d.WaveAnimation(),
		crouch: new skin3d.CrouchAnimation(),
		hit: new skin3d.HitAnimation(),
	};
	
	onMount(() => {
		if (canvas) {
			viewer = new skin3d.View({
				canvas: canvas,
				width: 500,
				height: 450,
			});
			
			// Set default values
			viewer.fov = 70;
			viewer.zoom = 0.6;
			viewer.globalLight.intensity = 3;
			viewer.cameraLight.intensity = 0.6;
			viewer.autoRotate = false;
			viewer.autoRotateSpeed = 1;
			
			// Enable controls
			viewer.controls.enableRotate = true;
			viewer.controls.enableZoom = true;
			viewer.controls.enablePan = false;
			
			// Set default animation
			viewer.animation = animations.idle;
			viewer.animation.speed = 1;
			
			// Load default skin
			viewer.loadSkin('/img/skins/OSYDIAN_Blossom.png', {
				model: 'auto-detect',
				ers: false,
			});
			
			// Load default cape
			viewer.loadCape('/img/capes/mojang_cape.png', {
				backEquipment: 'cape'
			});
			
			// Set default background
			viewer.background = '#c2b4ff';
			
			// Resize handler
			const resizeObserver = new ResizeObserver(() => {
				if (viewer && container) {
					const rect = container.getBoundingClientRect();
					viewer.width = rect.width;
					viewer.height = rect.height;
				}
			});
			
			if (container) {
				resizeObserver.observe(container);
			}
			
			return () => {
				resizeObserver.disconnect();
				if (viewer) {
					viewer.dispose();
				}
			};
		}
	});
	
	// Expose methods for parent component
	export function loadSkin(url, options) {
		if (viewer) {
			return viewer.loadSkin(url, options);
		}
	}
	
	export function loadCape(url, options) {
		if (viewer) {
			return viewer.loadCape(url, options);
		}
	}
	
	export function loadEars(url, options) {
		if (viewer) {
			return viewer.loadEars(url, options);
		}
	}
	
	export function loadPanorama(url) {
		if (viewer) {
			return viewer.loadPanorama(url);
		}
	}
	
	export function setBackground(background) {
		if (viewer) {
			viewer.background = background;
		}
	}
	
	export function setAnimation(animationType) {
		if (viewer && animations[animationType]) {
			viewer.animation = animations[animationType];
		} else if (viewer) {
			viewer.animation = null;
		}
	}
	
	export function setAnimationSpeed(speed) {
		if (viewer && viewer.animation) {
			viewer.animation.speed = speed;
		}
	}
	
	export function setAnimationPaused(paused) {
		if (viewer && viewer.animation) {
			viewer.animation.paused = paused;
		}
	}
	
	export function setFOV(fov) {
		if (viewer) {
			viewer.fov = fov;
		}
	}
	
	export function setZoom(zoom) {
		if (viewer) {
			viewer.zoom = zoom;
		}
	}
	
	export function setGlobalLight(intensity) {
		if (viewer) {
			viewer.globalLight.intensity = intensity;
		}
	}
	
	export function setCameraLight(intensity) {
		if (viewer) {
			viewer.cameraLight.intensity = intensity;
		}
	}
	
	export function setAutoRotate(enabled, speed = 1) {
		if (viewer) {
			viewer.autoRotate = enabled;
			viewer.autoRotateSpeed = speed;
		}
	}
	
	export function setControls(rotate, zoom, pan) {
		if (viewer) {
			viewer.controls.enableRotate = rotate;
			viewer.controls.enableZoom = zoom;
			viewer.controls.enablePan = pan;
		}
	}
	
	export function setLayerVisibility(part, layer, visible) {
		if (viewer && viewer.playerObject && viewer.playerObject.skin) {
			if (viewer.playerObject.skin[part] && viewer.playerObject.skin[part][layer]) {
				viewer.playerObject.skin[part][layer].visible = visible;
			}
		}
	}
	
	export function setBackEquipment(type) {
		if (viewer && viewer.playerObject) {
			viewer.playerObject.backEquipment = type;
		}
	}
	
	export function setNameTag(text) {
		if (viewer) {
			viewer.nameTag = text || null;
		}
	}
	
	export function reset() {
		if (viewer) {
			viewer.dispose();
			// Reinitialize with defaults
			viewer = new skin3d.View({
				canvas: canvas,
				width: 500,
				height: 450,
			});
			
			// Reset to defaults
			viewer.fov = 70;
			viewer.zoom = 0.6;
			viewer.globalLight.intensity = 3;
			viewer.cameraLight.intensity = 0.6;
			viewer.autoRotate = false;
			viewer.autoRotateSpeed = 1;
			
			viewer.controls.enableRotate = true;
			viewer.controls.enableZoom = true;
			viewer.controls.enablePan = false;
			
			viewer.animation = animations.idle;
			viewer.animation.speed = 1;
			
			viewer.loadSkin('/img/skins/OSYDIAN_Blossom.png', {
				model: 'auto-detect',
				ers: false,
			});
			
			viewer.loadCape('/img/capes/mojang_cape.png', {
				backEquipment: 'cape'
			});
			
			viewer.background = '#c2b4ff';
		}
	}
</script>

<div bind:this={container} class="viewer-container">
	<canvas bind:this={canvas} class="viewer-canvas"></canvas>
</div>

<style>
	.viewer-container {
		position: relative;
		border-radius: 20px;
		overflow: hidden;
		background: var(--background);
	}
	
	.viewer-canvas {
		width: 100%;
		height: 450px !important;
 		display: block;
	}
</style>