-- fct_project_status: one row per monday.com item, with the parent board's
-- name joined in. Used for the /dashboard "item status breakdown" chart.

with items as (

    select * from {{ ref('stg_monday__items') }}

),

boards as (

    select * from {{ ref('stg_monday__boards') }}

)

select
    items.item_id,
    items.board_id,
    boards.board_name,
    boards.workspace,
    items.item_name,
    items.status,
    items.created_at,
    items.updated_at

from items
left join boards
    on items.board_id = boards.board_id
