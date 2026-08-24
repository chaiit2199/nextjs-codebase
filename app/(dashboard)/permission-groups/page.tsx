import type { Metadata } from "next";
import { Suspense } from "react";

import { Dashboard, TableSkeleton } from "@/components/dashboard";
import { getPermissions, getRoles, getScopeTypes } from "@/lib/api/me";
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
  const [roles, scopeTypes, permissions] = await Promise.all([getRoles(), getScopeTypes(), getPermissions()]);
  return <PermissionGroupsComponent roles={roles} scopeTypes={scopeTypes} permissions={permissions} />;
}

