# Skin3d Documentation

Welcome to the comprehensive documentation for **skin3d** - a high-performance JavaScript library for rendering interactive Minecraft player models in 3D.

## Documentation Index

### Getting Started
- **[Installation & Setup](./GETTING_STARTED.md)** - Quick start guide and installation instructions
- **[Basic Examples](./EXAMPLES.md)** - Common use cases and code snippets

### API Reference
- **[API Reference](./API_REFERENCE.md)** - Complete API documentation with all classes and methods
- **[Architecture](./ARCHITECTURE.md)** - Library structure and design patterns

### Advanced Topics
- **[Advanced Usage](./ADVANCED_USAGE.md)** - Performance optimization, custom animations, and extensions
- **[Migration Guide](./MIGRATION_GUIDE.md)** - Upgrading from previous versions
- **[Troubleshooting](./TROUBLESHOOTING.md)** - Common issues and solutions

### Development
- **[Contributing](../CONTRIBUTING.md)** - How to contribute to skin3d
- **[Changelog](../ChangeLog)** - Recent updates and version history

---

## Quick Links

- 📦 **[NPM Package](https://www.npmjs.com/package/skin3d)**
- 🌐 **[Live Demo](https://skin3d.vercel.app/)**
- 💬 **[Community Chat](https://matrix.to/#/#skin3d:gitter.im)**
- 📝 **[GitHub Repository](https://github.com/cosmic-fi/skin3d)**

---

## What is Skin3d?

Skin3d is a powerful and easy-to-use library for displaying and animating Minecraft player models in web browsers. Built with Three.js and TypeScript, it provides:

✨ **Features:**
- Full support for Minecraft Java Edition skins (including HD 64x32 and 64x64)
- Cape rendering with smooth physics simulation
- Elytra (wings) support
- Ear attachments rendering
- Name tags with Minecraft font styling
- 8 built-in animations (walking, running, flying, waving, etc.)
- Orbit controls for camera interaction
- Custom lighting and background support
- Responsive and performance-optimized rendering
- ESM and UMD bundle formats

---

## Core Modules

### Render
The main rendering engine that manages the 3D scene, camera, and lighting. Handles all WebGL rendering and provides the primary API for users.

### Model
Contains all player model components:
- `SkinObject` - Minecraft player skin mesh
- `CapeObject` - Cape mesh with physics
- `ElytraObject` - Wings mesh
- `EarsObject` - Ear meshes
- `PlayerObject` - Combined player model

### Animation
Pre-built animation system with:
- `IdleAnimation` - Standing still
- `WalkingAnimation` - Walking motion
- `RunningAnimation` - Running motion
- `FlyingAnimation` - Flying/hovering
- `WaveAnimation` - Waving hand
- `CrouchAnimation` - Crouching pose
- `HitAnimation` - Getting hit animation
- `FunctionAnimation` - Custom animations

### Nametag
Renders floating name tags above the player with customizable styling and Minecraft font support.

---

## Recent Updates

### Version 0.1.0 (December 2025)

**Major Changes:**
- ✨ **Modular Architecture**: Refactored library structure for better code organization
- 📦 **New Export System**: Improved module exports through centralized `index.ts`
- 🎨 **Enhanced Documentation**: TypeDoc-generated API reference with material theme
- 🧹 **Dependency Cleanup**: Removed unused polyfills, optimized production footprint

**Files Updated:**
- `Render.ts` - Core rendering engine (replaces legacy `skin3d.ts`)
- `Model.ts` - Player model and mesh management
- `Animation.ts` - Animation system
- `Nametag.ts` - Name tag rendering
- `index.ts` - Main entry point

---

## Browser Support

Skin3d requires a modern browser with WebGL support:
- Chrome/Chromium 60+
- Firefox 55+
- Safari 11+
- Edge 79+

---

## Getting Help

- 📚 **Read the Docs** - Start with [Getting Started](./GETTING_STARTED.md)
- 🔍 **Check Examples** - Look at [Examples](./EXAMPLES.md) for code samples
- 🐛 **Report Issues** - [GitHub Issues](https://github.com/cosmic-fi/skin3d/issues)
- 💬 **Join Chat** - [Gitter Community](https://matrix.to/#/#skin3d:gitter.im)

---

## License

Skin3d is released under the **MIT License**. See [LICENSE](../LICENSE) for details.

---

**Made with ❤️ by [Cosmic-fi](https://github.com/cosmic-fi)**
