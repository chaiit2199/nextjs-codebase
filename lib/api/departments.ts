"use server";

import { revalidatePath } from "next/cache";
import { client, HttpError } from "@/lib/http/client";

export type CreateDepartmentInput = {
  code: string;
  name: string;
  status?: string;
};

export async function createDepartment(payload: CreateDepartmentInput) {
  try {
    await client.post("/api/v1/departments", payload);
    revalidatePath("/departments");
    return { ok: true as const };
  } catch (error) {
    const message =
      error instanceof HttpError ? error.message : "Không thể tạo phòng ban";
    return { ok: false as const, message };
  }
}

export type UpdateDepartmentInput = {
  id: number;
  code?: string;
  name?: string;
  status?: string;
};

export async function updateDepartment(payload: UpdateDepartmentInput) {
  const { id, ...body } = payload;

  try {
    await client.put(`/api/v1/departments/${id}`, body);
    revalidatePath("/departments");
    return { ok: true as const };
  } catch (error) {
    const message =
      error instanceof HttpError ? error.message : "Không thể cập nhật phòng ban";
    return { ok: false as const, message };
  }
}
