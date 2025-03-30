console.log("content.js is loading");

chrome.runtime.onMessage.addListener((message) => {
  console.log("Received message:", message);
  if (message.action === 'showTimer') {
    console.log("showTimer action received");

    if (!document.getElementById("quantguide-timer-panel")) {
      createTimerPanel();
      startTimer();
    } else {
      console.log("Timer already exists, not creating a new one.");
    }

  } else if (message.action === 'hideTimer') {
    console.log("hideTimer action received");
    removeTimer();
  }
});

let timerPanel;
let isDragging = false;
let offsetX = 0;  // Offset of the mouse from the panel's top-left corner
let offsetY = 0;

// Create the timer panel
function createTimerPanel() {
  console.log("Creating timer panel");

  if (document.getElementById("quantguide-timer-panel")) return;

  // Create a new timer panel
  timerPanel = document.createElement("div");
  timerPanel.id = "quantguide-timer-panel";
  timerPanel.style.position = "fixed";
  timerPanel.style.width = "150px";
  timerPanel.style.height = "80px";
  timerPanel.style.background = "rgba(0, 0, 0, 0.8)";
  timerPanel.style.borderRadius = "12px";
  timerPanel.style.boxShadow = "2px 2px 10px rgba(0,0,0,0.3)";
  timerPanel.style.padding = "10px";
  timerPanel.style.fontFamily = "Arial, sans-serif";
  timerPanel.style.zIndex = "9999";
  timerPanel.style.display = "flex";
  timerPanel.style.flexDirection = "column";
  timerPanel.style.alignItems = "center";
  timerPanel.style.justifyContent = "center";
  timerPanel.style.cursor = "move"; // Show drag cursor

  // Timer text
  const timerText = document.createElement("p");
  timerText.id = "quantguide-timer-text";
  timerText.style.fontSize = "24px";
  timerText.style.fontWeight = "bold";
  timerText.style.color = "white";
  timerText.style.margin = "0";
  timerText.textContent = "1:30";
  timerPanel.appendChild(timerText);

  document.body.appendChild(timerPanel);

  // Add event listeners for dragging functionality
  timerPanel.addEventListener('mousedown', dragStart);
  timerPanel.addEventListener('mouseup', dragEnd);
  timerPanel.addEventListener('mousemove', drag);

  // Load saved position from local storage
  chrome.storage.local.get('timerPosition', (data) => {
    const savedPosition = data.timerPosition || { top: 20, left: 20 }; // Default position if no saved data
    timerPanel.style.top = `${savedPosition.top}px`;
    timerPanel.style.left = `${savedPosition.left}px`;
  });
}

// Start the countdown timer
function startTimer() {
  let timeLeft = 90;
  const timerText = document.getElementById("quantguide-timer-text");

  const countdown = setInterval(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerText.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    if (timeLeft <= 0) {
      clearInterval(countdown);
      timerText.textContent = "Time's Up!";
    }

    timeLeft--;
  }, 1000);
}

// Function to remove the timer panel
function removeTimer() {
  const panel = document.getElementById("quantguide-timer-panel");
  if (panel) panel.remove();
}

// Dragging functionality
function dragStart(event) {
  isDragging = true;
  // Calculate the offset of the mouse relative to the timer panel's top-left corner
  const rect = timerPanel.getBoundingClientRect();
  offsetX = event.clientX - rect.left;
  offsetY = event.clientY - rect.top;
}

function dragEnd() {
  isDragging = false;
  // Save the final position of the timer when dragging ends
  const rect = timerPanel.getBoundingClientRect();
  chrome.storage.local.set({
    timerPosition: {
      top: rect.top,
      left: rect.left
    }
  });
}

function drag(event) {
  if (isDragging) {
    event.preventDefault();

    // Calculate the mouse's new position relative to the top-left corner of the timer panel
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Move the panel by adjusting its position based on the mouse's new position
    const newLeft = mouseX - offsetX;
    const newTop = mouseY - offsetY;

    // Set the new position of the timer panel
    timerPanel.style.left = `${newLeft}px`;
    timerPanel.style.top = `${newTop}px`;
  }
}

// Listener for messages
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'showTimer') {
    console.log("showTimer action received");
    setTimeout(() => {
      createTimerPanel();
      startTimer();
    }, 1000); // Delay to ensure page loads
  } else if (message.action === 'hideTimer') {
    console.log("hideTimer action received");
    removeTimer();
  }
});