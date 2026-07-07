-- fct_pipeline: one row per Salesforce Opportunity, with the owning Account's
-- name joined in. This is the "Salesforce pipeline" view used on the
-- /dashboard page (pipeline by stage).

with opportunities as (

    select * from {{ ref('stg_salesforce__opportunities') }}

),

accounts as (

    select * from {{ ref('stg_salesforce__accounts') }}

)

select
    opportunities.opportunity_id,
    opportunities.account_id,
    accounts.account_name,
    accounts.industry,
    accounts.billing_state,
    opportunities.stage_name,
    opportunities.amount,
    opportunities.close_date,
    opportunities.created_date,
    opportunities.last_modified_date

from opportunities
left join accounts
    on opportunities.account_id = accounts.account_id
