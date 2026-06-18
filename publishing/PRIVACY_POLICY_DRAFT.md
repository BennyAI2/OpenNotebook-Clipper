# OpenNotebook Clipper Privacy Policy Draft

Last updated: 2026-06-18

OpenNotebook Clipper is a Chrome extension that lets you save the current page URL and page title to your own Open Notebook instance.

## Data The Extension Handles

The extension handles:

- The current tab URL.
- The current tab title.
- Your configured Open Notebook API URL.
- Your Open Notebook password/API token.
- Your last selected notebook ID.

## How Data Is Used

The extension uses the current tab URL and title only to create a link source in the notebook you select.

The API URL, password/API token, and last selected notebook are stored locally in Chrome using `chrome.storage.local`. They are used to load your notebooks and save links to your configured Open Notebook API.

## Data Sharing

The extension sends page URLs, page titles, notebook IDs, and your authorization token only to the Open Notebook API URL that you configure in the extension settings.

The extension does not sell user data, use analytics, inject ads, or send browsing data to the developer.

The extension includes a voluntary donation link that opens Stripe. Stripe handles any payment information directly. The extension does not collect, store, or process payment card data.

## Limited Use Disclosure

The use of information received from Chrome extension APIs will adhere to the Chrome Web Store User Data Policy, including the Limited Use requirements.

## Security

Your token is stored in `chrome.storage.local` and is not logged by the extension. For best security, use HTTPS for remote Open Notebook API deployments. Local development URLs such as `http://localhost:5055` are intended for local-only use.

## Contact

Add your support email or project URL here before publishing.
