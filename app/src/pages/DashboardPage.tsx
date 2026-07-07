import { useMemo, type ReactNode } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useJson } from '../lib/useJson';
import type { BudgetVsActualRow, PipelineRow, ProjectStatusRow, SupplierSpendRow } from '../lib/types';

const CHART_COLORS = ['#194890', '#F07822', '#4c73ad', '#f7a768', '#8aa5cf', '#fac59a', '#0e2950', '#d3611a'];

function currency(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className="card p-5">
      <h2 className="text-base font-semibold text-navy-500">{title}</h2>
      {subtitle ? <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p> : null}
      <div className="mt-4 h-72">{children}</div>
    </section>
  );
}

function StatusPanel({ status }: { status: 'loading' | 'error'; message?: string }) {
  return (
    <div className="flex h-full items-center justify-center text-sm text-slate-400">
      {status === 'loading' ? 'Loading...' : 'Could not load data'}
    </div>
  );
}

export default function DashboardPage() {
  const pipeline = useJson<PipelineRow[]>('/data/fct_pipeline.json');
  const supplierSpend = useJson<SupplierSpendRow[]>('/data/fct_supplier_spend.json');
  const projectStatus = useJson<ProjectStatusRow[]>('/data/fct_project_status.json');
  const budgetVsActual = useJson<BudgetVsActualRow[]>('/data/fct_budget_vs_actual.json');

  const pipelineByStage = useMemo(() => {
    if (pipeline.status !== 'ready') return [];
    const totals = new Map<string, { stage: string; amount: number; count: number }>();
    for (const row of pipeline.data) {
      const entry = totals.get(row.stage_name) ?? { stage: row.stage_name, amount: 0, count: 0 };
      entry.amount += row.amount;
      entry.count += 1;
      totals.set(row.stage_name, entry);
    }
    return Array.from(totals.values()).sort((a, b) => b.amount - a.amount);
  }, [pipeline]);

  const spendByCategory = useMemo(() => {
    if (supplierSpend.status !== 'ready') return [];
    const totals = new Map<string, number>();
    for (const row of supplierSpend.data) {
      totals.set(row.supplier_category, (totals.get(row.supplier_category) ?? 0) + row.total_amount);
    }
    return Array.from(totals.entries())
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [supplierSpend]);

  const statusBreakdown = useMemo(() => {
    if (projectStatus.status !== 'ready') return [];
    const totals = new Map<string, number>();
    for (const row of projectStatus.data) {
      totals.set(row.status, (totals.get(row.status) ?? 0) + 1);
    }
    return Array.from(totals.entries()).map(([status, count]) => ({ status, count }));
  }, [projectStatus]);

  const budgetByAccountType = useMemo(() => {
    if (budgetVsActual.status !== 'ready') return [];
    const totals = new Map<string, { accountType: string; budget: number; forecast: number; actual: number }>();
    for (const row of budgetVsActual.data) {
      const entry = totals.get(row.account_type) ?? { accountType: row.account_type, budget: 0, forecast: 0, actual: 0 };
      entry.budget += row.budget_amount;
      entry.forecast += row.forecast_amount;
      entry.actual += row.actual_amount;
      totals.set(row.account_type, entry);
    }
    return Array.from(totals.values());
  }, [budgetVsActual]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Built from the four dbt marts (fct_pipeline, fct_supplier_spend, fct_project_status,
          fct_budget_vs_actual), exported as static JSON snapshots. In production these would refresh on each
          Fivetran sync + dbt run instead of being a point-in-time file.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Salesforce pipeline by stage" subtitle="Opportunity amount summed by stage_name">
          {pipeline.status !== 'ready' ? (
            <StatusPanel status={pipeline.status === 'error' ? 'error' : 'loading'} />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineByStage} layout="vertical" margin={{ left: 24, right: 16, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e6ef" horizontal={false} />
                <XAxis type="number" tickFormatter={(v: number) => currency(v)} fontSize={11} />
                <YAxis type="category" dataKey="stage" width={110} fontSize={11} />
                <Tooltip formatter={(v: number) => currency(v)} />
                <Bar dataKey="amount" fill="#194890" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Coupa spend by supplier category" subtitle="Purchase order total_amount summed by category">
          {supplierSpend.status !== 'ready' ? (
            <StatusPanel status={supplierSpend.status === 'error' ? 'error' : 'loading'} />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spendByCategory} margin={{ left: 8, right: 16, top: 8, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e6ef" vertical={false} />
                <XAxis dataKey="category" fontSize={10} angle={-25} textAnchor="end" interval={0} height={60} />
                <YAxis tickFormatter={(v: number) => currency(v)} fontSize={11} width={70} />
                <Tooltip formatter={(v: number) => currency(v)} />
                <Bar dataKey="amount" fill="#F07822" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="monday.com item status breakdown" subtitle="Item count by status">
          {projectStatus.status !== 'ready' ? (
            <StatusPanel status={projectStatus.status === 'error' ? 'error' : 'loading'} />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusBreakdown} dataKey="count" nameKey="status" outerRadius={90} label>
                  {statusBreakdown.map((entry, i) => (
                    <Cell key={entry.status} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard
          title="Budget vs. actual by account type"
          subtitle="Workday Adaptive Planning (budget/forecast) vs. actual, summed by account_type"
        >
          {budgetVsActual.status !== 'ready' ? (
            <StatusPanel status={budgetVsActual.status === 'error' ? 'error' : 'loading'} />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetByAccountType} margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e6ef" vertical={false} />
                <XAxis dataKey="accountType" fontSize={11} />
                <YAxis tickFormatter={(v: number) => currency(v)} fontSize={11} width={80} />
                <Tooltip formatter={(v: number) => currency(v)} />
                <Legend />
                <Bar dataKey="budget" name="Budget" fill="#8aa5cf" radius={[4, 4, 0, 0]} />
                <Bar dataKey="forecast" name="Forecast" fill="#F07822" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" name="Actual" fill="#194890" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    </div>
  );
}
