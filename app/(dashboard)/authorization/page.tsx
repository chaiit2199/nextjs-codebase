import type { Metadata } from "next";

import { AuthorizationComponent } from "@/components/authorization/authorization_component";
import { Dashboard } from "@/components/dashboard";
import { pageMetadata } from "@/lib/dashboard/navbar";

export const metadata: Metadata = pageMetadata("/authorization");

export default function AuthorizationPage() {
  return (
    <Dashboard id="authorization-main">
      <AuthorizationComponent />
    </Dashboard>
  );
}
