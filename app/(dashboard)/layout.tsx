import { AdminSidebar } from "@/components/sidebar";
import { DashboardHeader } from "@/components/admin/header";

export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="dashboard-layout">
      <div className="dashboard" id="dashboard">
        <AdminSidebar />
        <div className="dashboard__container">
          <DashboardHeader />
          {children}
        </div>
      </div>
    </div>
  );
}
