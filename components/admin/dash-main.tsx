export function DashMain({
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
