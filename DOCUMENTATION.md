# skin3d Documentation

Skin3d is a powerful, browser-based Minecraft skin viewer and renderer built on top of Three.js. It allows you to display, animate, and interact with Minecraft skins, capes, ears, and more, with a flexible API for customization and integration.

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [SkinViewer API](#skinviewer-api)
  - [SkinViewerOptions](#skinvieweroptions)
  - [Properties](#properties)
  - [Methods](#methods)
- [PlayerObject](#playerobject)
- [NameTagObject](#nametagobject)
- [Animations](#animations)
- [Controls](#controls)
- [Lighting](#lighting)
- [Backgrounds](#backgrounds)
- [Ears Support](#ears-support)
- [Name Tags](#name-tags)
- [Events](#events)
- [Examples](#examples)
- [Advanced Usage](#advanced-usage)
- [Source Structure](#source-structure)
- [License](#license)

---

## Installation

Install via npm:

```sh
npm install skin3d
```

Or include the UMD bundle in your HTML:

```html
<script src="https://unpkg.com/skin3d/dist/skin3d.min.js"></script>
```

---

## Quick Start

```html
<canvas id="skin_container"></canvas>
<script type="module">
import { SkinViewer } from "skin3d";

const viewer = new SkinViewer({
  canvas: document.getElementById("skin_container"),
  width: 300,
  height: 400,
  skin: "img/skin.png"
});
</script>
```

---

## SkinViewer API

### Constructor

```ts
new SkinViewer(options?: SkinViewerOptions)
```

### SkinViewerOptions

| Option                  | Type                                              | Description                                                                                       |
|-------------------------|---------------------------------------------------|---------------------------------------------------------------------------------------------------|
| `canvas`                | `HTMLCanvasElement`                               | Canvas to render to.                                                                              |
| `width`, `height`       | `number`                                          | Canvas size.                                                                                      |
| `skin`                  | `string \| TextureSource`                         | Skin image URL or texture.                                                                        |
| `cape`                  | `string \| TextureSource`                         | Cape image URL or texture.                                                                        |
| `ears`                  | `"current-skin" \| { textureType, source }`       | Ears texture or use ears from current skin.                                                       |
| `model`                 | `"default" \| "slim" \| "auto-detect"`            | Player model type.                                                                                |
| `background`            | `ColorRepresentation \| Texture`                  | Scene background color or texture.                                                                |
| `panorama`              | `string \| TextureSource`                         | Panorama background image.                                                                        |
| `fov`                   | `number`                                          | Camera field of view.                                                                             |
| `zoom`                  | `number`                                          | Camera zoom ratio.                                                                                |
| `enableControls`        | `boolean`                                         | Enable OrbitControls (mouse interaction).                                                         |
| `enableRotation`        | `boolean`                                         | Allow rotation.                                                                                   |
| `allowZoom`             | `boolean`                                         | Allow zoom.                                                                                       |
| `allowRotateX`          | `boolean`                                         | Allow rotation around X axis.                                                                     |
| `allowRotateY`          | `boolean`                                         | Allow rotation around Y axis.                                                                     |
| `preserveDrawingBuffer` | `boolean`                                         | Keep buffer after rendering.                                                                      |
| `renderPaused`          | `boolean`                                         | Start paused.                                                                                     |
| `animation`             | `PlayerAnimation`                                 | Initial animation.                                                                                |
| `nameTag`               | `NameTagObject \| string`                         | Name tag text or object.                                                                          |

---

### Properties

- `scene`: THREE.Scene instance
- `camera`: THREE.PerspectiveCamera instance
- `renderer`: THREE.WebGLRenderer instance
- `controls`: OrbitControls instance
- `playerObject`: PlayerObject (skin, cape, ears, etc.)
- `globalLight`, `cameraLight`: Lighting objects
- `background`: Set background color/texture
- `fov`, `zoom`: Camera controls
- `autoRotate`, `autoRotateSpeed`: Automatic rotation
- `animation`: Current animation
- `nameTag`: Name tag object or string

---

### Methods

- `loadSkin(url, options?)`: Load a new skin
- `loadCape(url, options?)`: Load a new cape or elytra
- `loadEars(url, options?)`: Load ears texture
- `loadBackground(url)`: Set background image
- `loadPanorama(url)`: Set panorama background
- `dispose()`: Clean up resources
- `pauseRender()`: Pause rendering
- `resumeRender()`: Resume rendering

---

## PlayerObject

Represents the player model and its parts.

### Properties

- `skin`: Skin mesh and layers
- `cape`: Cape mesh
- `elytra`: Elytra mesh
- `ears`: Ears mesh
- `backEquipment`: `"cape"`, `"elytra"`, or `null`

---

## NameTagObject

Represents a name tag above the player.

### Constructor

```ts
new NameTagObject(text: string, options?: { textStyle?: string })
```

---

## Animations

Animations are subclasses of `PlayerAnimation`.

### Built-in Animations

- `WalkingAnimation`
- `RunningAnimation`
- `RotatingAnimation`

### Properties

- `speed`: Animation speed
- `paused`: Pause/resume animation

### Usage

```js
skinViewer.animation = new skin3d.WalkingAnimation();
skinViewer.animation.speed = 2;
skinViewer.animation.paused = false;
```

---

## Controls

- **OrbitControls**: Mouse/touch controls for rotating, zooming, and panning the camera.
  - `enableRotate`, `enableZoom`, `enablePan`: Enable/disable controls
  - `minPolarAngle`, `maxPolarAngle`, `minAzimuthAngle`, `maxAzimuthAngle`: Restrict rotation

---

## Lighting

- `globalLight`: Ambient light (default intensity: 3)
- `cameraLight`: Point light attached to camera (default intensity: 0.6)

**Example:**
```js
skinViewer.globalLight.intensity = 1.0;
skinViewer.cameraLight.intensity = 0.0;
```

---

## Backgrounds

- `background`: Set to a color or THREE.Texture
- `loadBackground(url)`: Load an image as background
- `loadPanorama(url)`: Load a panorama image

---

## Ears Support

- Ears can be loaded from a standalone 14x7 image or from a skin texture.
- Specify in constructor or via `loadEars`.

**Example:**
```js
new skin3d.SkinViewer({
  skin: "img/deadmau5.png",
  ears: "current-skin",
});

skinViewer.loadEars("img/ears.png", { textureType: "standalone" });
skinViewer.loadEars("img/deadmau5.png", { textureType: "skin" });
```

---

## Name Tags

- Set `skinViewer.nameTag = "PlayerName"` or a `NameTagObject`.
- Requires Minecraft font (`minecraft.woff2`).

**Example:**
```js
skinViewer.nameTag = "hello";
skinViewer.nameTag = new skin3d.NameTagObject("hello", { textStyle: "yellow" });
skinViewer.nameTag = null;
```

---

## Events

- Standard DOM events for canvas (e.g., `mousedown`, `mouseup`, `touchmove`, etc.)
- No custom event system; use property setters and methods.

---

## Examples

```js
// Create a viewer
const viewer = new skin3d.SkinViewer({
  canvas: document.getElementById("skin_container"),
  width: 400,
  height: 600,
  skin: "img/skin.png"
});

// Change viewer size
viewer.width = 600;
viewer.height = 800;

// Load another skin
viewer.loadSkin("img/skin2.png");

// Load a cape
viewer.loadCape("img/cape.png");

// Set the background color
viewer.background = 0x5a76f3;

// Set the background to a normal image
viewer.loadBackground("img/background.png");

// Set the background to a panoramic image
viewer.loadPanorama("img/panorama1.png");

// Change camera FOV
viewer.fov = 70;

// Zoom out
viewer.zoom = 0.5;

// Rotate the player
viewer.autoRotate = true;

// Apply an animation
viewer.animation = new skin3d.WalkingAnimation();
viewer.animation.speed = 3;

// Pause the animation
viewer.animation.paused = true;

// Remove the animation
viewer.animation = null;
```

---

## Advanced Usage

### Lighting

```js
viewer.cameraLight.intensity = 0.9;
viewer.globalLight.intensity = 0.1;
```

### Ears

```js
viewer.loadEars("img/ears.png", { textureType: "standalone" });
viewer.loadEars("img/deadmau5.png", { textureType: "skin" });
```

### Name Tag

```js
viewer.nameTag = "hello";
viewer.nameTag = new skin3d.NameTagObject("hello", { textStyle: "yellow" });
viewer.nameTag = null;
```

---

## Source Structure

- `src/viewer.ts` – Main SkinViewer class, rendering logic, controls, options, and resource management.
- `src/playerObject.ts` – PlayerObject class, skin/cape/elytra/ears mesh management.
- `src/animation.ts` – Animation base class and built-in animations.
- `src/nameTagObject.ts` – NameTagObject class for rendering name tags.
- `src/utils.ts` – Utility functions for textures, images, and helpers.
- `src/types.ts` – TypeScript type definitions for options and interfaces.
- `src/shaders/` – Custom shaders (e.g., FXAA).
- `src/controls/OrbitControls.ts` – OrbitControls for camera interaction.

---

## License

MIT

---

## Links

- [Demo Link 1](https://skin3d.netlify.app/)
- [NPM](https://www.npmjs.com/package/skin3d)
- [GitHub](https://github.com/cosmic-fi/skin3d)