-- fct_supplier_spend: one row per Coupa purchase order, with the supplier
-- name joined in and a linked invoice status. A PO can have more than one
-- invoice in the seed data (partial invoicing is normal in Coupa), so to
-- keep the "one row per PO" grain requested in the spec, invoice_status
-- reflects the most recent invoice against that PO, and invoiced_amount is
-- the sum across all invoices linked to that PO.

with purchase_orders as (

    select * from {{ ref('stg_coupa__purchase_orders') }}

),

suppliers as (

    select * from {{ ref('stg_coupa__suppliers') }}

),

invoices as (

    select * from {{ ref('stg_coupa__invoices') }}

),

invoice_agg as (

    select
        po_id,
        sum(amount) as invoiced_amount,
        count(*) as invoice_count,
        max(invoice_date) as latest_invoice_date

    from invoices
    group by po_id

),

latest_invoice_status as (

    select
        invoices.po_id,
        invoices.payment_status as latest_payment_status

    from invoices
    inner join invoice_agg
        on invoices.po_id = invoice_agg.po_id
        and invoices.invoice_date = invoice_agg.latest_invoice_date

    -- de-dupe in the rare case of a tie on latest_invoice_date for the same PO
    qualify row_number() over (partition by invoices.po_id order by invoices.invoice_id) = 1

)

select
    purchase_orders.po_id,
    purchase_orders.supplier_id,
    suppliers.supplier_name,
    suppliers.category as supplier_category,
    suppliers.risk_rating as supplier_risk_rating,
    purchase_orders.po_date,
    purchase_orders.status as po_status,
    purchase_orders.total_amount,
    purchase_orders.currency,
    invoice_agg.invoice_count,
    invoice_agg.invoiced_amount,
    latest_invoice_status.latest_payment_status

from purchase_orders
left join suppliers
    on purchase_orders.supplier_id = suppliers.supplier_id
left join invoice_agg
    on purchase_orders.po_id = invoice_agg.po_id
left join latest_invoice_status
    on purchase_orders.po_id = latest_invoice_status.po_id
