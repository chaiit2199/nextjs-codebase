"use client";

import { useEffect, useState } from "react";

import type { Department, Role, User } from "@/lib/api/me";
import { UsersComponent } from "@/components/users/users_component";
import { subscribeHeaderAction } from "@/lib/components/header-events";
import { CreateUserComponent } from "@/components/users/create_user_component";


export function StaffUsers({
  users,
  departments,
  roles,
}: {
  users: User[];
  departments: Department[];
  roles: Role[];
}) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // subscribe header actions
    useEffect(() => {
        return subscribeHeaderAction("/staff", (detail) => {
            if (detail.action === "create") setIsCreateOpen(true);
            if (detail.action === "search") setSearchQuery(detail.query ?? "");
        });
    }, []);

    return (
        <>
            <UsersComponent
                users={users}
                departments={departments}
            />

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
