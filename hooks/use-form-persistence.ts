import { useEffect, useRef } from 'react';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';

interface FormPersistenceOptions {
  formId: string;
  excludeFields?: string[];
  debug?: boolean;
}

export function useFormPersistence<T extends Record<string, any>>(
  options: FormPersistenceOptions,
  setValue: UseFormSetValue<T>,
  watch: UseFormWatch<T>,
  defaultValues: Partial<T>
) {
  const { formId, excludeFields = [], debug = false } = options;
  const isInitialized = useRef(false);

  // Load initial data
  const loadSavedData = (): Partial<T> | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const saved = localStorage.getItem(`form-${formId}`);
      if (!saved) return null;
      
      const parsedData = JSON.parse(saved);
      if (debug) {
        console.log(`[FormPersistence] Loading data for form ${formId}:`, parsedData);
      }
      return parsedData;
    } catch (error) {
      console.error(`[FormPersistence] Error loading data for form ${formId}:`, error);
      return null;
    }
  };

  // Initialize form with saved data only once
  useEffect(() => {
    if (!isInitialized.current) {
      const savedData = loadSavedData();
      if (savedData) {
        Object.entries(savedData).forEach(([key, value]) => {
          if (!excludeFields.includes(key)) {
            setValue(key as any, value, { shouldDirty: true });
          }
        });
      }
      isInitialized.current = true;
    }
  }, []);

  // Subscribe to form changes
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (!isInitialized.current || !name || excludeFields.includes(name)) return;

      const saveTimeout = setTimeout(() => {
        if (typeof window === 'undefined') return;

        const currentData = loadSavedData() || {};
        const newData = {
          ...currentData,
          [name]: value[name]
        };

        localStorage.setItem(`form-${formId}`, JSON.stringify(newData));
        if (debug) {
          console.log(`[FormPersistence] Saving field ${name} for form ${formId}:`, newData);
        }
      }, 500);

      return () => clearTimeout(saveTimeout);
    });

    return () => subscription.unsubscribe();
  }, [watch, formId, excludeFields, debug]);

  // Function to clear saved data
  const clearSavedData = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(`form-${formId}`);
    if (debug) {
      console.log(`[FormPersistence] Cleared data for form ${formId}`);
    }
  };

  return {
    clearSavedData,
  };
}
