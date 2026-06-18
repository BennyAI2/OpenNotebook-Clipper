(function () {
  function getApiOriginPattern(apiUrl) {
    let parsedUrl;

    try {
      parsedUrl = new URL(apiUrl);
    } catch (error) {
      return "";
    }

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return "";
    }

    return `${parsedUrl.protocol}//${parsedUrl.hostname}/*`;
  }

  async function hasApiHostPermission(apiUrl) {
    const origin = getApiOriginPattern(apiUrl);

    if (!origin || !chrome.permissions) {
      return false;
    }

    return chrome.permissions.contains({ origins: [origin] });
  }

  async function ensureApiHostPermission(apiUrl) {
    const origin = getApiOriginPattern(apiUrl);

    if (!origin) {
      return false;
    }

    if (!chrome.permissions) {
      return true;
    }

    const alreadyGranted = await chrome.permissions.contains({ origins: [origin] });

    if (alreadyGranted) {
      return true;
    }

    return chrome.permissions.request({ origins: [origin] });
  }

  globalThis.OpenNotebookPermissions = {
    ensureApiHostPermission,
    getApiOriginPattern,
    hasApiHostPermission
  };
})();
