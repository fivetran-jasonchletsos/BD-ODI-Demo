import { SOX_FRAMING, VENDOR_ATTESTATIONS, type ComplianceItem } from '../lib/compliance';

function ComplianceCard({ title, items }: { title: string; items: ComplianceItem[] }) {
  return (
    <div className="card p-5">
      <h2 className="text-lg font-semibold text-navy-500">{title}</h2>
      <dl className="mt-4 space-y-4">
        {items.map((item) => (
          <div key={item.label} className="border-t border-slate-100 pt-4 first:border-t-0 first:pt-0">
            <dt className="text-sm font-semibold text-slate-800">{item.label}</dt>
            <dd className="mt-1 text-sm leading-6 text-slate-600">{item.detail}</dd>
            <dd className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
              {item.sourceUrls.map((url) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-navy-500 underline underline-offset-2 hover:text-orange-600"
                >
                  {url.replace('https://', '')}
                </a>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function CompliancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">SOX Compliance</h1>
        <p className="mt-3 max-w-3xl text-sm font-semibold text-navy-600">{SOX_FRAMING.headline}</p>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{SOX_FRAMING.body}</p>
      </div>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <ComplianceCard title="Fivetran" items={VENDOR_ATTESTATIONS.fivetran} />
        <ComplianceCard title="dbt Labs" items={VENDOR_ATTESTATIONS.dbt_labs} />
      </section>
    </div>
  );
}
