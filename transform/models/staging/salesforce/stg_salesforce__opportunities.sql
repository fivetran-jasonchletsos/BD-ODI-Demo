with source as (

    select * from {{ ref('salesforce_opportunities') }}

)

select
    opportunity_id,
    account_id,
    stage_name,
    cast(amount as double) as amount,
    cast(close_date as date) as close_date,
    cast(created_date as date) as created_date,
    cast(last_modified_date as date) as last_modified_date

from source
