import { NavLink, Outlet } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', label: 'Overview', end: true },
  { to: '/architecture', label: 'Architecture' },
  { to: '/connectors', label: 'Connectors' },
  { to: '/dashboard', label: 'Dashboard' },
];

function navLinkClasses({ isActive }: { isActive: boolean }): string {
  return [
    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive ? 'bg-orange-500 text-white' : 'text-navy-100 hover:bg-navy-700 hover:text-white',
  ].join(' ');
}

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="bg-navy-500">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded bg-white text-lg font-extrabold tracking-tight text-navy-500">
              BD
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-white">Fivetran ODI Demo</p>
              <p className="text-xs text-navy-200">Ingestion evaluation, prepared for BD</p>
            </div>
          </div>
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClasses}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-4 text-xs text-slate-500">
          Internal sales-engineering demo for Becton, Dickinson and Company (BD). Every Fivetran capability claim on
          the Overview and Connectors pages is sourced from Fivetran's published documentation; see the Source column
          on the Connectors page for links.
        </div>
      </footer>
    </div>
  );
}
