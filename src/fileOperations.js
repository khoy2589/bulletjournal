const { ipcMain, shell } = require("electron");
const path = require("path");
const fs = require("fs");

// Get the exports directory path
const getExportsDir = () => {
  return path.join(__dirname, "../public/exports");
};

// Ensure exports directory exists
const ensureExportsDir = () => {
  const exportsDir = getExportsDir();
  if (!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir, { recursive: true });
  }
  return exportsDir;
};

// Setup all IPC handlers for file operations
const setupFileOperations = () => {
  // Get all CSV files from exports directory
  ipcMain.handle("get-csv-files", async () => {
    try {
      const exportsDir = ensureExportsDir();

      const files = fs
        .readdirSync(exportsDir)
        .filter((file) => file.endsWith(".csv"))
        .map((file) => {
          const filePath = path.join(exportsDir, file);
          const stats = fs.statSync(filePath);
          return {
            name: file,
            path: filePath,
            size: stats.size,
            modified: stats.mtime,
          };
        })
        .sort((a, b) => b.modified - a.modified); // Sort by most recent first

      return files;
    } catch (error) {
      console.error("Error reading files:", error);
      return [];
    }
  });

  // Save CSV file to exports directory
  ipcMain.handle("save-csv-file", async (event, fileName, csvContent) => {
    try {
      const exportsDir = ensureExportsDir();

      // Ensure filename ends with .csv
      if (!fileName.endsWith(".csv")) {
        fileName += ".csv";
      }

      const filePath = path.join(exportsDir, fileName);
      fs.writeFileSync(filePath, csvContent, "utf8");

      return { success: true, filePath };
    } catch (error) {
      console.error("Error saving file:", error);
      return { success: false, error: error.message };
    }
  });

  // Delete file from exports directory
  ipcMain.handle("delete-file", async (event, filePath) => {
    try {
      fs.unlinkSync(filePath);
      return { success: true };
    } catch (error) {
      console.error("Error deleting file:", error);
      return { success: false, error: error.message };
    }
  });

  // Open file with default application
  ipcMain.handle("open-file", async (event, filePath) => {
    try {
      await shell.openPath(filePath);
      return { success: true };
    } catch (error) {
      console.error("Error opening file:", error);
      return { success: false, error: error.message };
    }
  });
};

module.exports = { setupFileOperations };
