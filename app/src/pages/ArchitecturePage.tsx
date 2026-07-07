import { ThreeZonePipeline, type SourceNode } from '../components/ThreeZonePipeline';
import { findingByKey } from '../lib/findings';

const SHORT_PAIN: Record<SourceNode['id'], string> = {
  salesforce: 'ADF, latency on some tables',
  coupa: 'ADF, wants near-real-time',
  monday: 'custom API (in dev)',
  workday_adaptive: 'custom API (in dev)',
};

const SHORT_SYNC: Record<SourceNode['id'], string> = {
  salesforce: '1 min (Enterprise/BC plan)',
  coupa: '1 min (Enterprise/BC plan)',
  monday: '5 min',
  workday_adaptive: 'not verified',
};

const SOURCES: SourceNode[] = (['salesforce', 'coupa', 'monday', 'workday_adaptive'] as const).map((key) => {
  const f = findingByKey(key);
  return {
    id: key,
    label: f.system,
    logo: key === 'workday_adaptive' ? 'workday' : key,
    currentApproach: f.currentApproach.replace(' (in development)', ''),
    currentPain: SHORT_PAIN[key],
    fivetranSyncLabel: SHORT_SYNC[key],
    syncConfidence: f.syncFrequencyVerification,
  };
});

const ROLES = [
  { label: 'Sales Ops', sub: 'pipeline & forecast' },
  { label: 'Procurement', sub: 'supplier spend' },
  { label: 'PMO', sub: 'project status' },
  { label: 'FP&A', sub: 'budget vs. actual' },
];

export default function ArchitecturePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Architecture</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          BD's four systems are ingested today through four separate approaches, each maintained on its own. This
          demo's proposal is not a new tool per system — it's one platform: four Fivetran connectors landing in a
          single Snowflake destination, transformed by one dbt project, surfaced in one dashboard.
        </p>
      </div>

      <div className="card p-6">
        <ThreeZonePipeline
          sources={SOURCES}
          raw={{ tables: 12, rows: 7155 }}
          staging={{ tables: 12, rows: 7155 }}
          marts={{ tables: 4, rows: 2812 }}
          roles={ROLES}
          dbtProjectName="bd_pipeline"
          destinationSchema="jason_chletsos_bd"
        />
      </div>
    </div>
  );
}
