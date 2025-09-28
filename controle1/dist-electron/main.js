import { Menu as i, app as n, ipcMain as R, Notification as f, BrowserWindow as r } from "electron";
import { fileURLToPath as m, pathToFileURL as u } from "node:url";
import o from "node:path";
const a = o.dirname(m(import.meta.url));
process.env.APP_ROOT = o.join(a, "..");
const s = process.env.VITE_DEV_SERVER_URL, D = o.join(process.env.APP_ROOT, "dist-electron"), p = o.join(process.env.APP_ROOT, "dist"), T = [
  {
    label: "Application",
    submenu: [
      { role: "quit" },
      { type: "separator" },
      {
        label: "Open DevTools",
        click: () => {
          e != null && e.webContents.isDevToolsOpened() ? e.webContents.closeDevTools() : e == null || e.webContents.openDevTools();
        }
      }
    ]
  }
], w = i.buildFromTemplate(T);
i.setApplicationMenu(w);
let e = null;
function c() {
  e = new r({
    icon: o.join(process.env.VITE_PUBLIC, "RogueRatIcone.png"),
    webPreferences: { preload: o.join(a, "preload.mjs") },
    show: !1
  }), e.setFullScreen(!0), e.webContents.openDevTools(), e.webContents.on("before-input-event", (l, t) => {
    t.type === "keyDown" && t.key === "F11" && (e && e.setFullScreen(!e.isFullScreen()), l.preventDefault());
  }), e.webContents.on("did-finish-load", () => {
    e == null || e.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), e.once("ready-to-show", () => e == null ? void 0 : e.show()), s ? e.loadURL(s) : e.loadURL(u(o.join(p, "index.html")).href);
}
n.whenReady().then(() => {
  n.setAppUserModelId("Rogue Rats Chat"), process.env.VITE_PUBLIC = s ? o.join(process.env.APP_ROOT, "public") : p, c(), R.handle("notify", (l, { title: t, body: d }) => {
    new f({ title: t, body: d }).show();
  });
});
n.on("activate", () => {
  r.getAllWindows().length === 0 && c();
});
n.on("window-all-closed", () => {
  process.platform !== "darwin" && (n.quit(), e = null);
});
export {
  D as MAIN_DIST,
  p as RENDERER_DIST,
  s as VITE_DEV_SERVER_URL
};
