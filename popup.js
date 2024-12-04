document.addEventListener("DOMContentLoaded", () => {
  const colorPicker = document.getElementById("colorPicker");
  const imageUrlInput = document.getElementById("imageUrl");
  const applyChangeButton = document.getElementById("applyChange");

  document.querySelectorAll('input[name="bgOption"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.value === "color") {
        colorPicker.disabled = false;
        imageUrlInput.disabled = true;
      } else if (radio.value === "image") {
        colorPicker.disabled = true;
        imageUrlInput.disabled = false;
      }
    });
  });

  applyChangeButton.addEventListener("click", () => {
    const selectedOption = document.querySelector('input[name="bgOption"]:checked').value;
    if (selectedOption === "color") {
      const color = colorPicker.value;
      saveAndApplyBackground({ type: "color", value: color });
    } else if (selectedOption === "image") {
      const imageUrl = imageUrlInput.value;
      if (imageUrl.trim()) {
        saveAndApplyBackground({ type: "image", value: imageUrl });
      } else {
        alert("Please enter a valid image URL.");
      }
    }
  });

  loadSavedBackground();
});


function saveAndApplyBackground(background) {
  chrome.storage.sync.set({ background }, () => {
    applyBackground(background);
    console.log("Background setting saved:", background);
  });
}


function applyBackground(background) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (tab.url.includes("chatgpt.com")) { 
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (bg) => {
          if (bg.type === "color") {
            document.body.style.backgroundColor = bg.value;
            document.body.style.backgroundImage = "";
          } else if (bg.type === "image") {
            document.body.style.backgroundColor = "";
            document.body.style.backgroundImage = `url('${bg.value}')`;
            document.body.style.backgroundSize = "cover";
          }
        },
        args: [background],
      });
    } else {
      alert("This extension only works on chatgpt.com");
    }
  });
}

function loadSavedBackground() {
  chrome.storage.sync.get("background", ({ background }) => {
    if (background) {
      if (background.type === "color") {
        document.getElementById("colorPicker").value = background.value;
        document.querySelector('input[value="color"]').checked = true;
        applyBackground(background);
      } else if (background.type === "image") {
        document.getElementById("imageUrl").value = background.value;
        document.querySelector('input[value="image"]').checked = true;
        document.getElementById("colorPicker").disabled = true;
        document.getElementById("imageUrl").disabled = false;
        applyBackground(background);
      }
    }
  });
}
