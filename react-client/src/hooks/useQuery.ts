import { useCallback, useEffect, useRef, useState } from "react";
import { logError } from "~/infrastructure/telemetry/logUtils";

// Create a way to prevent the exact same query from being called multiple times
// while the previous one is still loading.
const queryCache = new Map<string, Promise<unknown>>();

type ObserverCallbackParameters = { data?: unknown; loading: boolean };
type QueryObserverCallbackFn = (props: ObserverCallbackParameters) => void;

type Listener = {
  callback: QueryObserverCallbackFn;
  id: string;
};
const observersToNotify: Map<string, Listener[]> = new Map();

type UseQueryProps<T> = {
  /**
   * The function to fetch data.
   */
  queryFn: () => Promise<T>;
  /**
   * The unique key to identify the query.
   */
  key: string;
  /**
   * Whether to skip the initial fetch on mount.
   */
  skipOnMount?: boolean;
};

/**
 * Custom hook to manage data fetching.
 * It uses caching techniques to prevent multiple calls to the same query.
 *
 * @template TData - The type of data expected from the query function.
 */
export function useQuery<TData>({
  queryFn,
  key,
  skipOnMount,
}: UseQueryProps<TData>) {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState(!skipOnMount);

  // Generate a unique id for the callback
  const listenerIdRef = useRef<string>(generateUuid());

  const fetchData = useCallback(async () => {
    const notifyObservers = (props: ObserverCallbackParameters) => {
      const observers = observersToNotify.get(key);
      if (observers) {
        observers.forEach((o) => o.callback(props));
      }
    };

    // If the query is already in the cache, do nothing
    if (queryCache.has(key)) return;

    notifyObservers({ loading: true });

    try {
      const query = queryFn();
      queryCache.set(key, query);
      const result = await query;

      notifyObservers({ data: result, loading: false });
    } catch (error) {
      logError("useQuery fetchData error", error);

      // Notify the observers that the query failed
      notifyObservers({ data: null, loading: false });
    } finally {
      // Cleanup the cache after the query is done
      queryCache.delete(key);
    }
  }, [key, queryFn]);

  useEffect(() => {
    // The callback to be called when data is fetched
    const callback: QueryObserverCallbackFn = ({ data, loading }) => {
      // Update the data state only if the data is defined
      if (typeof data !== "undefined") {
        setData(data as TData | null);
      }
      setLoading(loading);
    };

    // Create a copy of the listener id to avoid stale closures
    const listenerId = listenerIdRef.current;

    // Create the listener object
    const listener = { callback, id: listenerId };

    // If the key is set in the map yet, add it with the listener
    if (!observersToNotify.has(key)) {
      observersToNotify.set(key, [listener]);
    } else {
      // Otherwise, push the listener it to the list
      observersToNotify.get(key)?.push(listener);
    }

    return () => {
      // Remove the listener when it unmounts
      const updatedListeners = observersToNotify
        .get(key)
        ?.filter((o) => o.id !== listenerId);
      observersToNotify.set(key, updatedListeners || []);
    };
  }, [key]);

  useEffect(() => {
    // Try to fetch the data when the component mounts if skipOnMount is false
    if (!skipOnMount) {
      void fetchData();
    }
  }, [fetchData, skipOnMount]);

  const refetch = () => {
    setLoading(true);
    void fetchData();
  };

  return { data, refetch, loading };
}

function generateUuid() {
  return Math.random().toString(36).slice(-8);
}
