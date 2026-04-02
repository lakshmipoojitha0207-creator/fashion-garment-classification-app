"use client";

import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [designer, setDesigner] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
  if (!file) {
    alert("Please choose a file");
    return;
  }

  setLoading(true);

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("designer", designer);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const rawText = await res.text();
    console.log("API raw response:", rawText);

    let data: any;
    try {
      data = JSON.parse(rawText);
    } catch {
      throw new Error(`Server returned non-JSON response: ${rawText}`);
    }

    if (!res.ok) {
      throw new Error(data.error || "Upload failed");
    }

    alert("Uploaded successfully!");
    console.log(data);
  } catch (error) {
    console.error(error);
    alert("Upload failed. Check terminal and browser console.");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="p-10">
      <h1 className="text-xl mb-4">Upload Garment</h1>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <input
        type="text"
        placeholder="Designer name"
        value={designer}
        onChange={(e) => setDesigner(e.target.value)}
        className="border p-2 block my-4"
      />

      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}