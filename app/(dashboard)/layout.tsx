import { SidebarComponent } from "@/components/sidebar";
import { DashboardHeader } from "@/components/header";
import { getCurrentUser } from "@/lib/api/me";

export default async function DashboardLayout({ children }: LayoutProps<"/">) {
  const user = await getCurrentUser();

  return (
    <div className="dashboard-layout">
      <div className="dashboard" id="dashboard">
        <SidebarComponent user={user} />
        <div className="dashboard__container">
          <DashboardHeader />
          {children}
        </div>
      </div>
    </div>
  );
}
