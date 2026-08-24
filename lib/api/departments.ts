"use server";

import { revalidatePath } from "next/cache";

import {
  createDepartmentSchema,
  updateDepartmentSchema,
  type CreateDepartmentInput,
  type UpdateDepartmentInput,
} from "@/lib/actions/validate-payload";
import { runServerAction } from "@/lib/actions/secure-action";
import { client } from "@/lib/http/client";

export type { CreateDepartmentInput, UpdateDepartmentInput };

export async function createDepartment(payload: CreateDepartmentInput) {
  return runServerAction(createDepartmentSchema, payload, "Không thể tạo phòng ban", async (input) => {
    await client.post("/api/v1/departments", input);
    revalidatePath("/departments");
    return { ok: true as const };
  });
}

export async function updateDepartment(payload: UpdateDepartmentInput) {
  return runServerAction(updateDepartmentSchema, payload, "Không thể cập nhật phòng ban", async (input) => {
    const { id, ...body } = input;
    await client.patch(`/api/v1/departments/${id}`, body);
    revalidatePath("/departments");
    return { ok: true as const };
  });
}
