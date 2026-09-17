# Advanced Usage

Advanced features, optimization techniques, and extending skin3d.

## Table of Contents

- [Performance Optimization](#performance-optimization)
- [Custom Animations](#custom-animations)
- [Direct Three.js Access](#direct-threejs-access)
- [Resource Management](#resource-management)
- [Advanced Rendering](#advanced-rendering)
- [Troubleshooting Performance](#troubleshooting-performance)

---

## Performance Optimization

### 1. Viewport Optimization

Adapt viewport size based on device capabilities:

```javascript
import { Render } from 'skin3d';

function getOptimalDimensions() {
  // Use lower resolution on mobile
  if (window.innerWidth < 768) {
    return {
      width: window.innerWidth,
      height: window.innerHeight * 0.5,
      quality: 0.75, // Device pixel ratio scaling
    };
  }
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    quality: 1,
  };
}

const dims = getOptimalDimensions();
const viewer = new Render({
  canvas: document.getElementById('viewer'),
  width: dims.width,
  height: dims.height,
  // Use device pixel ratio
});
```

### 2. LOD (Level of Detail)

Simplify rendering when not in focus:

```javascript
const viewer = new Render({ ... });

// Pause rendering when tab is not visible
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    viewer.autoRotate = false;
    viewer.animation?.pause();
  } else {
    viewer.autoRotate = true;
    viewer.animation?.pause = false;
  }
});

// Reduce animation complexity on low-end devices
if (navigator.deviceMemory && navigator.deviceMemory < 4) {
  viewer.animation.speed = 0.5; // Slower animation
}
```

### 3. Texture Optimization

Use efficient image formats and sizes:

```javascript
// Option 1: Use WebP with fallback
async function loadOptimizedSkin(username) {
  const webpUrl = `https://example.com/skins/${username}.webp`;
  const fallbackUrl = `https://example.com/skins/${username}.png`;

  try {
    await viewer.loadSkin(webpUrl);
  } catch {
    await viewer.loadSkin(fallbackUrl);
  }
}

// Option 2: Pre-load and cache textures
const textureCache = new Map();

async function loadSkinCached(username) {
  if (textureCache.has(username)) {
    return textureCache.get(username);
  }

  const texture = await viewer.loadSkin(`https://mc-heads.net/skin/${username}`);
  textureCache.set(username, texture);
  return texture;
}

// Option 3: Compress textures
async function loadCompressedSkin(url) {
  // Convert to basis/ktx format for better compression
  const response = await fetch(url + '.basis');
  const data = await response.arrayBuffer();
  await viewer.loadSkin(new Uint8Array(data));
}
```

### 4. Animation Performance

Optimize animations for better performance:

```javascript
import { FunctionAnimation } from 'skin3d';

// Simpler animation for lower-end devices
class OptimizedWalkingAnimation extends FunctionAnimation {
  constructor(player) {
    super(player, function(delta) {
      const t = this.player.animationTime * 0.5; // Slower
      
      // Only rotate key limbs, not everything
      this.player.skin.leftArm.rotation.x = Math.sin(t) * 0.25;
      this.player.skin.rightArm.rotation.x = Math.sin(t + Math.PI) * 0.25;
      // Skip head, body, etc. for performance
    });
  }
}

viewer.animation = new OptimizedWalkingAnimation(viewer.player);
```

### 5. Batch Operations

Group multiple operations:

```javascript
// Bad: Multiple separate operations
await viewer.loadSkin('skin.png');
await viewer.loadCape('cape.png');
await viewer.loadEars('ears.png');
// ^^ Three separate API calls, slower

// Good: Batch load before creating viewer
const [skinData, capeData, earsData] = await Promise.all([
  fetch('skin.png').then(r => r.blob()),
  fetch('cape.png').then(r => r.blob()),
  fetch('ears.png').then(r => r.blob()),
]);

const viewer = new Render({
  canvas: document.getElementById('viewer'),
  width: 800,
  height: 600,
  skin: skinData,
  cape: capeData,
  ears: earsData,
});
```

---

## Custom Animations

### 1. Simple Function Animation

```javascript
import { FunctionAnimation } from 'skin3d';

const spinAnimation = new FunctionAnimation(viewer.player, function(delta) {
  // 'this' is the FunctionAnimation instance
  this.player.rotation.y += delta * 2; // Spin at 2 rad/s
});

viewer.animation = spinAnimation;
```

### 2. Advanced Custom Animation

```javascript
import { PlayerAnimation } from 'skin3d';

class CustomCombatAnimation extends PlayerAnimation {
  constructor(player) {
    super(player);
    this.phase = 0;
  }

  update(delta) {
    this.phase += delta * this.speed;
    
    const t = this.phase;

    // Attack phase: swing arm
    if (t % 2 < 1) {
      // First second: swing up
      this.player.skin.rightArm.rotation.z = Math.min((t % 1) * 2 * Math.PI, Math.PI);
    } else {
      // Second second: return
      this.player.skin.rightArm.rotation.z = Math.max(Math.PI - (t % 1) * 2 * Math.PI, 0);
    }

    // Body leans into attack
    this.player.skin.body.rotation.z = Math.sin(t) * 0.2;
  }
}

viewer.animation = new CustomCombatAnimation(viewer.player);
```

### 3. Physics-Based Animation

```javascript
class PhysicsAnimation extends PlayerAnimation {
  constructor(player) {
    super(player);
    this.limbVelocity = {
      leftArm: { x: 0, y: 0, z: 0 },
      rightArm: { x: 0, y: 0, z: 0 },
    };
    this.gravity = 9.8;
  }

  update(delta) {
    // Apply gravity and velocity to limbs
    const arm = this.player.skin.leftArm;
    
    // Update velocity
    this.limbVelocity.leftArm.z -= this.gravity * delta * 0.01;
    
    // Update rotation
    arm.rotation.z += this.limbVelocity.leftArm.z * delta;
    
    // Apply damping
    this.limbVelocity.leftArm.z *= 0.95;
    
    // Reset on reaching bounds
    if (arm.rotation.z > Math.PI) {
      arm.rotation.z = Math.PI;
      this.limbVelocity.leftArm.z = 0;
    }
  }
}
```

### 4. Animation Blending

```javascript
class BlendedAnimation extends PlayerAnimation {
  constructor(player, animation1, animation2) {
    super(player);
    this.anim1 = animation1;
    this.anim2 = animation2;
    this.blendFactor = 0; // 0 = anim1, 1 = anim2
  }

  update(delta) {
    // Update both animations
    this.anim1.update(delta);
    this.anim2.update(delta);
    
    // Store rotations
    const savedRotations = {};
    this.player.skin.traverse(child => {
      if (child.rotation) {
        savedRotations[child.name] = { ...child.rotation };
      }
    });
    
    // Interpolate between them
    this.player.skin.traverse(child => {
      if (child.rotation) {
        const rot1 = savedRotations[child.name];
        const rot2 = child.rotation;
        
        child.rotation.x = rot1.x * (1 - this.blendFactor) + rot2.x * this.blendFactor;
        child.rotation.y = rot1.y * (1 - this.blendFactor) + rot2.y * this.blendFactor;
        child.rotation.z = rot1.z * (1 - this.blendFactor) + rot2.z * this.blendFactor;
      }
    });
  }
}

// Use it
const blended = new BlendedAnimation(
  viewer.player,
  new WalkingAnimation(viewer.player),
  new IdleAnimation(viewer.player)
);
viewer.animation = blended;

// Animate blend over time
setInterval(() => {
  blended.blendFactor = (blended.blendFactor + 0.01) % 1;
}, 50);
```

---

## Direct Three.js Access

Access and manipulate Three.js objects directly:

### 1. Custom Materials

```javascript
import * as THREE from 'three';

// Replace skin material with custom shader
const viewer = new Render({ ... });

const customMaterial = new THREE.ShaderMaterial({
  uniforms: {
    map: { value: viewer.player.skin.material.map },
    time: { value: 0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D map;
    uniform float time;
    varying vec2 vUv;
    void main() {
      vec2 uv = vUv + sin(time) * 0.01;
      gl_FragColor = texture2D(map, uv);
    }
  `,
});

viewer.player.skin.traverse(child => {
  if (child.isMesh) {
    child.material = customMaterial;
  }
});
```

### 2. Post-Processing Effects

```javascript
import { EffectComposer, RenderPass, ShaderPass } from 'three/examples/jsm/postprocessing/';

const viewer = new Render({ ... });

// Create effect composer
const composer = new EffectComposer(viewer.renderer);
composer.addPass(new RenderPass(viewer.scene, viewer.camera));

// Add bloom effect
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(viewer.width, viewer.height),
  1.5, // strength
  0.4, // radius
  0.85 // threshold
);
composer.addPass(bloomPass);

// Render with effects instead of default
viewer.renderer.render = () => composer.render();
```

### 3. Custom Lighting

```javascript
import * as THREE from 'three';

const viewer = new Render({ ... });

// Add point light
const pointLight = new THREE.PointLight(0xff0000, 1, 100);
pointLight.position.set(50, 0, 0);
viewer.scene.add(pointLight);

// Add spotlight
const spotLight = new THREE.SpotLight(0x00ff00, 1);
spotLight.position.set(0, 50, 0);
spotLight.target.position.set(0, 0, 0);
viewer.scene.add(spotLight);
```

---

## Resource Management

### 1. Memory Management

```javascript
// Track viewers
const viewers = [];

function createViewer(containerId) {
  const viewer = new Render({
    canvas: document.getElementById(containerId),
    width: 400,
    height: 600,
  });
  viewers.push(viewer);
  return viewer;
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  viewers.forEach(viewer => viewer.dispose());
});

// Remove individual viewer
function removeViewer(viewer) {
  viewer.dispose();
  viewers.splice(viewers.indexOf(viewer), 1);
}
```

### 2. Texture Caching

```javascript
class TextureManager {
  constructor() {
    this.cache = new Map();
    this.maxCacheSize = 50 * 1024 * 1024; // 50 MB
    this.currentSize = 0;
  }

  async loadTexture(url) {
    if (this.cache.has(url)) {
      return this.cache.get(url);
    }

    const response = await fetch(url);
    const blob = await response.blob();
    
    // Evict old entries if cache full
    if (this.currentSize + blob.size > this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      const firstBlob = this.cache.get(firstKey);
      this.currentSize -= firstBlob.size;
      this.cache.delete(firstKey);
    }

    this.cache.set(url, blob);
    this.currentSize += blob.size;
    
    return blob;
  }

  clear() {
    this.cache.clear();
    this.currentSize = 0;
  }
}

const textureManager = new TextureManager();
```

---

## Advanced Rendering

### 1. Shadow Mapping

```javascript
// Enable shadows
viewer.renderer.shadowMap.enabled = true;
viewer.globalLight.castShadow = true;
viewer.cameraLight.castShadow = true;

// Configure shadow map
viewer.renderer.shadowMap.type = THREE.PCFShadowShadowMap;

// Make player cast shadows
viewer.player.traverse(child => {
  if (child.isMesh) {
    child.castShadow = true;
    child.receiveShadow = true;
  }
});
```

### 2. Depth of Field

```javascript
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';

const bokehPass = new BokehPass(viewer.scene, viewer.camera, {
  focus: 60,
  aperture: 0.001,
  maxblur: 0.01,
});

// Apply in render loop
viewer.renderPass = bokehPass;
```

---

## Troubleshooting Performance

### Diagnostic Tools

```javascript
// Monitor FPS
let lastTime = performance.now();
let frameCount = 0;
let fps = 0;

viewer.renderer.setAnimationLoop(() => {
  frameCount++;
  const currentTime = performance.now();
  if (currentTime - lastTime >= 1000) {
    fps = frameCount;
    frameCount = 0;
    lastTime = currentTime;
    console.log(`FPS: ${fps}`);
  }
});

// Monitor memory
if (performance.memory) {
  setInterval(() => {
    console.log(`Memory: ${Math.round(performance.memory.usedJSHeapSize / 1048576)} MB`);
  }, 1000);
}

// Check WebGL state
console.log('WebGL Extensions:', viewer.renderer.capabilities);
console.log('Max Texture Size:', viewer.renderer.capabilities.maxTextureSize);
```

### Common Issues

**Issue:** Slow on mobile  
**Solution:** Reduce resolution, disable unnecessary effects, optimize animations

**Issue:** Memory leak  
**Solution:** Always call `viewer.dispose()`, clear caches, remove event listeners

**Issue:** Jittery animation  
**Solution:** Use delta time properly, check for blocking operations, profile code

---

## More Resources

- 📖 **[Getting Started](./GETTING_STARTED.md)** - Installation and basics
- 💡 **[Examples](./EXAMPLES.md)** - Practical code samples
- 📚 **[API Reference](./API_REFERENCE.md)** - Complete API docs
- 🏗️ **[Architecture](./ARCHITECTURE.md)** - Understanding the structure

---

[← Back to Documentation](./README.md)
