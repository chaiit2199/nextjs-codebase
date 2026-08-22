import { Suspense } from "react";

import { SidebarComponent } from "@/components/sidebar";
import { DashboardHeader } from "@/components/header";
import { getCurrentUser } from "@/lib/api/me";

async function SidebarUser() {
  const user = await getCurrentUser();
  return <SidebarComponent user={user} />;
}

export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="dashboard-layout">
      <div className="dashboard" id="dashboard">
        <Suspense fallback={<SidebarComponent />}>
          <SidebarUser />
        </Suspense>
        <div className="dashboard__container">
          <DashboardHeader />
          {children}
        </div>
      </div>
    </div>
  );
}
