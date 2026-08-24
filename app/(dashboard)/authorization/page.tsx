import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthorizationComponent } from "@/components/authorization/authorization_component";
import { Dashboard, TableSkeleton } from "@/components/dashboard";
import { getUsers } from "@/lib/api/me";
import { pageMetadata } from "@/lib/dashboard/navbar";

export const metadata: Metadata = pageMetadata("/authorization");

export default function AuthorizationPage() {
  return (
    <Dashboard id="authorization-main">
      <Suspense fallback={<TableSkeleton />}>
        <AuthorizationData />
      </Suspense>
    </Dashboard>
  );
}

async function AuthorizationData() {
  const users = await getUsers();
  return <AuthorizationComponent users={users} />;
}
