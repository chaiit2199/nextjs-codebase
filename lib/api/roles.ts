"use server";

import { revalidatePath } from "next/cache";

import { requireCurrentUser } from "@/lib/api/me";
import {
  createRoleSchema,
  updateRoleSchema,
  type CreateRoleInput,
  type UpdateRoleInput,
} from "@/lib/validate/roles";
import { runServerAction } from "@/lib/server-actions";
import { client } from "@/lib/http/client";
import type { PermissionsResponse } from "@/lib/api/types";

export type { CreateRoleInput, UpdateRoleInput };

export async function createRole(payload: CreateRoleInput) {
  return runServerAction(createRoleSchema, payload, "Không thể tạo nhóm quyền", async (params) => {
    await client.post("/api/v1/roles", params);
    revalidatePath("/permission-groups");
    return { ok: true as const };
  });
}

export async function updateRole(payload: UpdateRoleInput) {
  return runServerAction(updateRoleSchema, payload, "Không thể cập nhật nhóm quyền", async (params) => {
    const { id, name, description, remove, upsert } = params;

    await client.patch(`/api/v1/roles/${id}`, {
      name,
      description,
      remove,
      upsert,
    });
    
    revalidatePath("/permission-groups");
    return { ok: true as const };
  });
}

export async function fetchRolePermissions(roleId: number) {
  await requireCurrentUser();
  const test = await client.get<PermissionsResponse>(`/api/v1/roles/${roleId}/permissions`);
  console.log("test", test);
  return (await client.get<PermissionsResponse>(`/api/v1/roles/${roleId}/permissions`)).data;
}
