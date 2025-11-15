import { app, BrowserWindow, ipcMain, Notification, Menu } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

let win: BrowserWindow | null = null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC!, 'RogueRatIcone.png'),
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  })

  win.once('ready-to-show', () => win?.show())

  if (VITE_DEV_SERVER_URL) win.loadURL(VITE_DEV_SERVER_URL)
  else win.loadFile(path.join(RENDERER_DIST, 'index.html'))

  if (VITE_DEV_SERVER_URL) win.webContents.openDevTools()
}

const template: Electron.MenuItemConstructorOptions[] = [
  {
    label: 'Application',
    submenu: [
      { role: 'quit' },
      { type: 'separator' },
      {
        label: 'Open DevTools',
        click: () => {
          if (win?.webContents.isDevToolsOpened())
            win.webContents.closeDevTools()
          else win?.webContents.openDevTools()
        },
      },
    ],
  },
]
Menu.setApplicationMenu(Menu.buildFromTemplate(template))

ipcMain.handle('notify', (_event, { title, body }) => {
  const n = new Notification({ title, body })
  n.show()
})

app.whenReady().then(() => {
  app.setAppUserModelId('Rogue Rats Chat')
  process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
    ? path.join(process.env.APP_ROOT!, 'public')
    : RENDERER_DIST

  createWindow()
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
