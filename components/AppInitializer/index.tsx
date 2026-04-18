"use client";

import { useEffect } from "react";

export function AppInitializer() {
  useEffect(() => {
    // Call the initialization API once on app mount
    fetch("/api/init", { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          console.log("✅ App initialized successfully");
        }
      })
      .catch((error) => {
        console.error("App initialization error:", error);
      });
  }, []);

  return null;
}
