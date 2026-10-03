-- Sentinel demo 3: archive stale refunds. Touches the database schema - Sentinel must run FULL CI.
ALTER TABLE refunds ADD COLUMN archived_at timestamp NULL;
CREATE INDEX idx_refunds_archived ON refunds (archived_at);
