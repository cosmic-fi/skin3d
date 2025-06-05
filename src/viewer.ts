/* eslint-disable tsdoc/syntax */
import {
	inferModelType,
	isTextureSource,
	loadCapeToCanvas,
	loadEarsToCanvas,
	loadEarsToCanvasFromSkin,
	loadImage,
	loadSkinToCanvas,
	type ModelType,
	type RemoteImage,
	type TextureSource,
} from "skinview-utils";
import {
	Color,
	type ColorRepresentation,
	PointLight,
	EquirectangularReflectionMapping,
	Group,
	NearestFilter,
	PerspectiveCamera,
	Scene,
	Texture,
	Vector2,
	WebGLRenderer,
	AmbientLight,
	type Mapping,
	CanvasTexture,
	WebGLRenderTarget,
	FloatType,
	DepthTexture,
	Clock,
	Object3D,
	ColorManagement,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { FullScreenQuad } from "three/examples/jsm/postprocessing/Pass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import { PlayerAnimation } from "./animation.js";
import { type BackEquipment, PlayerObject } from "./model.js";
import { NameTagObject } from "./nametag.js";

export interface LoadOptions {
	/**
	 * Whether to make the object visible after the texture is loaded.
	 *
	 * @defaultValue `true`
	 */
	makeVisible?: boolean;
}

export interface SkinLoadOptions extends LoadOptions {
	/**
	 * The model of the player (`"default"` for normal arms, and `"slim"` for slim arms).
	 *
	 * When set to `"auto-detect"`, the model will be inferred from the skin texture.
	 *
	 * @defaultValue `"auto-detect"`
	 */
	model?: ModelType | "auto-detect";

	/**
	 * Whether to display the ears drawn on the skin texture.
	 *
	 * - `true` - Display the ears drawn on the skin texture.
	 * - `"load-only"` - Loads the ear texture, but do not make them visible.
	 *   You can make them visible later by setting `PlayerObject.ears.visible` to `true`.
	 * - `false` - Do not load or show the ears.
	 *
	 * @defaultValue `false`
	 */
	ears?: boolean | "load-only";
}

export interface CapeLoadOptions extends LoadOptions {
	/**
	 * The equipment (`"cape"` or `"elytra"`) to show when the cape texture is loaded.
	 *
	 * If `makeVisible` is set to false, this option will have no effect.
	 *
	 * @defaultValue `"cape"`
	 */
	backEquipment?: BackEquipment;
}

export interface EarsLoadOptions extends LoadOptions {
	/**
	 * The type of the provided ear texture.
	 *
	 * - `"standalone"` means the provided texture is a 14x7 image that only contains the ears.
	 * - `"skin"` means the provided texture is a skin texture with ears, and we will use its ear part.
	 *
	 * @defaultValue `"standalone"`
	 */
	textureType?: "standalone" | "skin";
}

export interface SkinViewerOptions {
	/**
	 * The canvas where the renderer draws its output.
	 *
	 * @defaultValue If unspecified, a new canvas element will be created.
	 */
	canvas?: HTMLCanvasElement;

	/**
	 * The CSS width of the canvas.
	 */
	width?: number;

	/**
	 * The CSS height of the canvas.
	 */
	height?: number;

	/**
	 * The pixel ratio of the canvas.
	 *
	 * When set to `"match-device"`, the current device pixel ratio will be used,
	 * and it will be automatically updated when the device pixel ratio changes.
	 *
	 * @defaultValue `"match-device"`
	 */
	pixelRatio?: number | "match-device";

	/**
	 * The skin texture of the player.
	 *
	 * @defaultValue If unspecified, the skin will be invisible.
	 */
	skin?: RemoteImage | TextureSource;

	/**
	 * The model of the player (`"default"` for normal arms, and `"slim"` for slim arms).
	 *
	 * When set to `"auto-detect"`, the model will be inferred from the skin texture.
	 *
	 * If the `skin` option is not specified, this option will have no effect.
	 *
	 * @defaultValue `"auto-detect"`
	 */
	model?: ModelType | "auto-detect";

	/**
	 * The cape texture of the player.
	 *
	 * @defaultValue If unspecified, the cape will be invisible.
	 */
	cape?: RemoteImage | TextureSource;

	/**
	 * The ear texture of the player.
	 *
	 * When set to `"current-skin"`, the ears drawn on the current skin texture (as is specified in the `skin` option) will be shown.
	 *
	 * To use an individual ear texture, you have to specify the `textureType` and the `source` option.
	 * `source` is the texture to use, and `textureType` can be either `"standalone"` or `"skin"`:
	 *   - `"standalone"` means the provided texture is a 14x7 image that only contains the ears.
	 *   - `"skin"` means the provided texture is a skin texture with ears, and we will show its ear part.
	 *
	 * @defaultValue If unspecified, the ears will be invisible.
	 */
	ears?:
	| "current-skin"
	| {
		textureType: "standalone" | "skin";
		source: RemoteImage | TextureSource;
	};

	/**
	 * Whether to preserve the buffers until manually cleared or overwritten.
	 *
	 * @defaultValue `false`
	 */
	preserveDrawingBuffer?: boolean;

	/**
	 * Whether to pause the rendering and animation loop.
	 *
	 * @defaultValue `false`
	 */
	renderPaused?: boolean;

	/**
	 * The background of the scene.
	 *
	 * @defaultValue transparent
	 */
	background?: ColorRepresentation | Texture;

	/**
	 * The panorama background to use.
	 *
	 * This option overrides the `background` option.
	 */
	panorama?: RemoteImage | TextureSource;

	/**
	 * Camera vertical field of view, in degrees.
	 *
	 * The distance between the player and the camera will be automatically computed from `fov` and `zoom`.
	 *
	 * @defaultValue `50`
	 *
	 * @see {@link SkinViewer.adjustCameraDistance}
	 */
	fov?: number;

	/**
	 * Zoom ratio of the player.
	 *
	 * This value affects the distance between the object and the camera.
	 * When set to `1.0`, the top edge of the player's head coincides with the edge of the canvas.
	 *
	 * The distance between the player and the camera will be automatically computed from `fov` and `zoom`.
	 *
	 * @defaultValue `0.9`
	 *
	 * @see {@link SkinViewer.adjustCameraDistance}
	 */
	zoom?: number;

	/**
	 * Whether to enable mouse control function.
	 *
	 * This function is implemented using {@link OrbitControls}.
	 * By default, zooming and rotating are enabled, and panning is disabled.
	 *
	 * @defaultValue `true`
	 */
	enableControls?: boolean;

	/**
	 * The animation to play on the player.
	 *
	 * @defaultValue If unspecified, no animation will be played.
	 */
	animation?: PlayerAnimation;

	/**
	 * The name tag to display above the player.
	 *
	 * @defaultValue If unspecified, no name tag will be displayed.
	 * @see {@link SkinViewer.nameTag}
	 */
	nameTag?: NameTagObject | string;

	/**
	 * Allow rotation around the X and Y axis (Vertical and Horizontal).
	 * @defaultValue true
	 */
	enableRotation?: boolean;
	/**
	 * Allow rotation around the X axis (vertical).
	 * @defaultValue true
	 */
	allowRotateX?: boolean;
	/**
	 * Allow rotation around the Y axis (horizontal).
	 * @defaultValue true
	 */
	allowRotateY?: boolean;
	/**
	 * Allow zooming.
	 * @defaultValue true
	 */
	allowZoom?: boolean;
}

/**
 * The SkinViewer renders the player on a canvas.
 */
export class SkinViewer {
	/** The canvas where the renderer draws its output. */
	readonly canvas: HTMLCanvasElement;
	readonly scene: Scene;
	readonly camera: PerspectiveCamera;
	readonly renderer: WebGLRenderer;
	/** Mouse control component (OrbitControls). */
	readonly controls: OrbitControls;
	/** The player object (skin, cape, elytra, ears). */
	readonly playerObject: PlayerObject;
	/** Group that wraps the player object for centering. */
	readonly playerWrapper: Group;

	readonly globalLight: AmbientLight = new AmbientLight(0xffffff, 3);
	readonly cameraLight: PointLight = new PointLight(0xffffff, 0.6);

	readonly composer: EffectComposer;
	readonly renderPass: RenderPass;
	readonly fxaaPass: ShaderPass;

	readonly skinCanvas: HTMLCanvasElement;
	readonly capeCanvas: HTMLCanvasElement;
	readonly earsCanvas: HTMLCanvasElement;

	private skinTexture: Texture | null = null;
	private capeTexture: Texture | null = null;
	private earsTexture: Texture | null = null;
	private backgroundTexture: Texture | null = null;

	private _disposed = false;
	private _renderPaused = false;
	private _zoom: number;
	private isUserRotating = false;

	/**
	 * Whether to rotate the player along the y axis.
	 *
	 * @defaultValue `false`
	 */
	autoRotate: boolean = false;

	/**
	 * The angular velocity of the player, in rad/s.
	 *
	 * @defaultValue `1.0`
	 * @see {@link autoRotate}
	 */
	autoRotateSpeed: number = 1.0;

	private _animation: PlayerAnimation | null;
	private clock: Clock;

	private animationID: number | null;
	private onContextLost: (event: Event) => void;
	private onContextRestored: () => void;

	private _pixelRatio: number | "match-device";
	private devicePixelRatioQuery: MediaQueryList | null;
	private onDevicePixelRatioChange: () => void;

	private _nameTag: NameTagObject | null = null;

	constructor(options: SkinViewerOptions = {}) {
		this.canvas = options.canvas ?? document.createElement("canvas");
		this.skinCanvas = document.createElement("canvas");
		this.capeCanvas = document.createElement("canvas");
		this.earsCanvas = document.createElement("canvas");

		this.scene = new Scene();
		this.camera = new PerspectiveCamera();
		this.camera.add(this.cameraLight);
		this.scene.add(this.camera, this.globalLight);
		ColorManagement.enabled = false;

		this.renderer = new WebGLRenderer({
			canvas: this.canvas,
			preserveDrawingBuffer: options.preserveDrawingBuffer === true,
		});

		this.onDevicePixelRatioChange = () => {
			this.renderer.setPixelRatio(window.devicePixelRatio);
			this.updateComposerSize();
			if (this._pixelRatio === "match-device") {
				this.devicePixelRatioQuery = matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
				this.devicePixelRatioQuery.addEventListener("change", this.onDevicePixelRatioChange, { once: true });
			}
		};
		if (options.pixelRatio === undefined || options.pixelRatio === "match-device") {
			this._pixelRatio = "match-device";
			this.devicePixelRatioQuery = matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
			this.devicePixelRatioQuery.addEventListener("change", this.onDevicePixelRatioChange, { once: true });
			this.renderer.setPixelRatio(window.devicePixelRatio);
		} else {
			this._pixelRatio = options.pixelRatio;
			this.devicePixelRatioQuery = null;
			this.renderer.setPixelRatio(options.pixelRatio);
		}

		this.renderer.setClearColor(0, 0);

		let renderTarget;
		if (this.renderer.capabilities.isWebGL2) {
			renderTarget = new WebGLRenderTarget(0, 0, {
				depthTexture: new DepthTexture(0, 0, FloatType),
			});
		}
		this.composer = new EffectComposer(this.renderer, renderTarget);
		this.renderPass = new RenderPass(this.scene, this.camera);
		this.fxaaPass = new ShaderPass(FXAAShader);
		this.composer.addPass(this.renderPass);
		this.composer.addPass(this.fxaaPass);

		this.playerObject = new PlayerObject();
		this.playerObject.name = "player";
		this.playerObject.skin.visible = false;
		this.playerObject.cape.visible = false;
		this.playerWrapper = new Group();
		this.playerWrapper.add(this.playerObject);
		this.scene.add(this.playerWrapper);

		this.controls = new OrbitControls(this.camera, this.canvas);

		// Restrict rotation and zoom based on options
		this.controls.enableRotate = options.enableRotation !== false;
		this.controls.enableZoom = options.allowZoom !== false;

		// Remove restricting x and y rotation

		// Apply initial options
		if (options.skin !== undefined) {
			this.loadSkin(options.skin, {
				model: options.model,
				ears: options.ears === "current-skin",
			});
		}
		if (options.cape !== undefined) this.loadCape(options.cape);
		if (options.ears !== undefined && options.ears !== "current-skin") {
			this.loadEars(options.ears.source, { textureType: options.ears.textureType });
		}
		if (options.width !== undefined) this.width = options.width;
		if (options.height !== undefined) this.height = options.height;
		if (options.background !== undefined) this.background = options.background;
		if (options.panorama !== undefined) this.loadPanorama(options.panorama);
		if (options.nameTag !== undefined) this.nameTag = options.nameTag;

		this.camera.position.z = 1;
		this._zoom = options.zoom ?? 0.9;
		this.fov = options.fov ?? 50;

		this._animation = options.animation ?? null;
		this.clock = new Clock();

		if (options.renderPaused === true) {
			this._renderPaused = true;
			this.animationID = null;
		} else {
			this.animationID = window.requestAnimationFrame(() => this.draw());
		}

		this.onContextLost = (event: Event) => {
			event.preventDefault();
			if (this.animationID !== null) {
				window.cancelAnimationFrame(this.animationID);
				this.animationID = null;
			}
		};
		this.onContextRestored = () => {
			this.renderer.setClearColor(0, 0);
			if (!this._renderPaused && !this._disposed && this.animationID === null) {
				this.animationID = window.requestAnimationFrame(() => this.draw());
			}
		};
		this.canvas.addEventListener("webglcontextlost", this.onContextLost, false);
		this.canvas.addEventListener("webglcontextrestored", this.onContextRestored, false);
		this.canvas.addEventListener("mousedown", () => { this.isUserRotating = true; }, false);
		this.canvas.addEventListener("mouseup", () => {
			this.isUserRotating = false;
		}, false);
		this.canvas.addEventListener("touchmove", e => {
			this.isUserRotating = e.touches.length === 1;
		}, false);
		this.canvas.addEventListener("touchend", () => {
			this.isUserRotating = false;
		}, false);
	}

	/** Update the size and pixel ratio of the composer and FXAA pass. */
	private updateComposerSize(): void {
		this.composer.setSize(this.width, this.height);
		const pixelRatio = this.renderer.getPixelRatio();
		this.composer.setPixelRatio(pixelRatio);
		this.fxaaPass.material.uniforms["resolution"].value.x = 1 / (this.width * pixelRatio);
		this.fxaaPass.material.uniforms["resolution"].value.y = 1 / (this.height * pixelRatio);
	}

	/** Create or update the skin texture from the skin canvas. */
	private recreateSkinTexture(): void {
		this.skinTexture?.dispose();
		this.skinTexture = new CanvasTexture(this.skinCanvas);
		this.skinTexture.magFilter = NearestFilter;
		this.skinTexture.minFilter = NearestFilter;
		this.playerObject.skin.map = this.skinTexture;
	}

	/** Create or update the cape texture from the cape canvas. */
	private recreateCapeTexture(): void {
		this.capeTexture?.dispose();
		this.capeTexture = new CanvasTexture(this.capeCanvas);
		this.capeTexture.magFilter = NearestFilter;
		this.capeTexture.minFilter = NearestFilter;
		this.playerObject.cape.map = this.capeTexture;
		this.playerObject.elytra.map = this.capeTexture;
	}

	/** Create or update the ears texture from the ears canvas. */
	private recreateEarsTexture(): void {
		this.earsTexture?.dispose();
		this.earsTexture = new CanvasTexture(this.earsCanvas);
		this.earsTexture.magFilter = NearestFilter;
		this.earsTexture.minFilter = NearestFilter;
		this.playerObject.ears.map = this.earsTexture;
	}

	/**
	 * Load a skin texture.
	 * @param source - The skin image or canvas.
	 * @param options - Loading options.
	 */
	loadSkin(empty: null): void;
	loadSkin<S extends TextureSource | RemoteImage>(
		source: S,
		options?: SkinLoadOptions
	): S extends TextureSource ? void : Promise<void>;
	loadSkin(source: TextureSource | RemoteImage | null, options: SkinLoadOptions = {}): void | Promise<void> {
		if (source === null) {
			this.resetSkin();
		} else if (isTextureSource(source)) {
			loadSkinToCanvas(this.skinCanvas, source);
			this.recreateSkinTexture();
			this.playerObject.skin.modelType =
				options.model === undefined || options.model === "auto-detect"
					? inferModelType(this.skinCanvas)
					: options.model;
			if (options.makeVisible !== false) this.playerObject.skin.visible = true;
			if (options.ears === true || options.ears === "load-only") {
				loadEarsToCanvasFromSkin(this.earsCanvas, source);
				this.recreateEarsTexture();
				if (options.ears === true) this.playerObject.ears.visible = true;
			}
		} else {
			return loadImage(source).then(image => this.loadSkin(image, options));
		}
	}

	/** Hide and dispose the current skin texture. */
	resetSkin(): void {
		this.playerObject.skin.visible = false;
		this.playerObject.skin.map = null;
		this.skinTexture?.dispose();
		this.skinTexture = null;
	}

	/**
	 * Load a cape texture.
	 * @param source - The cape image or canvas.
	 * @param options - Loading options.
	 */
	loadCape(empty: null): void;
	loadCape<S extends TextureSource | RemoteImage>(
		source: S,
		options?: CapeLoadOptions
	): S extends TextureSource ? void : Promise<void>;
	loadCape(source: TextureSource | RemoteImage | null, options: CapeLoadOptions = {}): void | Promise<void> {
		if (source === null) {
			this.resetCape();
		} else if (isTextureSource(source)) {
			loadCapeToCanvas(this.capeCanvas, source);
			this.recreateCapeTexture();
			if (options.makeVisible !== false) {
				this.playerObject.backEquipment = options.backEquipment ?? "cape";
			}
		} else {
			return loadImage(source).then(image => this.loadCape(image, options));
		}
	}

	/** Hide and dispose the current cape texture. */
	resetCape(): void {
		this.playerObject.backEquipment = null;
		this.playerObject.cape.map = null;
		this.playerObject.elytra.map = null;
		this.capeTexture?.dispose();
		this.capeTexture = null;
	}

	/**
	 * Load an ear texture.
	 * @param source - The ear image or canvas.
	 * @param options - Loading options.
	 */
	loadEars(empty: null): void;
	loadEars<S extends TextureSource | RemoteImage>(
		source: S,
		options?: EarsLoadOptions
	): S extends TextureSource ? void : Promise<void>;
	loadEars(source: TextureSource | RemoteImage | null, options: EarsLoadOptions = {}): void | Promise<void> {
		if (source === null) {
			this.resetEars();
		} else if (isTextureSource(source)) {
			if (options.textureType === "skin") {
				loadEarsToCanvasFromSkin(this.earsCanvas, source);
			} else {
				loadEarsToCanvas(this.earsCanvas, source);
			}
			this.recreateEarsTexture();
			if (options.makeVisible !== false) this.playerObject.ears.visible = true;
		} else {
			return loadImage(source).then(image => this.loadEars(image, options));
		}
	}

	/** Hide and dispose the current ears texture. */
	resetEars(): void {
		this.playerObject.ears.visible = false;
		this.playerObject.ears.map = null;
		this.earsTexture?.dispose();
		this.earsTexture = null;
	}

	/** Load a panorama background. */
	loadPanorama<S extends TextureSource | RemoteImage>(source: S): S extends TextureSource ? void : Promise<void> {
		return this.loadBackground(source, EquirectangularReflectionMapping);
	}

	/**
	 * Load a background texture.
	 * @param source - The background image or canvas.
	 * @param mapping - Optional texture mapping.
	 */
	loadBackground<S extends TextureSource | RemoteImage>(
		source: S,
		mapping?: Mapping
	): S extends TextureSource ? void : Promise<void>;
	loadBackground<S extends TextureSource | RemoteImage>(source: S, mapping?: Mapping): void | Promise<void> {
		if (isTextureSource(source)) {
			this.backgroundTexture?.dispose();
			this.backgroundTexture = new Texture();
			this.backgroundTexture.image = source;
			if (mapping) this.backgroundTexture.mapping = mapping;
			this.backgroundTexture.needsUpdate = true;
			this.scene.background = this.backgroundTexture;
		} else {
			return loadImage(source).then(image => this.loadBackground(image, mapping));
		}
	}

	/** Animation and rendering loop. */
	private draw(): void {
		const dt = this.clock.getDelta();
		this._animation?.update(this.playerObject, dt);
		if (this.autoRotate && !(this.controls.enableRotate && this.isUserRotating)) {
			this.playerWrapper.rotation.y += dt * this.autoRotateSpeed;
		}
		this.controls.update();
		this.render();
		this.animationID = window.requestAnimationFrame(() => this.draw());
	}

	/** Render the scene to the canvas (does not advance animation). */
	render(): void {
		this.composer.render();
	}

	/** Set the viewer size in pixels. */
	setSize(width: number, height: number): void {
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(width, height);
		this.updateComposerSize();
	}

	/** Dispose all resources and event listeners. */
	dispose(): void {
		this._disposed = true;
		this.canvas.removeEventListener("webglcontextlost", this.onContextLost, false);
		this.canvas.removeEventListener("webglcontextrestored", this.onContextRestored, false);
		this.devicePixelRatioQuery?.removeEventListener("change", this.onDevicePixelRatioChange);
		this.devicePixelRatioQuery = null;
		if (this.animationID !== null) {
			window.cancelAnimationFrame(this.animationID);
			this.animationID = null;
		}
		this.controls.dispose();
		this.renderer.dispose();
		this.resetSkin();
		this.resetCape();
		this.resetEars();
		this.background = null;
		(this.fxaaPass.fsQuad as FullScreenQuad).dispose();
	}

	get disposed(): boolean {
		return this._disposed;
	}

	/** Whether rendering and animations are paused. */
	get renderPaused(): boolean {
		return this._renderPaused;
	}
	set renderPaused(value: boolean) {
		this._renderPaused = value;
		if (value && this.animationID !== null) {
			window.cancelAnimationFrame(this.animationID);
			this.animationID = null;
			this.clock.stop();
			this.clock.autoStart = true;
		} else if (!value && !this._disposed && !this.renderer.getContext().isContextLost() && this.animationID == null) {
			this.animationID = window.requestAnimationFrame(() => this.draw());
		}
	}

	get width(): number {
		return this.renderer.getSize(new Vector2()).width;
	}
	set width(newWidth: number) {
		this.setSize(newWidth, this.height);
	}

	get height(): number {
		return this.renderer.getSize(new Vector2()).height;
	}
	set height(newHeight: number) {
		this.setSize(this.width, newHeight);
	}

	get background(): null | Color | Texture {
		return this.scene.background;
	}
	set background(value: null | ColorRepresentation | Texture) {
		if (value === null || value instanceof Color || value instanceof Texture) {
			this.scene.background = value;
		} else {
			this.scene.background = new Color(value);
		}
		if (this.backgroundTexture !== null && value !== this.backgroundTexture) {
			this.backgroundTexture.dispose();
			this.backgroundTexture = null;
		}
	}

	/** Adjust camera distance based on FOV and zoom. */
	adjustCameraDistance(): void {
		let distance = 4.5 + 16.5 / Math.tan(((this.fov / 180) * Math.PI) / 2) / this.zoom;
		distance = Math.max(10, Math.min(distance, 256));
		this.camera.position.multiplyScalar(distance / this.camera.position.length());
		this.camera.updateProjectionMatrix();
	}

	/** Reset camera to default pose and distance. */
	resetCameraPose(): void {
		this.camera.position.set(0, 0, 1);
		this.camera.rotation.set(0, 0, 0);
		this.adjustCameraDistance();
	}

	get fov(): number {
		return this.camera.fov;
	}
	set fov(value: number) {
		this.camera.fov = value;
		this.adjustCameraDistance();
	}

	get zoom(): number {
		return this._zoom;
	}
	set zoom(value: number) {
		this._zoom = value;
		this.adjustCameraDistance();
	}

	get pixelRatio(): number | "match-device" {
		return this._pixelRatio;
	}
	set pixelRatio(newValue: number | "match-device") {
		if (newValue === "match-device") {
			if (this._pixelRatio !== "match-device") {
				this._pixelRatio = newValue;
				this.onDevicePixelRatioChange();
			}
		} else {
			if (this._pixelRatio === "match-device" && this.devicePixelRatioQuery !== null) {
				this.devicePixelRatioQuery.removeEventListener("change", this.onDevicePixelRatioChange);
				this.devicePixelRatioQuery = null;
			}
			this._pixelRatio = newValue;
			this.renderer.setPixelRatio(newValue);
			this.updateComposerSize();
		}
	}

	/**
	 * The animation that is currently playing, or `null` if no animation is playing.
	 * Setting this property to a different value will change the current animation.
	 * The player's pose and the progress of the new animation will be reset before playing.
	 * Setting this property to `null` will stop the current animation and reset the player's pose.
	 */
	get animation(): PlayerAnimation | null {
		return this._animation;
	}
	set animation(animation: PlayerAnimation | null) {
		if (this._animation !== animation) {
			this.playerObject.resetJoints();
			this.playerObject.position.set(0, 0, 0);
			this.playerObject.rotation.set(0, 0, 0);
			this.clock.stop();
			this.clock.autoStart = true;
		}
		if (animation !== null) animation.progress = 0;
		this._animation = animation;
	}

	/**
	 * The name tag to display above the player, or `null` if there is none.
	 * When setting this property to a `string` value, a {@link NameTagObject}
	 * will be automatically created with default options.
	 *
	 * @example
	 * skinViewer.nameTag = "Norch";
	 * skinViewer.nameTag = new NameTagObject("hello", { textStyle: "yellow" });
	 * skinViewer.nameTag = null;
	 */
	get nameTag(): NameTagObject | null {
		return this._nameTag;
	}
	set nameTag(newVal: NameTagObject | string | null) {
		if (this._nameTag !== null) this.playerWrapper.remove(this._nameTag);
		if (newVal === null) {
			this._nameTag = null;
			return;
		}
		if (!(newVal instanceof Object3D)) newVal = new NameTagObject(newVal);
		this.playerWrapper.add(newVal);
		newVal.position.y = 20;
		this._nameTag = newVal;
	}

	/** Reset the model's rotation to default. */
	resetModelRotation(): void {
		this.playerWrapper.rotation.set(0, 0, 0);
		this.controls.reset();
	}
}
