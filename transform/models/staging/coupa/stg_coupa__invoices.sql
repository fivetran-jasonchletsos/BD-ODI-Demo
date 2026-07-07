with source as (

    select * from {{ ref('coupa_invoices') }}

)

select
    invoice_id,
    po_id,
    cast(invoice_date as date) as invoice_date,
    cast(amount as double) as amount,
    payment_status

from source
