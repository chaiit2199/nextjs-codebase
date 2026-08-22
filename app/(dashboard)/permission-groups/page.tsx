import type { Metadata } from "next";
import { Suspense } from "react";

import { Dashboard } from "@/components/dashboard";
import { getRoles, getShortRoles } from "@/lib/api/me";
import { PermissionGroupsComponent } from "@/components/permission_groups/permission_groups_component";

export const metadata: Metadata = { title: "Nhóm quyền" };

export default function PermissionGroupsPage() {
  return (
    <Dashboard id="permission-groups-main">
      <Suspense>
        <RolesData />
      </Suspense>
    </Dashboard>
  );
}

async function RolesData() {
  const [roles, shortRoles] = await Promise.all([getRoles(), getShortRoles()]);
  return <PermissionGroupsComponent roles={roles} shortRoles={shortRoles} />;
}
