-- fct_budget_vs_actual: one row per account_code + period_date, comparing
-- Workday Adaptive Planning's Budget/Forecast amounts against Actual amounts.
--
-- Design note (per spec): the spec asked us to compare Adaptive's
-- budget/forecast amounts against actual spend rolled up from Coupa
-- purchase_orders/invoices "where a natural join key exists," falling back
-- to Adaptive's own version = Actual rows "if no clean Coupa join key
-- exists." In this synthetic data set (and consistent with the real-world
-- research finding that Fivetran's Workday Adaptive Planning connector has
-- no documented native "Account Transactions"/GL object -- see the
-- connectors research notes), Coupa purchase orders/invoices carry no GL
-- account code, cost-center, or level identifier that maps to Adaptive's
-- account_code/level_code dimensions. Suppliers are keyed by category, not
-- by chart-of-accounts code, so there is no non-arbitrary way to roll Coupa
-- spend up into a specific Adaptive account_code without inventing a
-- mapping table that isn't grounded in either source. We therefore build
-- this mart entirely from Adaptive Planning's own version = Actual rows
-- compared against version = Budget and version = Forecast rows, all at the
-- account_code + period_date grain. This is the cleaner, defensible option
-- and it still tells the "one platform, one unified view" story: today
-- Budget/Forecast/Actual live in the same source system but require manual
-- report-building and spreadsheet reconciliation (per the Workday Adaptive
-- Planning research notes) to compare side by side; unifying in Snowflake
-- via dbt makes that a single queryable mart.

with transactions as (

    select * from {{ ref('stg_adaptive__account_transactions') }}

),

accounts as (

    select * from {{ ref('stg_adaptive__accounts') }}

),

by_version as (

    select
        account_code,
        period_date,
        version,
        sum(amount) as version_amount

    from transactions
    group by account_code, period_date, version

),

pivoted as (

    select
        account_code,
        period_date,
        max(case when version = 'Budget' then version_amount end) as budget_amount,
        max(case when version = 'Forecast' then version_amount end) as forecast_amount,
        max(case when version = 'Actual' then version_amount end) as actual_amount

    from by_version
    group by account_code, period_date

)

select
    pivoted.account_code,
    accounts.account_name,
    accounts.account_type,
    accounts.level_code,
    pivoted.period_date,
    coalesce(pivoted.budget_amount, 0) as budget_amount,
    coalesce(pivoted.forecast_amount, 0) as forecast_amount,
    coalesce(pivoted.actual_amount, 0) as actual_amount,
    coalesce(pivoted.actual_amount, 0) - coalesce(pivoted.budget_amount, 0) as actual_vs_budget_variance,
    coalesce(pivoted.actual_amount, 0) - coalesce(pivoted.forecast_amount, 0) as actual_vs_forecast_variance

from pivoted
left join accounts
    on pivoted.account_code = accounts.account_code
