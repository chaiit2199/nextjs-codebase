import type { Metadata } from "next";

import { Dashboard } from "@/components/dashboard";
import { getRoles, getShortRoles } from "@/lib/api/me";
import { PermissionGroupsComponent } from "@/components/permission_groups/permission_groups_component";

export const metadata: Metadata = { title: "Nhóm quyền" };

export default async function PermissionGroupsPage() {
  const [ roles, shortRoles ] = await Promise.all([getRoles(), getShortRoles()]);

  return (
    <Dashboard id="permission-groups-main">
      <PermissionGroupsComponent roles={roles} shortRoles={shortRoles} />
    </Dashboard>
  );
}
