import { Menu, app, ipcMain, Notification, BrowserWindow } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
// eslint-disable-next-line no-undef
process.env.APP_ROOT = path.join(__dirname, '..')
// eslint-disable-next-line no-undef
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL
// eslint-disable-next-line no-undef
const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
// eslint-disable-next-line no-undef
const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
const template = [
  {
    label: 'Application',
    submenu: [
      { role: 'quit' },
      { type: 'separator' },
      {
        label: 'Open DevTools',
        click: () => {
          if (win == null ? void 0 : win.webContents.isDevToolsOpened()) {
            win.webContents.closeDevTools()
          } else {
            win == null ? void 0 : win.webContents.openDevTools()
          }
        },
      },
    ],
  },
]
const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
let win = null
function createWindow() {
  win = new BrowserWindow({
    // eslint-disable-next-line no-undef
    icon: path.join(process.env.VITE_PUBLIC, 'RogueRatIcone.png'),
    webPreferences: { preload: path.join(__dirname, 'preload.mjs') },
    show: false,
  })
  win.webContents.openDevTools()
  win.webContents.on('did-finish-load', () => {
    win == null
      ? void 0
      : win.webContents.send(
          'main-process-message',
          /* @__PURE__ */ new Date().toLocaleString()
        )
  })
  win.once('ready-to-show', () => (win == null ? void 0 : win.show()))
  if (VITE_DEV_SERVER_URL) win.loadURL(VITE_DEV_SERVER_URL)
  else win.loadFile(path.join(RENDERER_DIST, 'index.html'))
}
app.whenReady().then(() => {
  app.setAppUserModelId('Rogue Rats Chat')
  // eslint-disable-next-line no-undef
  process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
    ? // eslint-disable-next-line no-undef
      path.join(process.env.APP_ROOT, 'public')
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
  // eslint-disable-next-line no-undef
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})
export { MAIN_DIST, RENDERER_DIST, VITE_DEV_SERVER_URL }
