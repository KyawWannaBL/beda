
-- ============================================================================
-- Compatibility: ensure existing deployments have columns referenced later
-- ============================================================================
ALTER TABLE IF EXISTS public.shipments
  ADD COLUMN IF NOT EXISTS assigned_rider_id uuid;

drop extension if exists "pg_net";
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'app_role' AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.app_role AS ENUM ('APP_OWNER', 'SUPER_ADMIN', 'OPERATIONS_ADMIN', 'FINANCE_ADMIN', 'HR_ADMIN', 'OPERATIONS_STAFF', 'FINANCE_STAFF', 'CUSTOMER_SERVICE', 'RIDER', 'DRIVER', 'HELPER', 'STAFF', 'MARKETING_ADMIN', 'CUSTOMER_SERVICE_ADMIN', 'FINANCE_USER', 'ANALYST', 'SUPERVISOR', 'WAREHOUSE_MANAGER', 'DATA_ENTRY', 'SUBSTATION_MANAGER', 'MARKETING', 'MERCHANT', 'CUSTOMER');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'authority_level' AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.authority_level AS ENUM ('L0', 'L1', 'L2', 'L3', 'L4', 'L5');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'collection_type_enum' AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.collection_type_enum AS ENUM ('COD', 'PREPAID');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'data_scope' AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.data_scope AS ENUM ('S1', 'S2', 'S3', 'S4', 'S5');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'delivery_status_enum' AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.delivery_status_enum AS ENUM ('DELIVERED', 'RETURN', 'REJECT');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'delivery_type' AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.delivery_type AS ENUM ('standard', 'express', 'same_day', 'next_day', 'scheduled');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'mfa_method' AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.mfa_method AS ENUM ('SMS', 'EMAIL', 'TOTP', 'BACKUP_CODES');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'payment_method_enum' AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.payment_method_enum AS ENUM ('CASH', 'TRANSACTION');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'payment_status' AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'partial', 'refunded', 'disputed');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'rider_remark_enum' AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.rider_remark_enum AS ENUM ('DONE', 'RETURNED', 'REJECTED', 'DAMAGED', 'CUSTOMER_NOT_REACHABLE', 'WRONG_ADDRESS', 'RESCHEDULE', 'PARTIAL_PAYMENT', 'OTHER');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'shipment_status' AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.shipment_status AS ENUM ('pending', 'pickup_scheduled', 'picked_up', 'in_transit', 'arrived_at_hub', 'out_for_delivery', 'delivered', 'failed_delivery', 'returned', 'cancelled');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'user_role_type' AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.user_role_type AS ENUM ('SYSTEM_ADMIN', 'MARKETING_MANAGER', 'MARKETING_EXECUTIVE', 'FINANCE_MANAGER', 'FINANCE_EXECUTIVE', 'CUSTOMER_SERVICE_MANAGER', 'CUSTOMER_SERVICE_AGENT', 'HR_MANAGER', 'HR_EXECUTIVE', 'OPERATIONS_MANAGER', 'DISPATCHER', 'DRIVER', 'MERCHANT_ADMIN', 'MERCHANT_USER', 'CUSTOMER');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'user_status' AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.user_status AS ENUM ('active', 'inactive', 'suspended', 'pending_verification', 'password_reset_required');
  END IF;
END $$;


drop trigger if exists "update_campaigns_updated_at" on "public"."marketing_campaigns_2026_02_11_14_10";

drop trigger if exists "update_shipments_updated_at" on "public"."shipments_2026_02_11_14_10";

drop trigger if exists "update_tickets_updated_at" on "public"."support_tickets_2026_02_11_14_10";

drop trigger if exists "update_settings_updated_at" on "public"."system_settings_2026_02_11_14_10";

drop trigger if exists "update_users_updated_at" on "public"."users_2026_02_11_14_10";

revoke delete on table "public"."commissions_2026_02_11_14_10" from "anon";

revoke insert on table "public"."commissions_2026_02_11_14_10" from "anon";

revoke references on table "public"."commissions_2026_02_11_14_10" from "anon";

revoke select on table "public"."commissions_2026_02_11_14_10" from "anon";

revoke trigger on table "public"."commissions_2026_02_11_14_10" from "anon";

revoke truncate on table "public"."commissions_2026_02_11_14_10" from "anon";

revoke update on table "public"."commissions_2026_02_11_14_10" from "anon";

revoke delete on table "public"."commissions_2026_02_11_14_10" from "authenticated";

revoke insert on table "public"."commissions_2026_02_11_14_10" from "authenticated";

revoke references on table "public"."commissions_2026_02_11_14_10" from "authenticated";

revoke select on table "public"."commissions_2026_02_11_14_10" from "authenticated";

revoke trigger on table "public"."commissions_2026_02_11_14_10" from "authenticated";

revoke truncate on table "public"."commissions_2026_02_11_14_10" from "authenticated";

revoke update on table "public"."commissions_2026_02_11_14_10" from "authenticated";

revoke delete on table "public"."commissions_2026_02_11_14_10" from "service_role";

revoke insert on table "public"."commissions_2026_02_11_14_10" from "service_role";

revoke references on table "public"."commissions_2026_02_11_14_10" from "service_role";

revoke select on table "public"."commissions_2026_02_11_14_10" from "service_role";

revoke trigger on table "public"."commissions_2026_02_11_14_10" from "service_role";

revoke truncate on table "public"."commissions_2026_02_11_14_10" from "service_role";

revoke update on table "public"."commissions_2026_02_11_14_10" from "service_role";

revoke delete on table "public"."customer_segments_2026_02_11_14_10" from "anon";

revoke insert on table "public"."customer_segments_2026_02_11_14_10" from "anon";

revoke references on table "public"."customer_segments_2026_02_11_14_10" from "anon";

revoke select on table "public"."customer_segments_2026_02_11_14_10" from "anon";

revoke trigger on table "public"."customer_segments_2026_02_11_14_10" from "anon";

revoke truncate on table "public"."customer_segments_2026_02_11_14_10" from "anon";

revoke update on table "public"."customer_segments_2026_02_11_14_10" from "anon";

revoke delete on table "public"."customer_segments_2026_02_11_14_10" from "authenticated";

revoke insert on table "public"."customer_segments_2026_02_11_14_10" from "authenticated";

revoke references on table "public"."customer_segments_2026_02_11_14_10" from "authenticated";

revoke select on table "public"."customer_segments_2026_02_11_14_10" from "authenticated";

revoke trigger on table "public"."customer_segments_2026_02_11_14_10" from "authenticated";

revoke truncate on table "public"."customer_segments_2026_02_11_14_10" from "authenticated";

revoke update on table "public"."customer_segments_2026_02_11_14_10" from "authenticated";

revoke delete on table "public"."customer_segments_2026_02_11_14_10" from "service_role";

revoke insert on table "public"."customer_segments_2026_02_11_14_10" from "service_role";

revoke references on table "public"."customer_segments_2026_02_11_14_10" from "service_role";

revoke select on table "public"."customer_segments_2026_02_11_14_10" from "service_role";

revoke trigger on table "public"."customer_segments_2026_02_11_14_10" from "service_role";

revoke truncate on table "public"."customer_segments_2026_02_11_14_10" from "service_role";

revoke update on table "public"."customer_segments_2026_02_11_14_10" from "service_role";

revoke delete on table "public"."delivery_records_2026_02_11_14_10" from "anon";

revoke insert on table "public"."delivery_records_2026_02_11_14_10" from "anon";

revoke references on table "public"."delivery_records_2026_02_11_14_10" from "anon";

revoke select on table "public"."delivery_records_2026_02_11_14_10" from "anon";

revoke trigger on table "public"."delivery_records_2026_02_11_14_10" from "anon";

revoke truncate on table "public"."delivery_records_2026_02_11_14_10" from "anon";

revoke update on table "public"."delivery_records_2026_02_11_14_10" from "anon";

revoke delete on table "public"."delivery_records_2026_02_11_14_10" from "authenticated";

revoke insert on table "public"."delivery_records_2026_02_11_14_10" from "authenticated";

revoke references on table "public"."delivery_records_2026_02_11_14_10" from "authenticated";

revoke select on table "public"."delivery_records_2026_02_11_14_10" from "authenticated";

revoke trigger on table "public"."delivery_records_2026_02_11_14_10" from "authenticated";

revoke truncate on table "public"."delivery_records_2026_02_11_14_10" from "authenticated";

revoke update on table "public"."delivery_records_2026_02_11_14_10" from "authenticated";

revoke delete on table "public"."delivery_records_2026_02_11_14_10" from "service_role";

revoke insert on table "public"."delivery_records_2026_02_11_14_10" from "service_role";

revoke references on table "public"."delivery_records_2026_02_11_14_10" from "service_role";

revoke select on table "public"."delivery_records_2026_02_11_14_10" from "service_role";

revoke trigger on table "public"."delivery_records_2026_02_11_14_10" from "service_role";

revoke truncate on table "public"."delivery_records_2026_02_11_14_10" from "service_role";

revoke update on table "public"."delivery_records_2026_02_11_14_10" from "service_role";

revoke delete on table "public"."financial_transactions_2026_02_11_14_10" from "anon";

revoke insert on table "public"."financial_transactions_2026_02_11_14_10" from "anon";

revoke references on table "public"."financial_transactions_2026_02_11_14_10" from "anon";

revoke select on table "public"."financial_transactions_2026_02_11_14_10" from "anon";

revoke trigger on table "public"."financial_transactions_2026_02_11_14_10" from "anon";

revoke truncate on table "public"."financial_transactions_2026_02_11_14_10" from "anon";

revoke update on table "public"."financial_transactions_2026_02_11_14_10" from "anon";

revoke delete on table "public"."financial_transactions_2026_02_11_14_10" from "authenticated";

revoke insert on table "public"."financial_transactions_2026_02_11_14_10" from "authenticated";

revoke references on table "public"."financial_transactions_2026_02_11_14_10" from "authenticated";

revoke select on table "public"."financial_transactions_2026_02_11_14_10" from "authenticated";

revoke trigger on table "public"."financial_transactions_2026_02_11_14_10" from "authenticated";

revoke truncate on table "public"."financial_transactions_2026_02_11_14_10" from "authenticated";

revoke update on table "public"."financial_transactions_2026_02_11_14_10" from "authenticated";

revoke delete on table "public"."financial_transactions_2026_02_11_14_10" from "service_role";

revoke insert on table "public"."financial_transactions_2026_02_11_14_10" from "service_role";

revoke references on table "public"."financial_transactions_2026_02_11_14_10" from "service_role";

revoke select on table "public"."financial_transactions_2026_02_11_14_10" from "service_role";

revoke trigger on table "public"."financial_transactions_2026_02_11_14_10" from "service_role";

revoke truncate on table "public"."financial_transactions_2026_02_11_14_10" from "service_role";

revoke update on table "public"."financial_transactions_2026_02_11_14_10" from "service_role";

revoke delete on table "public"."kpi_data_2026_02_11_14_10" from "anon";

revoke insert on table "public"."kpi_data_2026_02_11_14_10" from "anon";

revoke references on table "public"."kpi_data_2026_02_11_14_10" from "anon";

revoke select on table "public"."kpi_data_2026_02_11_14_10" from "anon";

revoke trigger on table "public"."kpi_data_2026_02_11_14_10" from "anon";

revoke truncate on table "public"."kpi_data_2026_02_11_14_10" from "anon";

revoke update on table "public"."kpi_data_2026_02_11_14_10" from "anon";

revoke delete on table "public"."kpi_data_2026_02_11_14_10" from "authenticated";

revoke insert on table "public"."kpi_data_2026_02_11_14_10" from "authenticated";

revoke references on table "public"."kpi_data_2026_02_11_14_10" from "authenticated";

revoke select on table "public"."kpi_data_2026_02_11_14_10" from "authenticated";

revoke trigger on table "public"."kpi_data_2026_02_11_14_10" from "authenticated";

revoke truncate on table "public"."kpi_data_2026_02_11_14_10" from "authenticated";

revoke update on table "public"."kpi_data_2026_02_11_14_10" from "authenticated";

revoke delete on table "public"."kpi_data_2026_02_11_14_10" from "service_role";

revoke insert on table "public"."kpi_data_2026_02_11_14_10" from "service_role";

revoke references on table "public"."kpi_data_2026_02_11_14_10" from "service_role";

revoke select on table "public"."kpi_data_2026_02_11_14_10" from "service_role";

revoke trigger on table "public"."kpi_data_2026_02_11_14_10" from "service_role";

revoke truncate on table "public"."kpi_data_2026_02_11_14_10" from "service_role";

revoke update on table "public"."kpi_data_2026_02_11_14_10" from "service_role";

revoke delete on table "public"."marketing_campaigns_2026_02_11_14_10" from "anon";

revoke insert on table "public"."marketing_campaigns_2026_02_11_14_10" from "anon";

revoke references on table "public"."marketing_campaigns_2026_02_11_14_10" from "anon";

revoke select on table "public"."marketing_campaigns_2026_02_11_14_10" from "anon";

revoke trigger on table "public"."marketing_campaigns_2026_02_11_14_10" from "anon";

revoke truncate on table "public"."marketing_campaigns_2026_02_11_14_10" from "anon";

revoke update on table "public"."marketing_campaigns_2026_02_11_14_10" from "anon";

revoke delete on table "public"."marketing_campaigns_2026_02_11_14_10" from "authenticated";

revoke insert on table "public"."marketing_campaigns_2026_02_11_14_10" from "authenticated";

revoke references on table "public"."marketing_campaigns_2026_02_11_14_10" from "authenticated";

revoke select on table "public"."marketing_campaigns_2026_02_11_14_10" from "authenticated";

revoke trigger on table "public"."marketing_campaigns_2026_02_11_14_10" from "authenticated";

revoke truncate on table "public"."marketing_campaigns_2026_02_11_14_10" from "authenticated";

revoke update on table "public"."marketing_campaigns_2026_02_11_14_10" from "authenticated";

revoke delete on table "public"."marketing_campaigns_2026_02_11_14_10" from "service_role";

revoke insert on table "public"."marketing_campaigns_2026_02_11_14_10" from "service_role";

revoke references on table "public"."marketing_campaigns_2026_02_11_14_10" from "service_role";

revoke select on table "public"."marketing_campaigns_2026_02_11_14_10" from "service_role";

revoke trigger on table "public"."marketing_campaigns_2026_02_11_14_10" from "service_role";

revoke truncate on table "public"."marketing_campaigns_2026_02_11_14_10" from "service_role";

revoke update on table "public"."marketing_campaigns_2026_02_11_14_10" from "service_role";

revoke delete on table "public"."pickup_records_2026_02_11_14_10" from "anon";

revoke insert on table "public"."pickup_records_2026_02_11_14_10" from "anon";

revoke references on table "public"."pickup_records_2026_02_11_14_10" from "anon";

revoke select on table "public"."pickup_records_2026_02_11_14_10" from "anon";

revoke trigger on table "public"."pickup_records_2026_02_11_14_10" from "anon";

revoke truncate on table "public"."pickup_records_2026_02_11_14_10" from "anon";

revoke update on table "public"."pickup_records_2026_02_11_14_10" from "anon";

revoke delete on table "public"."pickup_records_2026_02_11_14_10" from "authenticated";

revoke insert on table "public"."pickup_records_2026_02_11_14_10" from "authenticated";

revoke references on table "public"."pickup_records_2026_02_11_14_10" from "authenticated";

revoke select on table "public"."pickup_records_2026_02_11_14_10" from "authenticated";

revoke trigger on table "public"."pickup_records_2026_02_11_14_10" from "authenticated";

revoke truncate on table "public"."pickup_records_2026_02_11_14_10" from "authenticated";

revoke update on table "public"."pickup_records_2026_02_11_14_10" from "authenticated";

revoke delete on table "public"."pickup_records_2026_02_11_14_10" from "service_role";

revoke insert on table "public"."pickup_records_2026_02_11_14_10" from "service_role";

revoke references on table "public"."pickup_records_2026_02_11_14_10" from "service_role";

revoke select on table "public"."pickup_records_2026_02_11_14_10" from "service_role";

revoke trigger on table "public"."pickup_records_2026_02_11_14_10" from "service_role";

revoke truncate on table "public"."pickup_records_2026_02_11_14_10" from "service_role";

revoke update on table "public"."pickup_records_2026_02_11_14_10" from "service_role";

revoke delete on table "public"."reports_2026_02_11_14_10" from "anon";

revoke insert on table "public"."reports_2026_02_11_14_10" from "anon";

revoke references on table "public"."reports_2026_02_11_14_10" from "anon";

revoke select on table "public"."reports_2026_02_11_14_10" from "anon";

revoke trigger on table "public"."reports_2026_02_11_14_10" from "anon";

revoke truncate on table "public"."reports_2026_02_11_14_10" from "anon";

revoke update on table "public"."reports_2026_02_11_14_10" from "anon";

revoke delete on table "public"."reports_2026_02_11_14_10" from "authenticated";

revoke insert on table "public"."reports_2026_02_11_14_10" from "authenticated";

revoke references on table "public"."reports_2026_02_11_14_10" from "authenticated";

revoke select on table "public"."reports_2026_02_11_14_10" from "authenticated";

revoke trigger on table "public"."reports_2026_02_11_14_10" from "authenticated";

revoke truncate on table "public"."reports_2026_02_11_14_10" from "authenticated";

revoke update on table "public"."reports_2026_02_11_14_10" from "authenticated";

revoke delete on table "public"."reports_2026_02_11_14_10" from "service_role";

revoke insert on table "public"."reports_2026_02_11_14_10" from "service_role";

revoke references on table "public"."reports_2026_02_11_14_10" from "service_role";

revoke select on table "public"."reports_2026_02_11_14_10" from "service_role";

revoke trigger on table "public"."reports_2026_02_11_14_10" from "service_role";

revoke truncate on table "public"."reports_2026_02_11_14_10" from "service_role";

revoke update on table "public"."reports_2026_02_11_14_10" from "service_role";

revoke delete on table "public"."security_events_2026_02_11_14_10" from "anon";

revoke insert on table "public"."security_events_2026_02_11_14_10" from "anon";

revoke references on table "public"."security_events_2026_02_11_14_10" from "anon";

revoke select on table "public"."security_events_2026_02_11_14_10" from "anon";

revoke trigger on table "public"."security_events_2026_02_11_14_10" from "anon";

revoke truncate on table "public"."security_events_2026_02_11_14_10" from "anon";

revoke update on table "public"."security_events_2026_02_11_14_10" from "anon";

revoke delete on table "public"."security_events_2026_02_11_14_10" from "authenticated";

revoke insert on table "public"."security_events_2026_02_11_14_10" from "authenticated";

revoke references on table "public"."security_events_2026_02_11_14_10" from "authenticated";

revoke select on table "public"."security_events_2026_02_11_14_10" from "authenticated";

revoke trigger on table "public"."security_events_2026_02_11_14_10" from "authenticated";

revoke truncate on table "public"."security_events_2026_02_11_14_10" from "authenticated";

revoke update on table "public"."security_events_2026_02_11_14_10" from "authenticated";

revoke delete on table "public"."security_events_2026_02_11_14_10" from "service_role";

revoke insert on table "public"."security_events_2026_02_11_14_10" from "service_role";

revoke references on table "public"."security_events_2026_02_11_14_10" from "service_role";

revoke select on table "public"."security_events_2026_02_11_14_10" from "service_role";

revoke trigger on table "public"."security_events_2026_02_11_14_10" from "service_role";

revoke truncate on table "public"."security_events_2026_02_11_14_10" from "service_role";

revoke update on table "public"."security_events_2026_02_11_14_10" from "service_role";

revoke delete on table "public"."shipment_status_history_2026_02_11_14_10" from "anon";

revoke insert on table "public"."shipment_status_history_2026_02_11_14_10" from "anon";

revoke references on table "public"."shipment_status_history_2026_02_11_14_10" from "anon";

revoke select on table "public"."shipment_status_history_2026_02_11_14_10" from "anon";

revoke trigger on table "public"."shipment_status_history_2026_02_11_14_10" from "anon";

revoke truncate on table "public"."shipment_status_history_2026_02_11_14_10" from "anon";

revoke update on table "public"."shipment_status_history_2026_02_11_14_10" from "anon";

revoke delete on table "public"."shipment_status_history_2026_02_11_14_10" from "authenticated";

revoke insert on table "public"."shipment_status_history_2026_02_11_14_10" from "authenticated";

revoke references on table "public"."shipment_status_history_2026_02_11_14_10" from "authenticated";

revoke select on table "public"."shipment_status_history_2026_02_11_14_10" from "authenticated";

revoke trigger on table "public"."shipment_status_history_2026_02_11_14_10" from "authenticated";

revoke truncate on table "public"."shipment_status_history_2026_02_11_14_10" from "authenticated";

revoke update on table "public"."shipment_status_history_2026_02_11_14_10" from "authenticated";

revoke delete on table "public"."shipment_status_history_2026_02_11_14_10" from "service_role";

revoke insert on table "public"."shipment_status_history_2026_02_11_14_10" from "service_role";

revoke references on table "public"."shipment_status_history_2026_02_11_14_10" from "service_role";

revoke select on table "public"."shipment_status_history_2026_02_11_14_10" from "service_role";

revoke trigger on table "public"."shipment_status_history_2026_02_11_14_10" from "service_role";

revoke truncate on table "public"."shipment_status_history_2026_02_11_14_10" from "service_role";

revoke update on table "public"."shipment_status_history_2026_02_11_14_10" from "service_role";

revoke delete on table "public"."shipments_2026_02_11_14_10" from "anon";

revoke insert on table "public"."shipments_2026_02_11_14_10" from "anon";

revoke references on table "public"."shipments_2026_02_11_14_10" from "anon";

revoke select on table "public"."shipments_2026_02_11_14_10" from "anon";

revoke trigger on table "public"."shipments_2026_02_11_14_10" from "anon";

revoke truncate on table "public"."shipments_2026_02_11_14_10" from "anon";

revoke update on table "public"."shipments_2026_02_11_14_10" from "anon";

revoke delete on table "public"."shipments_2026_02_11_14_10" from "authenticated";

revoke insert on table "public"."shipments_2026_02_11_14_10" from "authenticated";

revoke references on table "public"."shipments_2026_02_11_14_10" from "authenticated";

revoke select on table "public"."shipments_2026_02_11_14_10" from "authenticated";

revoke trigger on table "public"."shipments_2026_02_11_14_10" from "authenticated";

revoke truncate on table "public"."shipments_2026_02_11_14_10" from "authenticated";

revoke update on table "public"."shipments_2026_02_11_14_10" from "authenticated";

revoke delete on table "public"."shipments_2026_02_11_14_10" from "service_role";

revoke insert on table "public"."shipments_2026_02_11_14_10" from "service_role";

revoke references on table "public"."shipments_2026_02_11_14_10" from "service_role";

revoke select on table "public"."shipments_2026_02_11_14_10" from "service_role";

revoke trigger on table "public"."shipments_2026_02_11_14_10" from "service_role";

revoke truncate on table "public"."shipments_2026_02_11_14_10" from "service_role";

revoke update on table "public"."shipments_2026_02_11_14_10" from "service_role";

revoke delete on table "public"."support_ticket_messages_2026_02_11_14_10" from "anon";

revoke insert on table "public"."support_ticket_messages_2026_02_11_14_10" from "anon";

revoke references on table "public"."support_ticket_messages_2026_02_11_14_10" from "anon";

revoke select on table "public"."support_ticket_messages_2026_02_11_14_10" from "anon";

revoke trigger on table "public"."support_ticket_messages_2026_02_11_14_10" from "anon";

revoke truncate on table "public"."support_ticket_messages_2026_02_11_14_10" from "anon";

revoke update on table "public"."support_ticket_messages_2026_02_11_14_10" from "anon";

revoke delete on table "public"."support_ticket_messages_2026_02_11_14_10" from "authenticated";

revoke insert on table "public"."support_ticket_messages_2026_02_11_14_10" from "authenticated";

revoke references on table "public"."support_ticket_messages_2026_02_11_14_10" from "authenticated";

revoke select on table "public"."support_ticket_messages_2026_02_11_14_10" from "authenticated";

revoke trigger on table "public"."support_ticket_messages_2026_02_11_14_10" from "authenticated";

revoke truncate on table "public"."support_ticket_messages_2026_02_11_14_10" from "authenticated";

revoke update on table "public"."support_ticket_messages_2026_02_11_14_10" from "authenticated";

revoke delete on table "public"."support_ticket_messages_2026_02_11_14_10" from "service_role";

revoke insert on table "public"."support_ticket_messages_2026_02_11_14_10" from "service_role";

revoke references on table "public"."support_ticket_messages_2026_02_11_14_10" from "service_role";

revoke select on table "public"."support_ticket_messages_2026_02_11_14_10" from "service_role";

revoke trigger on table "public"."support_ticket_messages_2026_02_11_14_10" from "service_role";

revoke truncate on table "public"."support_ticket_messages_2026_02_11_14_10" from "service_role";

revoke update on table "public"."support_ticket_messages_2026_02_11_14_10" from "service_role";

revoke delete on table "public"."support_tickets_2026_02_11_14_10" from "anon";

revoke insert on table "public"."support_tickets_2026_02_11_14_10" from "anon";

revoke references on table "public"."support_tickets_2026_02_11_14_10" from "anon";

revoke select on table "public"."support_tickets_2026_02_11_14_10" from "anon";

revoke trigger on table "public"."support_tickets_2026_02_11_14_10" from "anon";

revoke truncate on table "public"."support_tickets_2026_02_11_14_10" from "anon";

revoke update on table "public"."support_tickets_2026_02_11_14_10" from "anon";

revoke delete on table "public"."support_tickets_2026_02_11_14_10" from "authenticated";

revoke insert on table "public"."support_tickets_2026_02_11_14_10" from "authenticated";

revoke references on table "public"."support_tickets_2026_02_11_14_10" from "authenticated";

revoke select on table "public"."support_tickets_2026_02_11_14_10" from "authenticated";

revoke trigger on table "public"."support_tickets_2026_02_11_14_10" from "authenticated";

revoke truncate on table "public"."support_tickets_2026_02_11_14_10" from "authenticated";

revoke update on table "public"."support_tickets_2026_02_11_14_10" from "authenticated";

revoke delete on table "public"."support_tickets_2026_02_11_14_10" from "service_role";

revoke insert on table "public"."support_tickets_2026_02_11_14_10" from "service_role";

revoke references on table "public"."support_tickets_2026_02_11_14_10" from "service_role";

revoke select on table "public"."support_tickets_2026_02_11_14_10" from "service_role";

revoke trigger on table "public"."support_tickets_2026_02_11_14_10" from "service_role";

revoke truncate on table "public"."support_tickets_2026_02_11_14_10" from "service_role";

revoke update on table "public"."support_tickets_2026_02_11_14_10" from "service_role";

revoke delete on table "public"."system_settings_2026_02_11_14_10" from "anon";

revoke insert on table "public"."system_settings_2026_02_11_14_10" from "anon";

revoke references on table "public"."system_settings_2026_02_11_14_10" from "anon";

revoke select on table "public"."system_settings_2026_02_11_14_10" from "anon";

revoke trigger on table "public"."system_settings_2026_02_11_14_10" from "anon";

revoke truncate on table "public"."system_settings_2026_02_11_14_10" from "anon";

revoke update on table "public"."system_settings_2026_02_11_14_10" from "anon";

revoke delete on table "public"."system_settings_2026_02_11_14_10" from "authenticated";

revoke insert on table "public"."system_settings_2026_02_11_14_10" from "authenticated";

revoke references on table "public"."system_settings_2026_02_11_14_10" from "authenticated";

revoke select on table "public"."system_settings_2026_02_11_14_10" from "authenticated";

revoke trigger on table "public"."system_settings_2026_02_11_14_10" from "authenticated";

revoke truncate on table "public"."system_settings_2026_02_11_14_10" from "authenticated";

revoke update on table "public"."system_settings_2026_02_11_14_10" from "authenticated";

revoke delete on table "public"."system_settings_2026_02_11_14_10" from "service_role";

revoke insert on table "public"."system_settings_2026_02_11_14_10" from "service_role";

revoke references on table "public"."system_settings_2026_02_11_14_10" from "service_role";

revoke select on table "public"."system_settings_2026_02_11_14_10" from "service_role";

revoke trigger on table "public"."system_settings_2026_02_11_14_10" from "service_role";

revoke truncate on table "public"."system_settings_2026_02_11_14_10" from "service_role";

revoke update on table "public"."system_settings_2026_02_11_14_10" from "service_role";

revoke delete on table "public"."tamper_tags_2026_02_11_14_10" from "anon";

revoke insert on table "public"."tamper_tags_2026_02_11_14_10" from "anon";

revoke references on table "public"."tamper_tags_2026_02_11_14_10" from "anon";

revoke select on table "public"."tamper_tags_2026_02_11_14_10" from "anon";

revoke trigger on table "public"."tamper_tags_2026_02_11_14_10" from "anon";

revoke truncate on table "public"."tamper_tags_2026_02_11_14_10" from "anon";

revoke update on table "public"."tamper_tags_2026_02_11_14_10" from "anon";

revoke delete on table "public"."tamper_tags_2026_02_11_14_10" from "authenticated";

revoke insert on table "public"."tamper_tags_2026_02_11_14_10" from "authenticated";

revoke references on table "public"."tamper_tags_2026_02_11_14_10" from "authenticated";

revoke select on table "public"."tamper_tags_2026_02_11_14_10" from "authenticated";

revoke trigger on table "public"."tamper_tags_2026_02_11_14_10" from "authenticated";

revoke truncate on table "public"."tamper_tags_2026_02_11_14_10" from "authenticated";

revoke update on table "public"."tamper_tags_2026_02_11_14_10" from "authenticated";

revoke delete on table "public"."tamper_tags_2026_02_11_14_10" from "service_role";

revoke insert on table "public"."tamper_tags_2026_02_11_14_10" from "service_role";

revoke references on table "public"."tamper_tags_2026_02_11_14_10" from "service_role";

revoke select on table "public"."tamper_tags_2026_02_11_14_10" from "service_role";

revoke trigger on table "public"."tamper_tags_2026_02_11_14_10" from "service_role";

revoke truncate on table "public"."tamper_tags_2026_02_11_14_10" from "service_role";

revoke update on table "public"."tamper_tags_2026_02_11_14_10" from "service_role";

revoke delete on table "public"."user_activity_2026_02_11_14_10" from "anon";

revoke insert on table "public"."user_activity_2026_02_11_14_10" from "anon";

revoke references on table "public"."user_activity_2026_02_11_14_10" from "anon";

revoke select on table "public"."user_activity_2026_02_11_14_10" from "anon";

revoke trigger on table "public"."user_activity_2026_02_11_14_10" from "anon";

revoke truncate on table "public"."user_activity_2026_02_11_14_10" from "anon";

revoke update on table "public"."user_activity_2026_02_11_14_10" from "anon";

revoke delete on table "public"."user_activity_2026_02_11_14_10" from "authenticated";

revoke insert on table "public"."user_activity_2026_02_11_14_10" from "authenticated";

revoke references on table "public"."user_activity_2026_02_11_14_10" from "authenticated";

revoke select on table "public"."user_activity_2026_02_11_14_10" from "authenticated";

revoke trigger on table "public"."user_activity_2026_02_11_14_10" from "authenticated";

revoke truncate on table "public"."user_activity_2026_02_11_14_10" from "authenticated";

revoke update on table "public"."user_activity_2026_02_11_14_10" from "authenticated";

revoke delete on table "public"."user_activity_2026_02_11_14_10" from "service_role";

revoke insert on table "public"."user_activity_2026_02_11_14_10" from "service_role";

revoke references on table "public"."user_activity_2026_02_11_14_10" from "service_role";

revoke select on table "public"."user_activity_2026_02_11_14_10" from "service_role";

revoke trigger on table "public"."user_activity_2026_02_11_14_10" from "service_role";

revoke truncate on table "public"."user_activity_2026_02_11_14_10" from "service_role";

revoke update on table "public"."user_activity_2026_02_11_14_10" from "service_role";

revoke delete on table "public"."user_sessions_2026_02_11_14_10" from "anon";

revoke insert on table "public"."user_sessions_2026_02_11_14_10" from "anon";

revoke references on table "public"."user_sessions_2026_02_11_14_10" from "anon";

revoke select on table "public"."user_sessions_2026_02_11_14_10" from "anon";

revoke trigger on table "public"."user_sessions_2026_02_11_14_10" from "anon";

revoke truncate on table "public"."user_sessions_2026_02_11_14_10" from "anon";

revoke update on table "public"."user_sessions_2026_02_11_14_10" from "anon";

revoke delete on table "public"."user_sessions_2026_02_11_14_10" from "authenticated";

revoke insert on table "public"."user_sessions_2026_02_11_14_10" from "authenticated";

revoke references on table "public"."user_sessions_2026_02_11_14_10" from "authenticated";

revoke select on table "public"."user_sessions_2026_02_11_14_10" from "authenticated";

revoke trigger on table "public"."user_sessions_2026_02_11_14_10" from "authenticated";

revoke truncate on table "public"."user_sessions_2026_02_11_14_10" from "authenticated";

revoke update on table "public"."user_sessions_2026_02_11_14_10" from "authenticated";

revoke delete on table "public"."user_sessions_2026_02_11_14_10" from "service_role";

revoke insert on table "public"."user_sessions_2026_02_11_14_10" from "service_role";

revoke references on table "public"."user_sessions_2026_02_11_14_10" from "service_role";

revoke select on table "public"."user_sessions_2026_02_11_14_10" from "service_role";

revoke trigger on table "public"."user_sessions_2026_02_11_14_10" from "service_role";

revoke truncate on table "public"."user_sessions_2026_02_11_14_10" from "service_role";

revoke update on table "public"."user_sessions_2026_02_11_14_10" from "service_role";

revoke delete on table "public"."users_2026_02_11_14_10" from "anon";

revoke insert on table "public"."users_2026_02_11_14_10" from "anon";

revoke references on table "public"."users_2026_02_11_14_10" from "anon";

revoke select on table "public"."users_2026_02_11_14_10" from "anon";

revoke trigger on table "public"."users_2026_02_11_14_10" from "anon";

revoke truncate on table "public"."users_2026_02_11_14_10" from "anon";

revoke update on table "public"."users_2026_02_11_14_10" from "anon";

revoke delete on table "public"."users_2026_02_11_14_10" from "authenticated";

revoke insert on table "public"."users_2026_02_11_14_10" from "authenticated";

revoke references on table "public"."users_2026_02_11_14_10" from "authenticated";

revoke select on table "public"."users_2026_02_11_14_10" from "authenticated";

revoke trigger on table "public"."users_2026_02_11_14_10" from "authenticated";

revoke truncate on table "public"."users_2026_02_11_14_10" from "authenticated";

revoke update on table "public"."users_2026_02_11_14_10" from "authenticated";

revoke delete on table "public"."users_2026_02_11_14_10" from "service_role";

revoke insert on table "public"."users_2026_02_11_14_10" from "service_role";

revoke references on table "public"."users_2026_02_11_14_10" from "service_role";

revoke select on table "public"."users_2026_02_11_14_10" from "service_role";

revoke trigger on table "public"."users_2026_02_11_14_10" from "service_role";

revoke truncate on table "public"."users_2026_02_11_14_10" from "service_role";

revoke update on table "public"."users_2026_02_11_14_10" from "service_role";

alter table "public"."commissions_2026_02_11_14_10" drop constraint "commissions_2026_02_11_14_10_calculated_by_fkey";

alter table "public"."commissions_2026_02_11_14_10" drop constraint "commissions_2026_02_11_14_10_user_id_fkey";

alter table "public"."customer_segments_2026_02_11_14_10" drop constraint "customer_segments_2026_02_11_14_10_created_by_fkey";

alter table "public"."delivery_records_2026_02_11_14_10" drop constraint "delivery_records_2026_02_11_14_10_rider_id_fkey";

alter table "public"."delivery_records_2026_02_11_14_10" drop constraint "delivery_records_2026_02_11_14_10_shipment_id_fkey";

alter table "public"."financial_transactions_2026_02_11_14_10" drop constraint "financial_transactions_2026_02_11_14_10_customer_id_fkey";

alter table "public"."financial_transactions_2026_02_11_14_10" drop constraint "financial_transactions_2026_02_11_14_10_merchant_id_fkey";

alter table "public"."financial_transactions_2026_02_11_14_10" drop constraint "financial_transactions_2026_02_11_14_10_processed_by_fkey";

alter table "public"."financial_transactions_2026_02_11_14_10" drop constraint "financial_transactions_2026_02_11_14_10_shipment_id_fkey";

alter table "public"."marketing_campaigns_2026_02_11_14_10" drop constraint "marketing_campaigns_2026_02_11_14_10_created_by_fkey";

alter table "public"."pickup_records_2026_02_11_14_10" drop constraint "pickup_records_2026_02_11_14_10_rider_id_fkey";

alter table "public"."pickup_records_2026_02_11_14_10" drop constraint "pickup_records_2026_02_11_14_10_shipment_id_fkey";

alter table "public"."reports_2026_02_11_14_10" drop constraint "reports_2026_02_11_14_10_created_by_fkey";

alter table "public"."security_events_2026_02_11_14_10" drop constraint "security_events_2026_02_11_14_10_resolved_by_fkey";

alter table "public"."security_events_2026_02_11_14_10" drop constraint "security_events_2026_02_11_14_10_user_id_fkey";

alter table "public"."shipment_status_history_2026_02_11_14_10" drop constraint "shipment_status_history_2026_02_11_14_10_shipment_id_fkey";

alter table "public"."shipment_status_history_2026_02_11_14_10" drop constraint "shipment_status_history_2026_02_11_14_10_updated_by_fkey";

alter table "public"."shipments_2026_02_11_14_10" drop constraint "shipments_2026_02_11_14_10_awb_number_key";

alter table "public"."shipments_2026_02_11_14_10" drop constraint "shipments_2026_02_11_14_10_created_by_fkey";

alter table "public"."shipments_2026_02_11_14_10" drop constraint "shipments_2026_02_11_14_10_customer_id_fkey";

alter table "public"."shipments_2026_02_11_14_10" drop constraint "shipments_2026_02_11_14_10_merchant_id_fkey";

alter table "public"."shipments_2026_02_11_14_10" drop constraint "shipments_2026_02_11_14_10_tamper_tag_id_fkey";

alter table "public"."support_ticket_messages_2026_02_11_14_10" drop constraint "support_ticket_messages_2026_02_11_14_10_sender_id_fkey";

alter table "public"."support_ticket_messages_2026_02_11_14_10" drop constraint "support_ticket_messages_2026_02_11_14_10_ticket_id_fkey";

alter table "public"."support_tickets_2026_02_11_14_10" drop constraint "support_tickets_2026_02_11_14_10_assigned_to_fkey";

alter table "public"."support_tickets_2026_02_11_14_10" drop constraint "support_tickets_2026_02_11_14_10_customer_id_fkey";

alter table "public"."support_tickets_2026_02_11_14_10" drop constraint "support_tickets_2026_02_11_14_10_shipment_id_fkey";

alter table "public"."support_tickets_2026_02_11_14_10" drop constraint "support_tickets_2026_02_11_14_10_ticket_number_key";

alter table "public"."system_settings_2026_02_11_14_10" drop constraint "system_settings_2026_02_11_14_10_setting_key_key";

alter table "public"."system_settings_2026_02_11_14_10" drop constraint "system_settings_2026_02_11_14_10_updated_by_fkey";

alter table "public"."tamper_tags_2026_02_11_14_10" drop constraint "tamper_tags_2026_02_11_14_10_assigned_to_fkey";

alter table "public"."tamper_tags_2026_02_11_14_10" drop constraint "tamper_tags_2026_02_11_14_10_tag_code_key";

alter table "public"."user_activity_2026_02_11_14_10" drop constraint "user_activity_2026_02_11_14_10_user_id_fkey";

alter table "public"."user_sessions_2026_02_11_14_10" drop constraint "user_sessions_2026_02_11_14_10_session_token_key";

alter table "public"."user_sessions_2026_02_11_14_10" drop constraint "user_sessions_2026_02_11_14_10_user_id_fkey";

alter table "public"."users_2026_02_11_14_10" drop constraint "users_2026_02_11_14_10_blocked_by_fkey";

alter table "public"."users_2026_02_11_14_10" drop constraint "users_2026_02_11_14_10_email_key";

alter table "public"."users_2026_02_11_14_10" drop constraint "users_2026_02_11_14_10_username_key";

alter table "public"."commissions_2026_02_11_14_10" drop constraint "commissions_2026_02_11_14_10_pkey";

alter table "public"."customer_segments_2026_02_11_14_10" drop constraint "customer_segments_2026_02_11_14_10_pkey";

alter table "public"."delivery_records_2026_02_11_14_10" drop constraint "delivery_records_2026_02_11_14_10_pkey";

alter table "public"."financial_transactions_2026_02_11_14_10" drop constraint "financial_transactions_2026_02_11_14_10_pkey";

alter table "public"."kpi_data_2026_02_11_14_10" drop constraint "kpi_data_2026_02_11_14_10_pkey";

alter table "public"."marketing_campaigns_2026_02_11_14_10" drop constraint "marketing_campaigns_2026_02_11_14_10_pkey";

alter table "public"."pickup_records_2026_02_11_14_10" drop constraint "pickup_records_2026_02_11_14_10_pkey";

alter table "public"."reports_2026_02_11_14_10" drop constraint "reports_2026_02_11_14_10_pkey";

alter table "public"."security_events_2026_02_11_14_10" drop constraint "security_events_2026_02_11_14_10_pkey";

alter table "public"."shipment_status_history_2026_02_11_14_10" drop constraint "shipment_status_history_2026_02_11_14_10_pkey";

alter table "public"."shipments_2026_02_11_14_10" drop constraint "shipments_2026_02_11_14_10_pkey";

alter table "public"."support_ticket_messages_2026_02_11_14_10" drop constraint "support_ticket_messages_2026_02_11_14_10_pkey";

alter table "public"."support_tickets_2026_02_11_14_10" drop constraint "support_tickets_2026_02_11_14_10_pkey";

alter table "public"."system_settings_2026_02_11_14_10" drop constraint "system_settings_2026_02_11_14_10_pkey";

alter table "public"."tamper_tags_2026_02_11_14_10" drop constraint "tamper_tags_2026_02_11_14_10_pkey";

alter table "public"."user_activity_2026_02_11_14_10" drop constraint "user_activity_2026_02_11_14_10_pkey";

alter table "public"."user_sessions_2026_02_11_14_10" drop constraint "user_sessions_2026_02_11_14_10_pkey";

alter table "public"."users_2026_02_11_14_10" drop constraint "users_2026_02_11_14_10_pkey";

drop index if exists "public"."commissions_2026_02_11_14_10_pkey";

drop index if exists "public"."customer_segments_2026_02_11_14_10_pkey";

drop index if exists "public"."delivery_records_2026_02_11_14_10_pkey";

drop index if exists "public"."financial_transactions_2026_02_11_14_10_pkey";

drop index if exists "public"."idx_activity_action";

drop index if exists "public"."idx_activity_created";

drop index if exists "public"."idx_activity_user";

drop index if exists "public"."idx_shipments_awb";

drop index if exists "public"."idx_shipments_created";

drop index if exists "public"."idx_shipments_customer";

drop index if exists "public"."idx_shipments_merchant";

drop index if exists "public"."idx_transactions_merchant";

drop index if exists "public"."idx_transactions_status";

drop index if exists "public"."idx_transactions_type";

drop index if exists "public"."idx_users_active";

drop index if exists "public"."idx_users_username";

drop index if exists "public"."kpi_data_2026_02_11_14_10_pkey";

drop index if exists "public"."marketing_campaigns_2026_02_11_14_10_pkey";

drop index if exists "public"."pickup_records_2026_02_11_14_10_pkey";

drop index if exists "public"."reports_2026_02_11_14_10_pkey";

drop index if exists "public"."security_events_2026_02_11_14_10_pkey";

drop index if exists "public"."shipment_status_history_2026_02_11_14_10_pkey";

drop index if exists "public"."shipments_2026_02_11_14_10_awb_number_key";

drop index if exists "public"."shipments_2026_02_11_14_10_pkey";

drop index if exists "public"."support_ticket_messages_2026_02_11_14_10_pkey";

drop index if exists "public"."support_tickets_2026_02_11_14_10_pkey";

drop index if exists "public"."support_tickets_2026_02_11_14_10_ticket_number_key";

drop index if exists "public"."system_settings_2026_02_11_14_10_pkey";

drop index if exists "public"."system_settings_2026_02_11_14_10_setting_key_key";

drop index if exists "public"."tamper_tags_2026_02_11_14_10_pkey";

drop index if exists "public"."tamper_tags_2026_02_11_14_10_tag_code_key";

drop index if exists "public"."user_activity_2026_02_11_14_10_pkey";

drop index if exists "public"."user_sessions_2026_02_11_14_10_pkey";

drop index if exists "public"."user_sessions_2026_02_11_14_10_session_token_key";

drop index if exists "public"."users_2026_02_11_14_10_email_key";

drop index if exists "public"."users_2026_02_11_14_10_pkey";

drop index if exists "public"."users_2026_02_11_14_10_username_key";

drop index if exists "public"."idx_shipments_status";

drop index if exists "public"."idx_users_email";

drop index if exists "public"."idx_users_role";

drop table "public"."commissions_2026_02_11_14_10";

drop table "public"."customer_segments_2026_02_11_14_10";

drop table "public"."delivery_records_2026_02_11_14_10";

drop table "public"."financial_transactions_2026_02_11_14_10";

drop table "public"."kpi_data_2026_02_11_14_10";

drop table "public"."marketing_campaigns_2026_02_11_14_10";

drop table "public"."pickup_records_2026_02_11_14_10";

drop table "public"."reports_2026_02_11_14_10";

drop table "public"."security_events_2026_02_11_14_10";

drop table "public"."shipment_status_history_2026_02_11_14_10";

drop table "public"."shipments_2026_02_11_14_10";

drop table "public"."support_ticket_messages_2026_02_11_14_10";

drop table "public"."support_tickets_2026_02_11_14_10";

drop table "public"."system_settings_2026_02_11_14_10";

drop table "public"."tamper_tags_2026_02_11_14_10";

drop table "public"."user_activity_2026_02_11_14_10";

drop table "public"."user_sessions_2026_02_11_14_10";

drop table "public"."users_2026_02_11_14_10";

alter type "public"."user_role" rename to "user_role__old_version_to_be_dropped";
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'user_role' AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.user_role AS ENUM ('super_admin', 'admin', 'manager', 'sub_station_manager', 'supervisor', 'warehouse_staff', 'rider', 'merchant', 'vendor', 'accountant', 'customer', 'finance_manager');
  END IF;
END $$;
CREATE TABLE IF NOT EXISTS "public"."admin_users_2026_02_04_16_00" (
    "id" uuid not null default gen_random_uuid(),
    "email" character varying(255) not null,
    "full_name" character varying(255) not null,
    "role" character varying(50) not null,
    "status" character varying(20) default 'active'::character varying,
    "hub_assignment" character varying(100) default 'Global'::character varying,
    "phone" character varying(20),
    "must_change_password" boolean default true,
    "last_login" timestamp with time zone,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "created_by" uuid
      );


alter table "public"."admin_users_2026_02_04_16_00" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."audit_logs" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "action" character varying(100) not null,
    "table_name" character varying(100),
    "record_id" uuid,
    "old_values" jsonb,
    "new_values" jsonb,
    "ip_address" inet,
    "user_agent" text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."audit_logs" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."automated_reports" (
    "id" uuid not null default gen_random_uuid(),
    "report_type" character varying(100) not null,
    "trigger_event" character varying(100) not null,
    "related_entity_id" uuid not null,
    "report_data" jsonb not null,
    "pdf_url" text,
    "generation_status" character varying(50) default 'pending'::character varying,
    "generated_at" timestamp with time zone,
    "created_at" timestamp with time zone default now(),
    "file_size_bytes" bigint,
    "generation_duration_ms" integer,
    "template_version" character varying(20) default 'v1.0'::character varying
      );


alter table "public"."automated_reports" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."branches" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "code" text not null,
    "address" text not null,
    "city" text not null,
    "state" text not null,
    "postal_code" text,
    "phone" text,
    "email" text,
    "manager_id" uuid,
    "is_active" boolean default true,
    "coordinates" point,
    "coverage_radius" integer default 5000,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."branches" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."broadcast_messages" (
    "id" uuid not null default gen_random_uuid(),
    "message_title" character varying(200) not null,
    "message_content" text not null,
    "message_type" character varying(50) default 'general'::character varying,
    "target_audience" character varying(50) not null,
    "delivery_method" character varying(50) default 'in_app'::character varying,
    "scheduled_send_time" timestamp with time zone,
    "sent_time" timestamp with time zone,
    "status" character varying(20) default 'draft'::character varying,
    "total_recipients" integer default 0,
    "successful_deliveries" integer default 0,
    "failed_deliveries" integer default 0,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );
CREATE TABLE IF NOT EXISTS "public"."bulk_upload_items_2026_02_04_16_00" (
    "id" uuid not null default gen_random_uuid(),
    "upload_id" uuid,
    "row_number" integer not null,
    "receiver_name" character varying(255),
    "receiver_phone" character varying(20),
    "receiver_address" text,
    "sender_name" character varying(255),
    "sender_phone" character varying(20),
    "weight" numeric(10,2),
    "cod_amount" numeric(12,2),
    "special_instructions" text,
    "validation_status" character varying(20) default 'pending'::character varying,
    "validation_errors" text[],
    "created_shipment_id" uuid,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."bulk_upload_items_2026_02_04_16_00" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."bulk_uploads_2026_02_04_16_00" (
    "id" uuid not null default gen_random_uuid(),
    "filename" character varying(255) not null,
    "total_rows" integer not null,
    "valid_rows" integer not null,
    "error_rows" integer not null,
    "status" character varying(20) default 'processing'::character varying,
    "uploaded_by" uuid,
    "upload_date" timestamp with time zone default now(),
    "processed_date" timestamp with time zone,
    "error_details" jsonb
      );


alter table "public"."bulk_uploads_2026_02_04_16_00" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."cash_advances" (
    "id" uuid not null default gen_random_uuid(),
    "deliveryman_id" uuid not null,
    "amount" numeric(10,2) not null,
    "advance_type" character varying(20) default 'regular'::character varying,
    "reason" text,
    "status" character varying(20) default 'pending'::character varying,
    "disbursement_date" timestamp with time zone,
    "remaining_balance" numeric(10,2),
    "interest_rate" numeric(5,2) default 0,
    "notes" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "advance_number" character varying(50),
    "deliveryman_name" character varying(255),
    "advance_date" date default CURRENT_DATE,
    "due_date" date,
    "repaid_amount" numeric(10,2) default 0,
    "purpose" text
      );
CREATE TABLE IF NOT EXISTS "public"."content_pages_2026_02_03_21_00" (
    "id" uuid not null default gen_random_uuid(),
    "page_key" character varying(100) not null,
    "title" character varying(255) not null,
    "content" text,
    "meta_description" text,
    "is_active" boolean default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."content_pages_2026_02_03_21_00" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."customer_acknowledgments_2026_02_04_15_54" (
    "id" uuid not null default gen_random_uuid(),
    "parcel_id" uuid,
    "acknowledgment_type" character varying(50) not null,
    "customer_name" character varying(100),
    "customer_phone" character varying(20),
    "customer_signature_url" text,
    "customer_photo_url" text,
    "delivery_location" text,
    "delivery_photo_url" text,
    "delivery_notes" text,
    "delivered_by" uuid,
    "delivery_method" character varying(50),
    "device_info" jsonb,
    "gps_location" jsonb,
    "app_version" character varying(20),
    "acknowledged_at" timestamp with time zone default now(),
    "created_at" timestamp with time zone default now()
      );


alter table "public"."customer_acknowledgments_2026_02_04_15_54" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."customer_service_interactions_2026_02_04_16_00" (
    "id" uuid not null default gen_random_uuid(),
    "agent_id" uuid,
    "customer_id" uuid,
    "customer_name" character varying(255),
    "customer_phone" character varying(20),
    "customer_email" character varying(255),
    "interaction_type" character varying(50) not null,
    "priority" character varying(20) default 'medium'::character varying,
    "status" character varying(20) default 'open'::character varying,
    "subject" character varying(255) not null,
    "description" text,
    "resolution" text,
    "satisfaction_rating" integer,
    "created_at" timestamp with time zone default now(),
    "resolved_at" timestamp with time zone,
    "response_time_minutes" integer
      );


alter table "public"."customer_service_interactions_2026_02_04_16_00" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."customers" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "customer_code" text not null,
    "full_name" text not null,
    "phone" text not null,
    "email" text,
    "address" text,
    "city" text,
    "state" text,
    "postal_code" text,
    "preferred_language" text default 'en'::text,
    "is_active" boolean default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."customers" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."deliveries" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "group_shipment_id" text not null,
    "way_id" text not null,
    "merchant" text not null,
    "customer_name" text not null,
    "address" text not null,
    "collection_type" public.collection_type_enum not null,
    "payment_method" public.payment_method_enum not null,
    "amount_cash" numeric(12,2) not null default 0,
    "amount_transaction" numeric(12,2) not null default 0,
    "delivery_status" public.delivery_status_enum not null default 'DELIVERED'::public.delivery_status_enum,
    "rider_remark" public.rider_remark_enum,
    "customer_review_rating" integer,
    "customer_review_text" text,
    "signature_url" text,
    "signature_png_base64" text,
    "driver_name" text,
    "helper_name" text,
    "rider_name" text,
    "total_amount" numeric(12,2) generated always as ((amount_cash + amount_transaction)) stored,
    "collected_cash" numeric(12,2) generated always as (
CASE
    WHEN (delivery_status = 'DELIVERED'::public.delivery_status_enum) THEN amount_cash
    ELSE (0)::numeric
END) stored,
    "collected_transaction" numeric(12,2) generated always as (
CASE
    WHEN (delivery_status = 'DELIVERED'::public.delivery_status_enum) THEN amount_transaction
    ELSE (0)::numeric
END) stored
      );
CREATE TABLE IF NOT EXISTS "public"."delivery_routes" (
    "id" uuid not null default gen_random_uuid(),
    "route_name" text not null,
    "rider_id" uuid not null,
    "branch_id" uuid not null,
    "route_date" date not null,
    "start_time" timestamp with time zone,
    "end_time" timestamp with time zone,
    "total_shipments" integer default 0,
    "completed_shipments" integer default 0,
    "failed_shipments" integer default 0,
    "total_distance" numeric(8,2),
    "estimated_duration" integer,
    "actual_duration" integer,
    "status" text default 'planned'::text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."delivery_routes" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."delivery_ways" (
    "id" uuid not null default gen_random_uuid(),
    "tracking_number" character varying(50) not null,
    "status" character varying(20) default 'pending'::character varying,
    "pickup_address" text not null,
    "delivery_address" text not null,
    "pickup_date" timestamp with time zone,
    "delivery_date" timestamp with time zone,
    "rider_name" character varying(100),
    "vehicle_type" character varying(50),
    "priority" integer default 1,
    "cod_amount" numeric(10,2) default 0,
    "delivery_fee" numeric(10,2) not null,
    "weight" numeric(8,2),
    "special_instructions" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );
CREATE TABLE IF NOT EXISTS "public"."deliverymen_be" (
    "id" uuid not null default gen_random_uuid(),
    "employee_id" character varying(50) not null,
    "full_name" character varying(100) not null,
    "phone" character varying(20) not null,
    "email" character varying(100),
    "address" text,
    "city" character varying(100),
    "date_of_birth" date,
    "hire_date" date default CURRENT_DATE,
    "employment_status" character varying(20) default 'active'::character varying,
    "vehicle_type" character varying(50),
    "vehicle_number" character varying(50),
    "license_number" character varying(50),
    "zone_assignment" character varying(100),
    "base_salary" numeric(10,2) default 0,
    "total_deliveries" integer default 0,
    "successful_deliveries" integer default 0,
    "failed_deliveries" integer default 0,
    "total_earnings" numeric(12,2) default 0,
    "current_cash_advance" numeric(10,2) default 0,
    "performance_rating" numeric(3,2) default 0,
    "last_active" timestamp with time zone,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );
CREATE TABLE IF NOT EXISTS "public"."departments" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "name" character varying(100) not null,
    "description" text,
    "manager_id" uuid,
    "budget" numeric(15,2),
    "is_active" boolean default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."departments" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."digital_signatures" (
    "id" uuid not null default gen_random_uuid(),
    "shipment_id" uuid,
    "signature_data" text not null,
    "metadata" jsonb not null,
    "recipient_name" character varying(255) not null,
    "delivery_timestamp" timestamp with time zone default now(),
    "gps_coordinates" point,
    "gps_accuracy" numeric(10,2),
    "device_fingerprint" text,
    "verification_hash" character varying(255) not null,
    "non_repudiation_proof" jsonb,
    "created_at" timestamp with time zone default now(),
    "iso_compliance" boolean default true,
    "audit_status" character varying(50) default 'verified'::character varying
      );


alter table "public"."digital_signatures" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."driver_telemetry" (
    "id" uuid not null default gen_random_uuid(),
    "driver_id" uuid,
    "location" point not null,
    "heading" numeric(5,2),
    "speed_kmh" numeric(5,2),
    "accuracy_meters" numeric(8,2),
    "battery_level" integer,
    "network_status" character varying(50),
    "timestamp" timestamp with time zone default now(),
    "current_route_id" uuid,
    "next_stop_eta" timestamp with time zone,
    "parcels_remaining" integer default 0
      );


alter table "public"."driver_telemetry" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."employees" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "user_id" uuid,
    "employee_code" character varying(50) not null,
    "first_name" character varying(100) not null,
    "last_name" character varying(100) not null,
    "job_title" character varying(100) not null,
    "department_id" uuid,
    "salary" numeric(15,2),
    "hire_date" date not null,
    "employee_status" character varying(50) default 'ACTIVE'::character varying,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."employees" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."failed_deliveries" (
    "id" uuid not null default gen_random_uuid(),
    "tracking_number" character varying(50) not null,
    "failure_reason" character varying(100) not null,
    "failure_date" timestamp with time zone default now(),
    "retry_count" integer default 0,
    "next_retry_date" timestamp with time zone,
    "notes" text,
    "resolved" boolean default false,
    "resolved_date" timestamp with time zone,
    "created_at" timestamp with time zone default now()
      );
CREATE TABLE IF NOT EXISTS "public"."faqs_2026_02_03_21_00" (
    "id" uuid not null default gen_random_uuid(),
    "question" text not null,
    "answer" text not null,
    "category" character varying(100) default 'general'::character varying,
    "sort_order" integer default 0,
    "is_active" boolean default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."faqs_2026_02_03_21_00" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."financial_transactions" (
    "id" uuid not null default gen_random_uuid(),
    "transaction_id" text not null,
    "transaction_type" text not null,
    "reference_type" text not null,
    "reference_id" uuid not null,
    "merchant_id" uuid,
    "user_id" uuid,
    "amount" numeric(12,2) not null,
    "currency" text default 'MMK'::text,
    "payment_method" text,
    "payment_gateway" text,
    "gateway_transaction_id" text,
    "status" public.payment_status default 'pending'::public.payment_status,
    "description" text,
    "metadata" jsonb,
    "processed_at" timestamp with time zone,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."financial_transactions" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."form_submissions" (
    "id" uuid not null default gen_random_uuid(),
    "form_type" character varying(100) not null,
    "form_data" jsonb not null,
    "user_id" uuid,
    "status" character varying(20) default 'submitted'::character varying,
    "validation_errors" jsonb,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );
CREATE TABLE IF NOT EXISTS "public"."fuel_anomalies" (
    "id" uuid not null default gen_random_uuid(),
    "vehicle_id" text not null,
    "driver_id" uuid not null,
    "fuel_record_id" uuid,
    "current_efficiency" numeric(6,2) not null,
    "average_efficiency" numeric(6,2) not null,
    "efficiency_drop_percentage" numeric(5,2) not null,
    "alert_message" text not null,
    "status" text not null default 'pending_investigation'::text,
    "investigation_notes" text,
    "resolved_by" uuid,
    "resolved_at" timestamp with time zone,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."fuel_anomalies" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."group_shipments" (
    "id" uuid not null default gen_random_uuid(),
    "group_shipment_id" text not null,
    "shipment_date" date not null,
    "created_at" timestamp with time zone not null default now(),
    "driver_name" text,
    "helper_name" text,
    "rider_name" text
      );
CREATE TABLE IF NOT EXISTS "public"."invoices" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "invoice_number" character varying(50) not null,
    "customer_name" character varying(255) not null,
    "customer_email" character varying(255),
    "invoice_date" date not null,
    "due_date" date not null,
    "total_amount" numeric(15,2) not null,
    "paid_amount" numeric(15,2) default 0,
    "invoice_status" character varying(50) default 'DRAFT'::character varying,
    "created_by" uuid,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."invoices" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."marketer_performance_2026_02_04_16_00" (
    "id" uuid not null default gen_random_uuid(),
    "marketer_id" uuid,
    "month_year" date not null,
    "leads_generated" integer default 0,
    "conversions" integer default 0,
    "revenue_generated" numeric(15,2) default 0,
    "campaigns_run" integer default 0,
    "customer_acquisition_cost" numeric(10,2) default 0,
    "conversion_rate" numeric(5,2) default 0,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."marketer_performance_2026_02_04_16_00" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."marketing_campaigns" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "name" character varying(255) not null,
    "description" text,
    "campaign_type" character varying(50) not null,
    "campaign_status" character varying(50) default 'DRAFT'::character varying,
    "budget" numeric(15,2),
    "spent_amount" numeric(15,2) default 0,
    "start_date" date,
    "end_date" date,
    "created_by" uuid,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."marketing_campaigns" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."merchant_bank_accounts" (
    "id" uuid not null default gen_random_uuid(),
    "merchant_id" uuid not null,
    "bank_name" character varying(100) not null,
    "account_number" character varying(50) not null,
    "account_holder_name" character varying(100) not null,
    "account_type" character varying(50) default 'savings'::character varying,
    "branch_name" character varying(100),
    "is_primary" boolean default false,
    "status" character varying(20) default 'active'::character varying,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );
CREATE TABLE IF NOT EXISTS "public"."merchant_receipts" (
    "id" uuid not null default gen_random_uuid(),
    "merchant_id" uuid not null,
    "receipt_number" character varying(50) not null,
    "receipt_type" character varying(50) not null,
    "amount" numeric(10,2) not null,
    "currency" character varying(10) default 'MMK'::character varying,
    "payment_method" character varying(50),
    "description" text,
    "receipt_date" timestamp with time zone default now(),
    "due_date" timestamp with time zone,
    "status" character varying(20) default 'pending'::character varying,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );
CREATE TABLE IF NOT EXISTS "public"."merchants" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "merchant_code" text not null,
    "business_name" text not null,
    "business_type" text,
    "business_license" text,
    "tax_id" text,
    "contact_person" text not null,
    "phone" text not null,
    "email" text not null,
    "address" text not null,
    "city" text not null,
    "state" text not null,
    "postal_code" text,
    "bank_account_name" text,
    "bank_account_number" text,
    "bank_name" text,
    "bank_branch" text,
    "pricing_tier" text default 'standard'::text,
    "commission_rate" numeric(5,2) default 5.00,
    "credit_limit" numeric(12,2) default 0,
    "current_balance" numeric(12,2) default 0,
    "is_active" boolean default true,
    "verification_status" text default 'pending'::text,
    "verified_at" timestamp with time zone,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."merchants" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."merchants_be" (
    "id" uuid not null default gen_random_uuid(),
    "business_name" character varying(200) not null,
    "business_type" character varying(100),
    "registration_number" character varying(100),
    "contact_person" character varying(100) not null,
    "phone" character varying(20) not null,
    "email" character varying(100),
    "address" text not null,
    "city" character varying(100) not null,
    "status" character varying(20) default 'active'::character varying,
    "credit_limit" numeric(12,2) default 0,
    "current_balance" numeric(12,2) default 0,
    "payment_terms" integer default 30,
    "total_orders" integer default 0,
    "total_revenue" numeric(12,2) default 0,
    "registration_date" timestamp with time zone default now(),
    "last_order_date" timestamp with time zone,
    "notes" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );
CREATE TABLE IF NOT EXISTS "public"."mfa_tokens" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "user_id" uuid,
    "method" public.mfa_method not null,
    "token_hash" text not null,
    "phone_number" character varying(20),
    "email_address" character varying(255),
    "expires_at" timestamp with time zone not null,
    "used_at" timestamp with time zone,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."mfa_tokens" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "user_id" uuid,
    "title" character varying(255) not null,
    "message" text not null,
    "notification_type" character varying(50) default 'INFO'::character varying,
    "is_read" boolean default false,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."notifications" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."orders" (
    "id" uuid not null default gen_random_uuid(),
    "order_number" text default ('ORD-'::text || upper(SUBSTRING((gen_random_uuid())::text FROM 1 FOR 8))),
    "customer_name" text not null,
    "address" text not null,
    "city" text,
    "township" text,
    "lat" double precision,
    "lng" double precision,
    "route_sequence" integer,
    "status" text default 'pending'::text,
    "assigned_rider_id" uuid,
    "created_at" timestamp with time zone default now(),
    "pod_image_url" text,
    "latitude" double precision,
    "longitude" double precision
      );


alter table "public"."orders" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."parcels" (
    "id" uuid not null default gen_random_uuid(),
    "awb" text,
    "merchant_id" uuid,
    "status" text,
    "assigned_rider" uuid,
    "current_location" text,
    "created_at" timestamp without time zone default now(),
    "updated_at" timestamp without time zone default now()
      );


alter table "public"."parcels" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."password_changes" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "old_password_hash" character varying(255),
    "new_password_hash" character varying(255),
    "changed_at" timestamp with time zone default now(),
    "changed_by" uuid,
    "reason" character varying(255) default 'user_initiated'::character varying
      );


alter table "public"."password_changes" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."permissions" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "name" character varying(100) not null,
    "description" text,
    "resource" character varying(100) not null,
    "action" character varying(50) not null,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."permissions" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."pricing_2026_02_03_21_00" (
    "id" uuid not null default gen_random_uuid(),
    "service_type" character varying(100) not null,
    "region" character varying(100) not null,
    "destination" character varying(255) not null,
    "weight_min" numeric(10,2) default 0,
    "weight_max" numeric(10,2),
    "price_per_kg" numeric(10,2) not null,
    "currency" character varying(10) default 'MMK'::character varying,
    "is_active" boolean default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."pricing_2026_02_03_21_00" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."pricing_rules" (
    "id" uuid not null default gen_random_uuid(),
    "rule_name" text not null,
    "from_city" text not null,
    "to_city" text not null,
    "from_state" text not null,
    "to_state" text not null,
    "delivery_type" public.delivery_type not null,
    "base_price" numeric(10,2) not null,
    "price_per_kg" numeric(10,2) default 0,
    "price_per_km" numeric(10,2) default 0,
    "minimum_charge" numeric(10,2) not null,
    "maximum_charge" numeric(10,2),
    "fuel_surcharge_rate" numeric(5,2) default 0,
    "is_active" boolean default true,
    "effective_from" date not null,
    "effective_until" date,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."pricing_rules" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" uuid not null,
    "role" public.app_role not null default 'STAFF'::public.app_role,
    "position" text,
    "backup_email" text,
    "must_change_password" boolean not null default true,
    "status" text not null default 'active'::text,
    "created_at" timestamp with time zone not null default now(),
    "full_name" text,
    "email" text
      );
CREATE TABLE IF NOT EXISTS "public"."prohibited_items_2026_02_03_21_00" (
    "id" uuid not null default gen_random_uuid(),
    "item_name" character varying(255) not null,
    "description" text,
    "icon" character varying(100),
    "category" character varying(100) default 'general'::character varying,
    "is_active" boolean default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."prohibited_items_2026_02_03_21_00" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."qr_codes_2026_02_04_15_54" (
    "id" uuid not null default gen_random_uuid(),
    "qr_code" character varying(100) not null,
    "qr_type" character varying(50) not null,
    "reference_id" uuid not null,
    "reference_table" character varying(50) not null,
    "qr_data" jsonb,
    "qr_image_url" text,
    "scan_count" integer default 0,
    "last_scanned_at" timestamp with time zone,
    "last_scanned_by" uuid,
    "is_active" boolean default true,
    "expires_at" timestamp with time zone,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."qr_codes_2026_02_04_15_54" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."return_shipments" (
    "id" uuid not null default gen_random_uuid(),
    "original_tracking_number" character varying(50) not null,
    "return_reason" character varying(100) not null,
    "return_date" timestamp with time zone default now(),
    "return_status" character varying(20) default 'initiated'::character varying,
    "refund_amount" numeric(10,2),
    "refund_status" character varying(20) default 'pending'::character varying,
    "notes" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );
CREATE TABLE IF NOT EXISTS "public"."rider_locations_2026_02_04_14_23" (
    "id" uuid not null default gen_random_uuid(),
    "rider_id" uuid,
    "latitude" numeric(10,8) not null,
    "longitude" numeric(11,8) not null,
    "accuracy" numeric(8,2),
    "speed" numeric(6,2),
    "heading" numeric(6,2),
    "battery_level" integer,
    "is_online" boolean default true,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."rider_locations_2026_02_04_14_23" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."rider_notifications_2026_02_04_14_23" (
    "id" uuid not null default gen_random_uuid(),
    "rider_id" uuid,
    "title" character varying(200) not null,
    "message" text not null,
    "type" character varying(30) default 'info'::character varying,
    "is_read" boolean default false,
    "action_url" text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."rider_notifications_2026_02_04_14_23" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."rider_tasks_2026_02_04_14_23" (
    "id" uuid not null default gen_random_uuid(),
    "task_code" character varying(20) not null,
    "rider_id" uuid,
    "type" character varying(20) not null,
    "status" character varying(30) default 'pending'::character varying,
    "priority" character varying(20) default 'normal'::character varying,
    "customer_name" character varying(100) not null,
    "customer_phone" character varying(20) not null,
    "pickup_address" text,
    "delivery_address" text not null,
    "cod_amount" numeric(10,2) default 0,
    "delivery_fee" numeric(8,2) default 0,
    "sla_time" timestamp with time zone,
    "notes" text,
    "special_instructions" text,
    "is_fragile" boolean default false,
    "weight_kg" numeric(5,2),
    "dimensions" character varying(50),
    "proof_photo_url" text,
    "signature_data" text,
    "completion_notes" text,
    "assigned_at" timestamp with time zone,
    "started_at" timestamp with time zone,
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );
CREATE TABLE IF NOT EXISTS "public"."rider_transactions_2026_02_04_14_23" (
    "id" uuid not null default gen_random_uuid(),
    "rider_id" uuid,
    "task_id" uuid,
    "transaction_type" character varying(20) not null,
    "amount" numeric(10,2) not null,
    "description" text not null,
    "reference_number" character varying(50),
    "status" character varying(20) default 'completed'::character varying,
    "created_at" timestamp with time zone default now()
      );
CREATE TABLE IF NOT EXISTS "public"."riders_2026_02_04_14_23" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "rider_code" character varying(20) not null,
    "full_name" character varying(100) not null,
    "phone" character varying(20) not null,
    "email" character varying(100),
    "nrc_number" character varying(50),
    "address" text,
    "emergency_contact" character varying(20),
    "vehicle_type" character varying(50) default 'motorcycle'::character varying,
    "vehicle_number" character varying(20),
    "license_number" character varying(50),
    "zone" character varying(50) default 'downtown-a'::character varying,
    "status" character varying(20) default 'active'::character varying,
    "duty_status" character varying(20) default 'off_duty'::character varying,
    "rating" numeric(3,2) default 4.5,
    "total_deliveries" integer default 0,
    "successful_deliveries" integer default 0,
    "failed_deliveries" integer default 0,
    "cod_balance" numeric(12,2) default 0,
    "wallet_balance" numeric(12,2) default 0,
    "today_earnings" numeric(10,2) default 0,
    "profile_image_url" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );
CREATE TABLE IF NOT EXISTS "public"."role_permissions" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "role" public.user_role_type not null,
    "permission_id" uuid,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."role_permissions" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."role_routes" (
    "role" public.app_role not null,
    "home_path" text not null
      );
CREATE TABLE IF NOT EXISTS "public"."route_optimization" (
    "id" uuid not null default gen_random_uuid(),
    "driver_id" uuid,
    "optimization_date" date default CURRENT_DATE,
    "original_stops" jsonb not null,
    "optimized_stops" jsonb not null,
    "optimization_algorithm" character varying(100) default 'google_routes_api'::character varying,
    "estimated_savings" jsonb,
    "actual_performance" jsonb,
    "status" character varying(50) default 'active'::character varying,
    "created_at" timestamp with time zone default now(),
    "total_distance_km" numeric(10,2),
    "estimated_duration_minutes" integer,
    "traffic_conditions" jsonb
      );


alter table "public"."route_optimization" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."route_shipments" (
    "id" uuid not null default gen_random_uuid(),
    "route_id" uuid not null,
    "shipment_id" uuid not null,
    "sequence_order" integer not null,
    "estimated_arrival" timestamp with time zone,
    "actual_arrival" timestamp with time zone,
    "delivery_status" text default 'pending'::text,
    "delivery_notes" text
      );


alter table "public"."route_shipments" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."services_2026_02_03_21_00" (
    "id" uuid not null default gen_random_uuid(),
    "name" character varying(255) not null,
    "description" text,
    "icon" character varying(100),
    "category" character varying(100),
    "features" text[],
    "is_active" boolean default true,
    "sort_order" integer default 0,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."services_2026_02_03_21_00" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."shipment_tracking" (
    "id" uuid not null default gen_random_uuid(),
    "shipment_id" uuid not null,
    "status" public.shipment_status not null,
    "location" text,
    "coordinates" point,
    "notes" text,
    "handled_by" uuid,
    "timestamp" timestamp with time zone default now(),
    "is_customer_visible" boolean default true
      );


alter table "public"."shipment_tracking" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."shipment_tracking_enhanced" (
    "id" uuid not null default gen_random_uuid(),
    "tracking_number" character varying(50) not null,
    "package_id" character varying(50) not null,
    "sender_info" jsonb not null,
    "receiver_info" jsonb not null,
    "delivery_address" text not null,
    "current_status" character varying(50) default 'pending'::character varying,
    "route_optimization_data" jsonb,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "created_by" uuid,
    "version" integer default 1,
    "audit_trail" jsonb default '[]'::jsonb
      );


alter table "public"."shipment_tracking_enhanced" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."shipments" (
    "id" uuid not null default gen_random_uuid(),
    "way_id" text not null,
    "merchant_id" uuid not null,
    "sender_name" text not null,
    "sender_phone" text not null,
    "sender_address" text not null,
    "sender_city" text not null,
    "sender_state" text not null,
    "receiver_name" text not null,
    "receiver_phone" text not null,
    "receiver_address" text not null,
    "receiver_city" text not null,
    "receiver_state" text not null,
    "pickup_branch_id" uuid,
    "delivery_branch_id" uuid,
    "assigned_rider_id" uuid,
    "package_description" text,
    "package_weight" numeric(8,2),
    "package_dimensions" jsonb,
    "package_value" numeric(12,2),
    "delivery_type" public.delivery_type default 'standard'::public.delivery_type,
    "status" public.shipment_status default 'pending'::public.shipment_status,
    "payment_method" text default 'cod'::text,
    "payment_status" public.payment_status default 'pending'::public.payment_status,
    "delivery_fee" numeric(10,2) not null,
    "cod_amount" numeric(12,2) default 0,
    "insurance_fee" numeric(10,2) default 0,
    "total_amount" numeric(12,2) not null,
    "special_instructions" text,
    "pickup_date" date,
    "delivery_date" date,
    "estimated_delivery" timestamp with time zone,
    "actual_pickup_time" timestamp with time zone,
    "actual_delivery_time" timestamp with time zone,
    "delivery_attempts" integer default 0,
    "max_delivery_attempts" integer default 3,
    "priority_level" integer default 1,
    "is_fragile" boolean default false,
    "requires_signature" boolean default false,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "created_by" uuid
      );


alter table "public"."shipments" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."support_tickets" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "ticket_number" character varying(50) not null,
    "customer_name" character varying(255) not null,
    "customer_email" character varying(255) not null,
    "subject" character varying(500) not null,
    "description" text not null,
    "priority" character varying(20) default 'MEDIUM'::character varying,
    "ticket_status" character varying(50) default 'OPEN'::character varying,
    "assigned_to" uuid,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."support_tickets" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."system_audit_log" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "action" character varying(100) not null,
    "entity_type" character varying(100) not null,
    "entity_id" uuid,
    "old_values" jsonb,
    "new_values" jsonb,
    "ip_address" inet,
    "user_agent" text,
    "timestamp" timestamp with time zone default now(),
    "session_id" character varying(255),
    "request_id" character varying(255),
    "severity" character varying(20) default 'info'::character varying
      );


alter table "public"."system_audit_log" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."system_config_2026_02_04_16_00" (
    "id" uuid not null default gen_random_uuid(),
    "config_key" character varying(100) not null,
    "config_value" jsonb not null,
    "description" text,
    "category" character varying(50) default 'general'::character varying,
    "is_sensitive" boolean default false,
    "updated_at" timestamp with time zone default now(),
    "updated_by" uuid
      );


alter table "public"."system_config_2026_02_04_16_00" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."system_configuration" (
    "id" uuid not null default gen_random_uuid(),
    "setting_key" character varying(100) not null,
    "setting_value" text not null,
    "setting_type" character varying(50) default 'string'::character varying,
    "description" text,
    "min_value" integer,
    "max_value" integer,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );
CREATE TABLE IF NOT EXISTS "public"."system_settings" (
    "id" uuid not null default gen_random_uuid(),
    "setting_key" text not null,
    "setting_value" text not null,
    "setting_type" text not null,
    "description" text,
    "is_public" boolean default false,
    "updated_by" uuid,
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."system_settings" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."system_settings_be" (
    "id" uuid not null default gen_random_uuid(),
    "setting_category" character varying(50) not null,
    "setting_key" character varying(100) not null,
    "setting_value" text,
    "setting_type" character varying(20) default 'string'::character varying,
    "description" text,
    "is_public" boolean default false,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );
CREATE TABLE IF NOT EXISTS "public"."tariff_rates_2026_02_04_16_00" (
    "id" uuid not null default gen_random_uuid(),
    "country" character varying(100) not null,
    "country_code" character varying(3),
    "region" character varying(50) not null,
    "weight_slab_min" numeric(10,2) not null,
    "weight_slab_max" numeric(10,2) not null,
    "price_mmk" numeric(12,2) not null,
    "price_usd" numeric(12,2),
    "effective_date" date default CURRENT_DATE,
    "is_active" boolean default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "updated_by" uuid
      );


alter table "public"."tariff_rates_2026_02_04_16_00" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."user_branch_assignments" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "branch_id" uuid not null,
    "is_primary" boolean default false,
    "assigned_at" timestamp with time zone default now(),
    "assigned_by" uuid
      );


alter table "public"."user_branch_assignments" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."user_permissions" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "module" character varying(100) not null,
    "permissions" jsonb not null default '{}'::jsonb,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );
CREATE TABLE IF NOT EXISTS "public"."user_profiles" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "email" character varying(255) not null,
    "full_name" character varying(255) not null,
    "role" character varying(50) not null,
    "department" character varying(100),
    "branch_location" character varying(100),
    "phone" character varying(20),
    "employee_id" character varying(20),
    "status" character varying(20) default 'active'::character varying,
    "permissions" jsonb default '{}'::jsonb,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "password_hash" character varying(255),
    "must_change_password" boolean default true,
    "last_password_change" timestamp with time zone,
    "first_login" boolean default true,
    "last_login" timestamp with time zone,
    "branch_id" uuid
      );


alter table "public"."user_profiles" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."user_sessions" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "session_token" text not null,
    "device_info" jsonb,
    "ip_address" inet,
    "user_agent" text,
    "is_active" boolean default true,
    "expires_at" timestamp with time zone not null,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."user_sessions" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" uuid not null default gen_random_uuid(),
    "firebase_uid" text not null,
    "email" text not null,
    "full_name" text not null,
    "phone" text,
    "role" public.user_role not null default 'customer'::public.user_role,
    "status" public.user_status not null default 'pending_verification'::public.user_status,
    "avatar_url" text,
    "address" text,
    "city" text,
    "state" text,
    "postal_code" text,
    "country" text default 'Myanmar'::text,
    "language_preference" text default 'en'::text,
    "timezone" text default 'Asia/Yangon'::text,
    "last_login_at" timestamp with time zone,
    "password_changed_at" timestamp with time zone,
    "force_password_change" boolean default false,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "created_by" uuid,
    "updated_by" uuid
      );


alter table "public"."users" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."users_2026_02_12_13_00" (
    "email" text not null,
    "role" public.app_role not null,
    "full_name" text not null,
    "employee_id" text not null,
    "city" text,
    "department" text,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone not null default now()
      );
CREATE TABLE IF NOT EXISTS "public"."users_enhanced" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "auth_user_id" uuid,
    "employee_id" character varying(50),
    "email" character varying(255) not null,
    "full_name" character varying(255) not null,
    "phone" character varying(20),
    "avatar_url" text,
    "role" public.user_role_type not null,
    "authority_level" public.authority_level not null default 'L1'::public.authority_level,
    "data_scope" public.data_scope not null default 'S1'::public.data_scope,
    "department" character varying(100),
    "manager_id" uuid,
    "is_active" boolean default true,
    "last_login_at" timestamp with time zone,
    "password_changed_at" timestamp with time zone default now(),
    "failed_login_attempts" integer default 0,
    "locked_until" timestamp with time zone,
    "mfa_enabled" boolean default false,
    "mfa_secret" text,
    "backup_codes" text[],
    "session_timeout_minutes" integer default 480,
    "ip_whitelist" text[],
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."users_enhanced" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."vouchers" (
    "id" uuid not null default gen_random_uuid(),
    "voucher_number" character varying(50) not null,
    "voucher_type" character varying(50) not null,
    "amount" numeric(15,2) not null,
    "description" text,
    "reference_number" character varying(100),
    "branch_id" uuid,
    "created_by" uuid,
    "approved_by" uuid,
    "status" character varying(20) default 'pending'::character varying,
    "transaction_date" date not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );
CREATE TABLE IF NOT EXISTS "public"."warehouse_manifest_items_2026_02_04_15_54" (
    "id" uuid not null default gen_random_uuid(),
    "manifest_id" uuid,
    "parcel_id" uuid,
    "sequence_number" integer,
    "scanned_at" timestamp with time zone,
    "scanned_by" uuid,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."warehouse_manifest_items_2026_02_04_15_54" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."warehouse_manifests_2026_02_04_15_54" (
    "id" uuid not null default gen_random_uuid(),
    "manifest_number" character varying(50) not null,
    "manifest_type" character varying(20) not null,
    "origin_station_id" uuid,
    "destination_station_id" uuid,
    "route_code" character varying(20),
    "vehicle_number" character varying(20),
    "driver_name" character varying(100),
    "driver_phone" character varying(20),
    "driver_license" character varying(50),
    "status" character varying(20) default 'draft'::character varying,
    "total_parcels" integer default 0,
    "total_weight_kg" numeric(10,2) default 0,
    "total_cod_amount" numeric(12,2) default 0,
    "manifest_qr_code" character varying(100),
    "created_at" timestamp with time zone default now(),
    "finalized_at" timestamp with time zone,
    "dispatched_at" timestamp with time zone,
    "arrived_at" timestamp with time zone,
    "completed_at" timestamp with time zone,
    "created_by" uuid
      );


alter table "public"."warehouse_manifests_2026_02_04_15_54" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."warehouse_operations_2026_02_04_15_54" (
    "id" uuid not null default gen_random_uuid(),
    "operation_type" character varying(50) not null,
    "parcel_id" uuid,
    "station_id" uuid,
    "user_id" uuid,
    "qr_code_scanned" character varying(100),
    "scan_method" character varying(20),
    "scan_location" character varying(100),
    "from_status" character varying(50),
    "to_status" character varying(50),
    "from_location" character varying(100),
    "to_location" character varying(100),
    "sort_bin" character varying(10),
    "route_code" character varying(20),
    "notes" text,
    "photo_url" text,
    "signature_url" text,
    "created_at" timestamp with time zone default now(),
    "device_info" jsonb,
    "gps_location" jsonb
      );


alter table "public"."warehouse_operations_2026_02_04_15_54" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."warehouse_parcels_2026_02_04_15_54" (
    "id" uuid not null default gen_random_uuid(),
    "tracking_number" character varying(50) not null,
    "qr_code" character varying(100) not null,
    "barcode" character varying(100),
    "sender_name" character varying(100) not null,
    "sender_phone" character varying(20),
    "sender_address" text,
    "receiver_name" character varying(100) not null,
    "receiver_phone" character varying(20),
    "receiver_address" text,
    "weight_kg" numeric(10,2),
    "dimensions" character varying(50),
    "package_type" character varying(50),
    "service_type" character varying(50),
    "cod_amount" numeric(12,2) default 0,
    "declared_value" numeric(12,2) default 0,
    "status" character varying(50) not null default 'created'::character varying,
    "current_station_id" uuid,
    "sort_bin" character varying(10),
    "route_code" character varying(20),
    "manifest_id" uuid,
    "special_instructions" text,
    "is_fragile" boolean default false,
    "requires_signature" boolean default false,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "expected_delivery_date" date,
    "customer_signature_url" text,
    "delivery_photo_url" text,
    "delivery_notes" text
      );


alter table "public"."warehouse_parcels_2026_02_04_15_54" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."warehouse_stations_2026_02_04_15_54" (
    "id" uuid not null default gen_random_uuid(),
    "station_code" character varying(20) not null,
    "station_name" character varying(100) not null,
    "station_name_my" character varying(100),
    "address" text,
    "phone" character varying(20),
    "manager_name" character varying(100),
    "capacity" integer default 1000,
    "zone" character varying(50),
    "is_active" boolean default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."warehouse_stations_2026_02_04_15_54" enable row level security;
CREATE TABLE IF NOT EXISTS "public"."warehouse_users_2026_02_04_15_54" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "employee_code" character varying(20) not null,
    "full_name" character varying(100) not null,
    "full_name_my" character varying(100),
    "phone" character varying(20),
    "email" character varying(100),
    "role" character varying(50) not null,
    "station_id" uuid,
    "shift" character varying(20),
    "is_active" boolean default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."warehouse_users_2026_02_04_15_54" enable row level security;

drop type "public"."user_role__old_version_to_be_dropped";
CREATE UNIQUE INDEX IF NOT EXISTS admin_users_2026_02_04_16_00_email_key ON public.admin_users_2026_02_04_16_00 USING btree (email);
CREATE UNIQUE INDEX IF NOT EXISTS admin_users_2026_02_04_16_00_pkey ON public.admin_users_2026_02_04_16_00 USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS audit_logs_pkey ON public.audit_logs USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS automated_reports_pkey ON public.automated_reports USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS branches_code_key ON public.branches USING btree (code);
CREATE UNIQUE INDEX IF NOT EXISTS branches_pkey ON public.branches USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS broadcast_messages_pkey ON public.broadcast_messages USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bulk_upload_items_2026_02_04_16_00_pkey ON public.bulk_upload_items_2026_02_04_16_00 USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bulk_uploads_2026_02_04_16_00_pkey ON public.bulk_uploads_2026_02_04_16_00 USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS cash_advances_pkey ON public.cash_advances USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS content_pages_2026_02_03_21_00_page_key_key ON public.content_pages_2026_02_03_21_00 USING btree (page_key);
CREATE UNIQUE INDEX IF NOT EXISTS content_pages_2026_02_03_21_00_pkey ON public.content_pages_2026_02_03_21_00 USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS customer_acknowledgments_2026_02_04_15_54_pkey ON public.customer_acknowledgments_2026_02_04_15_54 USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS customer_service_interactions_2026_02_04_16_00_pkey ON public.customer_service_interactions_2026_02_04_16_00 USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS customers_customer_code_key ON public.customers USING btree (customer_code);
CREATE UNIQUE INDEX IF NOT EXISTS customers_pkey ON public.customers USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS deliveries_pkey ON public.deliveries USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS delivery_routes_pkey ON public.delivery_routes USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS delivery_ways_pkey ON public.delivery_ways USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS delivery_ways_tracking_number_key ON public.delivery_ways USING btree (tracking_number);
CREATE UNIQUE INDEX IF NOT EXISTS deliverymen_be_employee_id_key ON public.deliverymen_be USING btree (employee_id);
CREATE UNIQUE INDEX IF NOT EXISTS deliverymen_be_pkey ON public.deliverymen_be USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS departments_name_key ON public.departments USING btree (name);
CREATE UNIQUE INDEX IF NOT EXISTS departments_pkey ON public.departments USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS digital_signatures_pkey ON public.digital_signatures USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS driver_telemetry_pkey ON public.driver_telemetry USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS employees_employee_code_key ON public.employees USING btree (employee_code);
CREATE UNIQUE INDEX IF NOT EXISTS employees_pkey ON public.employees USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS failed_deliveries_pkey ON public.failed_deliveries USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS faqs_2026_02_03_21_00_pkey ON public.faqs_2026_02_03_21_00 USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS financial_transactions_pkey ON public.financial_transactions USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS financial_transactions_transaction_id_key ON public.financial_transactions USING btree (transaction_id);
CREATE UNIQUE INDEX IF NOT EXISTS form_submissions_pkey ON public.form_submissions USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS fuel_anomalies_pkey ON public.fuel_anomalies USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS group_shipments_group_shipment_id_key ON public.group_shipments USING btree (group_shipment_id);
CREATE UNIQUE INDEX IF NOT EXISTS group_shipments_pkey ON public.group_shipments USING btree (id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users_2026_02_04_16_00 USING btree (email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON public.admin_users_2026_02_04_16_00 USING btree (role);
CREATE INDEX IF NOT EXISTS idx_admin_users_status ON public.admin_users_2026_02_04_16_00 USING btree (status);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_time ON public.system_audit_log USING btree (user_id, "timestamp");
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs USING btree (created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_automated_reports_status ON public.automated_reports USING btree (generation_status);
CREATE INDEX IF NOT EXISTS idx_branches_code ON public.branches USING btree (code);
CREATE INDEX IF NOT EXISTS idx_broadcast_messages_status ON public.broadcast_messages USING btree (status);
CREATE INDEX IF NOT EXISTS idx_bulk_uploads_status ON public.bulk_uploads_2026_02_04_16_00 USING btree (status);
CREATE INDEX IF NOT EXISTS idx_content_pages_key ON public.content_pages_2026_02_03_21_00 USING btree (page_key);
CREATE INDEX IF NOT EXISTS idx_cs_interactions_agent ON public.customer_service_interactions_2026_02_04_16_00 USING btree (agent_id);
CREATE INDEX IF NOT EXISTS idx_cs_interactions_status ON public.customer_service_interactions_2026_02_04_16_00 USING btree (status);
CREATE INDEX IF NOT EXISTS idx_customers_customer_code ON public.customers USING btree (customer_code);
CREATE INDEX IF NOT EXISTS idx_deliveries_group ON public.deliveries USING btree (group_shipment_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_rider ON public.deliveries USING btree (rider_name);
CREATE INDEX IF NOT EXISTS idx_deliveries_status ON public.deliveries USING btree (delivery_status);
CREATE INDEX IF NOT EXISTS idx_delivery_routes_date ON public.delivery_routes USING btree (route_date);
CREATE INDEX IF NOT EXISTS idx_delivery_routes_rider_id ON public.delivery_routes USING btree (rider_id);
CREATE INDEX IF NOT EXISTS idx_delivery_ways_status ON public.delivery_ways USING btree (status);
CREATE INDEX IF NOT EXISTS idx_delivery_ways_tracking ON public.delivery_ways USING btree (tracking_number);
CREATE INDEX IF NOT EXISTS idx_deliverymen_be_status ON public.deliverymen_be USING btree (employment_status);
CREATE INDEX IF NOT EXISTS idx_digital_signatures_gps ON public.digital_signatures USING gist (gps_coordinates);
CREATE INDEX IF NOT EXISTS idx_digital_signatures_shipment ON public.digital_signatures USING btree (shipment_id);
CREATE INDEX IF NOT EXISTS idx_digital_signatures_timestamp ON public.digital_signatures USING btree (delivery_timestamp);
CREATE INDEX IF NOT EXISTS idx_driver_telemetry_driver_time ON public.driver_telemetry USING btree (driver_id, "timestamp");
CREATE INDEX IF NOT EXISTS idx_driver_telemetry_location ON public.driver_telemetry USING gist (location);
CREATE INDEX IF NOT EXISTS idx_faqs_category ON public.faqs_2026_02_03_21_00 USING btree (category, sort_order);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_merchant ON public.financial_transactions USING btree (merchant_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_reference ON public.financial_transactions USING btree (reference_type, reference_id);
CREATE INDEX IF NOT EXISTS idx_fuel_anomalies_created_at ON public.fuel_anomalies USING btree (created_at);
CREATE INDEX IF NOT EXISTS idx_fuel_anomalies_driver ON public.fuel_anomalies USING btree (driver_id);
CREATE INDEX IF NOT EXISTS idx_fuel_anomalies_status ON public.fuel_anomalies USING btree (status);
CREATE INDEX IF NOT EXISTS idx_fuel_anomalies_vehicle ON public.fuel_anomalies USING btree (vehicle_id);
CREATE INDEX IF NOT EXISTS idx_marketer_performance_date ON public.marketer_performance_2026_02_04_16_00 USING btree (month_year);
CREATE INDEX IF NOT EXISTS idx_merchants_be_status ON public.merchants_be USING btree (status);
CREATE INDEX IF NOT EXISTS idx_merchants_merchant_code ON public.merchants USING btree (merchant_code);
CREATE INDEX IF NOT EXISTS idx_merchants_user_id ON public.merchants USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_mfa_tokens_user_id ON public.mfa_tokens USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_password_changes_user_id ON public.password_changes USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_pricing_service_region ON public.pricing_2026_02_03_21_00 USING btree (service_type, region);
CREATE INDEX IF NOT EXISTS idx_qr_codes_code ON public.qr_codes_2026_02_04_15_54 USING btree (qr_code);
CREATE INDEX IF NOT EXISTS idx_qr_codes_reference ON public.qr_codes_2026_02_04_15_54 USING btree (reference_id, reference_table);
CREATE INDEX IF NOT EXISTS idx_rider_locations_rider_id ON public.rider_locations_2026_02_04_14_23 USING btree (rider_id);
CREATE INDEX IF NOT EXISTS idx_rider_notifications_rider_id ON public.rider_notifications_2026_02_04_14_23 USING btree (rider_id);
CREATE INDEX IF NOT EXISTS idx_rider_tasks_rider_id ON public.rider_tasks_2026_02_04_14_23 USING btree (rider_id);
CREATE INDEX IF NOT EXISTS idx_rider_tasks_status ON public.rider_tasks_2026_02_04_14_23 USING btree (status);
CREATE INDEX IF NOT EXISTS idx_rider_tasks_type ON public.rider_tasks_2026_02_04_14_23 USING btree (type);
CREATE INDEX IF NOT EXISTS idx_rider_transactions_rider_id ON public.rider_transactions_2026_02_04_14_23 USING btree (rider_id);
CREATE INDEX IF NOT EXISTS idx_riders_rider_code ON public.riders_2026_02_04_14_23 USING btree (rider_code);
CREATE INDEX IF NOT EXISTS idx_riders_status ON public.riders_2026_02_04_14_23 USING btree (status);
CREATE INDEX IF NOT EXISTS idx_riders_user_id ON public.riders_2026_02_04_14_23 USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_route_optimization_driver ON public.route_optimization USING btree (driver_id, optimization_date);
CREATE INDEX IF NOT EXISTS idx_services_category ON public.services_2026_02_03_21_00 USING btree (category, sort_order);
CREATE INDEX IF NOT EXISTS idx_shipment_tracking_created ON public.shipment_tracking_enhanced USING btree (created_at);
CREATE INDEX IF NOT EXISTS idx_shipment_tracking_shipment_id ON public.shipment_tracking USING btree (shipment_id);
CREATE INDEX IF NOT EXISTS idx_shipment_tracking_status ON public.shipment_tracking_enhanced USING btree (current_status);
CREATE INDEX IF NOT EXISTS idx_shipment_tracking_timestamp ON public.shipment_tracking USING btree ("timestamp");
-- COMPAT: ensure shipments columns exist
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "id" uuid;
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "way_id" text;
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "merchant_id" uuid;
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "sender_name" text;
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "sender_phone" text;
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "sender_address" text;
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "sender_city" text;
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "sender_state" text;
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "receiver_name" text;
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "receiver_phone" text;
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "receiver_address" text;
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "receiver_city" text;
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "receiver_state" text;
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "pickup_branch_id" uuid;
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "delivery_branch_id" uuid;
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "assigned_rider_id" uuid;
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "package_description" text;
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "package_weight" numeric(8,2);
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "package_dimensions" jsonb;
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "package_value" numeric(12,2);
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "delivery_type" public.delivery_type;
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "status" public.shipment_status;
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "payment_method" text;
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "payment_status" public.payment_status;
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "delivery_fee" numeric(10,2);
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "cod_amount" numeric(12,2);
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "insurance_fee" numeric(10,2);
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "total_amount" numeric(12,2);
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "special_instructions" text;
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "pickup_date" date;
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "delivery_date" date;
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "estimated_delivery" timestamp with time zone;
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "actual_pickup_time" timestamp with time zone;
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "actual_delivery_time" timestamp with time zone;
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "delivery_attempts" integer;
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "max_delivery_attempts" integer;
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "priority_level" integer;
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "is_fragile" boolean;
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "requires_signature" boolean;
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "created_at" timestamp with time zone;
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "updated_at" timestamp with time zone;
ALTER TABLE IF EXISTS public.shipments ADD COLUMN IF NOT EXISTS "created_by" uuid;

CREATE INDEX IF NOT EXISTS idx_shipments_assigned_rider ON public.shipments USING btree (assigned_rider_id);
CREATE INDEX IF NOT EXISTS idx_shipments_delivery_date ON public.shipments USING btree (delivery_date);
CREATE INDEX IF NOT EXISTS idx_shipments_merchant_id ON public.shipments USING btree (merchant_id);
CREATE INDEX IF NOT EXISTS idx_shipments_pickup_date ON public.shipments USING btree (pickup_date);
CREATE INDEX IF NOT EXISTS idx_shipments_way_id ON public.shipments USING btree (way_id);
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON public.system_settings USING btree (setting_key);
CREATE INDEX IF NOT EXISTS idx_tariff_rates_country ON public.tariff_rates_2026_02_04_16_00 USING btree (country);
CREATE INDEX IF NOT EXISTS idx_user_branch_assignments_user_id ON public.user_branch_assignments USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_branch ON public.user_profiles USING btree (branch_location);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles USING btree (email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_employee_id ON public.user_profiles USING btree (employee_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_first_login ON public.user_profiles USING btree (first_login);
CREATE INDEX IF NOT EXISTS idx_user_profiles_password_change ON public.user_profiles USING btree (must_change_password);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles USING btree (role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON public.user_profiles USING btree (status);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON public.user_sessions USING btree (is_active);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON public.user_sessions USING btree (session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_users_enhanced_auth_user_id ON public.users_enhanced USING btree (auth_user_id);
CREATE INDEX IF NOT EXISTS idx_users_enhanced_email ON public.users_enhanced USING btree (email);
CREATE INDEX IF NOT EXISTS idx_users_enhanced_role ON public.users_enhanced USING btree (role);
CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON public.users USING btree (firebase_uid);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users USING btree (status);
CREATE INDEX IF NOT EXISTS idx_warehouse_operations_created ON public.warehouse_operations_2026_02_04_15_54 USING btree (created_at);
CREATE INDEX IF NOT EXISTS idx_warehouse_operations_parcel ON public.warehouse_operations_2026_02_04_15_54 USING btree (parcel_id);
CREATE INDEX IF NOT EXISTS idx_warehouse_operations_type ON public.warehouse_operations_2026_02_04_15_54 USING btree (operation_type);
CREATE INDEX IF NOT EXISTS idx_warehouse_parcels_qr ON public.warehouse_parcels_2026_02_04_15_54 USING btree (qr_code);
CREATE INDEX IF NOT EXISTS idx_warehouse_parcels_station ON public.warehouse_parcels_2026_02_04_15_54 USING btree (current_station_id);
CREATE INDEX IF NOT EXISTS idx_warehouse_parcels_status ON public.warehouse_parcels_2026_02_04_15_54 USING btree (status);
CREATE INDEX IF NOT EXISTS idx_warehouse_parcels_tracking ON public.warehouse_parcels_2026_02_04_15_54 USING btree (tracking_number);
CREATE UNIQUE INDEX IF NOT EXISTS invoices_invoice_number_key ON public.invoices USING btree (invoice_number);
CREATE UNIQUE INDEX IF NOT EXISTS invoices_pkey ON public.invoices USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS marketer_performance_2026_02_04_16_00_pkey ON public.marketer_performance_2026_02_04_16_00 USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS marketer_performance_2026_02_04_16_0_marketer_id_month_year_key ON public.marketer_performance_2026_02_04_16_00 USING btree (marketer_id, month_year);
CREATE UNIQUE INDEX IF NOT EXISTS marketing_campaigns_pkey ON public.marketing_campaigns USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS merchant_bank_accounts_pkey ON public.merchant_bank_accounts USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS merchant_receipts_pkey ON public.merchant_receipts USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS merchant_receipts_receipt_number_key ON public.merchant_receipts USING btree (receipt_number);
CREATE UNIQUE INDEX IF NOT EXISTS merchants_be_pkey ON public.merchants_be USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS merchants_merchant_code_key ON public.merchants USING btree (merchant_code);
CREATE UNIQUE INDEX IF NOT EXISTS merchants_pkey ON public.merchants USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS mfa_tokens_pkey ON public.mfa_tokens USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS notifications_pkey ON public.notifications USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS orders_order_number_key ON public.orders USING btree (order_number);
CREATE UNIQUE INDEX IF NOT EXISTS orders_pkey ON public.orders USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS parcels_awb_key ON public.parcels USING btree (awb);
CREATE UNIQUE INDEX IF NOT EXISTS parcels_pkey ON public.parcels USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS password_changes_pkey ON public.password_changes USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS permissions_name_key ON public.permissions USING btree (name);
CREATE UNIQUE INDEX IF NOT EXISTS permissions_pkey ON public.permissions USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS pricing_2026_02_03_21_00_pkey ON public.pricing_2026_02_03_21_00 USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS pricing_rules_pkey ON public.pricing_rules USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS profiles_email_unique ON public.profiles USING btree (email);
CREATE UNIQUE INDEX IF NOT EXISTS profiles_pkey ON public.profiles USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS prohibited_items_2026_02_03_21_00_pkey ON public.prohibited_items_2026_02_03_21_00 USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS qr_codes_2026_02_04_15_54_pkey ON public.qr_codes_2026_02_04_15_54 USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS qr_codes_2026_02_04_15_54_qr_code_key ON public.qr_codes_2026_02_04_15_54 USING btree (qr_code);
CREATE UNIQUE INDEX IF NOT EXISTS return_shipments_pkey ON public.return_shipments USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS rider_locations_2026_02_04_14_23_pkey ON public.rider_locations_2026_02_04_14_23 USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS rider_notifications_2026_02_04_14_23_pkey ON public.rider_notifications_2026_02_04_14_23 USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS rider_tasks_2026_02_04_14_23_pkey ON public.rider_tasks_2026_02_04_14_23 USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS rider_tasks_2026_02_04_14_23_task_code_key ON public.rider_tasks_2026_02_04_14_23 USING btree (task_code);
CREATE UNIQUE INDEX IF NOT EXISTS rider_transactions_2026_02_04_14_23_pkey ON public.rider_transactions_2026_02_04_14_23 USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS riders_2026_02_04_14_23_pkey ON public.riders_2026_02_04_14_23 USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS riders_2026_02_04_14_23_rider_code_key ON public.riders_2026_02_04_14_23 USING btree (rider_code);
CREATE UNIQUE INDEX IF NOT EXISTS role_permissions_pkey ON public.role_permissions USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS role_permissions_role_permission_id_key ON public.role_permissions USING btree (role, permission_id);
CREATE UNIQUE INDEX IF NOT EXISTS role_routes_pkey ON public.role_routes USING btree (role);
CREATE UNIQUE INDEX IF NOT EXISTS route_optimization_pkey ON public.route_optimization USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS route_shipments_pkey ON public.route_shipments USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS route_shipments_route_id_shipment_id_key ON public.route_shipments USING btree (route_id, shipment_id);
CREATE UNIQUE INDEX IF NOT EXISTS services_2026_02_03_21_00_pkey ON public.services_2026_02_03_21_00 USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS shipment_tracking_enhanced_pkey ON public.shipment_tracking_enhanced USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS shipment_tracking_enhanced_tracking_number_key ON public.shipment_tracking_enhanced USING btree (tracking_number);
CREATE UNIQUE INDEX IF NOT EXISTS shipment_tracking_pkey ON public.shipment_tracking USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS shipments_pkey ON public.shipments USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS shipments_way_id_key ON public.shipments USING btree (way_id);
CREATE UNIQUE INDEX IF NOT EXISTS support_tickets_pkey ON public.support_tickets USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS support_tickets_ticket_number_key ON public.support_tickets USING btree (ticket_number);
CREATE UNIQUE INDEX IF NOT EXISTS system_audit_log_pkey ON public.system_audit_log USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS system_config_2026_02_04_16_00_config_key_key ON public.system_config_2026_02_04_16_00 USING btree (config_key);
CREATE UNIQUE INDEX IF NOT EXISTS system_config_2026_02_04_16_00_pkey ON public.system_config_2026_02_04_16_00 USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS system_configuration_pkey ON public.system_configuration USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS system_configuration_setting_key_key ON public.system_configuration USING btree (setting_key);
CREATE UNIQUE INDEX IF NOT EXISTS system_settings_be_pkey ON public.system_settings_be USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS system_settings_be_setting_category_setting_key_key ON public.system_settings_be USING btree (setting_category, setting_key);
CREATE UNIQUE INDEX IF NOT EXISTS system_settings_pkey ON public.system_settings USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS system_settings_setting_key_key ON public.system_settings USING btree (setting_key);
CREATE UNIQUE INDEX IF NOT EXISTS tariff_rates_2026_02_04_16_00_pkey ON public.tariff_rates_2026_02_04_16_00 USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS user_branch_assignments_pkey ON public.user_branch_assignments USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS user_branch_assignments_user_id_branch_id_key ON public.user_branch_assignments USING btree (user_id, branch_id);
CREATE UNIQUE INDEX IF NOT EXISTS user_permissions_pkey ON public.user_permissions USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS user_profiles_email_key ON public.user_profiles USING btree (email);
CREATE UNIQUE INDEX IF NOT EXISTS user_profiles_employee_id_key ON public.user_profiles USING btree (employee_id);
CREATE UNIQUE INDEX IF NOT EXISTS user_profiles_pkey ON public.user_profiles USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS user_sessions_pkey ON public.user_sessions USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS users_2026_02_12_13_00_employee_id_key ON public.users_2026_02_12_13_00 USING btree (employee_id);
CREATE UNIQUE INDEX IF NOT EXISTS users_2026_02_12_13_00_pkey ON public.users_2026_02_12_13_00 USING btree (email);
CREATE INDEX IF NOT EXISTS users_2026_city_idx ON public.users_2026_02_12_13_00 USING btree (city);
CREATE INDEX IF NOT EXISTS users_2026_role_idx ON public.users_2026_02_12_13_00 USING btree (role);
CREATE UNIQUE INDEX IF NOT EXISTS users_email_key ON public.users USING btree (email);
CREATE UNIQUE INDEX IF NOT EXISTS users_enhanced_email_key ON public.users_enhanced USING btree (email);
CREATE UNIQUE INDEX IF NOT EXISTS users_enhanced_employee_id_key ON public.users_enhanced USING btree (employee_id);
CREATE UNIQUE INDEX IF NOT EXISTS users_enhanced_pkey ON public.users_enhanced USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS users_firebase_uid_key ON public.users USING btree (firebase_uid);
CREATE UNIQUE INDEX IF NOT EXISTS users_pkey ON public.users USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS vouchers_pkey ON public.vouchers USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS vouchers_voucher_number_key ON public.vouchers USING btree (voucher_number);
CREATE UNIQUE INDEX IF NOT EXISTS warehouse_manifest_items_2026_02_04_15_54_pkey ON public.warehouse_manifest_items_2026_02_04_15_54 USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS warehouse_manifests_2026_02_04_15_54_manifest_number_key ON public.warehouse_manifests_2026_02_04_15_54 USING btree (manifest_number);
CREATE UNIQUE INDEX IF NOT EXISTS warehouse_manifests_2026_02_04_15_54_manifest_qr_code_key ON public.warehouse_manifests_2026_02_04_15_54 USING btree (manifest_qr_code);
CREATE UNIQUE INDEX IF NOT EXISTS warehouse_manifests_2026_02_04_15_54_pkey ON public.warehouse_manifests_2026_02_04_15_54 USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS warehouse_operations_2026_02_04_15_54_pkey ON public.warehouse_operations_2026_02_04_15_54 USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS warehouse_parcels_2026_02_04_15_54_pkey ON public.warehouse_parcels_2026_02_04_15_54 USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS warehouse_parcels_2026_02_04_15_54_qr_code_key ON public.warehouse_parcels_2026_02_04_15_54 USING btree (qr_code);
CREATE UNIQUE INDEX IF NOT EXISTS warehouse_parcels_2026_02_04_15_54_tracking_number_key ON public.warehouse_parcels_2026_02_04_15_54 USING btree (tracking_number);
CREATE UNIQUE INDEX IF NOT EXISTS warehouse_stations_2026_02_04_15_54_pkey ON public.warehouse_stations_2026_02_04_15_54 USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS warehouse_stations_2026_02_04_15_54_station_code_key ON public.warehouse_stations_2026_02_04_15_54 USING btree (station_code);
CREATE UNIQUE INDEX IF NOT EXISTS warehouse_users_2026_02_04_15_54_employee_code_key ON public.warehouse_users_2026_02_04_15_54 USING btree (employee_code);
CREATE UNIQUE INDEX IF NOT EXISTS warehouse_users_2026_02_04_15_54_pkey ON public.warehouse_users_2026_02_04_15_54 USING btree (id);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON public.shipments USING btree (status);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users USING btree (email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users USING btree (role);

alter table "public"."admin_users_2026_02_04_16_00" add constraint "admin_users_2026_02_04_16_00_pkey" PRIMARY KEY using index "admin_users_2026_02_04_16_00_pkey";

alter table "public"."audit_logs" add constraint "audit_logs_pkey" PRIMARY KEY using index "audit_logs_pkey";

alter table "public"."automated_reports" add constraint "automated_reports_pkey" PRIMARY KEY using index "automated_reports_pkey";

alter table "public"."branches" add constraint "branches_pkey" PRIMARY KEY using index "branches_pkey";

alter table "public"."broadcast_messages" add constraint "broadcast_messages_pkey" PRIMARY KEY using index "broadcast_messages_pkey";

alter table "public"."bulk_upload_items_2026_02_04_16_00" add constraint "bulk_upload_items_2026_02_04_16_00_pkey" PRIMARY KEY using index "bulk_upload_items_2026_02_04_16_00_pkey";

alter table "public"."bulk_uploads_2026_02_04_16_00" add constraint "bulk_uploads_2026_02_04_16_00_pkey" PRIMARY KEY using index "bulk_uploads_2026_02_04_16_00_pkey";

alter table "public"."cash_advances" add constraint "cash_advances_pkey" PRIMARY KEY using index "cash_advances_pkey";

alter table "public"."content_pages_2026_02_03_21_00" add constraint "content_pages_2026_02_03_21_00_pkey" PRIMARY KEY using index "content_pages_2026_02_03_21_00_pkey";

alter table "public"."customer_acknowledgments_2026_02_04_15_54" add constraint "customer_acknowledgments_2026_02_04_15_54_pkey" PRIMARY KEY using index "customer_acknowledgments_2026_02_04_15_54_pkey";

alter table "public"."customer_service_interactions_2026_02_04_16_00" add constraint "customer_service_interactions_2026_02_04_16_00_pkey" PRIMARY KEY using index "customer_service_interactions_2026_02_04_16_00_pkey";

alter table "public"."customers" add constraint "customers_pkey" PRIMARY KEY using index "customers_pkey";

alter table "public"."deliveries" add constraint "deliveries_pkey" PRIMARY KEY using index "deliveries_pkey";

alter table "public"."delivery_routes" add constraint "delivery_routes_pkey" PRIMARY KEY using index "delivery_routes_pkey";

alter table "public"."delivery_ways" add constraint "delivery_ways_pkey" PRIMARY KEY using index "delivery_ways_pkey";

alter table "public"."deliverymen_be" add constraint "deliverymen_be_pkey" PRIMARY KEY using index "deliverymen_be_pkey";

alter table "public"."departments" add constraint "departments_pkey" PRIMARY KEY using index "departments_pkey";

alter table "public"."digital_signatures" add constraint "digital_signatures_pkey" PRIMARY KEY using index "digital_signatures_pkey";

alter table "public"."driver_telemetry" add constraint "driver_telemetry_pkey" PRIMARY KEY using index "driver_telemetry_pkey";

alter table "public"."employees" add constraint "employees_pkey" PRIMARY KEY using index "employees_pkey";

alter table "public"."failed_deliveries" add constraint "failed_deliveries_pkey" PRIMARY KEY using index "failed_deliveries_pkey";

alter table "public"."faqs_2026_02_03_21_00" add constraint "faqs_2026_02_03_21_00_pkey" PRIMARY KEY using index "faqs_2026_02_03_21_00_pkey";

alter table "public"."financial_transactions" add constraint "financial_transactions_pkey" PRIMARY KEY using index "financial_transactions_pkey";

alter table "public"."form_submissions" add constraint "form_submissions_pkey" PRIMARY KEY using index "form_submissions_pkey";

alter table "public"."fuel_anomalies" add constraint "fuel_anomalies_pkey" PRIMARY KEY using index "fuel_anomalies_pkey";

alter table "public"."group_shipments" add constraint "group_shipments_pkey" PRIMARY KEY using index "group_shipments_pkey";

alter table "public"."invoices" add constraint "invoices_pkey" PRIMARY KEY using index "invoices_pkey";

alter table "public"."marketer_performance_2026_02_04_16_00" add constraint "marketer_performance_2026_02_04_16_00_pkey" PRIMARY KEY using index "marketer_performance_2026_02_04_16_00_pkey";

alter table "public"."marketing_campaigns" add constraint "marketing_campaigns_pkey" PRIMARY KEY using index "marketing_campaigns_pkey";

alter table "public"."merchant_bank_accounts" add constraint "merchant_bank_accounts_pkey" PRIMARY KEY using index "merchant_bank_accounts_pkey";

alter table "public"."merchant_receipts" add constraint "merchant_receipts_pkey" PRIMARY KEY using index "merchant_receipts_pkey";

alter table "public"."merchants" add constraint "merchants_pkey" PRIMARY KEY using index "merchants_pkey";

alter table "public"."merchants_be" add constraint "merchants_be_pkey" PRIMARY KEY using index "merchants_be_pkey";

alter table "public"."mfa_tokens" add constraint "mfa_tokens_pkey" PRIMARY KEY using index "mfa_tokens_pkey";

alter table "public"."notifications" add constraint "notifications_pkey" PRIMARY KEY using index "notifications_pkey";

alter table "public"."orders" add constraint "orders_pkey" PRIMARY KEY using index "orders_pkey";

alter table "public"."parcels" add constraint "parcels_pkey" PRIMARY KEY using index "parcels_pkey";

alter table "public"."password_changes" add constraint "password_changes_pkey" PRIMARY KEY using index "password_changes_pkey";

alter table "public"."permissions" add constraint "permissions_pkey" PRIMARY KEY using index "permissions_pkey";

alter table "public"."pricing_2026_02_03_21_00" add constraint "pricing_2026_02_03_21_00_pkey" PRIMARY KEY using index "pricing_2026_02_03_21_00_pkey";

alter table "public"."pricing_rules" add constraint "pricing_rules_pkey" PRIMARY KEY using index "pricing_rules_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."prohibited_items_2026_02_03_21_00" add constraint "prohibited_items_2026_02_03_21_00_pkey" PRIMARY KEY using index "prohibited_items_2026_02_03_21_00_pkey";

alter table "public"."qr_codes_2026_02_04_15_54" add constraint "qr_codes_2026_02_04_15_54_pkey" PRIMARY KEY using index "qr_codes_2026_02_04_15_54_pkey";

alter table "public"."return_shipments" add constraint "return_shipments_pkey" PRIMARY KEY using index "return_shipments_pkey";

alter table "public"."rider_locations_2026_02_04_14_23" add constraint "rider_locations_2026_02_04_14_23_pkey" PRIMARY KEY using index "rider_locations_2026_02_04_14_23_pkey";

alter table "public"."rider_notifications_2026_02_04_14_23" add constraint "rider_notifications_2026_02_04_14_23_pkey" PRIMARY KEY using index "rider_notifications_2026_02_04_14_23_pkey";

alter table "public"."rider_tasks_2026_02_04_14_23" add constraint "rider_tasks_2026_02_04_14_23_pkey" PRIMARY KEY using index "rider_tasks_2026_02_04_14_23_pkey";

alter table "public"."rider_transactions_2026_02_04_14_23" add constraint "rider_transactions_2026_02_04_14_23_pkey" PRIMARY KEY using index "rider_transactions_2026_02_04_14_23_pkey";

alter table "public"."riders_2026_02_04_14_23" add constraint "riders_2026_02_04_14_23_pkey" PRIMARY KEY using index "riders_2026_02_04_14_23_pkey";

alter table "public"."role_permissions" add constraint "role_permissions_pkey" PRIMARY KEY using index "role_permissions_pkey";

alter table "public"."role_routes" add constraint "role_routes_pkey" PRIMARY KEY using index "role_routes_pkey";

alter table "public"."route_optimization" add constraint "route_optimization_pkey" PRIMARY KEY using index "route_optimization_pkey";

alter table "public"."route_shipments" add constraint "route_shipments_pkey" PRIMARY KEY using index "route_shipments_pkey";

alter table "public"."services_2026_02_03_21_00" add constraint "services_2026_02_03_21_00_pkey" PRIMARY KEY using index "services_2026_02_03_21_00_pkey";

alter table "public"."shipment_tracking" add constraint "shipment_tracking_pkey" PRIMARY KEY using index "shipment_tracking_pkey";

alter table "public"."shipment_tracking_enhanced" add constraint "shipment_tracking_enhanced_pkey" PRIMARY KEY using index "shipment_tracking_enhanced_pkey";

alter table "public"."shipments" add constraint "shipments_pkey" PRIMARY KEY using index "shipments_pkey";

alter table "public"."support_tickets" add constraint "support_tickets_pkey" PRIMARY KEY using index "support_tickets_pkey";

alter table "public"."system_audit_log" add constraint "system_audit_log_pkey" PRIMARY KEY using index "system_audit_log_pkey";

alter table "public"."system_config_2026_02_04_16_00" add constraint "system_config_2026_02_04_16_00_pkey" PRIMARY KEY using index "system_config_2026_02_04_16_00_pkey";

alter table "public"."system_configuration" add constraint "system_configuration_pkey" PRIMARY KEY using index "system_configuration_pkey";

alter table "public"."system_settings" add constraint "system_settings_pkey" PRIMARY KEY using index "system_settings_pkey";

alter table "public"."system_settings_be" add constraint "system_settings_be_pkey" PRIMARY KEY using index "system_settings_be_pkey";

alter table "public"."tariff_rates_2026_02_04_16_00" add constraint "tariff_rates_2026_02_04_16_00_pkey" PRIMARY KEY using index "tariff_rates_2026_02_04_16_00_pkey";

alter table "public"."user_branch_assignments" add constraint "user_branch_assignments_pkey" PRIMARY KEY using index "user_branch_assignments_pkey";

alter table "public"."user_permissions" add constraint "user_permissions_pkey" PRIMARY KEY using index "user_permissions_pkey";

alter table "public"."user_profiles" add constraint "user_profiles_pkey" PRIMARY KEY using index "user_profiles_pkey";

alter table "public"."user_sessions" add constraint "user_sessions_pkey" PRIMARY KEY using index "user_sessions_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."users_2026_02_12_13_00" add constraint "users_2026_02_12_13_00_pkey" PRIMARY KEY using index "users_2026_02_12_13_00_pkey";

alter table "public"."users_enhanced" add constraint "users_enhanced_pkey" PRIMARY KEY using index "users_enhanced_pkey";

alter table "public"."vouchers" add constraint "vouchers_pkey" PRIMARY KEY using index "vouchers_pkey";

alter table "public"."warehouse_manifest_items_2026_02_04_15_54" add constraint "warehouse_manifest_items_2026_02_04_15_54_pkey" PRIMARY KEY using index "warehouse_manifest_items_2026_02_04_15_54_pkey";

alter table "public"."warehouse_manifests_2026_02_04_15_54" add constraint "warehouse_manifests_2026_02_04_15_54_pkey" PRIMARY KEY using index "warehouse_manifests_2026_02_04_15_54_pkey";

alter table "public"."warehouse_operations_2026_02_04_15_54" add constraint "warehouse_operations_2026_02_04_15_54_pkey" PRIMARY KEY using index "warehouse_operations_2026_02_04_15_54_pkey";

alter table "public"."warehouse_parcels_2026_02_04_15_54" add constraint "warehouse_parcels_2026_02_04_15_54_pkey" PRIMARY KEY using index "warehouse_parcels_2026_02_04_15_54_pkey";

alter table "public"."warehouse_stations_2026_02_04_15_54" add constraint "warehouse_stations_2026_02_04_15_54_pkey" PRIMARY KEY using index "warehouse_stations_2026_02_04_15_54_pkey";

alter table "public"."warehouse_users_2026_02_04_15_54" add constraint "warehouse_users_2026_02_04_15_54_pkey" PRIMARY KEY using index "warehouse_users_2026_02_04_15_54_pkey";

alter table "public"."admin_users_2026_02_04_16_00" add constraint "admin_users_2026_02_04_16_00_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.admin_users_2026_02_04_16_00(id) not valid;

alter table "public"."admin_users_2026_02_04_16_00" validate constraint "admin_users_2026_02_04_16_00_created_by_fkey";

alter table "public"."admin_users_2026_02_04_16_00" add constraint "admin_users_2026_02_04_16_00_email_key" UNIQUE using index "admin_users_2026_02_04_16_00_email_key";

alter table "public"."admin_users_2026_02_04_16_00" add constraint "admin_users_2026_02_04_16_00_role_check" CHECK (((role)::text = ANY ((ARRAY['super_admin'::character varying, 'admin'::character varying, 'manager'::character varying, 'supervisor'::character varying, 'warehouse_staff'::character varying, 'rider'::character varying, 'accountant'::character varying, 'marketer'::character varying, 'customer_service'::character varying, 'merchant'::character varying])::text[]))) not valid;

alter table "public"."admin_users_2026_02_04_16_00" validate constraint "admin_users_2026_02_04_16_00_role_check";

alter table "public"."admin_users_2026_02_04_16_00" add constraint "admin_users_2026_02_04_16_00_status_check" CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'suspended'::character varying, 'pending'::character varying])::text[]))) not valid;

alter table "public"."admin_users_2026_02_04_16_00" validate constraint "admin_users_2026_02_04_16_00_status_check";

alter table "public"."branches" add constraint "branches_code_key" UNIQUE using index "branches_code_key";

alter table "public"."branches" add constraint "branches_manager_id_fkey" FOREIGN KEY (manager_id) REFERENCES public.users(id) not valid;

alter table "public"."branches" validate constraint "branches_manager_id_fkey";

alter table "public"."broadcast_messages" add constraint "broadcast_messages_delivery_method_check" CHECK (((delivery_method)::text = ANY ((ARRAY['in_app'::character varying, 'email'::character varying, 'sms'::character varying, 'push'::character varying, 'all'::character varying])::text[]))) not valid;

alter table "public"."broadcast_messages" validate constraint "broadcast_messages_delivery_method_check";

alter table "public"."broadcast_messages" add constraint "broadcast_messages_message_type_check" CHECK (((message_type)::text = ANY ((ARRAY['general'::character varying, 'urgent'::character varying, 'maintenance'::character varying, 'promotion'::character varying, 'system'::character varying])::text[]))) not valid;

alter table "public"."broadcast_messages" validate constraint "broadcast_messages_message_type_check";

alter table "public"."broadcast_messages" add constraint "broadcast_messages_status_check" CHECK (((status)::text = ANY ((ARRAY['draft'::character varying, 'scheduled'::character varying, 'sending'::character varying, 'sent'::character varying, 'failed'::character varying, 'cancelled'::character varying])::text[]))) not valid;

alter table "public"."broadcast_messages" validate constraint "broadcast_messages_status_check";

alter table "public"."broadcast_messages" add constraint "broadcast_messages_target_audience_check" CHECK (((target_audience)::text = ANY ((ARRAY['all_users'::character varying, 'merchants'::character varying, 'deliverymen'::character varying, 'customers'::character varying, 'admins'::character varying, 'custom'::character varying])::text[]))) not valid;

alter table "public"."broadcast_messages" validate constraint "broadcast_messages_target_audience_check";

alter table "public"."bulk_upload_items_2026_02_04_16_00" add constraint "bulk_upload_items_2026_02_04_16_00_upload_id_fkey" FOREIGN KEY (upload_id) REFERENCES public.bulk_uploads_2026_02_04_16_00(id) ON DELETE CASCADE not valid;

alter table "public"."bulk_upload_items_2026_02_04_16_00" validate constraint "bulk_upload_items_2026_02_04_16_00_upload_id_fkey";

alter table "public"."bulk_upload_items_2026_02_04_16_00" add constraint "bulk_upload_items_2026_02_04_16_00_validation_status_check" CHECK (((validation_status)::text = ANY ((ARRAY['valid'::character varying, 'error'::character varying, 'pending'::character varying])::text[]))) not valid;

alter table "public"."bulk_upload_items_2026_02_04_16_00" validate constraint "bulk_upload_items_2026_02_04_16_00_validation_status_check";

alter table "public"."bulk_uploads_2026_02_04_16_00" add constraint "bulk_uploads_2026_02_04_16_00_status_check" CHECK (((status)::text = ANY ((ARRAY['processing'::character varying, 'completed'::character varying, 'failed'::character varying])::text[]))) not valid;

alter table "public"."bulk_uploads_2026_02_04_16_00" validate constraint "bulk_uploads_2026_02_04_16_00_status_check";

alter table "public"."bulk_uploads_2026_02_04_16_00" add constraint "bulk_uploads_2026_02_04_16_00_uploaded_by_fkey" FOREIGN KEY (uploaded_by) REFERENCES public.admin_users_2026_02_04_16_00(id) not valid;

alter table "public"."bulk_uploads_2026_02_04_16_00" validate constraint "bulk_uploads_2026_02_04_16_00_uploaded_by_fkey";

alter table "public"."cash_advances" add constraint "cash_advances_advance_type_check" CHECK (((advance_type)::text = ANY ((ARRAY['regular'::character varying, 'emergency'::character varying, 'salary_advance'::character varying])::text[]))) not valid;

alter table "public"."cash_advances" validate constraint "cash_advances_advance_type_check";

alter table "public"."cash_advances" add constraint "cash_advances_status_check" CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying, 'disbursed'::character varying, 'repaid'::character varying])::text[]))) not valid;

alter table "public"."cash_advances" validate constraint "cash_advances_status_check";

alter table "public"."content_pages_2026_02_03_21_00" add constraint "content_pages_2026_02_03_21_00_page_key_key" UNIQUE using index "content_pages_2026_02_03_21_00_page_key_key";

alter table "public"."customer_acknowledgments_2026_02_04_15_54" add constraint "customer_acknowledgments_2026_02_04_15_54_delivered_by_fkey" FOREIGN KEY (delivered_by) REFERENCES public.warehouse_users_2026_02_04_15_54(id) not valid;

alter table "public"."customer_acknowledgments_2026_02_04_15_54" validate constraint "customer_acknowledgments_2026_02_04_15_54_delivered_by_fkey";

alter table "public"."customer_acknowledgments_2026_02_04_15_54" add constraint "customer_acknowledgments_2026_02_04_15_54_parcel_id_fkey" FOREIGN KEY (parcel_id) REFERENCES public.warehouse_parcels_2026_02_04_15_54(id) not valid;

alter table "public"."customer_acknowledgments_2026_02_04_15_54" validate constraint "customer_acknowledgments_2026_02_04_15_54_parcel_id_fkey";

alter table "public"."customer_service_interactions_2026_02_04_16_00" add constraint "customer_service_interactions_2026_02_04_16_00_agent_id_fkey" FOREIGN KEY (agent_id) REFERENCES public.admin_users_2026_02_04_16_00(id) not valid;

alter table "public"."customer_service_interactions_2026_02_04_16_00" validate constraint "customer_service_interactions_2026_02_04_16_00_agent_id_fkey";

alter table "public"."customer_service_interactions_2026_02_04_16_00" add constraint "customer_service_interactions_2026_02_04_16_00_priority_check" CHECK (((priority)::text = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying, 'urgent'::character varying])::text[]))) not valid;

alter table "public"."customer_service_interactions_2026_02_04_16_00" validate constraint "customer_service_interactions_2026_02_04_16_00_priority_check";

alter table "public"."customer_service_interactions_2026_02_04_16_00" add constraint "customer_service_interactions_2026_02_04_16_00_status_check" CHECK (((status)::text = ANY ((ARRAY['open'::character varying, 'in_progress'::character varying, 'resolved'::character varying, 'closed'::character varying])::text[]))) not valid;

alter table "public"."customer_service_interactions_2026_02_04_16_00" validate constraint "customer_service_interactions_2026_02_04_16_00_status_check";

alter table "public"."customer_service_interactions_2026_02_04_16_00" add constraint "customer_service_interactions_2026_02_04_interaction_type_check" CHECK (((interaction_type)::text = ANY ((ARRAY['inquiry'::character varying, 'complaint'::character varying, 'support'::character varying, 'feedback'::character varying, 'refund_request'::character varying, 'tracking_help'::character varying])::text[]))) not valid;

alter table "public"."customer_service_interactions_2026_02_04_16_00" validate constraint "customer_service_interactions_2026_02_04_interaction_type_check";

alter table "public"."customer_service_interactions_2026_02_04_16_00" add constraint "customer_service_interactions_2026_02_satisfaction_rating_check" CHECK (((satisfaction_rating >= 1) AND (satisfaction_rating <= 5))) not valid;

alter table "public"."customer_service_interactions_2026_02_04_16_00" validate constraint "customer_service_interactions_2026_02_satisfaction_rating_check";

alter table "public"."customers" add constraint "customers_customer_code_key" UNIQUE using index "customers_customer_code_key";

alter table "public"."customers" add constraint "customers_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL not valid;

alter table "public"."customers" validate constraint "customers_user_id_fkey";

alter table "public"."deliveries" add constraint "deliveries_amount_cash_check" CHECK ((amount_cash >= (0)::numeric)) not valid;

alter table "public"."deliveries" validate constraint "deliveries_amount_cash_check";

alter table "public"."deliveries" add constraint "deliveries_amount_transaction_check" CHECK ((amount_transaction >= (0)::numeric)) not valid;

alter table "public"."deliveries" validate constraint "deliveries_amount_transaction_check";

alter table "public"."deliveries" add constraint "deliveries_customer_review_rating_check" CHECK (((customer_review_rating >= 1) AND (customer_review_rating <= 5))) not valid;

alter table "public"."deliveries" validate constraint "deliveries_customer_review_rating_check";

alter table "public"."deliveries" add constraint "deliveries_group_shipment_id_fkey" FOREIGN KEY (group_shipment_id) REFERENCES public.group_shipments(group_shipment_id) ON DELETE CASCADE not valid;

alter table "public"."deliveries" validate constraint "deliveries_group_shipment_id_fkey";

alter table "public"."delivery_routes" add constraint "delivery_routes_branch_id_fkey" FOREIGN KEY (branch_id) REFERENCES public.branches(id) not valid;

alter table "public"."delivery_routes" validate constraint "delivery_routes_branch_id_fkey";

alter table "public"."delivery_routes" add constraint "delivery_routes_rider_id_fkey" FOREIGN KEY (rider_id) REFERENCES public.users(id) not valid;

alter table "public"."delivery_routes" validate constraint "delivery_routes_rider_id_fkey";

alter table "public"."delivery_ways" add constraint "delivery_ways_priority_check" CHECK (((priority >= 1) AND (priority <= 5))) not valid;

alter table "public"."delivery_ways" validate constraint "delivery_ways_priority_check";

alter table "public"."delivery_ways" add constraint "delivery_ways_status_check" CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'in_transit'::character varying, 'delivered'::character varying, 'failed'::character varying, 'returned'::character varying])::text[]))) not valid;

alter table "public"."delivery_ways" validate constraint "delivery_ways_status_check";

alter table "public"."delivery_ways" add constraint "delivery_ways_tracking_number_key" UNIQUE using index "delivery_ways_tracking_number_key";

alter table "public"."deliverymen_be" add constraint "deliverymen_be_employee_id_key" UNIQUE using index "deliverymen_be_employee_id_key";

alter table "public"."deliverymen_be" add constraint "deliverymen_be_employment_status_check" CHECK (((employment_status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying, 'suspended'::character varying, 'terminated'::character varying])::text[]))) not valid;

alter table "public"."deliverymen_be" validate constraint "deliverymen_be_employment_status_check";

alter table "public"."departments" add constraint "departments_manager_id_fkey" FOREIGN KEY (manager_id) REFERENCES public.users_enhanced(id) not valid;

alter table "public"."departments" validate constraint "departments_manager_id_fkey";

alter table "public"."departments" add constraint "departments_name_key" UNIQUE using index "departments_name_key";

alter table "public"."digital_signatures" add constraint "digital_signatures_shipment_id_fkey" FOREIGN KEY (shipment_id) REFERENCES public.shipment_tracking_enhanced(id) not valid;

alter table "public"."digital_signatures" validate constraint "digital_signatures_shipment_id_fkey";

alter table "public"."driver_telemetry" add constraint "driver_telemetry_current_route_id_fkey" FOREIGN KEY (current_route_id) REFERENCES public.route_optimization(id) not valid;

alter table "public"."driver_telemetry" validate constraint "driver_telemetry_current_route_id_fkey";

alter table "public"."driver_telemetry" add constraint "driver_telemetry_driver_id_fkey" FOREIGN KEY (driver_id) REFERENCES auth.users(id) not valid;

alter table "public"."driver_telemetry" validate constraint "driver_telemetry_driver_id_fkey";

alter table "public"."employees" add constraint "employees_department_id_fkey" FOREIGN KEY (department_id) REFERENCES public.departments(id) not valid;

alter table "public"."employees" validate constraint "employees_department_id_fkey";

alter table "public"."employees" add constraint "employees_employee_code_key" UNIQUE using index "employees_employee_code_key";

alter table "public"."employees" add constraint "employees_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users_enhanced(id) not valid;

alter table "public"."employees" validate constraint "employees_user_id_fkey";

alter table "public"."financial_transactions" add constraint "financial_transactions_merchant_id_fkey" FOREIGN KEY (merchant_id) REFERENCES public.merchants(id) not valid;

alter table "public"."financial_transactions" validate constraint "financial_transactions_merchant_id_fkey";

alter table "public"."financial_transactions" add constraint "financial_transactions_transaction_id_key" UNIQUE using index "financial_transactions_transaction_id_key";

alter table "public"."financial_transactions" add constraint "financial_transactions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) not valid;

alter table "public"."financial_transactions" validate constraint "financial_transactions_user_id_fkey";

alter table "public"."fuel_anomalies" add constraint "fuel_anomalies_status_check" CHECK ((status = ANY (ARRAY['pending_investigation'::text, 'investigating'::text, 'resolved'::text, 'false_alarm'::text]))) not valid;

alter table "public"."fuel_anomalies" validate constraint "fuel_anomalies_status_check";

alter table "public"."group_shipments" add constraint "group_shipments_group_shipment_id_key" UNIQUE using index "group_shipments_group_shipment_id_key";

alter table "public"."invoices" add constraint "invoices_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.users_enhanced(id) not valid;

alter table "public"."invoices" validate constraint "invoices_created_by_fkey";

alter table "public"."invoices" add constraint "invoices_invoice_number_key" UNIQUE using index "invoices_invoice_number_key";

alter table "public"."marketer_performance_2026_02_04_16_00" add constraint "marketer_performance_2026_02_04_16_00_marketer_id_fkey" FOREIGN KEY (marketer_id) REFERENCES public.admin_users_2026_02_04_16_00(id) not valid;

alter table "public"."marketer_performance_2026_02_04_16_00" validate constraint "marketer_performance_2026_02_04_16_00_marketer_id_fkey";

alter table "public"."marketer_performance_2026_02_04_16_00" add constraint "marketer_performance_2026_02_04_16_0_marketer_id_month_year_key" UNIQUE using index "marketer_performance_2026_02_04_16_0_marketer_id_month_year_key";

alter table "public"."marketing_campaigns" add constraint "marketing_campaigns_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.users_enhanced(id) not valid;

alter table "public"."marketing_campaigns" validate constraint "marketing_campaigns_created_by_fkey";

alter table "public"."merchant_bank_accounts" add constraint "merchant_bank_accounts_status_check" CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying])::text[]))) not valid;

alter table "public"."merchant_bank_accounts" validate constraint "merchant_bank_accounts_status_check";

alter table "public"."merchant_receipts" add constraint "merchant_receipts_receipt_number_key" UNIQUE using index "merchant_receipts_receipt_number_key";

alter table "public"."merchant_receipts" add constraint "merchant_receipts_receipt_type_check" CHECK (((receipt_type)::text = ANY ((ARRAY['payment'::character varying, 'refund'::character varying, 'commission'::character varying, 'adjustment'::character varying])::text[]))) not valid;

alter table "public"."merchant_receipts" validate constraint "merchant_receipts_receipt_type_check";

alter table "public"."merchant_receipts" add constraint "merchant_receipts_status_check" CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'paid'::character varying, 'overdue'::character varying, 'cancelled'::character varying])::text[]))) not valid;

alter table "public"."merchant_receipts" validate constraint "merchant_receipts_status_check";

alter table "public"."merchants" add constraint "merchants_merchant_code_key" UNIQUE using index "merchants_merchant_code_key";

alter table "public"."merchants" add constraint "merchants_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."merchants" validate constraint "merchants_user_id_fkey";

alter table "public"."merchants_be" add constraint "merchants_be_status_check" CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying, 'suspended'::character varying, 'pending'::character varying])::text[]))) not valid;

alter table "public"."merchants_be" validate constraint "merchants_be_status_check";

alter table "public"."mfa_tokens" add constraint "mfa_tokens_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users_enhanced(id) ON DELETE CASCADE not valid;

alter table "public"."mfa_tokens" validate constraint "mfa_tokens_user_id_fkey";

alter table "public"."notifications" add constraint "notifications_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users_enhanced(id) not valid;

alter table "public"."notifications" validate constraint "notifications_user_id_fkey";

alter table "public"."orders" add constraint "orders_assigned_rider_id_fkey" FOREIGN KEY (assigned_rider_id) REFERENCES auth.users(id) not valid;

alter table "public"."orders" validate constraint "orders_assigned_rider_id_fkey";

alter table "public"."orders" add constraint "orders_city_check" CHECK ((city = ANY (ARRAY['Yangon'::text, 'Mandalay'::text, 'Naypyidaw'::text]))) not valid;

alter table "public"."orders" validate constraint "orders_city_check";

alter table "public"."orders" add constraint "orders_order_number_key" UNIQUE using index "orders_order_number_key";

alter table "public"."orders" add constraint "orders_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'in-transit'::text, 'completed'::text, 'cancelled'::text]))) not valid;

alter table "public"."orders" validate constraint "orders_status_check";

alter table "public"."parcels" add constraint "parcels_assigned_rider_fkey" FOREIGN KEY (assigned_rider) REFERENCES public.profiles(id) not valid;

alter table "public"."parcels" validate constraint "parcels_assigned_rider_fkey";

alter table "public"."parcels" add constraint "parcels_awb_key" UNIQUE using index "parcels_awb_key";

alter table "public"."parcels" add constraint "parcels_merchant_id_fkey" FOREIGN KEY (merchant_id) REFERENCES public.merchants(id) not valid;

alter table "public"."parcels" validate constraint "parcels_merchant_id_fkey";

alter table "public"."password_changes" add constraint "password_changes_changed_by_fkey" FOREIGN KEY (changed_by) REFERENCES public.user_profiles(id) not valid;

alter table "public"."password_changes" validate constraint "password_changes_changed_by_fkey";

alter table "public"."password_changes" add constraint "password_changes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE not valid;

alter table "public"."password_changes" validate constraint "password_changes_user_id_fkey";

alter table "public"."permissions" add constraint "permissions_name_key" UNIQUE using index "permissions_name_key";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."qr_codes_2026_02_04_15_54" add constraint "qr_codes_2026_02_04_15_54_qr_code_key" UNIQUE using index "qr_codes_2026_02_04_15_54_qr_code_key";

alter table "public"."return_shipments" add constraint "return_shipments_refund_status_check" CHECK (((refund_status)::text = ANY ((ARRAY['pending'::character varying, 'processed'::character varying, 'cancelled'::character varying])::text[]))) not valid;

alter table "public"."return_shipments" validate constraint "return_shipments_refund_status_check";

alter table "public"."return_shipments" add constraint "return_shipments_return_status_check" CHECK (((return_status)::text = ANY ((ARRAY['initiated'::character varying, 'in_transit'::character varying, 'completed'::character varying, 'cancelled'::character varying])::text[]))) not valid;

alter table "public"."return_shipments" validate constraint "return_shipments_return_status_check";

alter table "public"."rider_locations_2026_02_04_14_23" add constraint "rider_locations_2026_02_04_14_23_rider_id_fkey" FOREIGN KEY (rider_id) REFERENCES public.riders_2026_02_04_14_23(id) ON DELETE CASCADE not valid;

alter table "public"."rider_locations_2026_02_04_14_23" validate constraint "rider_locations_2026_02_04_14_23_rider_id_fkey";

alter table "public"."rider_notifications_2026_02_04_14_23" add constraint "rider_notifications_2026_02_04_14_23_rider_id_fkey" FOREIGN KEY (rider_id) REFERENCES public.riders_2026_02_04_14_23(id) ON DELETE CASCADE not valid;

alter table "public"."rider_notifications_2026_02_04_14_23" validate constraint "rider_notifications_2026_02_04_14_23_rider_id_fkey";

alter table "public"."rider_notifications_2026_02_04_14_23" add constraint "rider_notifications_2026_02_04_14_23_type_check" CHECK (((type)::text = ANY ((ARRAY['info'::character varying, 'warning'::character varying, 'success'::character varying, 'error'::character varying, 'task_assigned'::character varying, 'payment'::character varying])::text[]))) not valid;

alter table "public"."rider_notifications_2026_02_04_14_23" validate constraint "rider_notifications_2026_02_04_14_23_type_check";

alter table "public"."rider_tasks_2026_02_04_14_23" add constraint "rider_tasks_2026_02_04_14_23_priority_check" CHECK (((priority)::text = ANY ((ARRAY['normal'::character varying, 'express'::character varying, 'urgent'::character varying])::text[]))) not valid;

alter table "public"."rider_tasks_2026_02_04_14_23" validate constraint "rider_tasks_2026_02_04_14_23_priority_check";

alter table "public"."rider_tasks_2026_02_04_14_23" add constraint "rider_tasks_2026_02_04_14_23_rider_id_fkey" FOREIGN KEY (rider_id) REFERENCES public.riders_2026_02_04_14_23(id) ON DELETE CASCADE not valid;

alter table "public"."rider_tasks_2026_02_04_14_23" validate constraint "rider_tasks_2026_02_04_14_23_rider_id_fkey";

alter table "public"."rider_tasks_2026_02_04_14_23" add constraint "rider_tasks_2026_02_04_14_23_status_check" CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'assigned'::character varying, 'in_progress'::character varying, 'completed'::character varying, 'failed'::character varying, 'cancelled'::character varying])::text[]))) not valid;

alter table "public"."rider_tasks_2026_02_04_14_23" validate constraint "rider_tasks_2026_02_04_14_23_status_check";

alter table "public"."rider_tasks_2026_02_04_14_23" add constraint "rider_tasks_2026_02_04_14_23_task_code_key" UNIQUE using index "rider_tasks_2026_02_04_14_23_task_code_key";

alter table "public"."rider_tasks_2026_02_04_14_23" add constraint "rider_tasks_2026_02_04_14_23_type_check" CHECK (((type)::text = ANY ((ARRAY['pickup'::character varying, 'delivery'::character varying, 'return'::character varying])::text[]))) not valid;

alter table "public"."rider_tasks_2026_02_04_14_23" validate constraint "rider_tasks_2026_02_04_14_23_type_check";

alter table "public"."rider_transactions_2026_02_04_14_23" add constraint "rider_transactions_2026_02_04_14_23_rider_id_fkey" FOREIGN KEY (rider_id) REFERENCES public.riders_2026_02_04_14_23(id) ON DELETE CASCADE not valid;

alter table "public"."rider_transactions_2026_02_04_14_23" validate constraint "rider_transactions_2026_02_04_14_23_rider_id_fkey";

alter table "public"."rider_transactions_2026_02_04_14_23" add constraint "rider_transactions_2026_02_04_14_23_status_check" CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'completed'::character varying, 'cancelled'::character varying])::text[]))) not valid;

alter table "public"."rider_transactions_2026_02_04_14_23" validate constraint "rider_transactions_2026_02_04_14_23_status_check";

alter table "public"."rider_transactions_2026_02_04_14_23" add constraint "rider_transactions_2026_02_04_14_23_task_id_fkey" FOREIGN KEY (task_id) REFERENCES public.rider_tasks_2026_02_04_14_23(id) ON DELETE SET NULL not valid;

alter table "public"."rider_transactions_2026_02_04_14_23" validate constraint "rider_transactions_2026_02_04_14_23_task_id_fkey";

alter table "public"."rider_transactions_2026_02_04_14_23" add constraint "rider_transactions_2026_02_04_14_23_transaction_type_check" CHECK (((transaction_type)::text = ANY ((ARRAY['cod_collection'::character varying, 'delivery_fee'::character varying, 'cod_remittance'::character varying, 'wallet_withdrawal'::character varying, 'bonus'::character varying, 'penalty'::character varying])::text[]))) not valid;

alter table "public"."rider_transactions_2026_02_04_14_23" validate constraint "rider_transactions_2026_02_04_14_23_transaction_type_check";

alter table "public"."riders_2026_02_04_14_23" add constraint "riders_2026_02_04_14_23_duty_status_check" CHECK (((duty_status)::text = ANY ((ARRAY['on_duty'::character varying, 'off_duty'::character varying, 'break'::character varying])::text[]))) not valid;

alter table "public"."riders_2026_02_04_14_23" validate constraint "riders_2026_02_04_14_23_duty_status_check";

alter table "public"."riders_2026_02_04_14_23" add constraint "riders_2026_02_04_14_23_rider_code_key" UNIQUE using index "riders_2026_02_04_14_23_rider_code_key";

alter table "public"."riders_2026_02_04_14_23" add constraint "riders_2026_02_04_14_23_status_check" CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying, 'suspended'::character varying])::text[]))) not valid;

alter table "public"."riders_2026_02_04_14_23" validate constraint "riders_2026_02_04_14_23_status_check";

alter table "public"."riders_2026_02_04_14_23" add constraint "riders_2026_02_04_14_23_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."riders_2026_02_04_14_23" validate constraint "riders_2026_02_04_14_23_user_id_fkey";

alter table "public"."role_permissions" add constraint "role_permissions_permission_id_fkey" FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE not valid;

alter table "public"."role_permissions" validate constraint "role_permissions_permission_id_fkey";

alter table "public"."role_permissions" add constraint "role_permissions_role_permission_id_key" UNIQUE using index "role_permissions_role_permission_id_key";

alter table "public"."route_optimization" add constraint "route_optimization_driver_id_fkey" FOREIGN KEY (driver_id) REFERENCES auth.users(id) not valid;

alter table "public"."route_optimization" validate constraint "route_optimization_driver_id_fkey";

alter table "public"."route_shipments" add constraint "route_shipments_route_id_fkey" FOREIGN KEY (route_id) REFERENCES public.delivery_routes(id) ON DELETE CASCADE not valid;

alter table "public"."route_shipments" validate constraint "route_shipments_route_id_fkey";

alter table "public"."route_shipments" add constraint "route_shipments_route_id_shipment_id_key" UNIQUE using index "route_shipments_route_id_shipment_id_key";

alter table "public"."route_shipments" add constraint "route_shipments_shipment_id_fkey" FOREIGN KEY (shipment_id) REFERENCES public.shipments(id) ON DELETE CASCADE not valid;

alter table "public"."route_shipments" validate constraint "route_shipments_shipment_id_fkey";

alter table "public"."shipment_tracking" add constraint "shipment_tracking_handled_by_fkey" FOREIGN KEY (handled_by) REFERENCES public.users(id) not valid;

alter table "public"."shipment_tracking" validate constraint "shipment_tracking_handled_by_fkey";

alter table "public"."shipment_tracking" add constraint "shipment_tracking_shipment_id_fkey" FOREIGN KEY (shipment_id) REFERENCES public.shipments(id) ON DELETE CASCADE not valid;

alter table "public"."shipment_tracking" validate constraint "shipment_tracking_shipment_id_fkey";

alter table "public"."shipment_tracking_enhanced" add constraint "shipment_tracking_enhanced_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."shipment_tracking_enhanced" validate constraint "shipment_tracking_enhanced_created_by_fkey";

alter table "public"."shipment_tracking_enhanced" add constraint "shipment_tracking_enhanced_tracking_number_key" UNIQUE using index "shipment_tracking_enhanced_tracking_number_key";

alter table "public"."shipments" add constraint "shipments_assigned_rider_id_fkey" FOREIGN KEY (assigned_rider_id) REFERENCES public.users(id) not valid;

alter table "public"."shipments" validate constraint "shipments_assigned_rider_id_fkey";

alter table "public"."shipments" add constraint "shipments_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.users(id) not valid;

alter table "public"."shipments" validate constraint "shipments_created_by_fkey";

alter table "public"."shipments" add constraint "shipments_delivery_branch_id_fkey" FOREIGN KEY (delivery_branch_id) REFERENCES public.branches(id) not valid;

alter table "public"."shipments" validate constraint "shipments_delivery_branch_id_fkey";

alter table "public"."shipments" add constraint "shipments_merchant_id_fkey" FOREIGN KEY (merchant_id) REFERENCES public.merchants(id) not valid;

alter table "public"."shipments" validate constraint "shipments_merchant_id_fkey";

alter table "public"."shipments" add constraint "shipments_pickup_branch_id_fkey" FOREIGN KEY (pickup_branch_id) REFERENCES public.branches(id) not valid;

alter table "public"."shipments" validate constraint "shipments_pickup_branch_id_fkey";

alter table "public"."shipments" add constraint "shipments_way_id_key" UNIQUE using index "shipments_way_id_key";

alter table "public"."support_tickets" add constraint "support_tickets_assigned_to_fkey" FOREIGN KEY (assigned_to) REFERENCES public.users_enhanced(id) not valid;

alter table "public"."support_tickets" validate constraint "support_tickets_assigned_to_fkey";

alter table "public"."support_tickets" add constraint "support_tickets_ticket_number_key" UNIQUE using index "support_tickets_ticket_number_key";

alter table "public"."system_audit_log" add constraint "system_audit_log_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."system_audit_log" validate constraint "system_audit_log_user_id_fkey";

alter table "public"."system_config_2026_02_04_16_00" add constraint "system_config_2026_02_04_16_00_config_key_key" UNIQUE using index "system_config_2026_02_04_16_00_config_key_key";

alter table "public"."system_config_2026_02_04_16_00" add constraint "system_config_2026_02_04_16_00_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES public.admin_users_2026_02_04_16_00(id) not valid;

alter table "public"."system_config_2026_02_04_16_00" validate constraint "system_config_2026_02_04_16_00_updated_by_fkey";

alter table "public"."system_configuration" add constraint "system_configuration_setting_key_key" UNIQUE using index "system_configuration_setting_key_key";

alter table "public"."system_settings" add constraint "system_settings_setting_key_key" UNIQUE using index "system_settings_setting_key_key";

alter table "public"."system_settings" add constraint "system_settings_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES public.users(id) not valid;

alter table "public"."system_settings" validate constraint "system_settings_updated_by_fkey";

alter table "public"."system_settings_be" add constraint "system_settings_be_setting_category_setting_key_key" UNIQUE using index "system_settings_be_setting_category_setting_key_key";

alter table "public"."system_settings_be" add constraint "system_settings_be_setting_type_check" CHECK (((setting_type)::text = ANY ((ARRAY['string'::character varying, 'number'::character varying, 'boolean'::character varying, 'json'::character varying])::text[]))) not valid;

alter table "public"."system_settings_be" validate constraint "system_settings_be_setting_type_check";

alter table "public"."tariff_rates_2026_02_04_16_00" add constraint "tariff_rates_2026_02_04_16_00_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES public.admin_users_2026_02_04_16_00(id) not valid;

alter table "public"."tariff_rates_2026_02_04_16_00" validate constraint "tariff_rates_2026_02_04_16_00_updated_by_fkey";

alter table "public"."user_branch_assignments" add constraint "user_branch_assignments_assigned_by_fkey" FOREIGN KEY (assigned_by) REFERENCES public.users(id) not valid;

alter table "public"."user_branch_assignments" validate constraint "user_branch_assignments_assigned_by_fkey";

alter table "public"."user_branch_assignments" add constraint "user_branch_assignments_branch_id_fkey" FOREIGN KEY (branch_id) REFERENCES public.branches(id) ON DELETE CASCADE not valid;

alter table "public"."user_branch_assignments" validate constraint "user_branch_assignments_branch_id_fkey";

alter table "public"."user_branch_assignments" add constraint "user_branch_assignments_user_id_branch_id_key" UNIQUE using index "user_branch_assignments_user_id_branch_id_key";

alter table "public"."user_branch_assignments" add constraint "user_branch_assignments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_branch_assignments" validate constraint "user_branch_assignments_user_id_fkey";

alter table "public"."user_profiles" add constraint "user_profiles_branch_id_fkey" FOREIGN KEY (branch_id) REFERENCES public.branches(id) not valid;

alter table "public"."user_profiles" validate constraint "user_profiles_branch_id_fkey";

alter table "public"."user_profiles" add constraint "user_profiles_email_key" UNIQUE using index "user_profiles_email_key";

alter table "public"."user_profiles" add constraint "user_profiles_employee_id_key" UNIQUE using index "user_profiles_employee_id_key";

alter table "public"."user_sessions" add constraint "user_sessions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_sessions" validate constraint "user_sessions_user_id_fkey";

alter table "public"."users" add constraint "users_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.users(id) not valid;

alter table "public"."users" validate constraint "users_created_by_fkey";

alter table "public"."users" add constraint "users_email_key" UNIQUE using index "users_email_key";

alter table "public"."users" add constraint "users_firebase_uid_key" UNIQUE using index "users_firebase_uid_key";

alter table "public"."users" add constraint "users_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES public.users(id) not valid;

alter table "public"."users" validate constraint "users_updated_by_fkey";

alter table "public"."users_2026_02_12_13_00" add constraint "users_2026_02_12_13_00_employee_id_key" UNIQUE using index "users_2026_02_12_13_00_employee_id_key";

alter table "public"."users_enhanced" add constraint "users_enhanced_auth_user_id_fkey" FOREIGN KEY (auth_user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."users_enhanced" validate constraint "users_enhanced_auth_user_id_fkey";

alter table "public"."users_enhanced" add constraint "users_enhanced_email_key" UNIQUE using index "users_enhanced_email_key";

alter table "public"."users_enhanced" add constraint "users_enhanced_employee_id_key" UNIQUE using index "users_enhanced_employee_id_key";

alter table "public"."users_enhanced" add constraint "users_enhanced_manager_id_fkey" FOREIGN KEY (manager_id) REFERENCES public.users_enhanced(id) not valid;

alter table "public"."users_enhanced" validate constraint "users_enhanced_manager_id_fkey";

alter table "public"."vouchers" add constraint "vouchers_amount_check" CHECK ((amount > (0)::numeric)) not valid;

alter table "public"."vouchers" validate constraint "vouchers_amount_check";

alter table "public"."vouchers" add constraint "vouchers_status_check" CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying])::text[]))) not valid;

alter table "public"."vouchers" validate constraint "vouchers_status_check";

alter table "public"."vouchers" add constraint "vouchers_voucher_number_key" UNIQUE using index "vouchers_voucher_number_key";

alter table "public"."vouchers" add constraint "vouchers_voucher_type_check" CHECK (((voucher_type)::text = ANY ((ARRAY['income'::character varying, 'expense'::character varying, 'transfer'::character varying])::text[]))) not valid;

alter table "public"."vouchers" validate constraint "vouchers_voucher_type_check";

alter table "public"."warehouse_manifest_items_2026_02_04_15_54" add constraint "warehouse_manifest_items_2026_02_04_15_54_manifest_id_fkey" FOREIGN KEY (manifest_id) REFERENCES public.warehouse_manifests_2026_02_04_15_54(id) not valid;

alter table "public"."warehouse_manifest_items_2026_02_04_15_54" validate constraint "warehouse_manifest_items_2026_02_04_15_54_manifest_id_fkey";

alter table "public"."warehouse_manifest_items_2026_02_04_15_54" add constraint "warehouse_manifest_items_2026_02_04_15_54_parcel_id_fkey" FOREIGN KEY (parcel_id) REFERENCES public.warehouse_parcels_2026_02_04_15_54(id) not valid;

alter table "public"."warehouse_manifest_items_2026_02_04_15_54" validate constraint "warehouse_manifest_items_2026_02_04_15_54_parcel_id_fkey";

alter table "public"."warehouse_manifest_items_2026_02_04_15_54" add constraint "warehouse_manifest_items_2026_02_04_15_54_scanned_by_fkey" FOREIGN KEY (scanned_by) REFERENCES public.warehouse_users_2026_02_04_15_54(id) not valid;

alter table "public"."warehouse_manifest_items_2026_02_04_15_54" validate constraint "warehouse_manifest_items_2026_02_04_15_54_scanned_by_fkey";

alter table "public"."warehouse_manifests_2026_02_04_15_54" add constraint "warehouse_manifests_2026_02_04_15_54_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.warehouse_users_2026_02_04_15_54(id) not valid;

alter table "public"."warehouse_manifests_2026_02_04_15_54" validate constraint "warehouse_manifests_2026_02_04_15_54_created_by_fkey";

alter table "public"."warehouse_manifests_2026_02_04_15_54" add constraint "warehouse_manifests_2026_02_04_15_54_manifest_number_key" UNIQUE using index "warehouse_manifests_2026_02_04_15_54_manifest_number_key";

alter table "public"."warehouse_manifests_2026_02_04_15_54" add constraint "warehouse_manifests_2026_02_04_15_54_manifest_qr_code_key" UNIQUE using index "warehouse_manifests_2026_02_04_15_54_manifest_qr_code_key";

alter table "public"."warehouse_manifests_2026_02_04_15_54" add constraint "warehouse_manifests_2026_02_04_15_54_origin_station_id_fkey" FOREIGN KEY (origin_station_id) REFERENCES public.warehouse_stations_2026_02_04_15_54(id) not valid;

alter table "public"."warehouse_manifests_2026_02_04_15_54" validate constraint "warehouse_manifests_2026_02_04_15_54_origin_station_id_fkey";

alter table "public"."warehouse_manifests_2026_02_04_15_54" add constraint "warehouse_manifests_2026_02_04_15_5_destination_station_id_fkey" FOREIGN KEY (destination_station_id) REFERENCES public.warehouse_stations_2026_02_04_15_54(id) not valid;

alter table "public"."warehouse_manifests_2026_02_04_15_54" validate constraint "warehouse_manifests_2026_02_04_15_5_destination_station_id_fkey";

alter table "public"."warehouse_operations_2026_02_04_15_54" add constraint "warehouse_operations_2026_02_04_15_54_parcel_id_fkey" FOREIGN KEY (parcel_id) REFERENCES public.warehouse_parcels_2026_02_04_15_54(id) not valid;

alter table "public"."warehouse_operations_2026_02_04_15_54" validate constraint "warehouse_operations_2026_02_04_15_54_parcel_id_fkey";

alter table "public"."warehouse_operations_2026_02_04_15_54" add constraint "warehouse_operations_2026_02_04_15_54_station_id_fkey" FOREIGN KEY (station_id) REFERENCES public.warehouse_stations_2026_02_04_15_54(id) not valid;

alter table "public"."warehouse_operations_2026_02_04_15_54" validate constraint "warehouse_operations_2026_02_04_15_54_station_id_fkey";

alter table "public"."warehouse_operations_2026_02_04_15_54" add constraint "warehouse_operations_2026_02_04_15_54_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.warehouse_users_2026_02_04_15_54(id) not valid;

alter table "public"."warehouse_operations_2026_02_04_15_54" validate constraint "warehouse_operations_2026_02_04_15_54_user_id_fkey";

alter table "public"."warehouse_parcels_2026_02_04_15_54" add constraint "warehouse_parcels_2026_02_04_15_54_current_station_id_fkey" FOREIGN KEY (current_station_id) REFERENCES public.warehouse_stations_2026_02_04_15_54(id) not valid;

alter table "public"."warehouse_parcels_2026_02_04_15_54" validate constraint "warehouse_parcels_2026_02_04_15_54_current_station_id_fkey";

alter table "public"."warehouse_parcels_2026_02_04_15_54" add constraint "warehouse_parcels_2026_02_04_15_54_qr_code_key" UNIQUE using index "warehouse_parcels_2026_02_04_15_54_qr_code_key";

alter table "public"."warehouse_parcels_2026_02_04_15_54" add constraint "warehouse_parcels_2026_02_04_15_54_tracking_number_key" UNIQUE using index "warehouse_parcels_2026_02_04_15_54_tracking_number_key";

alter table "public"."warehouse_stations_2026_02_04_15_54" add constraint "warehouse_stations_2026_02_04_15_54_station_code_key" UNIQUE using index "warehouse_stations_2026_02_04_15_54_station_code_key";

alter table "public"."warehouse_users_2026_02_04_15_54" add constraint "warehouse_users_2026_02_04_15_54_employee_code_key" UNIQUE using index "warehouse_users_2026_02_04_15_54_employee_code_key";

alter table "public"."warehouse_users_2026_02_04_15_54" add constraint "warehouse_users_2026_02_04_15_54_station_id_fkey" FOREIGN KEY (station_id) REFERENCES public.warehouse_stations_2026_02_04_15_54(id) not valid;

alter table "public"."warehouse_users_2026_02_04_15_54" validate constraint "warehouse_users_2026_02_04_15_54_station_id_fkey";

alter table "public"."warehouse_users_2026_02_04_15_54" add constraint "warehouse_users_2026_02_04_15_54_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."warehouse_users_2026_02_04_15_54" validate constraint "warehouse_users_2026_02_04_15_54_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.admin_manage_user(target_user_id uuid, action text, new_role text DEFAULT NULL::text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Check if the person running the function is an Admin
    IF NOT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role IN ('superadmin', 'appowner')
    ) THEN
        RAISE EXCEPTION 'Unauthorized: Authority insufficient.';
    END IF;

    -- Execute Action
    IF action = 'block' THEN
        UPDATE public.profiles SET status = 'suspended' WHERE id = target_user_id;
    ELSIF action = 'activate' THEN
        UPDATE public.profiles SET status = 'active' WHERE id = target_user_id;
    ELSIF action = 'change_role' THEN
        UPDATE public.profiles SET role = new_role WHERE id = target_user_id;
    ELSIF action = 'remove' THEN
        -- This removes the profile; the auth user must be deleted via Supabase Admin API
        DELETE FROM public.profiles WHERE id = target_user_id;
    END IF;
END;
$function$
;

create or replace view "public"."admin_user_view" as  SELECT p.id,
    u.email,
    (p.role)::text AS role,
    p.created_at
   FROM (public.profiles p
     JOIN auth.users u ON ((u.id = p.id)));


CREATE OR REPLACE FUNCTION public.check_password_change_required(user_email text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    must_change BOOLEAN;
BEGIN
    SELECT must_change_password INTO must_change
    FROM public.user_profiles
    WHERE email = user_email AND status = 'active';
    
    RETURN COALESCE(must_change, true);
END;
$function$
;

create or replace view "public"."city_delivery_summary" as  SELECT city,
    count(*) AS total_orders
   FROM public.orders
  WHERE (status = 'pending'::text)
  GROUP BY city;


create or replace view "public"."dashboard_metrics" as  SELECT count(*) AS total_parcels,
    count(*) FILTER (WHERE (status = 'Delivered'::text)) AS delivered,
    count(*) FILTER (WHERE (status = 'In Transit'::text)) AS in_transit,
    count(*) FILTER (WHERE (status = 'Pending'::text)) AS pending
   FROM public.parcels;


create or replace view "public"."delivery_planning_view" as  SELECT city,
    township,
    count(*) AS total_orders,
    array_agg(order_number) AS order_list
   FROM public.orders
  WHERE (status = 'pending'::text)
  GROUP BY city, township
  ORDER BY city, (count(*)) DESC;


CREATE OR REPLACE FUNCTION public.generate_delivery_receipt()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Insert automated report generation task
    INSERT INTO public.automated_reports (
        report_type,
        trigger_event,
        related_entity_id,
        report_data,
        generation_status
    ) VALUES (
        'delivery_receipt',
        'signature_completed',
        NEW.id,
        jsonb_build_object(
            'signature_id', NEW.id,
            'shipment_id', NEW.shipment_id,
            'recipient_name', NEW.recipient_name,
            'delivery_timestamp', NEW.delivery_timestamp,
            'gps_coordinates', ST_AsGeoJSON(NEW.gps_coordinates)::jsonb,
            'verification_hash', NEW.verification_hash,
            'metadata', NEW.metadata
        ),
        'pending'
    );
    
    -- Log the event
    INSERT INTO public.system_audit_log (
        user_id,
        action,
        entity_type,
        entity_id,
        new_values
    ) VALUES (
        auth.uid(),
        'signature_completed',
        'digital_signature',
        NEW.id,
        to_jsonb(NEW)
    );
    
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_user_branch(user_email text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    user_branch TEXT;
BEGIN
    SELECT branch_location INTO user_branch
    FROM public.user_profiles
    WHERE email = user_email AND status = 'active';
    
    RETURN COALESCE(user_branch, '');
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_user_role(user_email text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role
    FROM public.user_profiles
    WHERE email = user_email AND status = 'active';
    
    RETURN COALESCE(user_role, 'none');
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (
    id,
    role,
    must_change_password,
    status,
    created_at,
    email
  )
  VALUES (
    NEW.id,
    'STAFF',
    false,
    'active',
    now(),
    NEW.email
  );
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.has_role(user_email text, required_roles text[])
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN get_user_role(user_email) = ANY(required_roles);
END;
$function$
;

CREATE OR REPLACE FUNCTION public.is_admin_or_above(user_email text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN get_user_role(user_email) IN ('super_admin', 'admin');
END;
$function$
;

CREATE OR REPLACE FUNCTION public.is_manager_or_above(user_email text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN get_user_role(user_email) IN ('super_admin', 'admin', 'manager');
END;
$function$
;

CREATE OR REPLACE FUNCTION public.is_super_admin(user_email text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN get_user_role(user_email) = 'super_admin';
END;
$function$
;

CREATE OR REPLACE FUNCTION public.log_parcel_update()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  insert into audit_logs(user_id, action, table_name, record_id)
  values (auth.uid(), TG_OP, 'parcels', NEW.id);
  return NEW;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.log_telemetry_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Update route progress if applicable
    IF NEW.current_route_id IS NOT NULL THEN
        UPDATE public.route_optimization 
        SET 
            actual_performance = COALESCE(actual_performance, '{}'::jsonb) || jsonb_build_object(
                'last_update', NOW(),
                'current_location', ST_AsGeoJSON(NEW.location)::jsonb,
                'parcels_remaining', NEW.parcels_remaining
            )
        WHERE id = NEW.current_route_id;
    END IF;
    
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.log_user_action(p_user_email text, p_action text, p_table_name text DEFAULT NULL::text, p_record_id uuid DEFAULT NULL::uuid, p_details jsonb DEFAULT NULL::jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    log_id UUID;
    user_id_val UUID;
BEGIN
    -- Get user ID from email
    SELECT id INTO user_id_val
    FROM public.user_profiles
    WHERE email = p_user_email;
    
    -- Create audit log table if it doesn't exist
    CREATE TABLE IF NOT EXISTS public.audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES public.user_profiles(id),
        action TEXT NOT NULL,
        table_name TEXT,
        record_id UUID,
        details JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Enable RLS on audit logs
    ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
    
    -- Insert audit log
    INSERT INTO public.audit_logs (
        user_id, action, table_name, record_id, details, created_at
    ) VALUES (
        user_id_val, p_action, p_table_name, p_record_id, p_details, NOW()
    ) RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.log_user_action(p_user_id uuid, p_action character varying, p_resource_type character varying DEFAULT NULL::character varying, p_resource_id text DEFAULT NULL::text, p_old_values jsonb DEFAULT NULL::jsonb, p_new_values jsonb DEFAULT NULL::jsonb, p_ip_address inet DEFAULT NULL::inet, p_user_agent text DEFAULT NULL::text, p_success boolean DEFAULT true, p_error_message text DEFAULT NULL::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.audit_logs (
    user_id, action, resource_type, resource_id, 
    old_values, new_values, ip_address, user_agent, 
    success, error_message
  ) VALUES (
    p_user_id, p_action, p_resource_type, p_resource_id,
    p_old_values, p_new_values, p_ip_address, p_user_agent,
    p_success, p_error_message
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.same_branch(user_email text, target_branch text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN get_user_branch(user_email) = target_branch OR is_admin_or_above(user_email);
END;
$function$
;

CREATE OR REPLACE FUNCTION public.set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.updated_at := now();
  return new;
end $function$
;

CREATE OR REPLACE FUNCTION public.test_access()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN 'Supabase access is now working! Firebase handles security.';
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_shipment_status()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Update shipment status to delivered
    UPDATE public.shipment_tracking_enhanced 
    SET 
        current_status = 'delivered',
        updated_at = NOW(),
        audit_trail = audit_trail || jsonb_build_object(
            'timestamp', NOW(),
            'action', 'status_updated',
            'old_status', current_status,
            'new_status', 'delivered',
            'signature_id', NEW.id
        )
    WHERE id = NEW.shipment_id;
    
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_user_password(user_email text, old_password text, new_password text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    user_record RECORD;
    password_updated BOOLEAN := false;
BEGIN
    -- Get user record
    SELECT * INTO user_record
    FROM public.user_profiles
    WHERE email = user_email AND status = 'active';
    
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    -- Check old password (in production, this should use proper hashing)
    IF user_record.password_hash = old_password THEN
        -- Update password and reset flags
        UPDATE public.user_profiles
        SET 
            password_hash = new_password,
            must_change_password = false,
            first_login = false,
            last_password_change = NOW(),
            updated_at = NOW()
        WHERE email = user_email;
        
        -- Log password change
        INSERT INTO public.password_changes (user_id, old_password_hash, new_password_hash, reason)
        VALUES (user_record.id, old_password, new_password, 'first_login_change');
        
        password_updated := true;
    END IF;
    
    RETURN password_updated;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.user_has_permission(p_user_id uuid, p_permission_name character varying)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  has_permission BOOLEAN := FALSE;
BEGIN
  SELECT EXISTS (
    SELECT 1 
    FROM public.users_enhanced u
    JOIN public.role_permissions rp ON rp.role = u.role
    JOIN public.permissions p ON p.id = rp.permission_id
    WHERE u.id = p_user_id 
    AND p.name = p_permission_name
    AND u.is_active = TRUE
  ) INTO has_permission;
  
  RETURN has_permission;
END;
$function$
;

create or replace view "public"."v_daily_export" as  SELECT gs.shipment_date AS "Date",
    to_char(gs.created_at, 'HH24:MI'::text) AS "Time",
    d.group_shipment_id AS "GroupShipmentId",
    d.way_id AS "WayID",
    d.merchant AS "Merchant",
    d.customer_name AS "CustomerName",
    d.address AS "Address",
    d.collection_type AS "CollectionType",
    d.payment_method AS "PaymentMethod",
    d.amount_cash AS "AmountCash",
    d.amount_transaction AS "AmountTransaction",
    d.delivery_status AS "DeliveryStatus",
    d.rider_remark AS "RiderRemark",
    d.customer_review_rating AS "CustomerReviewRating",
    d.customer_review_text AS "CustomerReviewText",
    d.signature_url AS "SignatureUrl",
    COALESCE(d.driver_name, gs.driver_name) AS "DriverName",
    COALESCE(d.helper_name, gs.helper_name) AS "HelperName",
    COALESCE(d.rider_name, gs.rider_name) AS "RiderName",
    d.total_amount AS "TotalAmount",
    d.collected_cash AS "CollectedCash",
    d.collected_transaction AS "CollectedTransaction"
   FROM (public.deliveries d
     JOIN public.group_shipments gs ON ((gs.group_shipment_id = d.group_shipment_id)));


create or replace view "public"."v_daily_summary" as  SELECT gs.shipment_date AS "Date",
    d.group_shipment_id AS "GroupShipmentId",
    count(*) AS "TotalRows",
    count(*) FILTER (WHERE (d.delivery_status = 'DELIVERED'::public.delivery_status_enum)) AS "DeliveredCount",
    count(*) FILTER (WHERE (d.delivery_status = 'RETURN'::public.delivery_status_enum)) AS "ReturnCount",
    count(*) FILTER (WHERE (d.delivery_status = 'REJECT'::public.delivery_status_enum)) AS "RejectCount",
    sum(d.collected_cash) AS "CashCollected",
    sum(d.collected_transaction) AS "TransactionCollected",
    sum((d.collected_cash + d.collected_transaction)) AS "TotalCollected",
    sum(d.total_amount) FILTER (WHERE (d.collection_type = 'COD'::public.collection_type_enum)) AS "CODTotal",
    sum(d.total_amount) FILTER (WHERE ((d.collection_type = 'COD'::public.collection_type_enum) AND (d.delivery_status <> 'DELIVERED'::public.delivery_status_enum))) AS "CODOutstandingNotDelivered",
    sum(d.total_amount) FILTER (WHERE (d.collection_type = 'PREPAID'::public.collection_type_enum)) AS "PrepaidTotal"
   FROM (public.deliveries d
     JOIN public.group_shipments gs ON ((gs.group_shipment_id = d.group_shipment_id)))
  GROUP BY gs.shipment_date, d.group_shipment_id;


create or replace view "public"."v_my_session_home" as  SELECT p.email,
    p.role,
    p.must_change_password,
    rr.home_path
   FROM (public.profiles p
     JOIN public.role_routes rr ON ((rr.role = p.role)))
  WHERE (p.id = auth.uid());


create or replace view "public"."v_rider_kpi" as  SELECT gs.shipment_date AS "Date",
    d.group_shipment_id AS "GroupShipmentId",
    COALESCE(d.rider_name, gs.rider_name) AS "RiderName",
    count(*) AS "Assigned",
    count(*) FILTER (WHERE (d.delivery_status = 'DELIVERED'::public.delivery_status_enum)) AS "Delivered",
    count(*) FILTER (WHERE (d.delivery_status = 'RETURN'::public.delivery_status_enum)) AS "Return",
    count(*) FILTER (WHERE (d.delivery_status = 'REJECT'::public.delivery_status_enum)) AS "Reject",
        CASE
            WHEN (count(*) = 0) THEN (0)::numeric
            ELSE ((count(*) FILTER (WHERE (d.delivery_status = 'DELIVERED'::public.delivery_status_enum)))::numeric / (count(*))::numeric)
        END AS "DoneRate",
    sum(d.collected_cash) AS "CashCollected",
    sum(d.collected_transaction) AS "TransactionCollected",
    avg(d.customer_review_rating) FILTER (WHERE (d.customer_review_rating IS NOT NULL)) AS "AvgRating",
    count(*) FILTER (WHERE (d.customer_review_rating IS NOT NULL)) AS "ReviewsCount"
   FROM (public.deliveries d
     JOIN public.group_shipments gs ON ((gs.group_shipment_id = d.group_shipment_id)))
  GROUP BY gs.shipment_date, d.group_shipment_id, COALESCE(d.rider_name, gs.rider_name);


CREATE OR REPLACE FUNCTION public.validate_password_policy(password text)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Password must be at least 12 characters
  IF LENGTH(password) < 12 THEN
    RETURN FALSE;
  END IF;
  
  -- Must contain uppercase letter
  IF password !~ '[A-Z]' THEN
    RETURN FALSE;
  END IF;
  
  -- Must contain lowercase letter
  IF password !~ '[a-z]' THEN
    RETURN FALSE;
  END IF;
  
  -- Must contain number
  IF password !~ '[0-9]' THEN
    RETURN FALSE;
  END IF;
  
  -- Must contain special character
  IF password !~ '[!@#$%^&*(),.?":{}|<>]' THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."admin_users_2026_02_04_16_00" to "anon";

grant insert on table "public"."admin_users_2026_02_04_16_00" to "anon";

grant references on table "public"."admin_users_2026_02_04_16_00" to "anon";

grant select on table "public"."admin_users_2026_02_04_16_00" to "anon";

grant trigger on table "public"."admin_users_2026_02_04_16_00" to "anon";

grant truncate on table "public"."admin_users_2026_02_04_16_00" to "anon";

grant update on table "public"."admin_users_2026_02_04_16_00" to "anon";

grant delete on table "public"."admin_users_2026_02_04_16_00" to "authenticated";

grant insert on table "public"."admin_users_2026_02_04_16_00" to "authenticated";

grant references on table "public"."admin_users_2026_02_04_16_00" to "authenticated";

grant select on table "public"."admin_users_2026_02_04_16_00" to "authenticated";

grant trigger on table "public"."admin_users_2026_02_04_16_00" to "authenticated";

grant truncate on table "public"."admin_users_2026_02_04_16_00" to "authenticated";

grant update on table "public"."admin_users_2026_02_04_16_00" to "authenticated";

grant delete on table "public"."admin_users_2026_02_04_16_00" to "service_role";

grant insert on table "public"."admin_users_2026_02_04_16_00" to "service_role";

grant references on table "public"."admin_users_2026_02_04_16_00" to "service_role";

grant select on table "public"."admin_users_2026_02_04_16_00" to "service_role";

grant trigger on table "public"."admin_users_2026_02_04_16_00" to "service_role";

grant truncate on table "public"."admin_users_2026_02_04_16_00" to "service_role";

grant update on table "public"."admin_users_2026_02_04_16_00" to "service_role";

grant delete on table "public"."audit_logs" to "anon";

grant insert on table "public"."audit_logs" to "anon";

grant references on table "public"."audit_logs" to "anon";

grant select on table "public"."audit_logs" to "anon";

grant trigger on table "public"."audit_logs" to "anon";

grant truncate on table "public"."audit_logs" to "anon";

grant update on table "public"."audit_logs" to "anon";

grant delete on table "public"."audit_logs" to "authenticated";

grant insert on table "public"."audit_logs" to "authenticated";

grant references on table "public"."audit_logs" to "authenticated";

grant select on table "public"."audit_logs" to "authenticated";

grant trigger on table "public"."audit_logs" to "authenticated";

grant truncate on table "public"."audit_logs" to "authenticated";

grant update on table "public"."audit_logs" to "authenticated";

grant delete on table "public"."audit_logs" to "service_role";

grant insert on table "public"."audit_logs" to "service_role";

grant references on table "public"."audit_logs" to "service_role";

grant select on table "public"."audit_logs" to "service_role";

grant trigger on table "public"."audit_logs" to "service_role";

grant truncate on table "public"."audit_logs" to "service_role";

grant update on table "public"."audit_logs" to "service_role";

grant delete on table "public"."automated_reports" to "anon";

grant insert on table "public"."automated_reports" to "anon";

grant references on table "public"."automated_reports" to "anon";

grant select on table "public"."automated_reports" to "anon";

grant trigger on table "public"."automated_reports" to "anon";

grant truncate on table "public"."automated_reports" to "anon";

grant update on table "public"."automated_reports" to "anon";

grant delete on table "public"."automated_reports" to "authenticated";

grant insert on table "public"."automated_reports" to "authenticated";

grant references on table "public"."automated_reports" to "authenticated";

grant select on table "public"."automated_reports" to "authenticated";

grant trigger on table "public"."automated_reports" to "authenticated";

grant truncate on table "public"."automated_reports" to "authenticated";

grant update on table "public"."automated_reports" to "authenticated";

grant delete on table "public"."automated_reports" to "service_role";

grant insert on table "public"."automated_reports" to "service_role";

grant references on table "public"."automated_reports" to "service_role";

grant select on table "public"."automated_reports" to "service_role";

grant trigger on table "public"."automated_reports" to "service_role";

grant truncate on table "public"."automated_reports" to "service_role";

grant update on table "public"."automated_reports" to "service_role";

grant delete on table "public"."branches" to "anon";

grant insert on table "public"."branches" to "anon";

grant references on table "public"."branches" to "anon";

grant select on table "public"."branches" to "anon";

grant trigger on table "public"."branches" to "anon";

grant truncate on table "public"."branches" to "anon";

grant update on table "public"."branches" to "anon";

grant delete on table "public"."branches" to "authenticated";

grant insert on table "public"."branches" to "authenticated";

grant references on table "public"."branches" to "authenticated";

grant select on table "public"."branches" to "authenticated";

grant trigger on table "public"."branches" to "authenticated";

grant truncate on table "public"."branches" to "authenticated";

grant update on table "public"."branches" to "authenticated";

grant delete on table "public"."branches" to "service_role";

grant insert on table "public"."branches" to "service_role";

grant references on table "public"."branches" to "service_role";

grant select on table "public"."branches" to "service_role";

grant trigger on table "public"."branches" to "service_role";

grant truncate on table "public"."branches" to "service_role";

grant update on table "public"."branches" to "service_role";

grant delete on table "public"."broadcast_messages" to "anon";

grant insert on table "public"."broadcast_messages" to "anon";

grant references on table "public"."broadcast_messages" to "anon";

grant select on table "public"."broadcast_messages" to "anon";

grant trigger on table "public"."broadcast_messages" to "anon";

grant truncate on table "public"."broadcast_messages" to "anon";

grant update on table "public"."broadcast_messages" to "anon";

grant delete on table "public"."broadcast_messages" to "authenticated";

grant insert on table "public"."broadcast_messages" to "authenticated";

grant references on table "public"."broadcast_messages" to "authenticated";

grant select on table "public"."broadcast_messages" to "authenticated";

grant trigger on table "public"."broadcast_messages" to "authenticated";

grant truncate on table "public"."broadcast_messages" to "authenticated";

grant update on table "public"."broadcast_messages" to "authenticated";

grant delete on table "public"."broadcast_messages" to "service_role";

grant insert on table "public"."broadcast_messages" to "service_role";

grant references on table "public"."broadcast_messages" to "service_role";

grant select on table "public"."broadcast_messages" to "service_role";

grant trigger on table "public"."broadcast_messages" to "service_role";

grant truncate on table "public"."broadcast_messages" to "service_role";

grant update on table "public"."broadcast_messages" to "service_role";

grant delete on table "public"."bulk_upload_items_2026_02_04_16_00" to "anon";

grant insert on table "public"."bulk_upload_items_2026_02_04_16_00" to "anon";

grant references on table "public"."bulk_upload_items_2026_02_04_16_00" to "anon";

grant select on table "public"."bulk_upload_items_2026_02_04_16_00" to "anon";

grant trigger on table "public"."bulk_upload_items_2026_02_04_16_00" to "anon";

grant truncate on table "public"."bulk_upload_items_2026_02_04_16_00" to "anon";

grant update on table "public"."bulk_upload_items_2026_02_04_16_00" to "anon";

grant delete on table "public"."bulk_upload_items_2026_02_04_16_00" to "authenticated";

grant insert on table "public"."bulk_upload_items_2026_02_04_16_00" to "authenticated";

grant references on table "public"."bulk_upload_items_2026_02_04_16_00" to "authenticated";

grant select on table "public"."bulk_upload_items_2026_02_04_16_00" to "authenticated";

grant trigger on table "public"."bulk_upload_items_2026_02_04_16_00" to "authenticated";

grant truncate on table "public"."bulk_upload_items_2026_02_04_16_00" to "authenticated";

grant update on table "public"."bulk_upload_items_2026_02_04_16_00" to "authenticated";

grant delete on table "public"."bulk_upload_items_2026_02_04_16_00" to "service_role";

grant insert on table "public"."bulk_upload_items_2026_02_04_16_00" to "service_role";

grant references on table "public"."bulk_upload_items_2026_02_04_16_00" to "service_role";

grant select on table "public"."bulk_upload_items_2026_02_04_16_00" to "service_role";

grant trigger on table "public"."bulk_upload_items_2026_02_04_16_00" to "service_role";

grant truncate on table "public"."bulk_upload_items_2026_02_04_16_00" to "service_role";

grant update on table "public"."bulk_upload_items_2026_02_04_16_00" to "service_role";

grant delete on table "public"."bulk_uploads_2026_02_04_16_00" to "anon";

grant insert on table "public"."bulk_uploads_2026_02_04_16_00" to "anon";

grant references on table "public"."bulk_uploads_2026_02_04_16_00" to "anon";

grant select on table "public"."bulk_uploads_2026_02_04_16_00" to "anon";

grant trigger on table "public"."bulk_uploads_2026_02_04_16_00" to "anon";

grant truncate on table "public"."bulk_uploads_2026_02_04_16_00" to "anon";

grant update on table "public"."bulk_uploads_2026_02_04_16_00" to "anon";

grant delete on table "public"."bulk_uploads_2026_02_04_16_00" to "authenticated";

grant insert on table "public"."bulk_uploads_2026_02_04_16_00" to "authenticated";

grant references on table "public"."bulk_uploads_2026_02_04_16_00" to "authenticated";

grant select on table "public"."bulk_uploads_2026_02_04_16_00" to "authenticated";

grant trigger on table "public"."bulk_uploads_2026_02_04_16_00" to "authenticated";

grant truncate on table "public"."bulk_uploads_2026_02_04_16_00" to "authenticated";

grant update on table "public"."bulk_uploads_2026_02_04_16_00" to "authenticated";

grant delete on table "public"."bulk_uploads_2026_02_04_16_00" to "service_role";

grant insert on table "public"."bulk_uploads_2026_02_04_16_00" to "service_role";

grant references on table "public"."bulk_uploads_2026_02_04_16_00" to "service_role";

grant select on table "public"."bulk_uploads_2026_02_04_16_00" to "service_role";

grant trigger on table "public"."bulk_uploads_2026_02_04_16_00" to "service_role";

grant truncate on table "public"."bulk_uploads_2026_02_04_16_00" to "service_role";

grant update on table "public"."bulk_uploads_2026_02_04_16_00" to "service_role";

grant delete on table "public"."cash_advances" to "anon";

grant insert on table "public"."cash_advances" to "anon";

grant references on table "public"."cash_advances" to "anon";

grant select on table "public"."cash_advances" to "anon";

grant trigger on table "public"."cash_advances" to "anon";

grant truncate on table "public"."cash_advances" to "anon";

grant update on table "public"."cash_advances" to "anon";

grant delete on table "public"."cash_advances" to "authenticated";

grant insert on table "public"."cash_advances" to "authenticated";

grant references on table "public"."cash_advances" to "authenticated";

grant select on table "public"."cash_advances" to "authenticated";

grant trigger on table "public"."cash_advances" to "authenticated";

grant truncate on table "public"."cash_advances" to "authenticated";

grant update on table "public"."cash_advances" to "authenticated";

grant delete on table "public"."cash_advances" to "service_role";

grant insert on table "public"."cash_advances" to "service_role";

grant references on table "public"."cash_advances" to "service_role";

grant select on table "public"."cash_advances" to "service_role";

grant trigger on table "public"."cash_advances" to "service_role";

grant truncate on table "public"."cash_advances" to "service_role";

grant update on table "public"."cash_advances" to "service_role";

grant delete on table "public"."content_pages_2026_02_03_21_00" to "anon";

grant insert on table "public"."content_pages_2026_02_03_21_00" to "anon";

grant references on table "public"."content_pages_2026_02_03_21_00" to "anon";

grant select on table "public"."content_pages_2026_02_03_21_00" to "anon";

grant trigger on table "public"."content_pages_2026_02_03_21_00" to "anon";

grant truncate on table "public"."content_pages_2026_02_03_21_00" to "anon";

grant update on table "public"."content_pages_2026_02_03_21_00" to "anon";

grant delete on table "public"."content_pages_2026_02_03_21_00" to "authenticated";

grant insert on table "public"."content_pages_2026_02_03_21_00" to "authenticated";

grant references on table "public"."content_pages_2026_02_03_21_00" to "authenticated";

grant select on table "public"."content_pages_2026_02_03_21_00" to "authenticated";

grant trigger on table "public"."content_pages_2026_02_03_21_00" to "authenticated";

grant truncate on table "public"."content_pages_2026_02_03_21_00" to "authenticated";

grant update on table "public"."content_pages_2026_02_03_21_00" to "authenticated";

grant delete on table "public"."content_pages_2026_02_03_21_00" to "service_role";

grant insert on table "public"."content_pages_2026_02_03_21_00" to "service_role";

grant references on table "public"."content_pages_2026_02_03_21_00" to "service_role";

grant select on table "public"."content_pages_2026_02_03_21_00" to "service_role";

grant trigger on table "public"."content_pages_2026_02_03_21_00" to "service_role";

grant truncate on table "public"."content_pages_2026_02_03_21_00" to "service_role";

grant update on table "public"."content_pages_2026_02_03_21_00" to "service_role";

grant delete on table "public"."customer_acknowledgments_2026_02_04_15_54" to "anon";

grant insert on table "public"."customer_acknowledgments_2026_02_04_15_54" to "anon";

grant references on table "public"."customer_acknowledgments_2026_02_04_15_54" to "anon";

grant select on table "public"."customer_acknowledgments_2026_02_04_15_54" to "anon";

grant trigger on table "public"."customer_acknowledgments_2026_02_04_15_54" to "anon";

grant truncate on table "public"."customer_acknowledgments_2026_02_04_15_54" to "anon";

grant update on table "public"."customer_acknowledgments_2026_02_04_15_54" to "anon";

grant delete on table "public"."customer_acknowledgments_2026_02_04_15_54" to "authenticated";

grant insert on table "public"."customer_acknowledgments_2026_02_04_15_54" to "authenticated";

grant references on table "public"."customer_acknowledgments_2026_02_04_15_54" to "authenticated";

grant select on table "public"."customer_acknowledgments_2026_02_04_15_54" to "authenticated";

grant trigger on table "public"."customer_acknowledgments_2026_02_04_15_54" to "authenticated";

grant truncate on table "public"."customer_acknowledgments_2026_02_04_15_54" to "authenticated";

grant update on table "public"."customer_acknowledgments_2026_02_04_15_54" to "authenticated";

grant delete on table "public"."customer_acknowledgments_2026_02_04_15_54" to "service_role";

grant insert on table "public"."customer_acknowledgments_2026_02_04_15_54" to "service_role";

grant references on table "public"."customer_acknowledgments_2026_02_04_15_54" to "service_role";

grant select on table "public"."customer_acknowledgments_2026_02_04_15_54" to "service_role";

grant trigger on table "public"."customer_acknowledgments_2026_02_04_15_54" to "service_role";

grant truncate on table "public"."customer_acknowledgments_2026_02_04_15_54" to "service_role";

grant update on table "public"."customer_acknowledgments_2026_02_04_15_54" to "service_role";

grant delete on table "public"."customer_service_interactions_2026_02_04_16_00" to "anon";

grant insert on table "public"."customer_service_interactions_2026_02_04_16_00" to "anon";

grant references on table "public"."customer_service_interactions_2026_02_04_16_00" to "anon";

grant select on table "public"."customer_service_interactions_2026_02_04_16_00" to "anon";

grant trigger on table "public"."customer_service_interactions_2026_02_04_16_00" to "anon";

grant truncate on table "public"."customer_service_interactions_2026_02_04_16_00" to "anon";

grant update on table "public"."customer_service_interactions_2026_02_04_16_00" to "anon";

grant delete on table "public"."customer_service_interactions_2026_02_04_16_00" to "authenticated";

grant insert on table "public"."customer_service_interactions_2026_02_04_16_00" to "authenticated";

grant references on table "public"."customer_service_interactions_2026_02_04_16_00" to "authenticated";

grant select on table "public"."customer_service_interactions_2026_02_04_16_00" to "authenticated";

grant trigger on table "public"."customer_service_interactions_2026_02_04_16_00" to "authenticated";

grant truncate on table "public"."customer_service_interactions_2026_02_04_16_00" to "authenticated";

grant update on table "public"."customer_service_interactions_2026_02_04_16_00" to "authenticated";

grant delete on table "public"."customer_service_interactions_2026_02_04_16_00" to "service_role";

grant insert on table "public"."customer_service_interactions_2026_02_04_16_00" to "service_role";

grant references on table "public"."customer_service_interactions_2026_02_04_16_00" to "service_role";

grant select on table "public"."customer_service_interactions_2026_02_04_16_00" to "service_role";

grant trigger on table "public"."customer_service_interactions_2026_02_04_16_00" to "service_role";

grant truncate on table "public"."customer_service_interactions_2026_02_04_16_00" to "service_role";

grant update on table "public"."customer_service_interactions_2026_02_04_16_00" to "service_role";

grant delete on table "public"."customers" to "anon";

grant insert on table "public"."customers" to "anon";

grant references on table "public"."customers" to "anon";

grant select on table "public"."customers" to "anon";

grant trigger on table "public"."customers" to "anon";

grant truncate on table "public"."customers" to "anon";

grant update on table "public"."customers" to "anon";

grant delete on table "public"."customers" to "authenticated";

grant insert on table "public"."customers" to "authenticated";

grant references on table "public"."customers" to "authenticated";

grant select on table "public"."customers" to "authenticated";

grant trigger on table "public"."customers" to "authenticated";

grant truncate on table "public"."customers" to "authenticated";

grant update on table "public"."customers" to "authenticated";

grant delete on table "public"."customers" to "service_role";

grant insert on table "public"."customers" to "service_role";

grant references on table "public"."customers" to "service_role";

grant select on table "public"."customers" to "service_role";

grant trigger on table "public"."customers" to "service_role";

grant truncate on table "public"."customers" to "service_role";

grant update on table "public"."customers" to "service_role";

grant delete on table "public"."deliveries" to "anon";

grant insert on table "public"."deliveries" to "anon";

grant references on table "public"."deliveries" to "anon";

grant select on table "public"."deliveries" to "anon";

grant trigger on table "public"."deliveries" to "anon";

grant truncate on table "public"."deliveries" to "anon";

grant update on table "public"."deliveries" to "anon";

grant delete on table "public"."deliveries" to "authenticated";

grant insert on table "public"."deliveries" to "authenticated";

grant references on table "public"."deliveries" to "authenticated";

grant select on table "public"."deliveries" to "authenticated";

grant trigger on table "public"."deliveries" to "authenticated";

grant truncate on table "public"."deliveries" to "authenticated";

grant update on table "public"."deliveries" to "authenticated";

grant delete on table "public"."deliveries" to "service_role";

grant insert on table "public"."deliveries" to "service_role";

grant references on table "public"."deliveries" to "service_role";

grant select on table "public"."deliveries" to "service_role";

grant trigger on table "public"."deliveries" to "service_role";

grant truncate on table "public"."deliveries" to "service_role";

grant update on table "public"."deliveries" to "service_role";

grant delete on table "public"."delivery_routes" to "anon";

grant insert on table "public"."delivery_routes" to "anon";

grant references on table "public"."delivery_routes" to "anon";

grant select on table "public"."delivery_routes" to "anon";

grant trigger on table "public"."delivery_routes" to "anon";

grant truncate on table "public"."delivery_routes" to "anon";

grant update on table "public"."delivery_routes" to "anon";

grant delete on table "public"."delivery_routes" to "authenticated";

grant insert on table "public"."delivery_routes" to "authenticated";

grant references on table "public"."delivery_routes" to "authenticated";

grant select on table "public"."delivery_routes" to "authenticated";

grant trigger on table "public"."delivery_routes" to "authenticated";

grant truncate on table "public"."delivery_routes" to "authenticated";

grant update on table "public"."delivery_routes" to "authenticated";

grant delete on table "public"."delivery_routes" to "service_role";

grant insert on table "public"."delivery_routes" to "service_role";

grant references on table "public"."delivery_routes" to "service_role";

grant select on table "public"."delivery_routes" to "service_role";

grant trigger on table "public"."delivery_routes" to "service_role";

grant truncate on table "public"."delivery_routes" to "service_role";

grant update on table "public"."delivery_routes" to "service_role";

grant delete on table "public"."delivery_ways" to "anon";

grant insert on table "public"."delivery_ways" to "anon";

grant references on table "public"."delivery_ways" to "anon";

grant select on table "public"."delivery_ways" to "anon";

grant trigger on table "public"."delivery_ways" to "anon";

grant truncate on table "public"."delivery_ways" to "anon";

grant update on table "public"."delivery_ways" to "anon";

grant delete on table "public"."delivery_ways" to "authenticated";

grant insert on table "public"."delivery_ways" to "authenticated";

grant references on table "public"."delivery_ways" to "authenticated";

grant select on table "public"."delivery_ways" to "authenticated";

grant trigger on table "public"."delivery_ways" to "authenticated";

grant truncate on table "public"."delivery_ways" to "authenticated";

grant update on table "public"."delivery_ways" to "authenticated";

grant delete on table "public"."delivery_ways" to "service_role";

grant insert on table "public"."delivery_ways" to "service_role";

grant references on table "public"."delivery_ways" to "service_role";

grant select on table "public"."delivery_ways" to "service_role";

grant trigger on table "public"."delivery_ways" to "service_role";

grant truncate on table "public"."delivery_ways" to "service_role";

grant update on table "public"."delivery_ways" to "service_role";

grant delete on table "public"."deliverymen_be" to "anon";

grant insert on table "public"."deliverymen_be" to "anon";

grant references on table "public"."deliverymen_be" to "anon";

grant select on table "public"."deliverymen_be" to "anon";

grant trigger on table "public"."deliverymen_be" to "anon";

grant truncate on table "public"."deliverymen_be" to "anon";

grant update on table "public"."deliverymen_be" to "anon";

grant delete on table "public"."deliverymen_be" to "authenticated";

grant insert on table "public"."deliverymen_be" to "authenticated";

grant references on table "public"."deliverymen_be" to "authenticated";

grant select on table "public"."deliverymen_be" to "authenticated";

grant trigger on table "public"."deliverymen_be" to "authenticated";

grant truncate on table "public"."deliverymen_be" to "authenticated";

grant update on table "public"."deliverymen_be" to "authenticated";

grant delete on table "public"."deliverymen_be" to "service_role";

grant insert on table "public"."deliverymen_be" to "service_role";

grant references on table "public"."deliverymen_be" to "service_role";

grant select on table "public"."deliverymen_be" to "service_role";

grant trigger on table "public"."deliverymen_be" to "service_role";

grant truncate on table "public"."deliverymen_be" to "service_role";

grant update on table "public"."deliverymen_be" to "service_role";

grant delete on table "public"."departments" to "anon";

grant insert on table "public"."departments" to "anon";

grant references on table "public"."departments" to "anon";

grant select on table "public"."departments" to "anon";

grant trigger on table "public"."departments" to "anon";

grant truncate on table "public"."departments" to "anon";

grant update on table "public"."departments" to "anon";

grant delete on table "public"."departments" to "authenticated";

grant insert on table "public"."departments" to "authenticated";

grant references on table "public"."departments" to "authenticated";

grant select on table "public"."departments" to "authenticated";

grant trigger on table "public"."departments" to "authenticated";

grant truncate on table "public"."departments" to "authenticated";

grant update on table "public"."departments" to "authenticated";

grant delete on table "public"."departments" to "service_role";

grant insert on table "public"."departments" to "service_role";

grant references on table "public"."departments" to "service_role";

grant select on table "public"."departments" to "service_role";

grant trigger on table "public"."departments" to "service_role";

grant truncate on table "public"."departments" to "service_role";

grant update on table "public"."departments" to "service_role";

grant delete on table "public"."digital_signatures" to "anon";

grant insert on table "public"."digital_signatures" to "anon";

grant references on table "public"."digital_signatures" to "anon";

grant select on table "public"."digital_signatures" to "anon";

grant trigger on table "public"."digital_signatures" to "anon";

grant truncate on table "public"."digital_signatures" to "anon";

grant update on table "public"."digital_signatures" to "anon";

grant delete on table "public"."digital_signatures" to "authenticated";

grant insert on table "public"."digital_signatures" to "authenticated";

grant references on table "public"."digital_signatures" to "authenticated";

grant select on table "public"."digital_signatures" to "authenticated";

grant trigger on table "public"."digital_signatures" to "authenticated";

grant truncate on table "public"."digital_signatures" to "authenticated";

grant update on table "public"."digital_signatures" to "authenticated";

grant delete on table "public"."digital_signatures" to "service_role";

grant insert on table "public"."digital_signatures" to "service_role";

grant references on table "public"."digital_signatures" to "service_role";

grant select on table "public"."digital_signatures" to "service_role";

grant trigger on table "public"."digital_signatures" to "service_role";

grant truncate on table "public"."digital_signatures" to "service_role";

grant update on table "public"."digital_signatures" to "service_role";

grant delete on table "public"."driver_telemetry" to "anon";

grant insert on table "public"."driver_telemetry" to "anon";

grant references on table "public"."driver_telemetry" to "anon";

grant select on table "public"."driver_telemetry" to "anon";

grant trigger on table "public"."driver_telemetry" to "anon";

grant truncate on table "public"."driver_telemetry" to "anon";

grant update on table "public"."driver_telemetry" to "anon";

grant delete on table "public"."driver_telemetry" to "authenticated";

grant insert on table "public"."driver_telemetry" to "authenticated";

grant references on table "public"."driver_telemetry" to "authenticated";

grant select on table "public"."driver_telemetry" to "authenticated";

grant trigger on table "public"."driver_telemetry" to "authenticated";

grant truncate on table "public"."driver_telemetry" to "authenticated";

grant update on table "public"."driver_telemetry" to "authenticated";

grant delete on table "public"."driver_telemetry" to "service_role";

grant insert on table "public"."driver_telemetry" to "service_role";

grant references on table "public"."driver_telemetry" to "service_role";

grant select on table "public"."driver_telemetry" to "service_role";

grant trigger on table "public"."driver_telemetry" to "service_role";

grant truncate on table "public"."driver_telemetry" to "service_role";

grant update on table "public"."driver_telemetry" to "service_role";

grant delete on table "public"."employees" to "anon";

grant insert on table "public"."employees" to "anon";

grant references on table "public"."employees" to "anon";

grant select on table "public"."employees" to "anon";

grant trigger on table "public"."employees" to "anon";

grant truncate on table "public"."employees" to "anon";

grant update on table "public"."employees" to "anon";

grant delete on table "public"."employees" to "authenticated";

grant insert on table "public"."employees" to "authenticated";

grant references on table "public"."employees" to "authenticated";

grant select on table "public"."employees" to "authenticated";

grant trigger on table "public"."employees" to "authenticated";

grant truncate on table "public"."employees" to "authenticated";

grant update on table "public"."employees" to "authenticated";

grant delete on table "public"."employees" to "service_role";

grant insert on table "public"."employees" to "service_role";

grant references on table "public"."employees" to "service_role";

grant select on table "public"."employees" to "service_role";

grant trigger on table "public"."employees" to "service_role";

grant truncate on table "public"."employees" to "service_role";

grant update on table "public"."employees" to "service_role";

grant delete on table "public"."failed_deliveries" to "anon";

grant insert on table "public"."failed_deliveries" to "anon";

grant references on table "public"."failed_deliveries" to "anon";

grant select on table "public"."failed_deliveries" to "anon";

grant trigger on table "public"."failed_deliveries" to "anon";

grant truncate on table "public"."failed_deliveries" to "anon";

grant update on table "public"."failed_deliveries" to "anon";

grant delete on table "public"."failed_deliveries" to "authenticated";

grant insert on table "public"."failed_deliveries" to "authenticated";

grant references on table "public"."failed_deliveries" to "authenticated";

grant select on table "public"."failed_deliveries" to "authenticated";

grant trigger on table "public"."failed_deliveries" to "authenticated";

grant truncate on table "public"."failed_deliveries" to "authenticated";

grant update on table "public"."failed_deliveries" to "authenticated";

grant delete on table "public"."failed_deliveries" to "service_role";

grant insert on table "public"."failed_deliveries" to "service_role";

grant references on table "public"."failed_deliveries" to "service_role";

grant select on table "public"."failed_deliveries" to "service_role";

grant trigger on table "public"."failed_deliveries" to "service_role";

grant truncate on table "public"."failed_deliveries" to "service_role";

grant update on table "public"."failed_deliveries" to "service_role";

grant delete on table "public"."faqs_2026_02_03_21_00" to "anon";

grant insert on table "public"."faqs_2026_02_03_21_00" to "anon";

grant references on table "public"."faqs_2026_02_03_21_00" to "anon";

grant select on table "public"."faqs_2026_02_03_21_00" to "anon";

grant trigger on table "public"."faqs_2026_02_03_21_00" to "anon";

grant truncate on table "public"."faqs_2026_02_03_21_00" to "anon";

grant update on table "public"."faqs_2026_02_03_21_00" to "anon";

grant delete on table "public"."faqs_2026_02_03_21_00" to "authenticated";

grant insert on table "public"."faqs_2026_02_03_21_00" to "authenticated";

grant references on table "public"."faqs_2026_02_03_21_00" to "authenticated";

grant select on table "public"."faqs_2026_02_03_21_00" to "authenticated";

grant trigger on table "public"."faqs_2026_02_03_21_00" to "authenticated";

grant truncate on table "public"."faqs_2026_02_03_21_00" to "authenticated";

grant update on table "public"."faqs_2026_02_03_21_00" to "authenticated";

grant delete on table "public"."faqs_2026_02_03_21_00" to "service_role";

grant insert on table "public"."faqs_2026_02_03_21_00" to "service_role";

grant references on table "public"."faqs_2026_02_03_21_00" to "service_role";

grant select on table "public"."faqs_2026_02_03_21_00" to "service_role";

grant trigger on table "public"."faqs_2026_02_03_21_00" to "service_role";

grant truncate on table "public"."faqs_2026_02_03_21_00" to "service_role";

grant update on table "public"."faqs_2026_02_03_21_00" to "service_role";

grant delete on table "public"."financial_transactions" to "anon";

grant insert on table "public"."financial_transactions" to "anon";

grant references on table "public"."financial_transactions" to "anon";

grant select on table "public"."financial_transactions" to "anon";

grant trigger on table "public"."financial_transactions" to "anon";

grant truncate on table "public"."financial_transactions" to "anon";

grant update on table "public"."financial_transactions" to "anon";

grant delete on table "public"."financial_transactions" to "authenticated";

grant insert on table "public"."financial_transactions" to "authenticated";

grant references on table "public"."financial_transactions" to "authenticated";

grant select on table "public"."financial_transactions" to "authenticated";

grant trigger on table "public"."financial_transactions" to "authenticated";

grant truncate on table "public"."financial_transactions" to "authenticated";

grant update on table "public"."financial_transactions" to "authenticated";

grant delete on table "public"."financial_transactions" to "service_role";

grant insert on table "public"."financial_transactions" to "service_role";

grant references on table "public"."financial_transactions" to "service_role";

grant select on table "public"."financial_transactions" to "service_role";

grant trigger on table "public"."financial_transactions" to "service_role";

grant truncate on table "public"."financial_transactions" to "service_role";

grant update on table "public"."financial_transactions" to "service_role";

grant delete on table "public"."form_submissions" to "anon";

grant insert on table "public"."form_submissions" to "anon";

grant references on table "public"."form_submissions" to "anon";

grant select on table "public"."form_submissions" to "anon";

grant trigger on table "public"."form_submissions" to "anon";

grant truncate on table "public"."form_submissions" to "anon";

grant update on table "public"."form_submissions" to "anon";

grant delete on table "public"."form_submissions" to "authenticated";

grant insert on table "public"."form_submissions" to "authenticated";

grant references on table "public"."form_submissions" to "authenticated";

grant select on table "public"."form_submissions" to "authenticated";

grant trigger on table "public"."form_submissions" to "authenticated";

grant truncate on table "public"."form_submissions" to "authenticated";

grant update on table "public"."form_submissions" to "authenticated";

grant delete on table "public"."form_submissions" to "service_role";

grant insert on table "public"."form_submissions" to "service_role";

grant references on table "public"."form_submissions" to "service_role";

grant select on table "public"."form_submissions" to "service_role";

grant trigger on table "public"."form_submissions" to "service_role";

grant truncate on table "public"."form_submissions" to "service_role";

grant update on table "public"."form_submissions" to "service_role";

grant delete on table "public"."fuel_anomalies" to "anon";

grant insert on table "public"."fuel_anomalies" to "anon";

grant references on table "public"."fuel_anomalies" to "anon";

grant select on table "public"."fuel_anomalies" to "anon";

grant trigger on table "public"."fuel_anomalies" to "anon";

grant truncate on table "public"."fuel_anomalies" to "anon";

grant update on table "public"."fuel_anomalies" to "anon";

grant delete on table "public"."fuel_anomalies" to "authenticated";

grant insert on table "public"."fuel_anomalies" to "authenticated";

grant references on table "public"."fuel_anomalies" to "authenticated";

grant select on table "public"."fuel_anomalies" to "authenticated";

grant trigger on table "public"."fuel_anomalies" to "authenticated";

grant truncate on table "public"."fuel_anomalies" to "authenticated";

grant update on table "public"."fuel_anomalies" to "authenticated";

grant delete on table "public"."fuel_anomalies" to "service_role";

grant insert on table "public"."fuel_anomalies" to "service_role";

grant references on table "public"."fuel_anomalies" to "service_role";

grant select on table "public"."fuel_anomalies" to "service_role";

grant trigger on table "public"."fuel_anomalies" to "service_role";

grant truncate on table "public"."fuel_anomalies" to "service_role";

grant update on table "public"."fuel_anomalies" to "service_role";

grant delete on table "public"."group_shipments" to "anon";

grant insert on table "public"."group_shipments" to "anon";

grant references on table "public"."group_shipments" to "anon";

grant select on table "public"."group_shipments" to "anon";

grant trigger on table "public"."group_shipments" to "anon";

grant truncate on table "public"."group_shipments" to "anon";

grant update on table "public"."group_shipments" to "anon";

grant delete on table "public"."group_shipments" to "authenticated";

grant insert on table "public"."group_shipments" to "authenticated";

grant references on table "public"."group_shipments" to "authenticated";

grant select on table "public"."group_shipments" to "authenticated";

grant trigger on table "public"."group_shipments" to "authenticated";

grant truncate on table "public"."group_shipments" to "authenticated";

grant update on table "public"."group_shipments" to "authenticated";

grant delete on table "public"."group_shipments" to "service_role";

grant insert on table "public"."group_shipments" to "service_role";

grant references on table "public"."group_shipments" to "service_role";

grant select on table "public"."group_shipments" to "service_role";

grant trigger on table "public"."group_shipments" to "service_role";

grant truncate on table "public"."group_shipments" to "service_role";

grant update on table "public"."group_shipments" to "service_role";

grant delete on table "public"."invoices" to "anon";

grant insert on table "public"."invoices" to "anon";

grant references on table "public"."invoices" to "anon";

grant select on table "public"."invoices" to "anon";

grant trigger on table "public"."invoices" to "anon";

grant truncate on table "public"."invoices" to "anon";

grant update on table "public"."invoices" to "anon";

grant delete on table "public"."invoices" to "authenticated";

grant insert on table "public"."invoices" to "authenticated";

grant references on table "public"."invoices" to "authenticated";

grant select on table "public"."invoices" to "authenticated";

grant trigger on table "public"."invoices" to "authenticated";

grant truncate on table "public"."invoices" to "authenticated";

grant update on table "public"."invoices" to "authenticated";

grant delete on table "public"."invoices" to "service_role";

grant insert on table "public"."invoices" to "service_role";

grant references on table "public"."invoices" to "service_role";

grant select on table "public"."invoices" to "service_role";

grant trigger on table "public"."invoices" to "service_role";

grant truncate on table "public"."invoices" to "service_role";

grant update on table "public"."invoices" to "service_role";

grant delete on table "public"."marketer_performance_2026_02_04_16_00" to "anon";

grant insert on table "public"."marketer_performance_2026_02_04_16_00" to "anon";

grant references on table "public"."marketer_performance_2026_02_04_16_00" to "anon";

grant select on table "public"."marketer_performance_2026_02_04_16_00" to "anon";

grant trigger on table "public"."marketer_performance_2026_02_04_16_00" to "anon";

grant truncate on table "public"."marketer_performance_2026_02_04_16_00" to "anon";

grant update on table "public"."marketer_performance_2026_02_04_16_00" to "anon";

grant delete on table "public"."marketer_performance_2026_02_04_16_00" to "authenticated";

grant insert on table "public"."marketer_performance_2026_02_04_16_00" to "authenticated";

grant references on table "public"."marketer_performance_2026_02_04_16_00" to "authenticated";

grant select on table "public"."marketer_performance_2026_02_04_16_00" to "authenticated";

grant trigger on table "public"."marketer_performance_2026_02_04_16_00" to "authenticated";

grant truncate on table "public"."marketer_performance_2026_02_04_16_00" to "authenticated";

grant update on table "public"."marketer_performance_2026_02_04_16_00" to "authenticated";

grant delete on table "public"."marketer_performance_2026_02_04_16_00" to "service_role";

grant insert on table "public"."marketer_performance_2026_02_04_16_00" to "service_role";

grant references on table "public"."marketer_performance_2026_02_04_16_00" to "service_role";

grant select on table "public"."marketer_performance_2026_02_04_16_00" to "service_role";

grant trigger on table "public"."marketer_performance_2026_02_04_16_00" to "service_role";

grant truncate on table "public"."marketer_performance_2026_02_04_16_00" to "service_role";

grant update on table "public"."marketer_performance_2026_02_04_16_00" to "service_role";

grant delete on table "public"."marketing_campaigns" to "anon";

grant insert on table "public"."marketing_campaigns" to "anon";

grant references on table "public"."marketing_campaigns" to "anon";

grant select on table "public"."marketing_campaigns" to "anon";

grant trigger on table "public"."marketing_campaigns" to "anon";

grant truncate on table "public"."marketing_campaigns" to "anon";

grant update on table "public"."marketing_campaigns" to "anon";

grant delete on table "public"."marketing_campaigns" to "authenticated";

grant insert on table "public"."marketing_campaigns" to "authenticated";

grant references on table "public"."marketing_campaigns" to "authenticated";

grant select on table "public"."marketing_campaigns" to "authenticated";

grant trigger on table "public"."marketing_campaigns" to "authenticated";

grant truncate on table "public"."marketing_campaigns" to "authenticated";

grant update on table "public"."marketing_campaigns" to "authenticated";

grant delete on table "public"."marketing_campaigns" to "service_role";

grant insert on table "public"."marketing_campaigns" to "service_role";

grant references on table "public"."marketing_campaigns" to "service_role";

grant select on table "public"."marketing_campaigns" to "service_role";

grant trigger on table "public"."marketing_campaigns" to "service_role";

grant truncate on table "public"."marketing_campaigns" to "service_role";

grant update on table "public"."marketing_campaigns" to "service_role";

grant delete on table "public"."merchant_bank_accounts" to "anon";

grant insert on table "public"."merchant_bank_accounts" to "anon";

grant references on table "public"."merchant_bank_accounts" to "anon";

grant select on table "public"."merchant_bank_accounts" to "anon";

grant trigger on table "public"."merchant_bank_accounts" to "anon";

grant truncate on table "public"."merchant_bank_accounts" to "anon";

grant update on table "public"."merchant_bank_accounts" to "anon";

grant delete on table "public"."merchant_bank_accounts" to "authenticated";

grant insert on table "public"."merchant_bank_accounts" to "authenticated";

grant references on table "public"."merchant_bank_accounts" to "authenticated";

grant select on table "public"."merchant_bank_accounts" to "authenticated";

grant trigger on table "public"."merchant_bank_accounts" to "authenticated";

grant truncate on table "public"."merchant_bank_accounts" to "authenticated";

grant update on table "public"."merchant_bank_accounts" to "authenticated";

grant delete on table "public"."merchant_bank_accounts" to "service_role";

grant insert on table "public"."merchant_bank_accounts" to "service_role";

grant references on table "public"."merchant_bank_accounts" to "service_role";

grant select on table "public"."merchant_bank_accounts" to "service_role";

grant trigger on table "public"."merchant_bank_accounts" to "service_role";

grant truncate on table "public"."merchant_bank_accounts" to "service_role";

grant update on table "public"."merchant_bank_accounts" to "service_role";

grant delete on table "public"."merchant_receipts" to "anon";

grant insert on table "public"."merchant_receipts" to "anon";

grant references on table "public"."merchant_receipts" to "anon";

grant select on table "public"."merchant_receipts" to "anon";

grant trigger on table "public"."merchant_receipts" to "anon";

grant truncate on table "public"."merchant_receipts" to "anon";

grant update on table "public"."merchant_receipts" to "anon";

grant delete on table "public"."merchant_receipts" to "authenticated";

grant insert on table "public"."merchant_receipts" to "authenticated";

grant references on table "public"."merchant_receipts" to "authenticated";

grant select on table "public"."merchant_receipts" to "authenticated";

grant trigger on table "public"."merchant_receipts" to "authenticated";

grant truncate on table "public"."merchant_receipts" to "authenticated";

grant update on table "public"."merchant_receipts" to "authenticated";

grant delete on table "public"."merchant_receipts" to "service_role";

grant insert on table "public"."merchant_receipts" to "service_role";

grant references on table "public"."merchant_receipts" to "service_role";

grant select on table "public"."merchant_receipts" to "service_role";

grant trigger on table "public"."merchant_receipts" to "service_role";

grant truncate on table "public"."merchant_receipts" to "service_role";

grant update on table "public"."merchant_receipts" to "service_role";

grant delete on table "public"."merchants" to "anon";

grant insert on table "public"."merchants" to "anon";

grant references on table "public"."merchants" to "anon";

grant select on table "public"."merchants" to "anon";

grant trigger on table "public"."merchants" to "anon";

grant truncate on table "public"."merchants" to "anon";

grant update on table "public"."merchants" to "anon";

grant delete on table "public"."merchants" to "authenticated";

grant insert on table "public"."merchants" to "authenticated";

grant references on table "public"."merchants" to "authenticated";

grant select on table "public"."merchants" to "authenticated";

grant trigger on table "public"."merchants" to "authenticated";

grant truncate on table "public"."merchants" to "authenticated";

grant update on table "public"."merchants" to "authenticated";

grant delete on table "public"."merchants" to "service_role";

grant insert on table "public"."merchants" to "service_role";

grant references on table "public"."merchants" to "service_role";

grant select on table "public"."merchants" to "service_role";

grant trigger on table "public"."merchants" to "service_role";

grant truncate on table "public"."merchants" to "service_role";

grant update on table "public"."merchants" to "service_role";

grant delete on table "public"."merchants_be" to "anon";

grant insert on table "public"."merchants_be" to "anon";

grant references on table "public"."merchants_be" to "anon";

grant select on table "public"."merchants_be" to "anon";

grant trigger on table "public"."merchants_be" to "anon";

grant truncate on table "public"."merchants_be" to "anon";

grant update on table "public"."merchants_be" to "anon";

grant delete on table "public"."merchants_be" to "authenticated";

grant insert on table "public"."merchants_be" to "authenticated";

grant references on table "public"."merchants_be" to "authenticated";

grant select on table "public"."merchants_be" to "authenticated";

grant trigger on table "public"."merchants_be" to "authenticated";

grant truncate on table "public"."merchants_be" to "authenticated";

grant update on table "public"."merchants_be" to "authenticated";

grant delete on table "public"."merchants_be" to "service_role";

grant insert on table "public"."merchants_be" to "service_role";

grant references on table "public"."merchants_be" to "service_role";

grant select on table "public"."merchants_be" to "service_role";

grant trigger on table "public"."merchants_be" to "service_role";

grant truncate on table "public"."merchants_be" to "service_role";

grant update on table "public"."merchants_be" to "service_role";

grant delete on table "public"."mfa_tokens" to "anon";

grant insert on table "public"."mfa_tokens" to "anon";

grant references on table "public"."mfa_tokens" to "anon";

grant select on table "public"."mfa_tokens" to "anon";

grant trigger on table "public"."mfa_tokens" to "anon";

grant truncate on table "public"."mfa_tokens" to "anon";

grant update on table "public"."mfa_tokens" to "anon";

grant delete on table "public"."mfa_tokens" to "authenticated";

grant insert on table "public"."mfa_tokens" to "authenticated";

grant references on table "public"."mfa_tokens" to "authenticated";

grant select on table "public"."mfa_tokens" to "authenticated";

grant trigger on table "public"."mfa_tokens" to "authenticated";

grant truncate on table "public"."mfa_tokens" to "authenticated";

grant update on table "public"."mfa_tokens" to "authenticated";

grant delete on table "public"."mfa_tokens" to "service_role";

grant insert on table "public"."mfa_tokens" to "service_role";

grant references on table "public"."mfa_tokens" to "service_role";

grant select on table "public"."mfa_tokens" to "service_role";

grant trigger on table "public"."mfa_tokens" to "service_role";

grant truncate on table "public"."mfa_tokens" to "service_role";

grant update on table "public"."mfa_tokens" to "service_role";

grant delete on table "public"."notifications" to "anon";

grant insert on table "public"."notifications" to "anon";

grant references on table "public"."notifications" to "anon";

grant select on table "public"."notifications" to "anon";

grant trigger on table "public"."notifications" to "anon";

grant truncate on table "public"."notifications" to "anon";

grant update on table "public"."notifications" to "anon";

grant delete on table "public"."notifications" to "authenticated";

grant insert on table "public"."notifications" to "authenticated";

grant references on table "public"."notifications" to "authenticated";

grant select on table "public"."notifications" to "authenticated";

grant trigger on table "public"."notifications" to "authenticated";

grant truncate on table "public"."notifications" to "authenticated";

grant update on table "public"."notifications" to "authenticated";

grant delete on table "public"."notifications" to "service_role";

grant insert on table "public"."notifications" to "service_role";

grant references on table "public"."notifications" to "service_role";

grant select on table "public"."notifications" to "service_role";

grant trigger on table "public"."notifications" to "service_role";

grant truncate on table "public"."notifications" to "service_role";

grant update on table "public"."notifications" to "service_role";

grant delete on table "public"."orders" to "anon";

grant insert on table "public"."orders" to "anon";

grant references on table "public"."orders" to "anon";

grant select on table "public"."orders" to "anon";

grant trigger on table "public"."orders" to "anon";

grant truncate on table "public"."orders" to "anon";

grant update on table "public"."orders" to "anon";

grant delete on table "public"."orders" to "authenticated";

grant insert on table "public"."orders" to "authenticated";

grant references on table "public"."orders" to "authenticated";

grant select on table "public"."orders" to "authenticated";

grant trigger on table "public"."orders" to "authenticated";

grant truncate on table "public"."orders" to "authenticated";

grant update on table "public"."orders" to "authenticated";

grant delete on table "public"."orders" to "service_role";

grant insert on table "public"."orders" to "service_role";

grant references on table "public"."orders" to "service_role";

grant select on table "public"."orders" to "service_role";

grant trigger on table "public"."orders" to "service_role";

grant truncate on table "public"."orders" to "service_role";

grant update on table "public"."orders" to "service_role";

grant delete on table "public"."parcels" to "anon";

grant insert on table "public"."parcels" to "anon";

grant references on table "public"."parcels" to "anon";

grant select on table "public"."parcels" to "anon";

grant trigger on table "public"."parcels" to "anon";

grant truncate on table "public"."parcels" to "anon";

grant update on table "public"."parcels" to "anon";

grant delete on table "public"."parcels" to "authenticated";

grant insert on table "public"."parcels" to "authenticated";

grant references on table "public"."parcels" to "authenticated";

grant select on table "public"."parcels" to "authenticated";

grant trigger on table "public"."parcels" to "authenticated";

grant truncate on table "public"."parcels" to "authenticated";

grant update on table "public"."parcels" to "authenticated";

grant delete on table "public"."parcels" to "service_role";

grant insert on table "public"."parcels" to "service_role";

grant references on table "public"."parcels" to "service_role";

grant select on table "public"."parcels" to "service_role";

grant trigger on table "public"."parcels" to "service_role";

grant truncate on table "public"."parcels" to "service_role";

grant update on table "public"."parcels" to "service_role";

grant delete on table "public"."password_changes" to "anon";

grant insert on table "public"."password_changes" to "anon";

grant references on table "public"."password_changes" to "anon";

grant select on table "public"."password_changes" to "anon";

grant trigger on table "public"."password_changes" to "anon";

grant truncate on table "public"."password_changes" to "anon";

grant update on table "public"."password_changes" to "anon";

grant delete on table "public"."password_changes" to "authenticated";

grant insert on table "public"."password_changes" to "authenticated";

grant references on table "public"."password_changes" to "authenticated";

grant select on table "public"."password_changes" to "authenticated";

grant trigger on table "public"."password_changes" to "authenticated";

grant truncate on table "public"."password_changes" to "authenticated";

grant update on table "public"."password_changes" to "authenticated";

grant delete on table "public"."password_changes" to "service_role";

grant insert on table "public"."password_changes" to "service_role";

grant references on table "public"."password_changes" to "service_role";

grant select on table "public"."password_changes" to "service_role";

grant trigger on table "public"."password_changes" to "service_role";

grant truncate on table "public"."password_changes" to "service_role";

grant update on table "public"."password_changes" to "service_role";

grant delete on table "public"."permissions" to "anon";

grant insert on table "public"."permissions" to "anon";

grant references on table "public"."permissions" to "anon";

grant select on table "public"."permissions" to "anon";

grant trigger on table "public"."permissions" to "anon";

grant truncate on table "public"."permissions" to "anon";

grant update on table "public"."permissions" to "anon";

grant delete on table "public"."permissions" to "authenticated";

grant insert on table "public"."permissions" to "authenticated";

grant references on table "public"."permissions" to "authenticated";

grant select on table "public"."permissions" to "authenticated";

grant trigger on table "public"."permissions" to "authenticated";

grant truncate on table "public"."permissions" to "authenticated";

grant update on table "public"."permissions" to "authenticated";

grant delete on table "public"."permissions" to "service_role";

grant insert on table "public"."permissions" to "service_role";

grant references on table "public"."permissions" to "service_role";

grant select on table "public"."permissions" to "service_role";

grant trigger on table "public"."permissions" to "service_role";

grant truncate on table "public"."permissions" to "service_role";

grant update on table "public"."permissions" to "service_role";

grant delete on table "public"."pricing_2026_02_03_21_00" to "anon";

grant insert on table "public"."pricing_2026_02_03_21_00" to "anon";

grant references on table "public"."pricing_2026_02_03_21_00" to "anon";

grant select on table "public"."pricing_2026_02_03_21_00" to "anon";

grant trigger on table "public"."pricing_2026_02_03_21_00" to "anon";

grant truncate on table "public"."pricing_2026_02_03_21_00" to "anon";

grant update on table "public"."pricing_2026_02_03_21_00" to "anon";

grant delete on table "public"."pricing_2026_02_03_21_00" to "authenticated";

grant insert on table "public"."pricing_2026_02_03_21_00" to "authenticated";

grant references on table "public"."pricing_2026_02_03_21_00" to "authenticated";

grant select on table "public"."pricing_2026_02_03_21_00" to "authenticated";

grant trigger on table "public"."pricing_2026_02_03_21_00" to "authenticated";

grant truncate on table "public"."pricing_2026_02_03_21_00" to "authenticated";

grant update on table "public"."pricing_2026_02_03_21_00" to "authenticated";

grant delete on table "public"."pricing_2026_02_03_21_00" to "service_role";

grant insert on table "public"."pricing_2026_02_03_21_00" to "service_role";

grant references on table "public"."pricing_2026_02_03_21_00" to "service_role";

grant select on table "public"."pricing_2026_02_03_21_00" to "service_role";

grant trigger on table "public"."pricing_2026_02_03_21_00" to "service_role";

grant truncate on table "public"."pricing_2026_02_03_21_00" to "service_role";

grant update on table "public"."pricing_2026_02_03_21_00" to "service_role";

grant delete on table "public"."pricing_rules" to "anon";

grant insert on table "public"."pricing_rules" to "anon";

grant references on table "public"."pricing_rules" to "anon";

grant select on table "public"."pricing_rules" to "anon";

grant trigger on table "public"."pricing_rules" to "anon";

grant truncate on table "public"."pricing_rules" to "anon";

grant update on table "public"."pricing_rules" to "anon";

grant delete on table "public"."pricing_rules" to "authenticated";

grant insert on table "public"."pricing_rules" to "authenticated";

grant references on table "public"."pricing_rules" to "authenticated";

grant select on table "public"."pricing_rules" to "authenticated";

grant trigger on table "public"."pricing_rules" to "authenticated";

grant truncate on table "public"."pricing_rules" to "authenticated";

grant update on table "public"."pricing_rules" to "authenticated";

grant delete on table "public"."pricing_rules" to "service_role";

grant insert on table "public"."pricing_rules" to "service_role";

grant references on table "public"."pricing_rules" to "service_role";

grant select on table "public"."pricing_rules" to "service_role";

grant trigger on table "public"."pricing_rules" to "service_role";

grant truncate on table "public"."pricing_rules" to "service_role";

grant update on table "public"."pricing_rules" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."prohibited_items_2026_02_03_21_00" to "anon";

grant insert on table "public"."prohibited_items_2026_02_03_21_00" to "anon";

grant references on table "public"."prohibited_items_2026_02_03_21_00" to "anon";

grant select on table "public"."prohibited_items_2026_02_03_21_00" to "anon";

grant trigger on table "public"."prohibited_items_2026_02_03_21_00" to "anon";

grant truncate on table "public"."prohibited_items_2026_02_03_21_00" to "anon";

grant update on table "public"."prohibited_items_2026_02_03_21_00" to "anon";

grant delete on table "public"."prohibited_items_2026_02_03_21_00" to "authenticated";

grant insert on table "public"."prohibited_items_2026_02_03_21_00" to "authenticated";

grant references on table "public"."prohibited_items_2026_02_03_21_00" to "authenticated";

grant select on table "public"."prohibited_items_2026_02_03_21_00" to "authenticated";

grant trigger on table "public"."prohibited_items_2026_02_03_21_00" to "authenticated";

grant truncate on table "public"."prohibited_items_2026_02_03_21_00" to "authenticated";

grant update on table "public"."prohibited_items_2026_02_03_21_00" to "authenticated";

grant delete on table "public"."prohibited_items_2026_02_03_21_00" to "service_role";

grant insert on table "public"."prohibited_items_2026_02_03_21_00" to "service_role";

grant references on table "public"."prohibited_items_2026_02_03_21_00" to "service_role";

grant select on table "public"."prohibited_items_2026_02_03_21_00" to "service_role";

grant trigger on table "public"."prohibited_items_2026_02_03_21_00" to "service_role";

grant truncate on table "public"."prohibited_items_2026_02_03_21_00" to "service_role";

grant update on table "public"."prohibited_items_2026_02_03_21_00" to "service_role";

grant delete on table "public"."qr_codes_2026_02_04_15_54" to "anon";

grant insert on table "public"."qr_codes_2026_02_04_15_54" to "anon";

grant references on table "public"."qr_codes_2026_02_04_15_54" to "anon";

grant select on table "public"."qr_codes_2026_02_04_15_54" to "anon";

grant trigger on table "public"."qr_codes_2026_02_04_15_54" to "anon";

grant truncate on table "public"."qr_codes_2026_02_04_15_54" to "anon";

grant update on table "public"."qr_codes_2026_02_04_15_54" to "anon";

grant delete on table "public"."qr_codes_2026_02_04_15_54" to "authenticated";

grant insert on table "public"."qr_codes_2026_02_04_15_54" to "authenticated";

grant references on table "public"."qr_codes_2026_02_04_15_54" to "authenticated";

grant select on table "public"."qr_codes_2026_02_04_15_54" to "authenticated";

grant trigger on table "public"."qr_codes_2026_02_04_15_54" to "authenticated";

grant truncate on table "public"."qr_codes_2026_02_04_15_54" to "authenticated";

grant update on table "public"."qr_codes_2026_02_04_15_54" to "authenticated";

grant delete on table "public"."qr_codes_2026_02_04_15_54" to "service_role";

grant insert on table "public"."qr_codes_2026_02_04_15_54" to "service_role";

grant references on table "public"."qr_codes_2026_02_04_15_54" to "service_role";

grant select on table "public"."qr_codes_2026_02_04_15_54" to "service_role";

grant trigger on table "public"."qr_codes_2026_02_04_15_54" to "service_role";

grant truncate on table "public"."qr_codes_2026_02_04_15_54" to "service_role";

grant update on table "public"."qr_codes_2026_02_04_15_54" to "service_role";

grant delete on table "public"."return_shipments" to "anon";

grant insert on table "public"."return_shipments" to "anon";

grant references on table "public"."return_shipments" to "anon";

grant select on table "public"."return_shipments" to "anon";

grant trigger on table "public"."return_shipments" to "anon";

grant truncate on table "public"."return_shipments" to "anon";

grant update on table "public"."return_shipments" to "anon";

grant delete on table "public"."return_shipments" to "authenticated";

grant insert on table "public"."return_shipments" to "authenticated";

grant references on table "public"."return_shipments" to "authenticated";

grant select on table "public"."return_shipments" to "authenticated";

grant trigger on table "public"."return_shipments" to "authenticated";

grant truncate on table "public"."return_shipments" to "authenticated";

grant update on table "public"."return_shipments" to "authenticated";

grant delete on table "public"."return_shipments" to "service_role";

grant insert on table "public"."return_shipments" to "service_role";

grant references on table "public"."return_shipments" to "service_role";

grant select on table "public"."return_shipments" to "service_role";

grant trigger on table "public"."return_shipments" to "service_role";

grant truncate on table "public"."return_shipments" to "service_role";

grant update on table "public"."return_shipments" to "service_role";

grant delete on table "public"."rider_locations_2026_02_04_14_23" to "anon";

grant insert on table "public"."rider_locations_2026_02_04_14_23" to "anon";

grant references on table "public"."rider_locations_2026_02_04_14_23" to "anon";

grant select on table "public"."rider_locations_2026_02_04_14_23" to "anon";

grant trigger on table "public"."rider_locations_2026_02_04_14_23" to "anon";

grant truncate on table "public"."rider_locations_2026_02_04_14_23" to "anon";

grant update on table "public"."rider_locations_2026_02_04_14_23" to "anon";

grant delete on table "public"."rider_locations_2026_02_04_14_23" to "authenticated";

grant insert on table "public"."rider_locations_2026_02_04_14_23" to "authenticated";

grant references on table "public"."rider_locations_2026_02_04_14_23" to "authenticated";

grant select on table "public"."rider_locations_2026_02_04_14_23" to "authenticated";

grant trigger on table "public"."rider_locations_2026_02_04_14_23" to "authenticated";

grant truncate on table "public"."rider_locations_2026_02_04_14_23" to "authenticated";

grant update on table "public"."rider_locations_2026_02_04_14_23" to "authenticated";

grant delete on table "public"."rider_locations_2026_02_04_14_23" to "service_role";

grant insert on table "public"."rider_locations_2026_02_04_14_23" to "service_role";

grant references on table "public"."rider_locations_2026_02_04_14_23" to "service_role";

grant select on table "public"."rider_locations_2026_02_04_14_23" to "service_role";

grant trigger on table "public"."rider_locations_2026_02_04_14_23" to "service_role";

grant truncate on table "public"."rider_locations_2026_02_04_14_23" to "service_role";

grant update on table "public"."rider_locations_2026_02_04_14_23" to "service_role";

grant delete on table "public"."rider_notifications_2026_02_04_14_23" to "anon";

grant insert on table "public"."rider_notifications_2026_02_04_14_23" to "anon";

grant references on table "public"."rider_notifications_2026_02_04_14_23" to "anon";

grant select on table "public"."rider_notifications_2026_02_04_14_23" to "anon";

grant trigger on table "public"."rider_notifications_2026_02_04_14_23" to "anon";

grant truncate on table "public"."rider_notifications_2026_02_04_14_23" to "anon";

grant update on table "public"."rider_notifications_2026_02_04_14_23" to "anon";

grant delete on table "public"."rider_notifications_2026_02_04_14_23" to "authenticated";

grant insert on table "public"."rider_notifications_2026_02_04_14_23" to "authenticated";

grant references on table "public"."rider_notifications_2026_02_04_14_23" to "authenticated";

grant select on table "public"."rider_notifications_2026_02_04_14_23" to "authenticated";

grant trigger on table "public"."rider_notifications_2026_02_04_14_23" to "authenticated";

grant truncate on table "public"."rider_notifications_2026_02_04_14_23" to "authenticated";

grant update on table "public"."rider_notifications_2026_02_04_14_23" to "authenticated";

grant delete on table "public"."rider_notifications_2026_02_04_14_23" to "service_role";

grant insert on table "public"."rider_notifications_2026_02_04_14_23" to "service_role";

grant references on table "public"."rider_notifications_2026_02_04_14_23" to "service_role";

grant select on table "public"."rider_notifications_2026_02_04_14_23" to "service_role";

grant trigger on table "public"."rider_notifications_2026_02_04_14_23" to "service_role";

grant truncate on table "public"."rider_notifications_2026_02_04_14_23" to "service_role";

grant update on table "public"."rider_notifications_2026_02_04_14_23" to "service_role";

grant delete on table "public"."rider_tasks_2026_02_04_14_23" to "anon";

grant insert on table "public"."rider_tasks_2026_02_04_14_23" to "anon";

grant references on table "public"."rider_tasks_2026_02_04_14_23" to "anon";

grant select on table "public"."rider_tasks_2026_02_04_14_23" to "anon";

grant trigger on table "public"."rider_tasks_2026_02_04_14_23" to "anon";

grant truncate on table "public"."rider_tasks_2026_02_04_14_23" to "anon";

grant update on table "public"."rider_tasks_2026_02_04_14_23" to "anon";

grant delete on table "public"."rider_tasks_2026_02_04_14_23" to "authenticated";

grant insert on table "public"."rider_tasks_2026_02_04_14_23" to "authenticated";

grant references on table "public"."rider_tasks_2026_02_04_14_23" to "authenticated";

grant select on table "public"."rider_tasks_2026_02_04_14_23" to "authenticated";

grant trigger on table "public"."rider_tasks_2026_02_04_14_23" to "authenticated";

grant truncate on table "public"."rider_tasks_2026_02_04_14_23" to "authenticated";

grant update on table "public"."rider_tasks_2026_02_04_14_23" to "authenticated";

grant delete on table "public"."rider_tasks_2026_02_04_14_23" to "service_role";

grant insert on table "public"."rider_tasks_2026_02_04_14_23" to "service_role";

grant references on table "public"."rider_tasks_2026_02_04_14_23" to "service_role";

grant select on table "public"."rider_tasks_2026_02_04_14_23" to "service_role";

grant trigger on table "public"."rider_tasks_2026_02_04_14_23" to "service_role";

grant truncate on table "public"."rider_tasks_2026_02_04_14_23" to "service_role";

grant update on table "public"."rider_tasks_2026_02_04_14_23" to "service_role";

grant delete on table "public"."rider_transactions_2026_02_04_14_23" to "anon";

grant insert on table "public"."rider_transactions_2026_02_04_14_23" to "anon";

grant references on table "public"."rider_transactions_2026_02_04_14_23" to "anon";

grant select on table "public"."rider_transactions_2026_02_04_14_23" to "anon";

grant trigger on table "public"."rider_transactions_2026_02_04_14_23" to "anon";

grant truncate on table "public"."rider_transactions_2026_02_04_14_23" to "anon";

grant update on table "public"."rider_transactions_2026_02_04_14_23" to "anon";

grant delete on table "public"."rider_transactions_2026_02_04_14_23" to "authenticated";

grant insert on table "public"."rider_transactions_2026_02_04_14_23" to "authenticated";

grant references on table "public"."rider_transactions_2026_02_04_14_23" to "authenticated";

grant select on table "public"."rider_transactions_2026_02_04_14_23" to "authenticated";

grant trigger on table "public"."rider_transactions_2026_02_04_14_23" to "authenticated";

grant truncate on table "public"."rider_transactions_2026_02_04_14_23" to "authenticated";

grant update on table "public"."rider_transactions_2026_02_04_14_23" to "authenticated";

grant delete on table "public"."rider_transactions_2026_02_04_14_23" to "service_role";

grant insert on table "public"."rider_transactions_2026_02_04_14_23" to "service_role";

grant references on table "public"."rider_transactions_2026_02_04_14_23" to "service_role";

grant select on table "public"."rider_transactions_2026_02_04_14_23" to "service_role";

grant trigger on table "public"."rider_transactions_2026_02_04_14_23" to "service_role";

grant truncate on table "public"."rider_transactions_2026_02_04_14_23" to "service_role";

grant update on table "public"."rider_transactions_2026_02_04_14_23" to "service_role";

grant delete on table "public"."riders_2026_02_04_14_23" to "anon";

grant insert on table "public"."riders_2026_02_04_14_23" to "anon";

grant references on table "public"."riders_2026_02_04_14_23" to "anon";

grant select on table "public"."riders_2026_02_04_14_23" to "anon";

grant trigger on table "public"."riders_2026_02_04_14_23" to "anon";

grant truncate on table "public"."riders_2026_02_04_14_23" to "anon";

grant update on table "public"."riders_2026_02_04_14_23" to "anon";

grant delete on table "public"."riders_2026_02_04_14_23" to "authenticated";

grant insert on table "public"."riders_2026_02_04_14_23" to "authenticated";

grant references on table "public"."riders_2026_02_04_14_23" to "authenticated";

grant select on table "public"."riders_2026_02_04_14_23" to "authenticated";

grant trigger on table "public"."riders_2026_02_04_14_23" to "authenticated";

grant truncate on table "public"."riders_2026_02_04_14_23" to "authenticated";

grant update on table "public"."riders_2026_02_04_14_23" to "authenticated";

grant delete on table "public"."riders_2026_02_04_14_23" to "service_role";

grant insert on table "public"."riders_2026_02_04_14_23" to "service_role";

grant references on table "public"."riders_2026_02_04_14_23" to "service_role";

grant select on table "public"."riders_2026_02_04_14_23" to "service_role";

grant trigger on table "public"."riders_2026_02_04_14_23" to "service_role";

grant truncate on table "public"."riders_2026_02_04_14_23" to "service_role";

grant update on table "public"."riders_2026_02_04_14_23" to "service_role";

grant delete on table "public"."role_permissions" to "anon";

grant insert on table "public"."role_permissions" to "anon";

grant references on table "public"."role_permissions" to "anon";

grant select on table "public"."role_permissions" to "anon";

grant trigger on table "public"."role_permissions" to "anon";

grant truncate on table "public"."role_permissions" to "anon";

grant update on table "public"."role_permissions" to "anon";

grant delete on table "public"."role_permissions" to "authenticated";

grant insert on table "public"."role_permissions" to "authenticated";

grant references on table "public"."role_permissions" to "authenticated";

grant select on table "public"."role_permissions" to "authenticated";

grant trigger on table "public"."role_permissions" to "authenticated";

grant truncate on table "public"."role_permissions" to "authenticated";

grant update on table "public"."role_permissions" to "authenticated";

grant delete on table "public"."role_permissions" to "service_role";

grant insert on table "public"."role_permissions" to "service_role";

grant references on table "public"."role_permissions" to "service_role";

grant select on table "public"."role_permissions" to "service_role";

grant trigger on table "public"."role_permissions" to "service_role";

grant truncate on table "public"."role_permissions" to "service_role";

grant update on table "public"."role_permissions" to "service_role";

grant delete on table "public"."role_routes" to "anon";

grant insert on table "public"."role_routes" to "anon";

grant references on table "public"."role_routes" to "anon";

grant select on table "public"."role_routes" to "anon";

grant trigger on table "public"."role_routes" to "anon";

grant truncate on table "public"."role_routes" to "anon";

grant update on table "public"."role_routes" to "anon";

grant delete on table "public"."role_routes" to "authenticated";

grant insert on table "public"."role_routes" to "authenticated";

grant references on table "public"."role_routes" to "authenticated";

grant select on table "public"."role_routes" to "authenticated";

grant trigger on table "public"."role_routes" to "authenticated";

grant truncate on table "public"."role_routes" to "authenticated";

grant update on table "public"."role_routes" to "authenticated";

grant delete on table "public"."role_routes" to "service_role";

grant insert on table "public"."role_routes" to "service_role";

grant references on table "public"."role_routes" to "service_role";

grant select on table "public"."role_routes" to "service_role";

grant trigger on table "public"."role_routes" to "service_role";

grant truncate on table "public"."role_routes" to "service_role";

grant update on table "public"."role_routes" to "service_role";

grant delete on table "public"."route_optimization" to "anon";

grant insert on table "public"."route_optimization" to "anon";

grant references on table "public"."route_optimization" to "anon";

grant select on table "public"."route_optimization" to "anon";

grant trigger on table "public"."route_optimization" to "anon";

grant truncate on table "public"."route_optimization" to "anon";

grant update on table "public"."route_optimization" to "anon";

grant delete on table "public"."route_optimization" to "authenticated";

grant insert on table "public"."route_optimization" to "authenticated";

grant references on table "public"."route_optimization" to "authenticated";

grant select on table "public"."route_optimization" to "authenticated";

grant trigger on table "public"."route_optimization" to "authenticated";

grant truncate on table "public"."route_optimization" to "authenticated";

grant update on table "public"."route_optimization" to "authenticated";

grant delete on table "public"."route_optimization" to "service_role";

grant insert on table "public"."route_optimization" to "service_role";

grant references on table "public"."route_optimization" to "service_role";

grant select on table "public"."route_optimization" to "service_role";

grant trigger on table "public"."route_optimization" to "service_role";

grant truncate on table "public"."route_optimization" to "service_role";

grant update on table "public"."route_optimization" to "service_role";

grant delete on table "public"."route_shipments" to "anon";

grant insert on table "public"."route_shipments" to "anon";

grant references on table "public"."route_shipments" to "anon";

grant select on table "public"."route_shipments" to "anon";

grant trigger on table "public"."route_shipments" to "anon";

grant truncate on table "public"."route_shipments" to "anon";

grant update on table "public"."route_shipments" to "anon";

grant delete on table "public"."route_shipments" to "authenticated";

grant insert on table "public"."route_shipments" to "authenticated";

grant references on table "public"."route_shipments" to "authenticated";

grant select on table "public"."route_shipments" to "authenticated";

grant trigger on table "public"."route_shipments" to "authenticated";

grant truncate on table "public"."route_shipments" to "authenticated";

grant update on table "public"."route_shipments" to "authenticated";

grant delete on table "public"."route_shipments" to "service_role";

grant insert on table "public"."route_shipments" to "service_role";

grant references on table "public"."route_shipments" to "service_role";

grant select on table "public"."route_shipments" to "service_role";

grant trigger on table "public"."route_shipments" to "service_role";

grant truncate on table "public"."route_shipments" to "service_role";

grant update on table "public"."route_shipments" to "service_role";

grant delete on table "public"."services_2026_02_03_21_00" to "anon";

grant insert on table "public"."services_2026_02_03_21_00" to "anon";

grant references on table "public"."services_2026_02_03_21_00" to "anon";

grant select on table "public"."services_2026_02_03_21_00" to "anon";

grant trigger on table "public"."services_2026_02_03_21_00" to "anon";

grant truncate on table "public"."services_2026_02_03_21_00" to "anon";

grant update on table "public"."services_2026_02_03_21_00" to "anon";

grant delete on table "public"."services_2026_02_03_21_00" to "authenticated";

grant insert on table "public"."services_2026_02_03_21_00" to "authenticated";

grant references on table "public"."services_2026_02_03_21_00" to "authenticated";

grant select on table "public"."services_2026_02_03_21_00" to "authenticated";

grant trigger on table "public"."services_2026_02_03_21_00" to "authenticated";

grant truncate on table "public"."services_2026_02_03_21_00" to "authenticated";

grant update on table "public"."services_2026_02_03_21_00" to "authenticated";

grant delete on table "public"."services_2026_02_03_21_00" to "service_role";

grant insert on table "public"."services_2026_02_03_21_00" to "service_role";

grant references on table "public"."services_2026_02_03_21_00" to "service_role";

grant select on table "public"."services_2026_02_03_21_00" to "service_role";

grant trigger on table "public"."services_2026_02_03_21_00" to "service_role";

grant truncate on table "public"."services_2026_02_03_21_00" to "service_role";

grant update on table "public"."services_2026_02_03_21_00" to "service_role";

grant delete on table "public"."shipment_tracking" to "anon";

grant insert on table "public"."shipment_tracking" to "anon";

grant references on table "public"."shipment_tracking" to "anon";

grant select on table "public"."shipment_tracking" to "anon";

grant trigger on table "public"."shipment_tracking" to "anon";

grant truncate on table "public"."shipment_tracking" to "anon";

grant update on table "public"."shipment_tracking" to "anon";

grant delete on table "public"."shipment_tracking" to "authenticated";

grant insert on table "public"."shipment_tracking" to "authenticated";

grant references on table "public"."shipment_tracking" to "authenticated";

grant select on table "public"."shipment_tracking" to "authenticated";

grant trigger on table "public"."shipment_tracking" to "authenticated";

grant truncate on table "public"."shipment_tracking" to "authenticated";

grant update on table "public"."shipment_tracking" to "authenticated";

grant delete on table "public"."shipment_tracking" to "service_role";

grant insert on table "public"."shipment_tracking" to "service_role";

grant references on table "public"."shipment_tracking" to "service_role";

grant select on table "public"."shipment_tracking" to "service_role";

grant trigger on table "public"."shipment_tracking" to "service_role";

grant truncate on table "public"."shipment_tracking" to "service_role";

grant update on table "public"."shipment_tracking" to "service_role";

grant delete on table "public"."shipment_tracking_enhanced" to "anon";

grant insert on table "public"."shipment_tracking_enhanced" to "anon";

grant references on table "public"."shipment_tracking_enhanced" to "anon";

grant select on table "public"."shipment_tracking_enhanced" to "anon";

grant trigger on table "public"."shipment_tracking_enhanced" to "anon";

grant truncate on table "public"."shipment_tracking_enhanced" to "anon";

grant update on table "public"."shipment_tracking_enhanced" to "anon";

grant delete on table "public"."shipment_tracking_enhanced" to "authenticated";

grant insert on table "public"."shipment_tracking_enhanced" to "authenticated";

grant references on table "public"."shipment_tracking_enhanced" to "authenticated";

grant select on table "public"."shipment_tracking_enhanced" to "authenticated";

grant trigger on table "public"."shipment_tracking_enhanced" to "authenticated";

grant truncate on table "public"."shipment_tracking_enhanced" to "authenticated";

grant update on table "public"."shipment_tracking_enhanced" to "authenticated";

grant delete on table "public"."shipment_tracking_enhanced" to "service_role";

grant insert on table "public"."shipment_tracking_enhanced" to "service_role";

grant references on table "public"."shipment_tracking_enhanced" to "service_role";

grant select on table "public"."shipment_tracking_enhanced" to "service_role";

grant trigger on table "public"."shipment_tracking_enhanced" to "service_role";

grant truncate on table "public"."shipment_tracking_enhanced" to "service_role";

grant update on table "public"."shipment_tracking_enhanced" to "service_role";

grant delete on table "public"."shipments" to "anon";

grant insert on table "public"."shipments" to "anon";

grant references on table "public"."shipments" to "anon";

grant select on table "public"."shipments" to "anon";

grant trigger on table "public"."shipments" to "anon";

grant truncate on table "public"."shipments" to "anon";

grant update on table "public"."shipments" to "anon";

grant delete on table "public"."shipments" to "authenticated";

grant insert on table "public"."shipments" to "authenticated";

grant references on table "public"."shipments" to "authenticated";

grant select on table "public"."shipments" to "authenticated";

grant trigger on table "public"."shipments" to "authenticated";

grant truncate on table "public"."shipments" to "authenticated";

grant update on table "public"."shipments" to "authenticated";

grant delete on table "public"."shipments" to "service_role";

grant insert on table "public"."shipments" to "service_role";

grant references on table "public"."shipments" to "service_role";

grant select on table "public"."shipments" to "service_role";

grant trigger on table "public"."shipments" to "service_role";

grant truncate on table "public"."shipments" to "service_role";

grant update on table "public"."shipments" to "service_role";

grant delete on table "public"."support_tickets" to "anon";

grant insert on table "public"."support_tickets" to "anon";

grant references on table "public"."support_tickets" to "anon";

grant select on table "public"."support_tickets" to "anon";

grant trigger on table "public"."support_tickets" to "anon";

grant truncate on table "public"."support_tickets" to "anon";

grant update on table "public"."support_tickets" to "anon";

grant delete on table "public"."support_tickets" to "authenticated";

grant insert on table "public"."support_tickets" to "authenticated";

grant references on table "public"."support_tickets" to "authenticated";

grant select on table "public"."support_tickets" to "authenticated";

grant trigger on table "public"."support_tickets" to "authenticated";

grant truncate on table "public"."support_tickets" to "authenticated";

grant update on table "public"."support_tickets" to "authenticated";

grant delete on table "public"."support_tickets" to "service_role";

grant insert on table "public"."support_tickets" to "service_role";

grant references on table "public"."support_tickets" to "service_role";

grant select on table "public"."support_tickets" to "service_role";

grant trigger on table "public"."support_tickets" to "service_role";

grant truncate on table "public"."support_tickets" to "service_role";

grant update on table "public"."support_tickets" to "service_role";

grant delete on table "public"."system_audit_log" to "anon";

grant insert on table "public"."system_audit_log" to "anon";

grant references on table "public"."system_audit_log" to "anon";

grant select on table "public"."system_audit_log" to "anon";

grant trigger on table "public"."system_audit_log" to "anon";

grant truncate on table "public"."system_audit_log" to "anon";

grant update on table "public"."system_audit_log" to "anon";

grant delete on table "public"."system_audit_log" to "authenticated";

grant insert on table "public"."system_audit_log" to "authenticated";

grant references on table "public"."system_audit_log" to "authenticated";

grant select on table "public"."system_audit_log" to "authenticated";

grant trigger on table "public"."system_audit_log" to "authenticated";

grant truncate on table "public"."system_audit_log" to "authenticated";

grant update on table "public"."system_audit_log" to "authenticated";

grant delete on table "public"."system_audit_log" to "service_role";

grant insert on table "public"."system_audit_log" to "service_role";

grant references on table "public"."system_audit_log" to "service_role";

grant select on table "public"."system_audit_log" to "service_role";

grant trigger on table "public"."system_audit_log" to "service_role";

grant truncate on table "public"."system_audit_log" to "service_role";

grant update on table "public"."system_audit_log" to "service_role";

grant delete on table "public"."system_config_2026_02_04_16_00" to "anon";

grant insert on table "public"."system_config_2026_02_04_16_00" to "anon";

grant references on table "public"."system_config_2026_02_04_16_00" to "anon";

grant select on table "public"."system_config_2026_02_04_16_00" to "anon";

grant trigger on table "public"."system_config_2026_02_04_16_00" to "anon";

grant truncate on table "public"."system_config_2026_02_04_16_00" to "anon";

grant update on table "public"."system_config_2026_02_04_16_00" to "anon";

grant delete on table "public"."system_config_2026_02_04_16_00" to "authenticated";

grant insert on table "public"."system_config_2026_02_04_16_00" to "authenticated";

grant references on table "public"."system_config_2026_02_04_16_00" to "authenticated";

grant select on table "public"."system_config_2026_02_04_16_00" to "authenticated";

grant trigger on table "public"."system_config_2026_02_04_16_00" to "authenticated";

grant truncate on table "public"."system_config_2026_02_04_16_00" to "authenticated";

grant update on table "public"."system_config_2026_02_04_16_00" to "authenticated";

grant delete on table "public"."system_config_2026_02_04_16_00" to "service_role";

grant insert on table "public"."system_config_2026_02_04_16_00" to "service_role";

grant references on table "public"."system_config_2026_02_04_16_00" to "service_role";

grant select on table "public"."system_config_2026_02_04_16_00" to "service_role";

grant trigger on table "public"."system_config_2026_02_04_16_00" to "service_role";

grant truncate on table "public"."system_config_2026_02_04_16_00" to "service_role";

grant update on table "public"."system_config_2026_02_04_16_00" to "service_role";

grant delete on table "public"."system_configuration" to "anon";

grant insert on table "public"."system_configuration" to "anon";

grant references on table "public"."system_configuration" to "anon";

grant select on table "public"."system_configuration" to "anon";

grant trigger on table "public"."system_configuration" to "anon";

grant truncate on table "public"."system_configuration" to "anon";

grant update on table "public"."system_configuration" to "anon";

grant delete on table "public"."system_configuration" to "authenticated";

grant insert on table "public"."system_configuration" to "authenticated";

grant references on table "public"."system_configuration" to "authenticated";

grant select on table "public"."system_configuration" to "authenticated";

grant trigger on table "public"."system_configuration" to "authenticated";

grant truncate on table "public"."system_configuration" to "authenticated";

grant update on table "public"."system_configuration" to "authenticated";

grant delete on table "public"."system_configuration" to "service_role";

grant insert on table "public"."system_configuration" to "service_role";

grant references on table "public"."system_configuration" to "service_role";

grant select on table "public"."system_configuration" to "service_role";

grant trigger on table "public"."system_configuration" to "service_role";

grant truncate on table "public"."system_configuration" to "service_role";

grant update on table "public"."system_configuration" to "service_role";

grant delete on table "public"."system_settings" to "anon";

grant insert on table "public"."system_settings" to "anon";

grant references on table "public"."system_settings" to "anon";

grant select on table "public"."system_settings" to "anon";

grant trigger on table "public"."system_settings" to "anon";

grant truncate on table "public"."system_settings" to "anon";

grant update on table "public"."system_settings" to "anon";

grant delete on table "public"."system_settings" to "authenticated";

grant insert on table "public"."system_settings" to "authenticated";

grant references on table "public"."system_settings" to "authenticated";

grant select on table "public"."system_settings" to "authenticated";

grant trigger on table "public"."system_settings" to "authenticated";

grant truncate on table "public"."system_settings" to "authenticated";

grant update on table "public"."system_settings" to "authenticated";

grant delete on table "public"."system_settings" to "service_role";

grant insert on table "public"."system_settings" to "service_role";

grant references on table "public"."system_settings" to "service_role";

grant select on table "public"."system_settings" to "service_role";

grant trigger on table "public"."system_settings" to "service_role";

grant truncate on table "public"."system_settings" to "service_role";

grant update on table "public"."system_settings" to "service_role";

grant delete on table "public"."system_settings_be" to "anon";

grant insert on table "public"."system_settings_be" to "anon";

grant references on table "public"."system_settings_be" to "anon";

grant select on table "public"."system_settings_be" to "anon";

grant trigger on table "public"."system_settings_be" to "anon";

grant truncate on table "public"."system_settings_be" to "anon";

grant update on table "public"."system_settings_be" to "anon";

grant delete on table "public"."system_settings_be" to "authenticated";

grant insert on table "public"."system_settings_be" to "authenticated";

grant references on table "public"."system_settings_be" to "authenticated";

grant select on table "public"."system_settings_be" to "authenticated";

grant trigger on table "public"."system_settings_be" to "authenticated";

grant truncate on table "public"."system_settings_be" to "authenticated";

grant update on table "public"."system_settings_be" to "authenticated";

grant delete on table "public"."system_settings_be" to "service_role";

grant insert on table "public"."system_settings_be" to "service_role";

grant references on table "public"."system_settings_be" to "service_role";

grant select on table "public"."system_settings_be" to "service_role";

grant trigger on table "public"."system_settings_be" to "service_role";

grant truncate on table "public"."system_settings_be" to "service_role";

grant update on table "public"."system_settings_be" to "service_role";

grant delete on table "public"."tariff_rates_2026_02_04_16_00" to "anon";

grant insert on table "public"."tariff_rates_2026_02_04_16_00" to "anon";

grant references on table "public"."tariff_rates_2026_02_04_16_00" to "anon";

grant select on table "public"."tariff_rates_2026_02_04_16_00" to "anon";

grant trigger on table "public"."tariff_rates_2026_02_04_16_00" to "anon";

grant truncate on table "public"."tariff_rates_2026_02_04_16_00" to "anon";

grant update on table "public"."tariff_rates_2026_02_04_16_00" to "anon";

grant delete on table "public"."tariff_rates_2026_02_04_16_00" to "authenticated";

grant insert on table "public"."tariff_rates_2026_02_04_16_00" to "authenticated";

grant references on table "public"."tariff_rates_2026_02_04_16_00" to "authenticated";

grant select on table "public"."tariff_rates_2026_02_04_16_00" to "authenticated";

grant trigger on table "public"."tariff_rates_2026_02_04_16_00" to "authenticated";

grant truncate on table "public"."tariff_rates_2026_02_04_16_00" to "authenticated";

grant update on table "public"."tariff_rates_2026_02_04_16_00" to "authenticated";

grant delete on table "public"."tariff_rates_2026_02_04_16_00" to "service_role";

grant insert on table "public"."tariff_rates_2026_02_04_16_00" to "service_role";

grant references on table "public"."tariff_rates_2026_02_04_16_00" to "service_role";

grant select on table "public"."tariff_rates_2026_02_04_16_00" to "service_role";

grant trigger on table "public"."tariff_rates_2026_02_04_16_00" to "service_role";

grant truncate on table "public"."tariff_rates_2026_02_04_16_00" to "service_role";

grant update on table "public"."tariff_rates_2026_02_04_16_00" to "service_role";

grant delete on table "public"."user_branch_assignments" to "anon";

grant insert on table "public"."user_branch_assignments" to "anon";

grant references on table "public"."user_branch_assignments" to "anon";

grant select on table "public"."user_branch_assignments" to "anon";

grant trigger on table "public"."user_branch_assignments" to "anon";

grant truncate on table "public"."user_branch_assignments" to "anon";

grant update on table "public"."user_branch_assignments" to "anon";

grant delete on table "public"."user_branch_assignments" to "authenticated";

grant insert on table "public"."user_branch_assignments" to "authenticated";

grant references on table "public"."user_branch_assignments" to "authenticated";

grant select on table "public"."user_branch_assignments" to "authenticated";

grant trigger on table "public"."user_branch_assignments" to "authenticated";

grant truncate on table "public"."user_branch_assignments" to "authenticated";

grant update on table "public"."user_branch_assignments" to "authenticated";

grant delete on table "public"."user_branch_assignments" to "service_role";

grant insert on table "public"."user_branch_assignments" to "service_role";

grant references on table "public"."user_branch_assignments" to "service_role";

grant select on table "public"."user_branch_assignments" to "service_role";

grant trigger on table "public"."user_branch_assignments" to "service_role";

grant truncate on table "public"."user_branch_assignments" to "service_role";

grant update on table "public"."user_branch_assignments" to "service_role";

grant delete on table "public"."user_permissions" to "anon";

grant insert on table "public"."user_permissions" to "anon";

grant references on table "public"."user_permissions" to "anon";

grant select on table "public"."user_permissions" to "anon";

grant trigger on table "public"."user_permissions" to "anon";

grant truncate on table "public"."user_permissions" to "anon";

grant update on table "public"."user_permissions" to "anon";

grant delete on table "public"."user_permissions" to "authenticated";

grant insert on table "public"."user_permissions" to "authenticated";

grant references on table "public"."user_permissions" to "authenticated";

grant select on table "public"."user_permissions" to "authenticated";

grant trigger on table "public"."user_permissions" to "authenticated";

grant truncate on table "public"."user_permissions" to "authenticated";

grant update on table "public"."user_permissions" to "authenticated";

grant delete on table "public"."user_permissions" to "service_role";

grant insert on table "public"."user_permissions" to "service_role";

grant references on table "public"."user_permissions" to "service_role";

grant select on table "public"."user_permissions" to "service_role";

grant trigger on table "public"."user_permissions" to "service_role";

grant truncate on table "public"."user_permissions" to "service_role";

grant update on table "public"."user_permissions" to "service_role";

grant delete on table "public"."user_profiles" to "anon";

grant insert on table "public"."user_profiles" to "anon";

grant references on table "public"."user_profiles" to "anon";

grant select on table "public"."user_profiles" to "anon";

grant trigger on table "public"."user_profiles" to "anon";

grant truncate on table "public"."user_profiles" to "anon";

grant update on table "public"."user_profiles" to "anon";

grant delete on table "public"."user_profiles" to "authenticated";

grant insert on table "public"."user_profiles" to "authenticated";

grant references on table "public"."user_profiles" to "authenticated";

grant select on table "public"."user_profiles" to "authenticated";

grant trigger on table "public"."user_profiles" to "authenticated";

grant truncate on table "public"."user_profiles" to "authenticated";

grant update on table "public"."user_profiles" to "authenticated";

grant delete on table "public"."user_profiles" to "service_role";

grant insert on table "public"."user_profiles" to "service_role";

grant references on table "public"."user_profiles" to "service_role";

grant select on table "public"."user_profiles" to "service_role";

grant trigger on table "public"."user_profiles" to "service_role";

grant truncate on table "public"."user_profiles" to "service_role";

grant update on table "public"."user_profiles" to "service_role";

grant delete on table "public"."user_sessions" to "anon";

grant insert on table "public"."user_sessions" to "anon";

grant references on table "public"."user_sessions" to "anon";

grant select on table "public"."user_sessions" to "anon";

grant trigger on table "public"."user_sessions" to "anon";

grant truncate on table "public"."user_sessions" to "anon";

grant update on table "public"."user_sessions" to "anon";

grant delete on table "public"."user_sessions" to "authenticated";

grant insert on table "public"."user_sessions" to "authenticated";

grant references on table "public"."user_sessions" to "authenticated";

grant select on table "public"."user_sessions" to "authenticated";

grant trigger on table "public"."user_sessions" to "authenticated";

grant truncate on table "public"."user_sessions" to "authenticated";

grant update on table "public"."user_sessions" to "authenticated";

grant delete on table "public"."user_sessions" to "service_role";

grant insert on table "public"."user_sessions" to "service_role";

grant references on table "public"."user_sessions" to "service_role";

grant select on table "public"."user_sessions" to "service_role";

grant trigger on table "public"."user_sessions" to "service_role";

grant truncate on table "public"."user_sessions" to "service_role";

grant update on table "public"."user_sessions" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";

grant delete on table "public"."users_2026_02_12_13_00" to "anon";

grant insert on table "public"."users_2026_02_12_13_00" to "anon";

grant references on table "public"."users_2026_02_12_13_00" to "anon";

grant select on table "public"."users_2026_02_12_13_00" to "anon";

grant trigger on table "public"."users_2026_02_12_13_00" to "anon";

grant truncate on table "public"."users_2026_02_12_13_00" to "anon";

grant update on table "public"."users_2026_02_12_13_00" to "anon";

grant delete on table "public"."users_2026_02_12_13_00" to "authenticated";

grant insert on table "public"."users_2026_02_12_13_00" to "authenticated";

grant references on table "public"."users_2026_02_12_13_00" to "authenticated";

grant select on table "public"."users_2026_02_12_13_00" to "authenticated";

grant trigger on table "public"."users_2026_02_12_13_00" to "authenticated";

grant truncate on table "public"."users_2026_02_12_13_00" to "authenticated";

grant update on table "public"."users_2026_02_12_13_00" to "authenticated";

grant delete on table "public"."users_2026_02_12_13_00" to "service_role";

grant insert on table "public"."users_2026_02_12_13_00" to "service_role";

grant references on table "public"."users_2026_02_12_13_00" to "service_role";

grant select on table "public"."users_2026_02_12_13_00" to "service_role";

grant trigger on table "public"."users_2026_02_12_13_00" to "service_role";

grant truncate on table "public"."users_2026_02_12_13_00" to "service_role";

grant update on table "public"."users_2026_02_12_13_00" to "service_role";

grant delete on table "public"."users_enhanced" to "anon";

grant insert on table "public"."users_enhanced" to "anon";

grant references on table "public"."users_enhanced" to "anon";

grant select on table "public"."users_enhanced" to "anon";

grant trigger on table "public"."users_enhanced" to "anon";

grant truncate on table "public"."users_enhanced" to "anon";

grant update on table "public"."users_enhanced" to "anon";

grant delete on table "public"."users_enhanced" to "authenticated";

grant insert on table "public"."users_enhanced" to "authenticated";

grant references on table "public"."users_enhanced" to "authenticated";

grant select on table "public"."users_enhanced" to "authenticated";

grant trigger on table "public"."users_enhanced" to "authenticated";

grant truncate on table "public"."users_enhanced" to "authenticated";

grant update on table "public"."users_enhanced" to "authenticated";

grant delete on table "public"."users_enhanced" to "service_role";

grant insert on table "public"."users_enhanced" to "service_role";

grant references on table "public"."users_enhanced" to "service_role";

grant select on table "public"."users_enhanced" to "service_role";

grant trigger on table "public"."users_enhanced" to "service_role";

grant truncate on table "public"."users_enhanced" to "service_role";

grant update on table "public"."users_enhanced" to "service_role";

grant delete on table "public"."vouchers" to "anon";

grant insert on table "public"."vouchers" to "anon";

grant references on table "public"."vouchers" to "anon";

grant select on table "public"."vouchers" to "anon";

grant trigger on table "public"."vouchers" to "anon";

grant truncate on table "public"."vouchers" to "anon";

grant update on table "public"."vouchers" to "anon";

grant delete on table "public"."vouchers" to "authenticated";

grant insert on table "public"."vouchers" to "authenticated";

grant references on table "public"."vouchers" to "authenticated";

grant select on table "public"."vouchers" to "authenticated";

grant trigger on table "public"."vouchers" to "authenticated";

grant truncate on table "public"."vouchers" to "authenticated";

grant update on table "public"."vouchers" to "authenticated";

grant delete on table "public"."vouchers" to "service_role";

grant insert on table "public"."vouchers" to "service_role";

grant references on table "public"."vouchers" to "service_role";

grant select on table "public"."vouchers" to "service_role";

grant trigger on table "public"."vouchers" to "service_role";

grant truncate on table "public"."vouchers" to "service_role";

grant update on table "public"."vouchers" to "service_role";

grant delete on table "public"."warehouse_manifest_items_2026_02_04_15_54" to "anon";

grant insert on table "public"."warehouse_manifest_items_2026_02_04_15_54" to "anon";

grant references on table "public"."warehouse_manifest_items_2026_02_04_15_54" to "anon";

grant select on table "public"."warehouse_manifest_items_2026_02_04_15_54" to "anon";

grant trigger on table "public"."warehouse_manifest_items_2026_02_04_15_54" to "anon";

grant truncate on table "public"."warehouse_manifest_items_2026_02_04_15_54" to "anon";

grant update on table "public"."warehouse_manifest_items_2026_02_04_15_54" to "anon";

grant delete on table "public"."warehouse_manifest_items_2026_02_04_15_54" to "authenticated";

grant insert on table "public"."warehouse_manifest_items_2026_02_04_15_54" to "authenticated";

grant references on table "public"."warehouse_manifest_items_2026_02_04_15_54" to "authenticated";

grant select on table "public"."warehouse_manifest_items_2026_02_04_15_54" to "authenticated";

grant trigger on table "public"."warehouse_manifest_items_2026_02_04_15_54" to "authenticated";

grant truncate on table "public"."warehouse_manifest_items_2026_02_04_15_54" to "authenticated";

grant update on table "public"."warehouse_manifest_items_2026_02_04_15_54" to "authenticated";

grant delete on table "public"."warehouse_manifest_items_2026_02_04_15_54" to "service_role";

grant insert on table "public"."warehouse_manifest_items_2026_02_04_15_54" to "service_role";

grant references on table "public"."warehouse_manifest_items_2026_02_04_15_54" to "service_role";

grant select on table "public"."warehouse_manifest_items_2026_02_04_15_54" to "service_role";

grant trigger on table "public"."warehouse_manifest_items_2026_02_04_15_54" to "service_role";

grant truncate on table "public"."warehouse_manifest_items_2026_02_04_15_54" to "service_role";

grant update on table "public"."warehouse_manifest_items_2026_02_04_15_54" to "service_role";

grant delete on table "public"."warehouse_manifests_2026_02_04_15_54" to "anon";

grant insert on table "public"."warehouse_manifests_2026_02_04_15_54" to "anon";

grant references on table "public"."warehouse_manifests_2026_02_04_15_54" to "anon";

grant select on table "public"."warehouse_manifests_2026_02_04_15_54" to "anon";

grant trigger on table "public"."warehouse_manifests_2026_02_04_15_54" to "anon";

grant truncate on table "public"."warehouse_manifests_2026_02_04_15_54" to "anon";

grant update on table "public"."warehouse_manifests_2026_02_04_15_54" to "anon";

grant delete on table "public"."warehouse_manifests_2026_02_04_15_54" to "authenticated";

grant insert on table "public"."warehouse_manifests_2026_02_04_15_54" to "authenticated";

grant references on table "public"."warehouse_manifests_2026_02_04_15_54" to "authenticated";

grant select on table "public"."warehouse_manifests_2026_02_04_15_54" to "authenticated";

grant trigger on table "public"."warehouse_manifests_2026_02_04_15_54" to "authenticated";

grant truncate on table "public"."warehouse_manifests_2026_02_04_15_54" to "authenticated";

grant update on table "public"."warehouse_manifests_2026_02_04_15_54" to "authenticated";

grant delete on table "public"."warehouse_manifests_2026_02_04_15_54" to "service_role";

grant insert on table "public"."warehouse_manifests_2026_02_04_15_54" to "service_role";

grant references on table "public"."warehouse_manifests_2026_02_04_15_54" to "service_role";

grant select on table "public"."warehouse_manifests_2026_02_04_15_54" to "service_role";

grant trigger on table "public"."warehouse_manifests_2026_02_04_15_54" to "service_role";

grant truncate on table "public"."warehouse_manifests_2026_02_04_15_54" to "service_role";

grant update on table "public"."warehouse_manifests_2026_02_04_15_54" to "service_role";

grant delete on table "public"."warehouse_operations_2026_02_04_15_54" to "anon";

grant insert on table "public"."warehouse_operations_2026_02_04_15_54" to "anon";

grant references on table "public"."warehouse_operations_2026_02_04_15_54" to "anon";

grant select on table "public"."warehouse_operations_2026_02_04_15_54" to "anon";

grant trigger on table "public"."warehouse_operations_2026_02_04_15_54" to "anon";

grant truncate on table "public"."warehouse_operations_2026_02_04_15_54" to "anon";

grant update on table "public"."warehouse_operations_2026_02_04_15_54" to "anon";

grant delete on table "public"."warehouse_operations_2026_02_04_15_54" to "authenticated";

grant insert on table "public"."warehouse_operations_2026_02_04_15_54" to "authenticated";

grant references on table "public"."warehouse_operations_2026_02_04_15_54" to "authenticated";

grant select on table "public"."warehouse_operations_2026_02_04_15_54" to "authenticated";

grant trigger on table "public"."warehouse_operations_2026_02_04_15_54" to "authenticated";

grant truncate on table "public"."warehouse_operations_2026_02_04_15_54" to "authenticated";

grant update on table "public"."warehouse_operations_2026_02_04_15_54" to "authenticated";

grant delete on table "public"."warehouse_operations_2026_02_04_15_54" to "service_role";

grant insert on table "public"."warehouse_operations_2026_02_04_15_54" to "service_role";

grant references on table "public"."warehouse_operations_2026_02_04_15_54" to "service_role";

grant select on table "public"."warehouse_operations_2026_02_04_15_54" to "service_role";

grant trigger on table "public"."warehouse_operations_2026_02_04_15_54" to "service_role";

grant truncate on table "public"."warehouse_operations_2026_02_04_15_54" to "service_role";

grant update on table "public"."warehouse_operations_2026_02_04_15_54" to "service_role";

grant delete on table "public"."warehouse_parcels_2026_02_04_15_54" to "anon";

grant insert on table "public"."warehouse_parcels_2026_02_04_15_54" to "anon";

grant references on table "public"."warehouse_parcels_2026_02_04_15_54" to "anon";

grant select on table "public"."warehouse_parcels_2026_02_04_15_54" to "anon";

grant trigger on table "public"."warehouse_parcels_2026_02_04_15_54" to "anon";

grant truncate on table "public"."warehouse_parcels_2026_02_04_15_54" to "anon";

grant update on table "public"."warehouse_parcels_2026_02_04_15_54" to "anon";

grant delete on table "public"."warehouse_parcels_2026_02_04_15_54" to "authenticated";

grant insert on table "public"."warehouse_parcels_2026_02_04_15_54" to "authenticated";

grant references on table "public"."warehouse_parcels_2026_02_04_15_54" to "authenticated";

grant select on table "public"."warehouse_parcels_2026_02_04_15_54" to "authenticated";

grant trigger on table "public"."warehouse_parcels_2026_02_04_15_54" to "authenticated";

grant truncate on table "public"."warehouse_parcels_2026_02_04_15_54" to "authenticated";

grant update on table "public"."warehouse_parcels_2026_02_04_15_54" to "authenticated";

grant delete on table "public"."warehouse_parcels_2026_02_04_15_54" to "service_role";

grant insert on table "public"."warehouse_parcels_2026_02_04_15_54" to "service_role";

grant references on table "public"."warehouse_parcels_2026_02_04_15_54" to "service_role";

grant select on table "public"."warehouse_parcels_2026_02_04_15_54" to "service_role";

grant trigger on table "public"."warehouse_parcels_2026_02_04_15_54" to "service_role";

grant truncate on table "public"."warehouse_parcels_2026_02_04_15_54" to "service_role";

grant update on table "public"."warehouse_parcels_2026_02_04_15_54" to "service_role";

grant delete on table "public"."warehouse_stations_2026_02_04_15_54" to "anon";

grant insert on table "public"."warehouse_stations_2026_02_04_15_54" to "anon";

grant references on table "public"."warehouse_stations_2026_02_04_15_54" to "anon";

grant select on table "public"."warehouse_stations_2026_02_04_15_54" to "anon";

grant trigger on table "public"."warehouse_stations_2026_02_04_15_54" to "anon";

grant truncate on table "public"."warehouse_stations_2026_02_04_15_54" to "anon";

grant update on table "public"."warehouse_stations_2026_02_04_15_54" to "anon";

grant delete on table "public"."warehouse_stations_2026_02_04_15_54" to "authenticated";

grant insert on table "public"."warehouse_stations_2026_02_04_15_54" to "authenticated";

grant references on table "public"."warehouse_stations_2026_02_04_15_54" to "authenticated";

grant select on table "public"."warehouse_stations_2026_02_04_15_54" to "authenticated";

grant trigger on table "public"."warehouse_stations_2026_02_04_15_54" to "authenticated";

grant truncate on table "public"."warehouse_stations_2026_02_04_15_54" to "authenticated";

grant update on table "public"."warehouse_stations_2026_02_04_15_54" to "authenticated";

grant delete on table "public"."warehouse_stations_2026_02_04_15_54" to "service_role";

grant insert on table "public"."warehouse_stations_2026_02_04_15_54" to "service_role";

grant references on table "public"."warehouse_stations_2026_02_04_15_54" to "service_role";

grant select on table "public"."warehouse_stations_2026_02_04_15_54" to "service_role";

grant trigger on table "public"."warehouse_stations_2026_02_04_15_54" to "service_role";

grant truncate on table "public"."warehouse_stations_2026_02_04_15_54" to "service_role";

grant update on table "public"."warehouse_stations_2026_02_04_15_54" to "service_role";

grant delete on table "public"."warehouse_users_2026_02_04_15_54" to "anon";

grant insert on table "public"."warehouse_users_2026_02_04_15_54" to "anon";

grant references on table "public"."warehouse_users_2026_02_04_15_54" to "anon";

grant select on table "public"."warehouse_users_2026_02_04_15_54" to "anon";

grant trigger on table "public"."warehouse_users_2026_02_04_15_54" to "anon";

grant truncate on table "public"."warehouse_users_2026_02_04_15_54" to "anon";

grant update on table "public"."warehouse_users_2026_02_04_15_54" to "anon";

grant delete on table "public"."warehouse_users_2026_02_04_15_54" to "authenticated";

grant insert on table "public"."warehouse_users_2026_02_04_15_54" to "authenticated";

grant references on table "public"."warehouse_users_2026_02_04_15_54" to "authenticated";

grant select on table "public"."warehouse_users_2026_02_04_15_54" to "authenticated";

grant trigger on table "public"."warehouse_users_2026_02_04_15_54" to "authenticated";

grant truncate on table "public"."warehouse_users_2026_02_04_15_54" to "authenticated";

grant update on table "public"."warehouse_users_2026_02_04_15_54" to "authenticated";

grant delete on table "public"."warehouse_users_2026_02_04_15_54" to "service_role";

grant insert on table "public"."warehouse_users_2026_02_04_15_54" to "service_role";

grant references on table "public"."warehouse_users_2026_02_04_15_54" to "service_role";

grant select on table "public"."warehouse_users_2026_02_04_15_54" to "service_role";

grant trigger on table "public"."warehouse_users_2026_02_04_15_54" to "service_role";

grant truncate on table "public"."warehouse_users_2026_02_04_15_54" to "service_role";

grant update on table "public"."warehouse_users_2026_02_04_15_54" to "service_role";


  create policy "Admin users can view all users"
  on "public"."admin_users_2026_02_04_16_00"
  as permissive
  for select
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Super admin can manage all users"
  on "public"."admin_users_2026_02_04_16_00"
  as permissive
  for all
  to public
using ((auth.role() = 'service_role'::text));



  create policy "Admins can view audit logs"
  on "public"."audit_logs"
  as permissive
  for select
  to authenticated
using (((auth.jwt() ->> 'role'::text) = ANY (ARRAY['APP_OWNER'::text, 'SUPER_ADMIN'::text, 'OPERATIONS_ADMIN'::text])));



  create policy "Enable insert for system actions"
  on "public"."audit_logs"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "System admins can view all audit logs"
  on "public"."audit_logs"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.users_enhanced
  WHERE ((users_enhanced.auth_user_id = auth.uid()) AND (users_enhanced.role = 'SYSTEM_ADMIN'::public.user_role_type)))));



  create policy "Users can view own audit logs"
  on "public"."audit_logs"
  as permissive
  for select
  to public
using ((user_id IN ( SELECT users_enhanced.id
   FROM public.users_enhanced
  WHERE (users_enhanced.auth_user_id = auth.uid()))));



  create policy "Users can view reports"
  on "public"."automated_reports"
  as permissive
  for select
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Admins can manage branches"
  on "public"."branches"
  as permissive
  for all
  to public
using ((EXISTS ( SELECT 1
   FROM public.users u
  WHERE ((u.firebase_uid = (auth.uid())::text) AND (u.role = ANY (ARRAY['super_admin'::public.user_role, 'admin'::public.user_role]))))));



  create policy "All authenticated users can view branches"
  on "public"."branches"
  as permissive
  for select
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Admin can manage bulk uploads"
  on "public"."bulk_uploads_2026_02_04_16_00"
  as permissive
  for all
  to public
using ((auth.role() = 'service_role'::text));



  create policy "Authenticated users can view bulk uploads"
  on "public"."bulk_uploads_2026_02_04_16_00"
  as permissive
  for select
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Allow authenticated users to manage cash advances"
  on "public"."cash_advances"
  as permissive
  for all
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Allow authenticated users to read cash advances"
  on "public"."cash_advances"
  as permissive
  for select
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Public read access for content pages"
  on "public"."content_pages_2026_02_03_21_00"
  as permissive
  for select
  to public
using ((is_active = true));



  create policy "Admin can manage interactions"
  on "public"."customer_service_interactions_2026_02_04_16_00"
  as permissive
  for all
  to public
using ((auth.role() = 'service_role'::text));



  create policy "Users can view their interactions"
  on "public"."customer_service_interactions_2026_02_04_16_00"
  as permissive
  for select
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Authenticated users can view departments"
  on "public"."departments"
  as permissive
  for select
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Users can insert signatures"
  on "public"."digital_signatures"
  as permissive
  for insert
  to public
with check ((auth.role() = 'authenticated'::text));



  create policy "Users can view signatures"
  on "public"."digital_signatures"
  as permissive
  for select
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Drivers can update their telemetry"
  on "public"."driver_telemetry"
  as permissive
  for all
  to public
using (((auth.uid() = driver_id) OR (auth.role() = 'authenticated'::text)));



  create policy "Authenticated users can view employees"
  on "public"."employees"
  as permissive
  for select
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Public read access for faqs"
  on "public"."faqs_2026_02_03_21_00"
  as permissive
  for select
  to public
using ((is_active = true));



  create policy "Admin form submissions"
  on "public"."form_submissions"
  as permissive
  for all
  to public
using (public.is_admin_or_above(((current_setting('request.jwt.claims'::text, true))::json ->> 'email'::text)));



  create policy "Allow authenticated users to manage form submissions"
  on "public"."form_submissions"
  as permissive
  for all
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Manager read branch forms"
  on "public"."form_submissions"
  as permissive
  for select
  to public
using (public.is_manager_or_above(((current_setting('request.jwt.claims'::text, true))::json ->> 'email'::text)));



  create policy "Users read own forms"
  on "public"."form_submissions"
  as permissive
  for select
  to public
using ((user_id IN ( SELECT user_profiles.id
   FROM public.user_profiles
  WHERE ((user_profiles.email)::text = ((current_setting('request.jwt.claims'::text, true))::json ->> 'email'::text)))));



  create policy "Enable insert for system"
  on "public"."fuel_anomalies"
  as permissive
  for insert
  to public
with check ((auth.role() = 'authenticated'::text));



  create policy "Enable read access for authenticated users"
  on "public"."fuel_anomalies"
  as permissive
  for select
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Enable update for managers and admins"
  on "public"."fuel_anomalies"
  as permissive
  for update
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Authenticated users can view invoices"
  on "public"."invoices"
  as permissive
  for select
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Admin can manage performance data"
  on "public"."marketer_performance_2026_02_04_16_00"
  as permissive
  for all
  to public
using ((auth.role() = 'service_role'::text));



  create policy "Users can view their own performance"
  on "public"."marketer_performance_2026_02_04_16_00"
  as permissive
  for select
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Authenticated users can view marketing campaigns"
  on "public"."marketing_campaigns"
  as permissive
  for select
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Admins can view all merchants"
  on "public"."merchants"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.users u
  WHERE ((u.firebase_uid = (auth.uid())::text) AND (u.role = ANY (ARRAY['super_admin'::public.user_role, 'admin'::public.user_role, 'manager'::public.user_role]))))));



  create policy "Authenticated users can view merchants"
  on "public"."merchants"
  as permissive
  for select
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Merchants can view their own data"
  on "public"."merchants"
  as permissive
  for select
  to public
using ((user_id IN ( SELECT users.id
   FROM public.users
  WHERE (users.firebase_uid = (auth.uid())::text))));



  create policy "Users can view own MFA tokens"
  on "public"."mfa_tokens"
  as permissive
  for all
  to public
using ((user_id IN ( SELECT users_enhanced.id
   FROM public.users_enhanced
  WHERE (users_enhanced.auth_user_id = auth.uid()))));



  create policy "Users can view own notifications"
  on "public"."notifications"
  as permissive
  for select
  to public
using ((user_id IN ( SELECT users_enhanced.id
   FROM public.users_enhanced
  WHERE (users_enhanced.auth_user_id = auth.uid()))));



  create policy "Enable all for authenticated users"
  on "public"."orders"
  as permissive
  for all
  to authenticated
using (true);



  create policy "Merchant can view own parcels"
  on "public"."parcels"
  as permissive
  for select
  to public
using ((merchant_id = ( SELECT parcels.merchant_id
   FROM public.profiles
  WHERE (profiles.id = auth.uid()))));



  create policy "Rider sees assigned parcels"
  on "public"."parcels"
  as permissive
  for select
  to public
using ((assigned_rider = auth.uid()));



  create policy "Users can view their own password changes"
  on "public"."password_changes"
  as permissive
  for select
  to public
using ((user_id IN ( SELECT user_profiles.id
   FROM public.user_profiles
  WHERE (user_profiles.user_id = auth.uid()))));



  create policy "Authenticated users can view permissions"
  on "public"."permissions"
  as permissive
  for select
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Public read access for pricing"
  on "public"."pricing_2026_02_03_21_00"
  as permissive
  for select
  to public
using ((is_active = true));



  create policy "Users can read own profile"
  on "public"."profiles"
  as permissive
  for select
  to public
using ((auth.uid() = id));



  create policy "Users can update their own display name"
  on "public"."profiles"
  as permissive
  for update
  to authenticated
using ((id = auth.uid()))
with check ((id = auth.uid()));



  create policy "Users can view own profile"
  on "public"."profiles"
  as permissive
  for select
  to authenticated
using ((id = auth.uid()));



  create policy "Public read access for prohibited items"
  on "public"."prohibited_items_2026_02_03_21_00"
  as permissive
  for select
  to public
using ((is_active = true));



  create policy "QR codes are publicly readable"
  on "public"."qr_codes_2026_02_04_15_54"
  as permissive
  for select
  to public
using (true);



  create policy "Riders can manage own locations"
  on "public"."rider_locations_2026_02_04_14_23"
  as permissive
  for all
  to public
using ((rider_id IN ( SELECT riders_2026_02_04_14_23.id
   FROM public.riders_2026_02_04_14_23
  WHERE (riders_2026_02_04_14_23.user_id = auth.uid()))));



  create policy "Service role can view all rider locations"
  on "public"."rider_locations_2026_02_04_14_23"
  as permissive
  for all
  to public
using ((auth.role() = 'service_role'::text));



  create policy "Riders can update own notifications"
  on "public"."rider_notifications_2026_02_04_14_23"
  as permissive
  for update
  to public
using ((rider_id IN ( SELECT riders_2026_02_04_14_23.id
   FROM public.riders_2026_02_04_14_23
  WHERE (riders_2026_02_04_14_23.user_id = auth.uid()))));



  create policy "Riders can view own notifications"
  on "public"."rider_notifications_2026_02_04_14_23"
  as permissive
  for select
  to public
using ((rider_id IN ( SELECT riders_2026_02_04_14_23.id
   FROM public.riders_2026_02_04_14_23
  WHERE (riders_2026_02_04_14_23.user_id = auth.uid()))));



  create policy "Service role can manage all rider notifications"
  on "public"."rider_notifications_2026_02_04_14_23"
  as permissive
  for all
  to public
using ((auth.role() = 'service_role'::text));



  create policy "Riders can update own tasks"
  on "public"."rider_tasks_2026_02_04_14_23"
  as permissive
  for update
  to public
using ((rider_id IN ( SELECT riders_2026_02_04_14_23.id
   FROM public.riders_2026_02_04_14_23
  WHERE (riders_2026_02_04_14_23.user_id = auth.uid()))));



  create policy "Riders can view own tasks"
  on "public"."rider_tasks_2026_02_04_14_23"
  as permissive
  for select
  to public
using ((rider_id IN ( SELECT riders_2026_02_04_14_23.id
   FROM public.riders_2026_02_04_14_23
  WHERE (riders_2026_02_04_14_23.user_id = auth.uid()))));



  create policy "Service role can manage all rider tasks"
  on "public"."rider_tasks_2026_02_04_14_23"
  as permissive
  for all
  to public
using ((auth.role() = 'service_role'::text));



  create policy "Riders can insert own transactions"
  on "public"."rider_transactions_2026_02_04_14_23"
  as permissive
  for insert
  to public
with check ((rider_id IN ( SELECT riders_2026_02_04_14_23.id
   FROM public.riders_2026_02_04_14_23
  WHERE (riders_2026_02_04_14_23.user_id = auth.uid()))));



  create policy "Riders can view own transactions"
  on "public"."rider_transactions_2026_02_04_14_23"
  as permissive
  for select
  to public
using ((rider_id IN ( SELECT riders_2026_02_04_14_23.id
   FROM public.riders_2026_02_04_14_23
  WHERE (riders_2026_02_04_14_23.user_id = auth.uid()))));



  create policy "Service role can manage all rider transactions"
  on "public"."rider_transactions_2026_02_04_14_23"
  as permissive
  for all
  to public
using ((auth.role() = 'service_role'::text));



  create policy "Riders can update own profile"
  on "public"."riders_2026_02_04_14_23"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Riders can view own profile"
  on "public"."riders_2026_02_04_14_23"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Service role can manage all riders"
  on "public"."riders_2026_02_04_14_23"
  as permissive
  for all
  to public
using ((auth.role() = 'service_role'::text));



  create policy "Authenticated users can view role permissions"
  on "public"."role_permissions"
  as permissive
  for select
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Drivers can view their routes"
  on "public"."route_optimization"
  as permissive
  for select
  to public
using (((auth.uid() = driver_id) OR (auth.role() = 'authenticated'::text)));



  create policy "Public read access for services"
  on "public"."services_2026_02_03_21_00"
  as permissive
  for select
  to public
using ((is_active = true));



  create policy "Users can insert shipments"
  on "public"."shipment_tracking_enhanced"
  as permissive
  for insert
  to public
with check ((auth.uid() = created_by));



  create policy "Users can view their own shipments"
  on "public"."shipment_tracking_enhanced"
  as permissive
  for select
  to public
using (((auth.uid() = created_by) OR (auth.role() = 'authenticated'::text)));



  create policy "Users can view related shipments"
  on "public"."shipments"
  as permissive
  for select
  to public
using (((merchant_id IN ( SELECT m.id
   FROM (public.merchants m
     JOIN public.users u ON ((m.user_id = u.id)))
  WHERE (u.firebase_uid = (auth.uid())::text))) OR (assigned_rider_id IN ( SELECT users.id
   FROM public.users
  WHERE (users.firebase_uid = (auth.uid())::text))) OR (EXISTS ( SELECT 1
   FROM public.users u
  WHERE ((u.firebase_uid = (auth.uid())::text) AND (u.role = ANY (ARRAY['super_admin'::public.user_role, 'admin'::public.user_role, 'manager'::public.user_role, 'warehouse_staff'::public.user_role])))))));



  create policy "Authenticated users can view support tickets"
  on "public"."support_tickets"
  as permissive
  for select
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "System can insert audit logs"
  on "public"."system_audit_log"
  as permissive
  for insert
  to public
with check (true);



  create policy "Admin can manage system config"
  on "public"."system_config_2026_02_04_16_00"
  as permissive
  for all
  to public
using ((auth.role() = 'service_role'::text));



  create policy "Authenticated users can view system config"
  on "public"."system_config_2026_02_04_16_00"
  as permissive
  for select
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Admin read system config"
  on "public"."system_configuration"
  as permissive
  for select
  to public
using (public.is_admin_or_above(((current_setting('request.jwt.claims'::text, true))::json ->> 'email'::text)));



  create policy "Allow authenticated users to manage system config"
  on "public"."system_configuration"
  as permissive
  for all
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Allow authenticated users to read system config"
  on "public"."system_configuration"
  as permissive
  for select
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Super admin system config"
  on "public"."system_configuration"
  as permissive
  for all
  to public
using (public.is_super_admin(((current_setting('request.jwt.claims'::text, true))::json ->> 'email'::text)));



  create policy "Admins can manage settings"
  on "public"."system_settings"
  as permissive
  for all
  to public
using ((EXISTS ( SELECT 1
   FROM public.users u
  WHERE ((u.firebase_uid = (auth.uid())::text) AND (u.role = ANY (ARRAY['super_admin'::public.user_role, 'admin'::public.user_role]))))));



  create policy "Authenticated users can view system settings"
  on "public"."system_settings"
  as permissive
  for select
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Public settings are viewable by all"
  on "public"."system_settings"
  as permissive
  for select
  to public
using (((is_public = true) OR (auth.role() = 'authenticated'::text)));



  create policy "Admin can manage tariff rates"
  on "public"."tariff_rates_2026_02_04_16_00"
  as permissive
  for all
  to public
using ((auth.role() = 'service_role'::text));



  create policy "Authenticated users can view tariff rates"
  on "public"."tariff_rates_2026_02_04_16_00"
  as permissive
  for select
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Active users only"
  on "public"."user_profiles"
  as permissive
  for select
  to public
using (((auth.uid() = user_id) AND ((status)::text = 'active'::text)));



  create policy "Super admin full access"
  on "public"."user_profiles"
  as permissive
  for all
  to public
using ((EXISTS ( SELECT 1
   FROM public.user_profiles user_profiles_1
  WHERE ((user_profiles_1.user_id = auth.uid()) AND ((user_profiles_1.role)::text = 'super_admin'::text)))));



  create policy "User can view own profile"
  on "public"."user_profiles"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can view own sessions"
  on "public"."user_sessions"
  as permissive
  for select
  to public
using ((user_id IN ( SELECT users_enhanced.id
   FROM public.users_enhanced
  WHERE (users_enhanced.auth_user_id = auth.uid()))));



  create policy "Admins can insert users"
  on "public"."users"
  as permissive
  for insert
  to public
with check ((EXISTS ( SELECT 1
   FROM public.users u
  WHERE ((u.firebase_uid = (auth.uid())::text) AND (u.role = ANY (ARRAY['super_admin'::public.user_role, 'admin'::public.user_role]))))));



  create policy "Admins can update all users"
  on "public"."users"
  as permissive
  for update
  to public
using ((EXISTS ( SELECT 1
   FROM public.users u
  WHERE ((u.firebase_uid = (auth.uid())::text) AND (u.role = ANY (ARRAY['super_admin'::public.user_role, 'admin'::public.user_role]))))));



  create policy "Admins can view all users"
  on "public"."users"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.users u
  WHERE ((u.firebase_uid = (auth.uid())::text) AND (u.role = ANY (ARRAY['super_admin'::public.user_role, 'admin'::public.user_role]))))));



  create policy "Users can update their own profile"
  on "public"."users"
  as permissive
  for update
  to public
using (((auth.uid())::text = firebase_uid));



  create policy "Users can view their own profile"
  on "public"."users"
  as permissive
  for select
  to public
using (((auth.uid())::text = firebase_uid));



  create policy "System admins can manage all users"
  on "public"."users_enhanced"
  as permissive
  for all
  to public
using ((EXISTS ( SELECT 1
   FROM public.users_enhanced users_enhanced_1
  WHERE ((users_enhanced_1.auth_user_id = auth.uid()) AND (users_enhanced_1.role = 'SYSTEM_ADMIN'::public.user_role_type)))));



  create policy "Users can view own profile"
  on "public"."users_enhanced"
  as permissive
  for select
  to public
using ((auth.uid() = auth_user_id));



  create policy "Allow authenticated users to manage vouchers"
  on "public"."vouchers"
  as permissive
  for all
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Allow authenticated users to read vouchers"
  on "public"."vouchers"
  as permissive
  for select
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Users can view operations at their station"
  on "public"."warehouse_operations_2026_02_04_15_54"
  as permissive
  for select
  to public
using (((EXISTS ( SELECT 1
   FROM public.warehouse_users_2026_02_04_15_54 wu
  WHERE ((wu.user_id = auth.uid()) AND (wu.station_id = wu.station_id) AND (wu.is_active = true)))) OR (auth.role() = 'service_role'::text)));



  create policy "Warehouse users can insert operations"
  on "public"."warehouse_operations_2026_02_04_15_54"
  as permissive
  for insert
  to public
with check (((EXISTS ( SELECT 1
   FROM public.warehouse_users_2026_02_04_15_54 wu
  WHERE ((wu.user_id = auth.uid()) AND (wu.station_id = wu.station_id) AND (wu.is_active = true)))) OR (auth.role() = 'service_role'::text)));



  create policy "Warehouse users can update parcels in their station"
  on "public"."warehouse_parcels_2026_02_04_15_54"
  as permissive
  for update
  to public
using (((EXISTS ( SELECT 1
   FROM public.warehouse_users_2026_02_04_15_54 wu
  WHERE ((wu.user_id = auth.uid()) AND (wu.station_id = warehouse_parcels_2026_02_04_15_54.current_station_id) AND (wu.is_active = true)))) OR (auth.role() = 'service_role'::text)));



  create policy "Warehouse users can view their station data"
  on "public"."warehouse_parcels_2026_02_04_15_54"
  as permissive
  for select
  to public
using (((EXISTS ( SELECT 1
   FROM public.warehouse_users_2026_02_04_15_54 wu
  WHERE ((wu.user_id = auth.uid()) AND (wu.station_id = warehouse_parcels_2026_02_04_15_54.current_station_id) AND (wu.is_active = true)))) OR (auth.role() = 'service_role'::text)));



  create policy "Authenticated users can view stations"
  on "public"."warehouse_stations_2026_02_04_15_54"
  as permissive
  for select
  to public
using (((auth.role() = 'authenticated'::text) OR (auth.role() = 'service_role'::text)));



  create policy "Authenticated users can view warehouse users"
  on "public"."warehouse_users_2026_02_04_15_54"
  as permissive
  for select
  to public
using (((auth.role() = 'authenticated'::text) OR (auth.role() = 'service_role'::text)));


CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON public.branches FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_deliveries_updated_at BEFORE UPDATE ON public.deliveries FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_delivery_routes_updated_at BEFORE UPDATE ON public.delivery_routes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON public.departments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_generate_delivery_receipt AFTER INSERT ON public.digital_signatures FOR EACH ROW EXECUTE FUNCTION public.generate_delivery_receipt();

CREATE TRIGGER trigger_update_shipment_status AFTER INSERT ON public.digital_signatures FOR EACH ROW EXECUTE FUNCTION public.update_shipment_status();

CREATE TRIGGER trigger_log_telemetry_update AFTER INSERT OR UPDATE ON public.driver_telemetry FOR EACH ROW EXECUTE FUNCTION public.log_telemetry_update();

CREATE TRIGGER update_financial_transactions_updated_at BEFORE UPDATE ON public.financial_transactions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_merchants_updated_at BEFORE UPDATE ON public.merchants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER parcel_update_trigger AFTER INSERT OR UPDATE ON public.parcels FOR EACH ROW EXECUTE FUNCTION public.log_parcel_update();

CREATE TRIGGER update_pricing_rules_updated_at BEFORE UPDATE ON public.pricing_rules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shipments_updated_at BEFORE UPDATE ON public.shipments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_users_enhanced_updated_at BEFORE UPDATE ON public.users_enhanced FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


