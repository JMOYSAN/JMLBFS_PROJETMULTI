'use strict'
// eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
const electron = require('electron')
electron.contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args) {
    const [channel, listener] = args
    return electron.ipcRenderer.on(channel, (event, ...args2) =>
      listener(event, ...args2)
    )
  },
  off(...args) {
    const [channel, ...omit] = args
    return electron.ipcRenderer.off(channel, ...omit)
  },
  send(...args) {
    const [channel, ...omit] = args
    return electron.ipcRenderer.send(channel, ...omit)
  },
  invoke(...args) {
    const [channel, ...omit] = args
    return electron.ipcRenderer.invoke(channel, ...omit)
  },
})
electron.contextBridge.exposeInMainWorld(
  'notify',
  (title, body, options = {}) =>
    electron.ipcRenderer.invoke('notify', { title, body, ...options })
)
