import type { Metadata } from "next";

import { DashMain } from "@/components/admin/dash-main";

import { getDepartments, getUsers } from "@/lib/api/me";
import { UsersTable } from "@/components/users/users_table";

export const metadata: Metadata = { title: "Nhân viên" };

export default async function AdminPage() {
  const [users, departments] = await Promise.all([getUsers(), getDepartments()]);

  return (
    <DashMain id="admin-main">
      <UsersTable users={users} departments={departments} />
    </DashMain>
  );
}

