# Troubleshooting Guide

Common issues and their solutions for skin3d.

## Installation & Setup Issues

### Issue: "Module not found: 'skin3d'"

**Symptoms:** Import errors like `Cannot find module 'skin3d'`

**Solutions:**
1. Install the package:
```bash
npm install skin3d
```

2. Check package.json includes it:
```bash
npm ls skin3d
```

3. Clear cache and reinstall:
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

4. For yarn users:
```bash
yarn cache clean
yarn install
```

---

### Issue: TypeScript Errors

**Symptoms:** "Cannot find name 'Render'" or type errors

**Solutions:**
1. Ensure types are installed (should be automatic with npm 7+)
2. Check tsconfig.json has proper module resolution:
```json
{
  "compilerOptions": {
    "module": "esnext",
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```

3. Import with proper types:
```typescript
import { Render, Options } from 'skin3d';

const options: Options = { ... };
const viewer: Render = new Render(options);
```

---

### Issue: Bundle Size Too Large

**Symptoms:** Build warnings about large bundle size

**Solutions:**
1. Use named imports (better tree-shaking):
```javascript
// Bad
import * as skin3d from 'skin3d';

// Good
import { Render, WalkingAnimation } from 'skin3d';
```

2. Lazy load skin3d:
```javascript
// Load only when needed
const { Render } = await import('skin3d');
```

3. Use CDN bundle instead:
```html
<script src="https://cdn.jsdelivr.net/npm/skin3d@latest/bundles/skin3d.umd.js"></script>
```

---

## Rendering Issues

### Issue: Blank/Black Canvas

**Symptoms:** Canvas shows nothing or is black

**Solutions:**
1. Verify canvas element exists:
```javascript
const canvas = document.getElementById('viewer');
if (!canvas) {
  console.error('Canvas element not found!');
}
```

2. Check canvas dimensions:
```javascript
console.log('Canvas size:', viewer.width, 'x', viewer.height);
if (viewer.width === 0 || viewer.height === 0) {
  console.warn('Canvas has zero dimensions');
}
```

3. Verify WebGL is supported:
```javascript
const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
console.log('WebGL supported:', !!gl);
```

4. Check for console errors (F12 → Console)

---

### Issue: Skin Doesn't Load

**Symptoms:** Viewer shows but skin texture is missing

**Solutions:**
1. Verify image URL is correct:
```javascript
// Test if image loads
const img = new Image();
img.onload = () => console.log('Image loads successfully');
img.onerror = () => console.error('Image failed to load');
img.src = 'YOUR_SKIN_URL';
```

2. Check CORS (Cross-Origin Resource Sharing):
```javascript
// Should not have CORS errors in console
// If you do, the server must allow CORS

// For testing, try a known working skin:
await viewer.loadSkin('https://mc-heads.net/skin/Steve');
```

3. Verify image format:
- Must be PNG or valid image format
- Minecraft skins are typically 64x32 or 64x64 pixels
- Must have proper texture coordinates

4. Check for errors in console:
```javascript
try {
  await viewer.loadSkin('https://example.com/skin.png');
} catch (error) {
  console.error('Failed to load skin:', error);
}
```

---

### Issue: Low Frame Rate / Jittery

**Symptoms:** Animation is slow or stutters

**Solutions:**
1. Reduce viewport size:
```javascript
// Instead of fullscreen
const viewer = new Render({
  width: 800,  // Instead of window.innerWidth
  height: 600, // Instead of window.innerHeight
});
```

2. Disable unnecessary features:
```javascript
viewer.enableControls = false;  // Disable if not needed
viewer.enableLighting = false;  // Disable if not needed
```

3. Simplify animation:
```javascript
viewer.animation.speed = 0.5; // Slower = less processing
```

4. Check device capabilities:
```javascript
if (navigator.deviceMemory < 4) {
  // Low-end device - reduce quality
  viewer.width = window.innerWidth * 0.75;
  viewer.height = window.innerHeight * 0.75;
}
```

5. Monitor performance:
```javascript
const stats = new Stats(); // npm install stats.js
document.body.appendChild(stats.dom);

function animate() {
  stats.update();
  viewer.render();
  requestAnimationFrame(animate);
}
```

---

## Texture & Cape Issues

### Issue: Cape Doesn't Appear

**Symptoms:** Cape is loaded but not visible

**Solutions:**
1. Ensure cape loaded successfully:
```javascript
try {
  await viewer.loadCape('https://mc-heads.net/cape/Notch');
  console.log('Cape loaded');
} catch (error) {
  console.error('Cape failed to load:', error);
}
```

2. Check if cape is visible:
```javascript
if (viewer.player.cape) {
  console.log('Cape exists, visible:', viewer.player.cape.visible);
  viewer.player.cape.visible = true;
}
```

3. Verify cape dimensions:
- Minecraft capes are 64x32 pixels
- Must be PNG format
- Needs proper texture coordinates

---

### Issue: Multiple Textures Conflict

**Symptoms:** Loading new skin removes cape or vice versa

**Solutions:**
1. Load all textures upfront:
```javascript
const viewer = new Render({
  canvas: document.getElementById('viewer'),
  width: 800,
  height: 600,
  skin: 'skin.png',
  cape: 'cape.png',
  ears: 'ears.png',
});
```

2. Or load asynchronously without conflicting:
```javascript
await viewer.loadSkin('new_skin.png');
// Cape should persist, but verify:
if (!viewer.player.cape) {
  await viewer.loadCape('cape.png');
}
```

---

## Control Issues

### Issue: Mouse Controls Don't Work

**Symptoms:** Can't rotate/zoom the viewer

**Solutions:**
1. Verify controls are enabled:
```javascript
viewer.controls.enableRotate = true;
viewer.controls.enableZoom = true;
viewer.controls.enablePan = true;
```

2. Check if canvas has focus:
```javascript
viewer.canvas.addEventListener('focus', () => {
  console.log('Canvas has focus');
});
```

3. Verify mouse events are firing:
```javascript
viewer.canvas.addEventListener('mousedown', (e) => {
  console.log('Mouse down at', e.x, e.y);
});
```

4. Check for event listener conflicts:
```javascript
// Some libraries might prevent default mouse events
viewer.canvas.addEventListener('mousedown', (e) => {
  e.preventDefault();
  e.stopPropagation();
  return false;
});
```

---

### Issue: Touch Controls Not Working (Mobile)

**Symptoms:** Gestures don't work on mobile devices

**Solutions:**
1. Enable touch support (usually automatic)
2. Use touch events if needed:
```javascript
viewer.canvas.addEventListener('touchstart', (e) => {
  console.log('Touch detected');
});
```

3. Add touch-specific UI feedback:
```css
#viewer {
  touch-action: none; /* Allow gestures */
  -webkit-user-select: none;
  user-select: none;
}
```

---

## Animation Issues

### Issue: Animation Not Playing

**Symptoms:** Animation set but nothing moves

**Solutions:**
1. Verify animation is set:
```javascript
console.log('Current animation:', viewer.animation);
if (!viewer.animation) {
  viewer.animation = new WalkingAnimation();
}
```

2. Check animation update:
```javascript
const anim = viewer.animation;
console.log('Animation paused:', anim?.paused);
console.log('Animation speed:', anim?.speed);
```

3. Verify player object exists:
```javascript
if (!viewer.player) {
  console.error('Player object not initialized');
}
```

---

### Issue: Animation Stutters or Stops

**Symptoms:** Animation starts then stops or jerks

**Solutions:**
1. Check for errors:
```javascript
try {
  viewer.animation = new CustomAnimation(viewer.player);
} catch (error) {
  console.error('Animation error:', error);
}
```

2. Verify animation update is called:
```javascript
class DebugAnimation extends PlayerAnimation {
  update(delta) {
    console.log('Update called with delta:', delta);
    // ... animation logic
  }
}
```

3. Check for infinite loops or blocking operations

---

## Memory Issues

### Issue: Memory Leak / Increasing Memory Usage

**Symptoms:** Memory keeps growing, browser slows down

**Solutions:**
1. Dispose viewers when done:
```javascript
// Clean up
viewer.dispose();

// Remove from DOM
viewer.canvas.remove();
```

2. Clear caches if used:
```javascript
// If you have a texture cache
textureCache.clear();
```

3. Remove event listeners:
```javascript
// Before removing viewer
window.removeEventListener('resize', resizeHandler);
```

4. Check for circular references:
```javascript
// Avoid storing viewer in closures unnecessarily
viewer = null; // Allow garbage collection
```

---

### Issue: WebGL Context Lost

**Symptoms:** WebGL error, canvas goes black

**Solutions:**
1. Implement context loss handling:
```javascript
viewer.renderer.context.canvas.addEventListener('webglcontextlost', (e) => {
  e.preventDefault();
  console.warn('WebGL context lost');
});

viewer.renderer.context.canvas.addEventListener('webglcontextrestored', () => {
  console.log('WebGL context restored');
  // Reload resources if needed
});
```

2. Reduce number of viewers if many on page
3. Check device memory usage

---

## Browser Compatibility

### Issue: "WebGL not supported"

**Symptoms:** WebGL context creation fails

**Solutions:**
1. Check browser support:
```javascript
function isWebGLSupported() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && 
      (canvas.getContext('webgl') || canvas.getContext('webgl2')));
  } catch(e) {
    return false;
  }
}

if (!isWebGLSupported()) {
  console.error('WebGL not supported on this browser');
}
```

2. Update browser (WebGL requires fairly modern browser)
3. Check hardware (some older computers/mobile don't support it)

---

### Issue: Shader Compilation Error

**Symptoms:** Three.js shader error in console

**Solutions:**
1. Check browser WebGL extensions:
```javascript
const extensions = viewer.renderer.capabilities;
console.log('Max texture size:', extensions.maxTextureSize);
```

2. Use simpler shaders if needed
3. Check WebGL version support:
```javascript
const gl = viewer.renderer.getContext();
console.log('WebGL version:', gl.getParameter(gl.VERSION));
```

---

## Getting Further Help

If you can't find a solution:

1. **Check the Examples** - [EXAMPLES.md](./EXAMPLES.md)
2. **Read the Docs** - [DOCS/README.md](./README.md)
3. **GitHub Issues** - https://github.com/cosmic-fi/skin3d/issues
4. **Community Chat** - https://matrix.to/#/#skin3d:gitter.im

**When reporting an issue, include:**
- Browser and version
- Console error messages
- Minimal reproduction code
- Expected vs actual behavior

---

## Performance Checklist

- [ ] Canvas has valid dimensions
- [ ] WebGL is supported
- [ ] Skin image loads successfully
- [ ] Animation is not paused
- [ ] No errors in console
- [ ] Memory usage is stable
- [ ] Frame rate is acceptable
- [ ] Controls respond to input

---

[← Back to Documentation](./README.md)
