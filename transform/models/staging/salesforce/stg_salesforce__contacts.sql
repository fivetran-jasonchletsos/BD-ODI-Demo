with source as (

    select * from {{ ref('salesforce_contacts') }}

)

select
    contact_id,
    account_id,
    first_name,
    last_name,
    email,
    title

from source
