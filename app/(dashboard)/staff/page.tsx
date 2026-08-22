import type { Metadata } from "next";
import { Suspense } from "react";

import { Dashboard } from "@/components/dashboard";
import { getDepartments, getShortRoles, getUsers } from "@/lib/api/me";
import { StaffUsers } from "./staff-users";

export const metadata: Metadata = { title: "Nhân viên" };

export default function StaffPage() {
  return (
    <Dashboard id="admin-main">
      <Suspense>
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
