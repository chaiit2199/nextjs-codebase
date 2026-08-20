"use client";

import { useEffect, useState } from "react";

import type { Department, User } from "@/lib/api/me";
import { UsersComponent } from "@/components/users/users_component";
import { subscribeHeaderAction } from "@/lib/components/header-events";

export function StaffUsers({
  users,
  departments,
}: {
  users: User[];
  departments: Department[];
}) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // subscribe header actions
  useEffect(() => {
    return subscribeHeaderAction("/staff", (detail) => {
      if (detail.action === "create") setIsCreateOpen(true);
      if (detail.action === "filter") setIsFilterOpen(true);
      if (detail.action === "search") setSearchQuery(detail.query ?? "");
    });
  }, []);

  return (
    <UsersComponent
      users={users}
      departments={departments}
      isCreateOpen={isCreateOpen}
      isFilterOpen={isFilterOpen}
      searchQuery={searchQuery}
      onCreateClose={() => setIsCreateOpen(false)}
      onFilterClose={() => setIsFilterOpen(false)}
    />
  );
}
