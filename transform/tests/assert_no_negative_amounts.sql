-- Custom singular test: asserts that no monetary amount column across the
-- relevant marts is negative. Returns any offending rows (a passing test
-- returns zero rows).

with pipeline_violations as (

    select
        'fct_pipeline' as mart_name,
        opportunity_id as record_id,
        amount as amount

    from {{ ref('fct_pipeline') }}
    where amount < 0

),

supplier_spend_violations as (

    select
        'fct_supplier_spend' as mart_name,
        po_id as record_id,
        total_amount as amount

    from {{ ref('fct_supplier_spend') }}
    where total_amount < 0

),

budget_vs_actual_budget_violations as (

    select
        'fct_budget_vs_actual (budget_amount)' as mart_name,
        account_code as record_id,
        budget_amount as amount

    from {{ ref('fct_budget_vs_actual') }}
    where budget_amount < 0

),

budget_vs_actual_forecast_violations as (

    select
        'fct_budget_vs_actual (forecast_amount)' as mart_name,
        account_code as record_id,
        forecast_amount as amount

    from {{ ref('fct_budget_vs_actual') }}
    where forecast_amount < 0

),

budget_vs_actual_actual_violations as (

    select
        'fct_budget_vs_actual (actual_amount)' as mart_name,
        account_code as record_id,
        actual_amount as amount

    from {{ ref('fct_budget_vs_actual') }}
    where actual_amount < 0

)

select * from pipeline_violations
union all
select * from supplier_spend_violations
union all
select * from budget_vs_actual_budget_violations
union all
select * from budget_vs_actual_forecast_violations
union all
select * from budget_vs_actual_actual_violations
