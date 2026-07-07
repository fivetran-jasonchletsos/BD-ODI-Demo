# BD-ODI-Demo infra
#
# Sales-engineering demo for BD (Becton, Dickinson and Company), evaluating
# Fivetran against their current ingestion approach across four systems:
# Salesforce (currently via Azure Data Factory), Coupa (currently via ADF),
# monday.com (currently custom API scripts), and Workday Adaptive Planning
# (currently custom API scripts). Destination is a single consolidated
# Snowflake database, replacing the four separate ingestion paths.
#
# This configuration is code-only scaffolding for demo purposes. It is
# validated with `terraform validate` against zero real credentials and is
# not intended to be applied against a live Fivetran or Snowflake account
# as part of this build.

provider "fivetran" {
  api_key    = var.fivetran_api_key
  api_secret = var.fivetran_api_secret
}
