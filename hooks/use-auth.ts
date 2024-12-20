"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface UserProfile {
  id: string;
  userType: string;
  email: string;
  status: string;
  socialProfile: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatarURL: string;
    bio: string;
    links: Record<string, string>;
  };
  interests: string[];
  roles: {
    id: string;
    name: string;
    description: string;
    systemRole: boolean;
  }[];
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await api("/users/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data) {
          setUser(response.data);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return {
    isAuthenticated,
    user,
    loading,
  };
}
