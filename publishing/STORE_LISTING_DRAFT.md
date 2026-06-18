# Store Listing Draft

## Name

OpenNotebook Clipper

## Short Description

Save the current page URL and title to your Open Notebook instance.

## Detailed Description

OpenNotebook Clipper is a small browser extension for quickly saving the current page as a link source in Open Notebook.

Open the popup, configure your Open Notebook API URL and password/API token, choose a notebook, and save the current page. You can also right-click a page and use "Save page to OpenNotebook" after choosing a notebook once in the popup.

What it does:

- Shows the current page title and URL before saving.
- Loads notebooks from your configured Open Notebook API.
- Saves links with async processing and embedding enabled.
- Remembers your last selected notebook.
- Supports direct `/notebooks` and `/sources` endpoints plus `/api/notebooks` and `/api/sources` fallback paths.

Privacy:

- No analytics.
- No ads.
- No remote scripts.
- No data is sent to the developer.
- Page URL/title and your token are sent only to the Open Notebook API URL you configure.

Note: This MVP saves URLs and page titles. It does not save full article content.

OpenNotebook Clipper is an independent companion tool and is not an official Open Notebook product unless that changes later.

## Suggested Category

Productivity

## Permission Justifications

`storage`: Stores your API URL, API token/password, and last selected notebook locally.

`activeTab`: Reads the active tab title and URL when you open the popup.

`contextMenus`: Adds a right-click action to save the current page.

`notifications`: Shows save success/error messages when using the right-click action.

`optional host permissions`: Requests access only to the Open Notebook API host you configure, so the extension can load notebooks and save sources.

## Reviewer Instructions

1. Load the extension.
2. Open the popup and click Settings.
3. Enter an Open Notebook API URL, for example `http://localhost:5055`.
4. Enter the configured Open Notebook password/API token.
5. Save settings and allow access to the API host when Chrome prompts.
6. Click Test connection.
7. Return to the main popup, select a notebook, and click Save to OpenNotebook.
8. Right-click a page and choose Save page to OpenNotebook.

If no public test Open Notebook API is provided, reviewers can run Open Notebook locally and use its configured `OPEN_NOTEBOOK_PASSWORD` as the bearer token.
