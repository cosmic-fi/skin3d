# Architecture Guide

Understanding the skin3d library structure and design patterns.

## Project Structure

```
skin3d/
├── src/
│   ├── index.ts          # Main entry point, exports all public APIs
│   ├── Render.ts         # Core rendering engine
│   ├── Model.ts          # Player model and mesh components
│   ├── Animation.ts      # Animation system
│   └── Nametag.ts        # Name tag rendering
├── libs/                 # Compiled JavaScript output
├── bundles/              # UMD and ESM bundles
├── DOCS/                 # Documentation
└── package.json          # NPM configuration
```

---

## Core Modules

### 1. Render.ts (Rendering Engine)

**Responsibility:** Main rendering pipeline, scene management, and user-facing API.

**Key Components:**
- `Render` class - Main public API
- Scene setup and WebGL context management
- Camera and controls initialization
- Lighting system
- Animation loop

**Key Interfaces:**
- `Options` - Configuration for viewer initialization
- `RenderOptions` - Common render options
- `SkinRenderOptions`, `CapeRenderOptions`, `EarsRenderOptions` - Specific render options

**Example:**
```typescript
export class Render {
  canvas: HTMLElement
  width: number
  height: number
  camera: PerspectiveCamera
  controls: OrbitControls
  player: PlayerObject
  
  constructor(options: Options) { ... }
  
  async loadSkin(source: TextureSource): Promise<void> { ... }
  async loadCape(source: TextureSource): Promise<void> { ... }
  // ... more methods
}
```

### 2. Model.ts (Player Models)

**Responsibility:** All player model components and mesh geometry.

**Class Hierarchy:**
```
Group (Three.js)
├── PlayerObject
│   ├── SkinObject
│   │   ├── BodyPart (head, body, arms, legs)
│   │   └── Layer (second texture layer)
│   ├── CapeObject
│   ├── ElytraObject
│   │   ├── leftWing
│   │   └── rightWing
│   └── EarsObject
│       ├── leftEar
│       └── rightEar
```

**Key Classes:**
- `PlayerObject` - Complete player model
- `SkinObject` - Skin geometry and textures
- `BodyPart` - Individual body part (cube with texture)
- `CapeObject` - Cape with physics
- `ElytraObject` - Wing model
- `EarsObject` - Ear attachments

**Geometry Details:**
- Each body part is modeled as a cube with proper texture coordinates
- Skin texture is 64x64 pixels (or 32x64 for legacy)
- Layer (second skin layer) is rendered on top of base skin
- Physics simulation for cape movements

### 3. Animation.ts (Animation System)

**Responsibility:** Animation logic and built-in animation presets.

**Architecture:**
```
PlayerAnimation (abstract base)
├── IdleAnimation
├── WalkingAnimation
├── RunningAnimation
├── FlyingAnimation
├── WaveAnimation
├── CrouchAnimation
├── HitAnimation
└── FunctionAnimation (custom)
```

**How Animations Work:**
1. Each animation extends `PlayerAnimation`
2. Animations update body part rotations each frame via `update(delta)`
3. Delta time allows frame-rate independent animations
4. Speed property controls animation speed multiplier

**Example Animation Implementation:**
```typescript
export class WalkingAnimation extends PlayerAnimation {
  update(delta: number): void {
    const t = this.time * this.speed;
    
    // Swing arms
    this.player.skin.leftArm.rotation.x = Math.sin(t) * 0.5;
    this.player.skin.rightArm.rotation.x = Math.sin(t + Math.PI) * 0.5;
    
    // Swing legs
    this.player.skin.leftLeg.rotation.x = Math.sin(t + Math.PI) * 0.5;
    this.player.skin.rightLeg.rotation.x = Math.sin(t) * 0.5;
    
    // Slight head bob
    this.player.skin.head.position.y = Math.sin(t * 2) * 0.3;
  }
}
```

### 4. Nametag.ts (Name Tag Rendering)

**Responsibility:** Floating name tag display above player.

**Implementation:**
- Uses Three.js `Sprite` and `SpriteMaterial`
- Renders text on HTML Canvas
- Canvas converted to texture
- Always faces camera (billboarding)

**Key Class:**
```typescript
export class NameTagObject extends Sprite {
  text: string
  scale: number
  textStyle: CanvasRenderingContext2D
  
  update(): void { ... }
}
```

### 5. Index.ts (Public API)

**Responsibility:** Export all public classes and types.

```typescript
export * from "./Model.js"
export * from "./Render.js"
export * from "./Animation.js"
export * from "./Nametag.js"
```

---

## Data Flow

### Loading a Skin

```
User calls: viewer.loadSkin(url)
    ↓
Render.loadSkin() receives TextureSource
    ↓
Load image (via skinview-utils)
    ↓
Parse as Minecraft skin texture
    ↓
Create Three.js Texture object
    ↓
Apply to SkinObject material
    ↓
Update layer (second skin layer)
    ↓
Render updates on next frame
```

### Animation Update Loop

```
Browser requestAnimationFrame
    ↓
Render.render(delta) called
    ↓
Animation.update(delta) called (if animation set)
    ↓
Body part rotations updated
    ↓
Three.js render() called
    ↓
WebGL draws frame
```

---

## Design Patterns

### 1. Inheritance Chain

All visible models inherit from Three.js `Group`:
- Better for transform hierarchies
- Simpler parent-child relationships
- Native Three.js compatibility

### 2. Event-Driven Updates

- Frame updates via `requestAnimationFrame`
- Optional resize listener for responsive sizing
- Can extend with custom event handlers

### 3. Async Asset Loading

- All texture loading is async
- Prevents blocking main thread
- Uses `skinview-utils` for format handling

### 4. Modular Components

- Each module handles one responsibility
- Clear separation of concerns
- Easy to test and maintain
- Can be imported individually if needed

### 5. Type Safety

- Full TypeScript support
- Comprehensive interface definitions
- Type definitions exported for consumer use

---

## Integration with Three.js

Skin3d is built on top of Three.js and exposes key objects:

```typescript
const viewer = new Render({ ... });

// Access Three.js objects
viewer.camera        // PerspectiveCamera
viewer.controls      // OrbitControls
viewer.player        // Three.js Group
viewer.player.skin   // Three.js Group
// ... access geometry, materials, textures, etc.
```

This allows advanced users to directly manipulate the scene using Three.js APIs.

---

## Performance Considerations

### Rendering Optimization

- **Cull unused objects:** Set `visible = false` for unused parts
- **Optimize animations:** Use simpler animations for better performance
- **Batch operations:** Load multiple skins at once
- **Dispose unused viewers:** Call `viewer.dispose()` to free resources

### Memory Management

- Each `Render` instance creates a WebGL context
- Limit number of active viewers on same page
- Dispose viewers when no longer needed
- Use canvas size appropriate for viewport

### Texture Optimization

- Use efficient image formats (PNG recommended)
- Minimize texture size when possible
- Reuse textures across multiple viewers
- Consider image caching and CDN delivery

---

## Extending Skin3d

### Custom Animations

```typescript
import { FunctionAnimation, PlayerAnimation } from 'skin3d';

// Option 1: Using FunctionAnimation
const spin = new FunctionAnimation(viewer.player, function(delta) {
  this.player.rotation.y += delta * 3;
});
viewer.animation = spin;

// Option 2: Extending PlayerAnimation
class CustomAnimation extends PlayerAnimation {
  update(delta: number): void {
    // Your animation logic
  }
}
viewer.animation = new CustomAnimation(viewer.player);
```

### Custom Materials

```typescript
import { viewer } from 'skin3d';
import * as THREE from 'three';

// Replace skin material
const customMaterial = new THREE.MeshPhongMaterial({
  map: viewer.player.skin.material.map,
  shininess: 100,
});
viewer.player.skin.traverse(child => {
  if (child.isMesh) child.material = customMaterial;
});
```

---

## Building and Distribution

### Build Output

- **libs/** - Compiled JavaScript modules (ESM)
- **bundles/** - UMD bundle for direct script inclusion
- **docs/** - TypeDoc generated API documentation

### Build Commands

```bash
npm run build:modules    # Compile TypeScript
npm run build:bundles    # Create UMD bundles
npm run build:docs       # Generate documentation
npm run build            # Build everything
```

---

## Dependency Graph

```
Render (main user API)
├── Model (player geometry)
│   └── skinview-utils (texture parsing)
├── Animation (movement logic)
│   └── Model
├── Nametag (UI element)
│   └── Three.js
└── Three.js (3D graphics library)
    └── WebGL
```

Only production dependencies:
- `three` - 3D rendering
- `skinview-utils` - Minecraft texture utilities

---

## Contributing to Architecture

When modifying the architecture:

1. **Maintain modularity** - Keep concerns separated
2. **Preserve API stability** - Don't break existing interfaces
3. **Add types** - Use TypeScript for type safety
4. **Document changes** - Update relevant docs
5. **Test thoroughly** - Ensure backwards compatibility

---

## More Resources

- 📖 **[API Reference](./API_REFERENCE.md)** - Detailed class documentation
- 💡 **[Examples](./EXAMPLES.md)** - Practical code examples
- 🔧 **[Advanced Usage](./ADVANCED_USAGE.md)** - Performance tips and tricks

---

[← Back to Documentation](./README.md)
