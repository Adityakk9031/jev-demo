-- Video take: archive old refunds. Schema migration - Sentinel must run FULL CI.
ALTER TABLE refunds ADD COLUMN archived_at timestamp NULL;
CREATE INDEX idx_refunds_archived ON refunds (archived_at);
