#!/usr/bin/env bash
# Force an immediate sync on one or more live Fivetran connectors.
# Requires FIVETRAN_API_KEY / FIVETRAN_API_SECRET in the environment --
# never pass credentials as arguments (they'd end up in shell history).
#
# Usage: ./scripts/trigger_sync.sh <connector_id> [connector_id ...]

set -euo pipefail

if [[ -z "${FIVETRAN_API_KEY:-}" || -z "${FIVETRAN_API_SECRET:-}" ]]; then
  echo "Set FIVETRAN_API_KEY and FIVETRAN_API_SECRET in your shell before running this." >&2
  exit 1
fi

if [[ $# -eq 0 ]]; then
  echo "Usage: $0 <connector_id> [connector_id ...]" >&2
  exit 1
fi

for connector_id in "$@"; do
  echo "Forcing sync on connector ${connector_id}..."
  curl --fail --silent --show-error \
    --user "${FIVETRAN_API_KEY}:${FIVETRAN_API_SECRET}" \
    --request POST \
    --header "Content-Type: application/json" \
    "https://api.fivetran.com/v1/connectors/${connector_id}/force" \
    | python3 -m json.tool
  echo
done
