-- DaoYin MVP database schema for Cloudflare D1.
-- Binding name expected by Pages Functions: DB

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  locale TEXT DEFAULT 'en',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login_at TEXT
);

CREATE TABLE IF NOT EXISTS auth_codes (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  consumed_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_auth_codes_email_created_at
ON auth_codes(email, created_at);

CREATE TABLE IF NOT EXISTS auth_sessions (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id
ON auth_sessions(user_id);

CREATE TABLE IF NOT EXISTS oracle_readings (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  reading_date TEXT NOT NULL,
  question_type TEXT NOT NULL,
  question_text TEXT,
  question_visibility TEXT NOT NULL DEFAULT 'private',
  birth_date TEXT,
  birth_time TEXT,
  birth_country TEXT,
  birth_city TEXT,
  birth_pattern_summary TEXT,
  lines_json TEXT NOT NULL,
  changed_lines_json TEXT NOT NULL,
  hexagram_id INTEGER NOT NULL,
  changed_hexagram_id INTEGER NOT NULL,
  slip_grade TEXT NOT NULL,
  slip_poem TEXT NOT NULL,
  slip_guidance TEXT NOT NULL,
  public_share_token TEXT UNIQUE,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_oracle_readings_user_date
ON oracle_readings(user_id, reading_date);

CREATE INDEX IF NOT EXISTS idx_oracle_readings_public_share_token
ON oracle_readings(public_share_token);

CREATE TABLE IF NOT EXISTS hexagrams (
  id INTEGER PRIMARY KEY,
  symbol TEXT NOT NULL,
  name_cn TEXT NOT NULL,
  full_name_cn TEXT NOT NULL,
  pinyin TEXT,
  judgment_cn TEXT NOT NULL,
  image_cn TEXT,
  modern_interpretation_en TEXT,
  modern_interpretation_zh TEXT,
  theme_tags_json TEXT NOT NULL DEFAULT '[]',
  recommendation_tags_json TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'draft',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS yao_texts (
  id TEXT PRIMARY KEY,
  hexagram_id INTEGER NOT NULL,
  line_number INTEGER NOT NULL,
  line_type TEXT,
  original_cn TEXT NOT NULL,
  interpretation_en TEXT,
  interpretation_zh TEXT,
  risk_note_en TEXT,
  risk_note_zh TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hexagram_id) REFERENCES hexagrams(id),
  UNIQUE(hexagram_id, line_number)
);

CREATE TABLE IF NOT EXISTS dao_yin_ids (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  product_sku TEXT,
  product_category TEXT,
  status TEXT NOT NULL DEFAULT 'available',
  order_id TEXT,
  order_item_id TEXT,
  assigned_at TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_dao_yin_ids_status
ON dao_yin_ids(status);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  subtotal INTEGER NOT NULL DEFAULT 0,
  service_total INTEGER NOT NULL DEFAULT 0,
  shipping_total INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_status TEXT NOT NULL DEFAULT 'not_connected',
  customer_email TEXT,
  shipping_address_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id
ON orders(user_id);

CREATE INDEX IF NOT EXISTS idx_orders_payment_status
ON orders(payment_status);

CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  product_id TEXT,
  product_snapshot_json TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  dao_yin_id TEXT,
  kai_guang_selected INTEGER NOT NULL DEFAULT 0,
  kai_guang_fee INTEGER NOT NULL DEFAULT 0,
  recording_selected INTEGER NOT NULL DEFAULT 0,
  recording_fee INTEGER NOT NULL DEFAULT 0,
  estimated_days_min INTEGER NOT NULL DEFAULT 0,
  estimated_days_max INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (dao_yin_id) REFERENCES dao_yin_ids(id)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id
ON order_items(order_id);

CREATE TABLE IF NOT EXISTS consecration_jobs (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  order_item_id TEXT NOT NULL,
  dao_yin_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  temple_location TEXT,
  scheduled_at TEXT,
  completed_at TEXT,
  operator_notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (order_item_id) REFERENCES order_items(id),
  FOREIGN KEY (dao_yin_id) REFERENCES dao_yin_ids(id)
);

CREATE INDEX IF NOT EXISTS idx_consecration_jobs_status
ON consecration_jobs(status);

CREATE TABLE IF NOT EXISTS consecration_recordings (
  id TEXT PRIMARY KEY,
  consecration_job_id TEXT NOT NULL,
  dao_yin_id TEXT,
  r2_object_key TEXT NOT NULL,
  duration_seconds INTEGER,
  review_status TEXT NOT NULL DEFAULT 'uploaded',
  customer_visible INTEGER NOT NULL DEFAULT 0,
  uploaded_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (consecration_job_id) REFERENCES consecration_jobs(id),
  FOREIGN KEY (dao_yin_id) REFERENCES dao_yin_ids(id)
);
