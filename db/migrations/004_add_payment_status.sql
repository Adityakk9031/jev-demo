-- Adds a status column to payments. High-risk change: Sentinel forces FULL CI.
ALTER TABLE payments ADD COLUMN status varchar(32) NOT NULL DEFAULT 'pending';
CREATE INDEX idx_payments_status ON payments (status);
