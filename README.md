# Game Image Text Capture TTS Electron

This Electron application runs in the background, captures a selected area of the screen, extracts text from the captured image using Google Cloud Vision API, and reads the text aloud using text-to-speech (TTS).

## Features

- Runs in the background and waits for a hotkey to capture the screen.
- Allows the user to select an area of the screen for capturing.
- Uses Google Cloud Vision API to extract text from the captured image.
- Uses TTS to read the extracted text aloud.
- Exits the application when `Right Ctrl + End` is pressed.

## Prerequisites

- Node.js
- Google Cloud Vision API credentials

## Installation

1. Clone the repository:

```bash
git clone https://github.com/LucasGauterio/game-image-text-capture-tts-electron
cd game-image-text-capture-tts-electron
```

2. Install the required packages:

```bash
npm install
```

3. Place your Google Cloud Vision API credentials in the project directory and name it `credentials.json`.

## Running the Application

1. Start the application:

```bash
npm start
```

## Usage

- Press `Shift + PrintScreen` to initiate the screen capture process.
- Select the area of the screen to capture.
- The application will extract text from the selected area and read it aloud using TTS.
- Press `Shift + End` to exit the application.

## Project Structure

```
game-image-text-capture-tts-electron/
├── node_modules/
├── src/
│   ├── main.js
│   ├── index.html
│   ├── capture.html
│   ├── renderer.js (if needed)
│   └── styles.css
├── credentials.json
├── package.json
└── package-lock.json
```

## Configuration

- The Google Cloud Vision API credentials file should be named `credentials.json` and placed in the project directory.

## Dependencies

- electron
- @google-cloud/vision
- screenshot-desktop
- sharp
- say

## Contributing

Feel free to submit issues or pull requests for improvements and bug fixes.

## License

This project is licensed under the MIT License.
