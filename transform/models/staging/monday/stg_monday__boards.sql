with source as (

    select * from {{ ref('monday_boards') }}

)

select
    board_id,
    board_name,
    workspace

from source
