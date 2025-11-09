import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import type { Tool } from '@/data/tools';

interface UseRealTimeToolsReturn {
  tools: Tool[];
  loading: boolean;
  error: string | null;
}

export function useRealTimeTools(): UseRealTimeToolsReturn {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    // Initial fetch
    const fetchTools = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('tools')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        if (mounted) {
          setTools(data || []);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch tools');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up real-time subscription
    const channel = supabase
      .channel('tools-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tools'
        },
        async (payload) => {
          // Refresh the data when any change occurs
          if (mounted) {
            await fetchTools();
          }
        }
      )
      .subscribe();

    // Initial fetch
    fetchTools();

    // Cleanup
    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return { tools, loading, error };
}
