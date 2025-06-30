import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 8080;
app.use(cors());
app.use(express.json());
const EXPORTS_PATH = path.join(__dirname, "public", "exports");
app.get("/", (req, res) => {
  res.send("Server is running!");
});
app.get("/api/files", (req, res) => {
  fs.readdir(EXPORTS_PATH, (err, files) => {
    if (err) return res.status(500).json({ error: "Cannot read files." });
    res.json(files.filter((file) => file.endsWith(".csv")));
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
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
