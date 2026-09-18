# Changelog

## 0.1.3 — 2026-09-18

- The notification now names the workspace the command ran in, so several windows can be told apart.

## 0.1.2 — 2026-09-18

- Added the extension icon.

## 0.1.1 — 2026-09-18

- First public release. A Windows toast when a terminal command or task that took a while ends
  while the VS Code window is in the background: what ran, how long it took, and whether it failed.
- Tasks are watched as well as terminal commands, so a build started with Run Build Task is announced.
- `terminalToast.minSeconds` and `terminalToast.unfocusedOnly` decide what is worth a toast.
