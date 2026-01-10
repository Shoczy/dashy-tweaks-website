-- DASHY TWEAKS - User & License System
-- Run this in Supabase SQL Editor

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    avatar_url TEXT,
    discord_id TEXT,
    discord_username TEXT,
    discord_avatar TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Licenses table
CREATE TABLE IF NOT EXISTS licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,              -- DASHY-XXXX-XXXX-XXXX
    plan TEXT NOT NULL DEFAULT 'free',     -- free, premium, lifetime
    expires_at TIMESTAMPTZ,                -- NULL for lifetime
    user_id UUID REFERENCES profiles(id),  -- Who redeemed it
    hwid TEXT,                             -- Hardware ID
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    redeemed_at TIMESTAMPTZ,
    created_by TEXT                        -- Admin who created
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_licenses_user ON licenses(user_id);
CREATE INDEX IF NOT EXISTS idx_licenses_key ON licenses(key);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Licenses policies  
CREATE POLICY "Users can view own licenses" ON licenses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view unclaimed licenses" ON licenses FOR SELECT USING (user_id IS NULL);

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, username, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        NEW.email
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to generate license key
CREATE OR REPLACE FUNCTION generate_license_key()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := 'DASHY-';
    i INTEGER;
    j INTEGER;
BEGIN
    FOR j IN 1..3 LOOP
        FOR i IN 1..4 LOOP
            result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
        END LOOP;
        IF j < 3 THEN
            result := result || '-';
        END IF;
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;


-- Blacklist table for banned users
CREATE TABLE IF NOT EXISTS blacklist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    discord_id TEXT UNIQUE NOT NULL,
    discord_username TEXT,
    reason TEXT DEFAULT 'No reason provided',
    blacklisted_by TEXT,                   -- Discord ID of admin
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_blacklist_discord ON blacklist(discord_id);

-- RLS for blacklist (service role only)
ALTER TABLE blacklist ENABLE ROW LEVEL SECURITY;


-- Support Tickets table
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'general',  -- general, technical, billing, hwid
    status TEXT NOT NULL DEFAULT 'open',       -- open, pending, closed
    priority TEXT DEFAULT 'normal',            -- low, normal, high
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    closed_at TIMESTAMPTZ
);

-- Ticket Messages table
CREATE TABLE IF NOT EXISTS ticket_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    message TEXT NOT NULL,
    is_staff BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tickets_user ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket ON ticket_messages(ticket_id);

-- RLS
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;

-- Users can view their own tickets
CREATE POLICY "Users can view own tickets" ON tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create tickets" ON tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own ticket messages" ON ticket_messages FOR SELECT 
    USING (ticket_id IN (SELECT id FROM tickets WHERE user_id = auth.uid()));
CREATE POLICY "Users can create ticket messages" ON ticket_messages FOR INSERT 
    WITH CHECK (ticket_id IN (SELECT id FROM tickets WHERE user_id = auth.uid()));


-- Function to get live user count (active licenses in last 24h or total active)
CREATE OR REPLACE FUNCTION get_live_user_count()
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(DISTINCT user_id)
        FROM licenses
        WHERE is_active = true
        AND user_id IS NOT NULL
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Downloads tracking table
CREATE TABLE IF NOT EXISTS downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version TEXT DEFAULT '1.0.0',
    source TEXT DEFAULT 'website',        -- website, github, discord
    ip_hash TEXT,                         -- Hashed IP for unique counting
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for counting
CREATE INDEX IF NOT EXISTS idx_downloads_created ON downloads(created_at);

-- RLS - Allow inserts from API, reads for counting
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for tracking)
CREATE POLICY "Allow anonymous download tracking" ON downloads FOR INSERT WITH CHECK (true);

-- Allow public read for count
CREATE POLICY "Allow public download count" ON downloads FOR SELECT USING (true);
