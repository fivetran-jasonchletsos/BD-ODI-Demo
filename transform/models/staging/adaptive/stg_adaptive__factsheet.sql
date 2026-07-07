with source as (

    select * from {{ ref('adaptive_factsheet') }}

)

select
    level_code,
    metric_name,
    cast(metric_value as double) as metric_value,
    cast(period_date as date) as period_date

from source
