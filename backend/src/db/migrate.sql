-- src/db/migrate.sql
-- Minimal schema for PrePath-Backend

-- Enable UUID generation (choose one based on your Postgres setup)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- If your DB uses pgcrypto instead, comment the line above and use:
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS interview_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'started', -- started|in_progress|completed|cancelled
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Optional: if you later want messages
-- CREATE TABLE IF NOT EXISTS interview_messages (
--   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--   session_id UUID NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
--   role TEXT NOT NULL, -- user|assistant|system
--   content TEXT NOT NULL,
--   created_at TIMESTAMPTZ NOT NULL DEFAULT now()
-- );
