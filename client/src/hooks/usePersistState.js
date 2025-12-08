import { useEffect, useRef, useState } from "react";

/*
 * Custom hook for persisting state to localStorage
 * @param {any} defaultValue - The initial value for the state; defaults to null
 * @param {string} key - Unique key for localStorage (required)
 * @param {object} options - Optional configuration
 * @param { (serializable: value: any) => string, deserialize?: (value: string) => any, onError?: (error: any) => void, endpoint?: string, debounceMs?: number} options
 * @returns {[any, Function]} - [state, setState] tuple similar to useState
 */
const usePersistState = (defaultValue = null, key, options = {}) => {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    onError = (error) => console.warn("localStorage error:", error),
    endpoint = null,
    debounceMs = 0,
  } = options;

  const timerRef = useRef(null);

  if (!key) {
    throw new Error("usePersistState requires a key");
  }

  // Initialization of state with local first.
  const [state, setState] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? deserialize(item) : defaultValue;
    } catch (error) {
      onError(error);
      return defaultValue;
    }
  });

  const firstLoad = useRef(false);
  async function loadStateWithEndpoint() {
    if (!endpoint) return;

    try {
      const res = await fetch(`${endpoint}?key=${encodeURIComponent(key)}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) return;

      const data = await res.json();
      if (data?.value !== undefined) {
        setState((prev) => {
          const value =
            Array.isArray(prev) && Array.isArray(data.value)
              ? [
                  ...prev,
                  ...data.value.filter(
                    (b) => !prev.some((a) => b.idMeal === a.idMeal)
                  ),
                ]
              : data.value;
          return value;
        });
      }
    } catch (error) {
      onError(error);
    }

    if (!firstLoad.current) {
      firstLoad.current = true;
      loadStateWithEndpoint();
    }
  }

  useEffect(() => {
    loadStateWithEndpoint();
  }, []);

  // --- Save to localStorage always whenever state changes ---
  useEffect(() => {
    try {
      console.log("sync localstorage with state");
      // Always save to localStorage immediately
      localStorage.setItem(key, serialize(state));
    } catch (error) {
      onError(error);
    }

    // Debounce backend save
    if (endpoint) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        fetch(endpoint, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, value: state }),
        }).catch(onError);
      }, debounceMs);
    }

    // Cleanup -> clear previous timer if state changes before debounceMs
    return () => {
      clearTimeout(timerRef.current);
    };
  }, [state, key, serialize, endpoint, debounceMs, onError]);

  return [state, setState];
};

export default usePersistState;
