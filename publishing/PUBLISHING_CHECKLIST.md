# Chrome Web Store Publishing Checklist

Sources checked:

- Chrome Web Store Program Policies: https://developer.chrome.com/docs/webstore/program-policies/policies
- Prepare your extension: https://developer.chrome.com/docs/webstore/prepare
- Privacy fields: https://developer.chrome.com/docs/webstore/cws-dashboard-privacy
- Supplying images: https://developer.chrome.com/docs/webstore/images
- Declare permissions: https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions
- Publish in the Chrome Web Store: https://developer.chrome.com/docs/webstore/publish

## Local Package

- [x] Uses Manifest V3.
- [x] Manifest has `name`, `version`, `description`, and `icons`.
- [x] Extension has a narrow single purpose: save the current page URL/title to a user-configured Open Notebook API.
- [x] No remote JavaScript or external scripts are loaded.
- [x] No analytics.
- [x] No obfuscated/minified code.
- [x] No affiliate-code injection, ad injection, or page modification.
- [x] Token is stored only in `chrome.storage.local`.
- [x] Token is not logged.
- [x] Current page URL/title is sent only after user action.
- [x] Extension uses optional host permissions for the configured Open Notebook API host instead of install-time `<all_urls>`.
- [x] JavaScript syntax checks pass.
- [x] Manifest parses successfully.
- [ ] Manually test loaded extension in Chrome after each final package build.

## Permissions To Justify In Developer Dashboard

- [x] `storage`: saves API URL, API token/password, and last selected notebook locally.
- [x] `activeTab`: reads the current tab title and URL when the popup is opened by the user.
- [x] `contextMenus`: adds the right-click "Save page to OpenNotebook" action.
- [x] `notifications`: shows success/error messages after context menu saves.
- [x] `optional_host_permissions`: requested for the user-entered Open Notebook API host so the extension can load notebooks and save sources.

## Store Listing

- [ ] Add at least 1 screenshot, ideally 3-5.
- [ ] Screenshots must be `1280x800` or `640x400`, square corners, no padding.
- [ ] Confirm listing description clearly states the extension saves URLs/titles, not full article content.
- [ ] Mention that users configure their own Open Notebook API URL and token/password.
- [ ] Avoid implying official Open Notebook endorsement unless you have permission.
- [ ] Use the "Clipper" icon, not Open Notebook's logo or initials.
- [ ] Choose a category that fits productivity or workflow tools.
- [ ] Add support contact URL/email.

## Privacy

- [ ] Publish a privacy policy at a stable public URL.
- [ ] Put that URL in the Chrome Developer Dashboard privacy field.
- [ ] Privacy policy must explain collection/use/sharing of tab URL, page title, API URL, token/password, and selected notebook.
- [ ] Privacy policy must say data is sent only to the user-configured Open Notebook API URL.
- [ ] Include the Chrome Web Store Limited Use disclosure.
- [ ] Dashboard privacy fields must match actual behavior and the privacy policy.

## Payments / Donation Link

- [ ] The settings page contains a voluntary Stripe donation link.
- [ ] In the Developer Dashboard, accurately disclose payment/donation behavior if prompted by the "Contains in-app purchases" or monetization fields.
- [ ] Store listing should clarify the extension is usable without payment and donations do not unlock functionality.
- [ ] Do not describe the donation as required for any feature.

## Reviewer Test Instructions

- [ ] Provide a reachable Open Notebook API test URL or clear local setup steps.
- [ ] Provide a test token/password for review, or explain how to run local Open Notebook.
- [ ] Include steps to test popup save and context menu save.
- [ ] Include expected behavior for failed auth and missing notebook.

## Before Upload

- [ ] Increment `manifest.json` version if this is not the first upload.
- [ ] Create ZIP with `manifest.json` at the ZIP root.
- [ ] Upload ZIP through Chrome Developer Dashboard.
- [ ] Re-check privacy, permissions, payment, visibility, and listing tabs before submission.
