"use server";

import { revalidatePath } from "next/cache";

import {
  assignUserAccessSchema,
  changePasswordSchema,
  createUserSchema,
  updateUserSchema,
  type AssignUserAccessInput,
  type ChangePasswordInput,
  type CreateUserInput,
  type UpdateUserInput,
} from "@/lib/validate/users";
import { runServerAction } from "@/lib/server-actions";
import { client } from "@/lib/http/client";
import { requireCurrentUser } from "@/lib/api/me";
import type { UserAccessResponse } from "@/lib/api/types";

export type { CreateUserInput, UpdateUserInput, ChangePasswordInput, AssignUserAccessInput };

export async function createUser(payload: CreateUserInput) {
  return runServerAction(createUserSchema, payload, "Không thể tạo nhân viên", async (input) => {
    console.log(input);
    await client.post("/api/v1/users", input);
    revalidatePath("/user");
    return { ok: true as const };
  });
}

export async function changePassword(payload: ChangePasswordInput) {
  return runServerAction(changePasswordSchema, payload, "Không thể đổi mật khẩu", async (input) => {
    await client.post("/api/v1/me/change-password", input);
    return { ok: true as const };
  });
}

export async function updateUser(payload: UpdateUserInput) {
  return runServerAction(updateUserSchema, payload, "Không thể cập nhật nhân viên", async (input) => {
    const { id, ...body } = input;
    await client.patch(`/api/v1/users/${id}`, body);
    revalidatePath("/user");
    return { ok: true as const };
  });
}

export async function assignUserAccess(payload: AssignUserAccessInput) {
  return runServerAction(assignUserAccessSchema, payload, "Không thể cập nhật phân quyền", async (input) => {
    const { user_id, reason, permissions } = input;
    const body = { reason, permissions };
    await client.put(`/api/v1/users/${user_id}/roles`, body);
    revalidatePath("/authorization");
    return { ok: true as const };
  });
}

export async function fetchUserAccess(userId: number) {
  return (await client.get<UserAccessResponse>(`/api/v1/users/${userId}/access`)).data;
}
