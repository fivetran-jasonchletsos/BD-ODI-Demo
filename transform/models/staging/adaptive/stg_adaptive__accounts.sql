with source as (

    select * from {{ ref('adaptive_accounts') }}

)

select
    account_code,
    account_name,
    account_type,
    level_code

from source
