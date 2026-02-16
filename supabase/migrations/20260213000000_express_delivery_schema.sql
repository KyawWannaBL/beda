-- Express Delivery System Database Schema
-- Created: 2026-02-11
-- Comprehensive RBAC, Authentication, and Operational Data

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- USER MANAGEMENT & AUTHENTICATION
-- ============================================================================

-- User roles enum
CREATE TYPE user_role AS ENUM (
  'APP_OWNER',
  'SUPER_ADMIN', 
  'FINANCE_ADMIN',
  'OPERATIONS_ADMIN',
  'MARKETING_ADMIN',
  'CUSTOMER_SERVICE_ADMIN',
  'RDR',
  'DES', 
  'WH',
  'SUP',
  'SSM',
  'SSR',
  'MERCHANT',
  'CUSTOMER',
  'MARKETING',
  'CUSTOMER_SERVICE',
  'FINANCE_USER',
  'ANALYST'
);

-- Users table with comprehensive profile data
CREATE TABLE users_2026_02_11_14_10 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  role user_role NOT NULL,
  permissions TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  is_blocked BOOLEAN DEFAULT false,
  blocked_reason TEXT,
  blocked_by UUID REFERENCES users_2026_02_11_14_10(id),
  blocked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  login_attempts INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'
);

-- User sessions for tracking active sessions
CREATE TABLE user_sessions_2026_02_11_14_10 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users_2026_02_11_14_10(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- User activity logs for audit trail
CREATE TABLE user_activity_2026_02_11_14_10 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users_2026_02_11_14_10(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100),
  resource_id UUID,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- OPERATIONAL DATA (SOP-BASED LOGISTICS)
-- ============================================================================

-- Tamper tags for secure parcel tracking
CREATE TABLE tamper_tags_2026_02_11_14_10 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_code VARCHAR(50) UNIQUE NOT NULL,
  batch_id VARCHAR(100),
  status VARCHAR(50) DEFAULT 'available',
  assigned_to UUID REFERENCES users_2026_02_11_14_10(id),
  assigned_at TIMESTAMP WITH TIME ZONE,
  activated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Shipments - core operational entity
CREATE TABLE shipments_2026_02_11_14_10 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  awb_number VARCHAR(100) UNIQUE NOT NULL,
  merchant_id UUID REFERENCES users_2026_02_11_14_10(id),
  customer_id UUID REFERENCES users_2026_02_11_14_10(id),
  tamper_tag_id UUID REFERENCES tamper_tags_2026_02_11_14_10(id),
  pickup_address JSONB NOT NULL,
  delivery_address JSONB NOT NULL,
  package_details JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'registered',
  priority VARCHAR(20) DEFAULT 'standard',
  cod_amount DECIMAL(10,2) DEFAULT 0,
  shipping_cost DECIMAL(10,2) NOT NULL,
  created_by UUID NOT NULL REFERENCES users_2026_02_11_14_10(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Shipment status history
CREATE TABLE shipment_status_history_2026_02_11_14_10 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES shipments_2026_02_11_14_10(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  location VARCHAR(255),
  notes TEXT,
  updated_by UUID NOT NULL REFERENCES users_2026_02_11_14_10(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Pickup records
CREATE TABLE pickup_records_2026_02_11_14_10 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES shipments_2026_02_11_14_10(id),
  rider_id UUID NOT NULL REFERENCES users_2026_02_11_14_10(id),
  pickup_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  pickup_photos TEXT[],
  customer_signature TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Delivery records
CREATE TABLE delivery_records_2026_02_11_14_10 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES shipments_2026_02_11_14_10(id),
  rider_id UUID NOT NULL REFERENCES users_2026_02_11_14_10(id),
  delivery_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivery_photos TEXT[],
  customer_signature TEXT,
  recipient_name VARCHAR(255),
  delivery_status VARCHAR(50) DEFAULT 'delivered',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- FINANCIAL DATA & MERCHANT MANAGEMENT
-- ============================================================================

-- Financial transactions
CREATE TABLE financial_transactions_2026_02_11_14_10 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_type VARCHAR(50) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  merchant_id UUID REFERENCES users_2026_02_11_14_10(id),
  customer_id UUID REFERENCES users_2026_02_11_14_10(id),
  shipment_id UUID REFERENCES shipments_2026_02_11_14_10(id),
  payment_method VARCHAR(50),
  payment_status VARCHAR(50) DEFAULT 'pending',
  reference_number VARCHAR(100),
  processed_by UUID REFERENCES users_2026_02_11_14_10(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'
);

-- Commission calculations
CREATE TABLE commissions_2026_02_11_14_10 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users_2026_02_11_14_10(id),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  base_commission DECIMAL(10,2) DEFAULT 0,
  performance_bonus DECIMAL(10,2) DEFAULT 0,
  total_commission DECIMAL(10,2) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending',
  calculated_by UUID NOT NULL REFERENCES users_2026_02_11_14_10(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- MARKETING & CUSTOMER ENGAGEMENT
-- ============================================================================

-- Marketing campaigns
CREATE TABLE marketing_campaigns_2026_02_11_14_10 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  campaign_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  budget DECIMAL(10,2),
  target_audience JSONB DEFAULT '{}',
  created_by UUID NOT NULL REFERENCES users_2026_02_11_14_10(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer segments
CREATE TABLE customer_segments_2026_02_11_14_10 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  criteria JSONB NOT NULL,
  customer_count INTEGER DEFAULT 0,
  created_by UUID NOT NULL REFERENCES users_2026_02_11_14_10(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- CUSTOMER SERVICE & SUPPORT
-- ============================================================================

-- Support tickets
CREATE TABLE support_tickets_2026_02_11_14_10 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES users_2026_02_11_14_10(id),
  assigned_to UUID REFERENCES users_2026_02_11_14_10(id),
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(20) DEFAULT 'medium',
  status VARCHAR(50) DEFAULT 'open',
  category VARCHAR(100),
  shipment_id UUID REFERENCES shipments_2026_02_11_14_10(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Support ticket messages
CREATE TABLE support_ticket_messages_2026_02_11_14_10 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES support_tickets_2026_02_11_14_10(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users_2026_02_11_14_10(id),
  message TEXT NOT NULL,
  attachments TEXT[],
  is_internal BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ANALYTICS & REPORTING
-- ============================================================================

-- KPI data storage
CREATE TABLE kpi_data_2026_02_11_14_10 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name VARCHAR(100) NOT NULL,
  metric_value DECIMAL(15,4) NOT NULL,
  metric_unit VARCHAR(50),
  period_type VARCHAR(20) NOT NULL, -- daily, weekly, monthly
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  category VARCHAR(100),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated reports
CREATE TABLE reports_2026_02_11_14_10 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  report_type VARCHAR(100) NOT NULL,
  parameters JSONB DEFAULT '{}',
  data JSONB,
  file_path TEXT,
  status VARCHAR(50) DEFAULT 'generating',
  created_by UUID NOT NULL REFERENCES users_2026_02_11_14_10(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- SYSTEM CONFIGURATION & SECURITY
-- ============================================================================

-- System settings
CREATE TABLE system_settings_2026_02_11_14_10 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  updated_by UUID NOT NULL REFERENCES users_2026_02_11_14_10(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security events
CREATE TABLE security_events_2026_02_11_14_10 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(100) NOT NULL,
  severity VARCHAR(20) DEFAULT 'medium',
  user_id UUID REFERENCES users_2026_02_11_14_10(id),
  ip_address INET,
  user_agent TEXT,
  details JSONB DEFAULT '{}',
  resolved BOOLEAN DEFAULT false,
  resolved_by UUID REFERENCES users_2026_02_11_14_10(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- User indexes
CREATE INDEX idx_users_email ON users_2026_02_11_14_10(email);
CREATE INDEX idx_users_username ON users_2026_02_11_14_10(username);
CREATE INDEX idx_users_role ON users_2026_02_11_14_10(role);
CREATE INDEX idx_users_active ON users_2026_02_11_14_10(is_active);

-- Shipment indexes
CREATE INDEX idx_shipments_awb ON shipments_2026_02_11_14_10(awb_number);
CREATE INDEX idx_shipments_merchant ON shipments_2026_02_11_14_10(merchant_id);
CREATE INDEX idx_shipments_customer ON shipments_2026_02_11_14_10(customer_id);
CREATE INDEX idx_shipments_status ON shipments_2026_02_11_14_10(status);
CREATE INDEX idx_shipments_created ON shipments_2026_02_11_14_10(created_at);

-- Activity logs indexes
CREATE INDEX idx_activity_user ON user_activity_2026_02_11_14_10(user_id);
CREATE INDEX idx_activity_action ON user_activity_2026_02_11_14_10(action);
CREATE INDEX idx_activity_created ON user_activity_2026_02_11_14_10(created_at);

-- Financial indexes
CREATE INDEX idx_transactions_merchant ON financial_transactions_2026_02_11_14_10(merchant_id);
CREATE INDEX idx_transactions_type ON financial_transactions_2026_02_11_14_10(transaction_type);
CREATE INDEX idx_transactions_status ON financial_transactions_2026_02_11_14_10(payment_status);

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ============================================================================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users_2026_02_11_14_10 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shipments_updated_at BEFORE UPDATE ON shipments_2026_02_11_14_10 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON support_tickets_2026_02_11_14_10 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON marketing_campaigns_2026_02_11_14_10 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON system_settings_2026_02_11_14_10 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INSERT DEMO DATA
-- ============================================================================

-- Insert demo users with hashed passwords
INSERT INTO users_2026_02_11_14_10 (email, username, password_hash, name, role, permissions) VALUES
-- App Owner
('appowner@tampersafe.com', 'appowner', extensions.crypt('owner@2026!', extensions.gen_salt('bf')), 'System Owner', 'APP_OWNER', 
 ARRAY['app:delete', 'users:manage', 'roles:assign', 'system:configure', 'data:export', 'audit:view', 'security:manage', 'billing:manage']),

-- Super Admin
('superadmin@tampersafe.com', 'superadmin', extensions.crypt('admin@2026!', extensions.gen_salt('bf')), 'Super Administrator', 'SUPER_ADMIN',
 ARRAY['users:manage', 'roles:assign', 'system:configure', 'audit:view', 'reports:generate', 'security:monitor', 'data:export']),

-- Finance Admin
('financeadmin@tampersafe.com', 'financeadmin', extensions.crypt('finance@2026', extensions.gen_salt('bf')), 'Finance Administrator', 'FINANCE_ADMIN',
 ARRAY['finance:manage', 'merchants:manage', 'payments:process', 'commissions:calculate', 'reports:financial', 'settlements:manage']),

-- Operations Admin
('opsadmin@tampersafe.com', 'opsadmin', extensions.crypt('ops@2026', extensions.gen_salt('bf')), 'Operations Administrator', 'OPERATIONS_ADMIN',
 ARRAY['operations:manage', 'shipments:track', 'warehouse:manage', 'riders:assign', 'routes:optimize', 'inventory:manage']),

-- Marketing Admin
('marketingadmin@tampersafe.com', 'marketingadmin', extensions.crypt('marketing@2026', extensions.gen_salt('bf')), 'Marketing Administrator', 'MARKETING_ADMIN',
 ARRAY['campaigns:manage', 'customers:segment', 'analytics:marketing', 'promotions:create', 'content:manage', 'social:manage']),

-- Customer Service Admin
('serviceadmin@tampersafe.com', 'serviceadmin', extensions.crypt('service@2026', extensions.gen_salt('bf')), 'Service Administrator', 'CUSTOMER_SERVICE_ADMIN',
 ARRAY['support:manage', 'tickets:resolve', 'chat:moderate', 'customers:assist', 'escalations:handle', 'kb:manage']),

-- Operational Staff
('rider001@tampersafe.com', 'rider001', extensions.crypt('rider@2026', extensions.gen_salt('bf')), 'John Rider', 'RDR',
 ARRAY['pickups:create', 'deliveries:complete', 'photos:capture', 'signatures:collect']),

('dataentry001@tampersafe.com', 'dataentry001', extensions.crypt('data@2026', extensions.gen_salt('bf')), 'Sarah Data', 'DES',
 ARRAY['shipments:register', 'data:entry', 'labels:print']),

('warehouse001@tampersafe.com', 'warehouse001', extensions.crypt('warehouse@2026', extensions.gen_salt('bf')), 'Mike Warehouse', 'WH',
 ARRAY['warehouse:receive', 'warehouse:dispatch', 'inventory:update']),

('supervisor001@tampersafe.com', 'supervisor001', extensions.crypt('super@2026', extensions.gen_salt('bf')), 'Lisa Supervisor', 'SUP',
 ARRAY['operations:supervise', 'approvals:process', 'audits:conduct']),

('substation001@tampersafe.com', 'substation001', extensions.crypt('station@2026', extensions.gen_salt('bf')), 'Tom Station', 'SSM',
 ARRAY['substation:manage', 'manifests:receive', 'riders:coordinate']),

('lastmile001@tampersafe.com', 'lastmile001', extensions.crypt('lastmile@2026', extensions.gen_salt('bf')), 'Alex Delivery', 'SSR',
 ARRAY['deliveries:execute', 'customers:contact', 'pods:capture']),

-- Business Users
('merchant001@tampersafe.com', 'merchant001', extensions.crypt('merchant@2026', extensions.gen_salt('bf')), 'Business Merchant', 'MERCHANT',
 ARRAY['shipments:create', 'analytics:view', 'billing:view', 'api:access']),

('customer001@tampersafe.com', 'customer001', extensions.crypt('customer@2026', extensions.gen_salt('bf')), 'John Customer', 'CUSTOMER',
 ARRAY['shipments:track', 'support:contact', 'profile:manage']),

('marketing001@tampersafe.com', 'marketing001', extensions.crypt('growth@2026', extensions.gen_salt('bf')), 'Marketing Manager', 'MARKETING',
 ARRAY['campaigns:execute', 'analytics:view', 'content:create']),

('support001@tampersafe.com', 'support001', extensions.crypt('support@2026', extensions.gen_salt('bf')), 'Support Agent', 'CUSTOMER_SERVICE',
 ARRAY['tickets:handle', 'chat:respond', 'customers:assist']),

('finance001@tampersafe.com', 'finance001', extensions.crypt('finuser@2026', extensions.gen_salt('bf')), 'Finance User', 'FINANCE_USER',
 ARRAY['payments:process', 'reports:view', 'reconciliation:perform']),

('analyst001@tampersafe.com', 'analyst001', extensions.crypt('analyst@2026', extensions.gen_salt('bf')), 'Business Analyst', 'ANALYST',
 ARRAY['analytics:access', 'reports:generate', 'data:analyze']);

-- Insert demo system settings
INSERT INTO system_settings_2026_02_11_14_10 (setting_key, setting_value, description, is_public, updated_by) VALUES
('app_name', '"TamperSafe Logistics"', 'Application name', true, (SELECT id FROM users_2026_02_11_14_10 WHERE username = 'appowner')),
('app_version', '"3.0.0-enterprise"', 'Application version', true, (SELECT id FROM users_2026_02_11_14_10 WHERE username = 'appowner')),
('max_login_attempts', '5', 'Maximum login attempts before account lock', false, (SELECT id FROM users_2026_02_11_14_10 WHERE username = 'superadmin')),
('session_timeout', '3600', 'Session timeout in seconds', false, (SELECT id FROM users_2026_02_11_14_10 WHERE username = 'superadmin'));

-- Insert demo KPI data
INSERT INTO kpi_data_2026_02_11_14_10 (metric_name, metric_value, metric_unit, period_type, period_start, period_end, category) VALUES
('total_shipments', 1247, 'count', 'daily', CURRENT_DATE, CURRENT_DATE, 'operations'),
('delivery_success_rate', 94.7, 'percentage', 'daily', CURRENT_DATE, CURRENT_DATE, 'operations'),
('customer_satisfaction', 4.3, 'rating', 'daily', CURRENT_DATE, CURRENT_DATE, 'service'),
('revenue', 45230.50, 'USD', 'daily', CURRENT_DATE, CURRENT_DATE, 'finance'),
('operational_efficiency', 89.2, 'percentage', 'daily', CURRENT_DATE, CURRENT_DATE, 'operations');

COMMENT ON TABLE users_2026_02_11_14_10 IS 'Comprehensive user management with RBAC for Express Delivery System';
COMMENT ON TABLE shipments_2026_02_11_14_10 IS 'Core shipment tracking with tamper-proof security integration';
COMMENT ON TABLE financial_transactions_2026_02_11_14_10 IS 'Financial transaction management with commission tracking';
COMMENT ON TABLE user_activity_2026_02_11_14_10 IS 'Complete audit trail for security and compliance';