# --- Fivetran API credentials ---

variable "fivetran_api_key" {
  description = "Fivetran API key (REST API). Defaulted to empty string so plan/validate work with zero real credentials."
  type        = string
  sensitive   = true
  default     = ""
}

variable "fivetran_api_secret" {
  description = "Fivetran API secret (REST API). Defaulted to empty string so plan/validate work with zero real credentials."
  type        = string
  sensitive   = true
  default     = ""
}

# --- Existing live destination (afternoon demo) ---
# monday.com and Workday Adaptive Planning are going live today against an
# existing Fivetran destination/group already provisioned in the shared
# demo Fivetran account -- not the fivetran_group.bd / fivetran_destination.bd
# scaffolding below, which stays unapplied. Set this to that group's id.

variable "fivetran_group_id" {
  description = "Existing Fivetran group/destination id to attach the live monday.com and Workday Adaptive Planning connectors to."
  type        = string
  sensitive   = true
  default     = ""
}

# --- Snowflake destination connection details ---
# These describe the Snowflake account Fivetran will write into via the
# fivetran_destination resource. They are not used to provision Snowflake
# objects directly (no snowflake provider is configured in this project).

variable "snowflake_account" {
  description = "Snowflake account identifier / server host (e.g. xy12345.us-east-1.snowflakecomputing.com). Mapped to the Fivetran Snowflake destination config's `host` field, which Fivetran's schema documents as \"Server name\" (there is no separate `account` field in Fivetran's Snowflake destination config)."
  type        = string
  sensitive   = true
  default     = ""
}

variable "snowflake_region" {
  description = "Fivetran data processing region for the destination (required by fivetran_destination). Not a Snowflake-side setting; this controls where Fivetran computes, not where Snowflake lives."
  type        = string
  default     = "GCP_US_EAST4"
}

variable "snowflake_database" {
  description = "Snowflake database name for the consolidated BD destination. Must start with jason_chletsos_ per workspace convention."
  type        = string
  default     = "jason_chletsos_bd"
}

variable "snowflake_warehouse" {
  description = "Snowflake warehouse used by the Fivetran destination."
  type        = string
  sensitive   = true
  default     = ""
}

variable "snowflake_role" {
  description = "Snowflake role Fivetran uses to load data."
  type        = string
  sensitive   = true
  default     = ""
}

variable "snowflake_user" {
  description = "Snowflake user Fivetran authenticates as."
  type        = string
  sensitive   = true
  default     = ""
}

variable "snowflake_password" {
  description = "Snowflake password for the Fivetran destination user."
  type        = string
  sensitive   = true
  default     = ""
}

# --- Per-connector sync frequency (minutes) ---
# Defaults are set to the fastest verified frequency per connector from the
# BD-ODI-Demo research findings. Type is string (not number) because the
# fivetran_connector_schedule resource's sync_frequency attribute is a
# String with a fixed enum validator: "1", "5", "15", "30", "60", "120",
# "180", "360", "480", "720", "1440". See connectors.tf for source citations.

variable "salesforce_sync_frequency_minutes" {
  description = "Salesforce connector sync frequency in minutes. Fastest verified: 1 minute (Enterprise/Business Critical plan; 5 minutes on lower plans). See connectors.tf comment for sourcing detail."
  type        = string
  default     = "1"
}

variable "coupa_sync_frequency_minutes" {
  description = "Coupa connector sync frequency in minutes. Fastest verified: 1 minute (Enterprise/Business Critical plan; 5 minutes on lower plans, inferred from Coupa's absence on Fivetran's 1-minute exclusion list). See connectors.tf comment for sourcing detail."
  type        = string
  default     = "1"
}

variable "monday_sync_frequency_minutes" {
  description = "monday.com connector sync frequency in minutes. Fastest verified: 5 minutes (monday.com is a Fivetran 'Lite' connector; Fivetran's platform docs state the 1-minute frequency is not available for any Lite connector). See connectors.tf comment for sourcing detail."
  type        = string
  default     = "5"
}

variable "workday_adaptive_sync_frequency_minutes" {
  description = "Workday Adaptive Planning connector sync frequency in minutes. NOT VERIFIED: no connector-specific minimum sync frequency is published in Fivetran's docs for this connector, and every sync is a full re-import (not incremental), so a fast frequency may not even be advisable. Defaulted to the platform default of 1440 minutes (24 hours) pending confirmation from Fivetran. See connectors.tf TODO for detail."
  type        = string
  default     = "1440"
}
