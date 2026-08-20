import type { Metadata } from "next";

import { Dashboard } from "@/components/dashboard";
import { getRoles } from "@/lib/api/me";
import { PermissionGroupsComponent } from "@/components/permission_groups/permission_groups_component";

export const metadata: Metadata = { title: "Nhóm quyền" };

export default async function PermissionGroupsPage() {
  const roles = await getRoles();

  return (
    <Dashboard id="permission-groups-main">
      <PermissionGroupsComponent roles={roles} />
    </Dashboard>
  );
}
