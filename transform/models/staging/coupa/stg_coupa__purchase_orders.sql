with source as (

    select * from {{ ref('coupa_purchase_orders') }}

)

select
    po_id,
    supplier_id,
    cast(po_date as date) as po_date,
    status,
    cast(total_amount as double) as total_amount,
    currency

from source
