export interface Release {
    id: number;
    title: string;
    artists: Artist[];
    labels: Label[];
    styles: string[];
    year?: number;
    country?: string;
    notes?: string;
    condition: 'Mint' | 'Near Mint' | 'Very Good Plus' | 'Very Good';
    price: number;
    thumb?: string;
    primary_image?: string;
    secondary_image?: string;
    videos?: Video[];
    needs_audio?: boolean;
    tracklist: Track[];
    created_at?: string;
    updated_at?: string;
}

export interface Artist {
    name: string;
    id: string;
    thumbnail_url?: string;
}

export interface Label {
    name: string;
    catno: string;
    entity_type: string;
    id: string;
}

export interface Track {
    position: string;
    title: string;
    duration?: string;
}

export interface Video {
    url: string;
    title: string;
}
