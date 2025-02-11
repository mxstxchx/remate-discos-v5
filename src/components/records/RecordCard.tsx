import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { JetBrains_Mono } from 'next/font/google';

const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'] });

interface RecordCardProps {
  id: number;
  title: string;
  artist: string;
  label: { name: string; catno: string };
  condition: string;
  price: number;
  image: string;
  isAvailable?: boolean;
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

export function RecordCard({
  title,
  artist,
  label,
  condition,
  price,
  image,
  isAvailable = true
}: RecordCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-square">
        <Image
          src={image || '/api/placeholder/400/400'}
          alt={title}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, 50vw"
        />
        <Badge 
          className={`absolute top-2 right-2 ${getConditionColor(condition)}`}
          variant="secondary"
        >
          {condition}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold truncate">{title}</h3>
        <p className="text-sm text-gray-500 truncate">{artist}</p>
        <div className="flex items-baseline justify-between mt-2">
          <span className="text-xs text-gray-400">
            {label.name} · {label.catno}
          </span>
          <span className={`${jetBrainsMono.className} text-yellow-500`}>
            {price.toFixed(2)}€
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
