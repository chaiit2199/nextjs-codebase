"use server";

import { revalidatePath } from "next/cache";

import {
  changePasswordSchema,
  createUserSchema,
  updateUserSchema,
  type ChangePasswordInput,
  type CreateUserInput,
  type UpdateUserInput,
} from "@/lib/validate/users";
import { runServerAction } from "@/lib/server-actions";
import { client } from "@/lib/http/client";

export type { CreateUserInput, UpdateUserInput, ChangePasswordInput };

export async function createUser(payload: CreateUserInput) {
  return runServerAction(createUserSchema, payload, "Không thể tạo nhân viên", async (input) => {
    await client.post("/api/v1/users", input);
    revalidatePath("/users");
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
    revalidatePath("/users");
    return { ok: true as const };
  });
}
