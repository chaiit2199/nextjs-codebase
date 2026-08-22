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
