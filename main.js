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
    });
    conf.hide();
    mainWindow.webContents.reloadIgnoringCache();
  });

  ipcMain.on('save-conf', (event, config) => {
    fs.writeFile('./config.json', JSON.stringify(config), function (error) {
      if (error) {
        return console.log(error);
      }
    });
  });

  ipcMain.on('update-counter', (event, sec) => {
    mainWindow.send('on-update-counter', sec);
  });
  ipcMain.on('update-is-green-background', (event, arg) => {
    mainWindow.send('on-update-is-green-background', arg);
  });
  ipcMain.on('update-substrate-color', (event, arg) => {
    mainWindow.send('on-update-substrate-color', arg);
  });
  ipcMain.on('update-shadow-color', (event, arg) => {
    mainWindow.send('on-update-shadow-color', arg);
  });
  ipcMain.on('update-substrate-width', (event, arg) => {
    mainWindow.send('on-update-substrate-width', arg);
  });
  ipcMain.on('update-substrate-height', (event, arg) => {
    mainWindow.send('on-update-substrate-height', arg);
  });
  ipcMain.on('update-substrate-radius', (event, arg) => {
    mainWindow.send('on-update-substrate-radius', arg);
  });
  ipcMain.on('update-color-font', (event, arg) => {
    mainWindow.send('on-update-color-font', arg);
  });
  ipcMain.on('update-font-size', (event, arg) => {
    mainWindow.send('on-update-font-size', arg);
  });
  ipcMain.on('update-is-font-fold', (event, arg) => {
    mainWindow.send('on-update-is-font-fold', arg);
  });
  ipcMain.on('update-is-font-Italic', (event, arg) => {
    mainWindow.send('on-update-is-font-Italic', arg);
  });
  ipcMain.on('update-color-font-add-sec', (event, arg) => {
    mainWindow.send('on-update-color-font-add-sec', arg);
  });
  ipcMain.on('update-color-shadow-add-sec', (event, arg) => {
    mainWindow.send('on-update-color-shadow-add-sec', arg);
  });
  ipcMain.on('update-font-family', (event, arg) => {
    mainWindow.send('on-update-font-family', arg);
  });
  ipcMain.on('update-letter-spacing', (event, arg) => {
    mainWindow.send('on-update-letter-spacing', arg);
  });
  ipcMain.on('update-alignment', (event, arg) => {
    mainWindow.send('on-update-alignment', arg);
  });

  conf.on('close', (e) => {
    e.preventDefault();
    conf.hide();
  });

  mainWindow.loadFile('index.html');
  conf.loadFile('./templates/conf.html');
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
