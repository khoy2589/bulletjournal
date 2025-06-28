import React, { useState, useEffect } from "react";

export function EntriesFormLayout() {
  const [files, setFiles] = useState<string[]>([]);

  const loadFiles = () => {
    const keys = Object.keys(localStorage).filter(
      (key) => key.startsWith("journal_") && key.endsWith(".csv"),
    );
    setFiles(keys);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  //   Call this function after deleting or adding a file
  const handleDelete = (key: string) => {
    localStorage.removeItem(key);
    loadFiles();
  };

  return (
    <div className="space-y-2">
      {files.map((key) => {
        const blob = new Blob([localStorage.getItem(key) ?? ""], {
          type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);

        return (
          <div className="" key={key}>
            <a
              key={key}
              href={url}
              download={key}
              className="block w-full text-left bg-white hover:bg-gray-100 px-4 py-2 rounded shadow"
            >
              {key}
            </a>
            <button
              onClick={() => handleDelete(key)}
              className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </div>
        );
      })}
    </div>
  );
}
