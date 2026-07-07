output "destination_id" {
  description = "The Fivetran destination (Snowflake) ID."
  value       = fivetran_destination.bd.id
}

output "salesforce_connector_id" {
  description = "The Fivetran Salesforce connector ID."
  value       = fivetran_connector.salesforce.id
}

output "salesforce_connector_setup_url" {
  description = "URL to finish Salesforce connector setup (OAuth) in the Fivetran dashboard."
  value       = "https://fivetran.com/connectors/${fivetran_connector.salesforce.id}/setup"
}

output "coupa_connector_id" {
  description = "The Fivetran Coupa connector ID."
  value       = fivetran_connector.coupa.id
}

output "coupa_connector_setup_url" {
  description = "URL to finish Coupa connector setup (OAuth2 client credentials) in the Fivetran dashboard."
  value       = "https://fivetran.com/connectors/${fivetran_connector.coupa.id}/setup"
}

output "monday_connector_id" {
  description = "The Fivetran monday.com connector ID."
  value       = fivetran_connector.monday.id
}

output "monday_connector_setup_url" {
  description = "URL to finish monday.com connector setup (Personal API Token) in the Fivetran dashboard."
  value       = "https://fivetran.com/connectors/${fivetran_connector.monday.id}/setup"
}

output "workday_adaptive_connector_id" {
  description = "The Fivetran Workday Adaptive Planning connector ID."
  value       = fivetran_connector.workday_adaptive.id
}

output "workday_adaptive_connector_setup_url" {
  description = "URL to finish Workday Adaptive Planning connector setup (login/password or Connect Card) in the Fivetran dashboard."
  value       = "https://fivetran.com/connectors/${fivetran_connector.workday_adaptive.id}/setup"
}
