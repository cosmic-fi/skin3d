# Migration Guide

Guide for upgrading from previous versions to the latest version of skin3d.

## Version 0.1.0 - Major Refactoring

### Overview

Version 0.1.0 introduces a significant refactoring of the library structure with a focus on modularity, maintainability, and developer experience. While the public API remains largely compatible, some internal changes may affect your usage.

---

## Breaking Changes

### 1. Main Class Renamed: View → Render

**Before (≤ 0.0.10):**
```javascript
import { View } from 'skin3d';

const viewer = new View({
  canvas: document.getElementById('viewer'),
  width: 800,
  height: 600,
});
```

**After (≥ 0.1.0):**
```javascript
import { Render } from 'skin3d';

const viewer = new Render({
  canvas: document.getElementById('viewer'),
  width: 800,
  height: 600,
});
```

**Migration:** Replace `View` with `Render` in your imports.

### 2. Entry Point Changes

**Before:**
```javascript
import * as skin3d from 'skin3d';
const viewer = new skin3d.View({ ... });
```

**After:**
```javascript
import { Render, Animation, Model, NameTagObject } from 'skin3d';
const viewer = new Render({ ... });
```

**Migration:** Use named imports for better tree-shaking and clarity.

---

## Non-Breaking Changes

### File Name Case Changes

The following source files were renamed with proper casing:

| Old Name | New Name | Notes |
|----------|----------|-------|
| `view.ts` | `Render.ts` | Main rendering engine |
| `model.ts` | `Model.ts` | Player model classes |
| `animation.ts` | `Animation.ts` | Animation system |
| `nametag.ts` | `Nametag.ts` | Name tag rendering |
| `skin3d.ts` | `index.ts` | Main entry point |

This improves code organization but doesn't affect the import API.

### Module Structure

**Before:**
```javascript
import * as skin3d from 'skin3d';
// Everything accessible as skin3d.ClassName
```

**After:**
```javascript
import { Render, WalkingAnimation, PlayerObject } from 'skin3d';
// Use named imports directly
```

---

## Migration Checklist

### Step 1: Update Imports

**Before:**
```javascript
import { View } from 'skin3d';
import * as skin3d from 'skin3d';

const viewer = new View({ ... });
const animation = new skin3d.WalkingAnimation();
```

**After:**
```javascript
import { Render, WalkingAnimation } from 'skin3d';

const viewer = new Render({ ... });
const animation = new WalkingAnimation();
```

### Step 2: Update Class References

Search and replace in your codebase:
- `new View(` → `new Render(`
- `instanceof View` → `instanceof Render`
- `View` type references → `Render`

### Step 3: Test Your Application

1. Run your build process
2. Check for TypeScript errors
3. Test in browser for runtime errors
4. Verify all animations work correctly

### Step 4: Update Dependencies

Ensure you're using the latest version:

```bash
npm install skin3d@latest
```

---

## Common Migration Scenarios

### Scenario 1: Basic Viewer Setup

**Before:**
```javascript
import { View } from 'skin3d';

const viewer = new View({
  canvas: document.getElementById('viewer'),
  width: 400,
  height: 600,
  skin: 'skin.png',
});
```

**After:**
```javascript
import { Render } from 'skin3d';

const viewer = new Render({
  canvas: document.getElementById('viewer'),
  width: 400,
  height: 600,
  skin: 'skin.png',
});
```

**Status:** ✅ No changes needed (besides class name)

### Scenario 2: Using Animations

**Before:**
```javascript
import { View } from 'skin3d';

const viewer = new View({ ... });
const walk = new viewer.animation.WalkingAnimation();
viewer.animation = walk;
```

**After:**
```javascript
import { Render, WalkingAnimation } from 'skin3d';

const viewer = new Render({ ... });
const walk = new WalkingAnimation();
viewer.animation = walk;
```

**Status:** ✅ Import animations directly

### Scenario 3: Accessing Player Object

**Before:**
```javascript
const viewer = new View({ ... });
viewer.player.skin.head.rotation.x += 0.5;
```

**After:**
```javascript
const viewer = new Render({ ... });
viewer.player.skin.head.rotation.x += 0.5;
```

**Status:** ✅ No API changes

### Scenario 4: Name Tags

**Before:**
```javascript
import { View } from 'skin3d';

const viewer = new View({ ... });
viewer.nameTag = 'Steve';
```

**After:**
```javascript
import { Render, NameTagObject } from 'skin3d';

const viewer = new Render({ ... });
viewer.nameTag = new NameTagObject('Steve');
// or simply
viewer.nameTag = 'Steve'; // automatic conversion
```

**Status:** ✅ Both methods work

---

## API Compatibility Matrix

| Feature | < 0.1.0 | 0.1.0+ | Status |
|---------|----------|---------|--------|
| View class | ✅ | ❌ | Use `Render` instead |
| Render class | ❌ | ✅ | Recommended |
| Named imports | ⚠️ | ✅ | Preferred method |
| Wildcard imports | ✅ | ✅ | Still works |
| Animation system | ✅ | ✅ | Unchanged |
| Model access | ✅ | ✅ | Unchanged |
| Loading methods | ✅ | ✅ | Unchanged |
| Name tags | ✅ | ✅ | Unchanged |

---

## TypeScript Support

Version 0.1.0 includes full TypeScript definitions:

```typescript
import { Render, Options, PlayerAnimation } from 'skin3d';

const options: Options = {
  canvas: document.getElementById('viewer') as HTMLElement,
  width: 800,
  height: 600,
  skin: 'skin.png',
};

const viewer: Render = new Render(options);
const animation: PlayerAnimation = null;
```

---

## Performance Improvements

Version 0.1.0 includes performance optimizations:

- ✅ Reduced bundle size (~10% smaller)
- ✅ Better tree-shaking with named exports
- ✅ Optimized animation updates
- ✅ Improved memory management

---

## Deprecation Policy

### Currently Deprecated

- `View` class name (use `Render` instead)

### Will Remain Compatible

- All animation classes
- All model classes
- Loading methods (loadSkin, loadCape, etc.)
- Camera and controls APIs
- Configuration options

---

## Rollback Instructions

If you need to stay on the previous version:

```bash
npm install skin3d@0.0.11
```

Previous version documentation is available at:
- [NPM Archive](https://www.npmjs.com/package/skin3d/v/0.0.10)
- [GitHub Releases](https://github.com/cosmic-fi/skin3d/releases/tag/0.0.10)

---

## Getting Help

If you encounter issues during migration:

1. **Check Examples** - See [Examples](./EXAMPLES.md) for working code
2. **Read API Docs** - Review [API Reference](./API_REFERENCE.md)
3. **Open Issue** - [GitHub Issues](https://github.com/cosmic-fi/skin3d/issues)
4. **Chat Support** - [Gitter Community](https://matrix.to/#/#skin3d:gitter.im)

---

## Version History

### v0.1.0 (December 2025)
- 🎨 Refactored library structure
- 📦 Improved module organization
- ✨ Enhanced documentation suite
- 🧹 Dependency cleanup
- 📚 8 comprehensive documentation files

### v0.0.10 and earlier
- See [ChangeLog](../ChangeLog) for details

---

## FAQ

**Q: Do I have to migrate to v0.1.0?**  
A: No, earlier versions continue to work. However, we recommend upgrading for the improved architecture, better documentation, and future features.

**Q: Will my existing code break?**  
A: Only if you're using the `View` class directly. Simply replace with `Render`.

**Q: What about tree-shaking?**  
A: v0.1.0 supports better tree-shaking with named exports. Use named imports for optimal results.

**Q: Is the API backward compatible?**  
A: Yes, except for the `View` → `Render` rename. All other APIs remain unchanged.

---

[← Back to Documentation](./README.md)
