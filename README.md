# Local Video Player

A modern, feature-rich video player built with vanilla JavaScript that provides a YouTube-like experience for local video files. This player allows you to watch your locally stored videos with professional playback controls and features.

## Features

### Core Functionality
- 🎥 Play local video files
- ⏯️ Play/Pause with video click or space bar
- 🔊 Volume control with slider and mute toggle
- ⏩ Playback speed control (0.25x to 2x)
- 🖥️ Fullscreen support
- ⏲️ Progress bar with seek functionality
- 📌 Remembers last playback position for each video

### Smart Controls
- 🎮 Keyboard shortcuts for all main functions
- 🖱️ Auto-hiding controls in fullscreen mode
- 💾 Saves user preferences (volume, playback speed)
- 📱 Responsive design for all screen sizes

### Keyboard Shortcuts
- `Space` - Play/Pause
- `M` - Mute/Unmute
- `F` - Toggle Fullscreen
- `←` - Rewind 5 seconds
- `→` - Forward 5 seconds
- `↑` - Volume Up
- `↓` - Volume Down
- `Shift + >` - Increase playback speed
- `Shift + <` - Decrease playback speed

## How to Use

1. Clone this repository:
```bash
git clone https://github.com/prantiknoor/yt_player.git
```
2. Open https://prantiknoor.github.io/yt_player in your web browser

3. Click on the player area to select a video file from your computer

4. Use on-screen controls or keyboard shortcuts to control playback

## Technical Details

### Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge

### Features in Detail

#### Video Progress Saving
- Automatically saves the last watched position for each video
- Resumes playback from the saved position when reopening the video
- Saves timestamps in browser's localStorage

#### Volume Control
- Adjustable via slider or keyboard shortcuts
- Mute toggle with appropriate icon changes
- Saves volume preference across sessions

#### Playback Speed
- Multiple speed options: 0.25x, 0.5x, 0.75x, 1x, 1.25x, 1.5x, 1.75x, 2x
- Saves speed preference across sessions
- Visual indicator of current speed

#### Progress Bar
- Shows video progress
- Click to seek to any position
- Updates in real-time during playback

## Customization

### Changing Speed Options
You can modify the available playback speeds by editing the `speedLevels` array in `script.js`:

```javascript
const speedLevels = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
```

### Styling
The player's appearance can be customized by modifying the CSS variables in `style.css`.

## Contributing

Contributions are welcome! Here are some ways you can contribute:

1. Report bugs
2. Suggest new features
3. Submit pull requests

## Privacy

This player is completely local and doesn't send any data to external servers. All saved preferences and timestamps are stored in your browser's localStorage.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Claude, ChatGPT
- Inspired by YouTube's player interface