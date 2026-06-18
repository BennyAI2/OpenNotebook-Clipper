importScripts("storage.js", "api.js");

const MENU_ID = "save-page-to-open-notebook";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_ID,
    title: "Save page to OpenNotebook",
    contexts: ["page"]
  });
});

async function showNotification(title, message) {
  try {
    await chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon128.png",
      title,
      message
    });
  } catch (error) {
    console.info(`${title}: ${message}`);
  }
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== MENU_ID) {
    return;
  }

  saveCurrentPageFromContextMenu(tab);
});

async function saveCurrentPageFromContextMenu(tab) {
  try {
    const settings = await OpenNotebookStorage.getSettings();

    if (!settings.lastNotebookId) {
      throw new OpenNotebookApi.OpenNotebookApiError(
        "Open the extension popup and choose a notebook before using the right-click menu."
      );
    }

    await OpenNotebookApi.createSource(settings, {
      notebookId: settings.lastNotebookId,
      title: tab && tab.title ? tab.title : "Untitled page",
      url: tab && tab.url ? tab.url : ""
    });

    await showNotification("Saved to OpenNotebook", "The page was sent to your selected notebook.");
  } catch (error) {
    await showNotification(
      "OpenNotebook Clipper error",
      error && error.message ? error.message : "The page could not be saved."
    );
  }
}
