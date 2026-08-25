import type { Metadata } from "next";
import { Suspense } from "react";

import { Dashboard, TableSkeleton } from "@/components/dashboard";
import { getDepartments, getShortRoles, getUsers } from "@/lib/api/me";
import { pageMetadata } from "@/lib/dashboard/navbar";
import { StaffUsers } from "./staff-users";

export const metadata: Metadata = pageMetadata("/users");

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
  const [users, departments, roles] = await Promise.all([
    getUsers(),
    getDepartments(),
    getShortRoles(),
  ]);

  return <StaffUsers users={users} departments={departments} roles={roles} />;
}
