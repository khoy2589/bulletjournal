import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// @ts-expect-error test
const saveCSV = window.electronAPI?.saveCSV;

const handleExport = async () => {
  const csv = "title,desc\nNote 1,Hello world";
  const filename = `journal_${new Date().toISOString()}.csv`;
  const path = await saveCSV(csv, filename);
  alert("Saved to: " + path);
};

createRoot(document.getElementById("root")!).render(<App />);
