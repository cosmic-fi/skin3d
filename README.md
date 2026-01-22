<img width="3740" height="1998" alt="Frame 45" src="https://github.com/user-attachments/assets/588b1cf2-a9fd-4a90-a73c-514fedb051b4" />

[![CI Status](https://img.shields.io/github/actions/workflow/status/cosmic-fi/skin3d/ci.yaml?branch=main&label=CI&logo=github&style=flat-square)](https://github.com/cosmic-fi/skin3d/actions?query=workflow:CI)
[![NPM Package](https://img.shields.io/npm/v/skin3d.svg?style=flat-square)](https://www.npmjs.com/package/skin3d)
[![MIT License](https://img.shields.io/badge/license-MIT-yellowgreen.svg?style=flat-square)](https://github.com/cosmic-fi/skin3d/blob/main/LICENSE)
[![Gitter Chat](https://img.shields.io/gitter/room/TechnologyAdvice/Stardust.svg?style=flat-square)](https://matrix.to/#/#skin3d:gitter.im)

---

**Skin3d** is a JavaScript library for displaying and animating Minecraft player models in the browser. It supports rendering skins, capes, elytras, and ears, and provides a simple API for customizing animations, camera controls, and backgrounds.

> **✨ Recently refactored** with improved modularity, better documentation, and dependency cleanup. See [Migration Guide](./DOCS/MIGRATION_GUIDE.md) for details.

---

## What is skin3d?

**Skin3d** is a JavaScript library for embedding interactive Minecraft player models in web applications. It supports HD skins, capes, elytras, ears, and name tags, along with built-in animations. You can customize camera controls, lighting, backgrounds, and extend functionality with your own features.

**Built with:** [Three.js](https://threejs.org/) + TypeScript

---

## Why use skin3d?

- **Interactive 3D Minecraft player models in the browser**
- **Supports all modern skin and cape formats**
- **Easy to use, easy to extend**
- **Customizable animations and controls**
- **Works with any web framework or vanilla JS**

---

## Getting Started

Install via npm:

```sh
npm i skin3d
```

---

## Basic Example

```html
<div id="skin_view_container"></div>
```
```js
import { Render, WalkingAnimation } from 'skin3d';

const viewer = new Render({
  canvas: document.getElementById("skin_view_container"),
  width: 400,
  height: 600,
  skin: "img/skin.png"
});

viewer.autoRotate = true;
viewer.animation = new WalkingAnimation();
```

**Note:** The main class is now `Render` (previously `View` in v0.0.10). See [Migration Guide](./DOCS/MIGRATION_GUIDE.md) for upgrading.

---

## Features at a Glance

- **Skin, Cape, Elytra, and Ears Rendering**
- **Name Tag Support (with Minecraft font)**
- **Orbit Controls (rotate, zoom, pan)**
- **Customizable Lighting**
- **Panorama and Image Backgrounds**
- **Built-in Animations (walk, run, rotate, etc.)**
- **Pause/Resume Rendering**
---

## API Highlights

- **View**: The main class for rendering and controlling the player model.
- **PlayerObject**: Access and control the skin, cape, elytra, and ears meshes.
- **NameTagObject**: Display a floating name tag above the player.
- **Animations**: Use built-in or custom animations for the player model.
- **Controls**: Enable or disable camera rotation, zoom, and pan.
- **Lighting**: Adjust ambient and camera-attached lights.
- **Backgrounds**: Set solid colors, images, or panoramic backgrounds.

---

## Customization

You can load new skins, capes, or ears at any time:

```js
viewer.loadSkin("img/another_skin.png");
viewer.loadCape("img/cape.png");
viewer.loadEars("img/ears.png", { textureType: "standalone" });
viewer.background = "#222244";
viewer.loadPanorama("img/panorama.png");
```

Change camera and controls:

```js
viewer.fov = 70;
viewer.zoom = 1.2;
viewer.controls.enableRotate = true;
viewer.controls.enableZoom = false;
```

Add or remove animations:

```js
import { IdleAnimation, WalkingAnimation, RunningAnimation } from 'skin3d';

viewer.animation = new WalkingAnimation();
viewer.animation.speed = 2;
viewer.animation.paused = false;
viewer.animation = null; // Remove animation
```

See [Examples](./DOCS/EXAMPLES.md) for more usage patterns.

---

## Advanced Usage

- **Lighting**:  
```js
viewer.globalLight.intensity = 1.5;
viewer.cameraLight.intensity = 0.3;
```

- **Name Tags**:  
```js
import { NameTagObject } from 'skin3d';

viewer.nameTag = "Steve";
viewer.nameTag = new NameTagObject("Alex", { 
  scale: 1.5,
  textStyle: { fillStyle: "#FFD700" }
});
```

- **Responsive Sizing**:  
```js
viewer.width = window.innerWidth;
viewer.height = window.innerHeight;

window.addEventListener('resize', () => {
  viewer.width = window.innerWidth;
  viewer.height = window.innerHeight;
});
```

See [Advanced Usage](./DOCS/ADVANCED_USAGE.md) for more features and optimization tips.

---

## Font Setup

To display name tags in Minecraft style, add this to your CSS:

```css
@font-face {
  font-family: 'Minecraft';
  src: url('/path/to/minecraft.woff2') format('woff2');
}
```

---

## Documentation

Comprehensive documentation is available in the [DOCS](./DOCS/) directory:

- **[Getting Started](./DOCS/GETTING_STARTED.md)** - Installation, setup, and framework integration
- **[Examples](./DOCS/EXAMPLES.md)** - 10+ practical examples covering common use cases
- **[API Reference](./DOCS/API_REFERENCE.md)** - Complete API documentation with all classes and methods
- **[Advanced Usage](./DOCS/ADVANCED_USAGE.md)** - Performance optimization, custom animations, and advanced features
- **[Architecture](./DOCS/ARCHITECTURE.md)** - Understanding the library structure and design patterns
- **[Migration Guide](./DOCS/MIGRATION_GUIDE.md)** - Upgrading from previous versions
- **[Troubleshooting](./DOCS/TROUBLESHOOTING.md)** - Common issues and solutions

---

## Recent Changes (v0.1.0)

### What's New ✨

- **Modular Architecture**: Refactored for better code organization and maintainability
- **New Export System**: Improved module exports with better tree-shaking support
- **Enhanced Documentation**: Comprehensive guides, examples, and API reference
- **Dependency Cleanup**: Removed unused polyfills, optimized for production
- **Main Class Rename**: `View` → `Render` for clarity

### Updated Files

- `src/Render.ts` - Core rendering engine (replaces legacy `skin3d.ts`)
- `src/Model.ts` - Player model and mesh management
- `src/Animation.ts` - Animation system
- `src/Nametag.ts` - Name tag rendering
- `src/index.ts` - Main entry point

### Breaking Changes

The main class `View` has been renamed to `Render`:

```js
// Old
import { View } from 'skin3d';
const viewer = new View({ ... });

// New
import { Render } from 'skin3d';
const viewer = new Render({ ... });
```

See [Migration Guide](./DOCS/MIGRATION_GUIDE.md) for complete upgrade instructions.

---

## Project Structure

- `src/Render.ts` – Main rendering engine
- `src/Model.ts` – Player model and mesh components
- `src/Animation.ts` – Animation system
- `src/Nametag.ts` – Name tag rendering
- `src/index.ts` – Public API exports
- `DOCS/` – [Comprehensive documentation](./DOCS/README.md)

---

## License

skin3d is released under the MIT License.

---

## Links

- [Live Demo](https://skin3d.vercel.app/)
- [NPM Package](https://www.npmjs.com/package/skin3d)
- [GitHub Repository](https://github.com/cosmic-fi/skin3d)
- [Community Chat](https://matrix.to/#/#skin3d:gitter.im)

---
