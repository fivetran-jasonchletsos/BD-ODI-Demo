import { FINDINGS } from '../lib/findings';
import { LIVE_CONNECTORS } from '../lib/liveConnectors';

function labelForSourceUrl(url: string): string {
  if (url.includes('/core-concepts/syncoverview')) return 'Sync overview';
  const match = url.match(/\/connectors\/applications\/([^/]+)/);
  if (match) {
    if (match[1].toLowerCase() === 'monday.com') return 'monday.com connector docs';
    const slug = match[1]
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return `${slug} connector docs`;
  }
  return url.replace('https://', '');
}

export default function ConnectorsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Connectors</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Factual backbone for the sales conversation. Every cell traces back to Fivetran's published documentation
          -- follow the Source column to the underlying doc page. Fastest Sync Frequency figures marked "inferred"
          are derived from Fivetran's general platform policy (not a sentence written specifically about that
          connector); the Workday Adaptive Planning figure is marked "not verified" because no connector-specific
          minimum is published.
        </p>
      </div>

      <div className="card overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-navy-500 text-left text-xs font-semibold uppercase tracking-wide text-white">
            <tr>
              <th className="px-4 py-3">System</th>
              <th className="px-4 py-3">Current Approach</th>
              <th className="px-4 py-3">Current Pain</th>
              <th className="px-4 py-3">Fivetran Sync Method</th>
              <th className="px-4 py-3">Fastest Sync Frequency</th>
              <th className="px-4 py-3">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {FINDINGS.map((f) => (
              <tr key={f.key} className="align-top odd:bg-white even:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-navy-600">
                  {f.system}
                  <div className="mt-1 font-mono text-xs font-normal text-slate-400">service: {f.serviceIdentifier}</div>
                  {LIVE_CONNECTORS[f.key] && (
                    <a
                      href={LIVE_CONNECTORS[f.key]!.dashboardUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="badge mt-2 inline-flex items-center gap-1 bg-emerald-100 font-normal text-emerald-800 hover:bg-emerald-200"
                    >
                      Live in Fivetran &middot; {LIVE_CONNECTORS[f.key]!.status}
                    </a>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-700">{f.currentApproach}</td>
                <td className="px-4 py-3 text-slate-700">{f.currentPain}</td>
                <td className="px-4 py-3 text-slate-700">{f.fivetranSyncMethod}</td>
                <td className="px-4 py-3 text-slate-700">
                  <span className="font-semibold text-orange-600">{f.fastestSyncFrequency}</span>
                  <p className="mt-1 text-xs text-slate-500">{f.syncFrequencyNote}</p>
                </td>
                <td className="px-4 py-3">
                  <ul className="space-y-1">
                    {f.sourceUrls.map((url) => (
                      <li key={url}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-navy-500 underline underline-offset-2 hover:text-orange-600"
                        >
                          {labelForSourceUrl(url)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
