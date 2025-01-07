const videoPlayer = document.querySelector(".video-player");
const videoContainer = document.querySelector(".video-container");
const controls = document.querySelector(".controls");
const playPauseBtn = document.querySelector(".play-pause");
const volumeBtn = document.querySelector(".volume");
const volumeSlider = document.querySelector(".volume-slider");
const progressArea = document.querySelector(".progress-area");
const progressBar = document.querySelector(".progress-bar");
const progress = document.querySelector(".progress");
const timeDisplay = document.querySelector(".time-display");
const speedBtn = document.querySelector(".speed");
const fullscreenBtn = document.querySelector(".fullscreen");
const fileInput = document.querySelector(".file-input");
const notification = document.querySelector(".notification");
const videoTitle = document.querySelector(".video-title");

let hideControlsTimeout;
const speedLevels = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
let savedVolume = localStorage.getItem("videoPlayerVolume") || 1;
let savedSpeed = localStorage.getItem("videoPlayerSpeed") || 1;
let savedSpeedIndex = speedLevels.indexOf(parseFloat(savedSpeed));
let currentSpeedIndex = savedSpeedIndex !== -1 ? savedSpeedIndex : 3;
let isFullscreen = false;
let currentVideoTitle = null;

// Initialize video player with saved settings
videoPlayer.volume = savedVolume;
volumeSlider.value = savedVolume * 100;
videoPlayer.playbackRate = parseFloat(savedSpeed);
speedBtn.textContent = `${savedSpeed}x`;

videoPlayer.addEventListener("dblclick", (e) => {
  e.stopPropagation(); // Prevent event bubbling
  toggleFullscreen();
});

// Handle file selection and video click for play/pause
videoContainer.addEventListener("click", (e) => {
  if (!videoPlayer.src) {
    fileInput.click();
  } else if (e.target === videoPlayer) {
    e.stopPropagation(); // Prevent event bubbling
    if (videoPlayer.paused) {
      videoPlayer.play();
    } else {
      videoPlayer.pause();
    }
  }
});

// Load saved time and apply saved speed when loading new video
function loadSavedTime(videoTitle) {
  const savedTime = localStorage.getItem(`videoTime-${videoTitle}`);
  if (savedTime) {
    videoPlayer.currentTime = parseFloat(savedTime);
  }
  // Apply saved speed when video loads
  videoPlayer.playbackRate = parseFloat(savedSpeed);
}

// Save current time periodically
function saveCurrentTime(videoTitle) {
  if (videoTitle && videoPlayer.currentTime > 0) {
    localStorage.setItem(
      `videoTime-${videoTitle}`,
      videoPlayer.currentTime.toString()
    );
  }
}

// Show notification
let notificationTimer;

function showNotification(message) {
  notification.textContent = message;
  notification.classList.add("show");
  clearTimeout(notificationTimer);
  notificationTimer = setTimeout(() => {
    notification.classList.remove("show");
  }, 1500);
}

// Format time
function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Handle fullscreen
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    videoContainer.requestFullscreen().catch((err) => {
      console.error(`Error attempting to enable fullscreen: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
}

// Update volume icon based on volume level
function updateVolumeIcon(volume) {
  const volumeIcon = volumeBtn.querySelector("img");
  if (volume === 0 || videoPlayer.muted) {
    volumeIcon.src = "icons/volume-muted.svg";
  } else if (volume < 0.5) {
    volumeIcon.src = "icons/volume-low.svg";
  } else {
    volumeIcon.src = "icons/volume-high.svg";
  }
}

document.addEventListener("paste", (event) => {
  const clipboardData = event.clipboardData || window.clipboardData;
  const pastedText = clipboardData.getData("text");

  if (
    pastedText.startsWith("http") &&
    (pastedText.includes(".mp4") ||
      pastedText.includes(".webm") ||
      pastedText.includes(".ogg"))
  ) {
    videoPlayer.src = pastedText;
    videoTitle.textContent = pastedText;
    currentVideoTitle = pastedText;
    loadSavedTime(currentVideoTitle);
    videoPlayer.play();
    showNotification("Playing pasted video URL");
  }
});

// Event Listeners
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const videoUrl = URL.createObjectURL(file);
    videoPlayer.src = videoUrl;
    videoTitle.textContent = file.name;
    currentVideoTitle = file.name;
    loadSavedTime(currentVideoTitle);
    videoPlayer.play();
  }
});

// Add loadeddata event listener to ensure speed is applied after video loads
videoPlayer.addEventListener("loadeddata", () => {
  videoPlayer.playbackRate = parseFloat(savedSpeed);
});

// Save time periodically
setInterval(() => {
  if (currentVideoTitle) {
    saveCurrentTime(currentVideoTitle);
  }
}, 5000);

videoPlayer.addEventListener("timeupdate", () => {  
  if (videoPlayer.duration) {
    const percentage = (videoPlayer.currentTime / videoPlayer.duration) * 100;
    progress.style.width = `${percentage}%`;
    timeDisplay.textContent = `${formatTime(
      videoPlayer.currentTime
    )} / ${formatTime(videoPlayer.duration)}`;
  }
});

progressArea.addEventListener("click", (e) => {
  const bounds = progressArea.getBoundingClientRect();
  const x = e.clientX - bounds.left;
  const percentage = x / bounds.width;
  progress.style.width = `${percentage * 100}%`;
  videoPlayer.currentTime = percentage * videoPlayer.duration;
});

// Auto-hide controls in fullscreen
videoContainer.addEventListener("mousemove", () => {
  controls.style.opacity = "1";
  clearTimeout(hideControlsTimeout);
  if (document.fullscreenElement && !videoPlayer.paused) {
    hideControlsTimeout = setTimeout(() => {
      controls.style.opacity = "0";
    }, 3000);
  }
});

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    if (videoPlayer.paused) {
      videoPlayer.play();
      showNotification("Play");
    } else {
      videoPlayer.pause();
      showNotification("Pause");
    }
  } else if (e.code === "ArrowUp") {
    e.preventDefault();
    videoPlayer.volume = Math.min(1, videoPlayer.volume + 0.1);
    volumeSlider.value = videoPlayer.volume * 100;
    updateVolumeIcon(videoPlayer.volume);
    localStorage.setItem("videoPlayerVolume", videoPlayer.volume);
    showNotification(`Volume: ${Math.round(videoPlayer.volume * 100)}%`);
  } else if (e.code === "ArrowDown") {
    e.preventDefault();
    videoPlayer.volume = Math.max(0, videoPlayer.volume - 0.1);
    volumeSlider.value = videoPlayer.volume * 100;
    updateVolumeIcon(videoPlayer.volume);
    localStorage.setItem("videoPlayerVolume", videoPlayer.volume);
    showNotification(`Volume: ${Math.round(videoPlayer.volume * 100)}%`);
  } else if (e.code === "KeyM") {
    videoPlayer.muted = !videoPlayer.muted;
    updateVolumeIcon(videoPlayer.muted ? 0 : videoPlayer.volume);
    if (!videoPlayer.muted) {
      localStorage.setItem("videoPlayerVolume", videoPlayer.volume);
    }
    showNotification(videoPlayer.muted ? "Muted" : "Unmuted");
  } else if (e.code === "KeyF") {
    toggleFullscreen();
  } else if (e.code === "Period" && e.shiftKey) {
    currentSpeedIndex = Math.min(speedLevels.length - 1, currentSpeedIndex + 1);
    videoPlayer.playbackRate = speedLevels[currentSpeedIndex];
    speedBtn.textContent = `${speedLevels[currentSpeedIndex]}x`;
    localStorage.setItem("videoPlayerSpeed", speedLevels[currentSpeedIndex]);
    showNotification(`Speed: ${speedLevels[currentSpeedIndex]}x`);
  } else if (e.code === "Comma" && e.shiftKey) {
    currentSpeedIndex = Math.max(0, currentSpeedIndex - 1);
    videoPlayer.playbackRate = speedLevels[currentSpeedIndex];
    speedBtn.textContent = `${speedLevels[currentSpeedIndex]}x`;
    localStorage.setItem("videoPlayerSpeed", speedLevels[currentSpeedIndex]);
    showNotification(`Speed: ${speedLevels[currentSpeedIndex]}x`);
  } else if (e.code === "ArrowLeft") {
    videoPlayer.currentTime -= 5;
    showNotification("Rewind 5 seconds");
  } else if (e.code === "ArrowRight") {
    videoPlayer.currentTime += 5;
    showNotification("Forward 5 seconds");
  }
});

// UI Controls
playPauseBtn.addEventListener("click", () => {
  if (videoPlayer.paused) {
    videoPlayer.play();
  } else {
    videoPlayer.pause();
  }
});

volumeBtn.addEventListener("click", () => {
  videoPlayer.muted = !videoPlayer.muted;
  if (!videoPlayer.muted) {
    localStorage.setItem("videoPlayerVolume", videoPlayer.volume);
  }
  updateVolumeIcon(videoPlayer.muted ? 0 : videoPlayer.volume);
});

volumeSlider.addEventListener("input", (e) => {
  const volume = e.target.value / 100;
  videoPlayer.volume = volume;
  videoPlayer.muted = false;
  updateVolumeIcon(volume);
  localStorage.setItem("videoPlayerVolume", volume);
});

speedBtn.addEventListener("click", () => {
  currentSpeedIndex = (currentSpeedIndex + 1) % speedLevels.length;
  videoPlayer.playbackRate = speedLevels[currentSpeedIndex];
  speedBtn.textContent = `${speedLevels[currentSpeedIndex]}x`;
  localStorage.setItem("videoPlayerSpeed", speedLevels[currentSpeedIndex]);
  showNotification(`Speed: ${speedLevels[currentSpeedIndex]}x`);
});

fullscreenBtn.addEventListener("click", toggleFullscreen);

document.addEventListener("fullscreenchange", () => {
  const fullscreenIcon = fullscreenBtn.querySelector("img");
  if (document.fullscreenElement) {
    videoContainer.classList.add("fullscreen");
    fullscreenIcon.src = "icons/fullscreen-exit.svg";
    showNotification("Fullscreen");
  } else {
    videoContainer.classList.remove("fullscreen");
    fullscreenIcon.src = "icons/fullscreen.svg";
    controls.style.opacity = "1";
    showNotification("Exit Fullscreen");
  }
});

videoPlayer.addEventListener("play", () => {
  const playPauseIcon = playPauseBtn.querySelector("img");
  playPauseIcon.src = "icons/pause.svg";
});

videoPlayer.addEventListener("pause", () => {
  const playPauseIcon = playPauseBtn.querySelector("img");
  playPauseIcon.src = "icons/play.svg";
});

// Initialize volume icon
updateVolumeIcon(videoPlayer.volume);

let cursorTimeout;
videoContainer.addEventListener("mousemove", () => {
  videoContainer.style.cursor = "default";
  clearTimeout(cursorTimeout);

  if (!videoPlayer.paused) {
    cursorTimeout = setTimeout(() => {
      videoContainer.style.cursor = "none";
    }, 3000);
  }
});

// Create time preview tooltip
const timeTooltip = document.createElement("div");
timeTooltip.className = "time-tooltip";
progressArea.appendChild(timeTooltip);

// Update progressArea event listeners for preview and drag functionality
progressArea.addEventListener("mousemove", (e) => {
  const bounds = progressArea.getBoundingClientRect();
  const x = e.clientX - bounds.left;
  const percentage = x / bounds.width;
  const previewTime = percentage * videoPlayer.duration;

  timeTooltip.textContent = formatTime(previewTime);
  timeTooltip.style.left = `${x}px`;
  timeTooltip.style.display = "block";
});

progressArea.addEventListener("mouseleave", () => {
  timeTooltip.style.display = "none";
});

// Add drag functionality
let isDragging = false;

progressArea.addEventListener("mousedown", () => {
  isDragging = true;
});

document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    const bounds = progressArea.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - bounds.left, bounds.width));
    const percentage = x / bounds.width;
    progress.style.width = `${percentage * 100}%`;
    videoPlayer.currentTime = percentage * videoPlayer.duration;
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});
