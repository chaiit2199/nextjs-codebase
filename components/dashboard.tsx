export function Dashboard({
  id,
  children,
}: {
  id: string;
  children?: React.ReactNode;
}) {
  return (
    <main className="dash-main" id={id}>
      {children}
    </main>
  );
}

export function ComingSoon() {
  return <h2>Tính năng đang phát triển</h2>;
}

export function TableSkeleton() {
  return (
    <section className="admin-section">
      <div className="admin-table-card mb-6">
        <div className="overview-table-wrap h-64 animate-pulse rounded bg-black/5" />
      </div>
    </section>
  );
}
