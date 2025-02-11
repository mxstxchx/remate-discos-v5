'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ViewToggle } from '@/components/records/ViewToggle';
import { RecordGrid } from '@/components/records/RecordGrid';
import { RecordList } from '@/components/records/RecordList';

interface Record {
  id: number;
  title: string;
  artists: { name: string }[];
  labels: { name: string; catno: string }[];
  condition: string;
  price: number;
  primary_image: string;
}

export default function BrowsePage() {
  const [view, setView] = useState<'grid' | 'list'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('view') as 'grid' | 'list') || 'grid';
    }
    return 'grid';
  });
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClientComponentClient();

  useEffect(() => {
    localStorage.setItem('view', view);
  }, [view]);

  useEffect(() => {
    async function fetchRecords() {
      const { data, error } = await supabase
        .from('releases')
        .select('id, title, artists, labels, condition, price, primary_image')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching records:', error);
        return;
      }

      setRecords(data);
      setLoading(false);
    }

    fetchRecords();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('releases')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'releases' },
        () => fetchRecords()
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [supabase]);

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="container p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Records</h1>
        <ViewToggle view={view} onChange={setView} />
      </div>
      
      {view === 'grid' ? (
        <RecordGrid records={records} />
      ) : (
        <RecordList records={records} />
      )}
    </div>
  );
}
