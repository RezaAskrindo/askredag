import useSWR from 'swr';
import { useEffect } from 'react';
import { useCMSStore } from './cms-store-provider';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useSWRCMSData = () => {
  const setItems = useCMSStore((state) => state.setItems);

  const { data, error, isLoading } = useSWR('/api/sheet-data', fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
  });

  useEffect(() => {
    if (data?.data) {
      setItems(data.data);
    }
  }, [data, setItems]);

  return {
    data: data?.data || [],
    isLoading,
    error,
  };
};
