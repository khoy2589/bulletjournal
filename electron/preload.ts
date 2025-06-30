import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
    saveCSV: (data: string, filename: string) =>
        ipcRenderer.invoke("save-csv", { data, filename }),
});
