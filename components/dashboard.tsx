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
        <div className="overview-table-wrap relative min-h-100 animate-pulse">
          <div className="loading show">
            <div className="loading-inner">
              <h2 className="loader">Đang tải dữ liệu...</h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
