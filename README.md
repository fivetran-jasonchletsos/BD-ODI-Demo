# BD-ODI-Demo

A sales-engineering demo built for a real prospect: BD (Becton, Dickinson and Company).
BD is evaluating Fivetran against their current ingestion approach across four systems —
Salesforce, Coupa, monday.com, and Workday Adaptive Planning — with the goal of replacing
four separately-maintained pipelines with four managed Fivetran connectors landing in a
single Snowflake destination. This repo is not marketing collateral: every sync-frequency,
sync-method, and object-support claim it makes is sourced directly from Fivetran's published
documentation (see Sources below), and any figure that could not be independently confirmed
is labeled as inferred or not verified rather than presented as fact.

```
Salesforce ---- ADF (current)         --\
Coupa      ---- ADF (current)           \
monday.com ---- custom API (in dev)      >--  4x Fivetran connectors --> Snowflake (jason_chletsos_bd) --> dbt (bd_pipeline) --> dashboard (app/)
Workday Adaptive Planning -- custom API /
                              (in dev) --/
```

## Why this exists

BD ingests the same four systems today through four different, separately maintained
approaches:

- **Salesforce** and **Coupa** via Azure Data Factory (ADF)
- **monday.com** and **Workday Adaptive Planning** via custom, in-house API integrations
  that BD is currently building and will have to maintain going forward

BD reports latency on some Salesforce tables under their current ADF pipeline, and
separately evaluated Databricks Lakeflow Connect for Salesforce and found it had
limitations for their use case (their own reported evaluation experience — not an
independently verified or externally documented Lakeflow limitation). For Coupa, BD wants
a more near-real-time solution than their current ADF batch ingestion. For monday.com and
Workday Adaptive Planning, BD wants to evaluate whether a managed connector can replace the
custom API code they are otherwise on the hook to build and maintain.

This demo consolidates all four into one Snowflake destination and shows what a unified
dbt + dashboard layer on top of that looks like, alongside a factual, source-cited
breakdown of what Fivetran can and cannot currently confirm for each system.

## Current state vs. Fivetran capability

Every cell below is sourced from Fivetran's published documentation. Where a figure is
Fivetran's stated platform-wide policy applied to a specific connector (rather than a
sentence Fivetran wrote about that connector by name), it's marked *inferred*. Where no
connector-specific minimum is published at all, it's marked *not verified* — that is
reported honestly rather than guessed.

| System | Current approach | Current pain (BD's own reported experience) | Fivetran sync method | Fastest sync frequency |
|---|---|---|---|---|
| Salesforce (Sales Cloud) | Azure Data Factory (ADF) | Latency on some tables under ADF; also evaluated Databricks Lakeflow Connect and, per BD's own reported evaluation experience, found limitations | Polling (SOQL via REST API + Bulk API), not CDC/streaming. Incremental syncs keyed on SystemModStamp / LastModifiedDate / CreatedDate / LoginTime, in that order; objects without one of those fields are fully re-imported | 1 minute on Enterprise/Business Critical, 5 minutes on lower plans — *inferred* (Salesforce is not on Fivetran's list of connectors excluded from the 1-minute frequency; no sentence names Salesforce and "1 minute" directly) |
| Coupa | Azure Data Factory (ADF) | Wants a more near-real-time solution than current ADF batch ingestion | Fully managed REST API polling connector. OAuth2/OIDC client-credentials auth; Coupa's own API filters constrain volume before Fivetran extracts, processes, and loads; parent/child table re-sync cascades | 1 minute on Enterprise/Business Critical, 5 minutes on lower/Standard plans — *inferred* (same exclusion-list reasoning as Salesforce; Coupa's own connector page states no connector-specific minimum) |
| monday.com | Custom, in-house API integration (in development) | BD is building and will need to maintain this integration in-house; wants to evaluate Fivetran as a managed alternative | API polling via a monday.com Personal API Token. Classified by Fivetran as a "Lite" connector. Only ACTIVITY_LOG is incrementally captured (new records only); every other table is fully re-imported each sync, not delta/CDC | 5 minutes — *inferred* (Fivetran's Sync Overview doc states the 1-minute frequency is unavailable to any Lite connector; no monday.com-specific number is published) |
| Workday Adaptive Planning | Custom, in-house API integration (in development) | BD is building and will need to maintain this integration in-house, specifically to pull Factsheet, Cube Sheets, and Account Transactions data | REST/HTTPS polling (login/password or Connect Card auth). Every sync is a full re-import of fixed metadata tables plus manually-configured custom report tables — not incremental. Fivetran does not auto-discover sheets: Factsheet/Cube-Sheet data must first exist as a Report built inside Adaptive Planning, then be registered one at a time as a Fivetran custom report; there is no dedicated "Account Transactions" object | **Not verified** — Fivetran publishes no connector-specific minimum sync frequency for this connector, and because every sync fully re-imports metadata plus all custom reports, a fast frequency may not even be advisable. Confirm with Fivetran support/product before quoting a number to BD |

The frontend's `/connectors` page renders this same table live from
`app/src/lib/findings.ts`, which is the single source of truth for these claims and links
out to the underlying Fivetran doc page for each row.

## Terraform (`infra/`)

Code-only scaffolding — validated with `terraform validate` against zero real credentials,
never applied against a live Fivetran or Snowflake account.

- `versions.tf` — `fivetran/fivetran ~> 1.1`. No Snowflake provider is configured; nothing
  in this project provisions Snowflake objects directly, so there's no `snowflakedb/snowflake`
  block.
- `main.tf` — the `fivetran` provider, credentialed from `fivetran_api_key` /
  `fivetran_api_secret` variables.
- `variables.tf` — Fivetran API credentials (sensitive, default `""`); Snowflake connection
  details used by the `fivetran_destination` config block (`snowflake_account` maps to
  Fivetran's `host` field — Fivetran's Snowflake destination schema has no separate
  `account` field — plus `snowflake_database` defaulted to `jason_chletsos_bd`,
  `snowflake_warehouse`, `snowflake_role`, `snowflake_user`, `snowflake_password`, all
  sensitive/defaulted to `""`); and one `*_sync_frequency_minutes` variable per connector,
  each defaulted to the fastest value in the table above (Salesforce `"1"`, Coupa `"1"`,
  monday.com `"5"`, Workday Adaptive Planning `"1440"`, flagged not verified).
- `destination.tf` — a `fivetran_group` and `fivetran_destination` (`service = "snowflake"`)
  for the single consolidated Snowflake database `jason_chletsos_bd`.
- `connectors.tf` — four `fivetran_connector` + `fivetran_connector_schedule` resource
  pairs, one per system, using the exact service identifiers confirmed in research
  (`salesforce`, `coupa`, `monday`, `workday_adaptive`), each writing to a
  `jason_chletsos_bd_<system>` destination schema, each with a source-cited comment
  explaining where its sync frequency came from. All connectors are created `paused = "true"`
  since this repo never authenticates against real source systems.
- `outputs.tf` — the destination id, and each connector's id and setup URL.
- `terraform.tfvars.example` — placeholder values only, no real secrets.

## dbt transform (`transform/`, project `bd_pipeline`, DuckDB target `dev`)

Seeds live in `transform/seeds/` (generated by `scripts/generate_data.py`, deterministic —
`random.seed(42)`) and model the real shape of each source system:

| Source | Seed files |
|---|---|
| Salesforce | `salesforce_accounts.csv`, `salesforce_opportunities.csv`, `salesforce_contacts.csv` |
| Coupa | `coupa_suppliers.csv`, `coupa_purchase_orders.csv`, `coupa_invoices.csv` |
| monday.com | `monday_boards.csv`, `monday_items.csv` |
| Workday Adaptive Planning | `adaptive_accounts.csv`, `adaptive_account_transactions.csv`, `adaptive_cube_sheet_headcount.csv`, `adaptive_factsheet.csv` |

(Salesforce id columns are declared `varchar` in `dbt_project.yml`'s seed config, since
DuckDB's CSV sniffer would otherwise infer purely-numeric-looking Salesforce ids as
integers and silently drop leading zeros.)

**Staging** (`models/staging/{salesforce,coupa,monday,adaptive}/`, `+materialized: view`) —
one model per seed file, with `schema.yml` `not_null`/`unique` tests on each primary key.

**Marts** (`models/marts/`, `+materialized: table`):

- `fct_pipeline` — one row per Salesforce Opportunity, with the owning Account's name
  joined in.
- `fct_supplier_spend` — one row per Coupa purchase order, with supplier name and linked
  invoice status/amount joined in.
- `fct_project_status` — one row per monday.com item, with the parent board's name joined
  in.
- `fct_budget_vs_actual` — one row per Adaptive Planning `account_code` + `period_date`,
  pivoting Budget / Forecast / Actual amounts side by side, with variance columns against
  both Budget and Forecast. Built entirely from Adaptive Planning's own `version` dimension
  rather than a Coupa rollup: Coupa's purchase orders/invoices carry no GL account code,
  cost-center, or level identifier that maps to Adaptive's `account_code`/`level_code`
  dimensions (suppliers are keyed by category, not chart-of-accounts code), so there is no
  non-arbitrary Coupa join key to build the cross-system comparison the spec originally
  described. This is consistent with the research finding that Fivetran's Workday Adaptive
  Planning connector has no documented native "Account Transactions"/GL object. The mart
  still tells the "one platform, one unified view" story: Budget/Forecast/Actual already
  live in the same source system today but require manual report-building and spreadsheet
  reconciliation to compare; unifying in Snowflake via dbt makes that a single queryable
  mart. See the design note at the top of `transform/models/marts/fct_budget_vs_actual.sql`.

**Tests**: standard `unique`/`not_null` column tests per model (`schema.yml`), a
`dbt_utils.unique_combination_of_columns` compound-key test on `fct_budget_vs_actual`
(`account_code` + `period_date`), and a custom test,
`transform/tests/assert_no_negative_amounts.sql`, asserting amount/total-amount columns
across the relevant marts are never negative.

Build output: `transform/dev.duckdb` (committed as a static snapshot).

## Frontend (`app/`)

Vite + React + TypeScript + Tailwind SPA, themed in BD's brand colors (navy `#194890`
primary, orange `#F07822` accent). Local-only — there is no GitHub Pages deploy workflow
for this repo.

- **`/` (Overview)** — one paragraph describing the demo's purpose, plus a row of four
  current-state-to-Fivetran cards (one per system), each rendered from
  `app/src/lib/findings.ts` so the copy can never drift from the sourced table above.
- **`/architecture`** — a custom SVG/HTML before/after diagram (`ArchitectureDiagram.tsx`):
  BEFORE shows four separately maintained pipelines (ADF for Salesforce, ADF for Coupa, a
  custom script for monday.com, a custom script for Workday Adaptive Planning) landing in
  whatever destination/format each was built for; AFTER shows four Fivetran connectors, one
  Snowflake destination, one dbt project, one dashboard.
- **`/connectors`** — the factual backbone of the sales conversation: a table with columns
  System, Current Approach, Current Pain, Fivetran Sync Method, Fastest Sync Frequency, and
  Source (linking out to the actual Fivetran doc page), rendered directly from
  `app/src/lib/findings.ts`.
- **`/dashboard`** — charts/tables built from the static JSON snapshots in
  `app/public/data/*.json` (exported by `scripts/export_marts_to_json.py`): Salesforce
  pipeline by stage, Coupa spend by supplier category, monday.com item status breakdown,
  and the Adaptive Planning budget-vs-actual comparison.

`app/src/lib/findings.ts` is the single source of truth for every capability claim shown
anywhere in the frontend — it exists specifically so the Overview cards and the Connectors
table can never disagree with each other or with this README.

## Running locally

### Prerequisites

- Python 3.12 (pyenv recommended)
- Node.js >= 18, npm >= 7
- dbt-core 1.9.0, dbt-duckdb 1.9.0
- Terraform >= 1.5 (only needed if re-validating/inspecting infra — never apply against a
  real account for this repo)

### 1. Configure environment (optional — only needed for `infra/`)

```bash
cp .env.example .env
cd infra
cp terraform.tfvars.example terraform.tfvars
```

### 2. Generate synthetic seed data

```bash
pip install -r requirements.txt
python3 scripts/generate_data.py
```

Writes deterministic CSVs to `transform/seeds/`.

### 3. Run dbt

```bash
cd transform
dbt deps
dbt seed
dbt run
dbt test
```

Output: `transform/dev.duckdb`

### 4. Export marts to static JSON for the frontend

```bash
python3 scripts/export_marts_to_json.py
```

Writes `app/public/data/fct_pipeline.json`, `fct_supplier_spend.json`,
`fct_project_status.json`, and `fct_budget_vs_actual.json`.

### 5. Run the frontend

```bash
cd app
npm install
npm run dev
```

### 6. (Optional) Validate the Terraform scaffolding

```bash
cd infra
terraform init -backend=false
terraform validate
```

No real Fivetran or Snowflake credentials are required for this step, and `terraform apply`
should not be run against this repo.

## Repo layout

```
infra/               Terraform — fivetran_group, fivetran_destination (Snowflake),
                      4x fivetran_connector + fivetran_connector_schedule
transform/            dbt project (bd_pipeline, DuckDB adapter)
  seeds/              12 CSVs across salesforce/coupa/monday/adaptive
  models/staging/     one view per seed file, by source
  models/marts/       fct_pipeline, fct_supplier_spend, fct_project_status,
                      fct_budget_vs_actual
  tests/              assert_no_negative_amounts.sql
  dev.duckdb          committed build snapshot
scripts/
  generate_data.py            synthetic seed generator (random.seed(42))
  export_marts_to_json.py     dbt marts -> app/public/data/*.json
app/                  Vite + React + TypeScript + Tailwind SPA
  src/lib/findings.ts         single source of truth for every Fivetran capability claim
  src/pages/                  OverviewPage, ArchitecturePage, ConnectorsPage, DashboardPage
  public/data/                static JSON snapshots consumed by the dashboard
requirements.txt      dbt-core, dbt-duckdb, duckdb
```

## Sources

Every sync-frequency, sync-method, and object-support claim in this repo traces back to
one of the following Fivetran documentation pages:

- https://fivetran.com/docs/connectors/applications/salesforce
- https://fivetran.com/docs/connectors/applications/salesforce/api-configuration
- https://fivetran.com/docs/connectors/applications/coupa
- https://fivetran.com/docs/connectors/applications/coupa/setup-guide
- https://fivetran.com/docs/connectors/applications/coupa/api-configuration
- https://fivetran.com/docs/connectors/applications/monday.com
- https://fivetran.com/docs/connectors/applications/monday.com/setup-guide
- https://fivetran.com/docs/connectors/applications/monday.com/api-configuration
- https://www.fivetran.com/connectors/monday-com
- https://fivetran.com/docs/connectors/applications/workday-adaptive-planning
- https://fivetran.com/docs/connectors/applications/workday-adaptive-planning/setup-guide
- https://fivetran.com/docs/connectors/applications/workday-adaptive-planning/api-configuration
- https://fivetran.com/docs/connectors/applications/workday-adaptive-planning/changelog
- https://fivetran.com/docs/core-concepts/syncoverview
- https://registry.terraform.io/providers/fivetran/fivetran/latest/docs/resources/connector
- https://beta.fivetran.com/docs/rest-api/api-reference/connections/create-connection?service=workday_adaptive
- https://www.fivetran.com/connectors/workday-adaptive-planning

Where a claim above is marked *inferred*, it is derived by applying a general, explicitly
stated Fivetran platform policy (e.g. the 1-minute sync frequency exclusion list, or the
Lite-connector 1-minute restriction) to a specific connector, rather than quoting a sentence
Fivetran wrote about that connector by name. Where a claim is marked *not verified*
(Workday Adaptive Planning's fastest sync frequency), no Fivetran documentation states a
connector-specific number at all — that gap is reported as-is rather than filled with a
guess, and should be confirmed directly with Fivetran support/product before being quoted
to BD.
