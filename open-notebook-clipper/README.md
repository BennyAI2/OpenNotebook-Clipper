# OpenNotebook Clipper

OpenNotebook Clipper is a minimal Chrome Extension MV3 popup for saving the current browser page to Open Notebook as a URL/link source. This MVP saves page URLs and titles, not full article content.

## Install

1. Open Chrome and go to `chrome://extensions`.
2. Turn on **Developer mode**.
3. Click **Load unpacked**.
4. Select the `open-notebook-clipper` folder.
5. Pin the extension if you want quick access from the toolbar.

## Configure

1. Open the extension popup.
2. Click the gear icon.
3. Enter your Open Notebook API URL.
   - Example: `http://localhost:5055`
   - If Open Notebook is behind a reverse proxy, use the browser-reachable base URL.
4. Enter your password/API token.
5. Click **Save settings**.
6. Allow Chrome access to that API host when prompted.
7. Click **Test connection** to confirm notebooks can be loaded.

Settings are stored in `chrome.storage.local`. The token is only sent to the configured Open Notebook API URL using the `Authorization: Bearer <token>` header.

For Docker installs, set a unique `OPEN_NOTEBOOK_PASSWORD` on the Open Notebook container and use that value as the extension password/API token. If your compose file uses an `API_URL` variable, set it to the browser-reachable API base URL, for example `http://localhost:5055`.

## Use

Open any page, open the extension popup, choose a notebook, and click **Save to OpenNotebook**. The extension sends:

- `type=link`
- `url=<current tab URL>`
- `title=<current tab title>`
- `notebooks=["notebook:NOTEBOOK_ID"]`
- `embed=true`
- `async_processing=true`

You can also right-click a page and choose **Save page to OpenNotebook**. The context menu uses the last notebook selected in the popup. If no notebook has been selected yet, open the popup and choose one first.

## API Paths

The extension tries direct endpoints first:

- `GET /notebooks`
- `POST /sources`

If either endpoint returns `404`, it automatically retries:

- `GET /api/notebooks`
- `POST /api/sources`

These endpoint paths are defined in `api.js` so they can be changed in one place.

## Troubleshooting

**API not reachable**

Confirm Open Notebook is running and that the API URL works from the same Chrome profile. For a local install, start with `http://localhost:5055`.

**Authentication failure**

If you see `Authentication failed. Check your password/API token.`, verify the token or password expected by your Open Notebook deployment.

**No notebooks found**

Confirm your Open Notebook account has notebooks and that the API returns notebooks from `/notebooks` or `/api/notebooks`.

**CORS or network errors**

Chrome extensions can call configured hosts, but the server still needs to be reachable. Check reverse proxy rules, local firewall rules, and whether the API is bound to the expected host and port.

**Reverse proxy path issues**

If your deployment exposes Open Notebook under a base path, set the API URL to that base path. For example, use `https://example.com/open-notebook` if the API endpoints are below that path.

## Files

- `manifest.json`: Chrome Extension MV3 manifest.
- `popup.html`, `popup.css`, `popup.js`: Popup UI and interactions.
- `background.js`: Context menu integration.
- `api.js`: Open Notebook API client with direct and `/api` endpoint fallback.
- `storage.js`: Settings and selected notebook persistence.
