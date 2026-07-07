with source as (

    select * from {{ ref('adaptive_account_transactions') }}

)

select
    transaction_id,
    account_code,
    level_code,
    version,
    cast(period_date as date) as period_date,
    cast(amount as double) as amount

from source
