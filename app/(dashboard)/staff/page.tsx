import type { Metadata } from "next";

import { Dashboard } from "@/components/dashboard";

import { getDepartments, getUsers } from "@/lib/api/me";
import { StaffUsers } from "./staff-users";

export const metadata: Metadata = { title: "Nhân viên" };

export default async function StaffPage() {
  const [users, departments] = await Promise.all([getUsers(), getDepartments()]);

  return (
    <Dashboard id="admin-main">
      <StaffUsers users={users} departments={departments} />
    </Dashboard>
  );
}

