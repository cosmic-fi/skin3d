# API Reference

Complete API documentation for the skin3d library.

## Table of Contents

- [Render Class](#render-class)
- [Player Model Classes](#player-model-classes)
- [Animation Classes](#animation-classes)
- [Nametag Classes](#nametag-classes)
- [Type Definitions](#type-definitions)

---

## Render Class

The main class for rendering and controlling Minecraft player models.

### Constructor

```typescript
constructor(options: Options)
```

Creates a new Render instance with the specified options.

**Parameters:**
- `options` - Configuration object (see [Options Interface](#options-interface))

**Example:**
```javascript
const viewer = new Render({
  canvas: document.getElementById('viewer'),
  width: 800,
  height: 600,
  skin: 'https://mc-heads.net/skin/Steve',
});
```

### Properties

#### Canvas & Rendering

```typescript
readonly canvas: HTMLElement
width: number
height: number
background: string | Color
panorama: string | null
```

- `canvas` - The HTML element containing the viewer
- `width` - Width of the viewport in pixels
- `height` - Height of the viewport in pixels
- `background` - Background color (CSS color string or Three.js Color)
- `panorama` - URL to panoramic background image

#### Camera & Controls

```typescript
readonly camera: PerspectiveCamera
readonly controls: OrbitControls
fov: number
zoom: number
autoRotate: boolean
```

- `camera` - Three.js camera object
- `controls` - Orbit controls for user interaction
- `fov` - Field of view in degrees (default: 50)
- `zoom` - Camera zoom level (default: 1)
- `autoRotate` - Enable automatic camera rotation

#### Lighting

```typescript
readonly globalLight: AmbientLight
readonly cameraLight: PointLight
```

- `globalLight` - Ambient light for overall illumination
- `cameraLight` - Light attached to camera for per-pixel lighting

#### Player Model

```typescript
readonly player: PlayerObject
```

Access the player model for direct manipulation.

#### Animation

```typescript
animation: PlayerAnimation | null
```

Get or set the current animation.

#### Name Tag

```typescript
nameTag: string | NameTagObject | null
```

Get or set the name tag (accepts string or NameTagObject instance).

### Methods

#### Loading Assets

```typescript
async loadSkin(source: TextureSource, options?: SkinLoadOptions): Promise<void>
```
Load a new skin texture.

```typescript
async loadCape(source: TextureSource, options?: CapeLoadOptions): Promise<void>
```
Load a cape texture.

```typescript
async loadElytra(source: TextureSource, options?: EarsLoadOptions): Promise<void>
```
Load elytra (wings) texture.

```typescript
async loadEars(source: TextureSource, options?: EarsLoadOptions): Promise<void>
```
Load ear texture.

```typescript
async loadBackground(source: TextureSource): Promise<void>
```
Load a background image.

```typescript
async loadPanorama(source: TextureSource): Promise<void>
```
Load a panoramic background.

#### Rendering Control

```typescript
dispose(): void
```
Clean up resources and dispose the viewer.

```typescript
render(delta?: number): void
```
Manually render a frame (usually called automatically).

#### Camera Operations

```typescript
resetCamera(): void
```
Reset camera to default position and rotation.

---

## Player Model Classes

### PlayerObject

Represents a complete Minecraft player with all equipment.

```typescript
class PlayerObject extends Group {
  skin: SkinObject
  cape: CapeObject | null
  elytra: ElytraObject | null
  ears: EarsObject | null
}
```

**Properties:**
- `skin` - The player's skin mesh
- `cape` - Cape mesh (if loaded)
- `elytra` - Elytra mesh (if loaded)
- `ears` - Ears mesh (if loaded)

### SkinObject

Represents a Minecraft player skin with body parts.

```typescript
class SkinObject extends Group {
  head: BodyPart
  body: BodyPart
  leftArm: BodyPart
  rightArm: BodyPart
  leftLeg: BodyPart
  rightLeg: BodyPart
  layer: Group
}
```

**Properties:**
- `head` - Head mesh
- `body` - Body mesh
- `leftArm` - Left arm mesh
- `rightArm` - Right arm mesh
- `leftLeg` - Left leg mesh
- `rightLeg` - Right leg mesh
- `layer` - Second layer texture overlay

### CapeObject

Represents a cape with physics simulation.

```typescript
class CapeObject extends Group {
  readonly width: number
  readonly height: number
}
```

### ElytraObject

Represents elytra (wings).

```typescript
class ElytraObject extends Group {
  leftWing: Group
  rightWing: Group
}
```

### EarsObject

Represents ear attachments.

```typescript
class EarsObject extends Group {
  leftEar: Group
  rightEar: Group
}
```

### BodyPart

Represents a body part with cube geometry.

```typescript
class BodyPart extends Group {
  readonly width: number
  readonly height: number
  readonly depth: number
}
```

---

## Animation Classes

### PlayerAnimation (Abstract)

Base class for all animations.

```typescript
abstract class PlayerAnimation {
  readonly player: PlayerObject
  speed: number
  paused: boolean
  
  abstract update(delta: number): void
}
```

**Properties:**
- `player` - Reference to the player being animated
- `speed` - Animation speed multiplier (default: 1)
- `paused` - Whether the animation is paused

**Methods:**
- `update(delta)` - Update animation state (called each frame)

### IdleAnimation

Standing idle pose.

```typescript
class IdleAnimation extends PlayerAnimation {
  constructor(player: PlayerObject)
}
```

### WalkingAnimation

Walking animation.

```typescript
class WalkingAnimation extends PlayerAnimation {
  constructor(player: PlayerObject)
}
```

### RunningAnimation

Running animation (faster than walking).

```typescript
class RunningAnimation extends PlayerAnimation {
  constructor(player: PlayerObject)
}
```

### FlyingAnimation

Flying/hovering animation.

```typescript
class FlyingAnimation extends PlayerAnimation {
  constructor(player: PlayerObject)
}
```

### WaveAnimation

Waving animation.

```typescript
class WaveAnimation extends PlayerAnimation {
  constructor(player: PlayerObject)
}
```

### CrouchAnimation

Crouching pose.

```typescript
class CrouchAnimation extends PlayerAnimation {
  constructor(player: PlayerObject)
}
```

### HitAnimation

Getting hit animation (knockback).

```typescript
class HitAnimation extends PlayerAnimation {
  constructor(player: PlayerObject)
}
```

### FunctionAnimation

Custom animation using a callback function.

```typescript
class FunctionAnimation extends PlayerAnimation {
  constructor(
    player: PlayerObject,
    update: (this: FunctionAnimation, delta: number) => void
  )
}
```

**Example:**
```javascript
const customAnimation = new FunctionAnimation(player, function(delta) {
  this.player.skin.head.rotation.y += delta * 2;
});
viewer.animation = customAnimation;
```

---

## Nametag Classes

### NameTagObject

Renders a floating name tag above the player.

```typescript
class NameTagObject extends Sprite {
  text: string
  scale: number
  textStyle: CanvasRenderingContext2D
  
  constructor(text: string, options?: NameTagOptions)
  update(): void
}
```

**Properties:**
- `text` - The text to display
- `scale` - Scale of the name tag
- `textStyle` - Canvas text rendering context

**Methods:**
- `update()` - Refresh the name tag texture

**Example:**
```javascript
const nameTag = new NameTagObject('Steve', {
  scale: 1.5,
  textStyle: {
    fillStyle: '#FFD700',
    font: '32px Minecraft',
  },
});
viewer.nameTag = nameTag;
```

---

## Type Definitions

### Options Interface

```typescript
interface Options {
  // Canvas element
  canvas: HTMLElement
  
  // Dimensions
  width: number
  height: number
  
  // Skin and model
  skin?: TextureSource
  model?: 'default' | 'slim'
  
  // Equipment
  cape?: TextureSource
  ears?: TextureSource
  elytra?: TextureSource
  
  // Controls and lighting
  enableControls?: boolean
  enableLighting?: boolean
  
  // Camera
  fov?: number
  zoom?: number
  autoRotate?: boolean
  
  // Appearance
  background?: string
  panorama?: string
  
  // Animation
  animation?: PlayerAnimation
}
```

### TextureSource

```typescript
type TextureSource = string | ArrayBuffer | Uint8Array | Blob | Canvas
```

Can be:
- URL string
- Binary image data
- HTML Canvas element

### SkinLoadOptions

```typescript
interface SkinLoadOptions extends LoadOptions {
  model?: 'default' | 'slim'
}
```

### CapeLoadOptions

```typescript
interface CapeLoadOptions extends LoadOptions {
  makeVisible?: boolean
}
```

### EarsLoadOptions

```typescript
interface EarsLoadOptions extends LoadOptions {
  textureType?: 'ears' | 'standalone'
}
```

### LoadOptions

```typescript
interface LoadOptions {
  makeVisible?: boolean
}
```

### NameTagOptions

```typescript
interface NameTagOptions {
  scale?: number
  textStyle?: Partial<CanvasRenderingContext2D>
}
```

---

## Common Patterns

### Loading Remote Skins

```javascript
const username = 'Notch';
await viewer.loadSkin(`https://mc-heads.net/skin/${username}`);
```

### Custom Animation

```javascript
const myAnimation = new FunctionAnimation(viewer.player, function(delta) {
  // this.player is the PlayerObject
  this.player.skin.body.rotation.z += Math.sin(delta * 3) * 0.5;
});
viewer.animation = myAnimation;
```

### Responsive Sizing

```javascript
window.addEventListener('resize', () => {
  viewer.width = window.innerWidth;
  viewer.height = window.innerHeight;
});
```

### Camera Presets

```javascript
// Front view
viewer.camera.position.set(0, 0, 60);

// Side view
viewer.camera.position.set(60, 0, 0);

// Top view
viewer.camera.position.set(0, 100, 0);
```

---

## More Resources

- 📖 **[Getting Started](./GETTING_STARTED.md)** - Installation and basic setup
- 💡 **[Examples](./EXAMPLES.md)** - Practical code examples
- 🔧 **[Advanced Usage](./ADVANCED_USAGE.md)** - Performance and optimization
- 🏗️ **[Architecture](./ARCHITECTURE.md)** - Understanding the structure

---

[← Back to Documentation](./README.md)
