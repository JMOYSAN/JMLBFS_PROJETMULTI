import { Menu, ipcMain, Notification, app, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
let win = null;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "RogueRatIcone.png"),
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });
  win.once("ready-to-show", () => win == null ? void 0 : win.show());
  if (VITE_DEV_SERVER_URL) win.loadURL(VITE_DEV_SERVER_URL);
  else win.loadFile(path.join(RENDERER_DIST, "index.html"));
  if (VITE_DEV_SERVER_URL) win.webContents.openDevTools();
}
const template = [
  {
    label: "Application",
    submenu: [
      { role: "quit" },
      { type: "separator" },
      {
        label: "Open DevTools",
        click: () => {
          if (win == null ? void 0 : win.webContents.isDevToolsOpened())
            win.webContents.closeDevTools();
          else win == null ? void 0 : win.webContents.openDevTools();
        }
      }
    ]
  }
];
Menu.setApplicationMenu(Menu.buildFromTemplate(template));
ipcMain.handle("notify", (_event, { title, body }) => {
  const n = new Notification({ title, body });
  n.show();
});
app.whenReady().then(() => {
  app.setAppUserModelId("Rogue Rats Chat");
  process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
  createWindow();
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
