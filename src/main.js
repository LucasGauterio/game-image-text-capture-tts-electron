const { app, BrowserWindow, globalShortcut, ipcMain, screen } = require('electron');
const path = require('path');
const fs = require('fs');
const screenshot = require('screenshot-desktop');
const sharp = require('sharp');
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();
const say = require('say');

// Set the GOOGLE_APPLICATION_CREDENTIALS environment variable
process.env.GOOGLE_APPLICATION_CREDENTIALS = 'credentials.json';

let mainWindow;
let captureWindow;
let startX, startY, rect;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.hide(); // Hide the window initially
  console.log('Main window created and hidden');
}

function createCaptureWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  captureWindow = new BrowserWindow({
    width: width,
    height: height,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  captureWindow.loadFile(path.join(__dirname, 'capture.html'));
  captureWindow.setIgnoreMouseEvents(false);
  captureWindow.setAlwaysOnTop(true, 'screen-saver');
  captureWindow.setFullScreen(true);
  console.log('Capture window created and shown');
}

app.whenReady().then(() => {
  createWindow();

  globalShortcut.register('Shift+PrintScreen', () => {
    console.log('Shift+PrintScreen pressed');
    createCaptureWindow();
  });

  globalShortcut.register('ControlRight+End', () => {
    console.log('Right Ctrl+End pressed, closing application');
    app.quit();
  });

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
  console.log('Application will quit, all shortcuts unregistered');
});

ipcMain.on('start-selection', (event, { x, y }) => {
  startX = x;
  startY = y;
  console.log('Selection started at:', { startX, startY });
});

ipcMain.on('update-selection', (event, { x, y }) => {
  rect = { x: startX, y: startY, width: x - startX, height: y - startY };
  console.log('Selection updated:', rect);
});

ipcMain.on('end-selection', async (event, { x, y }) => {
  rect = { x: startX, y: startY, width: x - startX, height: y - startY };
  console.log('Selection ended:', rect);

  captureWindow.close();
  // mainWindow.show();

  console.log('Capture window closed');

  const imgPath = path.join(app.getPath('temp'), 'screenshot.png');
  const croppedImagePath = path.join(app.getPath('temp'), 'cropped.png');

  try {
    const img = await screenshot({ format: 'png' });
    fs.writeFileSync(imgPath, img);
    console.log('Screenshot taken and saved at:', imgPath);

    await sharp(imgPath)
      .extract({ left: rect.x, top: rect.y, width: rect.width, height: rect.height })
      .toFile(croppedImagePath);
    console.log('Cropped image saved at:', croppedImagePath);

    // Use Google Vision API to extract text
    const [result] = await client.textDetection(croppedImagePath);
    const detections = result.textAnnotations;
    const text = detections.length > 0 ? detections[0].description : '';
    console.log('Text detected:', text);

    // Use TTS to read the text
    if (text) {
      say.speak(text);
      console.log('Text spoken:', text);
    }
  } catch (error) {
    console.error('Error capturing and processing screenshot:', error);
  }
});
