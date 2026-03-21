import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const defaults = {
  single_price: 10,
  all_price: 50,
  single_original: 15,
  all_original: 150,
};

export function usePrices() {
  const [prices, setPrices] = useState(defaults);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const { data, error } = await supabase.from('prices').select('key, value');
        if (error) throw error;
        if (data?.length) {
          const map = {};
          data.forEach(({ key, value }) => { map[key] = Number(value); });
          setPrices((prev) => ({ ...defaults, ...map }));
        }
      } catch (err) {
        console.error('usePrices:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPrices();
  }, []);

  return { prices, loading };
}
