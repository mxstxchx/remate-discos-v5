export interface Record {
  id: number;
  title: string;
  artists: { name: string }[];
  labels: { name: string; catno: string }[];
  styles: string[];
  condition: string;
  price: number;
  primary_image: string;
  needs_audio: boolean;
}

export type ViewMode = 'grid' | 'list';
