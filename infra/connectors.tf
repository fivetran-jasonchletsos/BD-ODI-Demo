# Four Fivetran connectors, one per system BD currently ingests via a
# separate tool/approach (see README / app for the full current-state vs.
# Fivetran narrative). Service identifiers and sync frequencies below are
# taken directly from the BD-ODI-Demo research findings; each connector has
# a source-cited comment. Connector-specific auth (OAuth credentials,
# personal API tokens, etc.) is intentionally NOT modeled here — this repo
# is code-only scaffolding and is never applied against a real Fivetran or
# Snowflake account, so connector `config` blocks are left to the values
# Fivetran can accept without them (auth is completed via the connector's
# `setup_url`, see outputs.tf).

# --- 1. Salesforce (Sales Cloud) ---
# Current state: BD ingests via Azure Data Factory (ADF) and sees latency
# on some tables; BD also evaluated Databricks Lakeflow Connect and, per
# their own reported evaluation experience, found limitations.
#
# Service identifier "salesforce" confirmed via the Terraform Registry
# fivetran_connector resource docs and the REST API's Salesforce API
# Configuration doc.
resource "fivetran_connector" "salesforce" {
  group_id = fivetran_group.bd.id
  service  = "salesforce"

  destination_schema {
    name = "jason_chletsos_bd_salesforce"
  }

  depends_on = [fivetran_destination.bd]
}

# Sync frequency: 1 minute is the fastest frequency Fivetran advertises
# platform-wide (Enterprise/Business Critical plan required; 5 minutes on
# lower plans). Salesforce is not on Fivetran's list of connectors excluded
# from the 1-minute frequency, so 1 minute is used here as the fastest
# verified value -- this is an inference from that exclusion list, not a
# sentence Fivetran states specifically about Salesforce. See research
# finding notes (source: fivetran.com/docs/core-concepts/syncoverview).
resource "fivetran_connector_schedule" "salesforce" {
  connector_id      = fivetran_connector.salesforce.id
  sync_frequency    = var.salesforce_sync_frequency_minutes
  schedule_type     = "auto"
  paused            = "true"
  pause_after_trial = "true"
}

# --- 2. Coupa ---
# Current state: BD ingests via Azure Data Factory (ADF) and wants a more
# near-real-time solution.
#
# Service identifier "coupa" confirmed via the Fivetran dashboard deep link
# (serviceId=coupa) and the connector doc's embedded page JSON.
resource "fivetran_connector" "coupa" {
  group_id = fivetran_group.bd.id
  service  = "coupa"

  destination_schema {
    name = "jason_chletsos_bd_coupa"
  }

  depends_on = [fivetran_destination.bd]
}

# Sync frequency: same platform-wide reasoning as Salesforce above -- Coupa
# is not on Fivetran's 1-minute exclusion list, so 1 minute is the fastest
# verified value (Enterprise/Business Critical plan; 5 minutes on lower
# plans). Not stated in an explicit Coupa-specific sentence; inferred from
# the exclusion list on fivetran.com/docs/core-concepts/syncoverview.
resource "fivetran_connector_schedule" "coupa" {
  connector_id      = fivetran_connector.coupa.id
  sync_frequency    = var.coupa_sync_frequency_minutes
  schedule_type     = "auto"
  paused            = "true"
  pause_after_trial = "true"
}

# --- 3. monday.com ---
# Current state: BD is building custom API-based ingestion in-house and
# wants to evaluate Fivetran as an alternative.
#
# Service identifier "monday" confirmed via the literal example request
# body on the Fivetran API Configuration doc
# (POST /v1/connections, "service": "monday").
resource "fivetran_connector" "monday" {
  group_id = fivetran_group.bd.id
  service  = "monday"

  destination_schema {
    name = "jason_chletsos_bd_monday"
  }

  depends_on = [fivetran_destination.bd]
}

# Sync frequency: monday.com is classified by Fivetran as a "Lite"
# connector, and Fivetran's Sync Overview doc explicitly states the
# 1-minute frequency is not supported for any Lite connector. 5 minutes is
# therefore the fastest verified value. No monday.com-specific published
# minimum exists; this is inferred from the general Lite-connector policy
# (source: fivetran.com/docs/core-concepts/syncoverview,
# fivetran.com/docs/connectors/applications/monday.com).
resource "fivetran_connector_schedule" "monday" {
  connector_id      = fivetran_connector.monday.id
  sync_frequency    = var.monday_sync_frequency_minutes
  schedule_type     = "auto"
  paused            = "true"
  pause_after_trial = "true"
}

# --- 4. Workday Adaptive Planning ---
# Current state: BD is building custom API-based ingestion in-house and
# wants to evaluate Fivetran, specifically to pull in Factsheet, Cube
# Sheets, and Account Transactions data.
#
# Service identifier "workday_adaptive" confirmed via Fivetran's beta REST
# API create-connection reference (service=workday_adaptive) -- NOT
# "workday_adaptive_planning" or "adaptive_insights".
resource "fivetran_connector" "workday_adaptive" {
  group_id = fivetran_group.bd.id
  service  = "workday_adaptive"

  destination_schema {
    name = "jason_chletsos_bd_workday_adaptive"
  }

  depends_on = [fivetran_destination.bd]
}

# TODO(sync-frequency): NOT VERIFIED. Fivetran's Workday Adaptive Planning
# connector docs do not publish a connector-specific minimum sync
# frequency, and every sync is a full re-import of both metadata and
# custom-report tables (not incremental) -- a fast frequency may not even
# be advisable given that cost profile. Defaulted to the platform default
# of 1440 minutes (24 hours) pending confirmation from Fivetran
# support/product before quoting a number to BD. Do not change this
# default without re-verifying against current Fivetran docs.
resource "fivetran_connector_schedule" "workday_adaptive" {
  connector_id      = fivetran_connector.workday_adaptive.id
  sync_frequency    = var.workday_adaptive_sync_frequency_minutes
  schedule_type     = "auto"
  paused            = "true"
  pause_after_trial = "true"
}
