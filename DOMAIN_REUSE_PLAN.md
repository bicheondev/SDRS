# SDRS Domain Reuse Plan

## Reusable As-Is

| File                                         | Reason                                                                                                         |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `src/domain/search.js`                       | Pure search/choseong logic with no DOM dependencies.                                                           |
| `src/features/database/useVesselSearch.js`   | Thin reusable search application over domain indexes.                                                          |
| `src/domain/ships.js`                        | Pure ship/image matching, merge, normalization, export image-entry rebuilding.                                 |
| `src/domain/databaseState.js`                | Pure database state defaults, cloning, display-vessel and harbor option builders.                              |
| `src/domain/importExport/csv.js`             | Pure CSV parse/serialize/decode logic using standard `TextDecoder`.                                            |
| `src/domain/importExport/shared.js`          | Pure IDs, import errors, BOM stripping.                                                                        |
| `src/domain/importExport/sharedConstants.js` | Pure constants.                                                                                                |
| `src/domain/importExport/shipCsv.js`         | Reusable on web because it uses `File.arrayBuffer`; native path needs file adapter but parsing behavior stays. |
| `src/domain/importExport/imagesZip.js`       | Reusable on web because it uses `JSZip`, `File.arrayBuffer`, `btoa`, `atob`; native path needs binary adapter. |
| `src/domain/importExport/databaseExport.js`  | Reusable on web for Blob export; native path needs output adapter.                                             |
| `src/domain/importExport/bundledData.js`     | Reusable on RNW web with Vite URL imports; native path needs asset-file loader.                                |
| `src/app/appReducer.js`                      | Pure tab/zoom reducer.                                                                                         |
| `src/hooks/useRouteNavigation.js`            | Pure React state navigation.                                                                                   |
| `src/hooks/useStackNavigation.js`            | Pure React state stack navigation.                                                                             |
| `src/assets/assets.js`                       | Pure label/option constants.                                                                                   |
| `src/motion.js`                              | Reusable for DOM parity islands; future pure RN should translate tokens to Reanimated configs.                 |

## Reusable With Adapter

| File                                    | Adapter needed                                                                                 |
| --------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `src/app/useAppBootstrap.js`            | Inject storage and bundled-data loaders so web IndexedDB and future native storage can differ. |
| `src/hooks/useColorMode.js`             | Web writes `document.documentElement`; native path should map to color scheme state.           |
| `src/features/auth/useLoginViewport.js` | Web uses `visualViewport`; native path should use keyboard event insets.                       |
| `src/features/manage/useShipEditor.js`  | Domain behavior reusable; file picker, `FileReader`, and download are web adapters.            |
| `src/services/indexedDbStore.js`        | Web persistence adapter; native storage implementation required later.                         |
| `src/services/fileDownload.js`          | Web download adapter; native share/filesystem adapter required later.                          |

## Web-Only, Rewrite Needed For Full Native

| File                                        | Why                                                                                                  |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `src/components/ImageZoomModal.jsx`         | DOM selectors, `HTMLElement`, `getBoundingClientRect`, CSS transitions, pointer capture, Escape key. |
| `src/features/database/FilterSheet.jsx`     | DOM width measurement, cloned elements, `window.getComputedStyle`, fixed CSS overlay.                |
| `src/components/layout/AnimatedScreen.jsx`  | Framer Motion DOM imperative animation via `useAnimate`; native path should use Reanimated.          |
| `src/components/layout/BottomTab.jsx`       | DOM/CSS implementation; can be rewritten in pure RNW/RN easily.                                      |
| `src/components/ManageScreens.jsx`          | DOM file inputs, HTML inputs, framer-motion reorder, pointer capture, `scrollIntoView`.              |
| `src/features/database/DatabaseTopBars.jsx` | DOM inputs/buttons and exact CSS blur/frost behavior.                                                |
| `src/features/database/VesselResults.jsx`   | DOM scroll refs, framer-motion view-mode transitions, image buttons.                                 |
| `src/features/menu/*.jsx`                   | Simple DOM screens; pure RNW rewrite is low risk but source CSS reuse gives immediate parity.        |
| `src/components/Icons.jsx`                  | Material Symbols font DOM span. Pure RN path needs font glyph mapping or vector icon wrapper.        |

## Risky Or Unknown

| Area                                       | Risk                                                                                                                                                                                                  |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Material Symbols vs Material Icons Rounded | Source currently uses Google Material Symbols Rounded CSS, while requested source names Material Icons Rounded OTF. Glyph names and metrics differ. The port should preserve source appearance first. |
| Pretendard GOV loading                     | Source loads CDN CSS. The RNW port should bundle font assets to remove network reliance.                                                                                                              |
| EUC-KR CSV decoding                        | Web `TextDecoder('euc-kr')` works in modern browsers. Native JS runtimes may need an encoding library.                                                                                                |
| Large base64 images in persistence         | IndexedDB handles current seed data. Native storage choice must be tested for size limits.                                                                                                            |
| Drag reorder parity                        | Framer Motion reorder behavior is web-specific and high fidelity now; future native replacement needs careful gesture parity work.                                                                    |
| Image zoom parity                          | Shared-element thumbnail transitions and pinch/pan/dismiss gestures are the largest future native parity risk.                                                                                        |
