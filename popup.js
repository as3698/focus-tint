// Default tint color (Warm Amber)
let selectedColor = "rgba(255, 230, 180, 0.25)";

// Handle color swatch selections
const colorButtons = document.querySelectorAll(".color-btn");

colorButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    // Highlight selected swatch
    colorButtons.forEach((b) => b.classList.remove("selected"));
    e.target.classList.add("selected");

    // Store selected color
    selectedColor = e.target.getAttribute("data-color");
  });
});

// Handle toggle button click
document.getElementById("toggleTint").addEventListener("click", async () => {
  try {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab || !tab.id) {
      alert("Error: No active tab found.");
      return;
    }

    // Pass the selectedColor argument to toggleOverlay
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: toggleOverlay,
      args: [selectedColor]
    });

  } catch (err) {
    alert("Chrome Error: " + err.message);
  }
});

// Function injected into the active webpage
function toggleOverlay(color) {
  let overlay = document.getElementById("focus-tint-overlay");

  if (overlay) {
    // If overlay already exists with the SAME color, remove it (toggle off)
    // If it has a DIFFERENT color, switch color without closing
    if (overlay.dataset.color === color) {
      overlay.remove();
    } else {
      overlay.style.backgroundColor = color;
      overlay.dataset.color = color;
    }
  } else {
    // Create new overlay
    overlay = document.createElement("div");
    overlay.id = "focus-tint-overlay";
    overlay.dataset.color = color;
    overlay.style.cssText = `position:fixed;top:0;left:0;width:100vw;height:100vh;background:${color};pointer-events:none;z-index:999999;`;
    document.body.appendChild(overlay);
  }
}