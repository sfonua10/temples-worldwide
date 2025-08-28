# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is an interactive 3D globe visualization showing temples of The Church of Jesus Christ of Latter-day Saints around the world. Built with React, TypeScript, and Mapbox GL JS, it provides an immersive way to explore temple locations globally.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Build for production (TypeScript check + Vite build)
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview production build locally

### Installation
- `npm install` - Install all dependencies

## Architecture Overview

### Technology Stack
- **React 19.1.1** - UI framework
- **TypeScript 5.8.3** - Type safety
- **Vite 7.1.2** - Build tool and dev server
- **Mapbox GL JS 3.14.0** - Interactive 3D globe and mapping
- **ESLint 9.33.0** - Code quality

### Project Structure
- `/src` - All source code
  - `main.tsx` - Application entry point (imports Mapbox CSS)
  - `App.tsx` - Main component with Mapbox globe implementation
  - `assets/` - Static assets
- `/public` - Public static files served directly
- `index.html` - HTML entry point
- `.env` - Environment variables (Mapbox access token)
- `.env.example` - Template for environment variables

### Key Components
- **App.tsx** - Contains the Mapbox globe with:
  - 3D globe projection with atmospheric effects
  - Continuous rotation animation (120 seconds per revolution)
  - User interaction controls (drag to rotate, scroll to zoom)
  - Responsive full-screen display

### Configuration
- TypeScript uses composite configuration with separate configs for app and node code
- ESLint uses the new flat config format with TypeScript and React plugins
- Vite configured with React plugin for JSX transformation and HMR
- Environment variables prefixed with `VITE_` are accessible in the app

## Development Guidelines

### Working with Mapbox
- Mapbox access token must be set in `.env` file
- Globe projection is used for the 3D earth view
- Atmospheric effects are configured for realistic appearance
- Animation uses requestAnimationFrame for smooth rotation

### Adding Temple Data
When implementing temple markers, consider:
1. Create a data structure for temple information:
   - Name, coordinates, dedication date, address, photo URL, status
2. Use Mapbox markers or custom GL layers for temple locations
3. Implement popups or modals for detailed information
4. Consider clustering for areas with multiple temples

### Component Development
- Place React components in the `src` directory
- Use TypeScript for all new code
- Follow existing patterns for imports and file organization
- Use refs for Mapbox map instance management

### Styling
- Global styles in `src/index.css` (configured for full-screen map)
- Component-specific styles in `src/App.css`
- Mapbox GL CSS imported in `main.tsx`

### State Management
- Currently using React's built-in state (useState, useRef)
- Consider adding context or external state management for temple data

## Next Implementation Steps

1. **Temple Data Integration**
   - Create temple data JSON/API integration
   - Add GeoJSON layer for temple locations
   - Implement marker clustering for dense areas

2. **User Interface Enhancements**
   - Add search functionality
   - Create filter controls (by region, status)
   - Design temple information popups/panels

3. **Performance Optimization**
   - Lazy load temple images
   - Implement data pagination for large datasets
   - Optimize marker rendering for mobile devices

## Important Notes
- Always run `npm run lint` before committing
- The `.env` file is gitignored - never commit API keys
- Test globe interactions on both desktop and mobile
- Consider accessibility features for map interactions