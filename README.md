# My Trains — Shared V1 (recreated 1 November 2026)

This is a recreation from the recovered conversation requirements, not the original lost ZIP. Source repository: https://github.com/jsawb/my-trains . Repository contents could not be retrieved in this session; no changes were pushed.

## Start here
1. Extract this ZIP. Upload its CONTENTS to jsawb/my-trains: index.html must be at the repository root. Keep the scriptable and server folders.
2. In GitHub, Settings → Pages → Deploy from a branch → main → /(root) → Save. If using another default branch, select that branch instead.
3. Open https://jsawb.github.io/my-trains/ after Pages finishes deploying. On each iPhone, open it in Safari → Share → Add to Home Screen.
4. Open Settings in the app. Each phone chooses Kidderminster or Stourbridge Junction independently. Enable Wednesday journeys only on your phone; leave them off on your wife's phone. Defaults are Kidderminster and Wednesday off, as a deliberate first-run choice.
5. The app opens without live data configured. Routes and preferences work; no invented departure times are displayed.

## Routes and automatic selection
- Morning: KID or SBJ → BSW (Birmingham Snow Hill).
- Evening: BMO (Birmingham Moor Street) → KID or SBJ.
- Personal Wednesday: KID → ROW (Rowley Regis), around 19:00; ROW → KID, around 21:00. Always Kidderminster regardless of commute preference.
- Automatic uses Europe/London, including daylight saving: before noon morning, after noon evening. On Wednesdays with the personal toggle on, 17:00–19:59 selects outbound; from 20:00 selects return. Other days retain the commute selections (including weekends, for manual convenience).
- Manual morning/evening always available; personal Wednesday options appear only when enabled. These are route presets, not reservations or confirmed scheduled trains. Live boards show upcoming departures now, not an all-day timetable or guaranteed 19:00/21:00 service.

## Connect real departures (separate setup)
Feasible according to National Rail's official documentation, checked 1 November 2026:
https://www.nationalrail.co.uk/developers/darwin-data-feeds/
https://realtime.nationalrail.co.uk/LDBWS/docs/documentation.html
https://realtime.nationalrail.co.uk/LDBWS/static/ldbws.json

Register and subscribe to the appropriate Darwin public JSON LDB product via Rail Data Marketplace. Confirm credentials, API base URL, terms, attribution requirements and applicable limits for YOUR subscription. The published OpenAPI has a localhost host value; it does not establish your production base URL. Do not copy that localhost address. The JSON API documentation describes Basic authentication; SOAP tokens are a different integration.

GitHub Pages hosts static files and cannot hide an API credential. The included server/worker.mjs is a small Cloudflare Worker adapter based on the published JSON specification. Deploy it separately after obtaining access (Cloudflare account required; check current service pricing/limits). Its upstream URL and authentication are NOT tested against a subscribed service.

From the server folder, with Wrangler installed and signed into Cloudflare:
1. Set secret LDB_BASE_URL to your provider-confirmed HTTPS service base (including /LDBWS if applicable).
2. Set secret LDB_AUTH to Base64(username:password), without the Basic prefix. Use wrangler secret put for each secret, entering values privately. Base64 does not protect a password; never commit it.
3. Deploy with wrangler deploy. APP_ORIGIN is https://jsawb.github.io (origin, without /my-trains/).
4. Verify GET https://YOUR-WORKER/?from=KID&to=BSW and each other route before relying on it. Confirm passing-through services are included by the subscribed API's destination filter; adjust the adapter if necessary.
5. Put the Worker HTTPS URL in Settings on each device. Never put upstream credentials in the app or widget.

The adapter permits only the six route pairs; it is publicly callable. Add provider-side rate limits/access controls appropriate to your usage. CORS is not authentication. App refreshes every 60 seconds while visible; widget timing is controlled by iOS. Errors and responses older than five minutes display unavailable, with no fabricated fallback. Offline app shell works after an initial online load; live data does not work offline and is not stored by the service worker.

## Scriptable widget
1. Install Scriptable on each iPhone. Create a script named My Trains and paste scriptable/My Trains.js into it.
2. Add a medium Scriptable widget to the Home Screen. Edit Widget → Script → My Trains.
3. In the PWA, save your preferences and tap Copy widget settings. Paste the resulting JSON into the widget's Parameter field. The widget has no automatic access to Safari storage. Repeat this copy if preferences change.
4. Example parameter (replace endpoint after deploying the adapter):
   {"home":"KID","wednesday":true,"endpoint":"","appURL":"https://jsawb.github.io/my-trains/","mode":"auto"}
   For your wife's widget use wednesday:false. Home may be KID or SBJ. Mode may be auto, morning, evening, out or back; out/back require Wednesday enabled.
5. Run once in Scriptable to inspect. Tap widget to open the app. iOS decides refresh frequency; the script requests another refresh after ten minutes. No claim of minute-by-minute widget updates.

## Verification status
JavaScript syntax, route selection (including Wednesday isolation and London daylight saving), adapter error/mapping behavior with mock responses, referenced shell files and ZIP integrity are checked locally. Mock data is used only in tests, never in the app.
NOT verified: authenticated train feed, upstream production host/credentials, real station board results/platforms, provider filtering of intermediate calling points, GitHub deployment, installation on iPhone, or Scriptable runtime rendering. Finish these checks before relying on departures. No API credentials were available.

## Download recovery
The archive is my-trains-shared-v1.zip, with index.html at ZIP root. Save a local copy before uploading; do not upload the ZIP itself as the app. CHECKSUMS.sha256 lists the packaged source file hashes. VERIFICATION.txt records the recreation checks.
