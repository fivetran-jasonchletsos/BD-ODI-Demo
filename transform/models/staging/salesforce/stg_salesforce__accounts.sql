with source as (

    select * from {{ ref('salesforce_accounts') }}

)

select
    account_id,
    account_name,
    industry,
    billing_state,
    owner_id,
    cast(created_date as date) as created_date

from source
