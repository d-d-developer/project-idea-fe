"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Category {
  id: string;
  name: string;
  description: string;
  systemCategory: boolean;
}

interface CategoriesResponse {
  _embedded: {
    categoryList: Category[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api<CategoriesResponse>("/categories");
        setCategories(response.data._embedded.categoryList);
        setError(null);
      } catch (err) {
        setError("Failed to fetch categories");
        console.error("Error fetching categories:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, isLoading, error };
}
