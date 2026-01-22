# Getting Started with Skin3d

## Installation

### Via NPM (Recommended)

```bash
npm install skin3d
```

### Via Yarn

```bash
yarn add skin3d
```

### Via PNPM

```bash
pnpm add skin3d
```

### Via CDN (UMD Bundle)

```html
<script src="https://cdn.jsdelivr.net/npm/skin3d@latest/bundles/skin3d.umd.js"></script>
<script>
  const { Render } = window.skin3d;
  // Use skin3d here
</script>
```

---

## Basic Setup

### HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Skin3d Viewer</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }
        #canvas-container {
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
    </style>
</head>
<body>
    <div id="canvas-container"></div>
    <script type="module" src="./main.js"></script>
</body>
</html>
```

### JavaScript Setup (ES6 Modules)

```javascript
import { Render, WalkingAnimation } from 'skin3d';

// Create a viewer
const viewer = new Render({
  canvas: document.getElementById('canvas-container'),
  width: window.innerWidth,
  height: window.innerHeight,
  skin: 'https://mc-heads.net/skin/Steve',
  model: 'default', // 'default' or 'slim'
});

// Load a cape
await viewer.loadCape('https://mc-heads.net/cape/Notch');

// Add animation
viewer.animation = new WalkingAnimation();

// Enable auto-rotation
viewer.autoRotate = true;

// Handle window resize
window.addEventListener('resize', () => {
  viewer.width = window.innerWidth;
  viewer.height = window.innerHeight;
});
```

---

## Using with TypeScript

Skin3d is built with TypeScript and provides full type definitions out of the box.

```typescript
import { Render, Options, PlayerAnimation, WalkingAnimation } from 'skin3d';

const options: Options = {
  canvas: document.getElementById('canvas-container') as HTMLElement,
  width: 800,
  height: 600,
  skin: 'path/to/skin.png',
  model: 'default',
  enableControls: true,
  enableLighting: true,
  autoRotate: false,
};

const viewer: Render = new Render(options);
const animation: PlayerAnimation = new WalkingAnimation();

viewer.animation = animation;
```

---

## Framework Integration

### React

```typescript
import React, { useEffect, useRef } from 'react';
import { Render } from 'skin3d';

export const SkinViewer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Render | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    viewerRef.current = new Render({
      canvas: containerRef.current,
      width: 400,
      height: 600,
      skin: 'https://mc-heads.net/skin/Steve',
    });

    return () => {
      // Cleanup if needed
    };
  }, []);

  return <div ref={containerRef} style={{ width: '400px', height: '600px' }} />;
};
```

### Vue 3

```typescript
<template>
  <div ref="container" class="skin-viewer"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Render } from 'skin3d';

const container = ref<HTMLElement>();
let viewer: Render;

onMounted(() => {
  if (container.value) {
    viewer = new Render({
      canvas: container.value,
      width: 400,
      height: 600,
      skin: 'https://mc-heads.net/skin/Steve',
    });
  }
});
</script>

<style scoped>
.skin-viewer {
  width: 400px;
  height: 600px;
  border: 1px solid #ccc;
}
</style>
```

### Svelte

```svelte
<script>
  import { onMount } from 'svelte';
  import { Render } from 'skin3d';

  let container;
  let viewer;

  onMount(() => {
    viewer = new Render({
      canvas: container,
      width: 400,
      height: 600,
      skin: 'https://mc-heads.net/skin/Steve',
    });

    return () => {
      // Cleanup if needed
    };
  });
</script>

<div bind:this={container} class="viewer" />

<style>
  .viewer {
    width: 400px;
    height: 600px;
  }
</style>
```

---

## Configuration Options

The main `Render` class accepts an `Options` object with the following properties:

```typescript
interface Options {
  // Canvas element or container
  canvas: HTMLElement;
  
  // Dimensions
  width: number;
  height: number;
  
  // Model
  skin?: string | TextureSource; // Skin URL or data
  model?: 'default' | 'slim';     // Character model
  
  // Equipment
  cape?: string | TextureSource;
  ears?: string | TextureSource;
  elytra?: string | TextureSource;
  
  // Rendering
  enableControls?: boolean;        // Enable camera controls
  enableLighting?: boolean;         // Enable lighting
  autoRotate?: boolean;             // Auto-rotate camera
  
  // Appearance
  background?: string;              // Background color or image
  panorama?: string;                // Panoramic background
  
  // Camera
  fov?: number;                      // Field of view (degrees)
  zoom?: number;                     // Camera zoom level
  
  // Animation
  animation?: PlayerAnimation;       // Initial animation
}
```

---

## Next Steps

- 📖 **[Basic Examples](./EXAMPLES.md)** - See common use cases
- 🔧 **[Advanced Usage](./ADVANCED_USAGE.md)** - Learn advanced features
- 📚 **[API Reference](./API_REFERENCE.md)** - Full API documentation
- 🏗️ **[Architecture](./ARCHITECTURE.md)** - Understand the library structure

---

## Common Issues

**Q: My skin doesn't load**  
A: Make sure the image is a valid Minecraft skin texture (64x32 or 64x64 pixels) and is accessible (CORS enabled if from another domain).

**Q: The viewer is blank**  
A: Check that the canvas element exists, has valid dimensions, and WebGL is supported in your browser.

**Q: Controls don't work**  
A: Verify that `enableControls` is `true` and the canvas element has focus.

For more troubleshooting, see [Troubleshooting Guide](./TROUBLESHOOTING.md).

---

[← Back to Documentation](./README.md)
