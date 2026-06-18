const state = {
  activeTab: null,
  notebooks: [],
  settings: {
    apiUrl: "",
    token: "",
    lastNotebookId: ""
  }
};

const elements = {
  apiUrlInput: document.getElementById("apiUrlInput"),
  backButton: document.getElementById("backButton"),
  clipperView: document.getElementById("clipperView"),
  notebookSelect: document.getElementById("notebookSelect"),
  openSettingsButton: document.getElementById("openSettingsButton"),
  pageTitle: document.getElementById("pageTitle"),
  pageUrl: document.getElementById("pageUrl"),
  refreshNotebooksButton: document.getElementById("refreshNotebooksButton"),
  saveButton: document.getElementById("saveButton"),
  saveSettingsButton: document.getElementById("saveSettingsButton"),
  settingsStatusMessage: document.getElementById("settingsStatusMessage"),
  settingsView: document.getElementById("settingsView"),
  statusMessage: document.getElementById("statusMessage"),
  testConnectionButton: document.getElementById("testConnectionButton"),
  tokenInput: document.getElementById("tokenInput")
};

document.addEventListener("DOMContentLoaded", init);

async function init() {
  bindEvents();
  setStatus("Loading current tab...", "loading");

  state.settings = await OpenNotebookStorage.getSettings();
  syncSettingsForm();
  await loadActiveTab();

  if (state.settings.apiUrl && state.settings.token) {
    await loadNotebooks();
  } else {
    renderNotebookOptions([]);
    setStatus("Configure your Open Notebook API URL and token in settings.", "error");
  }
}

function bindEvents() {
  elements.openSettingsButton.addEventListener("click", () => showSettings(true));
  elements.backButton.addEventListener("click", () => showSettings(false));
  elements.refreshNotebooksButton.addEventListener("click", loadNotebooks);
  elements.saveButton.addEventListener("click", saveCurrentPage);
  elements.saveSettingsButton.addEventListener("click", saveSettings);
  elements.testConnectionButton.addEventListener("click", testConnection);
  elements.notebookSelect.addEventListener("change", rememberSelectedNotebook);
}

function showSettings(isVisible) {
  elements.clipperView.classList.toggle("hidden", isVisible);
  elements.settingsView.classList.toggle("hidden", !isVisible);

  if (isVisible) {
    syncSettingsForm();
    elements.apiUrlInput.focus();
  }
}

function syncSettingsForm() {
  elements.apiUrlInput.value = state.settings.apiUrl || "";
  elements.tokenInput.value = state.settings.token || "";
}

async function loadActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  state.activeTab = tabs[0] || null;

  elements.pageTitle.textContent = state.activeTab && state.activeTab.title ? state.activeTab.title : "Untitled page";
  elements.pageUrl.textContent = state.activeTab && state.activeTab.url ? state.activeTab.url : "No URL available";
}

async function loadNotebooks() {
  setBusy(true, "Loading notebooks...");

  try {
    state.settings = await OpenNotebookStorage.getSettings();
    state.notebooks = await OpenNotebookApi.fetchNotebooks(state.settings);
    renderNotebookOptions(state.notebooks);
    setStatus("Notebooks loaded.", "success");
  } catch (error) {
    renderNotebookOptions([]);
    setStatus(error.message || "Notebooks could not be loaded.", "error");
  } finally {
    setBusy(false);
  }
}

function renderNotebookOptions(notebooks) {
  elements.notebookSelect.innerHTML = "";

  if (!notebooks.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No notebooks available";
    elements.notebookSelect.append(option);
    return;
  }

  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = "Choose a notebook";
  elements.notebookSelect.append(emptyOption);

  for (const notebook of notebooks) {
    const option = document.createElement("option");
    option.value = notebook.id;
    option.textContent = notebook.name;
    elements.notebookSelect.append(option);
  }

  const matchingLastNotebook = notebooks.some((notebook) => notebook.id === state.settings.lastNotebookId);
  elements.notebookSelect.value = matchingLastNotebook ? state.settings.lastNotebookId : "";
}

async function rememberSelectedNotebook() {
  state.settings = await OpenNotebookStorage.saveSettings({
    lastNotebookId: elements.notebookSelect.value
  });
}

async function saveSettings() {
  setSettingsStatus("Saving settings...", "loading");
  elements.saveSettingsButton.disabled = true;

  try {
    const apiUrl = OpenNotebookStorage.normalizeApiUrl(elements.apiUrlInput.value);
    const granted = await OpenNotebookPermissions.ensureApiHostPermission(apiUrl);

    if (!granted) {
      throw new OpenNotebookApi.OpenNotebookApiError("Allow access to your Open Notebook API URL to load notebooks and save pages.");
    }

    state.settings = await OpenNotebookStorage.saveSettings({
      apiUrl,
      token: elements.tokenInput.value
    });
    syncSettingsForm();
    setSettingsStatus("Settings saved.", "success");
    await loadNotebooks();
  } catch (error) {
    setSettingsStatus(error.message || "Settings could not be saved.", "error");
  } finally {
    elements.saveSettingsButton.disabled = false;
  }
}

async function testConnection() {
  setSettingsStatus("Testing connection...", "loading");
  elements.testConnectionButton.disabled = true;

  try {
    const settings = {
      apiUrl: OpenNotebookStorage.normalizeApiUrl(elements.apiUrlInput.value),
      token: elements.tokenInput.value.trim()
    };

    const granted = await OpenNotebookPermissions.ensureApiHostPermission(settings.apiUrl);

    if (!granted) {
      throw new OpenNotebookApi.OpenNotebookApiError("Allow access to your Open Notebook API URL to test the connection.");
    }

    const notebooks = await OpenNotebookApi.fetchNotebooks(settings);
    setSettingsStatus(`Connection works. Found ${notebooks.length} notebook${notebooks.length === 1 ? "" : "s"}.`, "success");
  } catch (error) {
    setSettingsStatus(error.message || "Connection test failed.", "error");
  } finally {
    elements.testConnectionButton.disabled = false;
  }
}

async function saveCurrentPage() {
  setBusy(true, "Saving page...");

  try {
    const notebookId = elements.notebookSelect.value;

    if (!notebookId) {
      throw new OpenNotebookApi.OpenNotebookApiError("Choose a notebook before saving.");
    }

    state.settings = await OpenNotebookStorage.saveSettings({
      lastNotebookId: notebookId
    });

    await OpenNotebookApi.createSource(state.settings, {
      notebookId,
      title: state.activeTab && state.activeTab.title ? state.activeTab.title : "Untitled page",
      url: state.activeTab && state.activeTab.url ? state.activeTab.url : ""
    });

    setStatus("Saved to OpenNotebook.", "success");
  } catch (error) {
    setStatus(error.message || "The page could not be saved.", "error");
  } finally {
    setBusy(false);
  }
}

function setBusy(isBusy, message) {
  elements.saveButton.disabled = isBusy;
  elements.refreshNotebooksButton.disabled = isBusy;
  elements.notebookSelect.disabled = isBusy;

  if (message) {
    setStatus(message, "loading");
  }
}

function setStatus(message, type) {
  setMessage(elements.statusMessage, message, type);
}

function setSettingsStatus(message, type) {
  setMessage(elements.settingsStatusMessage, message, type);
}

function setMessage(element, message, type) {
  element.textContent = message || "";
  element.classList.remove("loading", "success", "error");

  if (type) {
    element.classList.add(type);
  }
}
