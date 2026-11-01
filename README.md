# My Trains V1.1 — update guide

This replaces the blank departure-service setting with a direct connection to Trainiac. No account, API key, paid service, or Cloudflare Worker is required for this personal app.

## Update GitHub Pages

1. Download and extract My-Trains-V1.1.zip. Keep a backup of the repository first (GitHub Code → Download ZIP).
2. Open https://github.com/jsawb/my-trains and select the main branch.
3. Choose Add file → Upload files. Open the extracted package and drag its CONTENTS into GitHub, including all app files and icons. Do not upload the ZIP itself or a containing folder.
4. Commit the files with the message “Connect My Trains V1.1 live departures”.
5. Leave Settings → Pages on Deploy from a branch, main, / (root). No build command or API secret is needed.
6. Wait for the Pages deployment to finish in Actions, then open https://jsawb.github.io/my-trains/ in Safari and reload. Close and reopen an existing Home Screen app if it still shows the old version. A further reload may be needed after the new service worker installs. Look for “V1.1” in the footer and no departure-service URL input. Avoid clearing website data unless necessary: that removes your saved preferences.
7. Check that the board shows “Rail data as of” with a recent London timestamp and actual departure rows. Check Morning and Evening for your chosen home station. An empty board is possible; an error is not proof of a working live connection. If an error appears, retry after the stated wait and consult VERIFICATION.txt.
8. On YOUR phone only, open Settings on this phone, enable Include my Wednesday journeys, and save. On the other phone leave this off. Each person chooses Kidderminster or Stourbridge Junction independently. Saved settings from V1 are retained under the existing storage key.

## Journeys

- Morning: chosen home (Kidderminster / Stourbridge Junction) → Birmingham Snow Hill.
- Evening: Birmingham Moor Street → chosen home.
- Wednesday opt-in: Kidderminster → Rowley Regis, around 19:00; Rowley Regis → Kidderminster, around 21:00.
- Automatic mode uses Europe/London, including summer time. Before noon it selects Morning; afterwards Evening. For Wednesday-enabled devices, from 17:00 it selects outbound, then return from 20:00. These are selection/reminder times, not promises that a train departs at exactly 19:00 or 21:00. The board shows the next departures today, not a future-date timetable. Wednesday can be selected manually for a preview of today's trains.

## Live connection and errors

https://api.traini.ac/v1/departures/{origin}?calling_at={destination}&limit=6

Trainiac documentation: https://traini.ac/developers

Personal, non-commercial use is free without credentials. The documented budget is 120 units/minute per IP address; a departure request costs 3. The app polls once per minute while visible, spaces requests by at least 30 seconds, and waits after HTTP 429/503 using Retry-After. No custom User-Agent is sent by the PWA because browsers control that header. No credentials are embedded. The API receives the requested station pair and normal connection information; preferences stay in this browser's local storage. No accounts or cross-device settings sync.

The service is third-party and can change or withdraw access. Displayed timestamps identify response generation, not the age of every underlying prediction. Unknown estimates are never called “on time”; planned platforms are marked planned. Cancelled services, withheld platforms, replacement buses and delay reasons are displayed when supplied. Empty, stale, invalid, timeout and unavailable responses are distinct from successful departures. Offline mode keeps the app shell available but does not cache rail answers or display old trains as current. The shell cache is versioned for this update.

## Optional Scriptable widget

The replacement My Trains.js uses the same direct API and no endpoint setting. Replace the old script in Scriptable, use Copy widget settings in the app and paste that JSON as the widget parameter. Scriptable settings are independent of Safari settings. iOS decides widget refresh timing (the script requests 10 minutes); it is not a continuously live board. Scriptable on iPhone was not tested in this environment. Setting it up is optional; the PWA works independently.

worker.mjs and wrangler.toml are retained legacy files and are not used by V1.1. Do not deploy them for this update. No GitHub Pages settings changes are required. CHECKSUMS.sha256 and VERIFICATION.txt describe this package, replacing the V1 reports.

Data via Trainiac. © Network Rail Infrastructure Limited and Rail Delivery Group, under their open data licences. Check station screens before travelling.
