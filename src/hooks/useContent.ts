import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';

// Global event emitter for cache invalidation across components
const contentListeners = new Map<string, Set<() => void>>();

function subscribe(tableName: string, listener: () => void) {
    if (!contentListeners.has(tableName)) {
        contentListeners.set(tableName, new Set());
    }
    contentListeners.get(tableName)!.add(listener);
    return () => {
        contentListeners.get(tableName)?.delete(listener);
    };
}

/**
 * Call this after saving content in the CMS to instantly invalidate
 * the cache and trigger a refetch on all mounted useContent hooks
 * that depend on the given table.
 */
export function invalidateContent(tableName: string) {
    // Clear all sessionStorage cache entries for this table
    const keysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith(`lens_light_cache_${tableName}`)) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach(key => sessionStorage.removeItem(key));

    // Notify all listeners for this table to refetch
    contentListeners.get(tableName)?.forEach(listener => listener());
}

// Singleton set of active Supabase Realtime subscriptions
const activeSubscriptions = new Set<string>();

// Helper hook to fetch content from a table with a loading state
export function useContent<T = unknown>(tableName: string, orderBy?: { column: string, ascending?: boolean }) {
    const [data, setData] = useState<T>(() => {
        if (['hero_content', 'about_content', 'site_settings'].includes(tableName)) return {} as T;
        return [] as T;
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isMountedRef = useRef(true);

    const fetchData = useCallback(async (useCache = true) => {
        if (!isMountedRef.current) return;

        const cacheKey = `lens_light_cache_${tableName}_${orderBy?.column || 'id'}_${orderBy?.ascending ?? true}`;

        // Disable cache for now to ensure immediate updates
        /*
        if (useCache) {
            const cached = sessionStorage.getItem(cacheKey);
            if (cached) {
                try {
                    const { value, expiry } = JSON.parse(cached);
                    if (expiry > Date.now()) {
                        setData(value);
                        setLoading(false);
                        return;
                    } else {
                        sessionStorage.removeItem(cacheKey);
                    }
                } catch (e) {
                    sessionStorage.removeItem(cacheKey);
                }
            }
        }
        */

        try {
            setLoading(true);
            setError(null);
            let query = supabase.from(tableName).select('*');

            if (orderBy?.column) {
                query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
            } else {
                query = query.order('id', { ascending: true });
            }

            const { data: result, error: fetchError } = await query;

            if (!isMountedRef.current) return;

            if (fetchError) {
                console.error(`Error fetching ${tableName}:`, fetchError);
                setError(fetchError.message);
                if (['hero_content', 'about_content', 'site_settings'].includes(tableName)) {
                    setData({} as T);
                } else {
                    setData([] as T);
                }
            } else {
                let finalData: unknown;
                if (['hero_content', 'about_content', 'site_settings'].includes(tableName)) {
                    finalData = (result && result.length > 0) ? result[0] : {};
                } else {
                    finalData = result || [];
                }

                setData(finalData as T);
            }
        } catch (err: unknown) {
            console.error(`Catastrophic error in useContent(${tableName}):`, err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            if (isMountedRef.current) setLoading(false);
        }
    }, [tableName, orderBy?.column, orderBy?.ascending]);

    useEffect(() => {
        isMountedRef.current = true;
        fetchData();

        // Subscribe to global invalidation events
        const unsubscribe = subscribe(tableName, () => {
            fetchData(false); // bypass cache on invalidation
        });

        // Set up Supabase Realtime subscription (once per table, globally)
        if (!activeSubscriptions.has(tableName)) {
            activeSubscriptions.add(tableName);
            supabase
                .channel(`realtime_${tableName}`)
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: tableName },
                    () => {
                        // When any change comes from Supabase Realtime, invalidate
                        invalidateContent(tableName);
                    }
                )
                .subscribe();
        }

        return () => {
            isMountedRef.current = false;
            unsubscribe();
        };
    }, [tableName, fetchData]);

    const mutate = (newData: T) => {
        setData(newData);
    };

    const refetch = useCallback(() => {
        fetchData(false);
    }, [fetchData]);

    return { data, loading, error, mutate, setData, refetch };
}
