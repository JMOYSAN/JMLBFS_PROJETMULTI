"use strict";
const electron = require("electron");
const validSendChannels = ["notify"];
const validReceiveChannels = ["main-process-message"];
electron.contextBridge.exposeInMainWorld("electronAPI", {
  send: (channel, data) => {
    if (validSendChannels.includes(channel)) electron.ipcRenderer.send(channel, data);
  },
  invoke: (channel, data) => {
    if (validSendChannels.includes(channel))
      return electron.ipcRenderer.invoke(channel, data);
  },
  on: (channel, listener) => {
    if (validReceiveChannels.includes(channel)) {
      electron.ipcRenderer.on(channel, (_event, ...args) => listener(...args));
    }
  },
  off: (channel, listener) => {
    if (validReceiveChannels.includes(channel))
      electron.ipcRenderer.off(channel, listener);
  }
});
electron.contextBridge.exposeInMainWorld("notify", (title, body) => {
  return electron.ipcRenderer.invoke("notify", { title, body });
});
