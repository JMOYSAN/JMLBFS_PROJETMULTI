// preload.mjs
import { contextBridge, ipcRenderer } from 'electron'

const validSendChannels = ['notify']
const validReceiveChannels = ['main-process-message']

contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel: string, data: any) => {
    if (validSendChannels.includes(channel)) ipcRenderer.send(channel, data)
  },
  invoke: (channel: string, data: any) => {
    if (validSendChannels.includes(channel))
      return ipcRenderer.invoke(channel, data)
  },
  on: (channel: string, listener: (arg0: any) => void) => {
    if (validReceiveChannels.includes(channel)) {
      // @ts-ignore
      ipcRenderer.on(channel, (_event, ...args) => listener(...args))
    }
  },
  off: (
    channel: string,
    listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void
  ) => {
    if (validReceiveChannels.includes(channel))
      ipcRenderer.off(channel, listener)
  },
})

contextBridge.exposeInMainWorld('notify', (title: any, body: any) => {
  return ipcRenderer.invoke('notify', { title, body })
})
