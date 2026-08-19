"use server";

import { client, HttpError } from "@/lib/http/client";

export type CreateUserInput = {
  full_name: string;
  username: string;
  password: string;
  phone: string;
  address: string;
};

export async function createUser(input: CreateUserInput) {
  try {
    await client.post("/api/v1/users", input);
    return { ok: true as const };
  } catch (error) {
    const message =
      error instanceof HttpError ? error.message : "Không thể tạo user";
    return { ok: false as const, message };
  }
}
