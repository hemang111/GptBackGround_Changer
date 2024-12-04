chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && tab.url.includes("chatgpt.com") && changeInfo.status === "complete") {
    applySavedBackground(tabId);
    window.location.reload();
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.url && tab.url.includes("chatgpt.com")) {
      applySavedBackground(tab.id);
    }
  });
});

function applySavedBackground(tabId) {
  chrome.storage.sync.get("background", ({ background }) => {
    if (background) {
      chrome.scripting.executeScript({
        target: { tabId },
        func: (bg) => {
          const applyBackground = () => {
            const bodyStyle = document.body.style;
            if (bg.type === "color") {
              bodyStyle.setProperty("background-color", bg.value, "important");
              bodyStyle.setProperty("background-image", "", "important");
            } else if (bg.type === "image") {
              bodyStyle.setProperty("background-color", "", "important");
              bodyStyle.setProperty("background-image", `url('${bg.value}')`, "important");
              bodyStyle.setProperty("background-size", "cover", "important");
            }
          };

          // Persistent style reapplication during the first few seconds
          const monitorAndApply = () => {
            const intervalId = setInterval(() => {
              applyBackground();
            }, 200); // Check every 200ms

            // Stop monitoring after 5 seconds
            setTimeout(() => clearInterval(intervalId), 5000);
          };

          // Apply styles immediately and start monitoring
          applyBackground();
          monitorAndApply();
        },
        args: [background],
      });
    }
  });
}
