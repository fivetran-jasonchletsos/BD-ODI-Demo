import type { SystemFinding } from './findings';

// Real, live Fivetran connectors stood up for the afternoon demo -- distinct
// from findings.ts, which is sourced purely from Fivetran's published docs.
// Filled in once infra/ is applied against the real destination; keys with
// no entry render no live link.
export const LIVE_CONNECTORS: Partial<Record<SystemFinding['key'], { dashboardUrl: string; status: string }>> = {};
