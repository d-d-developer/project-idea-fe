import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Thread } from "@/types/thread";

export function useThreads() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await api("/threads/me");
        setThreads(response.data._embedded.threadList);
        setError(null);
      } catch (err) {
        setError("Failed to fetch threads");
        console.error("Error fetching threads:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchThreads();
  }, []);

  const createThread = async (title: string, description?: string) => {
    try {
      const threadData = {
        title,
        description: description || null,
        type: "DISCUSSION"
      };
      const response = await api("/threads", {
        method: "POST",
        body: threadData
      });
      setThreads(prevThreads => [...prevThreads, response.data]);
      return response.data;
    } catch (err) {
      console.error("Error creating thread:", err);
      throw err;
    }
  };

  return { threads, isLoading, error, createThread };
}
