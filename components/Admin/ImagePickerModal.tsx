/**
 * Image Picker Modal
 * Displays uploaded media for selection in editor
 */

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface MediaFile {
  name: string;
  filename: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
}

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export function ImagePickerModal({
  isOpen,
  onClose,
  onSelect,
}: ImagePickerModalProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Always reload files from localStorage when modal opens
      const stored = localStorage.getItem("uploadedMedia");
      if (stored) {
        try {
          const parsedFiles = JSON.parse(stored);
          setFiles(Array.isArray(parsedFiles) ? parsedFiles : []);
          setSelectedFile(null); // Reset selection
        } catch (error) {
          console.error("Error parsing media files:", error);
          setFiles([]);
        }
      } else {
        setFiles([]);
      }
    }
  }, [isOpen]);

  const handleSelect = () => {
    if (selectedFile) {
      onSelect(selectedFile.url);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="bg-opacity-50 fixed inset-0 z-40 bg-black"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">Select Image</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto p-6">
          {files.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-600">
                No images uploaded yet.{" "}
                <a
                  href="/admin/media"
                  className="text-blue-500 hover:text-blue-600"
                >
                  Go to Media Gallery
                </a>
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {files.map((file) => (
                <div
                  key={file.filename}
                  onClick={() => setSelectedFile(file)}
                  className={`relative cursor-pointer overflow-hidden rounded-lg border-2 transition ${
                    selectedFile?.filename === file.filename
                      ? "border-orange-500 ring-2 ring-orange-200"
                      : "border-gray-200 hover:border-orange-300"
                  }`}
                >
                  <div className="relative aspect-square w-full bg-gray-100">
                    <Image
                      src={file.url}
                      alt={file.name}
                      fill
                      sizes="(max-width: 640px) 40vw, (max-width: 768px) 30vw, 20vw"
                      className="object-cover"
                      onError={(e) => {
                        console.error("Failed to load image:", file.url);
                      }}
                    />
                  </div>
                  <div className="bg-white px-2 py-1 text-center">
                    <p className="truncate text-xs text-gray-600">
                      {file.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSelect}
            disabled={!selectedFile}
            className="rounded-lg bg-orange-500 px-4 py-2 font-medium text-white hover:bg-orange-600 disabled:bg-gray-300"
          >
            Insert Image
          </button>
        </div>
      </div>
    </>
  );
}
