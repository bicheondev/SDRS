# SDRS React Native Web Parity Documentation

## Architecture Overview

The source app is a Vite + React web app with a single authenticated route gate and three app tabs:

- Login route: local username/password entry gate. No server auth is performed.
- DB tab: browse/search/filter vessel records, switch card/summary views, open image zoom.
- Data management tab: import CSV/ZIP, export current DB, edit vessel records.
- Menu tab: color mode selection, app info, logout.

Important source layers:

- `src/app`: route shell, tab shell, reducer, bootstrap.
- `src/features`: feature-level state composition for auth, database, manage, menu.
- `src/components`: high-fidelity DOM screens, tab bar, image zoom, icon primitive.
- `src/domain`: reusable data, ship, search, CSV/ZIP, import/export logic.
- `src/services`: browser persistence and browser download service.
- `src/styles.css`: product-level visual spec: screen frame, colors, type, spacing, overlays, motion-related CSS.

The RNW port keeps the source app intact and adds a separate RNW entry under `rnw/`. The RNW shell owns app state and bootstrap orchestration, while complex DOM/CSS-dependent screens are reused as DOM parity islands. This preserves source behavior first and keeps migration seams documented.

## Bootstrap And Data Flow

Startup flow:

1. `AppShell` starts on `login`.
2. When both username and password are non-empty, app modules and default data preload.
3. Login submit navigates to `app` with the `loginToMain` transition.
4. `MainAppShell` calls `useAppBootstrap`.
5. Bootstrap tries stored IndexedDB state first.
6. If no stored state exists, it loads bundled `ship.csv` and `images.zip`.
7. Imported image entries are matched to ship records by registration.
8. Database state changes are persisted after initial readiness.

Bundled data parity target:

- Default CSV: root `ship.csv`.
- Default image archive: root `images.zip`.
- Initial state must be exactly the result of `loadBundledDatabaseState`.
- Stored user data takes precedence over bundled data.
- If both stored and bundled loading fail, the app falls back to an empty database.

## Storage, Import, And Export Pipeline

Storage:

- Source uses IndexedDB database `ship-database-app`.
- Object store: `app-state`.
- State key: `database-v1`.
- Stored payload is the database state: `shipRecords`, `imageEntries`, `files`.

Ship CSV import:

- Expected headers:
  - `번호`
  - `어선번호`
  - `어선명`
  - `어선총톤수`
  - `성명`
  - `연락처`
  - `업종`
  - `선적항`
  - `소나`
  - `어군 탐지기`
- CSV decoding tries UTF-8 and then EUC-KR.
- Validation rejects malformed row number, tonnage, phone, sonar, and detector fields.
- Phone numbers are formatted for app display and compacted for export.

Image ZIP import:

- ZIP files may contain jpg, jpeg, png, webp, svg, or gif files only.
- Each image is converted to a data URL.
- Image entries are sorted by Korean locale file name order.
- Registration is extracted with `\d{7,}-\d{7,}`.

Merge behavior:

- If there are no existing ships, a ship CSV import replaces the empty state immediately.
- If ships already exist, the import conflict modal opens.
- `기존 데이터 삭제` replaces all ship records.
- `기존 데이터 유지` appends imported records.
- When `어선정보가 같은 어선은 대체하기` is checked, existing records with matching registration are removed before appending imported records.

Export:

- `DB 및 이미지 내보내기` creates `db_export.zip`.
- The archive contains `ship.csv` and `images.zip`.
- Exported ship CSV includes a UTF-8 BOM.
- Placeholder images are not exported into `images.zip`.

## Asset Pipeline

Bundled app assets:

- `src/assets/ui/logo.svg`
- `src/assets/ui/menuInfoLogo.svg`
- `src/assets/ui/menuInfoMark.svg`
- `src/assets/ui/manageImage.png`
- `no-image.svg`
- `ship.csv`
- `images.zip`

Image matching:

- Ship records reference image entries by registration.
- `findImageEntryForRegistration` first checks `entry.registration`, then file name inclusion.
- Missing images use `no-image.svg`.

RNW parity target:

- The RNW build imports the same root seed files by URL.
- The same data URL image pipeline is used on web.
- UI assets are reused directly rather than recreated.

## Search And Filter Pipeline

Search:

- DB browse search applies to vessel name only.
- Manage edit search applies to `searchKey`, `title`, `registration`, `port`, and `business`.
- Choseong search is supported through `es-hangul`.
- Choseong matching is enabled only when the normalized query contains Korean choseong characters and spaces.
- Whitespace is compacted for choseong matching.

Filtering:

- Harbor filter options are built from unique ship ports sorted with Korean locale order.
- Harbor default is `전체 항포구`.
- Vessel type default is `전체 선박`.
- Vessel type is derived from business:
  - `연안통발어업` and `수하식양식업` map to `어선`.
  - Every other business maps to `보트`.
- Changing filters resets DB browse scroll and top bar visibility state.

## Modal, Overlay, And Navigation Behavior

Route and tab navigation:

- Login and app screens are stacked with `loginToMain` and `logout` transitions.
- Main tabs are ordered `db`, `manage`, `menu`.
- Tab transition is forward/backward based on that order.
- Manage and menu subpages are stack navigations with `push` and `pop`.

Bottom tab visibility:

- Visible on DB browse/search root, manage home, and menu root.
- Hidden on manage edit and menu subpages.
- In filter overlay, a tab bar is shown inside the overlay and DB tab closes the filter.

Overlays:

- Filter screen is a full-screen overlay with blurred/frosted backdrop and measured dropdown columns.
- Image zoom is a fixed full-screen modal with thumbnail-open/thumbnail-close animation when possible.
- Manage import and discard alerts are centered modal cards with scrim.
- Save toast appears above the manage search bar and can be dragged downward to dismiss.

Dismissal:

- Filter closes on backdrop, selecting an option, or DB tab in overlay.
- Image zoom closes on close button, backdrop, Escape, or vertical drag threshold.
- Import conflict modal closes on scrim or explicit action.
- Unsaved manage edit back opens discard modal instead of popping immediately.

## Theme And Token System

The source theme is CSS-variable based in `src/styles.css`.

Core visual constants:

- Screen width: `390px`.
- Screen height: `844px`.
- Mobile viewport: screen fills `100dvh` under `480px`.
- App font: `Pretendard GOV Variable`, `Pretendard GOV`, platform Korean/system fallbacks.
- Icons: Material Symbols Rounded with filled glyphs.
- Major radii: thumbnail `6px`, interaction `12px`, modal `20px`.
- Light and dark modes are controlled with `document.documentElement.dataset.theme`.

RNW token approach:

- RNW shell reads the same conceptual tokens for layout sizes, colors, and motion.
- DOM parity islands keep using source CSS variables for exact visual fidelity.
- Future pure-RN replacement should convert the CSS variable map into JS design tokens.

## Web-Only Dependencies And RNW Or DOM Replacements

Reusable without UI rewrite:

- `es-hangul`
- `jszip`
- CSV parsing and serialization
- ship normalization and image matching
- search compilation/matching
- database state cloning/upgrading

Web-only APIs requiring adapters:

- IndexedDB: web persistence adapter now; native path should use SQLite, AsyncStorage, or filesystem-backed JSON.
- `File`, `Blob`, `FileReader`, `TextDecoder`: web import adapter now; native path should use document picker and filesystem reads.
- `URL.createObjectURL` and anchor download: web export adapter now; native path should use share sheet/filesystem.
- `visualViewport`: web login keyboard inset adapter now; native path should use keyboard events.
- DOM measurement and selectors: kept only inside DOM parity islands.
- Framer Motion DOM gestures and layout animation: kept inside DOM parity islands; future pure RN should use Reanimated/Gesture Handler.

## Exact Screen List And Transitions

| Screen / Flow    | Source key       | Entry                     | Exit / transition                                |
| ---------------- | ---------------- | ------------------------- | ------------------------------------------------ |
| Login            | `login`          | Initial route, logout     | Submit -> `app` with `loginToMain`               |
| DB browse        | `db`, `browse`   | App default, DB tab       | Search, filter, manage/menu tab                  |
| DB search        | `db`, `search`   | Search icon               | Back or DB tab closes search                     |
| Filter overlay   | `filterSheet`    | Harbor/type filter button | Backdrop, option select, DB tab                  |
| Image zoom       | `zoomSession`    | Vessel image click        | Close button, backdrop, Escape, vertical dismiss |
| Manage home      | `manageHome`     | Data management tab       | Edit push, import/export modals                  |
| Manage ship edit | `manageShipEdit` | `선박 DB 편집하기`        | Back pop or discard modal                        |
| Menu root        | `menu`           | Menu tab                  | Mode/info push, logout                           |
| Menu mode        | `menuMode`       | `화면 모드` row           | Back pop                                         |
| Menu info        | `menuInfo`       | `앱 정보` row             | Back pop                                         |

## Selective DOM Component Decisions

DOM parity islands are justified for:

- DB browse/search/filter/result cards: exact frosted bars, measured filter columns, scroll hide/show, image thumbnail metadata, view-mode motion.
- Manage home/edit/modals/toasts: browser file input flow, framer-motion reorder, long-press drag, DOM text inputs, animated toast dismissal.
- Image zoom: DOM pointer capture, thumbnail query/measurement, pinch/pan/dismiss gestures, Escape handling, transition snapshots.

Pure RNW is sufficient for:

- App state orchestration.
- Bootstrap data flow.
- Reducer/navigation logic.
- Storage/import/export adapter boundaries.
- Login shell behavior can be implemented in RNW, while still matching the source sizes and labels.
- Menu pages can be implemented in RNW, but the current port may reuse DOM if exact CSS parity is prioritized.

Future pure-RN replacement path:

1. Convert CSS variable tokens into a typed JS token module.
2. Replace DOM bars/cards with `View`, `Text`, `Pressable`, `ScrollView`, and `Image`.
3. Replace framer-motion with Reanimated.
4. Replace DOM pointer handlers with Gesture Handler.
5. Replace browser file pickers/downloads with Expo document picker, filesystem, and share APIs.
