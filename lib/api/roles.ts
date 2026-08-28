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
import { client, HttpError } from "@/lib/http/client";
import type { RolePermissionsResponse, RolesResponse, ScopeTarget, ScopeTargetsResponse } from "@/lib/api/types";

export type { CreateRoleInput, UpdateRoleInput };

export type FilterRolesParams = {
  search?: string;
  status?: number;
  page?: number;
  page_size?: number;
};

const SCOPE_TARGET_PATHS: Record<string, string> = {
  WAREHOUSE: "warehouses",
  AGENCY: "agencies",
};

export async function createRole(payload: CreateRoleInput) {
  return runServerAction(createRoleSchema, payload, "Không thể tạo nhóm quyền", async (params) => {
    await client.post("/api/v1/roles", params);
    revalidatePath("/role");
    return { ok: true as const };
  });
}

export async function updateRole(payload: UpdateRoleInput) {
  return runServerAction(updateRoleSchema, payload, "Không thể cập nhật nhóm quyền", async (params) => {
    const { id, name, description, remove, upsert } = params;

    await client.patch(`/api/v1/roles/${id}/permissions`, {
      remove,
      upsert,
    });
    
    revalidatePath("/role");
    return { ok: true as const };
  });
}

export async function fetchRolePermissions(roleId: number) {
  await requireCurrentUser();
  return (await client.get<RolePermissionsResponse>(`/api/v1/roles/${roleId}/permissions`)).data;
}

export async function fetchScopeTargets(scopeType: string): Promise<ScopeTarget[]> {
  const path = SCOPE_TARGET_PATHS[String(scopeType).toUpperCase()];
  if (!path) return [];

  await requireCurrentUser();

  try {
    return (await client.get<ScopeTargetsResponse>(`/api/v1/${path}`)).data ?? [];
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) return [];
    throw error;
  }
}

export async function filterRoles(params: FilterRolesParams = {}) {
  console.log(params);
  const response = await client.get<RolesResponse>("/api/v1/roles", { params });
  return { ok: true as const, data: response.data, meta: response.meta };
}
 