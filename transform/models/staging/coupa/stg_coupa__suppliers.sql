with source as (

    select * from {{ ref('coupa_suppliers') }}

)

select
    supplier_id,
    supplier_name,
    category,
    risk_rating

from source
