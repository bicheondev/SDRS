# SDRS Screen Parity Matrix

## Login

| Field                          | Target                                                                                                               |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| Purpose                        | Local entry gate requiring non-empty 아이디 and 비밀번호.                                                            |
| State consumed                 | `username`, `password`, `focusedField`, `isFilled`.                                                                  |
| Actions emitted                | Username/password changes, focus/blur, Enter from username focuses password, submit enters app only when filled.     |
| Child components               | Login title, two inputs, version text, fixed bottom login button.                                                    |
| Overlays/modals/sheets         | None.                                                                                                                |
| Animations/motion              | Login-to-main route fade/lift; input focus translate and color; keyboard inset moves login button.                   |
| Visual parity requirements     | 26px title, 18px inputs, 52px input shells, 64px bottom button, same Korean labels and version text.                 |
| Functional parity requirements | Button disabled until both trimmed values are non-empty; password clears on logout.                                  |
| RNW migration notes            | Pure RNW is enough for layout and state. Web `visualViewport` is an adapter; native path should use keyboard events. |
| RNW vs DOM                     | Pure RNW.                                                                                                            |
| Risk                           | Medium because keyboard viewport behavior differs across web/native.                                                 |

## DB Browse

| Field                          | Target                                                                                                                                |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| Purpose                        | Default vessel browsing screen.                                                                                                       |
| State consumed                 | `shipRecords`, `compact`, `topBarHidden`, `harborFilter`, `vesselTypeFilter`, `filteredDisplayVessels`.                               |
| Actions emitted                | Open search, open harbor/type filters, toggle card/summary view, scroll hide/show top bar, open zoom, open manage/menu tabs.          |
| Child components               | `TopBar`, `FiltersRow`, `VesselResults`, `VesselCard`, `CompactVesselCard`, `BottomTab`.                                              |
| Overlays/modals/sheets         | Filter overlay, image zoom.                                                                                                           |
| Animations/motion              | Top bar translate on scroll; view-mode fade/y/blur transition; press scale.                                                           |
| Visual parity requirements     | 390x844 phone frame on desktop, full viewport on mobile, 136px top bar, card padding 36/24, 180px wide images, 150x90 compact images. |
| Functional parity requirements | Harbor/type filtering, compact toggle, empty state, scroll position restore when returning to DB browse.                              |
| RNW migration notes            | State and domain logic are reusable; exact CSS cards/top bars are DOM-sensitive.                                                      |
| RNW vs DOM                     | DOM component justified.                                                                                                              |
| Risk                           | High if rewritten in pure RNW because frosted bars, scroll thresholds, and card density must match exactly.                           |

## DB Search

| Field                          | Target                                                                         |
| ------------------------------ | ------------------------------------------------------------------------------ |
| Purpose                        | Search filtered vessels by vessel name.                                        |
| State consumed                 | `searchQuery`, `searchedDisplayVessels`, `compact`, active filters.            |
| Actions emitted                | Query change, clear, back to browse, open filters, compact toggle, image zoom. |
| Child components               | `SearchTopBar`, `FiltersRow`, `VesselResults`.                                 |
| Overlays/modals/sheets         | Filter overlay may be opened from search.                                      |
| Animations/motion              | Search input autofocus on next animation frame; view-mode motion.              |
| Visual parity requirements     | Fixed 136px search top bar, 24px back/cancel slots, exact placeholder `검색`.  |
| Functional parity requirements | Name-only search with choseong support; DB tab while in search closes search.  |
| RNW migration notes            | Search domain is reusable; input focus and top-bar CSS are DOM-sensitive.      |
| RNW vs DOM                     | DOM component justified.                                                       |
| Risk                           | High for input focus, top bar alignment, and CSS blur.                         |

## Filter Overlay

| Field                          | Target                                                                                                                       |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| Purpose                        | Select harbor or vessel type while previewing dimmed results behind overlay.                                                 |
| State consumed                 | `filterSheet.mode`, `sourceView`, active filters, harbor options, vessel type options, compact, query if opened from search. |
| Actions emitted                | Close, select harbor, select type, open search, open manage/menu, compact toggle.                                            |
| Child components               | `FilterScreen`, `TopBar`, dimmed `VesselResults`, overlay columns, overlay `BottomTab`.                                      |
| Overlays/modals/sheets         | This is a full-screen overlay/sheet.                                                                                         |
| Animations/motion              | Overlay fade, panel lift/fade, label width transition, delayed removal on exit.                                              |
| Visual parity requirements     | Filter columns begin at 122px top, 18px edge, 24px gap, measured natural label widths.                                       |
| Functional parity requirements | Backdrop closes; option select updates filter and closes; source search behavior is preserved.                               |
| RNW migration notes            | Uses DOM measurement, cloned label nodes, computed styles, fixed overlay layers.                                             |
| RNW vs DOM                     | DOM component justified.                                                                                                     |
| Risk                           | High; pure RNW replacement needs custom measurement and overlay layering.                                                    |

## Image Zoom

| Field                          | Target                                                                                                |
| ------------------------------ | ----------------------------------------------------------------------------------------------------- |
| Purpose                        | Full-screen image inspection with open/close thumbnail continuity and gestures.                       |
| State consumed                 | `zoomSession`, selected vessel collection, current index, transform, pointer gesture state.           |
| Actions emitted                | Close, Escape close, pinch zoom, double-tap zoom, pan, vertical dismiss.                              |
| Child components               | `ImageZoomModal`, close button, image stage, transition snapshot.                                     |
| Overlays/modals/sheets         | Fixed full-screen modal.                                                                              |
| Animations/motion              | Thumbnail-to-full transition, closing transition, backdrop fade, settling transforms.                 |
| Visual parity requirements     | Black full viewport, 32px close chip at top/right, image full width, identical thumbnail hide/reveal. |
| Functional parity requirements | Scale 1-4, double tap 2.5, elastic pinch 0.85-4.5, dismiss threshold 140px or velocity 0.45.          |
| RNW migration notes            | Heavy DOM pointer capture and selector/rect measurement; isolate as DOM.                              |
| RNW vs DOM                     | DOM component justified.                                                                              |
| Risk                           | Very high; native path needs Gesture Handler and Reanimated shared element work.                      |

## Manage Home

| Field                          | Target                                                                        |
| ------------------------------ | ----------------------------------------------------------------------------- |
| Purpose                        | Import/export and entry to ship DB editing.                                   |
| State consumed                 | file metadata rows, import alert, pending ship import.                        |
| Actions emitted                | Open CSV picker, open ZIP picker, export DB, open edit screen, modal actions. |
| Child components               | Manage rows, hidden file inputs, alert modal, ship import conflict modal.     |
| Overlays/modals/sheets         | Import failure alert; ship import conflict modal with checkbox.               |
| Animations/motion              | Press scale; modal scrim/card motion.                                         |
| Visual parity requirements     | `데이터 관리` title, 52px rows, 16px section divider, bottom tab visible.     |
| Functional parity requirements | CSV/ZIP file input reset after selection; exact modal copy and button labels. |
| RNW migration notes            | Browser file input is web-only; use adapter.                                  |
| RNW vs DOM                     | DOM component justified for file input and modal parity.                      |
| Risk                           | Medium-high due file picker behavior.                                         |

## Manage Ship Edit

| Field                          | Target                                                                                                                  |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Purpose                        | Add, edit, delete, reorder, search, image-replace, and save ship records.                                               |
| State consumed                 | working cards, saved cards, dirty flag, search query, discard modal target, save toast.                                 |
| Actions emitted                | Add, back, confirm discard, delete, field change, image change, reorder, save, search change/clear, toast dismiss.      |
| Child components               | Subpage top bar, reorder list, editable ship cards, search bar, discard modal, toast.                                   |
| Overlays/modals/sheets         | Discard modal; save toast.                                                                                              |
| Animations/motion              | Framer `Reorder`, long-press drag, enter/exit card animation, smooth scroll to added card, toast motion/drag dismissal. |
| Visual parity requirements     | 64px top bar, 77px title, 36/24 card sections, 150x90 images, bottom 64px search bar.                                   |
| Functional parity requirements | Dirty save gating, edited-field highlight, image file validation, long-press 220ms reorder, search disables reorder.    |
| RNW migration notes            | Domain save/rebuild logic reusable; UI gestures are DOM-sensitive.                                                      |
| RNW vs DOM                     | DOM component justified.                                                                                                |
| Risk                           | Very high for reorder and toast if rewritten in pure RNW.                                                               |

## Menu Root

| Field                          | Target                                                                          |
| ------------------------------ | ------------------------------------------------------------------------------- |
| Purpose                        | Settings and logout.                                                            |
| State consumed                 | `colorMode`.                                                                    |
| Actions emitted                | Open mode screen, open info screen, logout.                                     |
| Child components               | Menu rows and divider.                                                          |
| Overlays/modals/sheets         | None.                                                                           |
| Animations/motion              | Stack push/pop and press scale.                                                 |
| Visual parity requirements     | `메뉴` title, row labels, detail label from color mode map, bottom tab visible. |
| Functional parity requirements | Logout clears credentials and returns to login after transition.                |
| RNW migration notes            | Pure RNW is enough; DOM reuse acceptable only for short-term exact CSS parity.  |
| RNW vs DOM                     | Pure RNW preferred.                                                             |
| Risk                           | Low.                                                                            |

## Menu Mode

| Field                          | Target                                                          |
| ------------------------------ | --------------------------------------------------------------- |
| Purpose                        | Select system/light/dark mode.                                  |
| State consumed                 | `colorMode`.                                                    |
| Actions emitted                | Select mode, back.                                              |
| Child components               | Back top bar, title, three rows, check icon.                    |
| Overlays/modals/sheets         | None.                                                           |
| Animations/motion              | Stack push/pop, press scale.                                    |
| Visual parity requirements     | Labels `시스템 설정`, `라이트`, `다크`; active row shows check. |
| Functional parity requirements | Selecting updates document theme through color mode adapter.    |
| RNW migration notes            | Pure RNW is enough; theme application remains web-adapted.      |
| RNW vs DOM                     | Pure RNW preferred.                                             |
| Risk                           | Low-medium due theme root side effects.                         |

## Menu Info

| Field                          | Target                                                     |
| ------------------------------ | ---------------------------------------------------------- |
| Purpose                        | Show app logo and version.                                 |
| State consumed                 | None besides navigation.                                   |
| Actions emitted                | Back.                                                      |
| Child components               | Back top bar, title, info background, mark, logo, version. |
| Overlays/modals/sheets         | None.                                                      |
| Animations/motion              | Stack push/pop.                                            |
| Visual parity requirements     | Same mark/logo SVGs, muted background, version `버전 1.0`. |
| Functional parity requirements | Back returns to menu root.                                 |
| RNW migration notes            | Pure RNW is enough with SVG/image asset support.           |
| RNW vs DOM                     | Pure RNW preferred.                                        |
| Risk                           | Low.                                                       |
