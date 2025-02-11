import React from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { JetBrains_Mono } from 'next/font/google';

const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'] });

interface Record {
  id: number;
  title: string;
  artists: { name: string }[];
  labels: { name: string; catno: string }[];
  condition: string;
  price: number;
  primary_image: string;
}

interface RecordListProps {
  records: Record[];
}

const getConditionColor = (condition: string) => {
  switch (condition) {
    case 'Mint':
      return 'bg-green-500/10 text-green-500';
    case 'Near Mint':
      return 'bg-blue-500/10 text-blue-500';
    case 'Very Good Plus':
      return 'bg-yellow-500/10 text-yellow-500';
    default:
      return 'bg-gray-500/10 text-gray-500';
  }
};

export function RecordList({ records }: RecordListProps) {
  return (
    <div className="space-y-4">
      {records.map((record) => (
        <div 
          key={record.id}
          className="flex gap-4 p-4 bg-background border rounded-lg"
        >
          <div className="relative w-24 h-24">
            <Image
              src={record.primary_image || '/api/placeholder/96/96'}
              alt={record.title}
              fill
              className="object-cover rounded"
              sizes="96px"
            />
          </div>
          <div className="flex-grow">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold">{record.title}</h3>
                <p className="text-sm text-gray-500">
                  {record.artists[0]?.name || 'Unknown Artist'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {record.labels[0]?.name} · {record.labels[0]?.catno}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge 
                  className={getConditionColor(record.condition)}
                  variant="secondary"
                >
                  {record.condition}
                </Badge>
                <span className={`${jetBrainsMono.className} text-yellow-500`}>
                  {record.price.toFixed(2)}€
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
