import { SidebarComponent } from "@/components/sidebar";
import { DashboardHeader } from "@/components/header";
import { getCurrentUserPermissions, requireCurrentUser,  } from "@/lib/api/me";

export default async function DashboardLayout({ children }: LayoutProps<"/">) {
  const [user, userPermissions] = await Promise.all([requireCurrentUser(), getCurrentUserPermissions()]);
  console.log("permissions", userPermissions);

  return (
    <div className="dashboard-layout">
      <div className="dashboard" id="dashboard">
        <SidebarComponent user={user} userPermissions={userPermissions.permissions} />
        <div className="dashboard__container">
          <DashboardHeader />
          {children}
        </div>
      </div>
    </div>
  );
}
