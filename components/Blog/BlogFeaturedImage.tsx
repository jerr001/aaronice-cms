"use client";

import { useState, useEffect } from "react";

interface BlogFeaturedImageProps {
  src?: string;
  alt: string;
  className?: string;
  onLoadingComplete?: () => void;
}

export default function BlogFeaturedImage({
  src,
  alt,
  className = "h-full w-full object-contain",
  onLoadingComplete,
}: BlogFeaturedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [displaySrc, setDisplaySrc] = useState(src);

  useEffect(() => {
    setDisplaySrc(src);
    setImageError(false);
    setIsLoading(!!src);

    // Add timeout to prevent infinite loading state (30 seconds)
    if (src) {
      console.log("[BlogFeaturedImage] Loading image:", src);
      const timeoutId = setTimeout(() => {
        console.warn("[BlogFeaturedImage] Image load timeout after 30s:", src);
        setImageError(true);
      }, 30000); // 30 second timeout - increased from 10s

      return () => clearTimeout(timeoutId);
    }
  }, [src]);

  if (!displaySrc) {
    return null;
  }

  const isExternalUrl = displaySrc?.startsWith("http");

  if (imageError) {
    return (
      <div
        className={`${className} flex flex-col items-center justify-center gap-3 bg-red-50 p-4`}
      >
        <div className="text-center">
          <svg
            className="mx-auto h-8 w-8 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <p className="mt-2 text-sm font-medium text-red-700">
            Failed to load image
          </p>
          <p className="mt-1 text-xs break-all text-red-600">{displaySrc}</p>

          {!isExternalUrl && (
            <button
              onClick={() => {
                const path = displaySrc?.startsWith("/")
                  ? displaySrc
                  : `/${displaySrc}`;
                fetch(`/api/media/check?path=${encodeURIComponent(path)}`)
                  .then((r) => r.json())
                  .then((data) => {
                    console.log("[Diagnostic] File status:", data);
                    if (data.accessible) {
                      alert(
                        `✓ File IS accessible\n\nSize: ${data.size} bytes\nPath: ${data.path}\n\nIf you see this but image still won't load, the issue may be with Next.js dev server. Try restarting it.`,
                      );
                    } else {
                      alert(
                        `✗ File NOT accessible\n\nError: ${
                          data.error
                        }\n\nFull path: ${data.fullPath || "unknown"}`,
                      );
                    }
                  })
                  .catch((err) => alert(`✗ Diagnostic error: ${err.message}`));
              }}
              className="mt-2 inline-block rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
            >
              🔧 Run Diagnostic
            </button>
          )}

          {isExternalUrl && (
            <p className="mt-2 text-xs text-red-600 italic">
              External images may require CORS headers
            </p>
          )}
          {isExternalUrl && (
            <a
              href={displaySrc}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-xs text-blue-600 underline hover:text-blue-800"
            >
              Open image in new tab →
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div
          className={`${className} flex animate-pulse items-center justify-center bg-gray-100`}
        >
          <p className="text-gray-400">Loading image...</p>
        </div>
      )}
      <img
        src={displaySrc}
        alt={alt}
        className={className}
        crossOrigin="anonymous"
        onError={() => {
          console.error("[BlogFeaturedImage] Failed to load:", displaySrc);
          setImageError(true);
        }}
        onLoad={() => {
          console.log(
            "[BlogFeaturedImage] Image loaded successfully:",
            displaySrc,
          );
          setIsLoading(false);
          onLoadingComplete?.();
        }}
        style={{ display: isLoading ? "none" : "block" }}
      />
    </>
  );
}
