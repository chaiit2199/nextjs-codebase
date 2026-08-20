import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard";

export const metadata: Metadata = { title: "Nhóm quyền" };

export default function Page() {
  return <Dashboard id="permission-groups-main" />;
}
