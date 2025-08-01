import React, { useState, useEffect, useRef, useCallback } from "react";

interface BaseFileOperation {
  type: string;
  filename?: string;
  content?: string;
  path?: string;
}

interface SaveFileOperation extends BaseFileOperation {
  type: "SAVE_FILE";
  filename: string;
  content: string;
  path: string;
}

// For additional properties, use specific interfaces:
interface DeleteFileOperation extends BaseFileOperation {
  type: "DELETE_FILE";
  filename: string;
  path: string;
}

interface UpdateFileOperation extends BaseFileOperation {
  type: "UPDATE_FILE";
  filename: string;
  content: string;
  path: string;
}

interface GetFilesOperation extends BaseFileOperation {
  type: "GET_FILES";
  path: string;
}

interface WebSocketMessage {
  type: string;
  files?: { [key: string]: string };
  filename?: string;
  content?: string;
  message?: string;
}

// Union type for all operations
type FileOperation =
  | SaveFileOperation
  | DeleteFileOperation
  | UpdateFileOperation
  | GetFilesOperation
  | WebSocketMessage;

function parseCSVLine(line: string): { field: string; value: string } {
  const [field, value] = line.split(",");
  return {
    field: field.trim(),
    value: value?.trim() || "",
  };
}

export default function EntriesFormLayout() {
  const [files, setFiles] = useState<{ [key: string]: string }>({});
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("disconnected");
  const [error, setError] = useState<string>("");
  const wsRef = useRef<WebSocket | null>(null);
  const blobUrlsRef = useRef<string[]>([]);

  const addOrUpdateFile = useCallback((filename: string, content: string) => {
    setFiles((prev) => ({
      ...prev,
      [filename]: content,
    }));
  }, []);

  const removeFile = useCallback((filename: string) => {
    setFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles[filename];
      return newFiles;
    });
  }, []);

  const handleWebSocketMessage = useCallback(
    (event: MessageEvent) => {
      try {
        const data: FileOperation = JSON.parse(event.data);

        switch (data.type) {
          case "FILES_LIST":
            setFiles(data.files);
            break;

          case "FILE_ADDED":
          case "FILE_UPDATED":
            addOrUpdateFile(data.filename, data.content);
            break;

          case "FILE_DELETED":
            removeFile(data.filename);
            break;

          case "ERROR":
            setError(data.message);
            break;

          default:
            console.log("Unknown message type:", data.type);
        }
      } catch (err) {
        console.error("Error parsing message:", err);
        setError("Error parsing server message");
      }
    },
    [addOrUpdateFile, removeFile],
  );

  // WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      setConnectionStatus("connecting");
      setError("");

      // Replace with your WebSocket server URL
      const ws = new WebSocket("ws://localhost:3001");
      wsRef.current = ws;

      ws.onopen = () => {
        setConnectionStatus("connected");
        console.log("WebSocket connected");

        // Request initial file list
        ws.send(
          JSON.stringify({
            type: "GET_FILES",
            path: "public/exports",
          }),
        );
      };

      ws.onmessage = handleWebSocketMessage;

      const attemptReconnection = () => {
        if (wsRef.current?.readyState === WebSocket.CLOSED) {
          connectWebSocket();
        }
      };

      ws.onclose = () => {
        setConnectionStatus("disconnected");
        console.log("WebSocket disconnected");
        setTimeout(attemptReconnection, 3000);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setError("WebSocket connection error");
        setConnectionStatus("disconnected");
      };
    };

    connectWebSocket();

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [handleWebSocketMessage]);

  const [selectedFile, setSelectedFile] = useState(Object.keys(files)[0] || "");

  // Seperate file load
  useEffect(() => {
    const fileKeys = Object.keys(files);
    if (fileKeys.length > 0 && !fileKeys.includes(selectedFile)) {
      setSelectedFile(fileKeys[0]);
    }
  }, [files]);

  // Send file operation to server
  const sendFileOperation = (operation: FileOperation) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(operation));
    } else {
      setError("WebSocket not connected");
    }
  };

  const handleSave = (filename: string, content: string) => {
    sendFileOperation({
      type: "SAVE_FILE",
      filename: filename,
      content: content,
      path: "public/exports",
    });
  };

  const handleDelete = (filename: string) => {
    if (confirm(`Are you sure you want to delete ${filename}?`)) {
      sendFileOperation({
        type: "DELETE_FILE",
        filename: filename,
        path: "public/exports",
      });
    }
  };

  const downloadFile = (filename: string, content: string) => {
    // Save to server via WebSocket
    sendFileOperation({
      type: "SAVE_FILE",
      filename: filename,
      content: content,
      path: "public/exports",
    });

    // Clean up previous blob URLs
    blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    blobUrlsRef.current = [];

    // Download locally
    const blob = new Blob([content], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    blobUrlsRef.current.push(url);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const editFile = (filename: string) => {
    const content = files[filename];
    const newContent = prompt("Edit file content:", content);
    if (newContent !== null && newContent !== content) {
      sendFileOperation({
        type: "UPDATE_FILE",
        filename: filename,
        content: newContent,
        path: "public/exports",
      });
    }
  };

  const refreshFiles = () => {
    sendFileOperation({
      type: "GET_FILES",
      path: "public/exports",
    });
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-green-100 text-green-800";
      case "connecting":
        return "bg-yellow-100 text-yellow-800";
      case "disconnected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="">
      {/* Title */}
      <div className="flex items-center justify-between rounded-lg p-1 mb-1">
        {/* Notes on the left */}
        <div className="flex bg-blue-50 px-4 py-1 rounded-lg">
          <h3 className="text-md font-semibold text-blue-800 pr-2">Notes:</h3>
          <p className="text-sm pt-1 text-blue-700">
            Show all your journal files
          </p>
        </div>

        {/* Status + Refresh on the right */}
        <div className="flex items-center gap-3">
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}
          >
            {connectionStatus === "connecting" && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                Connecting...
              </div>
            )}
            {connectionStatus === "connected" && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Connected
              </div>
            )}
            {connectionStatus === "disconnected" && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                Disconnected
              </div>
            )}
          </div>

          <button
            onClick={refreshFiles}
            disabled={connectionStatus !== "connected"}
            className="px-4 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Files from public/exports */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-700">
            Files from public/exports ({Object.keys(files).length})
          </h2>
          <span className="text-sm text-gray-500">
            Watching: public/exports/*.csv
          </span>
        </div>

        {connectionStatus === "disconnected" && (
          <div className="text-center py-8 text-gray-500">
            <p>
              WebSocket disconnected. Make sure your server is running on
              ws://localhost:3001
            </p>
            <p className="text-sm mt-2">Attempting to reconnect...</p>
          </div>
        )}

        {connectionStatus === "connected" &&
          Object.keys(files).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No CSV files found in public/exports</p>
              <p className="text-sm mt-2">
                Add some files to the folder to see them here
              </p>
            </div>
          )}

        {Object.entries(files).map(([filename, content]) => (
          <div
            key={filename}
            className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg shadow-sm"
          >
            <div className="flex-1">
              <div className="font-medium text-gray-800">{filename}</div>
              <div className="text-sm text-gray-500">
                {content.split("\n").length - 1} rows, {content.length}{" "}
                characters
                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                  Live
                </span>
              </div>
            </div>

            <div className="flex gap-1">
              <button
                onClick={() => downloadFile(filename, content)}
                className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
              >
                Download
              </button>
              <button
                onClick={() => editFile(filename)}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(filename)}
                className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* File preview */}
      {Object.keys(files).length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-md font-semibold text-gray-700 mb-2">
              Preview: {selectedFile}
            </h3>
            <select
              aria-label="Select a file to preview"
              className="text-sm border rounded px-2 py-1 bg-white"
              value={selectedFile}
              onChange={(e) => setSelectedFile(e.target.value)}
            >
              {Object.keys(files).map((filename) => (
                <option key={filename} value={filename}>
                  {filename}
                </option>
              ))}
            </select>
          </div>
          <pre className="text-xs text-gray-600 bg-white p-3 rounded border overflow-x-auto">
            {files[selectedFile]?.split("\n").slice(0, 23).join("\n")}
            {files[selectedFile]?.split("\n").length > 23 && "\n..."}
          </pre>
        </div>
      )}
    </div>
  );
}
