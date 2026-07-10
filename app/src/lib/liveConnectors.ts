import type { SystemFinding } from './findings';

// Real, live Fivetran connectors stood up for the afternoon demo -- distinct
// from findings.ts, which is sourced purely from Fivetran's published docs.
// Filled in once infra/ is applied against the real destination; keys with
// no entry render no live link.
export const LIVE_CONNECTORS: Partial<Record<SystemFinding['key'], { dashboardUrl: string; status: string }>> = {
  monday: {
    dashboardUrl: 'https://fivetran.com/dashboard/connections/evangelist_blockade/status?groupId=fortitude_fawn&service=monday',
    status: 'syncing',
  },
  // Standing in for Workday Adaptive Planning: valid Adaptive Planning tenant
  // credentials weren't available in time for this demo, and that connector
  // authenticates against a different backend than Workday HCM. This is a
  // real, live Workday HCM connector -- see README/demo script for the
  // honest framing before presenting this as "Workday Adaptive Planning live".
  workday_adaptive: {
    dashboardUrl: 'https://fivetran.com/dashboard/connections/usual_asthma/status?groupId=fortitude_fawn&service=workday_hcm',
    status: 'Workday HCM (live proof point), syncing',
  },
};
