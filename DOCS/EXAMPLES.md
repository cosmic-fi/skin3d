# Examples

Collection of practical examples for using skin3d in different scenarios.

---

## Example 1: Basic Player Viewer

The simplest way to display a Minecraft player skin.

```javascript
import { Render } from 'skin3d';

const viewer = new Render({
  canvas: document.getElementById('viewer'),
  width: 400,
  height: 600,
  skin: 'https://mc-heads.net/skin/Notch',
  autoRotate: true,
});
```

---

## Example 2: Complete Player Profile

Display a player with skin, cape, and name tag.

```javascript
import { Render, NameTagObject } from 'skin3d';

const viewer = new Render({
  canvas: document.getElementById('viewer'),
  width: 600,
  height: 800,
  skin: 'https://mc-heads.net/skin/Steve',
  cape: 'https://mc-heads.net/cape/Notch',
  model: 'default',
  background: '#87CEEB', // Sky blue
});

// Add name tag
viewer.nameTag = new NameTagObject('Steve', {
  scale: 1.5,
  textStyle: '#FFD700', // Gold color
});

// Enable interactions
viewer.controls.enableRotate = true;
viewer.controls.enableZoom = true;
viewer.controls.enablePan = true;
```

---

## Example 3: Animations

Use different animations to bring the player to life.

```javascript
import { 
  Render, 
  IdleAnimation, 
  WalkingAnimation, 
  RunningAnimation,
  FlyingAnimation 
} from 'skin3d';

const viewer = new Render({
  canvas: document.getElementById('viewer'),
  width: 400,
  height: 600,
  skin: 'https://mc-heads.net/skin/Steve',
  enableControls: true,
});

// Create animation buttons
document.getElementById('idle').addEventListener('click', () => {
  viewer.animation = new IdleAnimation();
});

document.getElementById('walk').addEventListener('click', () => {
  viewer.animation = new WalkingAnimation();
});

document.getElementById('run').addEventListener('click', () => {
  viewer.animation = new RunningAnimation();
});

document.getElementById('fly').addEventListener('click', () => {
  viewer.animation = new FlyingAnimation();
});

// Stop animation
document.getElementById('stop').addEventListener('click', () => {
  viewer.animation = null;
});
```

**HTML:**
```html
<div id="viewer"></div>
<div class="controls">
  <button id="idle">Idle</button>
  <button id="walk">Walk</button>
  <button id="run">Run</button>
  <button id="fly">Fly</button>
  <button id="stop">Stop</button>
</div>
```

---

## Example 4: Dynamic Skin Loading

Load different skins based on user input (e.g., Minecraft username).

```javascript
import { Render } from 'skin3d';

const viewer = new Render({
  canvas: document.getElementById('viewer'),
  width: 400,
  height: 600,
  skin: 'https://mc-heads.net/skin/Steve',
});

const usernameInput = document.getElementById('username');
const loadButton = document.getElementById('load-skin');

loadButton.addEventListener('click', async () => {
  const username = usernameInput.value.trim();
  if (!username) return;

  try {
    const skinUrl = `https://mc-heads.net/skin/${username}`;
    const capeUrl = `https://mc-heads.net/cape/${username}`;

    await viewer.loadSkin(skinUrl);
    await viewer.loadCape(capeUrl).catch(() => {
      // Cape may not exist for all players
    });

    viewer.nameTag = username;
  } catch (error) {
    console.error('Failed to load skin:', error);
    alert('Could not find player skin');
  }
});
```

**HTML:**
```html
<input type="text" id="username" placeholder="Enter Minecraft username">
<button id="load-skin">Load Skin</button>
<div id="viewer"></div>
```

---

## Example 5: Responsive Sizing

Make the viewer responsive to window size changes.

```javascript
import { Render } from 'skin3d';

const viewer = new Render({
  canvas: document.getElementById('viewer'),
  width: window.innerWidth,
  height: window.innerHeight,
  skin: 'https://mc-heads.net/skin/Steve',
});

// Handle window resize
window.addEventListener('resize', () => {
  viewer.width = window.innerWidth;
  viewer.height = window.innerHeight;
});

// Prevent context menu on right-click (for better UX)
viewer.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
```

---

## Example 6: Custom Styling and Theming

Apply custom styles and create a themed viewer.

```javascript
import { Render, WalkingAnimation } from 'skin3d';

const viewer = new Render({
  canvas: document.getElementById('viewer'),
  width: 500,
  height: 700,
  skin: 'https://mc-heads.net/skin/Steve',
  cape: 'https://mc-heads.net/cape/Notch',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  autoRotate: true,
});

// Adjust lighting
viewer.globalLight.intensity = 1.2;
viewer.cameraLight.intensity = 0.5;

// Set animation
viewer.animation = new WalkingAnimation();
viewer.animation.speed = 0.75;

// Customize name tag
viewer.nameTag.textStyle.fillStyle = '#FFD700';
viewer.nameTag.scale = 2;
```

**CSS:**
```css
#viewer-container {
  border: 3px solid #667eea;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

#viewer-container canvas {
  display: block;
  width: 100%;
  height: 100%;
}
```

---

## Example 7: Multiple Viewers

Display multiple player models on the same page.

```javascript
import { Render } from 'skin3d';

const players = ['Steve', 'Alex', 'Notch'];

players.forEach((playerName, index) => {
  const viewer = new Render({
    canvas: document.getElementById(`viewer-${index}`),
    width: 300,
    height: 400,
    skin: `https://mc-heads.net/skin/${playerName}`,
    autoRotate: true,
  });

  viewer.nameTag = playerName;
});
```

**HTML:**
```html
<div class="player-grid">
  <div id="viewer-0"></div>
  <div id="viewer-1"></div>
  <div id="viewer-2"></div>
</div>
```

**CSS:**
```css
.player-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}
```

---

## Example 8: Camera Controls and Presets

Provide preset camera angles.

```javascript
import { Render } from 'skin3d';

const viewer = new Render({
  canvas: document.getElementById('viewer'),
  width: 400,
  height: 600,
  skin: 'https://mc-heads.net/skin/Steve',
  enableControls: true,
});

// Define camera presets
const cameraPresets = {
  front: { position: [0, 0, 60], rotation: 0 },
  side: { position: [60, 0, 0], rotation: Math.PI / 2 },
  back: { position: [0, 0, -60], rotation: Math.PI },
  isometric: { position: [50, 40, 50], rotation: Math.PI / 4 },
};

// Create preset buttons
document.getElementById('front').addEventListener('click', () => {
  viewer.camera.position.set(0, 0, 60);
  viewer.controls.target.set(0, 0, 0);
  viewer.controls.update();
});

document.getElementById('side').addEventListener('click', () => {
  viewer.camera.position.set(60, 0, 0);
  viewer.controls.target.set(0, 0, 0);
  viewer.controls.update();
});

document.getElementById('reset').addEventListener('click', () => {
  viewer.camera.position.set(0, 0, 60);
  viewer.controls.reset();
});
```

---

## Example 9: Ears and Elytra

Load different equipment types.

```javascript
import { Render } from 'skin3d';

const viewer = new Render({
  canvas: document.getElementById('viewer'),
  width: 400,
  height: 600,
  skin: 'https://mc-heads.net/skin/Steve',
  model: 'default',
});

// Load ears
document.getElementById('load-ears').addEventListener('click', async () => {
  await viewer.loadEars('path/to/ears.png', { textureType: 'standalone' });
});

// Load elytra
document.getElementById('load-elytra').addEventListener('click', async () => {
  await viewer.loadElytra('path/to/elytra.png');
});

// Remove equipment
document.getElementById('remove-ears').addEventListener('click', () => {
  viewer.player?.ears?.visible = false;
});

document.getElementById('remove-elytra').addEventListener('click', () => {
  viewer.player?.elytra?.visible = false;
});
```

---

## Example 10: Event Handling

Respond to user interactions and viewer events.

```javascript
import { Render } from 'skin3d';

const viewer = new Render({
  canvas: document.getElementById('viewer'),
  width: 400,
  height: 600,
  skin: 'https://mc-heads.net/skin/Steve',
  enableControls: true,
});

// Mouse events
viewer.canvas.addEventListener('mouseenter', () => {
  console.log('Mouse entered viewer');
  viewer.autoRotate = false;
});

viewer.canvas.addEventListener('mouseleave', () => {
  console.log('Mouse left viewer');
  viewer.autoRotate = true;
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === '1') viewer.animation = new IdleAnimation();
  if (e.key === '2') viewer.animation = new WalkingAnimation();
  if (e.key === 'r') viewer.camera.position.set(0, 0, 60);
});

// Camera change events
viewer.controls.addEventListener('change', () => {
  console.log('Camera moved');
});
```

---

## More Resources

- 📚 **[API Reference](./API_REFERENCE.md)** - All available methods and properties
- 🔧 **[Advanced Usage](./ADVANCED_USAGE.md)** - Performance tips and extensions
- 🏗️ **[Architecture](./ARCHITECTURE.md)** - Understanding the library structure

---

[← Back to Documentation](./README.md)
