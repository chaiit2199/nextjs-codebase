import type { Metadata } from "next";
import { Suspense } from "react";

import { Dashboard, TableSkeleton } from "@/components/dashboard";
import { getPermissions, getScopeTypes } from "@/lib/api/me";
import { PermissionGroupsComponent } from "@/components/permission_groups/permission_groups_component";
import { pageMetadata } from "@/lib/dashboard/navbar";

export const metadata: Metadata = pageMetadata("/permission");

export default function PermissionGroupsPage() {
  return (
    <Dashboard id="permission-main">
      <Suspense fallback={<TableSkeleton />}>
        <RolesData />
      </Suspense>
    </Dashboard>
  );
}
async function RolesData() {
  const [scopeTypes, permissions] = await Promise.all([getScopeTypes(), getPermissions()]);
  return <PermissionGroupsComponent scopeTypes={scopeTypes} permissions={permissions} />;
}

