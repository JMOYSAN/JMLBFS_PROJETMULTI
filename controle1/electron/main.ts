import { app, BrowserWindow, ipcMain, Notification } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

import { Menu } from 'electron'

const template = [
  {
    label: 'Application',
    submenu: [
      { role: 'quit' },
      { type: 'separator' },
      {
        label: 'Open DevTools',
        click: () => {
          if (win?.webContents.isDevToolsOpened()) {
            win.webContents.closeDevTools()
          } else {
            win?.webContents.openDevTools()
          }
        },
      },
    ],
  },
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

let win: BrowserWindow | null = null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC!, 'RogueRatIcone.png'),
    webPreferences: { preload: path.join(__dirname, 'preload.mjs') },
    show: false,
  })
  win.setFullScreen(true)
  win.webContents.openDevTools()
  win.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyDown' && input.key === 'F11') {
      if (win) win.setFullScreen(!win.isFullScreen())
      event.preventDefault()
    }
  })
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })
  win.once('ready-to-show', () => win?.show())
  if (VITE_DEV_SERVER_URL) win.loadURL(VITE_DEV_SERVER_URL)
  else win.loadURL(pathToFileURL(path.join(RENDERER_DIST, 'index.html')).href)
}

app.whenReady().then(() => {
  app.setAppUserModelId('Rogue Rats Chat')
  process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
    ? path.join(process.env.APP_ROOT!, 'public')
    : RENDERER_DIST
  createWindow()

  ipcMain.handle('notify', (_e, { title, body }) => {
    const n = new Notification({ title, body })
    n.show()
  })
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})
