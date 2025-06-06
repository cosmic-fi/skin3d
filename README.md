# skin3d

[![CI Status](https://img.shields.io/github/actions/workflow/status/cosmic-fi/skin3d/ci.yaml?branch=master&label=CI&logo=github&style=flat-square)](https://github.com/cosmic-fi/skin3d/actions?query=workflow:CI)
[![NPM Package](https://img.shields.io/npm/v/skin3d.svg?style=flat-square)](https://www.npmjs.com/package/skin3d)
[![MIT License](https://img.shields.io/badge/license-MIT-yellowgreen.svg?style=flat-square)](https://github.com/cosmic-fi/skin3d/blob/main/LICENSE)
[![Gitter Chat](https://img.shields.io/gitter/room/TechnologyAdvice/Stardust.svg?style=flat-square)](https://matrix.to/#/#skin3d:gitter.im)

A Three.js-powered Minecraft skin viewer and renderer.  
Skin3d allows you to display, animate, and interact with Minecraft skins, capes, ears, and more in the browser.

---
- [ Live Demo ](https://skin3d.netlify.app/)

## API Overview

### Main Classes

#### `SkinViewer`

The core viewer class. Renders a Minecraft player model to a canvas.

**Constructor:**
```ts
new SkinViewer(options?: SkinViewerOptions)
```

**Key Options (`SkinViewerOptions`):**
- `canvas`: HTMLCanvasElement to render to
- `width`, `height`: Canvas size
- `skin`: Skin image URL or texture
- `cape`: Cape image URL or texture
- `ears`: Ears texture or `"current-skin"`
- `model`: `"default"`, `"slim"`, or `"auto-detect"`
- `background`: Color or texture
- `panorama`: Panorama image
- `fov`: Camera field of view
- `zoom`: Camera zoom ratio
- `enableControls`: Enable OrbitControls (mouse interaction)
- `enableRotation`: Allow rotation
- `allowZoom`: Allow zoom
- `allowRotateX`, `allowRotateY`: Restrict rotation axes
- `preserveDrawingBuffer`: Keep buffer after rendering
- `renderPaused`: Start paused
- `animation`: Initial animation
- `nameTag`: Name tag text or object

**Properties:**
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

**Methods:**
- `loadSkin(url, options?)`: Load a new skin
- `loadCape(url, options?)`: Load a new cape or elytra
- `loadEars(url, options?)`: Load ears texture
- `loadBackground(url)`: Set background image
- `loadPanorama(url)`: Set panorama background
- `dispose()`: Clean up resources
- `pauseRender()`: Pause rendering
- `resumeRender()`: Resume rendering

---

#### `PlayerObject`

Represents the player model and its parts.

**Properties:**
- `skin`: Skin mesh and layers
- `cape`: Cape mesh
- `elytra`: Elytra mesh
- `ears`: Ears mesh
- `backEquipment`: `"cape"`, `"elytra"`, or `null`

---

#### `NameTagObject`

Represents a name tag above the player.

**Constructor:**
```ts
new NameTagObject(text: string, options?: { textStyle?: string })
```

---

#### `PlayerAnimation`

Base class for animations.

**Built-in Animations:**
- `WalkingAnimation`
- `RunningAnimation`
- `RotatingAnimation`
- (Custom animations can be implemented)

**Properties:**
- `speed`: Animation speed
- `paused`: Pause/resume animation

---

### Controls

- **OrbitControls**: Mouse/touch controls for rotating, zooming, and panning the camera.
  - `enableRotate`, `enableZoom`, `enablePan`: Enable/disable controls
  - `minPolarAngle`, `maxPolarAngle`, `minAzimuthAngle`, `maxAzimuthAngle`: Restrict rotation

---

### Lighting

- `globalLight`: Ambient light (default intensity: 3)
- `cameraLight`: Point light attached to camera (default intensity: 0.6)

**Example:**
```js
skinViewer.globalLight.intensity = 1.0;
skinViewer.cameraLight.intensity = 0.0;
```

---

### Backgrounds

- `background`: Set to a color or THREE.Texture
- `loadBackground(url)`: Load an image as background
- `loadPanorama(url)`: Load a panorama image

---

### Ears Support

- Ears can be loaded from a standalone 14x7 image or from a skin texture.
- Specify in constructor or via `loadEars`.

---

### Name Tags

- Set `skinViewer.nameTag = "PlayerName"` or a `NameTagObject`.
- Requires Minecraft font (`minecraft.woff2`).

---

### Events

- Standard DOM events for canvas (e.g., `mousedown`, `mouseup`, `touchmove`, etc.)
- No custom event system; use property setters and methods.

---

## Example Usage

```html - index.html
<canvas id="skin_container"></canvas>

<script>
    let skinViewer = new skin3d.SkinViewer({
        canvas: document.getElementById("skin_container"),
        width: 300,
        height: 400,
        skin: "img/skin.png"
    });

    // Change viewer size
    skinViewer.width = 600;
    skinViewer.height = 800;

    // Load another skin
    skinViewer.loadSkin("img/skin2.png");

    // Load a cape
    skinViewer.loadCape("img/cape.png");

    // Load an elytra (from a cape texture)
    skinViewer.loadCape("img/cape.png", { backEquipment: "elytra" });

    // Unload(hide) the cape / elytra
    skinViewer.loadCape(null);

    // Set the background color
    skinViewer.background = 0x5a76f3;

    // Set the background to a normal image
    skinViewer.loadBackground("img/background.png");

    // Set the background to a panoramic image
    skinViewer.loadPanorama("img/panorama1.png");

    // Change camera FOV
    skinViewer.fov = 70;

    // Zoom out
    skinViewer.zoom = 0.5;

    // Rotate the player
    skinViewer.autoRotate = true;

    // Apply an animation
    skinViewer.animation = new skin3d.WalkingAnimation();

    // Set the speed of the animation
    skinViewer.animation.speed = 3;

    // Pause the animation
    skinViewer.animation.paused = true;

    // Remove the animation
    skinViewer.animation = null;
</script>
```

---

## Advanced Usage

### Lighting

```js
skinViewer.cameraLight.intensity = 0.9;
skinViewer.globalLight.intensity = 0.1;
```

### Ears

```js
new skin3d.SkinViewer({
    skin: "img/deadmau5.png",
    ears: "current-skin",
});

skinViewer.loadEars("img/ears.png", { textureType: "standalone" });
skinViewer.loadEars("img/deadmau5.png", { textureType: "skin" });
```

### Name Tag

```js
skinViewer.nameTag = "hello";
skinViewer.nameTag = new skin3d.NameTagObject("hello", { textStyle: "yellow" });
skinViewer.nameTag = null;
```

---

## Font

To display name tags correctly, you need the Minecraft font.  
Add this to your CSS:

```css
@font-face {
    font-family: 'Minecraft';
    src: url('/path/to/minecraft.woff2') format('woff2');
}
```

---

## Build

```sh
npm install
npm run build
```

---

## Source Structure (`/src`)

- `viewer.ts` – Main SkinViewer class, rendering logic, controls, options, and resource management.
- `playerObject.ts` – PlayerObject class, skin/cape/elytra/ears mesh management.
- `animation.ts` – Animation base class and built-in animations.
- `nameTagObject.ts` – NameTagObject class for rendering name tags.
- `utils.ts` – Utility functions for textures, images, and helpers.
- `types.ts` – TypeScript type definitions for options and interfaces.
- `shaders/` – Custom shaders (e.g., FXAA).
- `controls/OrbitControls.ts` – OrbitControls for camera interaction.

---

## License

MIT

---
