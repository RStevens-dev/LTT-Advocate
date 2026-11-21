# Changelog

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
