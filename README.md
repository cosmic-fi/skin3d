# skin3d

[![CI Status](https://img.shields.io/github/actions/workflow/status/cosmic-fi/skin3d/ci.yaml?branch=main&label=CI&logo=github&style=flat-square)](https://github.com/cosmic-fi/skin3d/actions?query=workflow:CI)
[![NPM Package](https://img.shields.io/npm/v/skin3d.svg?style=flat-square)](https://www.npmjs.com/package/skin3d)
[![MIT License](https://img.shields.io/badge/license-MIT-yellowgreen.svg?style=flat-square)](https://github.com/cosmic-fi/skin3d/blob/main/LICENSE)
[![Gitter Chat](https://img.shields.io/gitter/room/TechnologyAdvice/Stardust.svg?style=flat-square)](https://matrix.to/#/#skin3d:gitter.im)

---

**skin3d** is a modern, browser-based Minecraft skin renderer and animator, powered by Three.js. Effortlessly display, animate, and interact with Minecraft skins, capes, ears, and more, all with a flexible and intuitive API.

---

## What is skin3d?

skin3d is a JavaScript library that lets you embed a fully interactive Minecraft player model in your web app. It supports HD skins, capes, elytras, ears, name tags, and a variety of animations. You can control the camera, lighting, and background, and even add your own customizations.

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
npm install skin3d
```

---

## Basic Example

```html
<canvas id="skin_container"></canvas>
```
```js
import * as skin3d from 'skin3d';

const viewer = new skin3d.SkinViewer({
canvas: document.getElementById("skin_container"),
width: 400,
height: 600,
skin: "img/skin.png"
});

viewer.autoRotate = true;
viewer.animation = new skin3d.WalkingAnimation();
```

---

## Features at a Glance

- **Skin, Cape, Elytra, and Ears Rendering**
- **Name Tag Support (with Minecraft font)**
- **Orbit Controls (rotate, zoom, pan)**
- **FXAA Anti-Aliasing**
- **Customizable Lighting**
- **Panorama and Image Backgrounds**
- **Built-in Animations (walk, run, rotate, etc.)**
- **Responsive and High-DPI Ready**
- **Pause/Resume Rendering**

---

## API Highlights

- **SkinViewer**: The main class for rendering and controlling the player model.
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
viewer.animation = new skin3d.WalkingAnimation();
viewer.animation.speed = 2;
viewer.animation.paused = false;
viewer.animation = null; // Remove animation
```

---

## Advanced Usage

- **Lighting**:  
  ```js
  viewer.globalLight.intensity = 1.5;
  viewer.cameraLight.intensity = 0.3;
  ```

- **Name Tags**:  
  ```js
  viewer.nameTag = "Steve";
  viewer.nameTag = new skin3d.NameTagObject("Alex", { textStyle: "yellow" });
  ```

- **Responsive Sizing**:  
  ```js
  viewer.width = window.innerWidth;
  viewer.height = window.innerHeight;
  ```

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

## Project Structure

- `src/viewer.ts` – Main viewer logic and rendering
- `src/playerObject.ts` – Player model and mesh management
- `src/animation.ts` – Animation classes
- `src/nameTagObject.ts` – Name tag rendering
- `src/utils.ts` – Utility functions
- `src/shaders/` – Custom shaders
- `src/controls/OrbitControls.ts` – Camera controls

---

## License

skin3d is released under the MIT License.

---

## Links

- [Live Demo](https://skin3d.netlify.app/)
- [NPM Package](https://www.npmjs.com/package/skin3d)
- [GitHub Repository](https://github.com/cosmic-fi/skin3d)
- [Community Chat](https://matrix.to/#/#skin3d:gitter.im)

---
