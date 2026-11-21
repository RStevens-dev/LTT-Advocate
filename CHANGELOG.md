# Changelog

## 0.7.0 — Visual layout editor (experimental)

- Added drag-to-position editing for topic banners, position banners, timer, coin and brand labels.
- Added per-element visibility, X/Y offset, scale, opacity, font sizing and alignment controls.
- Paired host elements can mirror edits or be unlinked for independent adjustment.
- Layout overrides persist per output format, synchronize to read-only displays and support JSON import/export.
- v0.6.2 pre-editor ZIP packaging workflow added before editor development; artifact publication has not been independently verified.
- Browser and OBS acceptance testing remain outstanding.


## 0.6.2 — Automatic guided walkthrough

- Added `?walkthrough=1` (alias `?tour`) to launch a producer-page overlay that automatically demonstrates a complete debate.
- Guided spotlight and explanatory captions cover setup, caller, coin, thinking, arguments, rebuttals, closings and emergency clear, with Pause, Next, Back and Exit.
- The rehearsal uses isolated sample state, bypasses the live producer lock without claiming it, and does not publish or persist the sample debate.
- Real-browser visual behavior remains unverified.


## 0.6.1 — Single producer guard

- Enforce one active producer per browser origin using an exclusive Web Lock, with a short-lived local-storage lease fallback.
- Block duplicate producer windows with an explanation and Retry button; separate display windows remain permitted.
- Prevent blocked producers from publishing state or responding to display synchronization requests.
- Add duplicate-producer coverage to the Chromium smoke test.


## 0.6.0 — Production-readiness pass (2026-11-20)

- Corrected a root cause of wide-display flashing: synchronized heartbeat timestamps were inadvertently part of the visual render identity, causing unnecessary DOM replacement.
- Removed received transport timestamps from display state and limited render comparisons to visible settings.
- Added a Chromium integration smoke test for persistent wide-display nodes, forced coin highlighting, countdown updates, and emergency clear; configured CI to execute it.
- Removed obsolete external logo-vendoring automation that could overwrite bundled artwork.
- Rewrote the operator README with setup, OBS guidance, known limitations, and an explicit pre-share checklist.
- No claim of OBS certification or successful live browser testing is made by this changelog.

## 0.5.9

- Reduced duplicate synchronization and added stale-message protection.

## 0.5.8

- Added randomized coin rim highlights and fixed-position highlight for forced flips.

## 0.5.7

- Enabled rebuttals by default, with 30-second default timers throughout.
