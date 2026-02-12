import { useState, useEffect, useCallback } from 'react';

/**
 * Generic hook for calling an async API function.
 *
 * Returns { data, loading, error, refetch }.
 * Automatically calls the fetcher on mount (unless `skip` is true).
 */
export function useApi<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
  options?: { skip?: boolean }
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!options?.skip);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    if (!options?.skip) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch, options?.skip]);

  return { data, loading, error, refetch };
}
