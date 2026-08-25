"use client";

import { useEffect, useState } from "react";

import type { Department } from "@/lib/api/me";
import { subscribeHeaderAction } from "@/lib/dashboard/header-actions";
import { EditDepartmentComponent } from "./edit_department_component";
import { CreateDepartmentComponent } from "./create_department_component";

export function DepartmentsComponent({ departments }: { departments: Department[] }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    return subscribeHeaderAction("/department", (detail) => {
      if (detail.action === "create") setIsCreateOpen(true);
    });
  }, []);

  return (
    <>
      <EditDepartmentComponent departments={departments} />
      {isCreateOpen && <CreateDepartmentComponent onClose={() => setIsCreateOpen(false)} />}
    </>
  );
}
