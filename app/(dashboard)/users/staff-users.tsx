"use client";

import { useEffect, useState } from "react";

import type { Department, ShortRole, User } from "@/lib/api/me";
import { UsersComponent } from "@/components/users/users_component";
import { subscribeHeaderAction } from "@/lib/dashboard/header-actions";
import { CreateUserComponent } from "@/components/users/create_user_component";

export function StaffUsers({
  users,
  departments,
  roles,
}: {
  users: User[];
  departments: Department[];
  roles: ShortRole[];
}) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    useEffect(() => {
        return subscribeHeaderAction("/users", (detail) => {
        if (detail.action === "create") setIsCreateOpen(true);
        });
    }, []);

  return (
    <>
        <UsersComponent users={users} departments={departments} />
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
