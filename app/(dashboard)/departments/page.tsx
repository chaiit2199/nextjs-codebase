import type { Metadata } from "next";
import { Suspense } from "react";

import { Dashboard } from "@/components/dashboard";
import { getDepartments } from "@/lib/api/me";
import { DepartmentsComponent } from "@/components/departments/departments_component";

export const metadata: Metadata = { title: "Phòng ban" };

export default function DepartmentsPage() {
  return (
    <Dashboard id="departments-main">
      <Suspense>
        <DepartmentsData />
      </Suspense>
    </Dashboard>
  );
}

async function DepartmentsData() {
  const departments = await getDepartments();
  return <DepartmentsComponent departments={departments} />;
}
