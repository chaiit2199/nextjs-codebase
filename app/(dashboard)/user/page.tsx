import type { Metadata } from "next";
import { Suspense } from "react";

import { Dashboard, TableSkeleton } from "@/components/dashboard";
import { getDepartments } from "@/lib/api/me";
import { pageMetadata } from "@/lib/dashboard/navbar";
import { StaffUsers } from "./staff-users";

export const metadata: Metadata = pageMetadata("/user");

export default function StaffPage() {
  return (
    <Dashboard id="staff-main">
      <Suspense fallback={<TableSkeleton />}>
        <StaffData />
      </Suspense>
    </Dashboard>
  );
}

async function StaffData() {
  const departments = await getDepartments();

  return <StaffUsers departments={departments} />;
}
