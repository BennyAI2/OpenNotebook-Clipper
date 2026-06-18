(function () {
  const DEFAULT_SETTINGS = {
    apiUrl: "",
    token: "",
    lastNotebookId: ""
  };

  function normalizeApiUrl(apiUrl) {
    return String(apiUrl || "").trim().replace(/\/+$/, "");
  }

  async function getSettings() {
    const stored = await chrome.storage.local.get(DEFAULT_SETTINGS);
    return {
      apiUrl: normalizeApiUrl(stored.apiUrl),
      token: stored.token || "",
      lastNotebookId: stored.lastNotebookId || ""
    };
  }

  async function saveSettings(settings) {
    const next = {};

    if (Object.prototype.hasOwnProperty.call(settings, "apiUrl")) {
      next.apiUrl = normalizeApiUrl(settings.apiUrl);
    }

    if (Object.prototype.hasOwnProperty.call(settings, "token")) {
      next.token = String(settings.token || "").trim();
    }

    if (Object.prototype.hasOwnProperty.call(settings, "lastNotebookId")) {
      next.lastNotebookId = String(settings.lastNotebookId || "");
    }

    await chrome.storage.local.set(next);
    return getSettings();
  }

  globalThis.OpenNotebookStorage = {
    getSettings,
    normalizeApiUrl,
    saveSettings
  };
})();
