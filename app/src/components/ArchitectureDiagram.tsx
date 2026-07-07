import ArrowRight from './ArrowRight';

interface Pipeline {
  source: string;
  tool: string;
  destination: string;
}

const BEFORE_PIPELINES: Pipeline[] = [
  { source: 'Salesforce', tool: 'Azure Data Factory', destination: 'Destination A' },
  { source: 'Coupa', tool: 'Azure Data Factory', destination: 'Destination B' },
  { source: 'monday.com', tool: 'Custom script (in dev)', destination: 'Destination C' },
  { source: 'Workday Adaptive Planning', tool: 'Custom script (in dev)', destination: 'Destination D' },
];

const AFTER_SOURCES = ['Salesforce', 'Coupa', 'monday.com', 'Workday Adaptive Planning'];

function Box({
  title,
  subtitle,
  tone = 'default',
}: {
  title: string;
  subtitle?: string;
  tone?: 'default' | 'navy' | 'orange';
}) {
  const toneClasses =
    tone === 'navy'
      ? 'border-navy-500 bg-navy-500 text-white'
      : tone === 'orange'
        ? 'border-orange-500 bg-orange-500 text-white'
        : 'border-slate-300 bg-white text-slate-800';

  return (
    <div className={`rounded-md border px-3 py-2 text-center text-xs font-medium leading-tight shadow-sm ${toneClasses}`}>
      <div className="font-semibold">{title}</div>
      {subtitle ? <div className="mt-0.5 text-[11px] font-normal opacity-90">{subtitle}</div> : null}
    </div>
  );
}

export function BeforeDiagram() {
  return (
    <div className="space-y-3">
      {BEFORE_PIPELINES.map((p) => (
        <div key={p.source} className="flex items-center gap-3">
          <div className="w-40 shrink-0">
            <Box title={p.source} />
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
          <div className="w-44 shrink-0">
            <Box title={p.tool} subtitle="maintained separately" />
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
          <div className="w-40 shrink-0">
            <Box title={p.destination} subtitle="own format / store" />
          </div>
        </div>
      ))}
      <p className="pt-1 text-xs text-slate-500">
        Four pipelines, four tools, four destinations -- each built, scheduled, and monitored independently.
      </p>
    </div>
  );
}

export function AfterDiagram() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-3">
        {AFTER_SOURCES.map((s) => (
          <div key={s} className="w-36">
            <Box title={s} />
          </div>
        ))}
      </div>
      <ArrowRight className="h-5 w-5 rotate-90 text-slate-400" />
      <div className="w-64">
        <Box title="4 Fivetran connectors" subtitle="one managed platform" tone="orange" />
      </div>
      <ArrowRight className="h-5 w-5 rotate-90 text-slate-400" />
      <div className="w-64">
        <Box title="Snowflake" subtitle="one consolidated destination" tone="navy" />
      </div>
      <ArrowRight className="h-5 w-5 rotate-90 text-slate-400" />
      <div className="w-64">
        <Box title="bd_pipeline (dbt)" subtitle="one transformation project" />
      </div>
      <ArrowRight className="h-5 w-5 rotate-90 text-slate-400" />
      <div className="w-64">
        <Box title="Dashboard" subtitle="one place to look" tone="orange" />
      </div>
    </div>
  );
}
