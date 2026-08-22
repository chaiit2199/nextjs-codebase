"use server";

import { revalidatePath } from "next/cache";

import { client, HttpError } from "@/lib/http/client";

export type CreateRoleInput = {
  code: string;
  name: string;
  description?: string;
  allowed_scope_types: number[];
  permission_codes: string[];
};

export type UpdateRoleInput = {
  id: number;
  name: string;
  description?: string;
  permission_codes: string[];
};

export async function createRole(payload: CreateRoleInput) {
  try {
    await client.post("/api/v1/roles", payload);
    revalidatePath("/permission-groups");
    return { ok: true as const };
  } catch (error) {
    const message =
      error instanceof HttpError ? error.message : "Không thể tạo nhóm quyền";
    return { ok: false as const, message };
  }
}

export async function updateRole(payload: UpdateRoleInput) {
  const { id, ...body } = payload;

  try {
    await client.patch(`/api/v1/roles/${id}`, body);
    revalidatePath("/permission-groups");
    return { ok: true as const };
  } catch (error) {
    const message =
      error instanceof HttpError ? error.message : "Không thể cập nhật nhóm quyền";
    return { ok: false as const, message };
  }
}
