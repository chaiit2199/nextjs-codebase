import type { Metadata } from "next";
import { Suspense } from "react";

import { Dashboard, TableSkeleton } from "@/components/dashboard";
import { getDepartments } from "@/lib/api/me";
import { DepartmentsComponent } from "@/components/departments/departments_component";
import { pageMetadata } from "@/lib/dashboard/navbar";

export const metadata: Metadata = pageMetadata("/departments");

export default function DepartmentsPage() {
  return (
    <Dashboard id="departments-main">
      <Suspense fallback={<TableSkeleton />}>
        <DepartmentsData />
      </Suspense>
    </Dashboard>
  );
}
async function DepartmentsData() {
  const departments = await getDepartments();
  return <DepartmentsComponent departments={departments} />;
}

