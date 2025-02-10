-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create releases table
CREATE TABLE releases (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    artists JSONB NOT NULL,
    labels JSONB NOT NULL,
    styles TEXT[] NOT NULL,
    year INTEGER,
    country TEXT,
    notes TEXT,
    condition TEXT NOT NULL CHECK (condition IN ('Mint', 'Near Mint', 'Very Good Plus', 'Very Good')),
    price DECIMAL NOT NULL,
    thumb TEXT,
    primary_image TEXT,
    secondary_image TEXT,
    videos JSONB,
    needs_audio BOOLEAN,
    tracklist JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create sessions table
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_alias TEXT NOT NULL UNIQUE,
    language TEXT DEFAULT 'es' CHECK (language IN ('es', 'en')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT alias_min_length CHECK (length(user_alias) >= 6)
);

-- Create reservations table
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    release_id INTEGER REFERENCES releases(id),
    user_alias TEXT REFERENCES sessions(user_alias),
    status TEXT CHECK (status IN ('CART', 'RESERVED', 'SOLD')),
    reserved_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (release_id, user_alias),
    CONSTRAINT valid_expiry CHECK (
        CASE 
            WHEN status = 'RESERVED' THEN expires_at IS NOT NULL 
            ELSE true 
        END
    )
);

-- Create reservation queue table
CREATE TABLE reservation_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    release_id INTEGER REFERENCES releases(id),
    user_alias TEXT REFERENCES sessions(user_alias),
    queue_position INTEGER NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (release_id, user_alias),
    UNIQUE (release_id, queue_position)
);

-- Create audit logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    release_id INTEGER REFERENCES releases(id),
    user_alias TEXT REFERENCES sessions(user_alias),
    action TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_releases_styles ON releases USING GIN (styles);
CREATE INDEX idx_releases_artists ON releases USING GIN (artists);
CREATE INDEX idx_releases_labels ON releases USING GIN (labels);