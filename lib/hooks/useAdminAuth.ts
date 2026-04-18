/**
 * Hook to check authentication and get current user
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { JWTPayload } from "@/lib/db/models";

interface UseAuthReturn {
  user: Omit<JWTPayload, "iat" | "exp"> | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}

export function useAdminAuth(): UseAuthReturn {
  const router = useRouter();
  const [user, setUser] = useState<Omit<JWTPayload, "iat" | "exp"> | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Verify token is still valid by checking a protected endpoint
      const res = await fetch("/api/admin/blog?limit=1", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 401) {
        setUser(null);
        setLoading(false);
        router.push("/admin/login");
        return;
      }

      // If we got here, user is authenticated
      // Decode the JWT from cookie (we can't access httpOnly cookies from JS, so we trust the server)
      setUser({
        sub: "authenticated", // Server will validate
        email: "",
        role: "admin",
      });
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      router.push("/admin/login");
    }
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    logout,
  };
}
