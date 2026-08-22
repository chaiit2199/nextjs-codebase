"use server";

import { revalidatePath } from "next/cache";

import {
  createRoleSchema,
  updateRoleSchema,
  type CreateRoleInput,
  type UpdateRoleInput,
} from "@/lib/actions/validate-payload";
import { runServerAction } from "@/lib/actions/secure-action";
import { client } from "@/lib/http/client";

export type { CreateRoleInput, UpdateRoleInput };

export async function createRole(payload: CreateRoleInput) {
  return runServerAction(createRoleSchema, payload, "Không thể tạo nhóm quyền", async (input) => {
    await client.post("/api/v1/roles", input);
    revalidatePath("/permission-groups");
    return { ok: true as const };
  });
}

export async function updateRole(payload: UpdateRoleInput) {
  return runServerAction(updateRoleSchema, payload, "Không thể cập nhật nhóm quyền", async (input) => {
    const { id, ...body } = input;
    await client.patch(`/api/v1/roles/${id}`, body);
    revalidatePath("/permission-groups");
    return { ok: true as const };
  });
}
