-- Meta Ad Metrics (daily per ad)
CREATE TABLE IF NOT EXISTS meta_ad_metrics (
  ad_id TEXT NOT NULL,
  date_ref TEXT NOT NULL,
  ad_name TEXT,
  adset_id TEXT,
  adset_name TEXT,
  campaign_id TEXT,
  campaign_name TEXT,
  spend REAL DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  cpm REAL DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  ctr REAL DEFAULT 0,
  reach INTEGER DEFAULT 0,
  frequency REAL DEFAULT 0,
  inline_link_clicks INTEGER DEFAULT 0,
  inline_link_click_ctr REAL DEFAULT 0,
  results INTEGER DEFAULT 0,
  cost_per_result REAL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (ad_id, date_ref)
);

-- Meta Account Info
CREATE TABLE IF NOT EXISTS meta_account (
  account_id TEXT PRIMARY KEY,
  name TEXT,
  currency TEXT,
  timezone_name TEXT,
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Meta Financeiro (monthly spend + tax)
CREATE TABLE IF NOT EXISTS meta_financeiro (
  month_start TEXT PRIMARY KEY,
  spend REAL DEFAULT 0,
  tax REAL DEFAULT 0,
  total REAL DEFAULT 0,
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ad_metrics_date ON meta_ad_metrics(date_ref);
CREATE INDEX IF NOT EXISTS idx_ad_metrics_campaign ON meta_ad_metrics(campaign_id, date_ref);
