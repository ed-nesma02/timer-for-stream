const {contextBridge, ipcRenderer} = require('electron/renderer');
const fs = require('fs');

// const main = async () => {
//   let data = await fs.promises.readFile('config.json', 'utf8').then((data) => {
//     return JSON.parse(data);
//   });

//   contextBridge.exposeInMainWorld('electronAPI', {
//     isOpenConf: (isOpen) => ipcRenderer.send('open-conf', isOpen),
//     saveConf: (conf) => ipcRenderer.send('save-conf', conf),
//     saveConfRestart: (conf) => ipcRenderer.send('save-conf-restart', conf),
//     dataJSONFile: data,
//   });
// };

// main();

contextBridge.exposeInMainWorld('electronAPI', {
  isOpenConf: (isOpen) => ipcRenderer.send('open-conf', isOpen),
  saveConf: (conf) => ipcRenderer.send('save-conf', conf),
  saveConfRestart: (conf) => ipcRenderer.send('save-conf-restart', conf),
  onJsonData: (callback) => ipcRenderer.on('json-data', (event, data) => callback(data)),
  getJsonData: () => ipcRenderer.invoke('get-json-data'),
  updateCounter: (sec) => ipcRenderer.send('update-counter-DA', sec),
  onUpdateCounter: (callback) => ipcRenderer.on('update-counter', (_event, value) => callback(value)),
});
