# Melanated In Tech — Data Model

---

**Purpose:** Complete database schema for the Melanated In Tech platform. All tables, relationships, indexes, and RLS policies. This is the source of truth for all database work.

**Owner:** Technical Lead

**Dependencies:** `technical-architecture.md`

**Status:** Active — Phase 1 schema. Extend as platform grows.

**Last Updated:** 2026-06-03

**Next Actions:** Create migration file `supabase/migrations/001_platform_expansion.sql` with all tables below

---

## Schema Overview

All tables live in PostgreSQL via Supabase. RLS (Row Level Security) is enabled on every table. Never disable RLS.

## Core Tables

### users
Synced from auth provider via webhook on user creation/update/deletion.

```sql
CREATE TABLE users (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id           TEXT UNIQUE NOT NULL,            -- Supabase auth.users.id or Clerk ID
  email             TEXT UNIQUE NOT NULL,
  email_verified    BOOLEAN DEFAULT FALSE,
  username          TEXT UNIQUE,                      -- public handle
  full_name         TEXT,
  avatar_url        TEXT,
  role              TEXT NOT NULL DEFAULT 'member',   -- 'member' | 'creator' | 'moderator' | 'admin'
  status            TEXT NOT NULL DEFAULT 'active',   -- 'active' | 'suspended' | 'banned'
  stripe_customer_id TEXT UNIQUE,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now(),
  last_seen_at      TIMESTAMPTZ
);

CREATE INDEX idx_users_auth_id ON users(auth_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_read_own" ON users FOR SELECT USING (auth_id = auth.uid()::text);
CREATE POLICY "users_update_own" ON users FOR UPDATE USING (auth_id = auth.uid()::text);
CREATE POLICY "users_admin_all" ON users FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid()::text AND role = 'admin')
);
```

### profiles
Public-facing profile information + seller/creator data.

```sql
CREATE TABLE profiles (
  id                UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  bio               TEXT,
  headline          TEXT,                              -- "AI Developer & Educator"
  location          TEXT,
  website_url       TEXT,
  twitter_handle    TEXT,
  linkedin_url      TEXT,
  github_url        TEXT,
  expertise_tags    TEXT[],                            -- ['machine-learning', 'mcp-servers']
  is_public         BOOLEAN DEFAULT TRUE,
  -- Gamification
  points            INTEGER DEFAULT 0,
  level             INTEGER DEFAULT 1,
  streak_days       INTEGER DEFAULT 0,
  last_activity_date DATE,
  -- Creator/Seller fields
  seller_bio        TEXT,
  seller_approved   BOOLEAN DEFAULT FALSE,
  stripe_account_id TEXT,                              -- Stripe Connect account
  commission_rate   NUMERIC(4,2) DEFAULT 20.00,        -- platform takes 20%
  total_sales       INTEGER DEFAULT 0,
  avg_rating        NUMERIC(3,2),
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- RLS: public profiles visible to all; private fields only to owner
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_public_read" ON profiles FOR SELECT USING (is_public = true);
CREATE POLICY "profiles_own_read" ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "profiles_own_update" ON profiles FOR UPDATE USING (id = auth.uid());
```

### membership_tiers

```sql
CREATE TABLE membership_tiers (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  TEXT NOT NULL,                 -- 'Free', 'Community', 'Builder', 'Pro', 'Enterprise'
  slug                  TEXT UNIQUE NOT NULL,           -- 'free', 'community', 'builder', 'pro', 'enterprise'
  price_monthly_cents   INTEGER,                        -- null for free
  price_annually_cents  INTEGER,
  stripe_price_monthly_id TEXT,
  stripe_price_annual_id  TEXT,
  features              JSONB NOT NULL DEFAULT '[]',    -- array of feature strings
  limits                JSONB NOT NULL DEFAULT '{}',    -- {downloads_per_month: 5}
  is_active             BOOLEAN DEFAULT TRUE,
  created_at            TIMESTAMPTZ DEFAULT now()
);

-- Seed data
INSERT INTO membership_tiers (name, slug, price_monthly_cents, price_annually_cents, features) VALUES
('Free', 'free', 0, 0, '["Public community", "3 prompt templates/month", "Newsletter"]'),
('Community', 'community', 2900, 24900, '["Full Discord", "10 prompts/month", "1 free course/quarter", "15% marketplace discount"]'),
('Builder', 'builder', 7900, 69900, '["3 courses/year", "25% discount", "Monthly blueprint", "Full prompt library", "Office hours"]'),
('Pro', 'pro', 14900, 129900, '["Unlimited courses", "35% discount", "All blueprints", "3 agent licenses/month", "Featured seller"]'),
('Enterprise', 'enterprise', NULL, NULL, '["Unlimited seats", "Custom agents", "Dedicated manager", "White-label rights"]');
```

### memberships

```sql
CREATE TABLE memberships (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier_id                 UUID NOT NULL REFERENCES membership_tiers(id),
  stripe_subscription_id  TEXT UNIQUE,
  status                  TEXT NOT NULL DEFAULT 'active',  -- 'active' | 'past_due' | 'cancelled' | 'trialing'
  current_period_start    TIMESTAMPTZ,
  current_period_end      TIMESTAMPTZ,
  cancel_at_period_end    BOOLEAN DEFAULT FALSE,
  trial_end               TIMESTAMPTZ,
  created_at              TIMESTAMPTZ DEFAULT now(),
  updated_at              TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_memberships_user_id ON memberships(user_id);
CREATE INDEX idx_memberships_status ON memberships(status);

ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "memberships_own" ON memberships FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "memberships_admin" ON memberships FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
```

### courses

```sql
CREATE TABLE courses (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id        UUID NOT NULL REFERENCES users(id),
  title             TEXT NOT NULL,
  slug              TEXT UNIQUE NOT NULL,
  description       TEXT NOT NULL,
  short_description TEXT NOT NULL,                     -- 160 chars for cards
  cover_image_url   TEXT,
  preview_video_url TEXT,
  price_cents       INTEGER NOT NULL DEFAULT 0,         -- 0 = free
  is_free           BOOLEAN GENERATED ALWAYS AS (price_cents = 0) STORED,
  min_tier_slug     TEXT REFERENCES membership_tiers(slug),
  status            TEXT NOT NULL DEFAULT 'draft',      -- 'draft' | 'published' | 'archived'
  difficulty        TEXT,                               -- 'beginner' | 'intermediate' | 'advanced'
  duration_minutes  INTEGER,
  language          TEXT DEFAULT 'en',
  has_certificate   BOOLEAN DEFAULT FALSE,
  tags              TEXT[],
  category          TEXT,
  seo_title         TEXT,
  seo_description   TEXT,
  enrollment_count  INTEGER DEFAULT 0,
  avg_rating        NUMERIC(3,2),
  review_count      INTEGER DEFAULT 0,
  published_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_courses_creator ON courses(creator_id);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_category ON courses(category);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "courses_public_read" ON courses FOR SELECT USING (status = 'published');
CREATE POLICY "courses_creator_own" ON courses FOR ALL USING (creator_id = auth.uid());
CREATE POLICY "courses_admin" ON courses FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
```

### modules

```sql
CREATE TABLE modules (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "modules_public_read" ON modules FOR SELECT USING (
  EXISTS (SELECT 1 FROM courses WHERE id = course_id AND status = 'published')
);
```

### lessons

```sql
CREATE TABLE lessons (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id       UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  order_index     INTEGER NOT NULL,
  content_type    TEXT NOT NULL,                       -- 'video' | 'article' | 'quiz' | 'exercise'
  content_url     TEXT,                                -- video URL or null for article
  content_body    TEXT,                                -- markdown for article lessons
  duration_minutes INTEGER,
  is_free_preview BOOLEAN DEFAULT FALSE,               -- true = accessible without enrollment
  created_at      TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
-- Free preview lessons are public; others require enrollment check via application logic
```

### enrollments

```sql
CREATE TABLE enrollments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id       UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  order_id        UUID REFERENCES orders(id),          -- null for free courses
  enrolled_at     TIMESTAMPTZ DEFAULT now(),
  completed_at    TIMESTAMPTZ,
  progress_pct    NUMERIC(5,2) DEFAULT 0,
  completed_lessons TEXT[] DEFAULT '{}',               -- array of lesson IDs
  last_accessed_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);

CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);

ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "enrollments_own" ON enrollments FOR ALL USING (user_id = auth.uid());
```

### products (Marketplace Items)

```sql
CREATE TYPE product_type AS ENUM (
  'ai_agent', 'mcp_server', 'prompt_pack', 'agent_skill', 'blueprint', 'bundle', 'consulting_package'
);

CREATE TYPE product_status AS ENUM ('draft', 'pending_review', 'published', 'archived', 'rejected');

CREATE TABLE products (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id         UUID NOT NULL REFERENCES users(id),
  type              product_type NOT NULL,
  status            product_status NOT NULL DEFAULT 'draft',
  title             TEXT NOT NULL,
  slug              TEXT UNIQUE NOT NULL,
  short_description TEXT NOT NULL,
  description       TEXT NOT NULL,
  thumbnail_url     TEXT,
  preview_url       TEXT,
  price_cents       INTEGER NOT NULL DEFAULT 0,
  compare_at_price_cents INTEGER,
  is_free           BOOLEAN GENERATED ALWAYS AS (price_cents = 0) STORED,
  min_tier_slug     TEXT REFERENCES membership_tiers(slug),
  delivery_type     TEXT NOT NULL DEFAULT 'file',      -- 'file' | 'url' | 'course' | 'email'
  delivery_config   JSONB,                              -- {r2_key: '...', download_filename: '...'}
  metadata          JSONB NOT NULL DEFAULT '{}',
  seo_title         TEXT,
  seo_description   TEXT,
  view_count        INTEGER DEFAULT 0,
  purchase_count    INTEGER DEFAULT 0,
  avg_rating        NUMERIC(3,2),
  review_count      INTEGER DEFAULT 0,
  tags              TEXT[],
  category          TEXT,
  -- Full text search
  search_vector     TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('english', title || ' ' || coalesce(short_description, ''))
  ) STORED,
  -- Semantic search (Phase 2)
  -- embedding        VECTOR(1536),
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now(),
  published_at      TIMESTAMPTZ
);

CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_products_type ON products(type);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_search ON products USING GIN(search_vector);
CREATE INDEX idx_products_tags ON products USING GIN(tags);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_public_read" ON products FOR SELECT USING (status = 'published');
CREATE POLICY "products_seller_own" ON products FOR ALL USING (seller_id = auth.uid());
CREATE POLICY "products_admin" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
```

### orders

```sql
CREATE TABLE orders (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id                  UUID NOT NULL REFERENCES users(id),
  stripe_payment_intent_id  TEXT UNIQUE,
  stripe_session_id         TEXT UNIQUE,
  status                    TEXT NOT NULL DEFAULT 'pending',  -- 'pending' | 'completed' | 'refunded' | 'disputed'
  total_amount_cents        INTEGER NOT NULL,
  platform_fee_cents        INTEGER NOT NULL,
  seller_amount_cents       INTEGER NOT NULL,
  currency                  TEXT NOT NULL DEFAULT 'usd',
  metadata                  JSONB DEFAULT '{}',
  created_at                TIMESTAMPTZ DEFAULT now(),
  completed_at              TIMESTAMPTZ
);

CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_status ON orders(status);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders_own_read" ON orders FOR SELECT USING (buyer_id = auth.uid());
```

### order_items

```sql
CREATE TABLE order_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id      UUID NOT NULL REFERENCES products(id),
  seller_id       UUID NOT NULL REFERENCES users(id),
  price_cents     INTEGER NOT NULL,
  delivered_at    TIMESTAMPTZ,
  download_count  INTEGER DEFAULT 0,
  max_downloads   INTEGER DEFAULT 5,
  access_expires_at TIMESTAMPTZ                          -- null = lifetime
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "order_items_own" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE id = order_id AND buyer_id = auth.uid())
);
```

### downloads (Audit Trail)

```sql
CREATE TABLE downloads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id   UUID NOT NULL REFERENCES order_items(id),
  user_id         UUID NOT NULL REFERENCES users(id),
  product_id      UUID NOT NULL REFERENCES products(id),
  ip_address      INET,
  user_agent      TEXT,
  downloaded_at   TIMESTAMPTZ DEFAULT now()
);

-- Write-only for users; admin can read all
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "downloads_insert_own" ON downloads FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "downloads_admin_read" ON downloads FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
```

### reviews

```sql
CREATE TABLE reviews (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  reviewer_id     UUID NOT NULL REFERENCES users(id),
  order_item_id   UUID REFERENCES order_items(id),
  rating          SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title           TEXT,
  body            TEXT,
  is_verified_purchase BOOLEAN GENERATED ALWAYS AS (order_item_id IS NOT NULL) STORED,
  helpful_count   INTEGER DEFAULT 0,
  status          TEXT DEFAULT 'published',
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX idx_reviews_unique ON reviews(product_id, reviewer_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_public_read" ON reviews FOR SELECT USING (status = 'published');
CREATE POLICY "reviews_own_write" ON reviews FOR INSERT WITH CHECK (reviewer_id = auth.uid());
```

### community_posts

```sql
CREATE TABLE community_posts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id     UUID NOT NULL REFERENCES users(id),
  parent_id     UUID REFERENCES community_posts(id),   -- null = top-level post
  category      TEXT NOT NULL,                          -- 'general' | 'showcase' | 'help' | 'tools' | 'career'
  title         TEXT,                                   -- null for replies
  body          TEXT NOT NULL,
  tags          TEXT[],
  upvote_count  INTEGER DEFAULT 0,
  reply_count   INTEGER DEFAULT 0,
  view_count    INTEGER DEFAULT 0,
  is_pinned     BOOLEAN DEFAULT FALSE,
  status        TEXT DEFAULT 'published',               -- 'published' | 'removed' | 'flagged'
  search_vector TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(title, '') || ' ' || body)
  ) STORED,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_posts_author ON community_posts(author_id);
CREATE INDEX idx_posts_category ON community_posts(category);
CREATE INDEX idx_posts_parent ON community_posts(parent_id);
CREATE INDEX idx_posts_search ON community_posts USING GIN(search_vector);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "posts_public_read" ON community_posts FOR SELECT USING (status = 'published');
CREATE POLICY "posts_own_write" ON community_posts FOR INSERT WITH CHECK (author_id = auth.uid());
CREATE POLICY "posts_own_update" ON community_posts FOR UPDATE USING (author_id = auth.uid());
```

### community_votes

```sql
CREATE TABLE community_votes (
  post_id     UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  vote        SMALLINT NOT NULL CHECK (vote IN (1, -1)),
  created_at  TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);

ALTER TABLE community_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "votes_own" ON community_votes FOR ALL USING (user_id = auth.uid());
```

### certifications

```sql
CREATE TABLE certifications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id       UUID NOT NULL REFERENCES courses(id),
  user_id         UUID NOT NULL REFERENCES users(id),
  credential_id   TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(12), 'hex'),
  issued_at       TIMESTAMPTZ DEFAULT now(),
  expires_at      TIMESTAMPTZ,                           -- null = no expiry
  score           NUMERIC(5,2),
  metadata        JSONB DEFAULT '{}'
);

CREATE INDEX idx_certs_user ON certifications(user_id);
CREATE INDEX idx_certs_course ON certifications(course_id);

ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "certs_own_read" ON certifications FOR SELECT USING (user_id = auth.uid());
-- Public verification endpoint uses credential_id lookup via service role (server-side only)
```

### consulting_inquiries

```sql
CREATE TABLE consulting_inquiries (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  company       TEXT,
  budget_range  TEXT,                                    -- '$5K-$15K', '$15K-$50K', '$50K+'
  description   TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'new',             -- 'new' | 'contacted' | 'proposal_sent' | 'closed_won' | 'closed_lost'
  admin_notes   TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Admin-only access
ALTER TABLE consulting_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inquiries_admin_only" ON consulting_inquiries FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
```

### processed_webhooks (Stripe Idempotency)

```sql
CREATE TABLE processed_webhooks (
  stripe_event_id   TEXT PRIMARY KEY,
  processed_at      TIMESTAMPTZ DEFAULT now()
);
-- No RLS needed — service role only
```

### analytics_events (Partitioned)

```sql
CREATE TABLE analytics_events (
  id          BIGSERIAL,
  user_id     UUID REFERENCES users(id),
  session_id  TEXT,
  event_name  TEXT NOT NULL,
  properties  JSONB DEFAULT '{}',
  page_url    TEXT,
  referrer    TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
) PARTITION BY RANGE (created_at);

-- Create initial partitions
CREATE TABLE analytics_events_2026_q1 PARTITION OF analytics_events
  FOR VALUES FROM ('2026-01-01') TO ('2026-04-01');
CREATE TABLE analytics_events_2026_q2 PARTITION OF analytics_events
  FOR VALUES FROM ('2026-04-01') TO ('2026-07-01');
-- Add future partitions via pg_cron monthly job

-- Service role write access only; query via admin dashboard
```

---

## Key Relationships

```
users → profiles (1:1)
users → memberships (1:many)
users → enrollments (1:many)
users → orders (buyer, 1:many)
users → products (seller, 1:many)
users → community_posts (1:many)
users → certifications (1:many)

membership_tiers → memberships (1:many)

courses → modules (1:many)
modules → lessons (1:many)
courses → enrollments (1:many)
courses → certifications (1:many)

products → order_items (1:many)
products → reviews (1:many)

orders → order_items (1:many)
order_items → downloads (1:many)

community_posts → community_posts (parent_id, self-referencing for replies)
community_posts → community_votes (1:many)
```

---

## Migration Execution Order

Run in this order to respect foreign key constraints:
1. `membership_tiers`
2. `users`
3. `profiles`
4. `memberships`
5. `courses`
6. `modules`
7. `lessons`
8. `enrollments`
9. `products`
10. `orders`
11. `order_items`
12. `downloads`
13. `reviews`
14. `community_posts`
15. `community_votes`
16. `certifications`
17. `consulting_inquiries`
18. `processed_webhooks`
19. `analytics_events` (partitioned)
