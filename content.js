function applyBackground(background) {
  const bodyStyle = document.body.style;

  if (background.type === "color") {
    bodyStyle.setProperty("background-color", background.value, "important");
    bodyStyle.setProperty("background-image", "", "important");
  } else if (background.type === "image") {
    bodyStyle.setProperty("background-color", "", "important");
    bodyStyle.setProperty("background-image", `url('${background.value}')`, "important");
    bodyStyle.setProperty("background-size", "cover", "important");
  }
}

// Function to apply background with persistent check
function monitorAndApplyBackground(background) {
  // Apply background immediately
  applyBackground(background);

  // Set interval to persistently reapply the background if overridden
  const intervalId = setInterval(() => {
    applyBackground(background);
  }, 200); // Check every 200ms

  // Stop checking after 5 seconds
  setTimeout(() => clearInterval(intervalId), 5000);
}

// Retrieve the background from storage and apply
chrome.storage.sync.get("background", ({ background }) => {
  if (background) {
    console.log("Applying saved background:", background);
    monitorAndApplyBackground(background);
  } else {
    console.log("No saved background found.");
  }
});
x``