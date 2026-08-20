"use server";

import { revalidatePath } from "next/cache";
import { client, HttpError } from "@/lib/http/client";

export type CreateUserInput = {
  full_name: string;
  username: string;
  password: string;
  phone: string;
  address: string;
};

export async function changePassword(payload: {
  current_password: string;
  new_password: string;
}) {
  
  try {
    await client.post("/api/v1/me/change-password", payload);
    return { ok: true as const };
  } catch (error) {
    const message =
      error instanceof HttpError ? error.message : "Không thể đổi mật khẩu";
    return { ok: false as const, message };
  }
}

export type UpdateUserInput = {
  id: number;
  full_name?: string;
  phone?: string;
  address?: string;
  email?: string;
  status?: number;
  department?: number;
};

export async function updateUser(payload: UpdateUserInput) {
  const { id, ...body } = payload; 

  try {
    await client.patch(`/api/v1/users/${id}`, body);
    revalidatePath("/staff");
    return { ok: true as const };
  } catch (error) {
    const message =
      error instanceof HttpError ? error.message : "Không thể cập nhật nhân viên";
    return { ok: false as const, message };
  }
}