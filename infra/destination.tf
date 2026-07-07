# Single consolidated Snowflake destination for BD. This is the "one
# platform instead of four ingestion approaches" story: Salesforce, Coupa,
# monday.com, and Workday Adaptive Planning all land here via their own
# Fivetran connectors (see connectors.tf).
#
# Fivetran groups and destinations map 1:1. A group must exist before a
# destination can be created against it.

resource "fivetran_group" "bd" {
  name = "jason_chletsos_bd"
}

resource "fivetran_destination" "bd" {
  group_id          = fivetran_group.bd.id
  service           = "snowflake"
  time_zone_offset  = "0"
  region            = var.snowflake_region
  run_setup_tests   = "true"
  networking_method = "Directly"

  config {
    # Fivetran's Snowflake destination config does not have a distinct
    # "account" field; the account/server identifier is passed as `host`.
    host                      = var.snowflake_account
    database                  = var.snowflake_database
    user                      = var.snowflake_user
    password                  = var.snowflake_password
    role                      = var.snowflake_role
    default_virtual_warehouse = var.snowflake_warehouse
    auth                      = "PASSWORD"
  }
}
