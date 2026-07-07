with source as (

    select * from {{ ref('adaptive_cube_sheet_headcount') }}

)

select
    level_code,
    department,
    position,
    cast(period_date as date) as period_date,
    cast(planned_fte as double) as planned_fte

from source
