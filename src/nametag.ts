/**
 * @file Nametag.ts
 * @description This file defines the NameTagObject class for creating Minecraft-style name tags.
 * @author Cosmic-fi
 * @license MIT
 */

import { CanvasTexture, NearestFilter, Sprite, SpriteMaterial } from "three";

export interface NameTagOptions {
	/**
	 * Font specification using CSS font syntax (e.g., "48px Arial").
	 *
	 * @defaultValue `"48px Minecraft"`
	 *
	 * @remarks
	 * To use the Minecraft font, add this @font-face rule to your CSS:
	 * ```css
	 * @font-face {
	 *   font-family: 'Minecraft';
	 *   src: url('/path/to/minecraft.woff2') format('woff2');
	 * }
	 * ```
	 * Get the font from {@link https://github.com/South-Paw/typeface-minecraft}.
	 */
	font?: string;

	/**
	 * Whether to repaint the name tag after the desired font is loaded.
	 *
	 * The font specified in `font` option may not be available when a {@link NameTagObject} is created,
	 * especially when you are using a web font. In this case, a fallback font will be used.
	 *
	 * If `repaintAfterLoaded` is `true`, the name tag is repainted after the desired font is loaded.
	 * This process can be monitored using {@link NameTagObject.painted}.
	 *
	 * @defaultValue `true`
	 */
	repaintAfterLoaded?: boolean;

	/**
	 * The space (in pixels) between the text and the border of the name tag.
	 *
	 * Order: **top**, **right**, **bottom**, **left** (clockwise).
	 *
	 * @defaultValue `[5, 10, 5, 10]`
	 */
	margin?: [number, number, number, number];

	/**
	 * The color, gradient, or pattern used to draw the text.
	 *
	 * @defaultValue `"white"`
	 */
	textStyle?: string | CanvasGradient | CanvasPattern;

	/**
	 * The color, gradient, or pattern used to draw the background.
	 *
	 * @defaultValue `"rgba(0,0,0,.25)"`
	 */
	backgroundStyle?: string | CanvasGradient | CanvasPattern;

	/**
	 * The height of the name tag object.
	 *
	 * @defaultValue `4.0`
	 */
	height?: number;
}

/**
 * A Minecraft name tag, i.e. a text label with background.
 */
export class NameTagObject extends Sprite {
	/**
	 * A promise that is resolved after the name tag is fully painted.
	 *
	 * This will be a resolved promise, if
	 * {@link NameTagOptions.repaintAfterLoaded} is `false`, or
	 * the desired font is available when the `NameTagObject` is created.
	 *
	 * If {@link NameTagOptions.repaintAfterLoaded} is `true`, and
	 * the desired font hasn't been loaded when the `NameTagObject` is created,
	 * the name tag will be painted with the fallback font first, and then
	 * repainted with the desired font after it's loaded. This promise is
	 * resolved after repainting is done.
	 */
	readonly painted: Promise<void>;

	private text: string;
	private font: string;
	private margin: [number, number, number, number];
	private textStyle: string | CanvasGradient | CanvasPattern;
	private backgroundStyle: string | CanvasGradient | CanvasPattern;
	private height: number;
	private textMaterial: SpriteMaterial;

	constructor(text: string = "", options: NameTagOptions = {}) {
		const material = new SpriteMaterial({
			transparent: true,
			alphaTest: 1e-5,
		});

		super(material);

		this.textMaterial = material;

		this.text = text;
		this.font = options.font === undefined ? "48px Minecraft" : options.font;
		this.margin = options.margin === undefined ? [5, 10, 5, 10] : options.margin;
		this.textStyle = options.textStyle === undefined ? "white" : options.textStyle;
		this.backgroundStyle = options.backgroundStyle === undefined ? "rgba(0,0,0,.25)" : options.backgroundStyle;
		this.height = options.height === undefined ? 4.0 : options.height;

		const repaintAfterLoaded = options.repaintAfterLoaded === undefined ? true : options.repaintAfterLoaded;
		if (repaintAfterLoaded && !document.fonts.check(this.font, this.text)) {
			this.paint();
			this.painted = this.loadAndPaint();
		} else {
			this.paint();
			this.painted = Promise.resolve();
		}
	}

	/**
	 * Set the text of the name tag.
	 * @param newText The new text.
	 */
	private async loadAndPaint() {
		await document.fonts.load(this.font, this.text);
		this.paint();
	}

	/**
	 * Paint the name tag.
	 * This method creates a canvas, draws the text and background,
	 * and applies it as a texture to the sprite.
	 * @private
	 */
	private paint() {
		const canvas = document.createElement("canvas");

		/**
		 * Measure the text size
		 * 
		 * @remarks
		 * We need to create the canvas and get the context first,
		 * because some browsers (e.g., Safari) require a canvas to measure text.
		 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Advanced_text_metrics}
		*/

		let ctx = canvas.getContext("2d")!;
		ctx.font = this.font;
		const metrics = ctx.measureText(this.text);

		/**
		 * Resize the canvas to fit the text with margins
		 */
		canvas.width = this.margin[3] + metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight + this.margin[1];
		canvas.height =
			this.margin[0] + metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent + this.margin[2];

		/**
		 * Draw the background and text
		 * @remarks
		 * We need to get the context again after resizing the canvas,
		 * because resizing clears the canvas and resets the context.
		 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#resizing_the_canvas
		 */
		ctx = canvas.getContext("2d")!;
		ctx.font = this.font;

		/**
		 * Draw the background
		 */
		ctx.fillStyle = this.backgroundStyle;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		/**
		 * Draw the text
		 */
		ctx.fillStyle = this.textStyle;
		ctx.fillText(
			this.text,
			this.margin[3] + metrics.actualBoundingBoxLeft,
			this.margin[0] + metrics.actualBoundingBoxAscent
		);

		/**
		 * Create the texture and apply it to the sprite
		 */
		const texture = new CanvasTexture(canvas);
		texture.magFilter = NearestFilter;
		texture.minFilter = NearestFilter;
		this.textMaterial.map = texture;
		this.textMaterial.needsUpdate = true;

		/**
		 * Adjust the scale of the sprite to maintain aspect ratio
		 */
		this.scale.x = (canvas.width / canvas.height) * this.height;
		this.scale.y = this.height;
	}
}
