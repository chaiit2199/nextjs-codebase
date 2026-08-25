"use client";

import { useEffect, useState } from "react";

import type { Department, ShortRole, User } from "@/lib/api/me";
import { UsersComponent } from "@/components/users/users_component";
import { subscribeHeaderAction } from "@/lib/dashboard/header-actions";
import { CreateUserComponent } from "@/components/users/create_user_component";

export function StaffUsers({ users, departments, roles }: {
  users: User[];
  departments: Department[];
  roles: ShortRole[];
}) {
    const [search, setSearch] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const q = search.trim().toLowerCase();
    const filteredUsers = q
      ? users.filter((user) =>
          [user.full_name, user.username, user.phone, user.email, user.department?.name]
            .join(" ").toLowerCase().includes(q))
      : users;

    useEffect(() => {
        return subscribeHeaderAction("/user", (detail) => {
          if (detail.action === "create") setIsCreateOpen(true);
          if (detail.action === "search") setSearch(detail.query ?? "");
        });
    }, []);

  return (
    <>
        <UsersComponent users={filteredUsers} departments={departments} />
            {isCreateOpen && (
                <CreateUserComponent
                departments={departments}
                roles={roles}
                onClose={() => setIsCreateOpen(false)}
            />
        )}
    </>
  );
}
