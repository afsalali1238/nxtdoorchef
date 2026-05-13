ALTER TABLE chefs ADD COLUMN IF NOT EXISTS from_city text;
ALTER TABLE chefs ADD COLUMN IF NOT EXISTS from_country text;
ALTER TABLE chefs ADD COLUMN IF NOT EXISTS cooking_philosophy text;

DROP TABLE IF EXISTS posts CASCADE;

CREATE TABLE posts (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chef_id       uuid NOT NULL REFERENCES chefs(id) ON DELETE CASCADE,
  photo_url     text NOT NULL,
  dish_name     text NOT NULL,
  cultural_note text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  expires_at    timestamptz NOT NULL DEFAULT (now() + interval '24 hours')
);

CREATE INDEX IF NOT EXISTS idx_posts_chef_id ON posts (chef_id);
CREATE INDEX IF NOT EXISTS idx_posts_expires ON posts (expires_at);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts (created_at DESC);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active posts"
  ON posts FOR SELECT USING (expires_at > now());

CREATE POLICY "Public insert posts"
  ON posts FOR INSERT WITH CHECK (true);
