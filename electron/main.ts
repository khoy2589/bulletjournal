/* eslint-disable @typescript-eslint/no-require-imports */
import * as path from "path";
import * as fs from "fs";
const { app, BrowserWindow, ipcMain } = require("electron");

interface ConsoleMessageHandler {
    event: Electron.Event;
    level: number;
    message: string;

}

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "../electron/preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    if (process.env.NODE_ENV === 'development') {
        win.webContents.on('console-message', ({ event, level, message }: ConsoleMessageHandler) => {
            if (message.includes('Electron Security Warning')) {
                event.preventDefault();
            }
        });
    }

    win.loadURL("http://localhost:8080");
};

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.handle("save-csv", async (_, { data, filename }) => {
    const exportPath = path.join(__dirname, "../public/exports", filename);

    // Ensure the exports directory exists
    const exportsDir = path.dirname(exportPath);
    if (!fs.existsSync(exportsDir)) {
        fs.mkdirSync(exportsDir, { recursive: true });
    }

    fs.writeFileSync(exportPath, data);
    return exportPath;
});