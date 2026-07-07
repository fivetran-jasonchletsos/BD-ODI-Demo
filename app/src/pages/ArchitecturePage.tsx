import { AfterDiagram, BeforeDiagram } from '../components/ArchitectureDiagram';

export default function ArchitecturePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Architecture</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          BD's four systems are ingested today through four separate approaches, each maintained on its own. This
          demo's proposal is not a new tool per system -- it's one platform: four Fivetran connectors landing in a
          single Snowflake destination, transformed by one dbt project, surfaced in one dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Before</h2>
          <p className="mt-1 text-xs text-slate-500">
            Four separate pipelines, each with its own tool, schedule, and destination.
          </p>
          <div className="mt-5">
            <BeforeDiagram />
          </div>
        </section>

        <section className="card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">After</h2>
          <p className="mt-1 text-xs text-slate-500">
            One managed ingestion layer, one destination, one transformation layer, one dashboard.
          </p>
          <div className="mt-5">
            <AfterDiagram />
          </div>
        </section>
      </div>
    </div>
  );
}
