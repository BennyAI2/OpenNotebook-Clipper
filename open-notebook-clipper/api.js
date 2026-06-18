(function () {
  const ENDPOINTS = {
    notebooks: ["/notebooks", "/api/notebooks"],
    sources: ["/sources", "/api/sources"]
  };

  class OpenNotebookApiError extends Error {
    constructor(message, options = {}) {
      super(message);
      this.name = "OpenNotebookApiError";
      this.status = options.status || 0;
      this.responseText = options.responseText || "";
    }
  }

  function assertSettings(settings) {
    if (!settings.apiUrl) {
      throw new OpenNotebookApiError("Configure your Open Notebook API URL in settings.");
    }

    if (!settings.token) {
      throw new OpenNotebookApiError("Enter your password/API token in settings.");
    }
  }

  function buildHeaders(token) {
    return {
      Authorization: `Bearer ${token}`
    };
  }

  async function readResponseText(response) {
    try {
      return await response.text();
    } catch (error) {
      return "";
    }
  }

  function authMessageFor(response) {
    if (response.status === 401 || response.status === 403) {
      return "Authentication failed. Check your password/API token.";
    }

    return "";
  }

  function joinUrl(apiUrl, path) {
    return `${apiUrl}${path}`;
  }

  async function requestWithFallback(settings, endpointName, fetchOptions) {
    assertSettings(settings);

    const paths = ENDPOINTS[endpointName];
    let lastError = null;

    for (const path of paths) {
      let response;

      try {
        response = await fetch(joinUrl(settings.apiUrl, path), {
          ...fetchOptions,
          headers: {
            ...buildHeaders(settings.token),
            ...(fetchOptions.headers || {})
          }
        });
      } catch (error) {
        throw new OpenNotebookApiError(
          "Unable to reach Open Notebook API. Check the API URL, server status, and browser network access.",
          { responseText: error && error.message ? error.message : "" }
        );
      }

      if (response.ok) {
        return response;
      }

      const responseText = await readResponseText(response);
      const authMessage = authMessageFor(response);

      lastError = new OpenNotebookApiError(
        authMessage || `Open Notebook API returned HTTP ${response.status}${responseText ? `: ${responseText}` : ""}`,
        { status: response.status, responseText }
      );

      if (response.status !== 404) {
        throw lastError;
      }
    }

    throw lastError || new OpenNotebookApiError("Open Notebook API endpoint was not found.");
  }

  function parseNotebookList(payload) {
    if (Array.isArray(payload)) {
      return payload;
    }

    if (payload && Array.isArray(payload.notebooks)) {
      return payload.notebooks;
    }

    if (payload && Array.isArray(payload.data)) {
      return payload.data;
    }

    if (payload && Array.isArray(payload.items)) {
      return payload.items;
    }

    throw new OpenNotebookApiError("Open Notebook returned notebooks in an unsupported format.");
  }

  function normalizeNotebook(rawNotebook) {
    const id = rawNotebook.id || rawNotebook.uuid || rawNotebook.slug || rawNotebook.name;
    const name = rawNotebook.name || rawNotebook.title || rawNotebook.label || id;

    if (!id) {
      return null;
    }

    return {
      id: String(id),
      name: String(name || id)
    };
  }

  async function fetchNotebooks(settings) {
    const response = await requestWithFallback(settings, "notebooks", {
      method: "GET"
    });

    let payload;
    try {
      payload = await response.json();
    } catch (error) {
      throw new OpenNotebookApiError("Open Notebook returned an invalid notebook response.");
    }

    const notebooks = parseNotebookList(payload).map(normalizeNotebook).filter(Boolean);

    if (!notebooks.length) {
      throw new OpenNotebookApiError("No notebooks found in Open Notebook.");
    }

    return notebooks;
  }

  async function createSource(settings, source) {
    assertSettings(settings);

    if (!source.notebookId) {
      throw new OpenNotebookApiError("Choose a notebook before saving.");
    }

    if (!source.url) {
      throw new OpenNotebookApiError("The current tab does not have a URL that can be saved.");
    }

    const notebookId = String(source.notebookId).replace(/^notebook:/, "");
    const formData = new FormData();
    formData.append("type", "link");
    formData.append("url", source.url);
    formData.append("title", source.title || source.url);
    formData.append("notebooks", JSON.stringify([`notebook:${notebookId}`]));
    formData.append("embed", "true");
    formData.append("async_processing", "true");

    const response = await requestWithFallback(settings, "sources", {
      method: "POST",
      body: formData
    });

    const responseText = await readResponseText(response);

    if (!responseText) {
      return {};
    }

    try {
      return JSON.parse(responseText);
    } catch (error) {
      return { raw: responseText };
    }
  }

  globalThis.OpenNotebookApi = {
    OpenNotebookApiError,
    createSource,
    fetchNotebooks
  };
})();
