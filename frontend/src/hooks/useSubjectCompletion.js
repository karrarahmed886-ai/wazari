import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useSubjectCompletion(grade) {
  const [completed, setCompleted] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!grade) {
      setCompleted(new Set());
      setLoading(false);
      return;
    }
    async function fetchCompletion() {
      try {
        const { data, error } = await supabase
          .from('subject_completion')
          .select('subject')
          .eq('grade', grade)
          .eq('completed', true);
        if (error) throw error;
        setCompleted(new Set((data || []).map((r) => r.subject)));
      } catch (err) {
        console.error('useSubjectCompletion:', err);
        setCompleted(new Set());
      } finally {
        setLoading(false);
      }
    }
    fetchCompletion();
  }, [grade]);

  return { completed, loading };
}
