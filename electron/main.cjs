const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

const { setupFileOperations } = require("./fileOperations");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false, // Add this for security
    },
  });
  win.loadURL("http://localhost:5173"); // or `loadFile("dist/index.html")` for production
};

// Your existing save-csv handler (keeping it for backward compatibility)
ipcMain.handle("save-csv", async (_, { data, filename }) => {
  const exportPath = path.join(__dirname, "../public/exports", filename);

  // Ensure directory exists
  const exportDir = path.dirname(exportPath);
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  fs.writeFileSync(exportPath, data);
  return exportPath;
});

app.whenReady().then(() => {
  setupFileOperations(); // Setup the new file operations
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
