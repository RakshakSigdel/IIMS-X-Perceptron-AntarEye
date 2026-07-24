-- ==========================================================
-- Migration : 0008_storage.sql
-- Purpose   : Create storage buckets and policies
-- ==========================================================

-- ==========================================================
-- Storage Buckets
-- ==========================================================

INSERT INTO storage.buckets (
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
)
VALUES
(
    'fundus-images',
    'fundus-images',
    FALSE,
    10485760,
    ARRAY[
        'image/jpeg',
        'image/png'
    ]
),
(
    'heatmaps',
    'heatmaps',
    FALSE,
    10485760,
    ARRAY[
        'image/png'
    ]
),
(
    'reports',
    'reports',
    FALSE,
    20971520,
    ARRAY[
        'application/pdf'
    ]
)
ON CONFLICT (id) DO NOTHING;

-- ==========================================================
-- Storage Policies
-- ==========================================================
--
-- The application accesses storage exclusively through the
-- Next.js Backend-for-Frontend using the Supabase Service Role.
--
-- Therefore, no client-facing storage policies are required
-- for the MVP.
--
-- Policies can be added later if direct browser uploads or
-- downloads are introduced.