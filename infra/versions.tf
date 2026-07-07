terraform {
  required_version = ">= 1.5.0"

  required_providers {
    fivetran = {
      source  = "fivetran/fivetran"
      version = "~> 1.1"
    }
  }
}
