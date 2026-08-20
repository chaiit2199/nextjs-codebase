import type { Metadata } from "next";

import { Dashboard } from "@/components/dashboard";
import { getDepartments } from "@/lib/api/me";
import { DepartmentsComponent } from "@/components/departments/departments_component";

export const metadata: Metadata = { title: "Phòng ban" };

export default async function DepartmentsPage() {
  const departments = await getDepartments();

  return (
    <Dashboard id="departments-main">
      <DepartmentsComponent departments={departments} />
    </Dashboard>
  );
}
