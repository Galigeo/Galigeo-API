# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Galigeo API is a JavaScript/TypeScript library for embedding Galigeo maps in web applications. The API provides a wrapper around an iframe-based map viewer, enabling communication through a message-passing architecture.

## Build and Development Commands

### Initial Setup
```bash
cd api
npm install
```

### Build Commands
```bash
# Production build (outputs to samples/assets/js/galigeo-api.js)
cd api
npm run build

# Development build (unminified)
npm run build:dev

# Build TypeScript declarations only
npm run build:lib

# Watch mode for development
npm run watch
```

### Documentation
```bash
# Generate TypeDoc documentation (outputs to samples/doc)
# Uses Material Design theme with Galigeo green color (#2ecc71)
cd api
npm run doc

# Deploy documentation
npm run deploy:doc
```

### Running Samples
```bash
# Serve samples on http://localhost:3000
cd api
npm run serve:samples
```

## Architecture

### Core Communication Pattern

The API uses an **iframe-based message-passing architecture**:

1. **Map** creates an iframe pointing to the Galigeo viewer
2. **Messenger** handles bidirectional PostMessage communication with the iframe
3. **Listener** provides an event system for both API-to-viewer commands and viewer-to-API events
4. Each message has a unique ID, and responses are wrapped in Promises

### Key Classes

- **Map** (map.ts): Root object that creates the iframe, manages lifecycle, and provides all map operations (zoom, layers, extent, print, etc.)
- **Messenger** (messenger.ts): Handles PostMessage communication with the iframe. Maintains a response queue keyed by message ID
- **Layer** (layer.ts): Represents a map layer with visibility controls, filtering, and event handling
- **Listener** (listener.ts): Base class providing addEventListener/removeEventListener/fireEvent pattern
- **Extent** (extent.ts): Simple bounding box class (xmin, ymin, xmax, ymax)
- **MapParameters** (model.ts): Configuration object for map initialization (name, url, apiKey, data, authentication, etc.)

### Data Flow

1. User calls `new Map(element, options)` → Map instance created
2. User calls `map.load()` → HTTP POST to `/api/openMap/encoded` with MapParameters
3. Server returns iframe URL and refreshId → Map creates iframe and Messenger
4. Messenger waits for `GaligeoMapLoaded` message → Promise resolves
5. User calls map methods → Messenger sends PostMessage with unique ID → Promise returned
6. Viewer responds with same ID → Messenger resolves corresponding Promise

### Webpack Configuration

The build creates a UMD bundle (galigeo-api.js) with:
- Entry: `api/src/index.ts`
- Output: `samples/assets/js/galigeo-api.js`
- Library name: `Galigeo` (global variable)
- TypeScript compiled via ts-loader, then Babel for ES5 compatibility

## Important Implementation Details

### Map Initialization Flow

The `Map.load()` method:
1. POSTs to `/api/openMap/encoded` with URL-encoded MapParameters
2. Creates iframe with the returned URL (handles SSO, language, crossDomain)
3. Sets up ResizeObserver to keep iframe sized to parent element
4. Has iOS-specific workaround for empty iframe reloading

### Relative URL Handling

When data sources use relative URLs, `fixRelativeUrl()` converts them to absolute URLs based on `window.location.href`.

### Update vs Load

- `load()`: Initial map creation, returns new refreshId
- `update(mapParameters)`: Updates data on existing map using refreshId, avoids full reload

### Layer Types

Layers have a datasourceId indicating their source:
- `CE`: Dynamically loaded via API
- Other values: Datahub, CSV, Excel, Shape, GeoJSON, catalog, sql

### Event System

Both Map and Layer extend Listener, allowing:
```javascript
map.addEventListener('zoomend', (extent) => { ... })
layer.addEventListener('click', (feature) => { ... })
```

The Messenger listens for PostMessages of type "event" and propagates them through fireEvent().

## Testing

No automated tests are currently configured. The `samples/` directory contains 25+ HTML examples demonstrating different API features.

## Publishing

```bash
cd api
npm run publish
```

This builds TypeScript declarations and publishes to npm as `@galigeo-store/api`.
