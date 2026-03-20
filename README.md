# Fennec Update Notifier

A minimal Firefox extension that notifies users when a new version of [Fennec](https://github.com/tompassarelli/fennec) is available.

Fennec is a userChrome.css theme — it has no built-in update mechanism. This extension bridges that gap.

## How it works

1. On install, the extension fetches the latest Fennec release from GitHub and stores the version — no notification is shown
2. Every 24 hours (and on browser startup), it checks for a new release
3. If a newer version is found, a system notification appears: *"vX.X.X is available. Click the Fennec extension icon for install commands."*
4. Dismissing the notification (or clicking it) stores that version so the user is not notified again until the next release
5. The toolbar icon opens a popup with platform-specific install commands (macOS/Linux and Windows) with copy buttons

## Permissions

| Permission | Reason |
|---|---|
| `storage` | Persists the last dismissed version across sessions |
| `notifications` | Shows the update notification |
| `alarms` | Schedules the 24-hour check interval (MV3 event pages can't use `setInterval`) |
| `https://api.github.com/*` | Fetches the latest release tag from the GitHub API |

## Technical notes

- Manifest V3, event-driven background script
- No content scripts, no page access, no data collection
- The extension does not know what version of Fennec the user has installed — it simply announces new releases. Extensions cannot read userChrome.css or the profile's chrome directory.
- On first install, the current latest release is stored as "seen" so the user is not immediately prompted
