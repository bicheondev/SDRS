# SDRS RNW Adapter Plan

## Storage And Persistence

Current RNW web adapter:

- Reuse `src/services/indexedDbStore.js`.
- Preserve database name, store, key, and schema.
- Use existing `resolveInitialDatabaseState` semantics.

Future native adapter:

- Provide `loadStoredDatabaseState` and `saveStoredDatabaseState` with the same signatures.
- Candidate storage: SQLite for indexed metadata plus filesystem for image payloads, or filesystem JSON for small deployments.
- Keep `upgradeDatabaseState` as the only schema migration entry point.

## File Import And Export

Current RNW web adapter:

- CSV and ZIP import use hidden DOM file inputs from the DOM parity manage screen.
- Parsing remains in `src/domain/importExport`.
- Export uses `downloadBlob(exportBlob, 'db_export.zip')`.

Future native adapter:

- Replace hidden inputs with a document picker.
- Convert picked files into objects exposing `{ name, type, arrayBuffer() }` or add adapter-specific import functions that feed buffers into the same domain parser.
- Replace anchor download with filesystem write plus share sheet.

## Bundled Default Seed Data

Current RNW web adapter:

- Reuse `loadBundledDatabaseState`.
- Vite bundles root `ship.csv` and `images.zip` via `?url`.
- Fetch each URL, wrap as `File`, then import through the same CSV/ZIP pipeline.

Future native adapter:

- Bundle `ship.csv` and `images.zip` as app assets.
- Resolve asset file URIs, read binary/text data, and feed the same import functions through a file-like adapter.
- Preserve precedence: stored state first, bundled seed second, empty fallback last.

## Viewport And Login Behavior

Current RNW web adapter:

- Login screen can be pure RNW for structure.
- Web keyboard inset behavior uses `visualViewport` and writes `--keyboard-inset`.
- Login button remains bottom-fixed and moves above the software keyboard on supported browsers.

Future native adapter:

- Replace `visualViewport` with Keyboard event listeners.
- Use keyboard height to translate the bottom login button.
- Preserve the focused-field behavior that hides the version text.

## CSS Tokens

Current RNW web adapter:

- DOM parity islands load `src/styles/index.css`, which imports the full source CSS.
- RNW shell mirrors the same screen dimensions and app shell background where it owns layout.
- Theme mode continues to set `document.documentElement.dataset.theme`.

Future native adapter:

- Extract CSS variable values into a JS token module.
- Convert color mode from document attributes to a context/provider.
- Replace CSS `backdrop-filter` effects with native blur views where available.

## Motion And Animation

Current RNW web adapter:

- Reuse source `motion.js` for DOM parity islands.
- Route/screen stack can use source `AnimatedScreen` while DOM parity screens are active.
- RNW shell avoids inventing alternate motion curves.

Future native adapter:

- Translate motion tokens to Reanimated timing/spring configs.
- Use shared transition names only after image zoom is rewritten.
- Honor reduced motion by mapping to short fade-only transitions.

## Modal Layering

Current RNW web adapter:

- Preserve source z-index levels:
  - bottom tab: 4
  - filter overlay: 5
  - manage modals: 6 inside screen
  - image zoom: 20
- Keep DOM parity overlays fixed/absolute as source CSS defines them.

Future native adapter:

- Centralize modal portals with a layer manager.
- Keep the same dismissal rules and event ordering before changing visuals.

## Image Zoom

Current RNW web adapter:

- Use source `ImageZoomModal` as a DOM parity island.
- Preserve DOM thumbnail lookup using `data-vessel-thumb-id`.
- Preserve pointer capture, double-tap, pinch, pan, dismiss, and Escape close.

Future native adapter:

- Rebuild with Gesture Handler and Reanimated.
- Add native shared-element or measured-thumbnail transition.
- Keep constants identical unless product testing proves a platform-specific need.

## Tabs And Sheets

Current RNW web adapter:

- Bottom tabs may use source DOM component to preserve icon metrics and label density.
- Filter sheet remains DOM because it measures natural text widths and aligns columns to top-bar buttons.

Future native adapter:

- Rebuild bottom tab in pure RN quickly.
- Rebuild filter sheet with RN measurement callbacks and animated values.
- Preserve the same source-view behavior when opened from search.

## Browser-Only APIs

| Browser API                | Current use                                     | Adapter path                      |
| -------------------------- | ----------------------------------------------- | --------------------------------- |
| `indexedDB`                | persisted database state                        | storage adapter                   |
| `File` / `Blob`            | imports, bundled seed wrapping, export          | file-like adapter                 |
| `FileReader`               | edit-screen image replacement                   | binary read adapter               |
| `URL.createObjectURL`      | export download                                 | share/filesystem adapter          |
| `document` / `HTMLElement` | DOM parity UI measurement and selectors         | isolate in DOM components         |
| `window.visualViewport`    | login keyboard inset                            | keyboard adapter                  |
| `window.matchMedia`        | system dark mode, reduced motion through framer | appearance/reduced-motion adapter |
| `navigator.vibrate`        | reorder haptics on supporting browsers          | haptics adapter                   |
| `requestAnimationFrame`    | motion and measurement scheduling               | platform animation scheduler      |
