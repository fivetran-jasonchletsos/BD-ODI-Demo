import { FINDINGS, type Verification } from '../lib/findings';

const VERIFICATION_LABEL: Record<Verification, string> = {
  confirmed: 'Confirmed',
  inferred: 'Inferred from platform policy',
  unverified: 'Not verified',
};

const VERIFICATION_CLASSES: Record<Verification, string> = {
  confirmed: 'bg-emerald-100 text-emerald-800',
  inferred: 'bg-amber-100 text-amber-800',
  unverified: 'bg-red-100 text-red-800',
};

export default function OverviewPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          This demo evaluates Fivetran against BD's current ingestion approach across four systems: Salesforce,
          Coupa, monday.com, and Workday Adaptive Planning. Each system today uses a different ingestion tool
          maintained separately (Azure Data Factory for two of them, custom in-house API code for the other two). The
          question this demo is built to answer is whether replacing those four separate approaches with four managed
          Fivetran connectors landing in one Snowflake destination reduces the latency, maintenance burden, and
          tooling sprawl BD has reported. Every sync-frequency and capability figure below is sourced from Fivetran's
          published documentation; where a figure could not be directly confirmed, the card says so.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {FINDINGS.map((f) => (
          <article key={f.key} className="card flex flex-col p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-semibold text-navy-500">{f.system}</h2>
              <span className={`badge shrink-0 ${VERIFICATION_CLASSES[f.syncFrequencyVerification]}`}>
                {VERIFICATION_LABEL[f.syncFrequencyVerification]}
              </span>
            </div>

            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="font-medium text-slate-500">Current approach</dt>
                <dd className="mt-0.5 text-slate-800">{f.currentApproach}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">Current pain (BD's reported experience)</dt>
                <dd className="mt-0.5 text-slate-800">{f.currentPain}</dd>
              </div>
              <div className="rounded-md bg-navy-50 p-3">
                <dt className="font-medium text-navy-700">Fivetran's verified capability</dt>
                <dd className="mt-1 text-navy-900">
                  <span className="font-semibold text-orange-600">{f.fastestSyncFrequency}</span> fastest sync
                  frequency. {f.fivetranSyncMethod}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </section>
    </div>
  );
}
