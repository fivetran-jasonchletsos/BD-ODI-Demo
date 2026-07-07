// Single source of truth for every Fivetran capability claim shown in this
// demo. Every field here traces directly back to the verified research
// findings in the BD-ODI-Demo spec (same findings infra/connectors.tf was
// built from). Do not add a number or claim here that isn't backed by a
// research finding below -- if a finding says something could not be
// verified, say so plainly in the copy instead of inventing a value.

export type Verification = 'confirmed' | 'inferred' | 'unverified';

export interface SystemFinding {
  key: 'salesforce' | 'coupa' | 'monday' | 'workday_adaptive';
  system: string;
  serviceIdentifier: string;
  currentApproach: string;
  currentPain: string;
  fivetranSyncMethod: string;
  fastestSyncFrequency: string;
  syncFrequencyVerification: Verification;
  syncFrequencyNote: string;
  sourceUrls: string[];
}

export const FINDINGS: SystemFinding[] = [
  {
    key: 'salesforce',
    system: 'Salesforce (Sales Cloud)',
    serviceIdentifier: 'salesforce',
    currentApproach: 'Azure Data Factory (ADF)',
    currentPain:
      'BD reports latency on some tables ingested via ADF. BD also evaluated Databricks Lakeflow Connect and, per their own reported evaluation experience, found it had limitations for this use case.',
    fivetranSyncMethod:
      'Polling, not CDC/streaming. Fivetran queries Salesforce via SOQL using both the REST API (smaller incremental syncs, fallback) and the Bulk API (historical / high-volume incremental syncs). Incremental syncs are detected using timestamp fields in preference order (SystemModStamp, LastModifiedDate, CreatedDate, LoginTime); objects without one of these fields are fully re-imported instead. There is no Salesforce CDC / Platform Events / streaming mechanism involved.',
    fastestSyncFrequency: '1 minute (Enterprise / Business Critical plan); 5 minutes on lower plans',
    syncFrequencyVerification: 'inferred',
    syncFrequencyNote:
      "1 minute is Fivetran's fastest platform-wide frequency and Salesforce is not on the list of connectors Fivetran excludes from it -- so 1 minute is used as the fastest verified value. This is an inference from that exclusion list, not a sentence Fivetran states specifically about Salesforce.",
    sourceUrls: [
      'https://fivetran.com/docs/connectors/applications/salesforce',
      'https://fivetran.com/docs/core-concepts/syncoverview',
    ],
  },
  {
    key: 'coupa',
    system: 'Coupa',
    serviceIdentifier: 'coupa',
    currentApproach: 'Azure Data Factory (ADF)',
    currentPain: 'BD wants a more near-real-time solution than their current ADF-based batch ingestion.',
    fivetranSyncMethod:
      "Fully managed REST API polling connector. Authenticates via OAuth2/OIDC client-credentials (a Coupa-side Client ID + Client Secret scoped to core.*.read permissions). Coupa's own API filters constrain response volume before Fivetran extracts, processes, and loads the data. Table-level re-sync cascades: a parent table re-sync triggers re-sync of all child tables, and vice versa.",
    fastestSyncFrequency: '1 minute (Enterprise / Business Critical plan); 5 minutes on lower / Standard plans',
    syncFrequencyVerification: 'inferred',
    syncFrequencyNote:
      "Coupa's own connector page does not state a connector-specific minimum. Coupa is not on Fivetran's list of connectors excluded from the 1-minute frequency, so 1 minute is used here as the fastest verified value by the same platform-wide rule -- not an explicit Coupa-specific statement.",
    sourceUrls: [
      'https://fivetran.com/docs/connectors/applications/coupa',
      'https://fivetran.com/docs/core-concepts/syncoverview',
    ],
  },
  {
    key: 'monday',
    system: 'monday.com',
    serviceIdentifier: 'monday',
    currentApproach: 'Custom, in-house API-based ingestion (in development)',
    currentPain:
      'BD is currently building and will need to maintain a custom API integration in-house, and wants to evaluate Fivetran as a managed alternative.',
    fivetranSyncMethod:
      "API polling using a monday.com Personal API Token. Fivetran classifies this as a \"Lite\" connector. Only the ACTIVITY_LOG table is incrementally captured (new records only); all other tables are fully re-imported on every sync run, not delta/CDC-based.",
    fastestSyncFrequency: '5 minutes',
    syncFrequencyVerification: 'inferred',
    syncFrequencyNote:
      "No monday.com-specific published minimum exists. Fivetran's Sync Overview doc states the 1-minute frequency is not supported for any \"Lite\" connector, and monday.com is classified as Lite -- so 5 minutes is the fastest frequency available to it under that general policy.",
    sourceUrls: [
      'https://fivetran.com/docs/connectors/applications/monday.com',
      'https://fivetran.com/docs/core-concepts/syncoverview',
    ],
  },
  {
    key: 'workday_adaptive',
    system: 'Workday Adaptive Planning',
    serviceIdentifier: 'workday_adaptive',
    currentApproach: 'Custom, in-house API-based ingestion (in development)',
    currentPain:
      'BD is currently building and will need to maintain a custom API integration in-house, specifically to pull Factsheet, Cube Sheets, and Account Transactions data, and wants to evaluate Fivetran as an alternative.',
    fivetranSyncMethod:
      'REST/HTTPS API polling against the Workday Adaptive Planning API (login/password or Connect Card auth). Every sync performs a full re-import of both the fixed metadata tables and any manually-configured custom report tables -- not incremental/CDC. Report data is delivered by the source in wide format (fiscal periods as columns); Fivetran unpivots it into long format before loading. Fivetran does not auto-discover sheets: Factsheet- and Cube-Sheet-style data must first exist as a Report built inside Adaptive Planning, then be registered one at a time as a Fivetran custom report. There is no dedicated "Account Transactions" object in Fivetran\'s connector -- transaction/GL-level data would likewise depend on whether BD\'s Adaptive Planning admin can build a Report that surfaces it.',
    fastestSyncFrequency: 'Not verified',
    syncFrequencyVerification: 'unverified',
    syncFrequencyNote:
      "Fivetran's docs do not publish a connector-specific minimum sync frequency for Workday Adaptive Planning, and every sync is a full re-import of metadata plus all custom reports -- a fast frequency may not even be advisable given that cost profile. Confirm the actual selectable frequency with Fivetran support/product before quoting a number to BD.",
    sourceUrls: ['https://fivetran.com/docs/connectors/applications/workday-adaptive-planning'],
  },
];

export function findingByKey(key: SystemFinding['key']): SystemFinding {
  const f = FINDINGS.find((x) => x.key === key);
  if (!f) throw new Error(`No finding for ${key}`);
  return f;
}
