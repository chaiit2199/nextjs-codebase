import type { Metadata } from "next";

import { Dashboard } from "@/components/dashboard";
import { DepartmentsComponent } from "@/components/departments/departments_component";
import { pageMetadata } from "@/lib/dashboard/navbar";

export const metadata: Metadata = pageMetadata("/department");

export default function DepartmentsPage() {
  return (
    <Dashboard id="departments-main">
      <DepartmentsComponent />
    </Dashboard>
  );
}
