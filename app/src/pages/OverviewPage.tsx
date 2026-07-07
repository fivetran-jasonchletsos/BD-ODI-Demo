import { FINDINGS, type Verification } from '../lib/findings';

const VERIFICATION_LABEL: Record<Verification, string> = {
  confirmed: 'Confirmed',
  inferred: 'Inferred',
  unverified: 'Not verified',
};

const VERIFICATION_CLASSES: Record<Verification, string> = {
  confirmed: 'bg-emerald-100 text-emerald-800',
  inferred: 'bg-amber-100 text-amber-800',
  unverified: 'bg-red-100 text-red-800',
};

const SHORT_METHOD: Record<(typeof FINDINGS)[number]['key'], string> = {
  salesforce: 'REST + Bulk API polling',
  coupa: 'REST API polling',
  monday: 'REST API polling',
  workday_adaptive: 'REST API polling, full re-import',
};

const SHORT_APPROACH: Record<(typeof FINDINGS)[number]['key'], string> = {
  salesforce: 'Azure Data Factory (ADF)',
  coupa: 'Azure Data Factory (ADF)',
  monday: 'Custom API (in development)',
  workday_adaptive: 'Custom API (in development)',
};

const SHORT_PAIN: Record<(typeof FINDINGS)[number]['key'], string> = {
  salesforce: 'latency on some tables; Lakeflow Connect had limitations',
  coupa: 'wants near-real-time, not batch',
  monday: 'wants a managed alternative',
  workday_adaptive: 'wants a managed alternative',
};

const SHORT_SYNC: Record<(typeof FINDINGS)[number]['key'], string> = {
  salesforce: '1 min (Enterprise/BC plan)',
  coupa: '1 min (Enterprise/BC plan)',
  monday: '5 min',
  workday_adaptive: 'not verified',
};

const UNVERIFIED_NOTE: Partial<Record<(typeof FINDINGS)[number]['key'], string>> = {
  workday_adaptive: "Fivetran doesn't publish one — every sync is a full re-import, not incremental.",
};

export default function OverviewPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Evaluating Fivetran against BD's current ingestion for Salesforce, Coupa, monday.com, and Workday
          Adaptive Planning. Every figure below is sourced from Fivetran's docs; see the Connectors page for links.
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
                <dt className="font-medium text-slate-500">Today</dt>
                <dd className="mt-0.5 text-slate-800">{SHORT_APPROACH[f.key]} — {SHORT_PAIN[f.key]}</dd>
              </div>
              <div className="rounded-md bg-navy-50 p-3">
                <dt className="font-medium text-navy-700">With Fivetran</dt>
                <dd className="mt-1 text-navy-900">
                  <span className="font-semibold text-orange-600">{SHORT_SYNC[f.key]}</span> · {SHORT_METHOD[f.key]}
                </dd>
                {UNVERIFIED_NOTE[f.key] && (
                  <dd className="mt-1 text-xs text-slate-500">{UNVERIFIED_NOTE[f.key]}</dd>
                )}
              </div>
            </dl>
          </article>
        ))}
      </section>
    </div>
  );
}
