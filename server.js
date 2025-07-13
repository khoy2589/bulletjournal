import { WebSocketServer } from "ws";
import http from "http";
import chokidar from "chokidar";
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const EXPORTS_PATH = path.join(__dirname, "public", "exports");
const PORT = 3001;

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Ensure exports directory exists
if (!fs.existsSync(EXPORTS_PATH)) {
  fs.mkdirSync(EXPORTS_PATH, { recursive: true });
}

// REST API routes
app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.get("/api/files", (req, res) => {
  fs.readdir(EXPORTS_PATH, (err, files) => {
    if (err) return res.status(500).json({ error: "Cannot read files." });
    res.json(files.filter((file) => file.endsWith(".csv")));
  });
});

app.post("/api/save", (req, res) => {
  const { filename, content } = req.body;

  if (!filename || typeof content !== "string") {
    return res.status(400).json({ error: "Invalid input." });
  }

  const savePath = path.join(EXPORTS_PATH, filename);

  if (!savePath.startsWith(EXPORTS_PATH)) {
    return res.status(400).json({ error: "Invalid path." });
  }

  fs.writeFile(savePath, content, "utf-8", (err) => {
    if (err) return res.status(500).json({ error: "Save failed." });
    res.json({ success: true });
  });
});

app.post("/api/delete-file", (req, res) => {
  const { filename } = req.body;
  const filePath = path.join(EXPORTS_PATH, filename);

  if (!filename || !filePath.startsWith(EXPORTS_PATH)) {
    return res.status(400).json({ error: "Invalid filename." });
  }

  fs.unlink(filePath, (err) => {
    if (err) return res.status(500).json({ error: "Delete failed." });
    res.json({ success: true });
  });
});

// Create HTTP server
const server = http.createServer(app);

// WebSocket setup
const wss = new WebSocketServer({ server });

// Helper function to get file list with content
function getFileList() {
  try {
    const files = fs.readdirSync(EXPORTS_PATH);
    const csvFiles = files.filter((file) => file.endsWith(".csv"));

    const fileData = {};
    csvFiles.forEach((file) => {
      const filePath = path.join(EXPORTS_PATH, file);
      try {
        const content = fs.readFileSync(filePath, "utf-8");
        fileData[file] = content;
      } catch (err) {
        console.error(`Error reading file ${file}:`, err);
      }
    });

    return fileData;
  } catch (err) {
    console.error("Error reading directory:", err);
    return {};
  }
}

// Store active WebSocket connections
const clients = new Set();

wss.on("connection", (ws) => {
  console.log("✅ WebSocket client connected");
  clients.add(ws);

  // Send initial file list
  const initialFiles = getFileList();
  ws.send(
    JSON.stringify({
      type: "FILES_LIST",
      files: initialFiles,
    }),
  );

  // Handle incoming messages
  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log("📨 Received:", data);

      switch (data.type) {
        case "GET_FILES": {
          const files = getFileList();
          ws.send(
            JSON.stringify({
              type: "FILES_LIST",
              files: files,
            }),
          );
          break;
        }

        case "DELETE_FILE": {
          const filePath = path.join(EXPORTS_PATH, data.filename);
          if (filePath.startsWith(EXPORTS_PATH)) {
            fs.unlink(filePath, (err) => {
              if (err) {
                ws.send(
                  JSON.stringify({
                    type: "ERROR",
                    message: "Delete failed",
                  }),
                );
              }
              // File watcher will handle broadcasting the deletion
            });
          }
          break;
        }

        case "SAVE_FILE": {
          const savePath = path.join(EXPORTS_PATH, data.filename);
          if (!savePath.startsWith(EXPORTS_PATH)) {
            ws.send(
              JSON.stringify({ type: "ERROR", message: "Invalid filename." }),
            );
            return;
          }

          fs.writeFile(savePath, data.content, "utf-8", (err) => {
            if (err) {
              ws.send(
                JSON.stringify({ type: "ERROR", message: "Save failed." }),
              );
            } else {
              ws.send(
                JSON.stringify({ type: "SUCCESS", message: "File saved." }),
              );
              // Optional: broadcast new file
              broadcastToClients({
                type: "FILE_ADDED",
                filename: data.filename,
                content: data.content,
              });
            }
          });
          break;
        }

        case "UPDATE_FILE": {
          const updatePath = path.join(EXPORTS_PATH, data.filename);
          if (updatePath.startsWith(EXPORTS_PATH)) {
            fs.writeFile(updatePath, data.content, (err) => {
              if (err) {
                ws.send(
                  JSON.stringify({
                    type: "ERROR",
                    message: "Update failed",
                  }),
                );
              }
              // File watcher will handle broadcasting the update
            });
          }
          break;
        }

        default:
          ws.send(
            JSON.stringify({
              type: "echo",
              message: `You said: ${data.message || "Unknown message"}`,
            }),
          );
      }
    } catch (err) {
      console.error("Error parsing message:", err);
      ws.send(
        JSON.stringify({
          type: "ERROR",
          message: "Invalid message format",
        }),
      );
    }
  });

  ws.on("close", () => {
    console.log("❌ WebSocket client disconnected");
    clients.delete(ws);
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
    clients.delete(ws);
  });
});

// File watcher - broadcast changes to all connected clients
const watcher = chokidar.watch(EXPORTS_PATH, {
  ignoreInitial: true,
  persistent: true,
});

function broadcastToClients(message) {
  const messageStr = JSON.stringify(message);
  clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(messageStr);
    }
  });
}

watcher.on("add", (filePath) => {
  const filename = path.basename(filePath);
  if (filename.endsWith(".csv")) {
    const content = fs.readFileSync(filePath, "utf-8");
    console.log(`📁 File added: ${filename}`);
    broadcastToClients({
      type: "FILE_ADDED",
      filename: filename,
      content: content,
    });
  }
});

watcher.on("change", (filePath) => {
  const filename = path.basename(filePath);
  if (filename.endsWith(".csv")) {
    const content = fs.readFileSync(filePath, "utf-8");
    console.log(`📝 File changed: ${filename}`);
    broadcastToClients({
      type: "FILE_UPDATED",
      filename: filename,
      content: content,
    });
  }
});

watcher.on("unlink", (filePath) => {
  const filename = path.basename(filePath);
  if (filename.endsWith(".csv")) {
    console.log(`🗑️ File deleted: ${filename}`);
    broadcastToClients({
      type: "FILE_DELETED",
      filename: filename,
    });
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔌 WebSocket server running on ws://localhost:${PORT}`);
  console.log(`📁 Watching directory: ${EXPORTS_PATH}`);
});
