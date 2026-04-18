/**
 * Admin Media Manager
 * Route: /admin/media
 * Upload and manage media files (images)
 */

"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface MediaFile {
  name: string;
  filename: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export default function AdminMediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Get token from localStorage
    const storedToken = localStorage.getItem("adminToken");
    setToken(storedToken);

    // Load files from localStorage
    const stored = localStorage.getItem("uploadedMedia");
    if (stored) {
      setFiles(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File too large (max 5MB)");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Use JPEG, PNG, WebP, GIF, or SVG");
      return;
    }

    // Check for token
    const currentToken = token || localStorage.getItem("adminToken");
    if (!currentToken) {
      toast.error("Not authenticated. Please login again.");
      return;
    }

    setUploading(true);
    const uploadId = Math.random().toString(36);
    const startTime = Date.now();

    try {
      const formData = new FormData();
      formData.append("file", file);

      console.log(`[${uploadId}] Starting upload:`, {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

      console.log(`[${uploadId}] Sending request to /api/media/upload...`);
      const response = await fetch("/api/media/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const elapsedTime = Date.now() - startTime;
      console.log(
        `[${uploadId}] Response received after ${elapsedTime}ms, status:`,
        response.status,
      );

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error(`[${uploadId}] Failed to parse response:`, parseError);
        toast.error("Invalid server response");
        return;
      }

      console.log(`[${uploadId}] Response data:`, data);

      if (response.ok) {
        const newFile = data.data.file;
        console.log(`[${uploadId}] Upload successful:`, newFile.url);
        const updatedFiles = [newFile, ...files];
        setFiles(updatedFiles);
        localStorage.setItem("uploadedMedia", JSON.stringify(updatedFiles));
        toast.success("Image uploaded successfully!");
        setSelectedFile(newFile);
      } else {
        const errorMsg =
          data.error?.message || data.error || data.message || "Upload failed";
        console.error(`[${uploadId}] Upload failed:`, errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error(`[${uploadId}] Upload error:`, error);
      if (error instanceof Error && error.name === "AbortError") {
        toast.error("Upload timeout - file too large or connection too slow");
      } else {
        toast.error(
          error instanceof Error ? error.message : "Error uploading file",
        );
      }
    } finally {
      setUploading(false);
      e.target.value = ""; // Reset input
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard!");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
        <p className="mt-2 text-gray-600">
          Upload and manage images for your blog posts
        </p>
      </div>

      {/* Upload Area */}
      <div className="rounded-lg bg-white p-8 shadow">
        <div className="mx-auto max-w-lg">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-orange-300 bg-orange-50 p-8 transition hover:border-orange-500">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="mt-2 text-sm font-medium text-gray-900">
                Click to upload or drag and drop
              </p>
              <p className="mt-1 text-xs text-gray-600">
                PNG, JPG, GIF, WebP or SVG (max 5MB)
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
          {uploading && (
            <div className="mt-4 space-y-2 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-orange-500"></div>
              <p className="text-sm font-medium text-gray-900">
                Uploading image...
              </p>
              <p className="text-xs text-gray-600">
                Please wait, this may take a moment
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Gallery Grid */}
      <div>
        {files.length > 0 ? (
          <>
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Uploaded Images ({files.length})
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {files.map((file) => (
                <div
                  key={file.filename}
                  onClick={() => setSelectedFile(file)}
                  className={`cursor-pointer overflow-hidden rounded-lg transition ${
                    selectedFile?.filename === file.filename
                      ? "ring-2 ring-orange-500 ring-offset-2"
                      : "hover:shadow-lg"
                  }`}
                >
                  <div className="relative h-40 bg-gray-200">
                    <Image
                      src={file.url}
                      alt={file.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="bg-white p-3">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-lg bg-gray-50 p-8 text-center">
            <p className="text-gray-600">No images uploaded yet</p>
          </div>
        )}
      </div>

      {/* Selected File Details */}
      {selectedFile && (
        <div className="rounded-lg bg-white p-8 shadow">
          <h2 className="mb-6 text-xl font-bold text-gray-900">
            Image Details
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Preview */}
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">Preview</p>
              <div className="relative h-64 overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={selectedFile.url}
                  alt={selectedFile.name}
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Info */}
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700">File Name</p>
                <p className="text-gray-900">{selectedFile.name}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">File Size</p>
                <p className="text-gray-900">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">Uploaded</p>
                <p className="text-gray-900">
                  {new Date(selectedFile.uploadedAt).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">
                  Image URL
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={`${process.env.NEXT_PUBLIC_BASE_URL}${selectedFile.url}`}
                    readOnly
                    className="flex-1 rounded border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900"
                  />
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `${process.env.NEXT_PUBLIC_BASE_URL}${selectedFile.url}`,
                      )
                    }
                    className="rounded bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">
                  Markdown
                </p>
                <input
                  type="text"
                  value={`![${selectedFile.name}](${selectedFile.url})`}
                  readOnly
                  className="w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
