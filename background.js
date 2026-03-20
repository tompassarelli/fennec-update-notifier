const RELEASE_URL = "https://api.github.com/repos/tompassarelli/fennec/releases/latest";

async function getLatestVersion() {
  const res = await fetch(RELEASE_URL);
  if (!res.ok) return null;
  const data = await res.json();
  return data.tag_name;
}

async function check() {
  const latest = await getLatestVersion();
  if (!latest) return;

  const { lastDismissedVersion } = await browser.storage.local.get("lastDismissedVersion");

  if (!lastDismissedVersion) {
    await browser.storage.local.set({ lastDismissedVersion: latest });
    return;
  }

  if (latest !== lastDismissedVersion) {
    browser.notifications.create("fennec-update", {
      type: "basic",
      title: "Fennec Update Available",
      message: `${latest} is available. Click the Fennec extension icon for install commands.`,
    });
  }
}

browser.notifications.onClicked.addListener(async (id) => {
  if (id === "fennec-update") {
    browser.tabs.create({ url: "https://github.com/tompassarelli/fennec#2-install-css" });
    const latest = await getLatestVersion();
    if (latest) {
      await browser.storage.local.set({ lastDismissedVersion: latest });
    }
    browser.notifications.clear("fennec-update");
  }
});

browser.notifications.onClosed.addListener(async (id) => {
  if (id === "fennec-update") {
    const latest = await getLatestVersion();
    if (latest) {
      await browser.storage.local.set({ lastDismissedVersion: latest });
    }
  }
});

// Check on startup
browser.runtime.onStartup.addListener(check);
browser.runtime.onInstalled.addListener(check);

// Check every 24 hours
browser.alarms.create("fennec-update-check", { periodInMinutes: 1440 });
browser.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "fennec-update-check") check();
});
