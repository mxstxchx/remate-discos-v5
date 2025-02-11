import React from 'react';
import { RecordCard } from './RecordCard';

interface Record {
  id: number;
  title: string;
  artists: { name: string }[];
  labels: { name: string; catno: string }[];
  condition: string;
  price: number;
  primary_image: string;
}

interface RecordGridProps {
  records: Record[];
}

export function RecordGrid({ records }: RecordGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {records.map((record) => (
        <RecordCard
          key={record.id}
          id={record.id}
          title={record.title}
          artist={record.artists[0]?.name || 'Unknown Artist'}
          label={record.labels[0] || { name: 'Unknown Label', catno: '-' }}
          condition={record.condition}
          price={record.price}
          image={record.primary_image}
        />
      ))}
    </div>
  );
}
