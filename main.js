const {app, BrowserWindow, ipcMain} = require('electron/main');
const path = require('node:path');
const fs = require('fs/promises');

async function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      backgroundThrottling: false,
    },
  });

  const conf = new BrowserWindow({
    width: 600,
    height: 600,
    show: false,
    autoHideMenuBar: true,
    parent: mainWindow,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      backgroundThrottling: false,
    },
  });

  ipcMain.handle('get-json-data', async () => {
    try {
      const data = await fs.readFile('config.json', 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading JSON file:', err);
      throw err;
    }
  });

  ipcMain.on('open-conf', (event) => {
    conf.show();
  });

  ipcMain.on('save-conf-restart', (event, config) => {
    fs.writeFile('./config.json', JSON.stringify(config), function (error) {
      if (error) {
        return console.log(error);
      }
      console.log('The file was written successfully.');
    });
    conf.hide();
    mainWindow.webContents.reloadIgnoringCache();
  });

  ipcMain.on('save-conf', (event, config) => {
    fs.writeFile('./config.json', JSON.stringify(config), function (error) {
      if (error) {
        return console.log(error);
      }
      console.log('The file was written successfully.');
    });
  });

  ipcMain.on('update-counter-DA', (event, sec) => {
    mainWindow.send('update-counter', sec);
  });

  conf.on('close', (e) => {
    e.preventDefault();
    conf.hide();
  });

  mainWindow.loadFile('index.html');
  conf.loadFile('./templates/conf.html');
  mainWindow.webContents.openDevTools();
  conf.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
