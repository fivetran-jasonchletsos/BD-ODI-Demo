// Sourced facts for the SOX Compliance page. SOX/ICFR compliance itself
// belongs to BD, not to any vendor -- Fivetran and dbt Labs aren't "SOX
// certified" (SOX has no vendor certification). What's sourced below is
// each vendor's own third-party attestations (which BD's auditors can rely
// on for vendor risk assessment) and the product features that support
// BD's internal controls over financially-relevant data (monday.com
// project costs, Workday Adaptive Planning budget/actuals).

export interface ComplianceItem {
  label: string;
  detail: string;
  sourceUrls: string[];
}

export const VENDOR_ATTESTATIONS: Record<'fivetran' | 'dbt_labs', ComplianceItem[]> = {
  fivetran: [
    {
      label: 'Third-party attestations',
      detail:
        'SOC 2 Type II, ISO 27001, ISO 27701, HITRUST, and PCI DSS. The full SOC 2 Type II report is provided to customers under NDA via the Fivetran account team, not published publicly -- confirm current report access before citing a specific audit period to BD.',
      sourceUrls: ['https://trust.fivetran.com/', 'https://www.fivetran.com/security'],
    },
    {
      label: 'Audit logging',
      detail:
        'Privileged actions are captured in audit logs for review and anomalous-behavior detection. The Fivetran dashboard account page lets a security team audit every trust-related configuration selection made on the account.',
      sourceUrls: ['https://fivetran.com/docs/security'],
    },
    {
      label: 'Access control',
      detail:
        'Production infrastructure access is restricted to hardened bastion hosts requiring MFA, with least-privilege enforced via IAM policy -- relevant to segregation-of-duties expectations under SOX.',
      sourceUrls: ['https://fivetran.com/docs/security'],
    },
  ],
  dbt_labs: [
    {
      label: 'Third-party attestations',
      detail:
        'SOC 2 Type II (since December 2020), ISO 27001:2022, ISO 27701, and ISO 42001. As with Fivetran, the report itself is shared with customers under NDA, not published publicly.',
      sourceUrls: ['https://www.getdbt.com/security', 'https://www.getdbt.com/blog/dbt-labs-iso-certifications'],
    },
    {
      label: 'Audit log (dbt Cloud Enterprise)',
      detail:
        'A centralized audit log tracks authentication, environment, job, service-token, group, user, project, permission, connection, repository, and credential events, retained for at least 12 months and exportable for compliance review.',
      sourceUrls: ['https://docs.getdbt.com/docs/cloud/manage-access/audit-log'],
    },
    {
      label: 'Change management',
      detail:
        'Every model is git-version-controlled with PR review and CI job runs before merge, giving BD a documented, approvable change trail for the transformation logic that produces budget-vs-actual and project-status figures -- a core SOX ICFR control theme (documented, auditable change control).',
      sourceUrls: ['https://docs.getdbt.com/docs/cloud/about-cloud/architecture'],
    },
  ],
};

export const SOX_FRAMING = {
  headline: "SOX applies to BD, not to Fivetran or dbt Labs",
  body:
    'Sarbanes-Oxley (Section 404) requires BD to maintain and attest to its own internal controls over financial reporting (ICFR) -- there is no such thing as a "SOX-certified" vendor. What Fivetran and dbt Labs contribute is (1) their own independent SOC 2 Type II / ISO attestations, which BD\'s auditors can rely on as part of third-party/vendor risk assessment, and (2) product features -- audit logs, access control, version-controlled change management -- that BD can point to as evidence supporting its own control narrative for the systems in this pipeline (monday.com project costs, Workday Adaptive Planning budget/actuals). BD\'s auditors still need to assess control design and operating effectiveness themselves.',
};
