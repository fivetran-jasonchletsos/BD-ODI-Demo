// Types mirror the exact field names/types emitted by
// scripts/export_marts_to_json.py from the four dbt marts. Keep in sync
// with app/public/data/*.json.

export interface PipelineRow {
  opportunity_id: string;
  account_id: string;
  account_name: string;
  industry: string;
  billing_state: string;
  stage_name: string;
  amount: number;
  close_date: string;
  created_date: string;
  last_modified_date: string;
}

export interface SupplierSpendRow {
  po_id: string;
  supplier_id: string;
  supplier_name: string;
  supplier_category: string;
  supplier_risk_rating: string;
  po_date: string;
  po_status: string;
  total_amount: number;
  currency: string;
  invoice_count: number;
  invoiced_amount: number;
  latest_payment_status: string | null;
}

export interface ProjectStatusRow {
  item_id: string;
  board_id: string;
  board_name: string;
  workspace: string;
  item_name: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface BudgetVsActualRow {
  account_code: string;
  account_name: string;
  account_type: string;
  level_code: string;
  period_date: string;
  budget_amount: number;
  forecast_amount: number;
  actual_amount: number;
  actual_vs_budget_variance: number;
  actual_vs_forecast_variance: number;
}
