import type { Metadata } from "next";
import { Suspense } from "react";

import { Dashboard, TableSkeleton } from "@/components/dashboard";
import { getRoles, getShortRoles } from "@/lib/api/me";
import { PermissionGroupsComponent } from "@/components/permission_groups/permission_groups_component";
import { pageMetadata } from "@/lib/dashboard/navbar";

export const metadata: Metadata = pageMetadata("/permission-groups");

export default function PermissionGroupsPage() {
  return (
    <Dashboard id="permission-groups-main">
      <Suspense fallback={<TableSkeleton />}>
        <RolesData />
      </Suspense>
    </Dashboard>
  );
}
async function RolesData() {
  const [roles, shortRoles] = await Promise.all([getRoles(), getShortRoles()]);
  return <PermissionGroupsComponent roles={roles} shortRoles={shortRoles} />;
}

