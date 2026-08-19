"use server";

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
    console.log(error);
    const message =
      error instanceof HttpError ? error.message : "Không thể đổi mật khẩu";
    return { ok: false as const, message };
  }
}
