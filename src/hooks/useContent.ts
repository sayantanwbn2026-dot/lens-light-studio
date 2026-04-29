import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// Helper hook to fetch content from a table with a loading state
export function useContent<T = any>(tableName: string, orderBy?: { column: string, ascending?: boolean }) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            let query = supabase.from(tableName).select('*');

            if (orderBy) {
                query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
            } else {
                // Most tables will have an id, sorting by id helps keep data consistent if not specified
                query = query.order('id', { ascending: true });
            }

            const { data: result, error: fetchError } = await query;

            if (!isMounted) return;

            if (fetchError) {
                console.error(`Error fetching ${tableName}:`, fetchError);
                setError(fetchError.message);
                // Determine empty fallback based on table type
                if (['hero_content', 'about_content', 'site_settings'].includes(tableName)) {
                    setData({} as any);
                } else {
                    setData([] as any);
                }
            } else {
                // If it's a single row config table (id=1), return the object, not array
                // except when we expect an array. Let the consumer handle Array vs Object based on their type T,
                // but if it's purely a single row config (hero_content, about_content, site_settings), result has length 1.
                if (['hero_content', 'about_content', 'site_settings'].includes(tableName) && result && result.length > 0) {
                    setData(result[0] as unknown as T);
                } else {
                    setData(result as unknown as T);
                }
            }
            setLoading(false);
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [tableName, orderBy?.column, orderBy?.ascending]);

    const mutate = (newData: T) => {
        setData(newData);
    };

    return { data, loading, error, mutate, setData };
}
