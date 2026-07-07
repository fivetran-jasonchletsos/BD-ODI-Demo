with source as (

    select * from {{ ref('monday_items') }}

)

select
    item_id,
    board_id,
    item_name,
    status,
    cast(created_at as date) as created_at,
    cast(updated_at as date) as updated_at

from source
