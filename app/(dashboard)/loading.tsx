import { Dashboard, TableSkeleton } from "@/components/dashboard";

export default function Loading() {
  return (
    <Dashboard id="loading">
      <TableSkeleton />
    </Dashboard>
  );
}
